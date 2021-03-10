// JS生成uuid
function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}
// 年月日 当bool传入时如果和当前年份相等就只返回年月
function formatterDateTime3(date, bool) {
  if (!date) {
    return "";
  }
  date = new Date(date);
  let now = new Date();
  if (date.getFullYear(date) < 1900) {
    return "";
  }
  var formatDate;
  if (bool && now.getFullYear(now) == date.getFullYear(date)) {
    formatDate = "";
  } else {
    formatDate = date.getFullYear() + "年"; // "年"
  }
  formatDate =
    formatDate +
    (date.getMonth() + 1 >= 10
      ? date.getMonth() + 1
      : "0" + (date.getMonth() + 1)) +
    "月" + // "月"
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "日";
  return formatDate;
}
function formartDate(time) {
  let timeContent = "刚刚";
  if (time == 0) {
    return timeContent;
  }
  let currentTimeMillis = Math.round(new Date());
  let diffMillis = currentTimeMillis - time;
  //根据时间差来计算小时数
  let diffHours = diffMillis / (60 * 60 * 1000);
  //根据时间差来计算分钟数
  let diffMinutes = diffMillis / (60 * 1000);
  //根据时差计算天数
  // long diffDay = diffHours / 24;
  let content = new Date(time);
  let month = content.getMonth() + 1;
  month = month.toString().length === 2 ? month : "0" + time;
  let day = content.getDate();
  day = day.toString().length === 2 ? day : "0" + day;
  let hour = content.getHours();
  hour = hour.toString().length === 2 ? hour : "0" + hour;
  let minute = content.getMinutes();
  minute = minute.toString().length === 2 ? minute : "0" + minute;
  let diffDay = differentDays(time, currentTimeMillis);
  if (diffDay > 3) {
    timeContent = month + "-" + day;
  } else if (diffDay >= 2 && diffDay <= 3) {
    timeContent = diffDay + "天前";
  } else if (diffDay >= 1 && diffDay < 2) {
    timeContent = "昨天 " + hour + ":" + minute;
  } else {
    if (diffMinutes == 0) {
      timeContent = "刚刚";
    } else if (diffMinutes < 60) {
      timeContent = parseInt(diffMinutes) + "分钟前";
    } else {
      timeContent = diffHours + "小时前";
    }
  }
  return timeContent;
}
function differentDays(time1, time2) {
  let date1 = new Date(time1);
  let date2 = new Date(time2);
  date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diff = date2.getTime() - date1.getTime();
  const diffDate = diff / (24 * 60 * 60 * 1000);
  return diffDate;
}
export { uuid, formartDate, formatterDateTime3 };
