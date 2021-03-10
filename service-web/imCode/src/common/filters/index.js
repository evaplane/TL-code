/**
 * 日期格式化
 * @param {*} value 时间值
 * @param {*} fmt 日期格式
 */
export function dataFormat(date, format) {
    
    // let getDate = new Date(date);
    // let o = {
    //     'M+': getDate.getMonth() + 1,
    //     'd+': getDate.getDate(),
    //     'h+': getDate.getHours(),
    //     'm+': getDate.getMinutes(),
    //     's+': getDate.getSeconds(),
    //     'q+': Math.floor((getDate.getMonth() + 3) / 3),
    //     'S': getDate.getMilliseconds()
    // };
    // if (/(y+)/.test(format)) {
    //     format = format.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    // }
    // for (let k in o) {
    //     if (new RegExp('(' + k + ')').test(format)) {
    //         format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    //     }
    // }
    // return format;

    // 兼容IE
    var time;
    if (!date) return "";
    if (typeof date === 'string') {
        time = new Date(date.replace(/-/g, '/').replace(/T|Z/g, ' ').trim());
    } else if (typeof date === 'object') {
        time = new Date(date);
    }
    var o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
};

export function getStatus(key) {
    let status = '';
    switch (key) {
        case 0:
            status = "待分配"
            break
        case 1:
            status = "待回复"
            break
        case 2:
            status = "处理中"
            break
        case 3:
            status = "已解决"
            break
        case 4:
            status = "不需处理"
            break
    }
    return status
};

export function qqemojiEmoji(value) {
    if (value == undefined) {
        return;
    }
    var self = this;

    return value.replace(/\[(.+?)\]/g, function (item, value) {
        console.log(value.replace(/\[(.+?)\]/g));
        console.log(value);
        return self.$refs.qqemoji.getImgByFaceName(value);
    });
}
