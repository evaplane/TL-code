/* eslint @typescript-eslint/camelcase:off, @typescript-eslint/no-var-requires:off */
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const baseConfig = require('./webpack.base.js'),
  webpack = require('webpack'),
  FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'),
  merge = require('webpack-merge'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./config.js'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  opn = require('opn'),
  path = require('path'),
  chalk = require('chalk');
const { port, autoOpen, proxy, openPage, assetsSubDirectory } = config.dev;
let isFirst = true,
  customParams = JSON.parse(process.env.npm_config_argv).original,
  newPort = port,
  portParamsIndex = customParams.indexOf('-p'),
  isAutoOpen = autoOpen;
if (portParamsIndex > -1) {
  let tempPort = customParams[portParamsIndex + 1];
  if (tempPort > 0) {
    newPort = customParams[portParamsIndex + 1];
  } else {
    console.log(chalk.red('端口号设置错误, 正确方式: -p 8080'));
    return;
  }
}
if (customParams.indexOf('-o') > -1) {
  isAutoOpen = true;
}
const attr = str => chalk.rgb(152, 195, 121)(str),
  attrValue = str => chalk.rgb(97, 175, 239)(str);
let devConfig = {
  output: {
    filename: 'js/[name].js',
    publicPath: './'
  },
  mode: 'development',
  devtool: '#eval-source-map',
  module: {
    rules: [...require('./utils.js').styleLoaders({ extract: false })]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new ProgressBarPlugin({
      renderThrottle: 1,
      format: `<${chalk.magenta(process.env.TYPE)}  ${attr('progress=')}${attrValue(':percent')}  ${attr(
        'time='
      )}${attrValue(':elapseds')}  ${attr('status=')}${attrValue(':msg')} />`,
      callback: async function() {
        if (isFirst === false) return;
        isFirst = false;
        let url = 'http://localhost:' + newPort + openPage;
        if (isAutoOpen) {
          await opn(url);
        }
        setTimeout(() => {
          console.log(`\nStarting server on ${url}  ||  http://${require('ip').address()}:${newPort + openPage}`);
        }, 1000);
      }
    })
  ]
};
let webpackConfig = merge({}, baseConfig, devConfig);
const webpackConfigArr = require('./utils.js').multiCompilerConfig(webpackConfig, path.join(__dirname, '../'));
let devPublicPath = '/cn/';
if (webpackConfigArr.length > 1) {
  devPublicPath = '/';
}
const opts = {
  contentBase: [assetsSubDirectory],
  hot: true,
  host: '0.0.0.0',
  compress: true,
  noInfo: false,
  quiet: false,
  disableHostCheck: true,
  publicPath: devPublicPath,
  overlay: {
    warnings: true,
    errors: true
  },
  proxy,
  stats: 'errors-only'
};
WebpackDevServer.addDevServerEntrypoints(webpackConfigArr[0], opts);
const compiler = webpack(webpackConfigArr);

new WebpackDevServer(compiler, opts).listen(newPort, '0.0.0.0');
