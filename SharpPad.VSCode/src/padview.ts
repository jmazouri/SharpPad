'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {Theme} from './Config'

import IFormatProvider from './formatters/IFormatProvider'
import RawFormatProvider from './formatters/RawFormatProvider'
import ResourceLocator from './theming/ResourceLocator'
import { isNullOrUndefined } from 'util';

export default class PadViewContentProvider implements vscode.TextDocumentContentProvider
{
    private _formatters: Array<IFormatProvider> = [];
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private _stylesheets: string[] = [];
    private _scripts: string[] = [];

    private _defaultMessage = "";

    public port: Number;
    public scrollToBottom: Boolean;

    constructor()
    {
        this._scripts.push(ResourceLocator.getResource("collapser.js"));
    }

    public setTheme(uri: vscode.Uri, theme: Theme, customTheme: string)
    {
        this._stylesheets = [];

        this._stylesheets.push(ResourceLocator.getResource("themes", `${theme}.css`));
        this._stylesheets.push(ResourceLocator.getResource("theme.css"));

        if (!isNullOrUndefined(customTheme))
        {
            this._stylesheets.push(customTheme);
        }

        this.update(uri);
    }

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
        this._formatters = [];
        
        if (message)
        {
            this._defaultMessage = message;
        }

        this.update(uri);
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>
    {
        let builder = "";

        for (let css of this._stylesheets)
        {
            builder += `<link rel='stylesheet' href='${css}'>`;
        }

        builder += `<header>
            <div class="left">
                <button id='clear' class='clear' title='Clear All Dumps'>X</button>
                <button id='collapseAll' title='Collapse All'>⮝</button>
                <button id='expandAll' title='Expand All'>⮟</button>
            </div>
            <div class="right">
                <div>${this._formatters.length} entries</div>
            </div>
        </header><div class='dumpContainer'>`;

        if (this._formatters.length > 0)
        {
            for (let formatter of this._formatters)
            {
                builder += formatter.formatToHtml();
            }
        }
        else
        {
            builder += `<h1>${this._defaultMessage}</h1>`;
        }

        builder += '</div>';
        
        for (let js of this._scripts)
        {
            builder += `<script>window.listenPort = ${this.port};</script>`;
            builder += `<script>window.scrollToBottom = ${this.scrollToBottom};</script>`;
            builder += `<script src='${js}'></script>`;
        }

        return builder;
    }
}
