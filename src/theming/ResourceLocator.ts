import * as path from 'path';
import * as vscode from 'vscode';

export default class ResourceLocator
{
    static getResource(...paths: string[])
    {
        return vscode.Uri.file(path.join(__dirname, '..', '..', 'resources', ...paths)).toString();
    }
}