<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-17 16:08:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-29 15:09:19
 -->
<template>
    <!--  v-loading="loading" -->
    <div id="app">
        <router-view />
        <lg-preview></lg-preview>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            _beforeUnload_time: 0,
            _gap_time: 0,
            is_fireFox: navigator.userAgent.indexOf("Firefox") > -1
        };
    },
    methods: {
        loginOut() {
            this.$store.imServerStore.state.currentChatEnlist = [];
            this.$store.imServerStore.state.selectedChatEn = null;
            this.$axios.delete(this.$httpServer.logout).then(res => {});
        },
        beforeunloadHandler(e) {
            this._beforeUnload_time = new Date().getTime();
        },
        unloadHandler(e) {
            this._gap_time = new Date().getTime() - this._beforeUnload_time;

            //判断是窗口关闭还是刷新
            localStorage.setItem("time", this._gap_time);
            if (
                this._gap_time <= 5 &&
				!(window.location.href.indexOf("network") > -1) &&
				!(window.location.href.indexOf("imClient") > -1)
            ) {
                // 发送设置同步
                var xhr = new XMLHttpRequest();
                xhr.open("DELETE", "." + this.$httpServer.logout, false);
                xhr.setRequestHeader(
                    "Authorization",
                    "Bearer" + sessionStorage.getItem("token")
                );
                xhr.send();
            } else {
                console.log("关闭");
            }
        },
        async getIp() {
            await this.$store.imServerStore.dispatch("getIp");
        }
	},
	beforeCreate() {
        if (
            location.href.indexOf("imClient") > -1 ||
            location.href.indexOf("login") > -1
        ) {
            return false;
        }
        if (this.$store.isRefresh === 1) {
            return false;
        }
        this.$store.isRefresh = 1;
        let that = this;
        let params = {
            seatsId: sessionStorage.getItem("userId")
        };
        this.$axios
            .get("/im/imbindinfo/getBindInfoBySeatsId", { params })
            .then(res => {
                if (res.data.data) {
                    res.data.data.map((v, i) => {
                        let obj = {
                            center: "",
                            clientbrowser: v.clientBrowser,
                            clientip: v.clientIp,
                            clientplatform: v.clientPlatform,
                            contentType: 0,
                            msgType: v.isLineUp > 0 ? 8 : 5,
                            sender: v.clientId,
                            time: v.linkTime,
                            trackid: v.trackId,
                            type: "client",
							dialogueTag: v.dialogueTag,
							customerTagInfo: v.customerTagInfo,
                            lastTrackId: '',
                            clientProvince: v.clientProvince, // 上线用户 省市
                            clientCity: v.clientCity, // 上线用户 市区
                            clientCountry: v.clientCountry, // 上线用户 国家
                            userId: v.userId,
                            dialogueStatus:v.dialogueStatus, //访客状态 3 离线
                        };
                        // that.zhDialogueTag
                        that.$store.imServerStore.dispatch(
                            "addClientChat",
                            obj
                        );
                    });
                }
            });
    },
    mounted() {
        window.addEventListener("beforeunload", e => {
            this.beforeunloadHandler(e);
            let userAgent = navigator.userAgent;
            let isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                //判断是否Opera浏览器
                return "Opera";
            }
            if (userAgent.indexOf("Firefox") > -1) {
                this.unloadHandler();
            } else if (
                userAgent.indexOf("compatible") > -1 &&
                userAgent.indexOf("MSIE") > -1 &&
                !isOpera
            ) {
                e = e ? e : window.event ? window.event : null;
                var cy = e.clientY || e.target.event.clientY;
                var ak = e.altKey || e.target.event.altKey;
                if (cy < 0 || ak) {
                    this.unloadHandler();
                }
            }
        });
        window.addEventListener("unload", async e => {
            this.unloadHandler(e);
        });
    },
    destroyed() {
        window.removeEventListener("beforeunload", e =>
            this.beforeunloadHandler(e)
        );
        window.removeEventListener("unload", e => this.unloadHandler(e));
    },
    created() {
        // this.getIp() // 懒加载
    }
};
</script>

<style>
#app {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
}
body,
div,
ul,
ol,
dt,
dd,
dl,
li,
h1,
h2,
h3,
h4,
h5,
h6,
form,
input,
select,
textarea,
p,
img,
a,
span,
strong {
    padding: 0;
    margin: 0;
}
textarea {
    resize: none;
}
body {
    font-size: 12px;
    font-family: "微软雅黑";
    /* color: #000000;
    background: #f7f7f7; */
}

ul,
ol,
li {
    list-style: none;
}

img,
input,
select,
textarea {
    vertical-align: middle;
}

img {
    border: none;
}

a {
    /*color: #666;*/
    text-decoration: none;
    cursor: pointer;
}
input {
    outline: none;
}

.imRecord-wrapper .el-collapse-item__header {
    display: block;
    cursor: pointer;
    height: 41px;
    padding: 0 4px 0 16px;
    font-size: 15px;
    line-height: 40px;
    color: #767d85;
    background-color: #fff;
}
.childMinHe {
    display: flex;
    align-items: center;
    min-height: 50px;
    /* padding-left: 16px; */
}
.imServer-main .el-collapse-item__wrap {
    border-bottom: 0;
}
.imRecord-wrapper .el-collapse-item__wrap {
    border-bottom: none;
}
.imCustomerlabel .el-row {
    /* min-height: 50px; */
    text-align: left;
}
.el-input--prefix .el-input__inner {
    padding-left: 10px;
}
.paddingLeft.el-input--prefix .el-input__inner {
    padding-left: 30px;
}
/* 登录样式 */
.login .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
}
.login .el-form-item.is-success .el-input__inner:hover {
    border: 1px solid #dcdfe6;
}
.login .el-form-item.is-success .el-input__inner:focus {
    border: 1px solid #dcdfe6;
}
/* 聊天 */
.imChat-header .el-collapse-item__header {
    border-bottom: none;
    border-bottom: 1px solid #ebeef5;
}
.imChat-header .el-collapse-item__arrow {
    display: none;
}
.imChat-wrapper .el-dialog__wrapper .el-button {
    padding: 10px 16px;
}
/* 所以弹窗 */
.el-dialog__header {
    box-shadow: 0 1px 0 0 rgba(52, 63, 75, 0.08);
}
.el-dialog__footer {
    box-shadow: inset 0 1px 0 0 rgba(52, 63, 75, 0.08);
}
/* 设置confir框width 自适应 */
.el-message-box {
    min-width: 420px;
    width: auto;
}
.el-input__inner {
    height: 36px !important;
    border: 1px solid #ccc;
}
/* 对话历史导出 */
.exportTable .el-input__inner {
    height: 28px !important;
}
/* 强制设置 */
.el-popover {
    padding: 0px !important;
    /* max-width: none; */
    /* height: 0 !important; */
    min-width:60px !important;
}
.el-popper[x-placement^=bottom]{
    margin: 0;
}
.popoverStatus.el-popper{
    max-width: 60px !important;
}
.el-popover .el-tabs {
    padding: 3px 0;
    min-width: 160px;
    text-align: left;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
    box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
    padding: 0 15px;
    min-height: 120px;
}
/* 转接对话样式 */
.agent-single-selector-shadowPanel .has-gutter tr th:nth-child(1) {
    display: none;
}
/* 会话创建工单样式 */
.ticketClass .sidebar-add header {
    display: none !important;
}
.ticketClass {
    height: 760px !important;
}
.ticketClass .sidebar-add {
    width: 100% !important;
    height: 100% !important;
}
/* 聊天快捷回复 */
.quick-reply-panel.imRecord-wrapper .el-collapse-item__header {
    height: 36px !important;
    line-height: 36px !important;
}
.quick-reply-panel.imRecord-wrapper .imChat-header .chat_jiao {
    top: 18px;
}
.demo-form-inline .el-textarea__inner {
    background-color: #edf5fc;
}
.robot .el-dialog__wrapper .el-dialog__body {
    padding: 30px 20px;
}
.repository .el-dialog__wrapper .el-dialog__body {
    padding: 30px 20px;
}
.robot .el-dialog__wrapper.hasFooter .el-dialog__footer {
    box-shadow: none;
}
.robot .helloTextBox div img {
    max-width: 400px;
}
.common_chat-wrapper
    .common_chat-inner
    .common_chat-main
    .common_chat-main-content
    > .inner
    .item.sender
    .item-content
    img {
    max-width: 100%;
    max-height: 500px;
}
.common_chat-wrapper
    .common_chat-inner
    .common_chat-main
    .common_chat-main-content
    > .inner
    .item.receiver
    .item-content
    img {
    max-width: 100%;
    max-height: 500px;
}
.robot section > div .defaultAnswerRich img {
    max-width: 200px;
}
.engage .el-table .cell {
    white-space: nowrap;
}
.headerTable .el-table td,
.el-table th {
    padding: 4px 0;
    /* max-width: 110px; */
}
.headerTable .el-table table thead {
    color: #343f4b;
    font-weight: 500;
    line-height: 22px;
    max-height: 22px;
}
.headerTable .el-table th {
    padding: 4px 0 !important;
    background-color: #f2f3f5;
}
.headerTable .el-table thead .cell {
    white-space: nowrap;
    text-align: center;
    /* max-width: 100px; */
}
.headerTable .el-table td .cell {
    white-space: nowrap;
    text-align: center;
    min-height: 22px;
    /* max-width: 100px; */
}
.showWord > input {
    padding-right: 50px;
}
.volume .el-button{
    background-color: #f2f3f5!important;
    color: #939da8!important;
    border-color: #f2f3f5!important;
}
/* 快捷回复 */
.el-tooltip__popper.is-dark.dialogPopover{
    background-color: #555556;
    padding: 10px;
    max-width: 200px;
    max-height: 300px;
}
.el-tooltip__popper.is-dark.dialogPopover .popper__arrow:after {
    border-left-color: #555556 !important;
}
.el-tooltip__popper.is-dark.dialogPopover .popper__arrow {
    border-left-color: #555556 !important;
}
/* 聊天快捷回复 */
.quick-reply-panel-conter .el-tooltip.item{
    display: inline-block;
    width: 150px;
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #009de7;
    font-size: 13px;
}
.quick-reply-panel-conter .custom-tree-node>span{
    display: inline-block;
    max-width: 170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.quick-reply-panel-conter .quick-reply{
    color: #b8bcc4;
    font-size: 12px;
}
.autoMessage section .btn{
	width: 100%;
}
.autoMessage .messagePreview .context .msg .text img{
	max-width: 200px;
}
.autoMessage section .main .text p{
	width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
	display: inline;
}
.el-select-dropdown .bgColor{
	margin: 0 20px;
	max-width: 120px;
    position: relative;
    display: inline-block;
    padding: 4px 7px;
    margin-right: 5px;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
	vertical-align: middle;
}
.search-history-dialogueLabel .el-cascader-node__label span{
	max-width: 120px;
	flex: inherit;
	display: inline-block;
	padding: 4px 7px;
	line-height: 1;
    font-size: 12px;
	color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
	vertical-align: middle;
}
/* 首页样式 */
.conter .el-table .el-table__body-wrapper .el-table__row{
    height: 70px;
}
</style>
