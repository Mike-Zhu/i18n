import * as fs from 'fs'
import * as path from 'path'
import tsScan, { WordInfo } from './src/tsScan'
import * as xlsx from 'xlsx'

export default function scan(fileNmae: string) {
  const list = getDir(path.join(__dirname + fileNmae), [])
  const zhObject = tsScan(list)
  exportFile(zhObject)
}

function exportFile(zhObjectList: WordInfo[]) {
  if (zhObjectList.length === 0) {
    throw new Error('搜索数据为空!')
  }
  let sheet1 = xlsx.utils.json_to_sheet(zhObjectList)
  let wb = {
    SheetNames: ['sheet1'],
    Sheets: {
      sheet1
    }
  } as xlsx.WorkBook

  xlsx.writeFile(wb, 'scan.xlsx')
}

function getFile(fileName: string, fileList: string[]) {
  let _fileList = fileList.slice();
  const TSValid = /.[t|j]s(x?)$/
  if (TSValid.test(fileName)) {
    _fileList.push(fileName)
  }
  return _fileList
}

function getDir(pathName: string, fileList: string[]) {
  const files = fs.readdirSync(pathName);
  let _fileList = fileList.slice();
  files.forEach(fileName => {
    const innerName = path.join(pathName, fileName);
    const stats = fs.statSync(innerName);
    const isDir = stats.isDirectory();
    if (isDir) {
      _fileList = getDir(innerName, _fileList)
    } else {
      _fileList = getFile(innerName, _fileList)
    }
  })
  return _fileList
}
scan('/codes')
