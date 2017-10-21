export default class TypeName
{
    assemblyQualifiedName: string;
    typeParameters: TypeName[] = [];

    _namespacedTypeName: string;
    get namespacedTypeName(): string
    {
        return this._namespacedTypeName;
    }

    /*
        TODO: Improve this; make entire type immutable?
        
        Update the backing field for the typeName property
        when the namespacedTypeName is changed
    */
    set namespacedTypeName(value: string)
    {
        this._namespacedTypeName = value;
        
        let split = value.split('.');
        this._typeName = split[split.length - 1];
    }

    private _typeName: string;
    get typeName(): string
    {
        return this._typeName;
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