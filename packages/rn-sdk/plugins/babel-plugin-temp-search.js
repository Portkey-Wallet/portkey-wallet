let count = 0;
module.exports = function (babel, options) {
  const { filter } = options;
  console.log('filter', filter);
  console.log();
  const needSearchFilter = filter.map(item => {
    return item[0];
  });
  const full = filter.reduce((obj, item) => {
    obj[item[0]] = item[1];
    return obj;
  }, {});
  console.log('needSearchFilter', needSearchFilter);
  console.log('full', full);
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const filename = path.hub.file.opts.filename;
        const regex = /rn-sdk\/src\/packages\//;
        const match = filename.match(regex);
        if (match) {
          // console.log(`${filename} do not need search!!!`);
          return;
        }
        needSearchFilter.forEach(item => {
          if (source.includes(item)) {
            const value = full[item];
            // path.node.source.value = ;
            console.log(
              `Found ${item} in file ${filename} at line ${
                path.node.loc.start.line
              }, replace \n${source} \nto \n${source.replace(item, value)}`,
            );
            console.log();
            console.log(`${++count} times`);
          }
        });
      },
    },
  };
};
// @portkey-wallet/api