import * as vscode from 'vscode';
import DataFormatter from './formatters/DataFormatter'
import SharpPadServer from './SharpPadServer'
import Config from './Config'
import { EventEmitter } from 'events';

import PadViewRenderer from './PadViewRenderer';
import DumpContainer from './DumpContainer';

const events = new EventEmitter();

let renderer = new PadViewRenderer();
let panel: vscode.WebviewPanel | null = null;

let config: Config;
let server: SharpPadServer;

function showWindow(raiseEvent = true)
{
    try
    {
        if (panel == null)
        {
            panel = vscode.window.createWebviewPanel('sharppad', 'SharpPad', vscode.ViewColumn.Beside, 
            {
                enableFindWidget: true,
                enableScripts: true
            });

            panel.onDidDispose(() => panel = null);
        }
    }
    catch (err)
    {
        vscode.window.showErrorMessage(err);
    }

    if (raiseEvent)
    {
        events.emit('showWindow');
    }

    updatePanel();
}

function loadConfig()
{
    config = new Config(vscode.workspace.getConfiguration('sharppad'));
}

function startServer()
{
    loadConfig();

    DataFormatter.typeNameStyle = config.typeNameStyle;
    DataFormatter.dumpSourceStyle = config.dumpSourceStyle;
    DataFormatter.showTimeOnDumps = config.showTimeOnDumps;
    DataFormatter.dumpDisplayStyle = config.dumpDisplayStyle;
    
    try
    {
        renderer.setConfig(config);
    }
    catch (err)
    {
        vscode.window.showErrorMessage(`Couldn't load custom SharpPad theme at "${config.customThemePath}"`);
    }

    server = new SharpPadServer
    (
        config.listenServerPort, 
        dump => 
        {   
            dumpInternal(dump, true, true);
            
            if (panel == null)
            {
                showWindow();
            }
            else
            {
                panel.reveal(vscode.ViewColumn.Beside, true);
            }
        },
        () =>
        {
            clearInternal(true, true, ' ');
        }
    );
}

function restartServer()
{
    if (server)
    {
        server.close(() => startServer());
    }
}

function updatePanel()
{
    if (panel)
    {
        panel.webview.html = renderer.render();
    }
}

function dumpInternal(dump: DumpContainer, update: boolean = true, raiseEvent: boolean = false)
{
    renderer.add(DataFormatter.getFormatter(dump));

    if (update)
    {
        updatePanel();
    }

    if (raiseEvent)
    {
        events.emit('dump', dump);
    }
}

function clearInternal(update = true, raiseEvent = false, message = '')
{
    renderer.clear(message);

    if (update)
    {
        updatePanel();
    }

    if (raiseEvent)
    {
        events.emit('clear', message);
    }
};

export function activate(context: vscode.ExtensionContext)
{
    console.log('"SharpPad" is now active!');
    
    startServer();

    //clear the window when a new debug session starts
    vscode.debug.onDidStartDebugSession(session =>
    {
        console.log("Started Debugging");
        console.log(config);
        
        if (config.clearOnDebugStart)
        {
            renderer.clear("Waiting for dump output...");
        }
    });

    //Restart the server when the config changes - to catch the new port number
    vscode.workspace.onDidChangeConfiguration(params =>
    {
        restartServer();
    });
    
    //Register the command to manually show the SharpPad window, for arbitrary dumping
    var disposable = vscode.commands.registerCommand('sharppad.showSharpPad', () =>
    {
        showWindow(true);
    });

    return {
        showWindow: showWindow,
        dump: dumpInternal,
        clear: clearInternal,
        update: updatePanel,
        
        events
    }

    //vscode.debug.startDebugging(vscode.workspace.workspaceFolders[0], ".NET Core Launch (console)");
}

// this method is called when your extension is deactivated
export function deactivate()
{
    if (server)
    {
        server.close();
    }

    if (panel)
    {
        panel.dispose();
    }
}