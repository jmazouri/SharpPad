import TypeNameShorthands from './TypeNameShorthands';
export type TypeNameStyle = "namespaced" | "normal" | "shorthand" | "mixedShorthandNamespaced" | "none";

export default class TypeName
{
    typeParameters: TypeName[] = [];
    name: string;

    get displayName(): string
    {
        let split = this.name.split('.');
        
        if (split && split.length > 0)
        {
            var namePart = split[split.length - 1];

            if (namePart.indexOf('+') > -1)
            {
                return namePart.substr(0, namePart.indexOf('+'));
            }

            return namePart;
        }
        else
        {
            return this.name;
        }
    }

    public toString(style: TypeNameStyle) : string
    {
        let template = "";

        switch (style)
        {
            case "namespaced":
                template += this.name;
                break;

            case "mixedShorthandNamespaced":
            case "shorthand":
                let foundName = TypeNameShorthands[this.name];

                if (foundName == undefined)
                {
                    if (style == "mixedShorthandNamespaced")
                    {
                        template += this.name;
                    }
                    else
                    {
                        template += this.displayName;
                    }
                }
                else
                {
                    template += `<span class="keyword">${foundName}</span>`;
                }

                break;

            default:
                template += this.displayName;
        }

        if (this.typeParameters && this.typeParameters.length > 0)
        {
            let params = this.typeParameters
                .map(d => d.toString(style))
                .join("<span class='normal'>, </span>");
            
            template += `<span class='normal'>&lt;</span>${params}<span class='normal'>&gt;</span>`;
        }

        return template;
    }
}