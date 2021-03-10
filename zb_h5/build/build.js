/* eslint @typescript-eslint/camelcase:off, @typescript-eslint/no-var-requires:off */
let baseConfig = require('./webpack.base.js');
const webpack = require('webpack'),
  merge = require('webpack-merge'),
  pkg = require('../package.json'),
  config = require('./config.js'),
  Terser = require('terser-webpack-plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  chalk = require('chalk'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  WorkboxPlugin = require('workbox-webpack-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  CleanWebpackPlugin = require('clean-webpack-plugin');

const { sw, sourceMap, assetsSubDirectory, assetsPublicPath } = config.build;
process.env.SW = sw;
const attr = str => chalk.rgb(152, 195, 121)(str),
  attrValue = str => chalk.rgb(97, 175, 239)(str);
let buildConfig = {
  mode: 'production',
  externals: config.externals || {},
  performance: {
    maxEntrypointSize: 712 * 1014,
    maxAssetSize: 712 * 1014
  },
  plugins: [
    new ProgressBarPlugin({
      renderThrottle: 1,
      format: `<${chalk.magenta(process.env.TYPE)}  ${attr('progress=')}${attrValue(':percent')}  ${attr(
        'time='
      )}${attrValue(':elapseds')}  ${attr('status=')}${attrValue(':msg')} />`
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:4].css',
      chunkFilename: 'css/[name].[chunkhash:4].css',
      publicPath: '../',
      ignoreOrder: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/redirect.html',
        to: '../index.html'
      }
    ]),
    {
      // 生成service worker版本控制
      apply(compiler) {
        compiler.hooks.done.tap('cache-control', () => {
          require('fs').writeFile(
            assetsSubDirectory + '/version.json',
            JSON.stringify({
              version: pkg.version,
              ...pkg.updateControl
            }),
            {
              encoding: 'utf8'
            },
            () => {}
          );
          console.log(chalk.magenta('\nService Worker Version: ') + attr(pkg.version));
        });
      }
    }
  ],
  devtool: 'source-map',
  target: 'web',
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [...require('./utils.js').styleLoaders({ extract: true })]
  },
  output: {
    path: assetsSubDirectory,
    publicPath: assetsPublicPath,
    chunkFilename: 'js/[name].[chunkhash:4].js',
    filename: 'js/[name].[chunkhash:4].js'
  },
  optimization: {
    minimizer: [
      new Terser({
        test: /\.m?js(\?.*)?$/i,
        chunkFilter: () => true,
        warningsFilter: () => true,
        extractComments: false,
        sourceMap,
        cache: true,
        cacheKeys: defaultCacheKeys => defaultCacheKeys,
        parallel: true,
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i
          },
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'), // 默认使用 cssnano 处理 css
        cssProcessorOptions: {
          reduceIdents: false, // 禁止将 keyframes 自动更名
          mergeIdents: false, // 禁止自动合并 keyframes
          discardUnused: false, // 禁止移除掉未使用的 keyframes
          autoprefixer: false, // 禁止默认删除掉一些前缀，以减少兼容性的问题
          zindex: false, // 禁止自动转换 z-index
          map: true
        },
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: false } }]
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 3,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
};

// 多打包设置
const webpackConfig = merge({}, baseConfig, buildConfig);
const webpackConfigArr = require('./utils.js').multiCompilerConfig(webpackConfig, assetsSubDirectory + '/');
if (sw === true) {
  webpackConfigArr.map(itemConfig => {
    // mark: 完成重构之后需要修改: 使用a ssetsPublicPath
    itemConfig.output.publicPath = '/' + itemConfig.name + '/';
    itemConfig.plugins.push(new CleanWebpackPlugin());
    itemConfig.plugins.push(
      new WorkboxPlugin.GenerateSW({
        cacheId: 'zbh5-' + process.env.TYPE,
        importWorkboxFrom: 'local',
        swDest: './sw.js',
        clientsClaim: true,
        // importsDirectory: 'https://ossweb-img.qq.com/images/js/bsCommonFiles/js/new_cdn/workbox-v3.2.0/',
        precacheManifestFilename: 'sw-manifest.[manifestHash].js',
        // include: [/\.(png|jpg|gif|jpeg)$/, /\/js$/, /\.css$/],
        // include: [/\/img/, /\/js/, /\/css/],
        exclude: [
          /\.map$/,
          /img\/icons\//,
          /favicon\.ico$/,
          /^manifest.*\.json$/,
          /^sw\.js$/,
          /.DS_Store$/,
          /img\/expression\//
        ],
        // include: [/.*/],
        // importScripts: ['https://ossweb-img.qq.com/images/js/bsCommonFiles/js/new_cdn/workbox-v3-4-1/workbox-sw.js'],
        runtimeCaching: [
          {
            urlPattern: /(en|cn|js|img|css|fonts|font|trading-view)/,
            // new RegExp('^(https://ossweb-img\.qq\.com/|https://itea-cdn\.qq\.com|https://game\.gtimg\.cn)'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache' + process.env.TYPE,
              expiration: {
                maxEntries: 10, // 缓存数量最大10个
                maxAgeSeconds: 86400 * 10 // 最大缓存10天
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      })
    );
  });
}
// + 打包关系图表展示
if (Number(process.env.Analyz) === 1) {
  webpackConfigArr[0].plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8899
    })
  );
}
webpack(webpackConfigArr, (err, stats) => {
  err && console.log(err);
  stats &&
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: true
      }) + '\n\n'
    );
  if (stats && stats.hasErrors()) {
    console.log('  Build failed with errors.\n');
    process.exit(1);
  }
});
