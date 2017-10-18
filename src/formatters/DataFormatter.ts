import IFormatProvider from './IFormatProvider'
import ObjectFormatProvider from './ObjectFormatProvider'
import RawFormatProvider from './RawFormatProvider'
import ArrayFormatProvider from './ArrayFormatProvider'
import GridFormatProvider from './GridFormatProvider'

import TypeNameParser from '../parsers/TypeNameParser'

export default class DataFormatter
{
    static getFormatter(target: any): IFormatProvider
    {
        if (target.$type)
        {
            let type = TypeNameParser.parse(target.$type);

            if (type.typeName == "DumpContainer")
            {
                return DataFormatter.getFormatter(target.$value);
            }
        }

        let ret: IFormatProvider = new RawFormatProvider(target);

        if (target != null)
        {
            if (target.$values)
            {
                if (target.$values.length > 0 && target.$values[0].$type)
                {
                    ret = new GridFormatProvider(target);
                }
                else
                {
                    ret = new ArrayFormatProvider(target);
                }
            }
            else if (target.$type)
            {
                ret = new ObjectFormatProvider(target);
            }
        }

        ret.date = new Date();
        return ret;
    }
}