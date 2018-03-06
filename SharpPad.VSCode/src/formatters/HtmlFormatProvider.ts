import IFormatProvider from './IFormatProvider'
import escape from '../escape'

export default class HtmlFormatProvider implements IFormatProvider
{
    private _htmlString: any;

    constructor(htmlString: any)
    {
        this._htmlString = htmlString;
    }

    formatToHtml(): string
    {
        return `<div class="raw html">${this._htmlString}</div>`;
    }
}