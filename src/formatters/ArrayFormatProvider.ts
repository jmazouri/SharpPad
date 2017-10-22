let he = require('he');

import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'

import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'

export default class ArrayFormatProvider implements IFormatProvider
{
    private _targetArr: Array<any>;
    private _type: TypeName;

    constructor(targetArr: any)
    {
        this._targetArr = targetArr.$values;
        this._type = TypeNameParser.parse(targetArr.$type);
    }

    formatToHtml(): string
    {
        let build = `<table>`;

        let formatted = this._targetArr.map(e => DataFormatter.getFormatter(e).formatToHtml());
        let joined = formatted.join(', ');

        build += `<tr><td>{${joined}}</td></tr>`

        build += "</table>";

        return `<div class="array" title="${this._type.toString()}">${build}</div>`;
    }
}