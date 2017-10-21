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

        //Backticks signify a generic type
        if (ret.assemblyQualifiedName.indexOf('`') > -1)
        {
            //Give it a slightly friendlier name if it's an anonymous type
            if (input.indexOf("__AnonymousType") > -1)
            {
                ret.namespacedTypeName = "AnonymousType";
            }
            else
            {
                /* 
                    Use a slightly different regex if matching generic type names - don't want to include
                    the full generic type name with obscure numbering and such
                */
                ret.namespacedTypeName = input.match(genericTypeNameRegex)[0];
            }

            let genericMatch = input.match(typeParamRegex);

            /*
                TODO: Improve this.
                
                The regex we have for generic type params is unideal; we have to do some manual replacement to get
                nice-looking type names.
            */
            ret.typeParameters = genericMatch.map(param => TypeNameParser.parse(param.replace(/\[/g, '')));
        }
        else
        {
            ret.namespacedTypeName = input.match(typenameRegex)[0];
        }

        return ret;
    }
}