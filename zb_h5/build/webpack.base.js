/* eslint @typescript-eslint/camelcase:off, @typescript-eslint/no-var-requires:off */
let HtmlWebpackPlugin = require('html-webpack-plugin'),
  config = require('./config.js'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  WebpackI18n = require('wp-i18n-plugin'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  VueLoaderPlugin = require('vue-loader/lib/plugin.js');
const workersCount = require('os').cpus().length - 1 || 1;

const { entry, alias, esLint } = config;

let baseConfig = {
  entry,
  output: {
    hashDigestLength: 5
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: workersCount
            }
          },
          'cache-loader',
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.ts$|zb-kline\/js/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: workersCount
            }
          },
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 9,
          name: 'img/[name].[hash:3].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 9,
          name: 'font/[name].[hash:3].[ext]'
        }
      },
      {
        test: /\.(js|vue|ts|tsx|jsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: workersCount
            }
          },
          'cache-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: esLint.autoFix,
              extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
              cache: true,
              emitWarning: true,
              emitError: true
            }
          }
        ]
      }
    ]
  },
  node: false,
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/assets/static',
        to: './'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/static-download',
        to: '../download'
      }
    ]),
    new VueLoaderPlugin(),
    new DefinePlugin({
      'process.env': {
        TYPE: JSON.stringify(process.env.TYPE), // 环境type
        VERSION: JSON.stringify(require('../package.json').version) // 主版本号
      }
    }),
    // 多语言处理插件
    new WebpackI18n.Plugin({
      sourcePath: config.langs.sourcePath,
      // 自动新增i18n对象语言列表
      languageList: config.langs.languageList,
      // 设置默认将对于key设置为cn的值
      useLanguage: config.langs.useLanguage,
      // 是否根据内容自动生成对象
      autoWriteAble: true,
      // 格式化对象空格数
      formatSpace: 2,
      // 是否展示未翻译的项
      showDetail: false,
      // 自动移除无用的key
      removeUnUseKeys: true
    }),
    {
      apply(compiler) {
        compiler.hooks.compilation.tap('seo-meta', compilation => {
          HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('seo-meta', (data, cb) => {
            const { name } = compilation;
            data.plugin.options.description = config.seoMeta.description[name];
            data.plugin.options.keywords = config.seoMeta.keywords[name];
            data.plugin.options.title = config.seoMeta.title[name];
            cb(null, data);
          });
        });
      }
    }
  ]
};

let htmlMinify = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true
};
if (process.env.TYPE === 'dev') {
  htmlMinify = false;
}
Object.keys(config.views).map(item => {
  baseConfig.plugins.push(
    new HtmlWebpackPlugin({
      favicon: 'src/assets/img/favicon.ico',
      filename: `./${item}.html`,
      chunks: [item],
      template: config.views[item],
      minify: htmlMinify
    })
  );
});

module.exports = baseConfig;
