import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'

var he = require('he');

export default class ArrayFormatProvider implements IFormatProvider
{
    private _targetArr: any;
    private _type: string;

    constructor(targetArr: any)
    {
        this._targetArr = targetArr.$value;
        this._type = targetArr.$type;
    }

    formatToHtml(): string
    {
        let build = `<ul>${he.encode(this._type)}`;

        for (let element of this._targetArr)
        {
            build += `<li>${DataFormatter.getFormatter(element).formatToHtml()}</li>`;
        }

        build += "</ul>";

        return `<div class="array">${build}</div>`;
    }
}