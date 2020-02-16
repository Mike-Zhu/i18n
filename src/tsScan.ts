import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import prettier from 'prettier'

import { CompilerOptions, createPrinter, createProgram, EmitHint, transform, TypeChecker, TransformationContext } from 'typescript'


import { isImportDeclaration, isStringLiteral, SourceFile, updateSourceFileNode } from 'typescript'

interface WordInfo {
    content: string;
    filename: string;
    start: number;
    end: number;
    kind: number;
}

export default function tsScan(fileList: string[]) {
    var cmd = ts.parseCommandLine(fileList); // replace with target file
    // Create the program
    let program = createProgram(cmd.fileNames, cmd.options);
    const typeChecker = program.getTypeChecker();
    const wordList: WordInfo[] = [];


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
                || node.kind === ts.SyntaxKind.JsxExpression
            ) {
                const text = node.getFullText()
                if (isZh(text)) {
                    const start = node.getFullStart();
                    const end = start + node.getFullWidth();
                    wordList.push({
                        content: text.trim(),
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
        const result = transform(sourceFile, [scanWord(typeChecker, sourceFile.fileName)])
        return
    })
    // fileList.forEach(filename => {
    //     const sourceFile = program.getSourceFile(filename)!;
    //     console.log({
    //         filename,
    //         sourceFile
    //     })
    //     const result = transform(sourceFile, [scanWord(typeChecker, filename)])
    //     return
    // });
    return wordList;
}
