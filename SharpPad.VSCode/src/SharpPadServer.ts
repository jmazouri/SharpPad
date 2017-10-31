import * as vscode from 'vscode';
import * as http from 'http';
import DumpContainer from './DumpContainer'
import HttpRouter, { HttpMethod } from './HttpRouter'

export default class SharpPadServer
{
    private _server: http.Server;
    private _router = new HttpRouter();
    private _statusBarMessage: vscode.StatusBarItem;

    constructor(port: number, onDump: (dump: DumpContainer) => void, onClear: Function)
    {
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

        this._router.registerRoute("/", "POST", (body) => 
        {
            let result: DumpContainer = JSON.parse(body);
            onDump(result);
        });
        
        this._router.registerRoute("/clear", "GET", (body) => onClear());
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

            self._router.executeRoute(req.url, <HttpMethod>req.method, content);

            res.statusCode = 200;
            res.end();
        });
    }
}