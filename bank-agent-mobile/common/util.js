const Utils = {
  /**
   * 时间格式化
   * @param date
   * @returns yyyy-mm-dd hh:mi:ss
   */
  formatterDateTime(date) {
    if (!date) {
      return "";
    }
    date = new Date(date);
    if (date.getFullYear(date) < 1900) {
      return "";
    }
    let formatDate =
      date.getFullYear() +
      "-" + // "年"
      (date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" + // "月"
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      " " +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    return formatDate;
  },
  /**
   * 可视化参数类型
   * @param paramArr 常量参数数组
   * @param value 需要格式化的id
   */
  visualParams(paramArr, value) {
    if (!paramArr || !(paramArr instanceof Array) || paramArr.length == 0) {
      return "-";
    }
    let str = "-";
    for (let i = 0; i < paramArr.length; i++) {
      if (paramArr[i].id == value) {
        str = paramArr[i].text;
      }
    }
    return str;
  },
  sys_formatDate(date, format) {
    if (!date) {
      return;
    }
    if (!format) {
      format = "yyyy-MM-dd";
    }
    switch (typeof date) {
      case "string":
        date = new Date(date);
        break;
      case "number":
        date = new Date(date);
        break;
      default:
        date = new Date(date);
        break;
    }
    if (!(date instanceof Date)) {
      return;
    }
    let dict = {
      yyyy: date.getFullYear(),
      M: date.getMonth() + 1,
      d: date.getDate(),
      H: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      MM: ("" + (date.getMonth() + 101)).substr(1),
      dd: ("" + (date.getDate() + 100)).substr(1),
      HH: ("" + (date.getHours() + 100)).substr(1),
      mm: ("" + (date.getMinutes() + 100)).substr(1),
      ss: ("" + (date.getSeconds() + 100)).substr(1),
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
      return dict[arguments[0]];
    });
  },

  // 获取当前服务器时间
  getRightServerTime() {
    let serverTime = JSON.parse(sessionStorage.getItem("userInfo")).serverTime;
    let clientTime = JSON.parse(sessionStorage.getItem("clientTime"));
    let differ =
      Number(clientTime) - Number(Utils.formateIOS(serverTime).getTime());
    let now = new Date().getTime();

    let serverNow = now - differ;
    return Utils.sys_formatDate(serverNow, "yyyy-MM-dd HH:mm");
  },
  // 获取当前服务器时间前一分钟
  getLastMinuteServerTime() {
    let serverTime = JSON.parse(sessionStorage.getItem("userInfo")).serverTime;
    let clientTime = JSON.parse(sessionStorage.getItem("clientTime"));
    let differ =
      Number(clientTime) - Number(Utils.formateIOS(serverTime).getTime());
    let now = new Date().getTime();
    let serverNow = now - differ - 60000;
    return Utils.sys_formatDate(serverNow, "yyyy-MM-dd HH:mm");
  },
  // 获取当前服务器时间后一分钟
  getNextMinuteServerTime() {
    let serverTime = JSON.parse(sessionStorage.getItem("userInfo")).serverTime;

    let clientTime = JSON.parse(sessionStorage.getItem("clientTime"));
    let differ =
      Number(clientTime) - Number(Utils.formateIOS(serverTime).getTime());
    let now = new Date().getTime();
    let serverNow = now - differ + 60000;
    return Utils.sys_formatDate(serverNow, "yyyy-MM-dd HH:mm");
  },
  formateIOS(time) {
    if (time) {
      let myDate = new Date(time.replace(/-/g, "/"));
      return myDate;
    } else {
      return new Date();
    }
  },
  sort_ASCII(obj) {
    let arr = new Array();
    let num = 0;
    for (let i in obj) {
      arr[num] = i;
      num++;
    }
    let sortArr = arr.sort();
    let sortObj = {};
    for (let i in sortArr) {
      if (obj[sortArr[i]] !== "" && obj[sortArr[i]] !== null) {
        sortObj[sortArr[i]] = obj[sortArr[i]];
      }
    }
    return sortObj;
  },
  joint(obj) {
    let str = "";
    for (let key in obj) {
      if (obj[key]) {
        str += key + "=" + obj[key] + "&";
      }
    }
    return str.substr(0, str.length - 1);
  },
};

export default Utils;
