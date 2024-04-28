const environments = ['APP', 'SDK'];
module.exports = function ({ types: t }, options) {
  const { environment } = options;
  if (!environments.includes(environment)) {
    console.error('environment params must be APP or SDK');
    return;
  }
  return {
    visitor: {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;
        if (environment === 'APP') {
          if (sourceValue === '@portkey-wallet/rn-inject-sdk') {
            path.node.source.value = '@portkey-wallet/rn-inject-app';
          }
        } else {
          if (sourceValue === '@portkey-wallet/rn-inject-app') {
            path.node.source.value = '@portkey-wallet/rn-inject-sdk';
          }
        }
      },

      AssignmentExpression(path, state) {
        const { left, right } = path.node;
        if (
          t.isMemberExpression(left) &&
          t.isIdentifier(left.object.object, { name: 'Inject' }) &&
          t.isIdentifier(left.object.property, { name: 'prototype' }) &&
          t.isIdentifier(left.property, { name: 'isAPP' }) &&
          t.isFunctionExpression(right)
        ) {
          right.body = t.blockStatement([t.returnStatement(t.booleanLiteral(environment === 'APP' ? true : false))]);
        }
        if (
          t.isMemberExpression(left) &&
          t.isIdentifier(left.object.object, { name: 'Inject' }) &&
          t.isIdentifier(left.object.property, { name: 'prototype' }) &&
          t.isIdentifier(left.property, { name: 'isSDK' }) &&
          t.isFunctionExpression(right)
        ) {
          right.body = t.blockStatement([t.returnStatement(t.booleanLiteral(environment === 'SDK' ? true : false))]);
        }
      },
    },
  };
};
