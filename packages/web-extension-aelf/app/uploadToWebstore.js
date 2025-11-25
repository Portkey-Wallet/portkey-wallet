/* eslint-disable @typescript-eslint/no-var-requires */
const chromeWebstoreUpload = require('chrome-webstore-upload').default;
const fs = require('fs');
const path = require('path');
const { messageRobot } = require('./buildTools/larkRobot');
const { getLatestAndPreviousTag } = require('./buildTools/getGithubTags');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const larkRobot = process.env.LARK_ROBOT;

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  acc[key] = value;
  return acc;
}, {});

console.log(args, args.upload === 'true');

const uploadZipToWebstore = async (zipName, options) => {
  if (args && args.upload !== 'true') {
    console.log(`upload skipped`);
    return;
  }
  const store = chromeWebstoreUpload({
    extensionId: 'jhgjbdpoodaokoflbmdmlllgehdhkmja',
    clientId,
    clientSecret,
    refreshToken,
  });

  const zipPath = path.join(__dirname, zipName);
  const zipFile = fs.createReadStream(zipPath);

  console.log('zipPath', zipPath);
  // console.log('zipFile', zipFile);

  const response = await store.uploadExisting(zipFile);

  console.log('upload reponse', response);
  messageRobot(response, larkRobot, {
    versionName: options.versionName,
    version: options.version,
    tags: getLatestAndPreviousTag(),
  });
  return response;
};

module.exports = uploadZipToWebstore;
