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
    private _showTime: Boolean;

    date: Date;

    constructor(container: DumpContainer, style: DumpSourceStyle, showTime: Boolean)
    {
        this._container = container;
        this._style = style;
        this._showTime = showTime;

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

        let timeDiv = '';

        if (this._showTime)
        {
            timeDiv = `<div class='time'>
                ${this.date.toLocaleTimeString()} + ${("000" + this.date.getMilliseconds()).substr(-3,3)}ms
            </div>`;
        }

        return `${builder}
        <div class="dump">
            ${formatter.formatToHtml()}
            ${timeDiv}
        </div>`;
    }

}