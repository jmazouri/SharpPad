import IFormatProvider from './IFormatProvider'
import escape from '../escape'

export default class RawFormatProvider implements IFormatProvider
{
    private _rawData: any;
    private _isHtml: boolean;

    constructor(rawData: any, isHtml: boolean)
    {
        if (rawData === null || rawData === undefined)
        {
            this._rawData = "null";
        }
        else
        {
            this._rawData = rawData;
        }

        this._isHtml = isHtml;
    }

    formatToHtml(): string
    {
        let classes: string[] = ["raw"];
        let display = this._rawData;

        if (this._rawData === "null")
        {
            classes.push('null');
        }
        else
        {
            if (typeof this._rawData === "string")
            {
                if (this._isHtml) 
                {
                    classes.push('html');
                }
                else
                {
                    classes.push('string');
                    display = `"${escape(display)}"`;
                }
            }

            if (typeof this._rawData === "number")
            {
                classes.push('number');
            }

            if (typeof this._rawData === "boolean")
            {
                classes.push('bool');
            }
        }
        
        return `<div class="${classes.join(' ')}">${display}</div>`;
    }
}