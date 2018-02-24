import IFormatProvider from './IFormatProvider'
import DataFormatter from './DataFormatter'
import TypeNameParser from '../parsers/TypeNameParser'
import TypeName from '../parsers/TypeName'
import DumpContainer from '../DumpContainer'
import escape from '../escape'
import { format } from 'util';

export type DumpSourceStyle = "show" | "hide";
export type DumpDisplayStyle = "full" | "single";

export default class DumpContainerFormatProvider implements IFormatProvider
{
    private _container: DumpContainer;
    private _sourceStyle: DumpSourceStyle;
    private _displayStyle: DumpDisplayStyle;
    private _showTime: Boolean;

    date: Date;

    constructor(container: DumpContainer, sourceStyle: DumpSourceStyle, displayStyle: DumpDisplayStyle, showTime: Boolean)
    {
        this._container = container;
        this._sourceStyle = sourceStyle;
        this._displayStyle = displayStyle;
        this._showTime = showTime;

        this.date = new Date();
    }

    formatToHtml(): string
    {
        let formatter = DataFormatter.getFormatter(this._container.$value);
        let builder = '';
        let timeDiv = '';

        if (this._displayStyle != "single")
        {
            if (this._container.title)
            {
                builder = `<h2 class="dumpTitle">${escape(this._container.title)}</h2>`;
            }
            else if (this._sourceStyle == "show" && this._container.source)
            {
                builder = `<h2 class="dumpTitle">${escape(this._container.source)}</h2>`;
            }

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
        
        return `<div>${formatter.formatToHtml()}</div>`;
    }

}