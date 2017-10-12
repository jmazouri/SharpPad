import IFormatProvider from './IFormatProvider'
import ObjectFormatProvider from './ObjectFormatProvider'
import RawFormatProvider from './RawFormatProvider'
import ArrayFormatProvider from './ArrayFormatProvider'

export default class DataFormatter
{
    static getFormatter(target: any): IFormatProvider
    {
        try
        {
            if (Array.isArray(target.$value))
            {
                return new ArrayFormatProvider(target);
            }
            else if (typeof target.$value === 'object')
            {
                return new ObjectFormatProvider(target);
            }

            return new RawFormatProvider(target);
        }
        catch (err)
        {
            return new RawFormatProvider(target);
        }        
    }
}