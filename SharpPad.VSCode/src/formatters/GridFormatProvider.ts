import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'

import TypeName from '../parsers/TypeName'
import {TypeNameStyle} from '../parsers/TypeName'

export default class GridFormatProvider implements IFormatProvider
{
    private _objCollection: any;
    private _type: TypeName;
    private _properties: string[] = [];
    private _style: TypeNameStyle;

    private get _firstObject()
    {
        return this._objCollection[0];
    }

    constructor(objCollection: any, style: TypeNameStyle)
    {
        this._objCollection = objCollection.$values;
        this._type = TypeNameParser.parse(objCollection.$type);
        this._style = style;

        for (var property in this._firstObject)
        {
            if (this._firstObject.hasOwnProperty(property) && property != "$type")
            {
                this._properties.push(property);
            }
        }
    }

    formatToHtml(): string
    {
        let build = '';

        if (this._style != "none")
        {
            build += `<h4 class='clickable'>
                <span class='typeName'>${this._type.toString(this._style)}</span>
                <span class='count'>(${this._objCollection.length} items)</span>
                <span class='collapse'></span>
            </h4>`;
        }

        build += '<table><thead><tr>';

        if (this._objCollection.length > 1)
        {
            build += `<th></th>`;
        }

        for (var property of this._properties)
        {
            if (property != "$values")
            {
                build += `<th>${property}</th>`;
            }
        }

        build += '</tr></thead><tbody>';

        let ind = 0;
        for (var obj of this._objCollection)
        {
            build += `<tr>`;

            if (this._objCollection.length > 1)
            {
                build += `<td class='rowIndexHeader'>${ind}</td>`;
            }

            for (var property of this._properties)
            {
                let formatter : IFormatProvider;

                if (property == "$values")
                {
                    formatter = DataFormatter.getFormatter(obj);
                }
                else
                {
                    formatter = DataFormatter.getFormatter(obj[property]);
                }

                build += `<td>${formatter.formatToHtml()}</td>`;

                if (property == "$values")
                {
                    break;
                }
            }

            build += `</tr>`;
            ind++;
        }

        build += "</tbody></table>";

        return `<div class="grid">${build}</div>`;
    }
}