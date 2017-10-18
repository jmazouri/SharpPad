import * as vscode from 'vscode';
import * as Express from 'express';
import { Server } from 'http';

export default class SharpPadServer
{
    private _app: Express.Application = Express();
    private _server: Server;
    private _onDump: (dump: any) => any;

    private _statusBarMessage: vscode.StatusBarItem;

    constructor(port: number, onDump: (dump: any) => any)
    {
        this._onDump = onDump;
        
        //The Express typings don't include the json middleware from the newest version,
        //so we bypass it a bit
        this._app.use((<any>Express).json());
        this._app.post('/', (req, res) => this.handleRequest(req, res));

        let self = this;

        this._server = this._app.listen(port, function ()
        {
            self._statusBarMessage = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
            self._statusBarMessage.text = `SharpPad:${port}`;
            self._statusBarMessage.tooltip = `SharpPad server listening on port ${port}`;
            self._statusBarMessage.command = "sharppad.showSharpPad";

            self._statusBarMessage.show();
        });
    }

    public close(whenDone: Function = () => null)
    {
        console.log("Stopping SharpPad server...");

        this._statusBarMessage.dispose();
        this._server.close(() => whenDone());
    }
    
    private handleRequest(req, res)
    {
        this._onDump(req.body);
        res.status(200).end();
    }
}