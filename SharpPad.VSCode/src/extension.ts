'use strict';

import * as vscode from 'vscode';
import DataFormatter from './formatters/DataFormatter'
import SharpPadServer from './SharpPadServer'
import Config from './Config'
import { EventEmitter } from 'events';

import PadViewContentProvider from './padview';

const events = new EventEmitter();

let provider = new PadViewContentProvider();
let previewUri = vscode.Uri.parse('sharppad://authority/sharppad');

let config: Config;
let server: SharpPadServer;

function showWindow(success = (_) => {})
{
    vscode.commands
        .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'SharpPad')
        .then(success, (reason) => vscode.window.showErrorMessage(reason));
    events.emit('showWindow');
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
    
    provider.setTheme(previewUri, config.theme, config.customThemePath);
    provider.port = config.listenServerPort;
    provider.scrollToBottom = config.autoScrollToBottom;
    
    server = new SharpPadServer
    (
        config.listenServerPort, 
        dump => 
        {   
            provider.addAndUpdate(previewUri, DataFormatter.getFormatter(dump));
            events.emit('dump', dump);
            
            /*
                If the debugger is running, try to show a new SharpPad window when
                we get a new dump request. We don't do this every time because VSCode
                will blindly create duplicate windows.
            */
            if (vscode.debug.activeDebugSession !== undefined)
            {
                showWindow();
            }
        },
        clear => {
            provider.clear(previewUri);
            events.emit('clear');
        }
    );
}

function restartServer()
{
    if (server)
    {
        server.close(done => startServer());
    }
}

export function activate(context: vscode.ExtensionContext)
{
    console.log('Congratulations, your extension "sharppad" is now active!');
    
    startServer();

    //clear the window when a new debug session starts
    vscode.debug.onDidStartDebugSession(session =>
    {
        provider.clear(previewUri, "Waiting for dump output...");
    });

    //Restart the server when the config changes - to catch the new port number
    vscode.workspace.onDidChangeConfiguration(params =>
    {
        restartServer();
    });
    
    //Register the command to manually show the SharpPad window, for arbitrary dumping
    var disposable = vscode.commands.registerCommand('sharppad.showSharpPad', () =>
    {
        showWindow();
    });

    let registration = vscode.workspace.registerTextDocumentContentProvider('sharppad', provider);

    context.subscriptions.push(registration, disposable);

    return {
      showWindow: () => {
        showWindow();
      },
      
      dump: (data) => {
        provider.addAndUpdate(previewUri, DataFormatter.getFormatter(data));
      },

      clear: () => {
        provider.clear(previewUri);
      },

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
}