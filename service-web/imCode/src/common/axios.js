/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-22 09:16:37
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-18 17:43:36
 */
import axios from 'axios'
import vue from 'vue';
import router from '../router/index'

let loginIn = `/auth/oauth/token`;  // 登录不需要加token
axios.defaults.baseURL = 'https://dev-kefu.tlkj.com';
// 请求拦截器
axios.interceptors.request.use(function (config) {
  //这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
  config.headers['content-type'] = 'application/json';
  config.headers['isToken'] = false;
  config.headers['TENANT_ID'] = 1;
  config.headers['Authorization'] = 'Basic cGlnOnBpZw==';
  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Content-Security-Policy'] = 'upgrade-insecure-requests';
  //客户端 预登录更换

  if (!(config.url.indexOf(loginIn) > -1) ){
    config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem("token")
  }

  if (config.url.indexOf('/file/upload') != -1) {
    config.headers['content-type'] = 'multipart/form-data';
  }

  if ((config.url.indexOf(loginIn) > -1 && config.params.grant_type == "client")) {
    config.headers['Authorization'] = "Basic Y2xpZW50OmNsaWVudA";
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 请求失败提示拦截
  if (response.data.code != "0") {
    // 请求路径不为登录且不为导出（导出接口成功时不返回code)
    if (response.config.url.indexOf(loginIn) == -1 && response.config.url.indexOf('export') == -1) {
      vue.prototype.$message1(
        {
          message: response.data.msg,
          type: 'error',
          duration:1000
        }
      )
      return false;
    }
  }
  return response;
}, function (error) {
  if (error.response) {
    if(error.response.status == "401"){
      if(window.location.href.indexOf("imClient") > -1){
        vue.prototype.$message1(
          {
            message: "页面初始化中...",
            type: 'success'
          })
        setTimeout(() => {
          location.reload()
        }, 2000);
      }else{
        router.push({ path: "/login" });
      }
    }else{
      vue.prototype.$message1({ message: error.response.data.msg, type: 'warning' });
    }
  }
  return Promise.reject(error.response)   // 返回接口返回的错误信息
});
export default axios;
