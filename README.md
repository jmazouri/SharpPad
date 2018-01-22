# SharpPad

SharpPad is an extension for Visual Studio Code that allows you easily inspect the results of your code. It works similarly to standalone tools like LinqPad and RoslynPad. 

![Example](https://i.imgur.com/geOXysP.png)

## How to Use

Install the extension via [the VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=jmazouri.sharppad), then install the `SharpPad` package into your project via NuGet. Throw in a `using SharpPad;` at the start of your class, and `Dump()` away!

If you're using the `dotnet` CLI, you can also install & use the SharpPad template from NuGet by running the following commands:

```bash
# install the template
dotnet new -i SharpPad.Template

# create a new folder for your project 
mkdir test && cd test

# create a project from the template 
dotnet new sharppad
```

## Features

Dump nearly anything!

- Classes
- Structs
- Anonymous Types
- ValueTuples*
- Regular Tuples
- Primitive Types
- Collections of the above

> *ValueTuple support is still quite early; named tuple fields only work correctly at the first layer of nesting, and the special `DumpTuple` method is required for even that. Collections of named tuples are also not supported, and may never be.

## How it Works

SharpPad runs a listening HTTP server in your editor. When you call `Dump()` from your code, a request is made to this webserver containing the serialized form of your data. The extension formats this request, and presents it.

This means SharpPad requires an open port on your machine (though only on localhost) - it defaults to `5255`, and can be adjusted in VSCode via the `sharppad.listenServerPort` configuration option, and in your code via the static `SharpPad.Output.Port` property.

You can also have your console output redirect to SharpPad - just call `SharpPad.Output.RedirectConsoleOutput(true)`, and optionally add a second argument for title to separate console output from your other dumps.

If you'd like to clean the output window programmatically, call `SharpPad.Output.Clear()`.

## Troubleshooting/Notes

SharpPad, by default, uses its own static HttpClient instance and is entirely asynchronous. If you're using the newer versions of Roslyn, you can switch your project to C# 7.1 to take advantage of `async Main` for smaller/test projects. If you really need a synchronous version, `DumpBlocking` is available - but not recommended.

If you'd like to use SharpPad as an output window for your program without running it through VSCode, use the `Show SharpPad` command from the Command Palette.

## Release Notes

### 1.0.0

- Initial release

## Hopeful Features

- Better ValueTuple support (if possible)
- More language-agnostic implementation (to support languages other than C#)
- More Dump options/inputs
- Allow dumping raw HTML (works now but not intentionally)