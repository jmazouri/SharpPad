import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'
import DumpContainer from '../DumpContainer'

export type DumpSourceStyle = "show" | "hide";

export default class DumpContainerFormatProvider implements IFormatProvider
{
    private _container: DumpContainer;
    private _style: DumpSourceStyle;

    date: Date;

    constructor(container: DumpContainer, style: DumpSourceStyle)
    {
        this._container = container;
        this._style = style;

        this.date = new Date();
    }

    formatToHtml(): string
    {
        let formatter = DataFormatter.getFormatter(this._container.$value);
        let builder = '';

        if (this._container.title)
        {
            builder = `<h2 class="dumpTitle">${this._container.title}</h2>`;
        }
        else if (this._style == "show" && this._container.source)
        {
            builder = `<h2 class="dumpTitle">${this._container.source}</h2>`;
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