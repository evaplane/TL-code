/* eslint @typescript-eslint/camelcase:off, @typescript-eslint/no-var-requires:off */
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
let isSingle =
  JSON.parse(process.env.npm_config_argv).original.indexOf('-s') > -1;

let langList = isSingle ? ['cn'] : ['cn', 'en'];
const config = {
  views: {
    // 视图
    index: resolve('src/index.html')
  }, // 入口
  entry: {
    index: [resolve('src/index.ts')]
  },
  // 多国语言设置
  langs: {
    list: langList, // 语言列表
    // 自动新增i18n对象语言列表
    useLanguage: 'cn',
    languageList: ['cn', 'en'],
    sourcePath: 'src/lang/langs.json',
    asyncSource: 'src/lang/async-error-code.json'
  },
  seoMeta: {
    description: {
      cn:
        'ZB是专业可信赖的数字资产交易网，提供BTC比特币/LTC莱特币/ETH/ETC交易信息，多重技术安全防护创造金融级别比特币交易网，保障比特币交易安全。平台运营3年多零安全事故，比特币交易免手续费，快速充值提现，7*24小时客户服务支撑，用心服务每一刻。',
      en:
        'ZB is a professional and reliable digital asset trading network, providing BTC Bitcoin/LTC Litecoin/ETH/ETC transaction information, and multiple technical security protection to create a financial level bitcoin trading network to ensure bitcoin transaction security.The platform operates more than three years of zero security incidents, bitcoin transactions are free of charge, fast recharge cash withdrawals, 7*24 hours customer service support, and every moment of service.'
    },
    keywords: {
      cn:
        '比特币,比特币行情,以太币,以太币行情,以太币交易网,以太币兑换,ZB,莱特币,比特币交易网,莱特币交易网,比特币兑换,莱特币兑换,比特币手机客户端,莱特币手机客户端,比特币P2P借贷,莱特币P2P借贷,买比特币,卖比特币,比特币,莱特币,比特币手机客户端,手机APP,bitcoin,btc,litecoin,ltc,ethereum,eth,etc,以太币价格,以太币,以太坊,以太坊价格,以太币交易 ,以太坊交易',
      en:
        'Bitcoin, Bitcoin Quotes, Ethereum, Ethereum Quotes, Ethereum Trading Network, Ethereum Exchange, ZB, Litecoin, Bitcoin Trading Network, Litecoin Trading Network, Bitcoin Exchange, Lite Currency Exchange, Bitcoin Mobile Phone Customers, Litecoin mobile client, Bitcoin P2P lending, Litecoin P2P lending, buying bitcoin, selling bitcoin, bitcoin, Litecoin, bitcoin mobile client, mobile app, bitcoin, btc, litecoin, ltc, ethereum, eth, etc, Ethereum Price, Ethereum, Ethereum, Ethereum Price, Ethereum Trading, Ethereum Trading'
    },
    title: {
      cn: '数字资产交易-用心服务每一刻',
      en: 'Digital asset trading - every moment of service'
    }
  },
  alias: {
    // 别名配置
    vue$: 'vue/dist/vue.esm.js',
    '@': resolve('src'),
    '@comps': resolve('src/components'),
    '@css': resolve('src/assets/css'),
    '@scss': resolve('src/assets/scss'),
    '@img': resolve('src/assets/img')
  },
  esLint: {
    autoFix: false // 是否自动修改代码风格
  },
  build: {
    // 打包输出配置
    sw: true, // service worker是否开启
    assetsSubDirectory: path.resolve(__dirname, '../dist/'),
    assetsPublicPath: './',
    sourceMap: false,
    cssPublicPath: '../'
  },
  dev: {
    // 开发配置
    autoOpen: false,
    port: 23333,
    assetsSubDirectory: path.join(__dirname, '../'),
    assetsPublicPath: './',
    // 静态资源访问目录
    devServerPublicPath: './',
    sourceMap: true,
    openPage: '/cn/index.html',
    // dev server跨域设置
    proxy: {
      '/trans': {
        // 普通接口
        target: 'https://trans.zbq.com/',
        pathRewrite: { '^/trans': '' },
        secure: false,
        changeOrigin: true
      },
      '/otc': {
        // 普通接口
        target: 'http://128.1.145.132:12020',
        pathRewrite: { '^/otc': '' },
        secure: false,
        changeOrigin: true
      },
      '/chattest': {
        // chat
        target: 'http://128.1.145.143:9998',
        pathRewrite: { '^/chattest': '' },
        secure: false,
        changeOrigin: true
      },
      '/kyc': {
        target: 'http://ttvip2.192-168-6-19.net',
        pathRewrite: { '^/kyc': '' },
        secure: false,
        changeOrigin: true
      }
    }
  },
  externals: {
    // vue: 'Vue', // import('vue')  => 使用全局js暴露的Vue
    // 'vue-router': 'VueRouter',
    // axios: 'axios'
  }
};

module.exports = config;
