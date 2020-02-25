import * as ts from 'typescript'
import { createProgram, transform, TypeChecker, TransformationContext } from 'typescript'
import { SourceFile } from 'typescript'
import { WordInfo, validKindList, WordMap, createNodeList } from './utils'

export default function tsEmmiter(fileList: string[], wordMap: WordMap) {
  console.log({
    fileList,
    wordMap
  })
  var cmd = ts.parseCommandLine(fileList); // replace with target file
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

  const scanWord = (typeChecker: TypeChecker, filename: string) => (
    context: TransformationContext
  ) => (sourceFile: SourceFile) => {
    const wordList = wordMap[filename];

    const isZh = (text) => /[\u4e00-\u9fa5]/.test(text)

    const visitor = (node: ts.Node): any => {

      if (
        validKindList.includes(node.kind)
      ) {
        const text = node.getFullText()
        const start = node.getFullStart();
        const end = start + node.getFullWidth();
        const word = wordList.find(_word => _word.start === start && _word.end === end);
        const index = validKindList.indexOf(node.kind)
        if (!word) {
          return node;
        }
        const func = createNodeList[index];
        return func(node, word)
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
    transform(sourceFile, [scanWord(typeChecker, sourceFile.fileName)])
    return
  })
}
