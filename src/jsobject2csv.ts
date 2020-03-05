import { getDir } from './scanDir'
import * as ts from 'typescript'
import { createProgram, transform, TypeChecker, TransformationContext } from 'typescript'
import { SourceFile } from 'typescript'
import * as path from 'path'
import * as XLSX from 'xlsx'

export default function jsob2csv(pathname: string, output: string) {
    const fileList = getDir(pathname, []);
    const jsonList = tsScan(fileList);
    const sheet1 = XLSX.utils.json_to_sheet(jsonList);
    let wb = {
        SheetNames: ['sheet1'],
        Sheets: {
            sheet1
        }
    } as XLSX.WorkBook

    XLSX.writeFile(wb, `${output}.xlsx`)
}


function tsScan(fileList: string[]) {
    const cmd = ts.parseCommandLine(fileList); // replace with target file
    // Create the program
    const program = createProgram(cmd.fileNames, { ...cmd.options, allowJs: true });
    const typeChecker = program.getTypeChecker();
    const wordList = [];
    const nameMap = {};
    fileList.forEach(fileName => {
        const _road = fileName.split(path.sep).join('/')
        nameMap[_road] = true
    });
    let empty = () => { };

    const scanWord = (typeChecker: TypeChecker, filename: string) => (
        context: TransformationContext
    ) => (sourceFile: SourceFile) => {
        const visitor = (node: ts.Node): any => {

            if (
                ts.SyntaxKind.PropertyAssignment === node.kind
            ) {
                let fullStart = node.getFullStart();
                let trivia = '';
                let range = ts.getLeadingCommentRanges(node.getSourceFile().text, node.getFullStart())
                if (range && range.length > 0) {
                    let { pos, end } = range[0]
                    trivia = node.getFullText()
                        .slice(pos - fullStart, end - fullStart)
                        .replace('//', '').trim()
                }
                let sharkObject = {
                    TransKey: "",
                    Origin: trivia,
                    Description: trivia,
                    PageID: "",
                    "zh-CN": trivia,
                    Platform: 3,
                    BeginVersion: 0,
                    EndVersion: 0,
                    ImageUrl: "",
                };

                ts.visitEachChild(node, (_node) => getSharkObject(_node, sharkObject), context);
                wordList.push(sharkObject)
                return node;
            }
            // 继续深度搜索
            if (node?.getChildCount() > 0) {
                return ts.visitEachChild(node, visitor, context);
            }

            return node;
        };

        const getSharkObject = (node: ts.Node, parentObject: any): any => {
            if (ts.SyntaxKind.Identifier === node.kind) {
                // key
                return node;
            }
            if (ts.SyntaxKind.StringLiteral === node.kind) {
                let text = node.getText();
                let TransKey = text.slice(1, text.length - 1);
                parentObject['TransKey'] = TransKey;
                return node;
            }
            return node;
        }

        return visitor(sourceFile)
    }
    const sourceFiles = program.getSourceFiles()!;
    sourceFiles.forEach(sourceFile => {
        const { fileName } = sourceFile
        if (nameMap[fileName]) {
            transform(sourceFile, [scanWord(typeChecker, fileName)])

        }
    })
    return wordList;
}
