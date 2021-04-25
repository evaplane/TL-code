import axios from "./index";
let prefix;
if (process.env.NODE_ENV == "development") {
  prefix = "/api/bank-web";
} else {
  prefix = "/bank-web";
}
/**
 * 登录接口
 * @param {Object} data 用户登录表单数据，内部需要添加一个固定变量userType:10
 */
export function login(data) {
  return axios({
    url: `${prefix}/mobile/mobileDlsLogin/appUserLogin`,
    method: "post",
    data
  });
}

/**
 * 获取验证码接口
 */
export function getRandomCode(data) {
  return axios({
    url: `${prefix}/mobile/mobileDlsLogin/getRandomCodePic`,
    method: "post",
    responseType: "arraybuffer",
    data
  });
}

/**
 * 登出系统
 */
export function logout(data) {
  return axios.post(`${prefix}/mobile/mobileDlsLogin/userLogout`, data);
}

/**
 * 代理余额查询
 */
export function getDlsAcctInfo(data) {
  return axios.post(`${prefix}/mobile/mobileDlsAgent/queryDlsAcctInfo`, data);
}
/**
 * 获取已登录账号
 */
export function getDlsBankList(data) {
  return axios.post(`${prefix}/mobile/mobileDlsAgent/queryDlsBankList`, data);
}

/**
 * 获取付款订单
 */
export function getPayOrder(data) {
  return axios.post(`${prefix}/mobile/mobileDlsOrderFlow/pageList`, data);
}

/**
 * 付款抢单
 */
export function grabTransOrder(data) {
  return axios.post(`${prefix}/mobile/mobileDlsOrderFlow/grabTransOrder`, data);
}

/**
 * 付款订单失败
 */
export function doManualFailOrder(data) {
  return axios.post(
    `${prefix}/mobile/mobileDlsOrderFlow/doManualFailOrder`,
    data
  );
}

/**
 * 判断是否验签
 */
export function getSysConstans(data) {
  return axios.post(`${prefix}/mobile/mobileDlsLogin/getSysConstans`, data);
}
