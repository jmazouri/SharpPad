import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'
import escape from '../escape'
import TypeName from '../parsers/TypeName'
import {TypeNameStyle} from '../parsers/TypeName'

export default class ObjectFormatProvider implements IFormatProvider
{
    public startCollapsed: boolean = true;

    private _targetObj: any;
    private _type: TypeName;
    private _style: TypeNameStyle;

    constructor(targetObj: any, style: TypeNameStyle)
    {
        this._targetObj = targetObj;
        this._type = TypeNameParser.parse(targetObj.$type);
        this._style = style;
    }

    formatToHtml(): string
    {
        let build = '';

        if (this._style != "none")
        {
            build += `<h4 class='typeName clickable'>
                ${this._type.toString(this._style)} <span class='collapse'></span>
            </h4>`;
        }

        build += "<table><tbody class='propList'>";

        for (var property in this._targetObj)
        {
            if (this._targetObj.hasOwnProperty(property) && property != "$type")
            {
                let formatter = DataFormatter.getFormatter(this._targetObj[property]);

                build += `<tr><th class='propName'>${escape(property)}</th><td class='equals'>=</td><td>${formatter.formatToHtml()}</td></tr>`;
            }
        }

        build += "</tbody></table>";

        return `<div class="object">${build}</div>`;
    }
}