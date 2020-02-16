import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import tsScan from './src/tsScan'

export default function scan(fileNmae: string) {
  const list = getDir(path.join(__dirname + fileNmae), [])
  const zhObject = tsScan(list)
  fs.writeFileSync("union.json", JSON.stringify(zhObject));
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
