module.exports = function (babel, options) {
  const { from = './src/', to = './' } = options;

  return {
    visitor: {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;
        if (sourceValue.startsWith(from)) {
          path.node.source.value = sourceValue.replace(from, to);
        }
      },
      ExportAllDeclaration(path) {
        const sourceValue = path.node.source.value;
        if (sourceValue.startsWith(from)) {
          path.node.source.value = sourceValue.replace(from, to);
        }
      },
    },
  };
};
