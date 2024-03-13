module.exports = function (babel, options) {
  const { types: t } = babel;
  const { filter } = options;
  return {
    name: 'remove-dev-blocks',
    visitor: {
      IfStatement(path) {
        const test = path.node.test;
        if (t.isIdentifier(test) && test.name === '__DEV__') {
          path.remove();
        }
      },
      ImportDeclaration(path) {
        const source = path.node.source.value;
        filter.forEach(item => {
          if (source.includes(item)) {
            path.remove();
          }
        });
      },
    },
  };
};
