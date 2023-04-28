/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ROOT = path.resolve(__dirname, './');
const { version } = require(path.resolve(ROOT, 'package.json'));
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const outputDir = 'public';

// TODO: Hot update, browser synchronization component
// module.exports =
let config = {
  // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
  // production will remove the 'dead code'. Look at Tree Shaking
  // mode: 'none',
  devtool: 'source-map',
  // mode: 'development',
  entry: {
    // wallet: './app/web/js/index.jsx',
    // transactionDetail: './app/web/js/transactionDetail.jsx'
    popup: './app/web/Popup/Popup.tsx',
    prompt: './app/web/Prompt/Prompt.tsx',
    serviceWorker: './app/web/serviceWorker/index.ts',
    sandboxUtil: './app/web/sandboxUtil.ts',
    content: './app/web/content.ts',
    inject: './app/web/inject.ts',
  },
  output: {
    path: path.resolve(__dirname, 'app'), // equal to __diname + '/build'
    // filename: 'public/js/[name].[hash:5].js'
    filename: `${outputDir}/js/[name].js`,
  },
  watchOptions: {},

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      'aelf-sdk$': 'aelf-sdk/dist/aelf.umd.js',
    },
    fallback: {
      // crypto: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      fs: false,
      child_process: false,
    },
    modules: [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#5b8ef4',
                  'error-color': '#FF4D4F',
                  'success-color': '#52C41A',
                  'warning-color': '#FAAD14',
                  '@ant-prefix': 'portkey',
                  '@app-prefix': 'portkey',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ico|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              // file output path
              outputPath: `${outputDir}/assets/output`,
              // path in css
              publicPath: './assets/output',
            },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    // Ignore all local files of moment.js
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebpackPlugin({
      chunks: [''],
      template: './app/web/popup.html',
      filename: `./${outputDir}/popup.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: [''],
      template: './app/web/options.html',
      filename: `./${outputDir}/options.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: [''],
      template: './app/web/prompt.html',
      filename: `./${outputDir}/prompt.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: [''],
      template: './app/web/sandbox.html',
      filename: `./${outputDir}/sandbox.html`,
    }),
    new HtmlWebpackPlugin({
      chunks: [''],
      template: './app/web/sandbox/index.html',
      filename: `./${outputDir}/sandbox-index.html`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './app/web/manifest.json',
          to: `./${outputDir}/manifest.json`,
          toType: 'file',
        },
        {
          from: './app/web/assets',
          to: `./${outputDir}/assets`,
          toType: 'dir',
        },
        {
          from: './app/web/style',
          to: `./${outputDir}/style`,
          toType: 'dir',
        },
        {
          from: './app/web/_locales',
          to: `./${outputDir}/_locales`,
          toType: 'dir',
        },
      ],
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), `./${outputDir}/*`)],
      // remove files that are not created directly by Webpack.
      // cleanAfterEveryBuildPatterns
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};

module.exports = (env, argv) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.SDK_VERSION': JSON.stringify('v' + version),
      'process.env.NODE_ENV': JSON.stringify(argv.mode),
      'process.env.NODE_DEBUG': JSON.stringify(argv.mode),
      'process.env.DEVICE': JSON.stringify('extension'),
      'process.env.SENTRY_DSN': JSON.stringify(
        'https://f439a3f5052f4a578f87a09ac11a246d@o4504399844999168.ingest.sentry.io/4504647744421888',
      ),
    }),
  );

  if (argv.mode === 'production') {
    config.plugins.push(
      new TerserPlugin({
        //   cache: true,
        parallel: true,
        extractComments: false, // Do not extract comments to separate file summary
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
        },
      }),
    );
  }

  return config;
};
