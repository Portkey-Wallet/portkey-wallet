const fs = require('fs');
const path = require('path');

const fileName = 'inpage.js';

const buildMobileProvider = () => {
  const inpageContent = fs.readFileSync(path.join(__dirname, fileName)).toString();
};
