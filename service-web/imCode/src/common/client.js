/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-09-03 18:06:15
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-18 17:47:27
 */
const NODE_ENV = process.env.NODE_ENV;
// const hostname = window.location.hostname || document.location.hostname
const hostname = 'https://dev-kefu.tlkj.com'
const config = {
     production: {
      client_api: 'dev-kefu.tlkj.com' , //生产聊天地址，勿动
      server_api: hostname   //生产后台地址，勿动
     },
     development: {
        client_api: 'dev-kefu.tlkj.com', // 测试聊天地址
      //   client_api: '192.168.1.111:2048',
      //   server_api: '192.168.1.111:8088'
        server_api: 'https://dev-kefu.tlkj.com' // 测试后台地址
     },
     test: {
        client_api: hostname,
        server_api: hostname + ':8088'
     }
}
module.exports = config[NODE_ENV];
