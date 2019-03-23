import * as http from 'http';

export const enum HttpMethod
{
    Post = "POST",
    Get = "GET",
    Put = "PUT",
    Patch = "PATCH",
    Delete = "DELETE"
}

type Handler = (body: string) => any;
type PathRouteTable = { [path: string]: Handler };
type MethodRouteTable = { [key in HttpMethod]: PathRouteTable };

export default class HttpRouter
{
    private _routes: MethodRouteTable = 
    {
        POST: {},
        GET: {},
        PUT: {},
        PATCH: {},
        DELETE: {}
    };
    
    registerRoute(path: string, method: HttpMethod, handler: (body: string) => void)
    {
        this._routes[method][path] = handler;
    }

    executeRoute(path: string, method: HttpMethod, body: string)
    {
        if (this._routes[method][path] != undefined)
        {
            this._routes[method][path](body);
        }
    }
}