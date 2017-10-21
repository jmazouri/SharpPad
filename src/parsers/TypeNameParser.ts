import TypeName from './TypeName';

const typenameRegex = /.*(?=,)/;
const genericTypeNameRegex = /.*(?=`)/;
const typeParamRegex = /\[.*?]/g;

export default class TypeNameParser
{
    static parse(input: string): TypeName
    {
        let ret: TypeName = new TypeName();
        ret.assemblyQualifiedName = input;

        if (ret.assemblyQualifiedName.indexOf('`') > -1)
        {
            if (input.indexOf("__AnonymousType") > -1)
            {
                ret.namespacedTypeName = "AnonymousType";
            }
            else
            {
                ret.namespacedTypeName = input.match(genericTypeNameRegex)[0];
            }

            let genericMatch = input.match(typeParamRegex);
            ret.typeParameters = genericMatch.map(param => TypeNameParser.parse(param.replace(/\[/g, '')));
        }
        else
        {
            ret.namespacedTypeName = input.match(typenameRegex)[0];
        }

        return ret;
    }
}