const commonConfig = require('./common');
module.exports = {
  ...commonConfig,
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  resolve: {},
};
