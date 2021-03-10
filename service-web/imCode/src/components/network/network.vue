<template>
    <div class="network">
        <!-- <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js> -->
        <div class="layout browserStatus">
            <h1>本机信息</h1>
            <section>
                <ul>
                    <li>
                        <span>您的 IP 为</span>
                        <span>{{citySN.ip}}</span>
                        <span>{{citySN.cityDesc.province == 0 ? '' : citySN.cityDesc.province}}</span>
                        <span>{{citySN.cityDesc.city && citySN.cityDesc.city}}</span>
                    </li>
                    <li>
                        <span>操作系统</span>
                        <span>{{getOperatingSystemInfo()}}</span>
                        <span>{{GetOSInfo()}}</span>
                    </li>
                    <li>
                        <span>用户代理</span>
                        <span>{{navigator.userAgent}}</span>
                    </li>
                    <li>
                        <span>Cookie 状态</span>
                        <span>{{cookieOpen?'开启':'关闭'}}</span>
                    </li>
                    <li>
                        <span>LocalStorage 状态</span>
                        <span>{{laocalOpen?'支持':'不支持'}}</span>
                    </li>
                </ul>
            </section>
        </div>
        <div class="layout testSite">
            <h1>本站域名检测结果</h1>
            <ul>
                <li v-for="(tmp, i) in localNet" :key="i">
                    <span>{{tmp.url}}</span>
                    <span
                        :class="(tmp.delay > 0 && tmp.delay < 500) ? 'netWork': 'netStop'"
                    >{{tmp.delay|netStatus}}：{{tmp.delay}}ms</span>
                    <!-- <span v-else>测试中</span> -->
                </li>
            </ul>
        </div>
        <div class="layout testOther">
            <h1>其他网站域名检测结果</h1>
            <ul>
                <li v-for="(tmp, i) in otherNet" :key="i">
                    <span>{{tmp.url}}</span>
                    <span
                        :class="(tmp.delay > 0 && tmp.delay < 500) ? 'netWork': 'netStop'"
                    >{{tmp.delay|netStatus}}：{{tmp.delay}}ms</span>
                    <!-- <span v-else>测试中</span> -->
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getIp} from '../../common/api'
// let ip = returnCitySN ? returnCitySN["cip"] : "";
// let cityname = returnCitySN ? returnCitySN["cname"] : "";

export default {
    data() {
        return {
            citySN: {
                ip: '',
                cityDesc: {}
            },
            navigator: null, // 获取当前浏览器的navigator对象
            time: 30000, // 网络检测的周期
            timer: null, // 记录网络延迟检测的定时器
            cookieOpen: true, // 是否开启cookie
            laocalOpen: true, // 是否至此localStorage
            system: "", // 当前操作系统
            bit: "", // 当前系统位数
            localNet: [{ // 本站需要检测的域名
              url: document.location.origin,
              img: "/static/img/default-avatar.5db4495.jpg"
            }],
            otherNet: [ // 外站需要检测的域名
                {
                    url: "www.baidu.com",
                    img: "https://www.baidu.com/favicon.ico",
                    delay: ""
                }
            ]
        }
    },
    filters: {
      netStatus(value) {
        if (value <= 0) {
          return '请求失败'
        } else if(value < 500) {
          return '网络正常'
        } else if(value >= 500) {
          return '网络波动'
        }
      }
    },
    methods: {
        /**
         * 获取操作系统
         */
        getOperatingSystemInfo() {
            let operatingInfo = navigator.userAgent;
            let isWin =
                navigator.platform == "Win32" ||
                navigator.platform == "Windows";
            let isMac =
                navigator.platform == "Mac68K" ||
                navigator.platform == "MacPPC" ||
                navigator.platform == "Macintosh" ||
                navigator.platform == "MacIntel";
            if (isMac) return "Mac";
            let isUnix = navigator.platform == "X11" && !isWin && !isMac;
            if (isUnix) return "Unix";
            let isLinux = String(navigator.platform).indexOf("Linux") > -1;
            if (isLinux) return "Linux";
            if (isWin) {
                let isWin2K =
                    operatingInfo.indexOf("Windows NT 5.0") > -1 ||
                    operatingInfo.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Windows 2000";
                let isWinXP =
                    operatingInfo.indexOf("Windows NT 5.1") > -1 ||
                    operatingInfo.indexOf("Windows XP") > -1;
                if (isWinXP) return "Windows XP";
                let isWin2003 =
                    operatingInfo.indexOf("Windows NT 5.2") > -1 ||
                    operatingInfo.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Windows 2003";
                let isWinVista =
                    operatingInfo.indexOf("Windows NT 6.0") > -1 ||
                    operatingInfo.indexOf("Windows Vista") > -1;
                if (isWinVista) return "Windows Vista";
                let isWin7 =
                    operatingInfo.indexOf("Windows NT 6.1") > -1 ||
                    operatingInfo.indexOf("Windows 7") > -1;
                if (isWin7) return "Windows 7";
                let isWin10 = operatingInfo.indexOf("Windows NT 10") != -1;
                if (isWin10) return "Windows 10";
            }
            return "other";
        },
        /**
         * 获取操作系统的位数
         */
        GetOSInfo() {
            let _pf = navigator.platform;
            let operatingInfo = navigator.userAgent;
            if (_pf == "Win32" || _pf == "Windows") {
                if (
                    operatingInfo.indexOf("WOW64") > -1 ||
                    operatingInfo.indexOf("Win64") > -1
                ) {
                    return "64-bit";
                } else {
                    return "32-bit";
                }
            }
        },
        /**
         * 检测网络延迟的代码
         */
        delayCheck(url) {
            return new Promise((resolve, reject) => {
                let delay,
                    starTime = +new Date(),
                    img = new Image();
                img.src = url + "?" + Math.random(); //一张200多B的图片
                img.onload = function() {
                    let delay = +new Date() - starTime; // 获取延迟时间
                      resolve(delay)
                }
                img.onerror = function() {
                    reject(new Error('request faild'))
                }
            });
        },
        /**
         * 调用网络延迟代码
         */
        networkCheck(arr) {
            for (let i in arr) {
                this.delayCheck(arr[i].img).then(delay => {
                    this.$set(arr[i], 'delay', delay)
                }).catch(err=> {
                    this.$set(arr[i], 'delay', 0)
                })
            }
        },
        /**
         * 开启网络延迟监控
         */
        startDelayCheck() {
          this.endDelayCheck()
          this.networkCheck(this.otherNet) // 立即执行一次
          this.networkCheck(this.localNet) // 立即执行一次
          this.timer = setInterval(() => {this.networkCheck(this.otherNet);this.networkCheck(this.localNet);}, this.time)
        },
        /**
         * 停止网络延迟监控
         */
        endDelayCheck() {
            clearInterval(this.timer)
            this.timer = null
        },
        // 获取ip地址和归属地
        async getIp() {
            getIp().then(res => {
                if(res.data.code == 0) {
                    let data = res.data.data
                    if (data) {
                        data.cityDesc = JSON.parse(data.cityDesc).data
                    } else {
                        data.cityDesc = {}
                    }
                    this.citySN = data
                }
            })
        }
    },
    created() {
        this.getIp() // 鉴于可能在其他地方需要获取ip地址，所以还是存在了vuex里,在这个页面用computed获取
        this.navigator = navigator;
        this.cookieOpen = !!(document.cookie || navigator.cookieEnabled);
        this.laocalOpen = !!(
            window.localStorage &&
            (window.localStorage.setItem("a", 123),
            window.localStorage.getItem("a") == 123)
        )
        this.startDelayCheck()
    },
    beforeDestroy() {
        this.endDelayCheck();
    }
};
</script>


<style lang="less" scoped>
.network {
    padding: 20px 30px;
    background: #f7f7f8;
    height: 100%;
    overflow: auto;
    .layout {
        padding: 20px 30px;
        background: #fff;
        margin-bottom: 30px;
        h1 {
            line-height: 28px;
            border-bottom: 1px solid #f5f5f5;
            padding-bottom: 20px;
        }
        ul {
            font-size: 13px;
            line-height: 26px;
            > li {
                > span:first-child {
                    display: inline-block;
                    width: 200px;
                }
                > span.netWork {
                    color: #00ce7d;
                }
                > span.netStop {
                    color: #e21918;
                }
            }
        }
    }
}
</style>
