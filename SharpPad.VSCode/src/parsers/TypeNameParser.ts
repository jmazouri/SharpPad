/*
    Ported and Adapted from a CodeProject article written by
    Christophe Bertrand. Utilized under MS-PL. Many, many thanks!

    https://www.codeproject.com/Tips/624300/AssemblyQualifiedName-Parser
*/

import TypeName from './TypeName'

export default class TypeNameParser
{
    //static typeNameParser: P.Parser
    static parse(input: string): TypeName
    {
        let ret = new TypeName(input);

        let index = -1;
        let rootBlock: Block = new Block();

        let bcount = 0;
        let currentBlock: Block = rootBlock;

        for (let i = 0; i < input.length; ++i)
        {
            let c = input[i];
            if (c == '[')
            {
                if (input[i + 1] == ']')
                {
                    i++;
                }
                else
                {
                    ++bcount;

                    var b = new Block();
                    b.iStart = i + 1;
                    b.level = bcount;
                    b.parentBlock = currentBlock;

                    currentBlock.innerBlocks.push(b);
                    currentBlock = b;
                }
            }
            else if (c == ']')
            {
                currentBlock.iEnd = i - 1;
                if (input[currentBlock.iStart] != '[')
                {
                    currentBlock.typeName = TypeNameParser.parse(input.substr(currentBlock.iStart, i - currentBlock.iStart));

                    if (bcount == 2)
                    {
                        ret.typeParameters.push(currentBlock.typeName);
                    }
                }

                if (currentBlock.parentBlock != null)
                {
                    currentBlock = currentBlock.parentBlock;
                }
                
                --bcount;
            }
            else if (bcount == 0 && c == ',')
            {
                index = i;
                break;
            }
        }

        if (ret.typeParameters.length > 0)
        {
            ret.name = input.substr(0, input.indexOf('`'));
        }
        else
        {
            ret.name = input.substr(0, index);
        }

        if (ret.name.indexOf("__AnonymousType") > -1)
        {
            ret.name = "AnonymousType";
        }

        return ret;
    }
}

class Block
{
    iStart: number = 0;
    iEnd: number = 0;
    level: number = 0;
    parentBlock: Block | null = null;
    innerBlocks: Block[] = [];
    typeName: TypeName = new TypeName("");
}