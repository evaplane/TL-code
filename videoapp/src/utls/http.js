import axios from "axios";
var baseUrl = "api/";
axios.defaults.withCredentials = true;
import { uuid } from "./utls.js";
function makeDeviceId() {
  let id = localStorage.getItem("linkuu");
  if (id) {
    return id;
  } else {
    id = "pwa" + uuid(9, 64);
    localStorage.setItem("linkuu", id);
    return id;
  }
}
// 随机数
function RandomNumBoth(Min = 1000000, Max = 9999999) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
let getuuID = makeDeviceId();
let token;
// axios的 拦截器
// 请求拦截器 请求发送之前 执行
axios.interceptors.request.use(
  config => {
    config.baseURL = baseUrl;
    if (config.method == "post") {
      if (config.url.indexOf("api/") == -1) {
        config.headers["Content-Type"] = "application/json";
        if (Object.prototype.toString.call(config.data) !== "[object String]") {
          for (let i in config.data) {
            if (typeof config.data[i] == "string") {
              config.data[i] = config.data[i].trim();
            }
          }
          config.data = JSON.stringify(config.data);
        }
      } else {
        config.url = config.url.slice(config.url.indexOf("/"));
      }
    } else if (config.method == "get") {
      if (config.url.indexOf("api/") == -1) {
        config.params = {
          ...config.params
        };
      } else {
        config.url = config.url.slice(config.url.indexOf("/"));
      }
    }
    config.headers["X-DeviceId"] = getuuID;
    config.headers["X-Channel"] = "h5";
    config.headers["X-Auth-Token"] = token;
    config.headers["X-UUID"] = getuuID + new Date().valueOf() + RandomNumBoth();
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// response拦截器==>对响应做处理
axios.interceptors.response.use(
  response => {
    if(response.config.url.indexOf("/user/autoRegLogin") > -1){
      console.log(response.data)
      console.log(response.data.data.token)
      if(response.data){
        token = response.data.data.token;
      }
    }
    //成功请求到数据
    return response.data;
  },
  error => {
    if (error.response.config.url.indexOf("/user/autoRegLogin") > -1) {
      return error.response;
    } else {
      return Promise.reject(error);
    }
  }
);
// get请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
