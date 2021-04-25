/**
 * @file server.dev.js
 * @author lavas
 */

var LavasCore = require("lavas-core-vue");
var express = require("express");
var stoppable = require("stoppable");
var proxy = require("http-proxy-middleware");

var configPath = "./lavas.config.js";
// fix https://github.com/lavas-project/lavas/issues/50
if (process.argv.length >= 3 && process.argv[2] !== "dev") {
  configPath = process.argv[2];
}

/**
 * API Proxy Configuration
 *
 * @see https://github.com/chimurai/http-proxy-middleware
 * @type {Object}
 */
var proxyTable = {
  "/api": {
    target: "http://120.78.216.78/",
    // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
      "^/api": "/"
    }
  }
};

var port = process.env.PORT || 3000;
var core = new LavasCore(__dirname);
var app;
var server;

/**
 * start dev server
 */
function startDevServer() {
  app = express();
  core
    .build()
    .then(function() {
      // API Proxying during development
      Object.keys(proxyTable).forEach(function(pattern) {
        app.use(pattern, proxy(proxyTable[pattern]));
      });

      app.use(core.expressMiddleware());

      /**
       * server.close() only stop accepting new connections,
       * we need to close existing connections with help of stoppable
       */
      server = stoppable(
        app.listen(port, function() {
          console.log("server started at localhost:" + port);
        })
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}

/**
 * every time lavas rebuild, stop current server first and restart
 */
core.on("rebuild", function() {
  core.close().then(function() {
    server.stop();
    startDevServer();
  });
});

core
  .init(process.env.NODE_ENV || "development", true, { configPath })
  .then(function() {
    startDevServer();
  });

// catch promise error
process.on("unhandledRejection", function(err) {
  console.warn(err);
});
