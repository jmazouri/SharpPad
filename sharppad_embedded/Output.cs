using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SharpPad
{
    public static class Output
    {
        private static readonly JsonSerializerSettings Settings;
        public static int Port { get; set; } = 5255;

        static Output()
        {
            Settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                NullValueHandling = NullValueHandling.Include,
                TypeNameHandling = TypeNameHandling.All
            };

            Settings.Converters.Add(new StringEnumConverter());
        }

        /// <summary>
        /// Dumps to the output window.
        /// </summary>
        public static async Task Dump<T>(this T input)
        {
            string serialized;

            if (input.GetType().IsValueType)
            {
                serialized = JsonConvert.SerializeObject(new RawValueContainer(input), Settings);
            }
            else
            {
                serialized = JsonConvert.SerializeObject(input, Settings);
            }

            var content = new StringContent(serialized);
            content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

            try
            {
                await HttpHelper.Client.PostAsync("http://localhost:" + Port, content);
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
        public static void DumpBlocking<T>(this T input)
        {
            Dump(input).GetAwaiter().GetResult();
        }
    }
}
