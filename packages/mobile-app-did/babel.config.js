// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAliasesFromTsConfig() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tsConfig = require('./tsconfig.json');
  const paths = tsConfig.compilerOptions.paths;
  let alias = {};
  Object.keys(paths).forEach(key => {
    alias[key] = `./${paths[key][0]}`;
  });

  return alias;
}
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    [
      'module-resolver',
      {
        // alias: getAliasesFromTsConfig(),
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: ['./js'],
      },
    ],
  ],
};
