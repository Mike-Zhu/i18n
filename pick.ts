import scan from './src/scan';
import transfer from './src/transfer';
import * as path from 'path'

function CutsomScan(codes: string, out: string) {
  let dirPath = path.join(__dirname + codes)
  let output = path.join(__dirname + out)
  scan(dirPath, output)
}

CutsomScan("/codes", '/test')


