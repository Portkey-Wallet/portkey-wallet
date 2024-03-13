// this script is used to convert the export/import path of. d.ts files,
// from absolute path to relative path.
// [ yarn build ] is using this script
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const files = glob.sync('dist/**/*.{ts,tsx}');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  const regex = /(import|export)(.*from\s*['"])([^'"]+)(['"])/g;

  content = content.replace(regex, (match, p1, p2, p3, p4) => {
    if (!p3.startsWith('.')) {
      const from = path.dirname(file);
      const to = path.resolve('dist', p3);
      const relativePath = path.relative(from, to);
      return `${p1}${p2}${relativePath}${p4}`;
    }

    return match;
  });

  fs.writeFileSync(file, content);
});
