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
// 计算时间差 返回 刚刚、几分钟前、几小时前、几天前
function handleDate(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var result = '';
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return result = "刚刚";
    }
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (parseInt(dayC) > 30) {
    result = "" + this.$format(dateTimeStamp,"yyyy-MM-dd");
    }else if(parseInt(dayC) > 1) {
    result = "" + parseInt(dayC) + "天前";
    }else if (parseInt(dayC) == 1) {
    result = "昨天";
    } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 5) {
    result = "" + parseInt(minC) + "分钟前";
    } else
    result = "刚刚";
    return result;
}

// 格式化数字： 10k 39M
function numberFormatter(num, digits) {
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
// JS生成uuid
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
  
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
  
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
  
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
  
    return uuid.join('');
  }
export {
    formatterDateTime,
    handleDate,
    uuid,
    numberFormatter
}