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
  ['./plugins/babel-plugin-remove-dev.js', { filter: ['apiTest', 'tests'] }],
];
module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-react'],
  plugins: [...plugins],
  ignore: ['.babelignore'],
};
console.log('babel.npm.config.js exe!!');
