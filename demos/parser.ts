import * as ts from 'ntypescript';

function printAllChildren(node: ts.Node, depth = 0) {
    console.log(new Array(depth + 1).join('----'), ts.formatSyntaxKind(node.kind), node.pos, node.end);
    depth++;
    node.getChildren().forEach(c => printAllChildren(c, depth));
}

var sourceCode = `
var foo = 123;
var foo1 = 234;
var foo3 = foo + foo1;
console.log(foo3);
`.trim();

var sourceFile = ts.createSourceFile('foo.ts', sourceCode, ts.ScriptTarget.ES5, true);
printAllChildren(sourceFile);