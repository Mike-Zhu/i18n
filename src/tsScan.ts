import * as ts from 'typescript'
import { createProgram, transform, TypeChecker, TransformationContext } from 'typescript'
import { SourceFile } from 'typescript'
import { WordInfo } from './utils'
import * as path from 'path'

export default function tsScan(fileList: string[]) {
    const cmd = ts.parseCommandLine(fileList); // replace with target file
    // Create the program
    const program = createProgram(cmd.fileNames, { ...cmd.options, allowJs: true });
    const typeChecker = program.getTypeChecker();
    const wordList: WordInfo[] = [];
    const nameMap = {};
    fileList.forEach(fileName => {
        const _road = fileName.split(path.sep).join('/')
        nameMap[_road] = true
    });
    let empty = () => { };
    // Dummy transformation context
    let context: ts.TransformationContext = {
        startLexicalEnvironment: empty,
        suspendLexicalEnvironment: empty,
        resumeLexicalEnvironment: empty,
        endLexicalEnvironment: () => [],
        getCompilerOptions: () => program.getCompilerOptions(),
        hoistFunctionDeclaration: empty,
        hoistVariableDeclaration: empty,
        readEmitHelpers: () => undefined,
        requestEmitHelper: empty,
        enableEmitNotification: empty,
        enableSubstitution: empty,
        isEmitNotificationEnabled: () => false,
        isSubstitutionEnabled: () => false,
        onEmitNode: empty,
        onSubstituteNode: (hint, node) => node,
    };

    const scanWord = (typeChecker: TypeChecker, filename: string) => (
        context: TransformationContext
    ) => (sourceFile: SourceFile) => {

        const isZh = (text) => /[\u4e00-\u9fa5]/.test(text)

        const visitor = (node: ts.Node): any => {

            if (
                node.kind === ts.SyntaxKind.JsxText
                || node.kind === ts.SyntaxKind.StringLiteral
                || node.kind === ts.SyntaxKind.TemplateExpression
            ) {
                let text = node.getFullText().trim();
                if (isZh(text)) {
                    const start = node.getFullStart();
                    const end = start + node.getFullWidth();
                    if (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.TemplateExpression) {
                        // 需要掐头去尾，去除引号和反引号
                        text = text.slice(1, text.length - 1);
                    }
                    wordList.push({
                        content: text,
                        filename: filename,
                        start: start,
                        end: end,
                        kind: node.kind
                    })
                }
                return node;
            }
            // 继续深度搜索
            if (node?.getChildCount() > 0) {
                return ts.visitEachChild(node, visitor, context);
            }

            return node;
        };
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
