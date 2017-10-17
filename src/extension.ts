'use strict';

import * as vscode from 'vscode';
import DataFormatter from './formatters/DataFormatter'
import SharpPadServer from './SharpPadServer'
import Config from './Config'

import PadViewContentProvider from './padview';

let provider = new PadViewContentProvider();
let previewUri = vscode.Uri.parse('sharppad://authority/sharppad');

let config: Config;
let server: SharpPadServer;

function showWindow(success = (_) => {})
{
    vscode.commands
        .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'SharpPad')
        .then(success, (reason) => vscode.window.showErrorMessage(reason));
}

function loadConfig()
{
    config = new Config(vscode.workspace.getConfiguration('sharppad'));
}

function startServer()
{
    server = new SharpPadServer(config.listenServerPort, dump => 
    {   
        provider.addAndUpdate(previewUri, DataFormatter.getFormatter(dump));
        
        if (vscode.debug.activeDebugSession !== undefined)
        {
            showWindow();
        }
    });
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

    loadConfig();
    startServer();

    vscode.debug.onDidStartDebugSession(session =>
    {
        provider.clear(previewUri, "Waiting for dump output...");
    });

    vscode.workspace.onDidChangeConfiguration(params =>
    {
        loadConfig();
        restartServer();
    });

    var disposable = vscode.commands.registerCommand('sharppad.showSharpPad', () =>
    {
        showWindow();
    });

    let registration = vscode.workspace.registerTextDocumentContentProvider('sharppad', provider);

    context.subscriptions.push(registration, disposable);

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