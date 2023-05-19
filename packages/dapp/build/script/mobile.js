const fs = require('fs');
const path = require('path');

const inpageContent = fs.readFileSync(path.resolve(__dirname, '../inpage-app.js'), 'utf-8');

const outputContent = `const inpage = "${inpageContent
  .replace(/"/g, '\\"')
  .replace(/\/\*[\s\S]*?\*\/|\/\/.*|\n/g, '')}";\nexport default inpage;\n`;
fs.writeFileSync(path.resolve(__dirname, '../../../mobile-app-did/js/utils/provider/index.js'), outputContent, 'utf-8');
