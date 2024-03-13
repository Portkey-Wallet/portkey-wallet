const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, `../constants-ca/network.ts`);

let fileName = 'network-testnet';

if (process.argv[2]) {
  const arg = process.argv[2].replace(/^[-]+|[-]+$/g, '');
  if (/^network/.test(arg)) fileName = arg;
}

fs.writeFileSync(filePath, `export * from './${fileName}';\n`);
