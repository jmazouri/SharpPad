using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace SharpPad
{
    public static class Output
    {
        private static readonly JsonSerializerSettings Settings;
        public static int Port { get; set; } = 5255;

        private static string Endpoint => $"http://localhost:{Port}";

        static Output()
        {
            Settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                NullValueHandling = NullValueHandling.Include,

                //Turn this on to get type names in our json
                TypeNameHandling = TypeNameHandling.All,
                //This is the default; but we want to be explicit
                TypeNameAssemblyFormatHandling = TypeNameAssemblyFormatHandling.Simple
            };

            //We want nice enum names in our json
            Settings.Converters.Add(new StringEnumConverter());
        }

        public static void RedirectConsoleOutput(bool redirect)
        {
            RedirectConsoleOutput(redirect, "Console Output");
        }

        public static void RedirectConsoleOutput(bool redirect, string title)
        {
            if (redirect)
            {
                Console.SetOut(new SharpPadTextWriter(title));
            }
            else
            {
                var standardOutput = new StreamWriter(Console.OpenStandardOutput())
                {
                    AutoFlush = true
                };

                Console.SetOut(standardOutput);
            }
        }

        /// <summary>
        /// Dump a ValueTuple with correct field names to the output window.
        /// </summary>
        /// <param name="input">The method that returns the tuple to dump.</param>
        public static async Task DumpTuple<T>(Func<T> input) where T : struct
        {
            //I hate ValueTuples
            var tupleResult = input.Invoke();

            var tupleNames = input.GetMethodInfo().ReturnParameter.GetCustomAttribute<TupleElementNamesAttribute>().TransformNames;
            var tupleFields = tupleResult.GetType().GetRuntimeFields().ToArray();

            JObject tupleObject = new JObject
            {
                //Serialize the object then re-parse it to capture Json.Net's cleaned up type names
                ["$type"] = JObject.Parse(JsonConvert.SerializeObject(tupleResult, Settings))["$type"]
            };

            for (int i = 0; i < tupleNames.Count; i++)
            {
                string name = (tupleNames[i] ?? $"Item{i + 1}");
                
                if (i < tupleFields.Length)
                {
                    tupleObject[name] = JToken.Parse(JsonConvert.SerializeObject(tupleFields[i].GetValue(tupleResult), Settings));
                }
            }

            await DumpInternal(tupleObject, null, false);
        }

        /// <summary>
        /// Dumps to the output window.
        /// </summary>
        public static async Task Dump<T>(this T input, string title = null)
        {
            await DumpInternal(input, title, true);
        }

        public static async Task DumpHtml(this string html, string title = null)
        {
            await DumpInternal(html, title, false, "html");
        }

        /// <summary>
        /// Clears the output window.
        /// </summary>
        /// <returns></returns>
        public static async Task Clear()
        {
            await MakeHttpRequest(client => client.GetAsync($"{Endpoint}/clear"));
        }

        internal static async Task DumpInternal(object input, string title, bool withStackTrace, string rawType = null)
        {
            string serialized;

            if (rawType != null)
            {
                Dictionary<string, string> rawData = new Dictionary<string, string>
                {
                    ["$type"] = rawType,
                    ["$html"] = input.ToString()
                };

                input = JObject.FromObject(rawData);
            }

            serialized = JsonConvert.SerializeObject(new DumpContainer
            {
                Title = title,
                Value = input,
                Source = (withStackTrace ? await GetStackTrace() : null)
            }, Settings);

            await SendContent(serialized);
        }
        
        private static async Task<string> GetStackTrace()
        {
            var trace = new StackTrace(true);
            var filteredFrames = trace.GetFrames().SkipWhile(d => d.GetMethod().Name != "Dump");
            var targetFrame = filteredFrames.Skip(1).FirstOrDefault();

            if (targetFrame == null || targetFrame.GetFileName() == null)
            {
                return null;
            }

            try
            {
                using (var fileStream = File.OpenText(targetFrame.GetFileName()))
                {
                    string codeLine = null;
                    int lineNum = targetFrame.GetFileLineNumber();

                    for (int i = 0; i < lineNum; i++)
                    {
                        codeLine = await fileStream.ReadLineAsync();
                    }

                    int dumpMethodIndex = codeLine.IndexOf(".Dump");

                    if (dumpMethodIndex > -1)
                    {
                        return codeLine.Substring(0, dumpMethodIndex).Replace("await ", "").Trim();
                    }
                }                
            }
            catch (Exception ex) when
            (
                ex is IOException ||
                ex is NotSupportedException || 
                ex is UnauthorizedAccessException
            )
            {
                Console.WriteLine($"Couldn't open stack trace for file \"{targetFrame.GetFileName()}\"");
                return null;
            }

            return null;
        }

        private static async Task SendContent(string serialized)
        {
            var content = new StringContent(serialized);
            content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

            await MakeHttpRequest(client => client.PostAsync(Endpoint, content));
        }

        private static async Task MakeHttpRequest(Func<HttpClient, Task> request)
        {
            try
            {
                await request.Invoke(HttpHelper.Client);
            }
            catch (HttpRequestException)
            {
                string msg = $"Unable to contact local SharpPad server. Please ensure \"Output.Port\" is correct (currently {Port}).";
                Console.WriteLine(msg);

                throw;
            }   
        }

        /// <summary>
        /// Synchronously dumps to the output window.
        /// </summary>
        /// <remarks>Calls GetAwaiter().GetResult() on the async method. Not recommended.</remarks>
        [Obsolete("Only use this method if you absolutely have to - use DumpAsync otherwise.")]
        public static void DumpBlocking<T>(this T input, string title = null)
        {
            DumpInternal(input, title, true).GetAwaiter().GetResult();
        }
    }
}
