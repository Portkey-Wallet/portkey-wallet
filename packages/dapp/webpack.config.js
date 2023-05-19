const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './build/output-app.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'inpage-app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    // do not generate any lincense declaration
    new webpack.BannerPlugin({
      banner: '',
      raw: true,
      entryOnly: true,
    }),
  ],
};
