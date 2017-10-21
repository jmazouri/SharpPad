import * as vscode from 'vscode';
import * as http from 'http';

export default class SharpPadServer
{
    private _server: http.Server;
    private _onDump: (dump: any) => any;

    private _statusBarMessage: vscode.StatusBarItem;

    constructor(port: number, onDump: (dump: any) => any)
    {
        this._onDump = onDump;
        
        //The Express typings don't include the json middleware from the newest version,
        //so we bypass it a bit

        this._server = http.createServer((req, res) => this.handleRequest(req, res));

        let self = this;
        this._server.listen(port, function ()
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
    
    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse)
    {
        let self = this;
        let body = [];
        
        req.on('data', (chunk) =>
        {
            body.push(chunk);
        })
        .on('end', () =>
        {
            let content = Buffer.concat(body).toString();
            self._onDump(JSON.parse(content));

            res.statusCode = 200;
            res.end();
        });
    }
}