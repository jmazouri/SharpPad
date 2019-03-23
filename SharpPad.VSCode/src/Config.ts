import {WorkspaceConfiguration} from 'vscode'
import {TypeNameStyle} from './parsers/TypeName'
import {DumpSourceStyle, DumpDisplayStyle} from './formatters/DumpContainerFormatProvider'

export type Theme = "dark" | "light" | "monokai" | "solarized-light" | "derived";

export default class Config
{
    private _config: WorkspaceConfiguration;

    constructor(config: WorkspaceConfiguration)
    {
        this._config = config;

        this.listenServerPort = this.valueOrDefault("listenServerPort", 5255);
        this.theme = this.valueOrDefault("colorTheme", "dark");
        this.customThemePath = this.valueOrDefault("customThemePath", null);
        this.typeNameStyle = this.valueOrDefault("typeNameStyle", "shorthand");
        this.dumpSourceStyle = this.valueOrDefault("dumpSourceStyle", "show");
        this.dumpDisplayStyle = this.valueOrDefault("dumpDisplayStyle", "full");
        this.autoScrollToBottom = this.valueOrDefault("autoScrollToBottom", false);
        this.showTimeOnDumps = this.valueOrDefault("showTimeOnDumps", true);
        this.zoomLevel = this.valueOrDefault("zoomLevel", "100%");
        this.clearOnDebugStart = this.valueOrDefault("clearOnDebugStart", true);
    }

    private valueOrDefault<T>(key: string, def: T)
    {
        let value = this._config.get<T>(key);

        if (value == undefined)
        {
            return def;
        }
    
        return value;
    }
    
    theme: Theme;
    customThemePath: string | null;
    listenServerPort: number;
    typeNameStyle: TypeNameStyle;
    dumpSourceStyle: DumpSourceStyle;
    dumpDisplayStyle: DumpDisplayStyle;
    autoScrollToBottom: boolean;
    showTimeOnDumps: boolean;
    zoomLevel: string;
    clearOnDebugStart: boolean;
}

