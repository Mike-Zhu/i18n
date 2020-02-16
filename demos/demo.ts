import * as ts from 'typescript'
import * as fs from 'fs'
const prettier = require('prettier')

import { CompilerOptions, createPrinter, createProgram, EmitHint, transform, TypeChecker, TransformationContext } from 'typescript'


import { isImportDeclaration, isStringLiteral, SourceFile, updateSourceFileNode } from 'typescript'




var cmd = ts.parseCommandLine(['test.tsx']); // replace with target file
// Create the program
let program = createProgram(cmd.fileNames, cmd.options);
const typeChecker = program.getTypeChecker();
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

export const scanWord = (typeChecker: TypeChecker) => (
  context: TransformationContext
) => (sourceFile: SourceFile) => {

  const visitor = (node: ts.Node): any => {

    if (node.kind === ts.SyntaxKind.JsxText) {
      const text = node.getFullText()
      const isZh = /[\u4e00-\u9fa5]/.test(text)
      if (isZh) {
        console.log(1);
        console.log(text.trim());
        return ts.createJsxText('{Shark.' + text.trim() + "}");
      } else {
        return node;
      }
      // 这里可以返回新的ast  
      // return node;
    }

    // if (node.kind === ts.SyntaxKind.StringLiteral) {
    //   const text = node.getFullText()
    //   const isZh = /[\u4e00-\u9fa5]/.test(text)
    //   if (isZh) {
    //     console.log(2);
    //     console.log(text.trim());
    //   }
    //   // 这里可以返回新的ast  
    //   return node
    // }

    // if (node.kind === ts.SyntaxKind.TemplateExpression) {
    //   const text = node.getFullText()
    //   const isZh = /[\u4e00-\u9fa5]/.test(text)
    //   if (isZh) {
    //     console.log(3);
    //     console.log(text.trim());
    //   }
    //   // 这里可以返回新的ast  
    //   return node;
    // }

    // if (node.kind === ts.SyntaxKind.JsxExpression) {
    //   const text = node.getFullText()
    //   const isZh = /[\u4e00-\u9fa5]/.test(text)
    //   if (isZh) {
    //     console.log(4);
    //     console.log(text.trim());
    //   }
    //   // 这里可以返回新的ast  
    //   return node;
    // }

    // 继续深度搜索
    if (node?.getChildCount() > 0) {
      return ts.visitEachChild(node, visitor, context);
    }

    return node;
  };
  return visitor(sourceFile)
}

export const removeImportPropTypes = (typeChecker: TypeChecker) => (
  context: TransformationContext
) => (sourceFile: SourceFile) => {
  const statements = sourceFile.statements.filter(
    s =>
      !(
        isImportDeclaration(s) &&
        isStringLiteral(s.moduleSpecifier) &&
        s.moduleSpecifier.text === 'prop-types'
      )
  )
  return updateSourceFileNode(sourceFile, statements)
}

export const addImportShark = (typeChecker: TypeChecker) => (
  context: TransformationContext
) => (sourceFile: SourceFile) => {
  const cargoImport = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      ts.createIdentifier("Shark"),
      undefined
    ),
    ts.createStringLiteral("Shark")
  )
  const statements = [cargoImport] as ts.Statement[];
  sourceFile.statements.forEach(s => { statements.push(s) })
  return updateSourceFileNode(sourceFile, statements)
}

const sourceFile = program.getSourceFile("test.tsx")!;
const result = transform(sourceFile, [scanWord(typeChecker), addImportShark(typeChecker)])


var printer = createPrinter({});
const printed = printer.printNode(
  EmitHint.SourceFile,
  result.transformed[0],
  sourceFile
)
const res = prettier.format(printed, {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  parser: 'typescript',
})

fs.writeFileSync("union.tsx", res);