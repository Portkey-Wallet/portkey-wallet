console.log('Babel config is being read');
const plugins = [
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    },
  ],
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['../../plugins/babel-plugin-environment-inject.js', { environment: 'SDK' }],
  // ['./plugins/babel-plugin-replace-import.js', { from: './src/', to: './' }],
];
module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-typescript'],
  plugins: [...plugins],
  ignore: ['.babelignore'],
};
