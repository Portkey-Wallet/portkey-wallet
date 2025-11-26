/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('follow-redirects').https;

// https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot#5a997364
async function messageRobot(message, FEI_SHU_ROBOT, optionsInput) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'open.feishu.cn',
      path: '/open-apis/bot/v2/hook/' + FEI_SHU_ROBOT,
      headers: {
        'Content-Type': 'application/json',
      },
      maxRedirects: 20,
    };

    const req = https.request(options, function (res) {
      var chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function (chunk) {
        var body = Buffer.concat(chunks);
        resolve(body.toString());
        console.log('feishu post end: ', body.toString());
      });

      res.on('error', function (error) {
        reject(error);
        console.error('feishu post error: ', error);
      });
    });
    // let _message = message;
    // if (typeof message === 'object') {
    //   _message = JSON.stringify(_message);
    // }
    const postData = JSON.stringify({
      // msg_type: 'text',
      // content: {
      //   text: _message,
      // },
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: 'Chrome Extension Uploaded',
          },
          template: 'green',
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: 'EOA Extension Fairy Vault has been uploaded to the Chrome Web Store.',
            },
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**id**: ${message.id}`,
            },
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**version**: ${optionsInput.version}`,
            },
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**version name**: ${optionsInput.versionName}`,
            },
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: `**s3 URL (Can not download directly)**: ${optionsInput.s3URL}`,
            },
          },
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: '**Changelog**: Please review GitHub Compare',
            },
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: 'Github Compare',
                },
                type: 'primary',
                url: `https://github.com/Portkey-Wallet/portkey-wallet/compare/${optionsInput.tags.previousTag}...${optionsInput.tags.latestTag}`,
              },
            ],
          },
        ],
      },
    });
    req.write(postData);
    req.end();
  });
}

module.exports = {
  messageRobot,
};
