/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');
const uploadZipToWebstore = require('./uploadToWebstore');
const generateHashManifest = require('./buildTools/generateHash');
const AWS = require('aws-sdk');
require('dotenv').config();

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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

zipFolder(path.join(__dirname, 'public'), outputPath, function (err) {
  if (err) {
    console.log('❌Error compressing public folder:', err);
  } else {
    console.log(`✅ Compression successful: ${outputPath}`);

    fs.readFile(outputPath, (readErr, fileData) => {
      if (readErr) {
        console.error('❌ Error reading compressed file:', readErr);
      } else {
        const s3Params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: 'extension/eoa/' + outputFileName,
          Body: fileData,
          ContentType: 'application/zip',
        };

        console.log(`🚀 Uploading ${outputFileName} to S3...`);

        s3.upload(s3Params, (uploadErr, data) => {
          if (uploadErr) {
            console.error('❌ S3 Upload Error:', uploadErr);
          } else {
            console.log(`✅ Upload successful! S3 URL: ${data.Location}`);

            uploadZipToWebstore(outputFileName, {
              versionName,
              version,
              s3URL: data.Location
            });
          }
        });
      }
    });
  }
});
