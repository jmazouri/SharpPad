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

You can also dump raw HTML with the `DumpHtml` method. Useful for specialized output formatting, testing HTML templating, or just embedding gifs.

## How it Works

SharpPad runs a listening HTTP server in your editor. When you call `Dump()` from your code, a request is made to this webserver containing the serialized form of your data. The extension formats this request, and presents it.

This means SharpPad requires an open port on your machine - it defaults to `5255`, and can be adjusted in VSCode via the `sharppad.listenServerPort` configuration option, and in your code via the static `SharpPad.Output.Port` property.

## Troubleshooting/Notes

SharpPad, by default, uses its own static HttpClient instance and is entirely asynchronous. If you're using the newer versions of Roslyn, you can switch your project to C# 7.1 to take advantage of `async Main` for smaller/test projects. If you really need a synchronous version, `DumpBlocking` is available - but not recommended.

If you'd like to use SharpPad as an output window for your program without running it through VSCode, use the `Show SharpPad` command from the Command Palette.

## Release Notes

### 1.0.6 (Prerelease)

- Initial implementation of raw HTML support on server (thanks @EdonGashi !)
- Added more base themes
    - Monokai and Solarized Light
    - Extracted some base theme variables into a separate file for convenience
- Added new option for zoom level - `sharppad.zoomLevel`
    - Can set to any value, in percentage format
    - Independent + stacks with VSCode zoom level
    - Useful for presentations and demos

### 1.0.5

- Added custom theme support 
    - Set your `sharppad.customThemePath` setting to the URI to a css file
        - Needs `file:///` prefix for local files
    - Overrides dark/light setting, but falls back to those values for anything missing (as CSS does)
    - See resources/themes/dark.css and light.css for examples
- Added new option for display format - `sharppad.dumpDisplayStyle`
    - Full (existing functionality), and single-line
    - Useful for console-like, condensed output
- Added ability to disable type name display
- Some small display and output fixes

### 1.0.0

- Initial release

## Hopeful Features

- Better ValueTuple support (if possible)
- More language-agnostic implementation (to support non-CLR languages)
- More Dump options/inputs