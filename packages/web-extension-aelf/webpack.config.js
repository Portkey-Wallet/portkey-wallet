console.log('load webpack.config.js!!!');
/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')

const ROOT = path.resolve(__dirname, './');
const { version } = require(path.resolve(ROOT, 'package.json'));
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const productionConfig = require(path.resolve(ROOT, 'env.config/production.json'));
const devConfig = require(path.resolve(ROOT, 'env.config/dev.json'));
const outputDir = 'public';
// TODO: Hot update, browser synchronization component
// module.exports =
let config = {
  // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
  // production will remove the 'dead code'. Look at Tree Shaking
  // mode: 'none',
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
    library: {
      type: 'umd',
    },
  },
  watchOptions: {},

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      // 'aelf-sdk$': 'aelf-sdk/dist/aelf.umd.js',
      "@noble/hashes/_assert": path.resolve(__dirname, "moduleAlias/noble-hashes/_assert.js"),
    },
    fallback: {
      // crypto: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      fs: false,
      child_process: false,
      // "vm": require.resolve("vm-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib")
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
              presets: [
                ["@babel/preset-env", { "modules": false }],
                "@babel/preset-typescript"
              ]
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
                  // 'primary-color': '#5d42ff',
                  // 'error-color': '#FF4D4F',
                  // 'success-color': '#52C41A',
                  // 'warning-color': '#ff9417',
                  // '@ant-prefix': 'portkey',
                  // '@app-prefix': 'portkey',
                  'primary-color': '#B8E1FF',
                  'error-color': '#B73907',
                  'success-color': '#23850E',
                  'warning-color': '#CDA90E',
                  '@ant-prefix': 'portkey',
                  '@app-prefix': 'portkey',
                  '@btn-primary-color': '#242424',
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
      template: './app/web/popup-init.html',
      filename: `./${outputDir}/popup-init.html`,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './app/web/manifest.json',
          to: `./${outputDir}/manifest.json`,
          toType: 'file',
        },
        {
          from: './app/web/popup-load.js',
          to: `./${outputDir}/js/popup-load.js`,
          toType: 'file',
        },
        {
          from: './app/web/assets/fonts',
          to: `./${outputDir}/assets/fonts`,
          toType: 'dir',
        },
        {
          from: './app/web/assets/js',
          to: `./${outputDir}/assets/js`,
          toType: 'dir',
        },
        {
          from: './app/web/assets/images',
          to: `./${outputDir}/assets/images`,
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
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    // TODO: Check circular dependencies
    // new CircularDependencyPlugin({
    //   // exclude detection of files based on a RegExp
    //   exclude: /node_modules/,
    //   // `onDetected` is called for each module that is cyclical
    //   // onDetected({ module: _webpackModuleRecord, paths, compilation }) {
    //   //   // `paths` will be an Array of the relative module paths that make up the cycle
    //   //   // `module` will be the module record generated by webpack that caused the cycle
    //   //   compilation.warnings.push(new Error(`---CircularDependencyPlugin ` + module + ' - ' + paths.join(' -> ')))
    //   // },
    //   cwd: process.cwd(),
    // }),
  ],
};

module.exports = (env, argv) => {
  const envConfig = {};
  if (argv.mode === 'development') {
    envConfig.SENTRY_DSN = devConfig.SENTRY_DSN;
    envConfig.IM_S3_KEY = devConfig.IM_S3_KEY;
    envConfig.IM_S3_TESTNET_KEY = devConfig.IM_S3_TESTNET_KEY;
    envConfig.FCM_PROJECT_ID = devConfig.FCM_PROJECT_ID;
    envConfig.GA_API_SECRET = devConfig.GA_API_SECRET;
    envConfig.RECAPTCHA_SITE_KEY_TESTNET = devConfig.RECAPTCHA_SITE_KEY_TESTNET;
    envConfig.RECAPTCHA_SITE_KEY_MAINNET = devConfig.RECAPTCHA_SITE_KEY_MAINNET;
  } else {
    envConfig.SENTRY_DSN = productionConfig.SENTRY_DSN;
    envConfig.IM_S3_KEY = productionConfig.IM_S3_KEY;
    envConfig.IM_S3_TESTNET_KEY = productionConfig.IM_S3_TESTNET_KEY;
    envConfig.FCM_PROJECT_ID = productionConfig.FCM_PROJECT_ID;
    envConfig.GA_API_SECRET = productionConfig.GA_API_SECRET;
    envConfig.RECAPTCHA_SITE_KEY_TESTNET = productionConfig.RECAPTCHA_SITE_KEY_TESTNET;
    envConfig.RECAPTCHA_SITE_KEY_MAINNET = productionConfig.RECAPTCHA_SITE_KEY_MAINNET;
  }

  // console.log(JSON.stringify(envConfig.SENTRY_DSN), 'SENTRY_DSN===')

  const definePlugin = new webpack.DefinePlugin({
    'process.env.SDK_VERSION': JSON.stringify('v' + version),
    'process.env.NODE_ENV': JSON.stringify(argv.mode),
    'process.env.NODE_DEBUG': JSON.stringify(argv.mode),
    'process.env.DEVICE': JSON.stringify('extension'),
    'process.env.SENTRY_DSN': JSON.stringify(envConfig.SENTRY_DSN),
    'process.env.IM_S3_KEY': JSON.stringify(envConfig.IM_S3_KEY),
    'process.env.IM_S3_TESTNET_KEY': JSON.stringify(envConfig.IM_S3_TESTNET_KEY),
    'process.env.FCM_PROJECT_ID': JSON.stringify(envConfig.FCM_PROJECT_ID),
    'process.env.GA_API_SECRET': JSON.stringify(envConfig.GA_API_SECRET),
    'process.env.RECAPTCHA_SITE_KEY_TESTNET': JSON.stringify(envConfig.RECAPTCHA_SITE_KEY_TESTNET),
    'process.env.RECAPTCHA_SITE_KEY_MAINNET': JSON.stringify(envConfig.RECAPTCHA_SITE_KEY_MAINNET),
  });

  if (argv.mode === 'development') {
    console.log(definePlugin);
  }

  config.plugins.push(definePlugin);

  // if (argv.mode === 'development') {
  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.afterEmit.tapAsync("PostBuildCodeReplacePlugin", (compilation, callback) => {
        console.log('🔧 Running automatic code replacement...');
        const { exec } = require('child_process');
        const scriptPath = path.resolve(__dirname, 'scripts/replace-code.js');

        exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Auto code replacement error:', error);
            return callback(error);
          }
          if (stderr) {
            console.error('⚠️  Auto code replacement stderr:', stderr);
          }
          if (stdout) {
            console.log(stdout);
          }
          console.log('✅ Auto code replacement completed');
          callback();
        });
      });
    },
  });
  // }

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
  } else {
    config.devtool = 'source-map';
  }

  return config;
};
