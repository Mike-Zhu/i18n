import * as ts from 'ntypescript';

var sourceCode = `
function View(){
  return (
    <>
      <a>123</a>
      <a>说什么呢</a>
    </>
  )
}
`.trim();

function printAllChildren(node: ts.Node, depth = 0) {
  let synyaxName = ts.syntaxKindToName(node.kind);
  let content = sourceCode.slice(node.pos, node.end)
  if (synyaxName === 'Identifier') {
    console.log(`i find a Identifier, content is ${content}`)
  }
  // console.log(
  //   new Array(depth + 1).join('----'),
  //   synyaxName,
  //   node.pos,
  //   node.end,
  //   `"${content}"`);
  depth++;
  node.getChildren().forEach(c => printAllChildren(c, depth));
}



var sourceFile = ts.createSourceFile('foo.ts', sourceCode, ts.ScriptTarget.ES5, true);
printAllChildren(sourceFile);