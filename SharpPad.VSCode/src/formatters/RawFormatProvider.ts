import IFormatProvider from './IFormatProvider'
import escape from '../escape'

export default class RawFormatProvider implements IFormatProvider
{
    private _rawData: any;

    constructor(rawData: any)
    {
        if (rawData === null || rawData === undefined)
        {
            this._rawData = "null";
        }
        else
        {
            this._rawData = rawData;
        }
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
                classes.push('string');
                display = `"${escape(display)}"`;
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