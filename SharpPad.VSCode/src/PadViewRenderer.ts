import * as vscode from 'vscode'
import Config, { Theme } from './Config'

import IFormatProvider from './formatters/IFormatProvider'
import RawFormatProvider from './formatters/RawFormatProvider'
import ResourceLocator from './theming/ResourceLocator'
import { isNullOrUndefined } from 'util';
import { readFile, readFileSync } from 'fs';

export default class PadViewRenderer
{
    private _formatters: Array<IFormatProvider> = [];
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    private _stylesheets: string[] = [];
    private _scripts: string[] = [];
    private _customStyle: string = "";
    private _config: Config | null = null;

    private _defaultMessage = "";

    constructor()
    {
        this._scripts.push(ResourceLocator.getResource("collapser.js"));
    }

    public setConfig(config: Config)
    {
        this._stylesheets = [];

        this._stylesheets.push(ResourceLocator.getResource("themes", `${config.theme}.css`));
        this._stylesheets.push(ResourceLocator.getResource("theme.css"));

        if (config.customThemePath)
        {
            let themePath = config.customThemePath;

            if (themePath.startsWith('file:///'))
            {
                themePath = themePath.substr(8);
            }

            this._customStyle = readFileSync(themePath, "utf8");
        }

        this._config = config;
    }

    public add(formatter: IFormatProvider)
    {
        this._formatters.push(formatter);
    }

    public clear(message: string = "")
    {
        this._formatters = [];
        
        if (message)
        {
            this._defaultMessage = message;
        }
    }

    public render(): string
    {
        if (this._config == null) { return "Error: Config wasn't set."; }

        let builder = "";

        for (let css of this._stylesheets)
        {
            builder += `<link rel='stylesheet' href='${css}'>`;
        }

        builder += `<style type='text/css'>body { zoom: ${this._config}; }${this._customStyle}</style>`;

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
        
        builder += `<script>window.listenPort = ${this._config.listenServerPort};</script>`;
        builder += `<script>window.scrollToBottom = ${this._config.autoScrollToBottom};</script>`;
        
        for (let js of this._scripts)
        {
            builder += `<script src='${js}'></script>`;
        }

        return builder;
    }
}
