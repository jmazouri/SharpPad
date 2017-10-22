let he = require('he');

import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'
import DumpContainer from '../DumpContainer'

export default class DumpContainerFormatProvider implements IFormatProvider
{
    private _container: DumpContainer;
    date: Date;

    constructor(container: DumpContainer)
    {
        this._container = container;
        this.date = new Date();
    }

    formatToHtml(): string
    {
        let formatter = DataFormatter.getFormatter(this._container.$value);
        let builder = '';

        if (this._container.title)
        {
            builder = `<h2 class="dumpTitle">${he.encode(this._container.title)}</h2>`;
        }

        return `${builder}
        <div class="dump">
            ${formatter.formatToHtml()}
            <div class='time'>
                ${this.date.toLocaleTimeString()} + ${this.date.getMilliseconds()}ms
            </div>
        </div>`;
    }

}