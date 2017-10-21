export default class TypeName
{
    assemblyQualifiedName: string;
    namespacedTypeName: string;

    get typeName(): string
    {
        return TypeName.getTypeWithoutNamespace(this.namespacedTypeName);
    }

    typeParameters: TypeName[] = [];

    static getTypeWithoutNamespace(input: string)
    {
        let split = input.split('.');
        return split[split.length - 1];
    }

    public toString() : string
    {
        let template = `${this.typeName}`;

        if (this.typeParameters && this.typeParameters.length > 0)
        {
            template += `<${this.typeParameters.map(d => d.typeName).join(", ")}>`;
        }

        return template;
    }
}