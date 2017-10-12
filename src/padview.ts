'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import IFormatProvider from './formatters/IFormatProvider'
import RawFormatProvider from './formatters/RawFormatProvider';

export default class PadViewContentProvider implements vscode.TextDocumentContentProvider
{
    private _formatters: Array<IFormatProvider> = [];
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    get onDidChange(): vscode.Event<vscode.Uri>
    {
        return this._onDidChange.event;
    }

    public add(formatter: IFormatProvider)
    {
        this._formatters.push(formatter);
    }

    public update(uri: vscode.Uri)
    {
        this._onDidChange.fire(uri);
    }

    public addAndUpdate(uri: vscode.Uri, formatter: IFormatProvider)
    {
        this.add(formatter);
        this.update(uri);
    }

    public clear(uri: vscode.Uri, message: string = "")
    {
        if (message)
        {
            this._formatters = [new RawFormatProvider(message)];
        }
        else
        {
            this._formatters = [];
        }

        this.update(uri);
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>
    {
        let builder = "";

        for (let formatter of this._formatters)
        {
            builder += formatter.formatToHtml();
            builder += "<hr>";
        }
        
        return builder;
    }
}
