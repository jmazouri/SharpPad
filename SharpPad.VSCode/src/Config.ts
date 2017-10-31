import {WorkspaceConfiguration} from 'vscode'
import {TypeNameStyle} from './parsers/TypeName'
import {DumpSourceStyle} from './formatters/DumpContainerFormatProvider'

export type Theme = "dark" | "light";

export default class Config
{
    constructor(config: WorkspaceConfiguration)
    {
        this.listenServerPort = config.get<number>("listenServerPort");
        this.theme = config.get<Theme>("colorTheme");
        this.typeNameStyle = config.get<TypeNameStyle>("typeNameStyle");
        this.dumpSourceStyle = config.get<DumpSourceStyle>("dumpSourceStyle");
        this.autoScrollToBottom = config.get<Boolean>("autoScrollToBottom");
        this.showTimeOnDumps = config.get<Boolean>("showTimeOnDumps");
    }
    
    theme: Theme;
    listenServerPort: number;
    typeNameStyle: TypeNameStyle;
    dumpSourceStyle: DumpSourceStyle;
    autoScrollToBottom: Boolean;
    showTimeOnDumps: Boolean;
}