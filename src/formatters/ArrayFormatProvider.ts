import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'

import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'
import {TypeNameStyle} from '../parsers/TypeName'

export default class ArrayFormatProvider implements IFormatProvider
{
    private _targetArr: Array<any>;
    private _type: TypeName;
    private _style: TypeNameStyle;

    constructor(targetArr: any, style: TypeNameStyle)
    {
        this._targetArr = targetArr.$values;
        this._type = TypeNameParser.parse(targetArr.$type);
        this._style = style;
    }

    formatToHtml(): string
    {
        let build = `<table>`;

        let formatted = this._targetArr.map(e => DataFormatter.getFormatter(e).formatToHtml());
        let joined = formatted.join(', ');

        build += `<tr><td>{${joined}}</td></tr>`

        build += "</table>";

        return `<div class="array" title="${this._type.toString(this._style)}">${build}</div>`;
    }
}