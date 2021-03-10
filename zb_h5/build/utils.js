/* eslint @typescript-eslint/camelcase:off, @typescript-eslint/no-var-requires:off */
const MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  _ = require('lodash'),
  ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'),
  path = require('path'),
  config = require('./config.js');

// 多语言打包配置修改
exports.multiCompilerConfig = function(webpackConfig, baseUrl = '/') {
  let configArr = [],
    newConfig = _.cloneDeep(webpackConfig);
  config.langs.list.map(langType => {
    newConfig.name = langType;
    newConfig.output.path = baseUrl + langType;
    newConfig.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        vue: true,
        tslint: false,
        checkSyntacticErrors: true
      })
    );
    configArr.push(newConfig);
    newConfig = _.cloneDeep(webpackConfig);
  });
  return configArr;
};

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader'
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const px2remLoader = {
    loader: path.resolve(__dirname, './px-to-rem/index.js'),
    options: {
      remUnit: 37.5, // 设计稿宽度/10
      remPrecision: 7
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : ['thread-loader', cssLoader];
    if (loader) {
      loaders.push(px2remLoader);
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/assets/scss/_var.scss'),
            path.resolve(__dirname, '../src/assets/scss/_mixin.scss')
          ]
        }
      });
    }

    if (options.extract) {
      return [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: config.build.cssPublicPath
          }
        }
      ].concat(loaders);
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};
