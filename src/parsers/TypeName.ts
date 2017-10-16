export default class TypeName
{
    rawTypeName: string;
    fullTypeName: string;
    typeParameters: string[] = [];
    assembly: string;

    get typeName(): string
    {
        return TypeName.getSimpleTypeName(this.fullTypeName);
    }

    static getSimpleTypeName(input: string)
    {
        let split = input.split('.');
        return split[split.length - 1];
    }

    public toString() : string
    {
        let template = `${this.typeName}`;

        if (this.typeParameters && this.typeParameters.length > 0)
        {
            template += `<${this.typeParameters.map(d => TypeName.getSimpleTypeName(d)).join(", ")}>`;
        }

        return template;
    }
}