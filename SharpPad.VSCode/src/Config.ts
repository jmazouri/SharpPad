import {WorkspaceConfiguration} from 'vscode'
import {TypeNameStyle} from './parsers/TypeName'
import {DumpSourceStyle, DumpDisplayStyle} from './formatters/DumpContainerFormatProvider'

export type Theme = "dark" | "light" | "monokai" | "solarized-light";

export default class Config
{
    constructor(config: WorkspaceConfiguration)
    {
        this.listenServerPort = config.get<number>("listenServerPort");
        this.theme = config.get<Theme>("colorTheme");
        this.customThemePath = config.get<string>("customThemePath");
        this.typeNameStyle = config.get<TypeNameStyle>("typeNameStyle");
        this.dumpSourceStyle = config.get<DumpSourceStyle>("dumpSourceStyle");
        this.dumpDisplayStyle = config.get<DumpDisplayStyle>("dumpDisplayStyle");
        this.autoScrollToBottom = config.get<boolean>("autoScrollToBottom");
        this.showTimeOnDumps = config.get<boolean>("showTimeOnDumps");
    }
    
    theme: Theme;
    customThemePath: string;
    listenServerPort: number;
    typeNameStyle: TypeNameStyle;
    dumpSourceStyle: DumpSourceStyle;
    dumpDisplayStyle: DumpDisplayStyle;
    autoScrollToBottom: boolean;
    showTimeOnDumps: boolean;
}