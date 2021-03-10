<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-12 09:53:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-12 17:33:14
 -->
<template class="bogy">
    <div class="main">
        <div class="left">
            <div class="menu">
                <a>
                    <div class="menuImg">
                        <img
                            :src="userInfo.avatar"
                            v-if="userInfo.avatar"
                        />
                        <img
                            src='../../assets/img/default-avatar.jpg'
                            v-else
                        >
                    </div>
                    <!-- v-popover:popover -->
                    <div class="menuStatus"  v-popover:popover>
                        <span
                            class="menuStatus-color"
                            :class="userInfo.serviceStatus == 0?'online':'invisible '"
                        ></span>
                        <span class="menuStatus-text">{{userInfo.serviceStatus == 0?'在线':'隐身 '}}</span>
                    </div>
                </a>
                <el-popover
                    ref="popover"
                    placement="bottom"
                    popper-class="popoverStatus"
                    trigger="hover"
                    width="60"
                >
                    <div class="tip" @click="online('0')">在线</div>
                    <div class="tip" @click="online('1')">隐身</div>
                </el-popover>
            </div>
            <ul class="menuList">
                <el-tooltip
                    v-for="(tmp, i) in userMenus"
                    :key="i"
                    class="item"
                    effect="dark"
                    :content="tmp.name"
                    placement="right-end"
                    :open-delay="300"
                >
                    <router-link
                        tag="li"
                        :to="tmp.path"
                        v-if="tmp.id !== 8000 && tmp.id !== 9000"
                        :class="{menuActive : menuActive == tmp.name}"
                    >
                        <span
                            @click="selected(tmp.name)"
                            class="iconfont-main"
                            :class="[tmp.icon]"
                        ></span>
                    </router-link>
                </el-tooltip>
            </ul>

            <ul class="menuList2">
                <el-tooltip
                    class="item"
                    effect="dark"
                    placement="right-end"
                >
                    <div
                        slot="content"
                        style="text-align: center;"
                    >
                        {{wifiInfo}}
                        <br />
                        {{netDelay}}/ms
                    </div>
                    <router-link
                        tag="a"
                        to="/network"
                        target="_blank"
                    >
                        <span
                            class="iconfont-theme fa fa-wifi"
                            :class="netDelay > 0 && netDelay < 500 ? 'wifiRunning' : 'wifiStop'"
                        ></span>
                    </router-link>
                </el-tooltip>
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="tmp.name"
                    placement="right-end"
                    v-for="(tmp, i) in userMenus"
                    :key="i"
                >
                    <router-link
                        tag="li"
                        :to="tmp.path"
                        v-if="tmp.sort == 7"
                        :class="{menuActive1 : menuActive == tmp.name}"
                    >
                        <span
                            class="iconfont-main"
                            @click="selected(tmp.name)"
                            :class="[tmp.icon]"
                        ></span>
                    </router-link>
                </el-tooltip>
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="退出"
                    placement="right-end"
                >
                    <li @click="loginOut()">
                        <span class="el-icon-switch-button"></span>
                    </li>
                </el-tooltip>
            </ul>
        </div>

        <el-dialog
            title="提示"
            :visible.sync="isLoginOut"
            width="20%"
        >
            <span>确认退出吗？</span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="cancel()">取 消</el-button>
                <el-button
                    type="primary"
                    @click="confirm()"
                >确 定</el-button>
            </span>
        </el-dialog>

        <div class="rightContent">
            <router-view></router-view>
        </div>
        <!-- 测速图片不展示 -->
        <!-- <img src="" alt=""> -->
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            isLoginOut: false,
            menuStatus: {
                status: 1 //1 在线 -1 隐身
            },
            menuUl: [{ menuUlUrl: "", menuUlTilte: "" }],
            time: 30000, // 网络延迟检测的周期时长
            speedInterval: null, // 网络延迟循环定时器的赋值
            netDelay: "", // 网络延迟数值
            menuActive: ""
        };
    },
    computed: {
        wifiInfo() {
            if (this.netDelay <= 0) {
                return "网络异常";
            } else if (this.netDelay < 500) {
                return "网络正常";
            } else if (this.netDelay >= 500) {
                return "网络波动";
            }
        },
        userMenus() {
            return this.$store.imServerStore.state.userMenus;
        },
        userInfo() {
            return this.$store.imServerStore.state.userInfo;
        }
    },
    methods: {
        // 设置在线、隐身状态
        online(num){
            // serviceStatus 0:在线 1:隐身
            if(num == this.userInfo.serviceStatus){
                this.$refs[`popover`].doClose();
                return;
            }
            let opt = {
                "serviceStatus": parseInt(num),
                "userId": this.userInfo.userId
            }

            this.$axios.put(this.$httpServer.updateServiceStatus,opt).then((res)=>{
                if(res){
                    // this.$emit('openOrCloseStatus',num); // 是否开启webSocket
                    this.$store.imServerStore.dispatch('getUserInfo'); //重新获取权限
					this.$refs[`popover`].doClose();
                }
            })

        },
        // 设置选中active
        selected(name) {
            this.menuActive = name;
        },
        loginOut() {
            this.isLoginOut = true;
        },
        cancel() {
            this.isLoginOut = false;
        },
        async confirm() {
            await this.$store.imServerStore.dispatch("logout");
            this.isLoginOut = false;
            this.$nextTick(() => {
                this.$router.push({ path: "/login" });
            });
            //   let that = this;
            // that.$axios.delete(that.$httpServer.logout).then(res => {
            //     if (res.data.code == "0") {
            //         that.$store.imServerStore.getters.getServerSocket.onclose(); //关闭Socket
            //         sessionStorage.clear();
            //         setTimeout(that.$router.push({ path: "/login" }), 1000);
            //         that.isLoginOut = false;
            //     }
            // });
        },
        /**
         * 获取网络状态
         */
        // getConnectState() {
        //     this.wifiWork = navigator.onLine == 1;
        //     return navigator.onLine ? 1 : 0;
        // },
        /**
         * 网络中断
         */
        // disconnect() {
        //     // TODO ...
        //     console.log("网速中断");
        //     this.netDelay = 0;
        //     clearInterval(this.reNetworkInterval);
        //     this.reNetworkInterval = null;
        //     this.endCheck();
        //     // this.endNetwork();
        //     setTimeout(() => {
        //         this.reNetworkInterval = setInterval(() => {
        //             if (this.getConnectState() == 1) {
        //                 clearInterval(this.reNetworkInterval);
        //                 this.reNetworkInterval = null;
        //                 this.startCheck();
        //                 // this.startNetwork();
        //             } else {
        //                 clearInterval(this.reNetworkInterval);
        //                 this.reNetworkInterval = null;
        //                 this.disconnect();
        //             }
        //         }, this.time);
        //     }, 2 * this.time);
        // },
        /**
         * 测试延迟代码
         */
        netDelayCheck() {
            let url =
                document.location.origin +
                "/static/img/default-avatar.5db4495.jpg";
            return new Promise((resolve, reject) => {
                let tcp,
                    starTime = +new Date(),
                    img = new Image();
                img.src = url + "?" + Math.random(); //一张200多B的图片
                img.onload = function() {
                    let tcp = +new Date() - starTime; // 获取延迟时间
                    resolve(tcp);
                };
                img.onerror = function() {
                    reject(new Error("request faild"));
                };
            });
        },
        /**
         * 执行网络延迟测试
         */
        netDelayRuning() {
            this.netDelayCheck()
                .then(res => {
                    this.netDelay = res;
                })
                .catch(err => {
                    this.netDelay = "0"; // 标志当前网络异常
                });
        },
        /**
         * 开始延迟监控
         */
        startCheck() {
            this.endCheck();
            this.netDelayRuning(); // 页面挂载之后立即监控一次
            this.speedInterval = setInterval(this.netDelayRuning, this.time);
        },
        /**
         * 结束延迟监控
         */
        endCheck() {
            clearInterval(this.speedInterval);
            this.speedInterval = null;
        }
    },
    mounted() {
        this.menuActive = this.$route.meta.title;
        this.startCheck();
    },
    beforeDestroy() {
        this.endCheck();
    },
    created() {}
};
</script>
<style lang="less"  scoped>
.menuList .iconfont-main,
.menuList2 .iconfont-main {
    font-size: 24px !important;
    color: #748392;
    display: block;
    line-height: 40px;
}
.menuList2 .menuActive1 {
    display: block;
    background: #2a3541;
}
.menuList2 .menuActive1 span {
    color: #fff !important;
}
/* wifi的样式 */
.iconfont-theme {
    font-size: 20px !important;
}
.wifiRunning {
    color: #30c47d;
}
.wifiStop {
    color: #748392;
}

.left {
    overflow-x: visible;
    position: fixed;
    z-index: 20;
    float: left;
    width: 70px;
    height: 100%;
    min-height: 535px;
    background-color: #343f4b;
    transition: all 0.1s ease;
    .menu {
        height: 130px;
        padding-top: 30px;
        text-align: center;
        .menuImg {
            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(52, 63, 75, 0.3);
            }
        }
    }
}
.popoverStatus{
    max-width: 70px !important;
    .tip{
        padding: 7px 0px;
        &:hover{
            cursor: pointer;
            background-color: #edf5ff;
        }
    }
}
.menuStatus {
    text-align: center;
}
.menuStatus .menuStatus-color {
    width: 10px;
    height: 10px;
    display: inline-block;
    margin: 9px auto 0;
    border-radius: 50%;
    border: 1px solid #335a55;
}
.menuStatus .menuStatus-color.online {
    background-color: #30cc80;
}
.menuStatus .menuStatus-color.invisible {
    background-color: #ff5c5e;
}
.menuStatus .menuStatus-text {
    display: block;
    color: #748392;
    font-size: 12px;
    padding-bottom: 8px;
}
.imClient-bin-icon-client {
    background-image: url(../../assets/icon-tl.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
}
.menuList li {
    display: block;
    border: none;
    width: 100%;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
}
.menuList li span {
    display: block;
}
.menuList li:hover span {
    color: #fff;
}
/* 根据路由选中设置样式 */
/* .menuList li.router-link-active{
    background: #2a3541;
}
.menuList li.router-link-active span{
    color: #fff;
} */

.menuActive {
    display: block;
    background: #2a3541;
}
.menuActive span {
    display: block;
    color: #fff !important;
}
.el-icon-switch-button {
    color: #fff;
    font-size: 24px;
}
.menuList .imClient-bin-icon-client {
    display: block;
    float: left;
    width: 30px;
    height: 30px;
    margin: 10px 20px 0;
}
.menuList2 {
    width: 100%;
    /* height: 40px; */
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    position: absolute;
    bottom: 15px;
}

.menuList2 li:hover span:not(.iconfont-theme) {
    color: #fff;
}

.rightContent {
    /* margin: 0;
    padding: 0;  */
    height: 100%;
    width: 100%;
    position: fixed;
    /* 别放开，这里会影响工单排版 */
    /* overflow-y: hidden; */
    /* overflow-x: auto; */
}
.el-popover div {
    text-align: center;
}
</style>
