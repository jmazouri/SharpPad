import IFormatProvider from './IFormatProvider'
import ObjectFormatProvider from './ObjectFormatProvider'
import RawFormatProvider from './RawFormatProvider'
import ArrayFormatProvider from './ArrayFormatProvider'
import GridFormatProvider from './GridFormatProvider'
import DumpContainerFormatProvider from './DumpContainerFormatProvider'

import TypeNameParser from '../parsers/TypeNameParser'
import {TypeNameStyle} from '../parsers/TypeName'

export default class DataFormatter
{
    static style: TypeNameStyle = "normal";
    
    /*
        This method decides what formatter implementation to use for a given input.
        The input can be "anything", and the conventions used are based on those used
        by Json.Net.
    */
    static getFormatter(target: any): IFormatProvider
    {      
        if (target !== null && target !== undefined)
        {
            /*
                If the target has a $type property, and it's a DumpContainer, then
                it's the outer wrapper for a dump, so we recursively call the formatter
                for the value within.
            */
            if (target.$type)
            {
                let type = TypeNameParser.parse(target.$type);
    
                if (type.displayName == "DumpContainer")
                {
                    return new DumpContainerFormatProvider(target);
                }
            }

            //If the $values property is present, it's an array of some kind.
            if (target.$values)
            {
                /*
                    If the array contains any values, and those values are complex objects
                    (contain a '$type' property), use a grid formatter - otherwise use the simpler,
                    single-line array formatter.
                */
                if (target.$values.length > 0 && (target.$values[0].$type || typeof target.$values[0] === "object"))
                {
                    return new GridFormatProvider(target, DataFormatter.style);
                }
                else
                {
                    return new ArrayFormatProvider(target, DataFormatter.style);
                }
            }
            else if (target.$type)
            {
                //If it's not an array, but still has a type, it's some other object.
                return new ObjectFormatProvider(target, DataFormatter.style);
            }
        }

        /*
            We let RawFormatProvider handle pure null values, or anything else
            we don't recognize.
        */
        return new RawFormatProvider(target);
    }
}