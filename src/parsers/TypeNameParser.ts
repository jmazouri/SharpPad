import TypeName from './TypeName';

const typenameRegex = /.*(?=,)/;
const genericTypeNameRegex = /.*(?=`)/;
const typeParamRegex = /\[.+?(?=,)/g;

export default class TypeNameParser
{
    static parse(input: string): TypeName
    {
        let ret: TypeName = new TypeName();
        ret.rawTypeName = input;

        if (ret.rawTypeName.indexOf('`') > -1)
        {
            let genericMatch = input.match(typeParamRegex);

            if (input.indexOf("__AnonymousType") > -1)
            {
                ret.fullTypeName = "AnonymousType";
            }
            else
            {
                ret.fullTypeName = input.match(genericTypeNameRegex)[0];
            }

            ret.typeParameters = genericMatch.map(param => param.replace('[', ''));
        }
        else
        {
            ret.fullTypeName = input.match(typenameRegex)[0];
        }

        return ret;
    }
}