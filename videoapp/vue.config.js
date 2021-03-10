module.exports = {
  // 配置 axios 代理请求
  devServer: {
    host: "0.0.0.0", //ip地址
    hot: true, //热加载
    port: 8000, //端口
    https: false, //false关闭https，true为开启
    open: true, //自动打开浏览器
    proxy: {
      "/api": {
        target: "http://172.18.61.253:8812",
        // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
          "^/api": "/"
        }
      }
    }
  },
  runtimeCompiler: true,
  pwa: {
    themeColor: "#ffffff",
    msTileColor: "#ffffff",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    },
    iconPaths: {
      favicon32: "img/icons/fuji-mountain-32x32.png",
      favicon16: "img/icons/fuji-mountain-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/msapplication-icon-144x144.png"
    }
  },
  lintOnSave: process.env.NODE_ENV !== "production",
  configureWebpack: config => {
    //入口文件
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    //删除console插件
    let plugins = [
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       warnings: false,
      //       drop_console:true,
      //       drop_debugger:true
      //     },
      //     output:{
      //       // 去掉注释内容
      //       comments: false,
      //     }
      //   },
      //   sourceMap: false,
      //   parallel: true,
      // })
    ];
    //只有打包生产环境才需要将console删除
    if (process.env.VUE_APP_build_type == "production") {
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.plugin("preload").tap(options => {
      options[0] = {
        rel: "preload",
        as(entry) {
          if (/\.css$/.test(entry)) return "style";
          if (/\.(woff||ttf)$/.test(entry)) return "font";
          if (/\.png$/.test(entry)) return "image";
          return "script";
        },
        include: "allAssets",
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      };
      return options;
    });
    return config;
  }
};
