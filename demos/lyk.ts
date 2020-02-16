import * as ts from 'typescript'
export function createTransformationContext() {
  return {
    getCompilerOptions() {
      return {} as ts.CompilerOptions;
    },
    startLexicalEnvironment() { },
    endLexicalEnvironment() { },
    suspendLexicalEnvironment() { },
    resumeLexicalEnvironment() { },
  } as ts.TransformationContext;
}

const ctx = createTransformationContext()

export const visitor = (node: ts.Node): any => {

  if (node.kind === ts.SyntaxKind.EnumDeclaration) {
    // 这里可以返回新的ast  
    return node;
  }

  // 继续深度搜索
  if (node?.getChildCount() > 0) {
    return ts.visitEachChild(node, visitor, ctx);
  }

  return node;
};

let codeStr = `
  
      let a = 1;
      let b = 2;

      export default function() {
        console.log(a,b)
      }
  `


const resultFile = ts.createSourceFile(
  'result.ts',
  codeStr,
  ts.ScriptTarget.Latest,
      /*setParentNodes*/ true,
  ts.ScriptKind.TS
);


visitor(resultFile)