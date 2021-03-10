/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-13 10:06:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-06 10:44:10
 */
/**
 * 工具模块，不依赖第三方代码
 */
let ak = ak || {};

ak.Base_URL = location.host;

/**
 * 工具模块，不依赖第三方代码
 * 包含：类型判断
 */
ak.Utils = {
    // 定位光标位置
    positioningCursor(domID) {
        // 定位光标在文本末尾
        let range = document.createRange();
        range.selectNodeContents(document.getElementById(domID));
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },
    // 输入法自带表情
    utf16toEntities(str) {
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
        str = str.replace(patt, function (char) {
            var H, L, code;
            if (char.length === 2) {
                H = char.charCodeAt(0); // 取出高位
                L = char.charCodeAt(1); // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
        return str;
    },
    getOS() {  //判断所处操作系统
        var sUserAgent = navigator.userAgent.toLowerCase();

        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Win64") || (navigator.platform == "wow64");

        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
        var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( sUserAgent;)? CPU.+Mac OS X/)
        if (isLinux) {
            if (bIsAndroid) return "Android";
            else return "Linux";
        }
        if (isIOS) {
            return 'Ios'
        }
        if (isWin) {

            var isWin2K = sUserAgent.indexOf("Windows nt 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows nt 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1
            sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows nt 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista = sUserAgent.indexOf("Windows nt 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows nt 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin8 = sUserAgent.indexOf("windows nt 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin8) return "Win8";
            var isWin10 = sUserAgent.indexOf("windows nt 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        }
        return "其他";
    },
    // 获取当前浏览器
    myBrowser() {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isName = "";
        let isOpera = true;
        if (userAgent.indexOf("Opera") > -1) {
            isName = 'Opera'; //判断是否Opera浏览器
        } else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            isName = 'IE';  //判断是否IE浏览器
        } else if (userAgent.indexOf("Edge") > -1) {
            isName = 'Edge';  //判断是否IE的Edge浏览器
        } else if (userAgent.indexOf("Firefox") > -1) {
            isName = 'Firefox';  //判断是否Firefox浏览器
        } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
            isName = 'Safari';  //判断是否Safari浏览器
        } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
            isName = 'Chrome';  //判断是否Safari浏览器
        } else {
            isName = '其它'
        }

        if (isName == "IE") {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                isName = "IE7";
            } else if (fIEVersion == 8) {
                isName = "IE8";
            } else if (fIEVersion == 9) {
                isName = "IE9";
            } else if (fIEVersion == 10) {
                isName = "IE10";
            } else if (fIEVersion == 11) {
                isName = "IE11";
            } else {
                isName = "小于 IE6";
            }//IE版本过低
        }
        return isName;
    },
    debounce(fn, wait) {
        let timer = null;
        return function () {
            let context = this
            let args = arguments
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }
    },
    throttle(fn, gapTime) {
        let _lastTime = null;

        return function () {
            let _nowTime = + new Date()
            if (_nowTime - _lastTime > gapTime || !_lastTime) {
                fn();
                _lastTime = _nowTime
            }
        }
    },
    /**
     * 生成随机数
     */
    generateMixed(n) {
        let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let res = "";
        for (let i = 0; i < n; i++) {
            let id = Math.ceil(Math.random() * 61);
            res += chars[id];
        }
        return res;
    },
    /*
    * 根据秒返回 秒，分，时，天
    */
    timeStamp(second_time) {
        let time = parseInt(second_time) + "秒";
        if (parseInt(second_time) == 0) {
            time = "少于" + (second_time + 1) + '秒'
        } else if (parseInt(second_time) > 60) {
            let second = parseInt(second_time) % 60;
            let min = parseInt(second_time / 60);
            time = min + "分" + second + "秒";

            if (min > 60) {
                min = parseInt(second_time / 60) % 60;
                let hour = parseInt(parseInt(second_time / 60) / 60);
                time = hour + "小时" + min + "分" + second + "秒";

                if (hour > 24) {
                    hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                    let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                    time = day + "天" + hour + "小时" + min + "分" + second + "秒";
                }
            }
        }
        return time;
    },

    // QQ表情转换
    getImgByFaceName: function (faceName) {
        let qqemojiList = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '悠闲', '奋斗', '咒骂', '疑问', '嘘', '晕', '疯了', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '嘴唇', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '投降', '激动', '乱舞', '献吻', '左太极', '右太极'];
        let imgStr = '<img class="qqemoji small qqemoji@faceIndex" text="@faceName" src="/static/image/im_emoji_spacer.gif"/>';
        let faceIndex = 0;
        for (let i = 0; i < qqemojiList.length; i++) {
            if (qqemojiList[i] == faceName) {
                faceIndex = i;
                break;
            }
        }
        imgStr = imgStr
            .replace(/@faceIndex/g, faceIndex)
            .replace(/@faceName/g, faceName);
        return imgStr;
    },
    // 表单序列化
    serialize: function (data) {
        let list = []
        Object.keys(data).forEach(ele => {
			if((ele == 'seatsIds' || ele == 'customerLabelIds' || ele == 'dialogueLabelIds') && typeof(data[ele]) == 'object'){
				for(let i in data[ele]){
					list.push(`${ele}=${data[ele][i]}`)
				}
			}else{
				list.push(`${ele}=${data[ele]}`)
			}
        })
        return list.join('&')
    },

    // title 闪烁
    twinkleTitle() {

        // 使用message对象封装消息
        let message = {
            time: 0,
            title: '对话',
            timer: null,
            // 显示新消息提示
            show: function () {
                let title = message.title.replace("【　　　】", "").replace("【您有新消息】", "");
                // 定时器，设置消息切换频率闪烁效果就此产生
                let timerTimeout = setTimeout(function () {
                    message.time++;
                    message.show();
                    if (message.time % 2 == 0) {
                        document.title = "【您有新消息】" + title
                    }
                    else {
                        document.title = "【　　　】" + title
                    };

                }, 300);
                sessionStorage.setItem("timerTitle", timerTimeout);
                // return [message.timer, message.title];
            },
            // 取消新消息提示
            clear: function () {
                clearTimeout(sessionStorage.getItem("timerTitle"));
                document.title = '对话';
            }
        };
        return message;
    },
    //根据条件获取当前时间 年 月 日 23:59:59
    getNowFormatDateEndYMD(num) {
        var date = new Date();
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * num);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var currentdate = currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + "23" + seperator2 + "59"
            + seperator2 + "59";;
        return currentdate;

    },
    //根据条件获取当前时间 年 月 日 00:00:00
    getNowFormatDateYMD(num) {
        var date = new Date();
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * num);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var currentdate = currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + "00" + seperator2 + "00"
            + seperator2 + "00";;
        return currentdate;

    },
    //获取当前时间 年 月 日 时 分 秒
    getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let getHoursData = date.getHours(); //时
        let getMinutesData = date.getMinutes(); //分
        let getSecondsData = date.getSeconds(); //秒
        if (getHoursData < 10) {
            getHoursData = "0" + getHoursData;
        }
        if (getMinutesData < 10) {
            getMinutesData = "0" + getMinutesData;
        }
        if (getSecondsData < 10) {
            getSecondsData = "0" + getSecondsData;
        }
        let seperator2 = ":";
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + getHoursData + seperator2 + getMinutesData
            + seperator2 + getSecondsData;
        return currentdate;

    },
    // 获取当前月份的天数
    getCurrentMonthNum() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        return new Date(year, month, 0).getDate();
    },
    /**
     * 是否为JSON字符串
     * @param {String}
     * @return {Boolean}
     */

    isJSON(str) {
        if (typeof str == 'string') {
            try {
                let obj = JSON.parse(str);
                if (str.indexOf('{') > -1) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    /**
     * 去除字符串首尾两端空格
     * @param {String} str
     * @return {String}
     */
    trim(str) {
        if (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        } else {
            return '';
        }
    },
    /**
     * 脱敏
     * @param {String} value 脱敏的对象
     * @return {String}
     */
    desensitization: function (value) {
        if (value) {
            let valueNew = '';
            const length = value.length;
            valueNew = value
                .split('')
                .map((number, index) => {
                    // 脱敏：从倒数第五位开始向前四位脱敏
                    const indexMin = length - 8;
                    const indexMax = length - 5;

                    if (index >= indexMin && index <= indexMax) {
                        return '*';
                    } else {
                        return number;
                    }
                })
                .join('');
            return valueNew;
        } else {
            return '';
        }
    },

    /**
     * 判断是否Array对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isArray: function (value) {
        return toString.call(value) === '[object Array]';
    },

    /**
     * 判断是否日期对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isDate: function (value) {
        return toString.call(value) === '[object Date]';
    },

    /**
     * 判断是否Object对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isObject: function (value) {
        return toString.call(value) === '[object Object]';
    },

    /**
     * 判断是否为空
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isEmpty: function (value) {
        return value === null || value === undefined || value === '' || (this.isArray(value) && value.length === 0);
    },

    /**
     * 判断是否移动电话
     * @param {Number} value 判断的值
     * @return {Boolean}
     */
    isMobilePhone: function (value) {
        value = Number.parseInt(value);
        // 1)是否非数字
        if (Number.isNaN(value)) {
            return false;
        }

        // 2)时候移动电话
        return /^1[3|4|5|7|8|9|6][0-9]\d{4,8}$/.test(value);
    },

    /**
     * 判断是否为邮箱
     * @param {String} value 判断的值
     * @return {Boolean}
     */
    isEmail: function (value) {
        return /^[a-zA-Z\-_0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/.test(value);
    },

    /**
     * 转换服务器请求的对象为Js的对象：包含首字母转换为小写；属性格式转换为Js支持的格式
     * @param {Object} en 服务器的获取的数据对象
     */
    transWebServerObj: function (en) {
        if (toString.call(en) == '[object Array]') {
            for (let i = 0, len = en.length; i < len; i++) {
                ak.Utils.transWebServerObj(en[i]);
            }
        } else {
            for (propertyName in en) {
                /*
                // 1.创建一个小写的首字母属性并赋值：ABC => aBC
                let newPropertyName = propertyName.charAt(0).toLowerCase() + propertyName.substr(1);
                en[newPropertyName] = en[propertyName];
                */
                let tmpName = propertyName;
                // 2.判断此属性是否为数组，若是就执行递归
                if (toString.call(en[tmpName]) == '[object Array]') {
                    for (let i = 0, len = en[tmpName].length; i < len; i++) {
                        ak.Utils.transWebServerObj(en[tmpName][i]); // 数组里的每个对象再依次进行转换
                    }
                } else if (toString.call(en[tmpName]) == '[object Object]') {
                    ak.Utils.transWebServerObj(en[tmpName]); // 若属性的值是一个对象，也要进行转换
                } else {
                    // 3.若不是其他类型，把此属性的值转换为Js的数据格式
                    // 3.1)日期格式：后台为2015-12-08T09:23:23.917 => 2015-12-08 09:23:23
                    if (new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/).test(en[propertyName])) {
                        //  en[propertyName] = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/).exec(en[propertyName])[0].replace('T', ' ');

                        //  若为0001年，表示时间为空，就返回''空字符串
                        if (en[propertyName].indexOf('0001') >= 0) {
                            en[propertyName] = '';
                        }
                    } else if (toString.call(en[propertyName]) == '[object Number]' && new RegExp(/\d+[.]\d{3}/).test(en[propertyName])) {
                        // 3.2)溢出的float格式：1.33333 = > 1.33
                        en[propertyName] = en[propertyName].toFixed(2);
                    } else if (en[propertyName] == null) {
                        // 3.3)null值返回空
                        en[propertyName] = '';
                    } else if (
                        ['imgPath', 'loopImgPath', 'clubIcon', 'headImgPath'].indexOf(propertyName) >= 0 &&
                        en[propertyName] &&
                        en[propertyName].length > 0
                    ) {
                        en[propertyName] = ak.Base_URL + en[propertyName].replace('..', '');
                    }
                }
            }
        }
        return en;
    },

    /**
     *设置SessionStorage的值
     * @param key：要存的键
     * @param value ：要存的值
     */
    setSessionStorage: function (key, value) {
        if (this.isObject(value) || this.isArray(value)) {
            value = this.toJsonStr(value);
        }
        sessionStorage[key] = value;
    },

    /**
     *获取SessionStorage的值
     * @param key：存的键
     */
    getSessionStorage: function (key) {
        let rs = sessionStorage[key];
        try {
            if (rs != undefined) {
                let obj = this.toJson(rs);
                rs = obj;
            }
        } catch (error) { }
        return rs;
    },

    /**
     * 清除SessionStorage的值
     * @param key：存的键
     */
    removeSessionStorage: function (key) {
        return sessionStorage.removeItem(key);
    },

    /**
     *设置LocalStorage的值
     * @param key：要存的键
     * @param value ：要存的值
     */
    setLocalStorage: function (key, value) {
        if (this.isObject(value) || this.isArray(value)) {
            value = this.toJsonStr(value);
        }
        localStorage[key] = value;
    },

    /**
     *获取LocalStorage的值
     * @param key：存的键
     */
    getLocalStorage: function (key) {
        let rs = localStorage[key];
        try {
            if (rs != undefined) {
                let obj = this.toJson(rs);
                rs = obj;
            }
        } catch (error) { }
        return rs;
    },

    /**
     * 对传入的时间值进行格式化。后台传入前台的时间有两种个是：Sql时间和.Net时间
     * @param {String|Date} sValue 传入的时间字符串
     * @param {dateFormat | bool} dateFormat  日期格式，日期格式：eg：'Y-m-d H:i:s'
     * @return {String} 2014-03-01 这种格式
     * @example
     * 1) Sql时间格式：2015-02-24T00:00:00
     * 2) .Net时间格式：/Date(1410744626000)/
     */
    getDateTimeStr: function (sValue, dateFormat) {
        if (dateFormat == undefined) {
            dateFormat = 'Y-m-d'; // 默认显示年月日
        }

        let dt;
        // 1.先解析传入的时间对象，
        if (sValue) {
            if (toString.call(sValue) !== '[object Date]') {
                // 不为Date格式，就转换为DateTime类型
                sValue = sValue + '';
                if (sValue.indexOf('T') > 0) {
                    // 1)格式：2015-02-24T00:00:00
                    let timestr = sValue.replace('T', ' ').replace(/-/g, '/'); //=> 2015/02/24 00:00:00
                    dt = new Date(timestr);
                } else if (sValue.indexOf('Date') >= 0) {
                    // 2).Net格式：/Date(1410744626000)/
                    //Convert date type that .NET can bind to DateTime
                    //let date = new Date(parseInt(sValue.substr(6)));
                    let timestr = sValue.toString().replace(/\/Date\((\d+)\)\//gi, '$1'); //
                    dt = new Date(Math.abs(timestr));
                } else {
                    dt = new Date(sValue);
                }
            } else {
                dt = sValue;
            }
        }

        // 2.转换
        // 1)转换成对象 'Y-m-d H:i:s'
        let obj = {}; //返回的对象，包含了 year(年)、month(月)、day(日)
        obj.Y = dt.getFullYear(); //年
        obj.m = dt.getMonth() + 1; //月
        obj.d = dt.getDate(); //日期
        obj.H = dt.getHours();
        obj.i = dt.getMinutes();
        obj.s = dt.getSeconds();
        //2.2单位的月、日都转换成双位
        if (obj.m < 10) {
            obj.m = '0' + obj.m;
        }
        if (obj.d < 10) {
            obj.d = '0' + obj.d;
        }
        if (obj.H < 10) {
            obj.H = '0' + obj.H;
        }
        if (obj.i < 10) {
            obj.i = '0' + obj.i;
        }
        if (obj.s < 10) {
            obj.s = '0' + obj.s;
        }
        // 3.解析
        let rs = dateFormat
            .replace('Y', obj.Y)
            .replace('m', obj.m)
            .replace('d', obj.d)
            .replace('H', obj.H)
            .replace('i', obj.i)
            .replace('s', obj.s);

        return rs;
    },

    /**
     * 把总秒数转换为时分秒
     */
    getSFM: function (seconds, dateFormat) {
        if (dateFormat == undefined) {
            dateFormat = 'H:i:s'; // 默认格式
        }
        let obj = {};
        obj.H = Number.parseInt(seconds / 3600);
        obj.i = Number.parseInt((seconds - obj.H * 3600) / 60);
        obj.s = Number.parseInt(seconds - obj.H * 3600 - obj.i * 60);
        if (obj.H < 10) {
            obj.H = '0' + obj.H;
        }
        if (obj.i < 10) {
            obj.i = '0' + obj.i;
        }
        if (obj.s < 10) {
            obj.s = '0' + obj.s;
        }

        // 3.解析
        let rs = dateFormat
            .replace('H', obj.H)
            .replace('i', obj.i)
            .replace('s', obj.s);
        return rs;
    },

    /**
     * 是否同一天
     */
    isSomeDay: function (dt1, dt2) {
        if (dt1.getFullYear() == dt2.getFullYear() && dt1.getMonth() == dt2.getMonth() && dt1.getDate() == dt2.getDate()) {
            return true;
        }
        return false;
    },

    /**
     * 对象转换为json字符串
     * @param  {jsonObj} jsonObj Json对象
     * @return {jsonStr} Json字符串
     */
    toJsonStr: function (jsonObj) {
        return JSON.stringify(jsonObj);
    },

    /**
     * 讲json字符串转换为json对象
     * @param {String} jsonStr Json对象字符串
     * @return {jsonObj} Json对象
     */
    toJson: function (jsonStr) {
        return JSON.parse(jsonStr);
    },

    /**
     * @private
     */
    getCookieVal: function (offset) {
        let endstr = document.cookie.indexOf(';', offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    },

    /**
     * 获取指定key的cookie
     * @param {String} key cookie的key
     */
    getCookie: function (key) {
        let arg = key + '=',
            alen = arg.length,
            clen = document.cookie.length,
            i = 0,
            j = 0;

        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(' ', i) + 1;
            if (i === 0) {
                break;
            }
        }
        return null;
    },

    /**
     * 设置cookie
     * @param {String} key cookie的key
     * @param {String} value cookie的value
     */
    setCookie: function (key, value) {
        let argv = arguments,
            argc = arguments.length,
            expires = argc > 2 ? argv[2] : null,
            path = argc > 3 ? argv[3] : '/',
            domain = argc > 4 ? argv[4] : null,
            secure = argc > 5 ? argv[5] : false;

        document.cookie =
            key +
            '=' +
            escape(value) +
            (expires === null ? '' : '; expires=' + expires.toGMTString()) +
            (path === null ? '' : '; path=' + path) +
            (domain === null ? '' : '; domain=' + domain) +
            (secure === true ? '; secure' : '');
    },

    /**
     * 是否含有特殊字符
     * @param  {String} value 传入的值
     * @return {Boolean} true 含有特殊符号;false 不含有特殊符号
     */
    isHaveSpecialChar: function (value) {
        let oldLength = value.length;
        let newLength = value.replace(/[`~!@#$%^&*_+=\\{}:"<>?\[\];',.\/~！@#￥%……&*——+『』：“”《》？【】；‘’，。？ \[\]()（）]/g, '').length;
        if (newLength < oldLength) {
            return true;
        }
        return false;
    },

    /**
     * 合并数组内成员的某个对象
     * @param {Array} arr 需要合并的数组
     * @param {String} fieldName 数组成员内的指定字段
     * @param {String} split 分隔符，默认为','
     * @example
     * let arr = [{name:'tom',age:13},{name:'jack',age:13}] => (arr, 'name') => tom,jack
     */
    joinArray: function (arr, fieldName, split) {
        split = split == undefined ? ',' : split;
        let rs = arr
            .map((item) => {
                return item[fieldName];
            })
            .join(split);
        return rs;
    },
    /**
     * 检验输入框
     */
    checkInt: function (rule, value, callback) {
        if (value) {
            let reg = /^[a-zA-Z0-9]+$/
            if (!reg.test(value)) {
                callback(new Error('只能输入字母及数字'))
            } else {
                callback()
            }
        }
    },
    checkNameInt: function (rule, value, callback) {
        if (value) {
            let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
            if (!reg.test(value)) {
                callback(new Error('只能输入字母、数字及汉字'))
            } else {
                callback()
            }
        }
    },
    validatePass(rule, value, callback) {
        let reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        if (value) {
            if (!reg.test(value)) {
                callback(new Error("请输入正确的手机号码"));
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
};

/**
 * 消息模块
 * 包含：确认框、信息提示框
 */
ak.Msg = {
    /**
     * 提示框
     * msg {string} ：信息内容
     */
    alert: function (msg) { },

    /**
     * 确认框
     * msg {string} ：信息内容
     * callback {function} ：点击'确定'时的回调函数。
     */
    confirm: function (msg, callback) {

    },

    /**
     * 显示正在加载
     * @param {String} title 显示的title
     */
    showLoading: function (title) {

    },

    /**
     * 关闭正在加载
     */
    hideLoading: function () { },

    /**
     * 自动消失的提示框
     * @param {String} msg 信息内容
     */
    toast: function (msg) { }
};

/**
 * 业务相关逻辑
 */
ak.BLL = {
    // 递归把最后一个 children [] 改为 undefined
    getHandleChildren(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].children.length < 1) {
                data[i].children = undefined;
            } else {
                this.getHandleChildren(data[i].children);
            }
        }
        return data;
    },
};

export default ak;
