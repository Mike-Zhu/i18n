
import * as ts from 'typescript'
import config from '../config'

// add a express
export interface WordInfo {
  content: string;
  filename: string;
  start: number;
  end: number;
  kind: number;
  replace: string;
}

export interface WordMap {
  [fileName: string]: WordInfo[];
}

interface StrObject {
  [key: string]: boolean;
}
export function remoeDuplicate<T extends string>(list: T[]): T[] {
  let _ret = [];
  let _map = {} as StrObject;

  list.forEach(str => {
    if (_map[str] !== true) {
      _map[str] = true;
      _ret.push(str)
    }
  })

  return _ret;
}

export const validKindList = [
  ts.SyntaxKind.JsxText,
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.TemplateExpression,
  ts.SyntaxKind.JsxExpression,
]

type CreateNode = (node: ts.Node, word: WordInfo) => ts.Node;

function CreateJSX(node, word) {
  return ts.createJsxExpression(
    undefined,
    CreateProperties(config.varibleName + '.' + word.replace)
  )
}


function CreateString(node, word) {
  return CreateProperties(config.varibleName + '.' + word.replace)
}

function CreateTemplateExpression(node, word) {
  ts.createJsxExpression
  return ts.createTemplateExpression(
    ts.createTemplateHead(
      "我似中文ID: ",
      "我似中文ID: "
    ),
    [
      ts.createTemplateSpan(
        CreateProperties('this.props.userinfo.eid'),
        ts.createTemplateMiddle(
          "继续中文",
          "继续中文"
        )
      ),
      ts.createTemplateSpan(
        CreateProperties('this.props.userinfo.name'),
        ts.createTemplateTail(
          "",
          ""
        )
      )
    ]
  )
}

export const createNodeList: CreateNode[] = [
  CreateJSX,
  CreateString,
  CreateTemplateExpression
]

function CreateProperties(template: string) {
  let list = template.split('.');
  let len = list.length;
  if (len === 1) return CreateIdentifierForProperty(list[0]);

  let ret = ts.createPropertyAccess(CreateIdentifierForProperty(list[0]), CreateIdentifierForProperty(list[1]) as ts.Identifier)
  if (len === 2) return ret
  for (let i = 2; i < len; i++) {
    ret = ts.createPropertyAccess(ret, CreateIdentifierForProperty(list[i]) as ts.Identifier)
  }
  return ret
}

function CreateIdentifierForProperty(Identifier: string) {
  return Identifier === 'this' ? ts.createThis() : ts.createIdentifier(Identifier);
}