/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');
const uploadZipToWebstore = require('./uploadToWebstore');
const generateHashManifest = require('./buildTools/generateHash');

// read manifest.json file
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// format current time
const now = new Date();
const formattedTime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
  now.getDate(),
).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
  now.getSeconds(),
).padStart(2, '0')}`;

// update version with formattedTime in manifest.json
const versionName = `${version}-${formattedTime}`;
manifest.version_name = versionName;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`Updated manifest version name to: ${versionName}`);

// generate hash manifest
generateHashManifest();

// zip and rename
const outputFileName = `FairyVault-v${versionName}.zip`;
const outputPath = path.join(__dirname, outputFileName);

zipFolder(path.join(__dirname, 'public'), outputPath, function (err) {
  if (err) {
    console.log('Error compressing public folder:', err);
  } else {
    console.log(`Compression successful: ${outputPath}`);
    uploadZipToWebstore(outputFileName, {
      versionName,
      version,
    });
  }
});
