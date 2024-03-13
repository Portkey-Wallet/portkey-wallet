/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { readSvgs } = require('./getSvg');

// generate svgs
readSvgs()
  .then(data => {
    const obj = Object.assign.apply(this, data);
    delete obj[''];
    let svgFile = '/* eslint-disable prettier/prettier */\nexport default ' + JSON.stringify(obj);
    fs.writeFile(path.resolve(__dirname, './svgs.js'), svgFile, function (err) {
      if (err) throw new Error(err);
    });
  })
  .catch(err => {
    throw new Error(err);
  });
