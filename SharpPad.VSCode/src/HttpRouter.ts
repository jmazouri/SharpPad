import * as http from 'http';

export type HttpMethod = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export default class HttpRouter
{
    private _routes: object[] = [];
    
    registerRoute(path: string, method: HttpMethod, handler: (body: string) => void)
    {
        if (this._routes[method] == undefined)
        {
            this._routes[method] = [];
        }

        this._routes[method][path] = handler;
    }

    executeRoute(path: string, method: HttpMethod, body: string)
    {
        if (this._routes[method] != undefined && this._routes[method][path] != undefined)
        {
            this._routes[method][path](body);
        }
    }
}