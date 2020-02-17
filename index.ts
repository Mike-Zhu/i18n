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

  let _headers = Object.keys(zhObjectList[0])
  let headers = _headers.map((v, i) => {
    return {
      v,
      position: String.fromCharCode(65 + i) + 1
    }
  })
    .reduce((prev, next) => ({
      ...prev,
      [next.position]: {
        v: next.v
      }
    }), {})

  let data = zhObjectList
    .map((value, index) => _headers.map((key, jIndex) => {
      return {
        v: value[key],
        position: String.fromCharCode(65 + jIndex) + (index + 2)
      }
    })
    )
    .reduce((prev, next) => prev.concat(next))
    .reduce((prev, next) => ({
      ...prev,
      [next.position]: {
        v: next.v
      }
    }), {})
  // 合并 headers 和 data
  var output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output);
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  let wb = {
    SheetNames: ['sheet1'],
    Sheets: {
      "sheet1": {
        "!ref": ref,
        ...output
      }
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
