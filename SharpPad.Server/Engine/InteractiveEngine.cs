using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Dotnet.Script.Core;
using Dotnet.Script.DependencyModel.Context;
using Dotnet.Script.DependencyModel.Logging;
using Dotnet.Script.DependencyModel.NuGet;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.Scripting.Hosting;
using Microsoft.CodeAnalysis.Text;

namespace SharpPad.Server
{
    public class InteractiveEngine
    {
        private ScriptOptions _scriptOptions;
        private ScriptState _state;
        private ScriptCompiler _compiler;
        private ScriptCompilationContext<object> _context;
        private object Globals = new object();

        public IEnumerable<ScriptVariable> Variables =>
            _state?.Variables ?? Enumerable.Empty<ScriptVariable>();

        public object LastReturnValue =>
            _state?.ReturnValue;

        private static Dictionary<string, IReadOnlyList<string>> dict = 
            new Dictionary<string, IReadOnlyList<string>>();

        public string WorkingDir {get; set;}
         
        public InteractiveEngine()
        {
            WorkingDir = Directory.GetCurrentDirectory();
        }

        public async Task Execute(string script, CancellationToken token)
        {
            if (_context == null)
            {
                var context = new ScriptContext(SourceText.From(script), WorkingDir, 
                    Enumerable.Empty<string>(),scriptMode: ScriptMode.REPL,
                    packageSources: new string[] { "https://api.nuget.org/v3/index.json" });

                _compiler = new ScriptCompiler(LogHelper.CreateLogFactory("Verbose"), true);
                _context = _compiler.CreateCompilationContext<object, object>(context);
                _state = await _context.Script.RunAsync(Globals, ex => true, token);
                _scriptOptions = _context.ScriptOptions;
            }
            else
            {
                ResolveNugetPackages(script);
                _state = await _state.ContinueWithAsync(script, _scriptOptions, ex => true, token);
            }
        }

        private void ResolveNugetPackages(string input)
        {
            if (input.StartsWith("#r ") || input.StartsWith("#load "))
            {
                var lineRuntimeDependencies = _compiler.RuntimeDependencyResolver
                    .GetDependenciesForCode(WorkingDir, ScriptMode.REPL, new string[] { "https://api.nuget.org/v3/index.json" }, input).ToArray();

                var lineDependencies = lineRuntimeDependencies.SelectMany(rtd => rtd.Assemblies).Distinct();

                var scriptMap = lineRuntimeDependencies.ToDictionary(rdt => rdt.Name, rdt => rdt.Scripts);
                if (scriptMap.Count > 0)
                {
                    _scriptOptions =
                        _scriptOptions.WithSourceResolver(
                            new NuGetSourceReferenceResolver(
                                new SourceFileResolver(ImmutableArray<string>.Empty, WorkingDir), scriptMap));
                }
                foreach (var runtimeDependency in lineDependencies)
                {
                    //Logger.Debug("Adding reference to a runtime dependency => " + runtimeDependency);
                    _scriptOptions = _scriptOptions.AddReferences(MetadataReference.CreateFromFile(runtimeDependency.Path));
                }
            }
        }

        public void ClearState()
        {
            _state = null;
            _scriptOptions = null;
            _context = null;
        }
    }
}