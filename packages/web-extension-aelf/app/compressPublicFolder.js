const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');

// read manifest.json file
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// format current time
const now = new Date();
const formattedTime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

// zip and rename
const outputFileName = `Portkey-v${version}-${formattedTime}.zip`;
const outputPath = path.join(__dirname, outputFileName);

zipFolder(path.join(__dirname, 'public'), outputPath, function (err) {
  if (err) {
    console.log('Error compressing public folder:', err);
  } else {
    console.log(`Compression successful: ${outputPath}`);
  }
});
