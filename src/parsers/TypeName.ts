export default class TypeName
{
    typeParameters: TypeName[] = [];
    name: string;
    get simplestName(): string
    {
        let split = this.name.split('.');
        
        if (split && split.length > 0)
        {
            return split[split.length - 1];
        }
        else
        {
            return this.name;
        }
    }

    public toString() : string
    {
        let template = `${this.simplestName}`;

        if (this.typeParameters && this.typeParameters.length > 0)
        {
            template += `<${this.typeParameters.map(d => d.toString()).join(", ")}>`;
        }

        return template;
    }
}