import scan from './src/scan';
import transfer from './src/transfer';
import * as path from 'path'

function CutsomScan(codes: string, out: string) {
  let dirPath = path.join(__dirname + codes)
  let output = path.join(__dirname + out)
  scan(dirPath, output)
}

function CutsomTransfer(codes: string, input: string) {
  let _input = path.join(__dirname + input)
  transfer(_input);
}

CutsomScan("/test", '/scantest')


CutsomScan("/test", '/scantest')
