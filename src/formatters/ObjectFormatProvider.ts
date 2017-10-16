let he = require('he');

import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'

export default class ObjectFormatProvider implements IFormatProvider
{
    public date: Date;
    public startCollapsed: boolean = true;

    private _targetObj: any;
    private _type: TypeName;

    constructor(targetObj: any)
    {
        this._targetObj = targetObj;
        this._type = TypeNameParser.parse(targetObj.$type);
    }

    formatToHtml(): string
    {
        let build = `<h4 class='typeName clickable'>
            ${he.encode(this._type.toString())} <span class='collapse'></span>
        </h4><table style='display: none;'><tbody class='propList'>`;

        for (var property in this._targetObj)
        {
            if (this._targetObj.hasOwnProperty(property) && property != "$type")
            {
                let formatter = DataFormatter.getFormatter(this._targetObj[property]);

                build += `<tr><th class='propName'>${property}</th><td class='equals'>=</td><td>${formatter.formatToHtml()}</td></tr>`;
            }
        }

        build += "</tbody></table>";

        return `<div class="object">${build}</div>`;
    }
}