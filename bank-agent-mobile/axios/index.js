import axios from "axios";
import Vue from "vue";
import qs from "qs";
import MD5 from "md5";
const Axios = axios.create({
  timeout: 10000,
  responseType: "json",
  withCredentials: true,
  headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }
});

Axios.interceptors.request.use(
  config => {
    if (sessionStorage.userInfo) {
      let serverTime = Vue.prototype.$utils.getRightServerTime();
      let loginKey = JSON.parse(sessionStorage.getItem("userInfo")).loginKey;
      let _sys_login_token = JSON.parse(sessionStorage.getItem("userInfo"))
        .loginToken;
      if (sessionStorage.agentParamValue) {
        let paramValue = JSON.parse(sessionStorage.getItem("agentParamValue"))
          .paramValue;
        if (paramValue != 99) {
          console.log(222);
          const sortASCII = Vue.prototype.$utils.sort_ASCII({
            _sys_encryp_str: MD5(_sys_login_token + serverTime + loginKey),
            _sys_login_token,
            ...config.data
          });
          const sortStr = Vue.prototype.$utils.joint(sortASCII);
          config.headers.signedMsg = MD5(
            sortStr + _sys_login_token + serverTime + loginKey
          );
          config.data = qs.stringify(sortASCII);
        } else {
          config.data = qs.stringify({
            _sys_encryp_str: MD5(_sys_login_token + serverTime + loginKey),
            _sys_login_token,
            ...config.data
          });
        }
      } else {
        config.data = qs.stringify({
          _sys_encryp_str: MD5(_sys_login_token + serverTime + loginKey),
          _sys_login_token,
          ...config.data
        });
      }
    } else {
      config.data = qs.stringify({ ...config.data });
    }

    return config;
  },
  error => {
    throw new Error(error);
  }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data && res.data.retCode && res.data.retMsg) {
      let code = res.data.retCode;
      switch (code) {
        case "000000":
          break;
        case "888888":
          Vue.prototype.$notify({
            type: "danger",
            message: "会话超时,请重新登录"
          });
          sessionStorage.removeItem("userInfo");
          sessionStorage.removeItem("clientTime");
          sessionStorage.removeItem("agentParamValue");
          break;
        case "000032":
          Vue.prototype.$notify({
            type: "danger",
            message: "加解密异常,请重新登录"
          });
          sessionStorage.removeItem("userInfo");
          sessionStorage.removeItem("clientTime");
          sessionStorage.removeItem("agentParamValue");
          break;
        default:
      }
      if (sessionStorage.agentParamValue) {
        let paramValue1 = JSON.parse(sessionStorage.getItem("agentParamValue"))
          .paramValue;
        //  验证签名
        if (res.headers.signedmsg && paramValue1 != 99) {
          const data = JSON.stringify(res.data);
          const loginKey1 = JSON.parse(sessionStorage.getItem("userInfo"))
            .loginKey;
          const _sys_login_token1 = JSON.parse(
            sessionStorage.getItem("userInfo")
          ).loginToken;
          let serverTime = Vue.prototype.$utils.getRightServerTime();
          let serverLastMinute = Vue.prototype.$utils.getLastMinuteServerTime();
          let serverNextMinute = Vue.prototype.$utils.getNextMinuteServerTime();
          let msgNow = MD5(data + _sys_login_token1 + serverTime + loginKey1);
          let msgPast = MD5(
            data + _sys_login_token1 + serverLastMinute + loginKey1
          );
          let msgNext = MD5(
            data + _sys_login_token1 + serverNextMinute + loginKey1
          );
          if (
            res.headers.signedmsg.toLowerCase() != msgNow.toLowerCase() &&
            res.headers.signedmsg.toLowerCase() != msgPast.toLowerCase() &&
            res.headers.signedmsg.toLowerCase() != msgNext.toLowerCase()
          ) {
            Vue.prototype.$notify({
              type: "danger",
              message: "验证签名不匹配，请重新登录"
            });
            // window.location.href = "/";
            sessionStorage.removeItem("userInfo");
            sessionStorage.removeItem("clientTime");
            sessionStorage.removeItem("agentParamValue");
            return;
          }
        }
      }
    }
    return res.data;
  },
  error => {
    console.log(error);
    if (error.response) {
      let status = error.response.status;
      if (status === 401) {
        window.location.href = "/";
      } else if (/^5/.test(status)) {
        Vue.prototype.$notify({
          type: "danger",
          message: "网络波动,请稍后再试"
        });
      }
    } else {
      Vue.prototype.$notify({
        type: "danger",
        message: "网络波动,请稍后再试"
      });
    }

    // 返回 response 里的错误信息
    let errorInfo = error.data.error ? error.data.error.message : error.data;
    console.log(errorInfo);

    return Promise.reject(errorInfo);
  }
);

export default Axios;
