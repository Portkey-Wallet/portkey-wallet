/* eslint-disable @typescript-eslint/no-var-requires */
var fs = require('fs');
var path = require('path');
const svgDir = path.resolve(__dirname, './icons');

function readfile(filename) {
  let nameNeedLength = filename.lastIndexOf('.');

  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function (err, data) {
      const key = filename.slice(0, nameNeedLength);
      let viewBox = data.match(/viewBox="\d*\s\d*\s\d*\s\d*"/g)[0];
      let svgMatch = data.match(/[width|height]="\d*px"/g);
      // data = data.replace(/^(<svg)(.*)(xlink)">$/g, `<svg viewBox="${viewBox}" version="1.1">`);
      data = data.replace(/(width|height)="\d*px"/g, '');
      data = data.replace(/\s+xmlns(:\w+)?="[^"]*"/g, '');

      console.log(data, viewBox, svgMatch);
      if (err) reject(err);
      resolve({
        [key]: data,
      });
    });
  });
}

function readSvgs() {
  return new Promise((resolve, reject) => {
    fs.readdir(svgDir, function (err, files) {
      if (err) reject(err);
      files = files.filter((filename) => {
        let nameNeedLength = filename.lastIndexOf('.');
        let fileNameLength = filename.length;
        if (filename.slice(nameNeedLength, fileNameLength) !== '.svg') {
          return false;
        }
        return true;
      });

      Promise.all(files.map((filename) => readfile(filename)))
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  });
}

readSvgs()
  .then((data) => {
    // console.log('data: ', data);
    let svgFile = 'export default ' + JSON.stringify(Object.assign.apply(this, data), null, 2);
    fs.writeFile(path.resolve(__dirname, './iconV3Svgs.ts'), svgFile, function (err) {
      if (err) throw new Error(err);
    });
  })
  .catch((err) => {
    throw new Error(err);
  });
