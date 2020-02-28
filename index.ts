import scanDir from './src/scanDir';
import transfer from './src/transfer';
import * as path from 'path'

function CutsomScan(codes: string, out: string) {
  let dirPath = path.join(__dirname + codes)
  let output = path.join(__dirname + out)
  scanDir(dirPath, output)
}

function CutsomTransfer(codes: string, input: string) {
  let _input = path.join(__dirname + input)
  transfer(_input);
}

CutsomScan("/codes", '/codesScan')
