/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { readSvgs } = require('./getSvg');

function randomCoding() {
  const result = [];
  // random generate 10 letters
  for (let i = 0; i < 10; i++) {
    // random 0 ～ 25
    const ranNum = Math.ceil(Math.random() * 25);
    // a-z ASCII 97 ～ 97+25
    result.push(String.fromCharCode(97 + ranNum));
  }
  return result.join('');
}

const chineseReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

// handle svgs
readSvgs()
  .then(async (data) => {
    const obj = Object.assign.apply(this, data);
    delete obj[''];
    const svgList = Object.entries(obj);
    for (let i = 0, length = svgList.length; i < length; i++) {
      const [key, value] = svgList[i];
      const newPath = path.resolve(__dirname, `./svgIcon/${key}.svg`);
      let newData = value;
      if (chineseReg.test(value)) {
        newData = value
          // eslint-disable-next-line no-useless-escape
          .replace(/<\?xml.*?\?>|<\!--.*?-->|<!DOCTYPE.*?>/g, '')
          .replace(/id="[^"]+"/g, () => `id="${randomCoding()}"`)
          .replace(/<title>[^<]+<\/title>/g, () => `<title>${randomCoding()}</title>`);
      }

      await fs.writeFileSync(newPath, newData);
    }
  })
  .catch((err) => {
    throw new Error(err);
  });
