// temp use
const plugins = [
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    },
  ],
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  ['./plugins/babel-plugin-replace-import.js', { from: './src/', to: './' }],
  [
    './plugins/babel-plugin-temp-search.js',
    {
      filter: [
        ['packages/api', '@portkey-wallet/api'],
        ['packages/constants', '@portkey-wallet/constants'],
        ['packages/contracts', '@portkey-wallet/contracts'],
        ['packages/graphql', '@portkey-wallet/graphql'],
        ['packages/hooks', '@portkey-wallet/hooks'],
        ['packages/i18n', '@portkey-wallet/i18n'],
        ['packages/im', '@portkey-wallet/im'],
        ['packages/ramp', '@portkey-wallet/ramp'],
        ['packages/socket', '@portkey-wallet/socket'],
        ['packages/store', '@portkey-wallet/store'],
        ['packages/types', '@portkey-wallet/types'],
        ['packages/utils', '@portkey-wallet/utils'],
      ],
    },
  ],
];
module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-react'],
  plugins: [...plugins],
  ignore: ['.babelignore'],
};
console.log('babel.temp.config.js exe!!');
