/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const DEFAULT_DIST_DIR = path.join(__dirname, '../public');
const DEFAULT_HASH_MANIFEST = path.join(__dirname, '../public/hash-manifest.json');

/**
 * calculate the SHA-256 hash of a file
 * @param {string} filePath path to the file
 * @returns {string} hash value
 */
function computeFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * get all files in a directory recursively
 * @param {string} dir - directory path
 * @returns {string[]} list of file paths
 */
function getAllFiles(dir) {
  let fileList = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fileList = fileList.concat(getAllFiles(fullPath));
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

/**
 * generate hash manifest for all files in the DIST_DIR
 */
function generateHashManifest(DIST_DIR = DEFAULT_DIST_DIR, HASH_MANIFEST = DEFAULT_HASH_MANIFEST) {
  const files = getAllFiles(DIST_DIR);
  const hashManifest = {};
  files.forEach((file) => {
    const relativePath = path.relative(DIST_DIR, file);
    hashManifest[relativePath] = computeFileHash(file);
  });
  fs.writeFileSync(HASH_MANIFEST, JSON.stringify(hashManifest, null, 2));
  console.log(`✅ hash manifest generated at: ${HASH_MANIFEST}`);
}

module.exports = generateHashManifest;
