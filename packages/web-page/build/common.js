const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    loader: 'akamai',
    path: '',
    domains: ['raw.githubusercontent.com'],
  },
  productionBrowserSourceMaps: true,
  sentry: {
    hideSourceMaps: true,
  },
  webpack: config => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.ts?$/,
      exclude: '/node-modules/',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      ],
    });

    return config;
  },
};
