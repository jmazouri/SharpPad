'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Express from 'express';
import { Server } from 'http';
import DataFormatter from './formatters/DataFormatter'

import PadViewContentProvider from './padview';
let provider = new PadViewContentProvider();

const app: Express.Application = Express();
app.use((<any>Express).json());

let server: Server;

app.post('/', function (req, res)
{
    provider.addAndUpdate(previewUri, DataFormatter.getFormatter(req.body));

    res.status(200).end();
});

let previewUri = vscode.Uri.parse('sharppad://authority/sharppad');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sharppad" is now active!');

    server = app.listen(5255, function ()
    {
        console.log('Example app listening on port 5255!');
    });

    vscode.debug.onDidStartDebugSession(session =>
    {
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'SharpPad').then((success) =>{
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });

        provider.clear(previewUri, "Waiting for dump output...");
    });

    let stopDebug = vscode.debug.onDidTerminateDebugSession(session =>
    {
        /*
        if (!contentBuild)
        {
            provider.clear(previewUri, "No output captured.<br>Remember to install & use the <strong>SharpPad</strong> NuGet package.");
        }*/

        //provider.clear(previewUri);
    });

    let registration = vscode.workspace.registerTextDocumentContentProvider('sharppad', provider);

    context.subscriptions.push(registration);
}

// this method is called when your extension is deactivated
export function deactivate()
{
    if (server)
    {
        server.close();
    }
}