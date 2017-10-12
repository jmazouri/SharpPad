import IFormatProvider from './IFormatProvider'

export default class RawFormatProvider implements IFormatProvider
{
    private _rawData: any;

    constructor(rawData: any)
    {
        this._rawData = (rawData.$value == undefined ? rawData : rawData.$value);
    }

    formatToHtml(): string
    {
        return `<div class="raw">${this._rawData}</div>`;
    }
}