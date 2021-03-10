var _loginJsonObj;

$(function() {
    //当前登录用户
    var alipJsonStr = window.localStorage.getItem('sybJsonLocal');
    if (alipJsonStr && alipJsonStr != null && alipJsonStr != "") {
        _loginJsonObj = $.parseJSON(alipJsonStr);
    }
    $('body').on('click', 'button[type="reset"]', function () {
        $(this).closest('form').find('select').val('').show().comboSelect();
    })
});

function _get_token() {
    var _sys_login_token = "";
    var alipJsonStr = window.localStorage.getItem('sybJsonLocal');
    if (alipJsonStr && alipJsonStr != null && alipJsonStr != "") {
        var loginJsonObj = $.parseJSON(alipJsonStr);
        _sys_login_token = loginJsonObj.loginToken;
    }
    //	if (_sys_login_token == "" || _sys_login_token == undefined) {
    //		//用户未登录
    //		window.location.href = '../../html/login/login.html';
    //	}
    return _sys_login_token;
}

function _get_createUser() {
    var _create_user = "";
    var alipJsonStr = window.localStorage.getItem('sybJsonLocal');
    if (alipJsonStr && alipJsonStr != null && alipJsonStr != "") {
        var loginJsonObj = $.parseJSON(alipJsonStr);
        _create_user = loginJsonObj.loginName;
    }
    if (_create_user == "" || _create_user == undefined) {
        //用户未登录
        window.location.href = '../../login/login.html';
    }
    return _create_user;
}

/**
 * 获取token
 * @returns {String}
 */
function _get_sys_login_token() {
    var _sys_login_token = "";
    var alipJsonStr = window.localStorage.getItem('sybJsonLocal');
    if (alipJsonStr && alipJsonStr != null && alipJsonStr != "") {
        var loginJsonObj = $.parseJSON(alipJsonStr);
        _sys_login_token = loginJsonObj.loginToken;
    }
    return _sys_login_token;
}

/**
 * 根据id获取json数组中的title
 * @param id id标示
 * @param json json数组
 */
function sys_getTitle_Id(id, json) {
    if (id == "" || id == 0) {
        return "-";
    }
    if (json != null && json.length > 0) {
        for (var i = 0, l = json.length; i < l; i++) {
            for (var key in json[i]) {
                if (key == "id" && json[i][key] == id) {
                    return json[i]['text'];
                }
            }
        }
    }
}

function numMulti(num1, num2) {
    var baseNum = 0;
    try {
     baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
     baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
}

/**
 * 初始化双日历日期控件
 */
function initDateRange(str){
    if(str){
        var today = sys_formatDate(new Date().getTime(),'yyyy-MM-dd');
        var startDate = today + ' 00:00:00';
        var endDate = today + ' 23:59:59';
        $(str).daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            format: 'YYYY-MM-DD HH:mm:ss',
            startDate: startDate,
            endDate: endDate,
            opens:'center',
            dateLimit : {
                days : 0
            },
        }, function(start, end, label) {
            
        });
    }else{
        $(str).daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            format: 'YYYY-MM-DD HH:mm:ss',
            opens:'center',
            dateLimit : {
                days : 0
            },
        }, function(start, end, label) {
                
        });
    }
}

function initDateRange1(flag){
    if(flag){
        var today = sys_formatDate(new Date().getTime(),'yyyy-MM-dd');
        var startDate = today + ' 00:00:00';
        var endDate = today + ' 23:59:59';
        $('.dateranges').daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            format: 'YYYY-MM-DD HH:mm:ss',
            startDate: startDate,
            endDate: endDate,
            opens:'center',
           
        }, function(start, end, label) {
            
        });
    }else{
        $('.dateranges').daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            format: 'YYYY-MM-DD HH:mm:ss',
            opens:'center',
            dateLimit : {
                days : 0
            },
        }, function(start, end, label) {
                
        });
    }
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

function initDate1(flag) {
    //时间控件
    var startDate = "2017-01-01";
    var initialDate = flag ? sys_formatDate(new Date(new Date().getTime() - 86400000), 'yyyy-MM-dd') : new Date();
    
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
 * @param date		日期
 * @param format	格式
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
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
    });
}

/**
 * 星级替换
 * @字符串 numStr
 * @returns
 */
function xjReplace(numStr){
	var strAcctLevel='';
	if(numStr){
		strAcctLevel = numStr.replace(/,/g,'星,');
		strAcctLevel = strAcctLevel.replace(/.0/g,'');
		strAcctLevel = strAcctLevel.substring(0,strAcctLevel.length-1);
	}
	return strAcctLevel;
}
// 字符串转date格式（解决ie报错)
function parserDate(date) {  
    var t = Date.parse(date);  
    if (isNaN(t)) {  
        return new Date(Date.parse(date.replace(/-/g, "/")));  
    } else {  
        return new Date(date);  
    }  
};
/**
 * 格式化金额
 * @param s		金额
 * @param n		小数位数
 * @returns {String}
 */
function formatterMoney(s, n) {
    if (!s && s != 0) {
        return "";
    }
	//转换为元
    s = s / 100;
	n = n >= 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
	r = s.split(".")[1];
	r = r == null ? "" : "." + r;
	var t = "";
	if (l[l.length - 1] === '-') {//负数不需要分隔号,
	    for (var i = 0; i < l.length; i++) {
	    	if (l[i]==='-') {
	    		t += l[i]+""
	    		continue
	    	}
	    	//不是数组的倒数第二个元素才加"," ["0", "4", "5", "-"]
	    	t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length-1 ? "," : "");
	    }
	}else {
	    for (var i = 0; i < l.length; i++) {
	      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
	    }
	}
	return t.split("").reverse().join("") + r;
}

/**
 * 格式化金额(编辑时用)
 * @param s		金额
 * @param n		小数位数
 * @returns {String}
 */
function formatterMoney_edit(s, n) {
    if (!s && s != 0) {
        return "";
    }

    if (s < 0) {
        return s;
    }
    //转换为元
    s = s / 100;

    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    return s;
}

//详情、编辑删除获取地址
function getQueryString(name,obj) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    
    if(obj != undefined){
    	var text = $(obj).text();
    	var textLength = text.indexOf("\?");
    	var r = $(obj).text().substring(textLength + 1, text.length).match(reg);
    }else{
    	var text = $('.hidden').text();
    	var textLength = text.lastIndexOf("\?");
    	var r = $('.hidden').text().substring(textLength + 1, text.length).match(reg);
    }
    
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function getUrlParam(name) { 
    var search = decodeURI(window.location.search);
    var result = search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

/**
 * 获取内部页url中参数
 * @param name
 * @returns
 */
function getChildrenUrlParam(name) { 
    var search = decodeURI($('.account_children li.active a').attr('target'));
    var result = search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

//封装下拉列表
function listOption(obj, data) {
	$(obj).html('');
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += '<option value="' + data[i].id + '">' + data[i].text + '</option>';
    }
    $(obj).append(html);
}

//封装下拉列表（带全部）
function listOptionInit(obj, data) {
	$(obj).html('');
    var html = "";
    html += "<option value=''>全部</option>";
    for (var i = 0; i < data.length; i++) {
        html += '<option value=' + data[i].id + '>' + data[i].text + '</option>';
    }
    $(obj).append(html);
}

//封装下拉列表（带请选择）
function listOptionInit2(obj, data) {
	$(obj).html('');
    var html = "";
    html += "<option value=''>请选择</option>";
    for (var i = 0; i < data.length; i++) {
        html += '<option value=' + data[i].id + '>' + data[i].text + '</option>';
    }
    $(obj).append(html);
}

//封装并回显下拉列表
function listOptionEcho(obj, data, value) {
	$(obj).html('');
    var html = "";
    for (var i = 0; i < data.length; i++) {
        if (value == data[i].id) {
            html += "<option value=" + data[i].id + " selected='selected'>" + data[i].text + "</option>";
        } else {
            html += '<option value=' + data[i].id + '>' + data[i].text + '</option>';
        }
    }
    $(obj).append(html);
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
 * ajax post提交  
 * @param url  
 * @param param  
 * @param datat 为html,json,text  
 * @param callback回调函数  
 * @return  
 */
function sendAjax(type, url, param, callback) {
    if (param === '') {
        param = {}
    }
    $.each(param, function(i, item) {
        return param[i] = htmlEncodeJQ(item);
    });
    //赋值(token)
    if (url.search("login") != -1) {
        //是登录方法
        param._sys_login_token = _get_sys_login_token();
    } else {
        //不是登录方法
        param._sys_login_token = _get_token();
    }
    $('.btn').not('.ok').attr('disabled', 'disabled');
    $.ajax({
        type: type,
        url: url,
        cache: false, //清楚ie缓存
        data: param,
        dataType: 'json',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');

            if (res.retCode == '000000') {
                callback(res);
            } else if (res.retCode == '888888') {
                if ($('.modal').length <= 1) {
                    Ewin.alert({
                        message: "会话超时，请重新登录"
                    }).on(function(e) {
                        if (e) {
                            sessionStorage.clear();
                            sessionStorage.setItem('memuLists', '');
                            sessionStorage.setItem('tabLists', '');
                            window.location.href = '../../../html/login/login.html';
                            return;
                        }
                    });
                }
            } else if (res.retCode == '777777') {
                Ewin.alert({ message: res.retMsg }).on(function(e) {
                    if (e) {
                        Ewin.dialog({
                            url: '../../common/index/resetPass.html',
                            title: '重置密码'
                        });
                    }
                });
            } else {
                if (res.retMsg == '登陆密码不正确') {
                    if ($('.modal').length <= 0) {
                        Ewin.alert({ message: res.retMsg });
                    }
                } 
                // else if (url.indexOf('/cus-web/cusApply/checkCus') > 0 && res.retCode == '999999') {
                //     $('#memberNetexamine_check_apply_table').parents('.modal').modal('hide');
                //     $("#memberNetexamine_table").bootstrapTable('refresh');
                // } 
                else if (url.indexOf('/cus-web/cusGroupInfo/addGroup') > 0 && res.retCode == '999999') {
                    Ewin.alert({ message: res.retMsg }).on(function() {
                        $('#memberNetexamine_check_apply_table').parents('.modal').modal('hide');
                        $("#memberNetexamine_table").bootstrapTable('refresh');
                    });
                } else {
                    // if ($('.modal').length <= 1) {
                    $(".loading_route").hide();
                    Ewin.alert({ message: res.retMsg });
                    // }
                }
            }
        },
        error: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');
            $(".loading_route").hide();
            if ($('.modal').length <= 0) {
                /*Ewin.alert({
                    message: '网络访问异常，请稍后再试'
                });*/
            }
        }
    });
}

function sendAjax_special(type, url, param, callback) {
    if (param == '') {
        param = {}
    }
    $.each(param, function(i, item) {
        return param[i] = htmlEncodeJQ(item);
    });
    //赋值(token)
    if (url.search("login") != -1) {
        //是登录方法
        param._sys_login_token = _get_sys_login_token();
    } else {
        //不是登录方法
        param._sys_login_token = _get_token();
    }
    $('.btn').not('.ok').attr('disabled', 'disabled');
    $.ajax({
        type: type,
        url: url,
        cache: false, //清楚ie缓存
        data: param,
        dataType: 'json',
        success: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');

            if (res.retCode == '888888') {
                if ($('.modal').length <= 1) {
                    Ewin.alert({
                        message: "会话超时，请重新登录"
                    }).on(function(e) {
                        if (e) {
                            sessionStorage.clear();
                            sessionStorage.setItem('memuLists', '');
                            sessionStorage.setItem('tabLists', '');
                            window.location.href = '../../../html/login/login.html';
                            return;
                        }
                    });
                }
            } else {
                callback(res);
            }
        },
        error: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');
            $(".loading_route").hide();
            if ($('.modal').length <= 0) {
                /*Ewin.alert({
                    message: '网络访问异常，请稍后再试'
                });*/
            }
        }
    });
}
// 通知加载
function sendAjax_notify(type, url, param, callback) {
    if (param === '') {
        param = {}
    }
    $.each(param, function(i, item) {
        return param[i] = htmlEncodeJQ(item);
    });
    //赋值(token)
    if (url.search("login") != -1) {
        //是登录方法
        param._sys_login_token = _get_sys_login_token();
    } else {
        //不是登录方法
        param._sys_login_token = _get_token();
    }
    $('.btn').not('.ok').attr('disabled', 'disabled');
    $.ajax({
        type: type,
        url: url,
        cache: false, //清楚ie缓存
        data: param,
        dataType: 'json',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');

            if (res.retCode == '000000') {
                callback(res);
            } else if (res.retCode == '888888') {
                if ($('.modal').length <= 1) {
					alertTips({message:'会话超时，请重新登录',id:'alert-danger'});
					
                    sessionStorage.clear();
                    sessionStorage.setItem('memuLists', '');
                    sessionStorage.setItem('tabLists', '');
                    window.location.href = '../../../html/login/login.html';
                    return;
                }
            }else {
                $(".loading_route").hide();
				alertTips({message:res.retMsg,id:'alert-danger'});
            }
        },
        error: function(res) {
            $('.btn').not('.ok').removeAttr('disabled');
            $(".loading_route").hide();
    //         if ($('.modal').length <= 0) {
				// alertTips({message:'网络访问异常，请稍后再试',id:'alert-danger'});
    //         }
        }
    });
}
/**
 * ajax请求返回执行
 */
$(document).ajaxComplete(function(event, request, settings) {
    var data = request.responseJSON;
    if (data && data.retCode == '888888') {
		if ($('.modal').length <= 1) {
			Ewin.alert({
				message: "会话超时，请重新登录"
			}).on(function(e) {
				if (e) {
					sessionStorage.clear();
					window.location.href = '../../../html/login/login.html';
					return;
				}
			});
		}
    }
});

//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
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

/**
 * 时间格式化
 * @param date
 * @returns yyyymmddhhmiss
 */
function formatterDateTimeToyyyymmddhhMMss(date) {
    if (!date) {
        return "";
    }
    date = new Date(date);
    if (date.getFullYear(date) < 1900) {
        return "";
    }
    var formatDate =
        ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) +
        "" // "月"
        +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "" +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        "" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        "" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    return formatDate;
}

/**
 * 可视化参数类型
 * @param paramArr 常量参数数组
 * @param value 需要格式化的id
 */
function visualParams(paramArr, value) {
    if (!paramArr || !(paramArr instanceof Array) || paramArr.length == 0) {
        return "-";
    }
    var str = '-';
    for (var i = 0; i < paramArr.length; i++) {
        if (paramArr[i].id == value) {
            str = paramArr[i].text;
        }
    }
    return str;
}

/**
 * 可视化参数类型
 * @param paramArr 常量参数数组
 * @param value 需要格式化的id
 */
function getPayTypeParams(paramArr, value) {
    if (!paramArr || !(paramArr instanceof Array) || paramArr.length == 0) {
        return "-";
    }
    var str = '-';
    for (var i = 0; i < paramArr.length; i++) {
        if (paramArr[i].keyValue == value) {
            str = paramArr[i].keyName;
        }
    }
    return str;
}


/**
 * 模板下拉框视图渲染
 * @param obj
 * @param data
 * @returns
 */
function tempSelectListOption(obj, data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += '<option value=' + data[i].id + '>' + data[i].templateName + '</option>';
    }
    $(obj).append(html);
    return html;
}

/**
 * 判断值是否为空
 * @param obj
 * @param data
 * @returns
 */
function _isBank(obj) {
    var obj_str = obj + "";
    obj_str = $.trim(obj_str);
    if (obj_str == "") {
        return true;
    }
    return false;
}
/**
 * 判断是否是整数
 * @param {Object} obj
 */
function _isPInt(obj) {
    var obj_str = obj + "";
    var g = /^[+]?[0-9]+\d*$/i;
    return g.test(obj_str);
}

//设置cookie
function setCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};
//获取cookie
function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};
//删除cookie
function delCookie(name) {
    setCookie(name, "", -1);
};
//bootstrap 防止模态窗口未全部加载时，按回车键出现多个重叠窗口
$(document).keydown(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        $("textarea").val($("textarea").val() + "\n");
        $('.modal-content').each(function() {
            event.preventDefault();
        });
    }
});
$(document).on('click', function() {
    $("[data-toggle='popover']").popover('hide');
});
/**
 * 合并单元格
 * @param data  原始数据（在服务端完成排序）
 * @param fieldName 合并属性名称
 * @param colspan   合并列
 * @param target    目标表格对象
 * mergeTable(field)
 */
function mergeTable(field, str) {
    var obj = getObjFromTable(str, field);

    for (var item in obj) {
        str.bootstrapTable('mergeCells', {
            index: obj[item].index,
            field: field,
            colspan: 1,
            rowspan: obj[item].row
        });
    }
}

function getObjFromTable(str, field) {
    var obj = [];
    var maxV = str.find("th").length;

    var columnIndex = 0;
    var filedVar;
    for (columnIndex = 0; columnIndex < maxV; columnIndex++) {
        filedVar = str.find("th").eq(columnIndex).attr("data-field");
        if (filedVar == field) break;

    }
    var $trs = str.find("tbody > tr");
    var $tr;
    var index = 0;
    var content = "";
    var row = 1;
    for (var i = 0; i < $trs.length; i++) {
        $tr = $trs.eq(i);
        var contentItem = $tr.find("td").eq(columnIndex).html();
        //exist
        if (contentItem.length > 0 && content == contentItem) {
            row++;
        } else {
            //save
            if (row > 1) {
                obj.push({
                    "index": index,
                    "row": row
                });
            }
            index = i;
            content = contentItem;
            row = 1;
        }
    }
    if (row > 1) obj.push({
        "index": index,
        "row": row
    });
    return obj;
}

//获取时间字符串
function getDateStr(d_value) {
    if (d_value == "" || d_value == null || d_value == undefined) {
        return '';
    }
    var oDate = new Date(d_value),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间  
    return oTime;
}
//操作成功/失败的提示
function alertTips(param) {
    Ewin.alertTipsBottom(param);
    window.setTimeout(function() {
        $('.alertBottom.pull-right.col-sm-2').alert('close');
    }, 2000);
}






// 金额区间只能输入数字、小数点
function num(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}

// 正整数
function num2(obj) {
    obj.value = obj.value.replace(/[^\d]/g, ""); //清除"数字"以外的字符
}

// 金额区间只能输入数字、四位小数点
function num3(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3'); //只能输入四个小数
}

/**
 * 实时动态强制更改用户录入
 * arg1 inputObject
 **/
function amount(th) {
    var regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for (i = 0; i < regStrs.length; i++) {
        var reg = new RegExp(regStrs[i][0]);
        th.value = th.value.replace(reg, regStrs[i][1]);
    }
}

/**
 * 录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全
 **/
function overFormat(th) {
    var v = th.value;
    if (v === '') {
        v = '0.00';
    } else if (v === '0') {
        v = '0.00';
    } else if (v === '0.') {
        v = '0.00';
    } else if (/^0+\d+\.?\d*.*$/.test(v)) {
        v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
        v = inp.getRightPriceFormat(v).val;
    } else if (/^0\.\d$/.test(v)) {
        v = v + '0';
    } else if (!/^\d+\.\d{2}$/.test(v)) {
        if (/^\d+\.\d{2}.+/.test(v)) {
            v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
        } else if (/^\d+$/.test(v)) {
            v = v + '.00';
        } else if (/^\d+\.$/.test(v)) {
            v = v + '00';
        } else if (/^\d+\.\d$/.test(v)) {
            v = v + '0';
        } else if (/^[^\d]+\d+\.?\d*$/.test(v)) {
            v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
        } else if (/\d+/.test(v)) {
            v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
            ty = false;
        } else if (/^0+\d+\.?\d*$/.test(v)) {
            v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
            ty = false;
        } else {
            v = '0.00';
        }
    }
    th.value = v;
}

// 弹出框 小图标
function imgCheck_dialog(name){
	switch(name){
		case '微信扫码':
		case '微信充值':
		   return '<img src="../../../img/pay/WXSM.png" width="20px" />';
		case '微信H5':
		   return '<img src="../../../img/pay/WXH5.png" width="20px" />';		       
		case '支付宝扫码':
		case '支付宝充值':
		   return '<img src="../../../img/pay/ALiSM.png" width="20px" />';
		case '支付宝H5':
		   return '<img src="../../../img/pay/ALiH5.png" width="20px" />';
		case 'QQ钱包扫码':
		case 'QQ钱包充值':
		   return '<img src="../../../img/pay/QSM.png" width="20px" />';		       
		case 'QQ钱包H5':
           return '<img src="../../../img/pay/QH5.png" width="20px" />';
        case '云闪付扫码':
        case '云闪付充值':
           return '<img src="../../../img/pay/YSFSM.png" width="20px" />'; 
        case '云闪付H5':
           return '<img src="../../../img/pay/YSFH5.png" width="20px" />'; 
		case '银联扫码':
		   return '<img src="../../../img/pay/OSM.png" width="20px" />';
		case '京东支付':
		   return '<img src="../../../img/pay/JDPay.png" width="20px" />';
		case '网关支付':
		   return '<img src="../../../img/pay/PGPay.png" width="20px" />';		       
		case '快捷支付':
		   return '<img src="../../../img/pay/KJPay.png" width="20px" />';
		case '网关充值':
		   return '<img src="../../../img/pay/PGPay.png" width="20px" />';		       
		case 'POS充值':
		   return '<img src="../../../img/pay/pos.png" width="20px" />';
		case '余额提现(代付)':
		   return '<img src="../../../img/pay/TX.png" width="20px" />';		       
		case '单一代付':
           return '<img src="../../../img/pay/DF.png" width="20px" />';
        case '理财代付':
		   return '<img src="../../../img/pay/lcdf.png" width="20px" />'; 
		case '线下充值':
		   return '<img src="../../../img/pay/xianxia.png" width="20px" />';   
		case '代扣充值':
		   return '<img src="../../../img/pay/DK.png" width="20px" />';
        case '网银充值':
        case '网银支付':
		   return '<img src="../../../img/pay/wangy.png" width="20px" />';
        case '理财代付':
            return '<img src="../../../img/pay/lcdf.png" width="20px" />';
	}
}


/**
 * 计算器
 * 用于处理浮点数精度不能保证的问题
 */

//  加法
function accAdd(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}

// 减法
function Subtr(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 乘法
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 除法
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return accMul((r1 / r2), pow(10, t2 - t1));
    }
}

// 判断select中是否存在某个value
function isExistOption(id,value) {  
    var isExist = false;  
    var count = $('#'+id).find('option').length;  

      for(var i=0;i<count;i++)     
      {     
         if($('#'+id).get(0).options[i].value == value)     
             {     
                   isExist = true;     
                        break;     
                  }     
        }     
        return isExist;  
}

// 判断字符串长度
function strlen(str){  
    var len = 0;  
    for (var i=0; i<str.length; i++) {   
     var c = str.charCodeAt(i);   
    //单字节加1   
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
       len++;   
     }   
     else {   
      len+=2;   
     }   
    }   
    return len;  
}  
/**
 * 获取当前url根路径
 * @returns
 */
function getRootUrl(){
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    var localhostPaht=curWwwPath.substring(0,pos);
	return localhostPaht;
}

//手机号码验证正则表达式
var PHONE_NUMBER_REGEXP = /^1[3|5|6|8|9]{1}[0-9]{9}$/;
//邮箱地址验证正则表达式
var EMAIL_ADDRESS_REGEXP = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

//成功返回码
var SUCCESS_CODE = '000000';
//失败返回码
var FAIL_CODE = '999999';
//系统异常返回码
var ERROR_CODE = '900001';

// 清除所有空格
function trimAll(str){
    return str.replace(/\s*/g, "");
}

/**
 * 查找常量字典表
 */
var lists = [];
function findConstantValue(sysCode, groupName) {
	
	if (!sysCode || !groupName) {
		return '';
	}
	
	sendAjax( 'POST', host_url+"/cloud-web/pubTypeGroup/findPubTypeGroupList", {'sysCode':sysCode,'groupName':groupName}, function(res){
		var data = res.rows;
		lists = [];
		$.each(data,function(i,item){
			lists.push({
				id: item.keyValue,
				text: item.keyName
			});
		});
		
    });
}

// 倒计时
var timer = {};
function countDown(s,id){
    s=parseInt(s);
    timer[id] = setInterval(function(){
        if(s>0){
            s--;
			$("#" + id).text(s);
        }else{
			$("#" + id).text(0);
			clearInterval(timer[id]);
        };
    },1000);
};

// 查询当前月第一天
function setDate(date){
	y=date.getFullYear();
	m=date.getMonth()+1;
	d=date.getDate();
	m=m<10?"0"+m:m;
	d=d<10?"0"+d:d;
	return y+"-"+m+"-"+d;
}
// 查询当前月最后一天
function getCurrentMonthLast(){
	var date=new Date();
	var currentMonth=date.getMonth();
	var nextMonth=++currentMonth;
	var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
	var oneDay=1000*60*60*24;
	return sys_formatDate(new Date(nextMonthFirstDay-oneDay));
}