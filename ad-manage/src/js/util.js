import Vue from 'vue'
import store from '../store/store'
import router from '../router/router'
// tree
function tree(dataList) {
    let rootMenus = [];
    let map = {};
    dataList.sort((a, b) => a.parentId - b.parentId);
    dataList.forEach(res => {
        res.children = [];
        map[res.deptId] = res;
        if (res.parentId == 0) {
            rootMenus.push(res);
        } else {
            if (map[res.parentId]) {
                map[res.parentId].children.push(res)
            } else {
                throw new Error(`当前循环的数据parentId=${res.parentId}有错误`);
            }
        }
    })
    return rootMenus
}
// 菜单的tree
function menuTree(dataList) {
    let rootMenus = [];
    let map = {};
    dataList.sort((a, b) => a.parentId - b.parentId);
    dataList.forEach(res => {
        res.children = [];
        map[res.menuId] = res;
        if (res.parentId == 0) {
            rootMenus.push(res);
        } else {
            if (map[res.parentId]) {
                map[res.parentId].children.push(res)
            } else {
                throw new Error(`当前循环的数据parentId=${res.parentId}有错误`);
            }
        }
    })
    return rootMenus
}

// 菜单的tree
function permsTree(dataList) {
    let rootMenus = [];
    let map = {};
    dataList.sort((a, b) => a.parentId - b.parentId);
    dataList.forEach(res => {
        res.children = [];
        map[res.permId] = res;
        if (res.parentId == 0) {
            rootMenus.push(res);
        } else {
            if (map[res.parentId]) {
                map[res.parentId].children.push(res)
            }
        }
    })
    return rootMenus
}
/**
 * 时间格式化
 * @param date
 * @returns yyyy-mm-dd hh:mi:ss
 */
function formatterDateTime(date) {
    if (!date) {
        return "";
    }
    date = new Date(date);
    if (date.getFullYear(date) < 1900) {
        return "";
    }
    var formatDate = date.getFullYear() +
        "-" // "年"
        +
        ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) +
        "-" // "月"
        +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    return formatDate;
}
// 中国标准时间转化为年月日
function formatDateTime2 (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    h = h < 10 ? ('0' + h) : h;
    return y + '-' + m + '-' + d+' '+h+':'+minute+":"+second;
}

/**
 * 时间格式化
 * @param date
 * @returns yyyy-mm-dd
 */
function formatterDateTime3(date) {
    if (!date) {
        return "";
    }
    date = new Date(date);
    if (date.getFullYear(date) < 1900) {
        return "";
    }
    var formatDate = date.getFullYear() +
        "-" // "年"
        +
        ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) +
        "-" // "月"
        +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());

    return formatDate;
}
// 取出两个数组的相同元素
function getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
             if(arr1[j] === arr2[i]){
                 newArr.push(arr1[j]);
             }
         }
     }
    return newArr;
}
// 取出两个数组的不同元素
function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    })
}
// 采集时间
function collectTime(startTime,endTime){
    startTime = startTime.toString();
    if (startTime.length == 1) {
    	startTime = "0:00";
    } else if (startTime.length == 2) {
    	startTime = "0:" + startTime;
    } else if (startTime.length == 3) {
    	startTime = startTime.substring(0, 1) + ":" + startTime.substring(1);
    } else if (startTime.length == 4) {
    	startTime = startTime.substring(0, 2) + ":" + startTime.substring(2);
    }
    endTime = endTime.toString();
    if (endTime.length == 1) {
    	endTime = "0:00";
    } else if (endTime.length == 2) {
    	endTime = "0:" + endTime;
    } else if (endTime.length == 3) {
    	endTime = endTime.substring(0, 1) + ":" + endTime.substring(1);
    } else if (endTime.length == 4) {
    	endTime = endTime.substring(0, 2) + ":" + endTime.substring(2);
    }

    return {startTime,endTime}
}

// 格式化数字： 10k 39M
function numberFormatter(num, digits=0) {
    if(num < 10000) return num;
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

// 关闭修改标签
function delSelectTag(route){
    store.dispatch('delVisitedViews',route)
}

// 时间插件
function sys_formatDate(date, format) {
  if (!date) return;
  if (!format) format = "yyyy-MM-dd";
  switch (typeof date) {
      case "string":
          date = new Date(date);
          break;
      case "number":
          date = new Date(date);
          break;
  }
  if (!date instanceof Date) return;
  var dict = {
      "yyyy": date.getFullYear(),
      "M": date.getMonth() + 1,
      "d": date.getDate(),
      "H": date.getHours(),
      "m": date.getMinutes(),
      "s": date.getSeconds(),
      "MM": ("" + (date.getMonth() + 101)).substr(1),
      "dd": ("" + (date.getDate() + 100)).substr(1),
      "HH": ("" + (date.getHours() + 100)).substr(1),
      "mm": ("" + (date.getMinutes() + 100)).substr(1),
      "ss": ("" + (date.getSeconds() + 100)).substr(1)
  };
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
      return dict[arguments[0]];
  });
}
export {
    tree,
    menuTree,
    permsTree,
    formatterDateTime,
    getArrEqual,
    getArrDifference,
    formatDateTime2,
    formatterDateTime3,
    collectTime,
    numberFormatter,
    delSelectTag,
    sys_formatDate
}