let he = require('he');

import IFormatProvider from './IFormatProvider'

export default class RawFormatProvider implements IFormatProvider
{
    public date: Date;
    private _rawData: any;

    constructor(rawData: any)
    {
        if (!rawData)
        {
            this._rawData = null;
        }
        else
        {
            this._rawData = (rawData.$value == undefined ? rawData : rawData.$value);
        }
    }

    formatToHtml(): string
    {
        let classes: string[] = ["raw"];
        let display = this._rawData;

        if (this._rawData === null)
        {
            classes.push('null');
            display = "null";
        }
        else
        {
            if (typeof this._rawData === "string")
            {
                classes.push('string');
                display = `"${display}"`;
            }

            if (typeof this._rawData === "number")
            {
                classes.push('number');
            }
        }
        
        return `<div class="${classes.join(' ')}">${display}</div>`;
    }
}