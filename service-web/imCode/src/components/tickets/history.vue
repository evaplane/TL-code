<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-14 16:48:53
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-17 17:53:55
 -->
<template>
    <div>
        <el-dialog
            title="对话记录"
            :close-on-click-moda="false"
            :modal-append-to-body="true"
            :append-to-body="true"
            :visible.sync="dialogVisible"
            @close="closeHistrory"
            width="45%"
        >
            <div class="historyDialogue">
                <!-- <span v-for="(item,index) in historyListInfo.historyData" :key="index">{{item}}</span> -->
                <div class="tabpage-main clearfix">
                    <!-- 历史回复记录 -->
                    <div class="content clearfix">
                        <div class="load-more top">
                            <div
                                v-show="this.isLoadMore && (historyListInfo.total > 5) && historyListInfo.historyData.length>0"
                                @click="loadedHistory(1)"
                            >
                                <span>加载历史消息</span>
                            </div>
                            <div v-show="historyListInfo.historyData.length==0">
                                <span>暂无对话历史记录</span>
                            </div>
                        </div>
                        <div class="select">
                            <div
                                class="timeline"
                                v-for="(item,index) in historyListInfo.historyData"
                                :key="index"
                            >
                                <!-- 客服回复 -->
                                <!-- {{item.sendUser}}  {{visitId}} -->
                                <div
                                    class="message-info clearfix"
                                    :class="item.userType=='sys'?'sys':'client'"
                                >
                                    <div
                                        class="time-sender"
                                        v-show="item.userType=='sys'  && (item.contentType!= 3) && item.content"
                                    >
                                        <span>{{item.updatedate | dataFormat('MM-dd hh:mm:ss')}}</span>
                                        {{item.createuser}}
                                        <!-- <span v-if="item.userType=='sys'">我</span> -->
                                        <span>{{item.createuser}}</span>
                                    </div>

                                    <div
                                        class="time-sender"
                                        v-show="item.userType=='client'  && (item.contentType!= 3) && item.content"
                                    >
                                        <span>{{item.updatedate | dataFormat('MM-dd hh:mm:ss')}}</span>
                                        {{item.createuser}}
                                        <span v-if="item.userType=='client'">{{item.sendName}}</span>
                                        <!-- {{item}} -->
                                        <span>{{item.createuser}}</span>
                                    </div>

                                    <div
                                        v-if="item.contentType== 0"
                                        class="message-text"
                                        v-html="getqqemojiEmoji(item.content)"
                                    ></div>
                                    <!-- 2)图片类型 -->
                                    <div
                                        v-else-if="item.contentType== 1"
                                        class="message-text img"
                                    >
                                        <img
                                            class="img"
                                            :src="item.content"
                                            @click="imgViewDialog_show(item)"
                                        />
                                    </div>
                                    <!-- 3)文件类型 -->
                                    <div
                                        v-else-if="item.contentType==2"
                                        class="item-content file"
                                    >
                                        <div class="file">
                                            <div class="el-icon-document"></div>
                                            <div class="file_content">
                                                <div class="file_info">
                                                    <span class="file_name">{{showFile(item.content,'name')}}</span>
                                                    <span class="file_size">{{showFile(item.content,'size')}}</span>
                                                </div>
                                                <div
                                                    v-if="fileUpdIndexFun(index) == index"
                                                    class="progressTip"
                                                >
                                                    <el-progress
                                                        :percentage="percentage"
                                                        :color="customColor"
                                                    ></el-progress>
                                                </div>
                                                <div class="file_status">
                                                    <a
                                                        v-if="showDownload(item.content)"
                                                        :href="showFile(item.content,'url')"
                                                        target="_blank"
                                                        :download="showFile(item.content,'name')"
                                                        class="file_download"
                                                    >
                                                        <i class="el-icon-download"></i>下载
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 4)评价类型 -->
                                    <div
                                        v-else-if="item.contentType==3"
                                        class="evaluate"
                                    >
                                        <div
                                            class="inviteEval"
                                            v-if="setEvalData(item.content,'lv') == '1' || setEvalData(item.content,'lv') == '2' || setEvalData(item.content,'lv') == '3'"
                                        >
                                            <span>{{item.updatedate}}</span>
                                            <span>顾客评价</span>
                                            <div class="inviteEval">
                                                <span class="eval" :class="{evalBackColor1:setEvalData(item.content,'lv') == '1',evalBackColor2:setEvalData(item.content,'lv') == '2',evalBackColor3:setEvalData(item.content,'lv') == '3'}"
                                                >
                                                <i
                                                    class="iconfont-main"
                                                    :class="{iconHaoping:setEvalData(item.content,'lv') == '1',iconZhongping:setEvalData(item.content,'lv') == '2',iconChaping:setEvalData(item.content,'lv') == '3'}"
                                                ></i>
                                                <span >{{setEvalData(item.content,'lvType')}}</span>
                                                </span>
                                            </div>
                                            <div class="inviteEval evalDataParent">
                                                <div class="evalDataClass" :title="setEvalData(item.content,'data')">{{setEvalData(item.content,'data')}}</div>
                                            </div>
                                            <!-- <span></span> -->
                                        </div>
                                        <div v-else>
                                            <span>{{item.updatedate}}</span>
                                            <span>{{setEvalData(item.content,'data')}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 图片查看dialog -->
        <!-- <el-dialog
            title
            :append-to-body="true"
            :visible.sync="imgViewDialogVisible"
            class="imgView-dialog"
            :modal="false"
        >
            <div class="main">
                <img
                    class="img"
                    :src="imgViewDialog_imgSrc"
                />
            </div>
        </el-dialog> -->

        <el-dialog
            :append-to-body="true"
            height="auto"
            ref="elDialog"
            :visible.sync="imgViewDialogVisible"
            @close="imgViewDialog_close"
            class="imgView-dialog"
            :modal="false"
        >
            <div
                class="main"
                ref="elDialogMain"
            >
                <img
                    class="img"
                    ref="elDialogImg"
                    id="elDialogImg"
                    :src="imgViewDialog_imgSrc"
                    :style="{transform:'rotateZ('+deg+'deg)'}"
                />
            </div>
            <div class="main-edit">
                <i
                    class="iconfont-main icon-anticlockwise"
                    title="逆时针旋转"
                    @click="rotateFan"
                ></i>
                <i
                    class="iconfont-main icon-clockwise"
                    title="顺时针旋转"
                    @click="rotate"
                ></i>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { deepClone } from "../util/util";
export default {
    data() {
        return {
            imgViewDialogVisible: false, // 图片查看dialog的显示
            imgViewDialog_imgSrc: "", // 图片查看dialog的图片地址
            deg: 0,
            degStart:0,
            dialogVisible: true,
            trackData: [],
            isLoadMore: true, //显示加载更多
            historyListInfo: {
                historyData: [], //对话集合
                total: 0, //总页数
                pages: 0, //一共多少页
                size: 5, //每页条数
                current: 1 //当前页
            }
        };
    },
    props: {
        trackId: {
            required: true,
            type: String
        },
        visitId: {
            required: true,
            type: String
        }
    },
    watch: {
        trackId: "trackId",
        visitId: "visitId"
    },
    methods: {
        setEvalData(data,modl){
            let evalData = "";
            if(data != '' && data != undefined){
                if(modl == "lv"){
                evalData = JSON.parse(data).lv;
                }else if(modl == "data"){
                evalData = JSON.parse(data).center;
                }else{
                evalData = JSON.parse(data).lv == 1?"好评":JSON.parse(data).lv == 2?"中评":"差评";
                }
            }
            return evalData;
        },
        //   正方向
        rotate() {
            this.degStart = this.deg;
            this.deg += 90;
            if (this.deg == 90 || this.deg == 270) {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientWidth + "px";
            } else {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientHeight + "px";
                if (
                    this.$refs.elDialogImg.clientHeight <
                        this.$refs.elDialogImg.clientWidth &&
                    this.degStart == -180
                ) {
                    this.$refs.elDialogMain.style.height =
                        this.$refs.elDialogImg.clientWidth + "px";
                }
            }
            if (this.deg >= 360) {
                this.deg = 0;
            }
        },
        //   反方向
        rotateFan() {
            this.degStart = this.deg;
            this.deg -= 90;
            if (this.deg == -90 || this.deg == -270) {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientWidth + "px";
            } else {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientHeight + "px";
                if (
                    this.$refs.elDialogImg.clientHeight <
                        this.$refs.elDialogImg.clientWidth &&
                    (this.degStart == 0 || this.degStart == 180)
                ) {
                    this.$refs.elDialogMain.style.height =
                        this.$refs.elDialogImg.clientWidth + "px";
                }
            }
            if (this.deg >= 360 || this.deg == -360) {
                this.deg = 0;
            }
        },
        /**
         * 图片查看dialog_显示
         */
        imgViewDialog_show: function(item) {
            this.imgViewDialogVisible = true;
            this.deg = 0;
            this.degStart = 0;
            this.imgViewDialog_imgSrc = item.content;
            this.$nextTick(function() {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientHeight + "px";
            });
        },
        /**
         * 图片查看dialog_显示
         */
        imgViewDialog_close: function() {
            this.imgViewDialogVisible = false;
            var self = this;
            setTimeout(function() {
                self.imgViewDialog_imgSrc = "";
            }, 100);
        },
        loadedHistory(type) {
            if (type == 1) {
                this.historyListInfo.current += 1;
                if (
                    this.historyListInfo.current == this.historyListInfo.pages
                ) {
                    this.isLoadMore = false;
                }
                if (this.historyListInfo.current > this.historyListInfo.pages) {
                    this.$message1({
                        type: "error",
                        message: "没有更多了！"
                    });
                    return false;
                }
            }
            let obj = {
                trackId: this.trackId,
                visitId: this.visitId,
                size: this.historyListInfo.size,
                current: this.historyListInfo.current
            };
            this.$axios
                .get(
                    this.$httpServer.loadedHistory +
                        "?" +
                        this.$ak.Utils.serialize(obj)
                )
                .then(res => {
                    if (res && res.data.code == "0") {
                        let that = this;
                        that.historyListInfo.current;
                        that.historyListInfo.total = res.data.data.total;
                        that.historyListInfo.pages = res.data.data.pages;
                        that.historyListInfo.current;
                        let data = deepClone(res.data.data.records);
                        let user_id = JSON.parse(
                            sessionStorage.getItem("userInfo")
                        ).user_id;

                        data.sort(function(a, b) {
                            return (
                                Date.parse(b.createdate) -
                                Date.parse(a.createdate)
                            );
                        });

                        data.forEach((item, index) => {
                            item.sendUser == that.visitId
                                ? (item.userType = "sys")
                                : (item.userType = "client");

                            that.historyListInfo.historyData.unshift(item);
                        });
                    }
                });
        },
        // 转换为QQ表情
        getqqemojiEmoji(value) {
            if (value == undefined) {
                return;
            }
            var self = this;
            return value.replace(/\[(.+?)\]/g, function(item, value) {
                return self.$ak.Utils.getImgByFaceName(value);
            });
        },
        // 文件名解析
        showFile(value, type) {
            var params = {};
            var url = value;
            var urls = url.split("?");
            var arr = urls[1].split("&");
            for (var i = 0, l = arr.length; i < l; i++) {
                var newUrl = arr[i].split("=");
                params[newUrl[0]] = newUrl[1];
            }
            if (type == "name") {
                return params.name;
            }
            if (type == "size") {
                return params.size;
            }
            if (type == "url") {
                return urls[0];
            }
        },
        // 是否显示下载按钮
        showDownload(value) {
            let fileUrl = value.split("?")[0];
            if (fileUrl != "-1") {
                return true;
            } else {
                return false;
            }
        },
        // 是否显示下载进度条
        fileUpdIndexFun(index) {
            if (this.$store.imServerStore.state.fileUpdIndex > 0) {
                return this.$store.imServerStore.state.fileUpdIndex;
            } else {
                this.percentage = 0;
                return -1;
            }
        },
        closeHistrory() {
            this.$emit("closeHistrory", false);
        }
    },
    mounted() {
        this.loadedHistory();
    }
};
</script>
<style lang="less" scoped>
@import "../../common/css/base.less";
@import "../../common/css/qqemoji.less";
/deep/ .el-dialog__title {
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    text-align: center;
    color: #2a3541;
}
.historyDialogue {
    height: 500px;
    .tabpage-main {
        height: 100%;
        flex: 1;
        position: relative;
        .content {
            position: absolute;
            top: 0px;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            overflow-x: hidden;
            overflow-y: auto;
            flex-direction: column;
            .load-more {
                width: 100%;
                color: #969faa;
                cursor: pointer;
                font-size: 12px;
                text-align: center;
                display: block;
                &.top {
                    height: 32px !important;
                    line-height: 32px !important;
                }
                > div {
                    width: 100%;
                    height: 36px;
                    line-height: 36px;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    span {
                        width: 100%;
                        height: 32px;
                        line-height: 32px;
                        background-color: #fafafa;
                        display: block;
                        color: #969faa;
                        font-size: 12px;
                    }
                }
            }
            .select {
                flex: 1;
                padding: 36px 25px;
                .timeline {
                    // text-align: center;
                    color: #babcbb;
                    margin: 15px 0;
                    .event-item {
                        text-align: center;
                        color: #babcbb;
                        margin: 15px 0;
                        section {
                            font-size: 12px;
                            position: relative;
                            > div {
                                max-width: 67%;
                                overflow: hidden;
                                display: inline-block;
                                padding: 2px 8px;
                                color: #969faa;
                                border-radius: 10px;
                                background-color: #f2f3f5;
                                span {
                                    margin-right: 10px;
                                }
                            }
                        }
                    }
                    // 坐席
                    .agent-message {
                        height: 100%;
                        padding-left: 80px;
                        width: 100%;
                        margin-bottom: 15px;
                        text-align: right;
                        .time-sender {
                            text-align: right;
                            line-height: 1;
                            margin-bottom: 5px;
                            font-size: 12px;
                            color: #adb2bb;
                            .span {
                                padding-right: 5px;
                                margin-right: 5px;
                            }
                        }
                        .message {
                            float: right;
                            background-color: #f0f1f3;
                            color: #161e26;
                            position: relative;
                            border-radius: 3px;
                            padding: 8px 12px;
                            font-size: 13px;
                            line-height: 22px;
                            word-wrap: break-word;
                            word-break: break-all;
                            border: 1px dashed transparent;
                        }
                        .message {
                            background-color: #f0f1f3;
                        }
                    }
                    // 客服
                    .message-info {
                        &.sys,
                        &.client {
                            .time-sender {
                                line-height: 1;
                                margin-bottom: 5px;
                                font-size: 12px;
                                color: #adb2bb;
                                span {
                                    //   padding-left: 5px;
                                    //   margin-left: 5px;
                                }
                            }
                            .message-text {
                                background-color: #e7f4ff;
                                color: #161e26;
                                position: relative;
                                border-radius: 3px;
                                padding: 8px 12px;
                                font-size: 13px;
                                line-height: 22px;
                                word-wrap: break-word;
                                word-break: break-all;
                                border: 1px dashed transparent;
                            }
                            .evaluate {
                                text-align: center;
                                line-height: 1;
                                margin-bottom: 5px;
                                font-size: 12px;
                                color: #adb2bb;
                                .inviteEval {
                                    text-align: center;
                                    margin-top: 6px;
                                    .eval {
                                        span {
                                            border-radius: 15px;
                                            padding: 0 4px;
                                            color: #fff;
                                            display: inline-block;
                                        }
                                    }
                                    .iconfont-main{
                                        font-size: 14px !important;
                                        color: #FFF !important;
                                    }
                                    
                                }
                                .evalBackColor1 {
                                    background-color: #00ce7d;
                                }
                                .evalBackColor2 {
                                    background-color: #ffb652;
                                }
                                .evalBackColor3 {
                                    background-color: #ff5c5e;
                                }
                            }
                            .item-content.file {
                                background-color: #e7f4ff;
                                padding: 8px 12px;
                                color: #323c42;
                                .file {
                                    display: flex;
                                    .el-icon-document {
                                        font-size: 34px;
                                        margin-right: 10px;
                                    }
                                    .file_content {
                                        display: flex;
                                        flex: 1;
                                        flex-direction: column;
                                        min-width: 180px;
                                        .file_info {
                                            display: flex;
                                            .file_name {
                                                margin-right: 6px;
                                                max-width: 154px;
                                                text-overflow: ellipsis;
                                                overflow: hidden;
                                                display: inline-block;
                                                white-space: nowrap;
                                            }
                                            .file_size {
                                                font-size: 12px;
                                                color: #b8bcc4;
                                                display: inline-block;
                                                width: 63px;
                                            }
                                        }
                                        .file_status {
                                            font-size: 12px;
                                            color: #b8bcc4;
                                            margin-top: 10px;
                                            .file_download {
                                                float: right;
                                                display: flex;
                                                -ms-flex-align: center;
                                                align-items: center;
                                                cursor: pointer;
                                                margin-left: 10px;
                                                color: #009de7;
                                                a {
                                                    text-decoration: none;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        &.sys {
                            .time-sender {
                                text-align: left;
                            }
                            .message-text {
                                float: left;
                                background-color: #f0f1f3;
                                img {
                                    max-width: 300px;
                                    display: block;
                                    cursor: pointer;
                                }
                            }
                            .item-content.file {
                                float: left;
                                background-color: #f0f1f3;
                            }
                        }
                        &.client {
                            .time-sender {
                                text-align: right;
                            }
                            .message-text {
                                float: right;
                                background-color: #e7f4ff;
                                img {
                                    max-width: 300px;
                                    display: block;
                                    cursor: pointer;
                                }
                            }
                            .item-content.file {
                                float: right;
                                background-color: #e7f4ff;
                            }
                        }
                    }
                }
            }
        }
    }
}
.imgView-dialog {
    background: #00000080;
    height: 100%;
    /deep/ .el-dialog__header {
        height: 10px;
        line-height: 10px;
    }
    /deep/ .el-dialog__headerbtn {
        top: 10px;
        right: 10px;
        font-size: 20px;
    }
    .el-dialog {
        max-width: 75%;
        position: relative;
        background: transparent;
        box-shadow: none;
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 10px 20px !important;
            text-align: center;
            position: relative;
            height: 100%;
            .main {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                .img {
                    display: block;
                    max-width: 100%;
                    max-height: 500px;
                    transform: scale(0.5);
                }
            }
        }
    }
    .main-edit {
        height: 50px;
        line-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
            font-weight: 700;
            display: flex;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            margin: 10px;
            &:hover{
                cursor: pointer;
            }
        }
    }
}
</style>
<style scoped>
.el-dialog__wrapper >>> .el-dialog__body {
    padding: 30px 20px 10px 20px;
    height: auto;
}
</style>