import {WorkspaceConfiguration} from 'vscode'

export default class Config
{
    constructor(config: WorkspaceConfiguration)
    {
        this.listenServerPort = config.get<number>("listenServerPort");
    }
    
    listenServerPort: number;
}