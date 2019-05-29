import * as vscode from "vscode";

const cellStartRegex = /^\/\/</;
const cellEndRegex = /^\/\/>/;

export default class CellCodeLensProvider implements vscode.CodeLensProvider
{
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken) : vscode.CodeLens[] | Thenable<vscode.CodeLens[]>
    {
        let ret: vscode.CodeLens[] = [];

        console.log("Generating lenses...");
        let lenses = this.generateLenses(document);

        return lenses.map(d => {
            return new vscode.CodeLens(d.range, {
                title: "Execute Cell", 
                command:"sharppad.executeCell", 
                arguments: [d.body]
            });
        });
    }

    generateLenses(document: vscode.TextDocument): {range: vscode.Range, body: string}[]
    {
        let ret = [];

        for (let i = 0; i < document.lineCount; i++)
        {
            const line = document.lineAt(i);
            let match = cellStartRegex.exec(line.text);

            if (match != null)
            {
                let cellBody = "";

                let cellLineIndex = i + 1;
                let cellLine = document.lineAt(cellLineIndex);
    
                while (cellLine.text != null && cellEndRegex.exec(cellLine.text) == null)
                {
                    cellBody += cellLine.text + "\n";
                    cellLineIndex++;
                    cellLine = document.lineAt(cellLineIndex);
                }

                ret.push({range: line.range.with(undefined, new vscode.Position(cellLineIndex, 0)), body: cellBody.trim()})

                i = cellLineIndex;
            }
        }

        return ret;
    }

    
}