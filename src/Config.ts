import {WorkspaceConfiguration} from 'vscode'
import {TypeNameStyle} from './parsers/TypeName'

export type Theme = "dark" | "light";

export default class Config
{
    constructor(config: WorkspaceConfiguration)
    {
        this.listenServerPort = config.get<number>("listenServerPort");
        this.theme = config.get<Theme>("colorTheme");
        this.typeNameStyle = config.get<TypeNameStyle>("typeNameStyle");
    }
    
    theme: Theme;
    listenServerPort: number;
    typeNameStyle: TypeNameStyle;
}