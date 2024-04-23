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
      // ImportDeclaration(path) {
      //   const source = path.node.source.value;
      //   filter.forEach(item => {
      //     if (source.includes(item)) {
      //       path.remove();
      //     }
      //   });
      // },
      ImportDeclaration(path) {
        const source = path.node.source.value;
        filter.forEach(item => {
          if (source.includes(item)) {
            const specifiers = path.node.specifiers;
            specifiers.forEach(specifier => {
              const bindingName = specifier.local.name;
              const binding = path.scope.getBinding(bindingName);
              binding.referencePaths.forEach(refPath => {
                if (refPath.parentPath.isCallExpression() && refPath.parentPath.node.callee === refPath.node) {
                  refPath.parentPath.remove();
                } else {
                  let parentPath = refPath.parentPath;
                  while (parentPath && parentPath !== path) {
                    if (parentPath.isExpressionStatement()) {
                      parentPath.remove();
                      break;
                    }
                    parentPath = parentPath.parentPath;
                  }
                }
              });
            });
            path.remove();
          }
        });
      },
      // ImportDeclaration(path) {
      //   const source = path.node.source.value;
      //   filter.forEach(item => {
      //     if (source.includes(item)) {
      //       const specifiers = path.node.specifiers;
      //       specifiers.forEach(specifier => {
      //         const bindingName = specifier.local.name;
      //         const binding = path.scope.getBinding(bindingName);
      //         binding.referencePaths.forEach(refPath => {
      //           if (refPath.parentPath.isCallExpression() && refPath.parentPath.node.callee === refPath.node) {
      //             refPath.parentPath.remove();
      //           }
      //         });
      //       });
      //       path.remove();
      //     }
      //   });
      // },
    },
  };
};
