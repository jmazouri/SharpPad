import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'

export default class ObjectFormatProvider implements IFormatProvider
{
    private _targetObj: any;

    constructor(targetObj: any)
    {
        this._targetObj = targetObj.$value;
    }

    formatToHtml(): string
    {
        let build = "<ul>";

        for (var property in this._targetObj)
        {
            if (this._targetObj.hasOwnProperty(property) && property != "$type")
            {
                build += `<li>${property} = ${DataFormatter.getFormatter(this._targetObj[property]).formatToHtml()}</li>`;
            }
        }

        build += "</ul>";

        return `<div class="object">${build}</div>`;
    }
}