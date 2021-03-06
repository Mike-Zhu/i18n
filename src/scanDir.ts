import * as fs from 'fs'
import * as path from 'path'
import tsScan from './tsScan'
import * as xlsx from 'xlsx'
import { WordInfo } from './utils'

export default function scanDir(fileNmae: string, output: string) {
  const list = getDir(fileNmae, [])
  const zhObject = tsScan(list)
  exportFile(zhObject, output)
}

function exportFile(zhObjectList: WordInfo[], output: string) {
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

  xlsx.writeFile(wb, `${output}.xlsx`)
}

export function getFile(fileName: string, fileList: string[]) {
  let _fileList = fileList.slice();
  const TSValid = /.[t|j]s(x?)$/
  if (TSValid.test(fileName)) {
    _fileList.push(fileName)
  }
  return _fileList
}

export function getDir(pathName: string, fileList: string[]) {
  const parentStats = fs.statSync(pathName);
  let _fileList = fileList.slice();
  if (!parentStats.isDirectory()) {
    return getFile(pathName, _fileList)
  }
  const files = fs.readdirSync(pathName);
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
