const plugins = [
  // [
  //   require.resolve('babel-plugin-module-resolver'),
  //   {
  //     root: ['./js/'],
  //     alias: {
  //       'portkey-app': '../mobile-app-did/js',
  //     },
  //   },
  // ],
  [
    'module-resolver',
    {
      // alias: getAliasesFromTsConfig(),
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      root: ['./js'],
    },
  ],
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [...plugins],
};
