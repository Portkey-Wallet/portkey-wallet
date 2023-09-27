const plugins = [
  [
    'module-resolver',
    {
      root: ['./js/'],
      alias: {
        '@portkey-app': '../mobile-app-did/js',
      },
    },
  ],
];

module.exports = {
  plugins: [...plugins],
};
