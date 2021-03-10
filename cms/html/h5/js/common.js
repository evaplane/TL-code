// var uploadImg_url = "/images/";
var userJsonLocal = '';
if (localStorage.getItem('userJsonLocal') != '') {
    userJsonLocal = eval('(' + localStorage.getItem('userJsonLocal') + ')');
} else {
    window.location.href = "../../html/login.html";
}

$(function () {
    if (userJsonLocal === null || userJsonLocal == "") {
        window.location.href = "../../html/login.html";
    } else {
        // headCommon();
    }
    // 功能区左侧菜单栏
    // $('.headerCenter ul li').click(function () {
    //     window.location.href = $(this).children('a').attr('href');
    //     localStorage.setItem('id', $(this).attr('id'));
    // });
    // var id = localStorage.getItem('id');
    // $("#" + id).addClass('active').siblings().removeClass('active');
});

/**
 * 获取token
 * @returns {String}
 */
function login_token() {
    var login_token = window.localStorage.getItem('userJsonLocal');
    var token = $.parseJSON(login_token).token;
    return token;
}

/***
 * 退出登录
 */
// function logout() {
//     //加载参数
//     var params = {
//         _sys_login_token: login_token()
//     };
//     Ewin.confirm({
//         message: '确认退出登录？'
//     }).on(function (e) {
//         if (e) {
//             sendAjax('POST', host_url + "/user/logout", params, function (res) {
//                 if (res.retCode == "000000") {
//                     window.location.href = "../../html/login.html";
//                 } else {
//                     Ewin.alert({
//                         message: res.retMsg
//                     });
//                     return false;
//                 }
//             });
//         }
//     });

// }


// 公共头部
// function headCommon() {
//     var headhtml = '';
//     headhtml += '<div class="w">' +
//         '<div class="headerLogo"><img th:src="@{/img/logo.png}"></div>' +
//         '<div class="headerCenter">' +
//         '<ul>' +
//         '<li id="group"><a href="/page/group/index"><span>组管理</span></a></li>' +
//         '<li id="wxinfo" class="active"><a href="/page/wxinfo/index"><span>二维码管理</span></a></li>' +
//         '<li id="file"><a href="/page/file/index"><span>文件管理</span></a></li>' +
//         '</ul>' +
//         '</div>' +
//         '<div class="header_right" ><img th:src="@{/img/quit.png}"><button style="border:none;background:none;"><span>退出</span></button></div>' +
//         '</div>';
//     $(".header").append(headhtml);
// }



//详情、编辑删除获取地址
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var text = $('.hidden').text();
    var textLength = text.lastIndexOf("\?");
    var r = $('.hidden').text().substring(textLength + 1, text.length).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//删除所有HTML标签
function htmlEncodeJQ(str) {
    var regex = /<[^<>]+?>/g;
    if (regex.test(str) == true) {
        return str.replace(/<[^<>]+?>/g, '');
    } else {
        return str;
    }
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
    var formatDate = date.getFullYear()
        + "-"// "年"
        + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1)))
        + "-"// "月"
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
        + " "
        + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
        + ":"
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
        + ":"
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    return formatDate;
}


/**
 * 初始化日期控件
 */
function initDate(flag) {
    //时间控件
    var startDate = flag ? sys_formatDate(new Date(new Date().getTime() + 86400000), 'yyyy-MM-dd') : "2017-01-01";
    var initialDate = flag ? sys_formatDate(new Date(new Date().getTime() + 86400000), 'yyyy-MM-dd') : new Date();

    $(".form_datetime").datetimepicker({
        format: 'yyyy-mm-dd',
        minView: 'month',
        language: 'zh-CN',
        autoclose: true,
        pickerPosition: "bottom-right",
        startDate: startDate,
        initialDate: initialDate
    }).on('hide', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });
}


/**
 * 日期格式化
 * @param date        日期
 * @param format    格式
 * @returns
 */
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
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
    });
}


/**
 * ajax post提交
 * @param url
 * @param param
 * @param datat 为html,json,text
 * @param callback回调函数
 * @return
 */
function sendAjax(type, url, param, callback) {
    param._sys_login_token = login_token();
    $.ajax({
        type: type,
        url: url,
        cache: false, //清楚ie缓存
        data: param,
        dataType: 'json',
        success: function (res) {
            if (res.retCode == '000000') {
                callback(res);
            } else if (res.retCode == '401') {
                mui.alert("会话超时，请重新登录",'温馨提示',function(Response){
                    if(Response.index == 0){
                        window.location.href ="../../html/login.html";
                        return;
                    }
                })
            } else {
                // $('#submit').attr('disabled', false);
                mui.toast(res.retMsg,{ duration:'long', type:'div' });
                return;
            }
        },
        error: function (res) {
            mui.toast(res.retMsg,{ duration:'long', type:'div' });
            window.location.href = "../../html/login.html";
        }
    });
}
