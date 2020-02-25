import * as XLSX from 'xlsx'
import * as path from 'path'
import { remoeDuplicate, WordInfo, WordMap } from './utils'
import emmiter from './emmiter'


export default function transfer(excelPath: string) {
  try {
    const wordList = readExcel(excelPath);
    const wordMap = getWordMap(wordList);
    const filenameList = Object.keys(wordMap);
    emmiter(filenameList, wordMap)
  } catch (e) {
    console.log(e)
  }

  // let _codePath = path.join(__dirname, codePath);

}

function readExcel(pathName): WordInfo[] {
  const workbook: XLSX.WorkBook = XLSX.readFile(pathName);
  const { Sheets } = workbook;
  const keyList = Object.keys(Sheets);
  const validSheet = keyList.filter((sheet) => Sheets.hasOwnProperty(sheet));
  const sheetLength = validSheet.length;

  if (sheetLength > 1) throw new Error('请输入单张表的excel!');

  if (sheetLength === 0) throw new Error('读取Excel文件出错，该文件没有创建可用表');
  const ValidSheet: XLSX.WorkSheet = Sheets[validSheet[0]];
  const list = XLSX.utils.sheet_to_json<WordInfo>(ValidSheet);
  return list
}

function getWordMap(wordList) {
  const ret = {} as WordMap;
  wordList.forEach((word: WordInfo) => {
    let { filename } = word;
    ret[filename] = ret[filename] || []
    ret[filename].push(word)
  })
  return ret;
}