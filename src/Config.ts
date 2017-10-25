import {WorkspaceConfiguration} from 'vscode'

export type Theme = "dark" | "light";

export default class Config
{
    constructor(config: WorkspaceConfiguration)
    {
        this.listenServerPort = config.get<number>("listenServerPort");
        this.theme = config.get<Theme>("colorTheme");
    }
    
    theme: Theme;
    listenServerPort: number;
}