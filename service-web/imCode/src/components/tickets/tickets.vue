<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-27 19:11:49
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-11 18:29:20
 -->
<template>
    <div
        class="wordOrder-wrapper"
        @click="clear_popup()"
    >
        <div class="sidebar">
            <div class="tab add">
                <a @click="addTickets()">新建工单</a>
            </div>
            <div class="tab search">
                <a @click="searchTickets()">搜索筛选</a>
            </div>
            <div class="menus">
                <el-tree
                    :data="ticketMenus"
                    @node-click="handleNodeClick"
                    highlight-current
                    default-expand-all
                    ref="ticketTree"
                    node-key="id"
                    :current-node-key="currentNodekey"
                >
                    <span slot-scope="{ node, data }">
                        <span class="lable">{{node.label}}</span>
                        <i
                            class="nums"
                            v-show="data.nums>0"
                        >{{data.nums}}</i>
                    </span>
                </el-tree>
            </div>
        </div>
        <add-tickets
            v-if="addWordOrder"
            @addTicketsTtpe="addTicketsTtpe"
            :ticketOrderData="ticketOrderData"
        ></add-tickets>
        <search-tickets
            v-if="searchWordOrder"
            @searchTicketsType="searchTicketsType"
        ></search-tickets>

        <div
            class="sidebar-info"
            v-if="manageWordOrder"
        >
            <el-select
                class="selectOne"
                v-model="sortTicketsName"
                @change="sortRules"
                ref="mySelect"
                placeholder="请选择"
            >
                <el-option
                    v-for="(item,index) in sort"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
                >
                    <span class="check">
                        <i
                            class="el-icon-check"
                            v-if="item.isCheck == true"
                        ></i>
                    </span>
                    <span style="float: left;  font-size: 13px">{{ item.name }}</span>
                </el-option>
            </el-select>

            <ul
                class="list-info"
                id="list-info"
                ref="listInfo"
                v-show="ticketList.length > 0"
            >
                <li
                    v-for="(item,index) in ticketList"
                    :key="index"
                    @click="changTicket(item,index)"
                    :class="[{active:index==ins},(item.deadline) && (new Date().getTime()>new Date(item.deadline).getTime())?'deadline':'']"
                >
                    <header>
                        {{item.title}}
                        <span :class="[item.status== '0' ? 'orange': '', item.status=='1'? 'red': '',item.status=='2'? 'blue': '',item.status=='3'? 'green': '',item.status=='4'? 'gray': '']">{{item.status | getStatus(item.status)}}</span>
                        <span
                            class="priority low"
                            v-if="item.priority==0"
                        >低</span>
                        <span
                            class="priority in"
                            v-if="item.priority==1"
                        >中</span>
                        <span
                            class="priority high"
                            v-if="item.priority==2"
                        >高</span>
                        <span
                            class="priority urgent"
                            v-if="item.priority==3"
                        >紧急</span>
                    </header>
                    <div
                        class="content"
                        v-html="item.content"
                    ></div>
                    <footer class="clearfix">
                        <!-- 组 -->
                        <span
                            class="assigneeGroupId"
                            v-if="item.assigneeGroupId"
                        >
                            <i class="group-iocn el-icon-user-solid"></i>
                            <span>{{item.handlerName}}</span>
                        </span>
                        <!-- 人 -->
                        <span
                            class="assigneeId"
                            v-if="item.assigneeId"
                        >
                            <i class="handler-name">
                                <i v-if="item.avatar">
                                    <img :src="item.avatar" />
                                </i>
                                <i v-else>
                                    <img
                                        src="../../../static/icon/administrator.png"
                                        alt
                                    />
                                </i>
                            </i>
                            <span>{{item.handlerName}}</span>
                        </span>
                        <span
                            class="date"
                            v-show="item.deadline"
                        >截至: {{item.deadline | dataFormat('MM-dd hh:mm')}}</span>
                    </footer>
                </li>
            </ul>
            <div
                class="empty-status"
                v-show="ticketList.length == 0"
            >
                <img
                    src="https://app-qcloud.meiqia.com/images/empty-status/ticket.png"
                    alt
                />
                <div class="text">没有满足条件的工单</div>
            </div>
        </div>
        <div
            class="ticket-empty"
            v-if="!isTicketList"
        >
            <img src="//app-qcloud.meiqia.com/assets/assets/9a3b7347eff0eb08e32daea9725414b4.png" />
            <div class="text">从左侧列表打开工单</div>
        </div>
        <div
            v-else
            class="tickets-main"
        >
            <div
                class="tickets"
                v-show="ticketObject"
            >
                <header>
                    <div class="panel-description">
                        <div class="panel-h">
                            <span
                                ref="isScreenRule"
                                :class="[item.id== '0' ? 'low': '', item.id=='1'? 'in': '',item.id=='2'? 'high': '',item.id=='3'? 'urgent': '','priority']"
                                @click.stop="isScreenRule(ticketObject.status == 0 || ticketObject.status == 1 || ticketObject.status == 2 || ticketObject.status == 5)"
                                v-for="(item,index) in ticketPriority"
                                :key="index"
                                v-show="ticketObject.priority==item.id"
                            >{{item.name}}</span>
                            <span class="name">{{ticketObject.title}}</span>
                            <span class="state">{{ticketObject.status | getStatus(ticketObject.status)}}</span>
                            <div
                                class="priority-item"
                                v-if="screenRule"
                            >
                                <ul>
                                    <li
                                        v-for="(item,index) in ticketPriority"
                                        :key="index"
                                    >
                                        <a @click="changePriority(ticketObject,item.id)">{{item.name}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="panel-f">
                            <el-cascader
                                ref="refSubCat"
                                placeholder="未设置"
                                :show-all-levels="false"
                                v-model="subCatValue"
                                :options="allSubCatList"
                                :props="optionProps"
                                expand-trigger="hover"
                                @change="subCatChange"
                                :disabled="ticketObject.status == 3 || ticketObject.status == 4 || ticketObject.status == 6 || ticketObject.status == 7 || ticketObject.status == 8 || ticketObject.status == 9"
                                popper-class="subCat1"
                            >
                                <template slot-scope="{ node, data }">
                                    <span
                                        class="tag"
                                        v-if="node.isLeaf"
                                        @mouseenter="mouseenterSubcat1(node)"
                                        @mouseleave="mouseleaveSubcat1(node)"
                                    >{{ data.className }}</span>
                                    <span v-if="!node.isLeaf">{{ data.className }}</span>
                                    <!-- <span v-if="!node.isLeaf">({{ data.subcat.length }})</span> -->
                                </template>
                            </el-cascader>

                            <label class="tip1">分配给:</label>
                            <span class="demonstration"></span>
                            <el-cascader
                                ref="refHandle"
                                :show-all-levels="false"
                                change-on-select
                                v-model="handlerValue"
                                :options="handler"
                                :props="handleOprops"
                                @change="handleChange"
                                expand-trigger="hover"
                                :disabled="ticketObject.status == 3 || ticketObject.status == 4 || ticketObject.status == 6 || ticketObject.status == 7 || ticketObject.status == 8 || ticketObject.status == 9"
                            ></el-cascader>

                            <label class="tip1">抄送给:</label>
                            <span class="demonstration1">
                                <el-cascader
                                    v-model="ccValue"
                                    ref="ccCascader"
                                    :show-all-levels="false"
                                    :options="ccData"
                                    :props="props"
                                    @change="ccChange"
                                    expand-trigger="hover"
                                    collapse-tags
                                    :disabled="ticketObject.status == 3 || ticketObject.status == 4 || ticketObject.status == 6 || ticketObject.status == 7 || ticketObject.status == 8 || ticketObject.status == 9"
                                    popper-class="ticket_ccCascader"
                                ></el-cascader>
                            </span>
                        </div>
                    </div>
                    <div
                        class="panel__actions"
                        v-if="ticketObject.status == 0 || ticketObject.status == 1 || ticketObject.status == 2 || ticketObject.status == 5"
                    >
                        <a @click="modifyStatus(ticketObject.id,4)">
                            <i class="el-icon-close"></i>
                            <span>不需处理</span>
                        </a>
                        <a @click="modifyStatus(ticketObject.id,3)">
                            <i class="el-icon-circle-check"></i>
                            <span>已解决</span>
                        </a>
                    </div>
                    <div
                        class="panel__actions"
                        v-if="ticketObject.status == 3 || ticketObject.status == 4 || ticketObject.status == 6 || ticketObject.status == 7 || ticketObject.status == 8 || ticketObject.status == 9"
                    >
                        <a @click="modifyStatus(ticketObject.id,2)">
                            <i class="el-icon-refresh"></i>
                            <span>重新打开</span>
                        </a>
                    </div>
                </header>
                <div
                    class="timeline-wrapper"
                    id="timeline-wrapper"
                    ref="timeline_wrapper"
                    :class="[ticketObject.status == 3 ? 'none':'' || ticketObject.status == 4 ? 'none':'' || ticketObject.status == 9 ? 'none':'']"
                >
                    <ul ref="timeline_ul">
                        <li
                            class="time-message"
                            v-for="(item,index) in this.ticketTimeLineData"
                            :key="index"
                        >
                            <div>
                                <span class="icon-item">
                                    <i
                                        class="creat"
                                        v-if="item.action==0"
                                    ></i>
                                    <!--创建了新工单-->
                                    <i
                                        class="admin"
                                        v-if="item.action==1"
                                    >
                                        <i v-if="item.avatar">
                                            <img :src="item.avatar" />
                                        </i>
                                        <i v-else>
                                            <img
                                                src="../../../static/icon/administrator.png"
                                                alt
                                            />
                                        </i>
                                    </i>
                                    <!--管理员-->
                                    <i
                                        class="success"
                                        v-if="item.action!=0 && item.content.status==3"
                                    ></i>
                                    <!--解决了工单-->
                                    <i
                                        class="solve"
                                        v-if="item.action!=0 && item.content.status==2"
                                    ></i>
                                    <!--重新打开了工单-->
                                    <i
                                        class="close"
                                        v-if="item.action!=0 &&  item.content.status==4"
                                    ></i>
                                    <!--关闭了工单-->
                                    <i
                                        class="transfer"
                                        v-if="item.action!= 0 &&  (item.content.assigneeId!=null || item.content.assigneeGroupId!=null)"
                                    ></i>
                                    <i
                                        class="edit"
                                        v-if="item.action!= 0 &&  item.content.classId!=null"
                                    ></i>
                                    <i
                                        class="el-icon-edit"
                                        v-if="item.action!= 0 && item.content.priority!=null"
                                    ></i>
                                </span>
                                <span class="role">{{item.createBy=='client'?'顾客':item.createBy}}</span>
                                <span
                                    class="for"
                                    v-if="item.action==0"
                                >创建了新工单</span>
                                <span
                                    class="for"
                                    v-if="item.action!=0 && item.content.status==3"
                                >解决了工单</span>
                                <span
                                    class="for"
                                    v-if="item.action!=0 && item.content.status==2"
                                >重新打开了工单</span>
                                <span
                                    class="for"
                                    v-if="item.action!=0 && item.content.status==4"
                                >关闭了工单</span>
                                <span
                                    class="for"
                                    v-if="item.action!=0 && (item.content.assigneeId!=null || item.content.assigneeGroupId!=null)"
                                >
                                    将工单转派给
                                    <i class="role">{{item.content.assigneeName}}</i>
                                </span>
                                <span
                                    class="for"
                                    v-if="item.action!=0 && item.content.classId!=null"
                                >
                                    将工单设置为
                                    <i class="role">{{item.content.className}}分类</i>
                                </span>
                                <span class="date">{{item.createTime | dataFormat('MM-dd hh:mm')}}</span>
                            </div>
                            <!-- contentType = 1 图片  -->
                            <!-- contentType = 0 内容  -->
                            <div
                                v-if="item.contentType != 1"
                                class="item-content common_chat_emoji-wrapper-global"
                            >
                                <div
                                    class="content"
                                    v-if="item.content.content"
                                    v-html="getqqemojiEmoji(item.content.content)"
                                ></div>
                                <div
                                    v-else
                                    v-html="getqqemojiEmoji(item.content.content)"
                                ></div>

                                <span
                                    class="dialogue"
                                    v-show="item.content.trackId"
                                    @click="dialogueRecord(item.content.trackId,item.content.visitId)"
                                >
                                    <i class="el-icon-chat-dot-round"></i>
                                    <span>对话记录</span>
                                </span>
                            </div>
                            <div
                                class="content"
                                v-else
                            >
                                <img
                                    :src="item.content"
                                    class="avatar"
                                    @click="imgViewDialog_show(item)"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    class="editor-wrapper"
                    v-if="ticketObject.status == 0 || ticketObject.status == 1 || ticketObject.status == 2 || ticketObject.status == 5"
                    @click="activation()"
                >
                    <div class="imServerAndClient">
                        <common-chat-emoji
                            title="表情"
                            class="item"
                            ref="qqemoji"
                            @select="qqemojiSelectFace"
                        ></common-chat-emoji>
                    </div>
                    <el-tabs type="border-card">
                        <el-tab-pane label="内部消息">
                            <div class="clearfix header">
                                <el-upload
                                    :action="ticketTimeAction"
                                    :headers="headers"
                                    class="avatar-uploader"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    name="file"
                                >
                                    <i
                                        class="iconfont-main icon-tupian"
                                        title="图片"
                                    ></i>
                                </el-upload>
                                <span
                                    class="el-icon-picture-outline kjhf"
                                    v-show="false"
                                >
                                    <i>快捷回复</i>
                                </span>
                            </div>
                            <div class="content">
                                <div class="input-wrapper">
                                    <div
                                        maxlength="500"
                                        class="inputContent common_chat_emoji-wrapper-global"
                                        id="common_chat_input"
                                        contenteditable="true"
                                        @paste.stop="inputContent_paste"
                                        @keydown="inputContent_keydown"
                                        @mouseup="inputContent_mouseup"
                                        @mouseleave="inputContent_mouseup"
                                    ></div>
                                </div>
                                <el-button
                                    class="send"
                                    type="primary"
                                    @click="sendTicketTimeLine(0)"
                                >发送</el-button>
                            </div>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="其他"></el-tab-pane> -->
                    </el-tabs>
                </div>
            </div>
        </div>
        <!-- 历史对话信息 -->
        <history
            v-if="historyDialogue"
            :trackId="trackId"
            :visitId="visitId"
            @closeHistrory="closeHistrory"
        ></history>
        <!-- 工单信息 -->
        <ticketsInfo
            :userBlackList="userBlackList"
            :dialogueLabelData="dialogueLabelData"
            :tableShowData="tableShowData"
            :operatingSystems="operatingSystems"
            :cusData="cusData"
            :visitorInformationData="visitorInformationData"
            :storeSelectedChatEn="storeSelectedChatEn"
            class="imCustomerlabel"
            v-if="!isCustomer"
        ></ticketsInfo>
        <div
            class="new-ticket"
            v-show="isCustomer && isTicketList"
        >
            <p class="empty">无顾客信息</p>
        </div>

        <!-- 图片查看dialog -->
        <el-dialog
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
import addTickets from "./addTickets.vue";
import searchTickets from "./searchTickets.vue";
import commonChatEmoji from "../common/common_chat_emoji.vue";
import ticketsInfo from "./ticketsInfo.vue";
import history from "./history";
export default {
    components: {
        addTickets,
        searchTickets,
        commonChatEmoji,
        ticketsInfo: ticketsInfo,
        history
    },
    watch: {
        sortTicketsEvent(value) {
            this.handleNodeClick(
                this.$route.params.type,
                // "undefined=",
                this.id,
                this.sortTicketsEvent
            );
        },
        handlerValue() {
            if (this.$refs.refHandle) {
                this.$refs.refHandle.dropDownVisible = false;
            }
            // this.previousElementSibling.click()
        }
        // storeSelectedChatEn(value) {
        //   if (storeSelectedChatEn) {
        //     this.$refs.common_chat.goEnd();
        //   }
        // },
        /**
         * 聊天记录滚动到底部
         */
        // storeHaveNewMsgDelegate(value) {
        //   this.$refs.common_chat.goEnd();
        // }
    },
    data() {
        return {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            },
            userBlackList: "", //访客黑名单信息
            flag: true,
            groundName: null,
            rules: null,
            rulesCondition: {},
            autoScroll: true,
            trackId: "", //历史对话ID
            visitId: "",
            historyDialogue: false,
            dialogueLabelData: [], //当前对话标签数据
            tableShowData: [], //当前顾客标签数据
            operatingSystems: "win",
            cusData: [], //对话标签数据
            visitorInformationData: {}, //访客数据

            imageUrl: "",
            currentNodekey: "",
            ins: 0, // 选中的下标
            types: 0, // 工单的类型ID
            typesId: 4, //工单树的ID
            sortTicketsName: "创建时间升序", // 排序名称
            sort: [
                { id: 1, value: 1, name: "创建时间升序", isCheck: true },
                { id: 2, value: 2, name: "创建时间降序", isCheck: false },
                { id: 3, value: 3, name: "优先级升序", isCheck: false },
                { id: 4, value: 4, name: "优先级降序", isCheck: false }
            ],
            sortId: 0,
            sortTicketsEvent: 0, // 排序规则
            type: "",
            id: "",

            isInsideShow: false, // 仅查看内部工单显示隐藏
            isTicketList: false, //是否存在工单信息
            isCustomer: true,
            addWordOrder: false, //新建工单
            searchWordOrder: false, //搜索工单
            manageWordOrder: true,
            screenRule: false,

            ticketOrderData: {},
            ticketList: [], //工单列表
            ticketObject: {}, //工单对象
            ticketPriority: [
                { id: "0", name: "低" },
                { id: "1", name: "中" },
                { id: "2", name: "高" },
                { id: "3", name: "紧急" }
            ],
            ticketsNum: [], // 未解决工单的统计数列表
            ccValue: [], // 抄送默认值
            ccData: [], //抄送列表
            props: { multiple: true },
            ticketMenus: [
                {
                    id: 1,
                    label: "我的工单",
                    isShow: true,
                    children: [
                        {
                            id: 4,
                            label: "待我处理",
                            nums: "0",
                            type: "5",
                            isShow: true
                        },
                        {
                            id: 5,
                            label: "抄送给我",
                            nums: "0",
                            type: "6",
                            isShow: true
                        },
                        {
                            id: 6,
                            label: "我创建的",
                            nums: "0",
                            type: "7",
                            isShow: true
                        },
                        {
                            id: 7,
                            label: "我回复的",
                            nums: "0",
                            type: "8",
                            isShow: true
                        },
                        {
                            id: 8,
                            label: "我处理的",
                            nums: "0",
                            type: "9",
                            isShow: true
                        }
                    ]
                },
                {
                    id: 2,
                    label: "未解决工单",
                    isShow: true,
                    children: [
                        {
                            id: 9,
                            label: "待分配",
                            nums: "0",
                            type: "0",
                            isShow: true
                        },
                        {
                            id: 10,
                            label: "待回复",
                            nums: "0",
                            type: "1",
                            isShow: true
                        },
                        {
                            id: 11,
                            label: "处理中",
                            nums: "0",
                            type: "2",
                            isShow: true
                        }
                    ]
                },
                {
                    id: 3,
                    label: "已完成工单",
                    isShow: true,
                    children: [
                        {
                            id: 12,
                            label: "已解决",
                            nums: "0",
                            type: "3",
                            isShow: true
                        },
                        {
                            id: 13,
                            label: "不需要处理",
                            nums: "0",
                            type: "4",
                            isShow: true
                        }
                    ]
                }
            ], //工单的树形结构
            allSubCatList: [], // 工单分类
            optionProps: {
                value: "id",
                label: "className",
                children: "subcat"
            }, // 格式化工单信息
            subCatValue: [],

            handler: [], // 处理人列表
            handlerValue: null,
            ticketOrder: {
                assigneeGroupId: null,
                assigneeId: null,
                cc: []
            },
            handleOprops: {
                value: "id",
                label: "name",
                children: "children"
            },
            ticketTimeLineData: [],
            ticketTimeLine: {
                content: "",
                contentType: null,
                ticketId: null
            },
            ticketTimeAction: this.$httpServer.im_fdfsupload,
            ticketTimeSrc: "",
            selectionRange: null, // 输入框选中的区域
            inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容

            tmpInputContentQQ: [],
            imgViewDialogVisible: false, // 图片查看dialog的显示
            imgViewDialog_imgSrc: "", // 图片查看dialog的图片地址
            deg: 0,
            degStart: 0,
            count: 0
        };
    },
    computed: {
        storeServerPermissions() {
            return this.$store.imServerStore.state.permissions;
        },
        storeServerValues() {
            return this.$store.imServerStore.getters.serverValues;
        },
        storeSelectedChatEn() {
            if (this.$store.imServerStore.getters.selectedChatEn == null) {
                return {};
            } else {
                return this.$store.imServerStore.getters.selectedChatEn;
            }
        },
        storeHaveNewMsgDelegate() {
            return this.$store.imServerStore.getters.haveNewMsgDelegate;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        }
    },
    created() {
        this.listDeptTreeUsers();
        this.createdCatList();
        this.getTicketsNum();
        this.getsortId();
        if (this.$route.query.ticketsId) {
            // 工单跳转
            let ticketsId = this.$route.query.ticketsId + "=";
            let status = this.$route.query.status;
            this.handleNodeClick(status, ticketsId, this.sortTicketsEvent);
        } else if (this.$route.params.type) {
            let that = this;
            setTimeout(function() {
                that.handleNodeClick(
                    that.$route.params.type,
                    "undefined=",
                    that.sortTicketsEvent
                );
            }, 200);
        } else {
            this.handleNodeClick(
                this.$route.params.type,
                "undefined=",
                this.sortTicketsEvent
            );
        }

        this.$nextTick(function() {
            if (this.ticketMenus.length > 0) {
                this.currentNodekey = this.ticketMenus[0].children[0].id;
                this.$refs.ticketTree.setCurrentKey(this.currentNodekey);
            }
        });

        // 获取该用户是否存在待分配权限
        let data = this.$store.imServerStore.state.permissions;
        if (data) {
            // let isShow = data.includes("sys_user_del");
            let isShow = data.includes("sys_tickets_distribution_edit");
            if (isShow) {
                this.ticketMenus[1].children.splice(0, 1);
            }
        }
    },
    methods: {
        //   正方向
        rotate() {
            // console.log(this.deg)
            this.degStart = this.deg;
            this.deg += 90;
            if (this.deg == 90 || this.deg == 270) {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientWidth + "px";
                // console.log(this.deg,this.$refs.elDialogMain.style.height)
                // console.log(this.deg,this.$refs.elDialogImg.clientWidth,1)
            } else {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientHeight + "px";
                // console.log(this.deg,this.$refs.elDialogMain.style.height)
                // console.log(this.deg,this.$refs.elDialogImg.clientWidth,2)
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
            // console.log(this.deg)
            this.degStart = this.deg;
            this.deg -= 90;
            if (this.deg == -90 || this.deg == -270) {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientWidth + "px";
                // console.log(this.deg,this.$refs.elDialogMain.style.height)
                // console.log(this.deg,this.$refs.elDialogImg.clientWidth,1)
            } else {
                this.$refs.elDialogMain.style.height =
                    this.$refs.elDialogImg.clientHeight + "px";
                // console.log(this.deg,this.$refs.elDialogMain.style.height)
                // console.log(this.deg,this.$refs.elDialogImg.clientWidth,2)
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
        mouseenterSubcat1(node) {
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.subCat1 .el-cascader-panel .el-cascader-menu"
            );
            if (el_l[node.level] && el_l.length > 0) {
                if (node.level == 1) {
                    el_l[node.level].style.display = "none";
                    if (el_l[node.level + 1]) {
                        el_l[node.level + 1].style.display = "none";
                    }
                } else if (node.level == 2) {
                    el_l[node.level].style.display = "none";
                } else {
                    el_l[node.level].style.display = "none";
                }
            }
        },
        mouseleaveSubcat1(node) {
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.subCat1 .el-cascader-panel .el-cascader-menu"
            );
            if (el_l[node.level] && el_l.length > 0) {
                if (node.level == 1) {
                    el_l[node.level].style.display = "block";
                } else if (node.level == 2) {
                    el_l[node.level].style.display = "block";
                } else {
                    el_l[node.level].style.display = "block";
                }
            }
        },
        // 格式化选择的组件
        formatCC() {
            let htmladd = document.createElement("bottom");
            htmladd.innerHTML = "确认";
            htmladd.className = "htmladd";
            htmladd.style.cssText =
                "cursor: pointer;position: absolute;bottom: -35px;height: 35px;line-height:35px;width:100%;background:#fff;text-align: center;color:#606266;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);";
            let that = this;
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.ticket_ccCascader"
            );
            if (el_l.length > 0 && el_l.length == 1) {
                var el = el_l[0];
                if (!el.querySelector(".htmladd")) {
                    el.appendChild(htmladd);
                    var bo = el.querySelectorAll(".htmladd")[0];
                    bo.onclick = function() {
                        that.$refs.ccCascader.dropDownVisible = false;
                        let params = {
                            id: that.ticketObject.id,
                            cc: that.ticketOrder.cc
                        };
                        that.$axios
                            .put(that.$httpServer.updateTicketOrder, params)
                            .then(res => {
                                if (res && res.data.code == "0") {
                                    that.$message1({
                                        message: "保存成功",
                                        type: "success",
                                        duration: 500
                                    });
                                    that.handleNodeClick(
                                        that.types,
                                        that.ticketObject.id
                                    );
                                    that.getTicketsNum();
                                }
                            });
                    };
                }
            }
        },
        // 发送文字和图片后滚动
        goTicketsEnd() {
            let that = this;
            this.$nextTick(() => {
                setTimeout(() => {
                    if (that.$refs.timeline_wrapper) {
                        that.$refs.timeline_wrapper.scrollTop = this.$refs.timeline_ul.scrollHeight;
                    }
                }, 100);
            });
        },
        clear_popup() {
            this.screenRule = false;
            if (this.$refs.qqemoji) {
                this.$refs.qqemoji.faceHidden = true;
            }
        },
        // 点击定位光标的位置
        activation() {
            this.$ak.Utils.positioningCursor("common_chat_input");
        },
        getsortId() {
            this.sort.forEach((elemnet, index) => {
                if (elemnet.isCheck) {
                    this.sortTicketsEvent = elemnet.value;
                }
            });
        },
        /**
         * 获取最新工单
         */
        getVisitorLatestTicket() {
            let that = this;
            let searData = JSON.parse(sessionStorage.getItem("userInfo"));
            that.$axios
                .get(
                    that.$httpServer.getVisitorLatestTicket +
                        "?ownerId=" +
                        searData.user_id +
                        "&visitId=" +
                        that.storeSelectedChatEn.sender
                )
                .then(res => {
                    // console.log(res);
                });
        },
        /**
         * 校验是否已加入黑名单
         */
        checkUserBlackList() {
            let that = this;
            let params = {
                ipAddress: this.visitorInformationData.clientIp,
                visitorId: this.visitorInformationData.clientId
            };
            that.$axios
                .post(that.$httpServer.checkBlackList, params)
                .then(res => {
                    that.userBlackList = res.data.data == null;
                });
        },
        /**
         * 加载访客信息
         */
        loadingVisitorInformation() {
            let that = this;
            let clientId = null;
            if (that.ticketObject.visitId) {
                clientId = that.ticketObject.visitId;
                that.isCustomer = false;
            } else {
                that.isCustomer = true;
            }
            let params = {};
            if (!clientId) {
                return false;
            }
            this.$axios
                .get(this.$httpServer.getImClientInfo + "?clientId=" + clientId)
                .then(res => {
                    let newData = res.data.data;
                    if (newData == null) {
                        this.visitorInformationData = {};
                        return;
                    }
                    this.visitorInformationData = newData;
                    that.checkUserBlackList();
                });
        },
        init() {
            var self = this;
            let common_chat = document.getElementById("common_chat_input");
            // 初始化状态
            if (this.ticketList.length > 0 && common_chat != null) {
                document.getElementById("common_chat_input").innerHTML = "";
                document.getElementById("common_chat_input").focus();
                if (this.$refs.qqemoji) {
                    this.$refs.qqemoji.faceHidden = true;
                }
            }
            setTimeout(function() {
                // 未断开获取焦点
                self.setInputContentSelectRange();
                // 设置之前保存的输入框内容
            }, 200);
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
        },
        /**
         * qqemoji选中表情
         */
        qqemojiSelectFace(rs) {
            var imgStr = rs.imgStr;
            this.setInputDiv(imgStr);
        },

        /**
         * 设置input输入框内容
         * @param {String} vlaue 设置的值
         */
        setInputDiv(value) {
            if (this.selectionRange == null) {
                document.getElementById("common_chat_input").focus();
                return;
            }
            // 1.设置selectionRange
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(this.selectionRange);
            } else {
                this.selectionRange && this.selectionRange.select();
            }
            // 2.表情转换为img
            value = this.getqqemojiEmoji(value);
            // 3.聊天框中是否选中了文本，若选中文本将被替换成输入内容
            if (window.getSelection) {
                var sel, range;
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    // 1)删除选中的文本(内容)
                    range = sel.getRangeAt(0); // 获取鼠标选中的文本区域
                    range.deleteContents(); // 删除选中的文本
                    // 2)创建以输入内容为内容的DocumentFragment
                    var elemnet;
                    if (range.createContextualFragment) {
                        elemnet = range.createContextualFragment(value);
                    } else {
                        // 以下代码等同createContextualFragment
                        // 创建一个DocumentFragment
                        elemnet = document.createDocumentFragment();
                        var divEl = document.createElement("div");
                        divEl.innerHTML = value;
                        // divEl下的元素，依次插入到DocumentFragment
                        for (
                            let i = 0, len = divEl.children.length;
                            i < len;
                            i++
                        ) {
                            elemnet.appendChild(divEl.firstChild);
                        }
                    }
                    // 3)选中文本的位置替换为新输入的内容，并把光标定位到新内容后方
                    var lastNode = elemnet.lastChild;

                    range.insertNode(elemnet);
                    if (lastNode) {
                        range.setStartAfter(lastNode);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if (
                document.selection &&
                document.selection.type != "Control"
            ) {
                document.selection.createRange().pasteHTML(imgStr);
            }
            this.setInputContentByDiv();
        },
        setInputContentByDiv() {
            var self = this;
            var htmlStr = document.getElementById("common_chat_input")
                .innerHTML;
            var tmpInputContent = htmlStr.replace(
                /<img.*?text="(.*?)".*?>/g,
                "[$1]"
            );
            // 2.设置最长长度
            if (tmpInputContent.length > 500) {
                document.getElementById("common_chat_input").innerHTML = "";
                var value = tmpInputContent
                    .substr(0, 499)
                    .replace(/\[(.+?)\]/g, function(item, value) {
                        return self.$ak.Utils.getImgByFaceName(value);
                    });
                this.setInputDiv(value);
            }
            // 3.修改值
            this.ticketTimeLine.content = tmpInputContent;
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
        inputContent_keydown(e) {
            if (e.keyCode == 13) {
                // 回车直接发送
                this.sendTicketTimeLine(0);
                e.returnValue = false;
                return;
            }
            this.setInputContentSelectRange();
            var self = this;
            // keyup触发时，绑定的数据还没有被变更，需要进行延后访问
            clearTimeout(this.inputContent_setTimeout);
            this.inputContent_setTimeout = setTimeout(function() {
                self.setInputContentByDiv();
            }, 200);
        },
        /**
         * 输入框的粘贴
         */
        inputContent_paste: function(e) {
            var self = this;
            var isImage = false;
            if (e.clipboardData && e.clipboardData.items.length > 0) {
                // 1.上传图片
                for (var i = 0; i < e.clipboardData.items.length; i++) {
                    var item = e.clipboardData.items[i];
                    if (
                        item.kind == "file" &&
                        item.type.indexOf("image") >= 0
                    ) {
                        // 粘贴板为图片类型
                        var file = item.getAsFile();
                        let formData = new FormData();
                        formData.append("file", file);
                        this.$axios
                            .post(this.ticketTimeAction, formData)
                            .then(res => {
                                if (res && res.data) {
                                    self.ticketTimeSrc = res.data.data;
                                    self.sendTicketTimeLine(1);
                                }
                            });
                        isImage = true;
                    }
                }
                // 2.非图片，粘贴纯文本
                if (!isImage) {
                    e.stopPropagation();
                    e.preventDefault();
                    var str = e.clipboardData.getData("text/plain");
                    // 转化为纯文字
                    var span = document.createElement("span");
                    span.innerHTML = str;
                    var txt = span.innerText;
                    this.setInputDiv(
                        txt
                            .replace(/\n/g, "")
                            .replace(/\r/g, "")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                    );
                }
            }
        },
        /**
         * 输入框的mouseup
         */
        inputContent_mouseup: function(e) {
            this.setInputContentSelectRange();
        },
        setInputContentSelectRange: function() {
            if (window.getSelection && window.getSelection().rangeCount > 0) {
                var selectRange = window.getSelection().getRangeAt(0);
                if (
                    selectRange.commonAncestorContainer.nodeName == "#text" &&
                    selectRange.commonAncestorContainer.parentElement &&
                    selectRange.commonAncestorContainer.parentElement.id ==
                        "common_chat_input"
                ) {
                    // 选中了输入框内的文本
                    this.selectionRange = selectRange;
                } else if (
                    selectRange.commonAncestorContainer.id ==
                    "common_chat_input"
                ) {
                    // 选中了输入框
                    this.selectionRange = selectRange;
                }
            }
            // this.$ak.Utils.positioningCursor("common_chat_input");
        },
        // 新建工单跳转
        addTicketsTtpe(type) {
            this.handleNodeClick(type);
            if (this.ticketMenus.length > 0) {
                this.currentNodekey = this.ticketMenus[0].children[2].id;
                this.$refs.ticketTree.setCurrentKey(this.currentNodekey);
                this.getTicketsNum();
            }
        },
        // 搜索工单跳转
        searchTicketsType(item) {
            let that = this;
            this.manageWordOrder = true;
            this.addWordOrder = this.searchWordOrder = false;
            this.ticketList = item.data;
            this.formatTickets(this.ticketList);
            this.isTicketList = this.ticketList.length > 0 ? true : false;
            if (item) {
                // 传输数据非空处理
                this.rules = item.rules;
                if (item.ticketOrder.assigneeGroupId)
                    this.rulesCondition.assigneeGroupId =
                        item.ticketOrder.assigneeGroupId;
                if (item.ticketOrder.assigneeId)
                    this.rulesCondition.assigneeId =
                        item.ticketOrder.assigneeId;
                if (item.ticketOrder.classId)
                    this.rulesCondition.classId = item.ticketOrder.classId;
                if (item.ticketOrder.deadlineTimeEnd)
                    this.rulesCondition.deadlineTimeEnd =
                        item.ticketOrder.deadlineTimeEnd;
                if (item.ticketOrder.deadlineTimeStart)
                    this.rulesCondition.deadlineTimeStart =
                        item.ticketOrder.deadlineTimeStart;
                if (item.ticketOrder.ownerId)
                    this.rulesCondition.ownerId = item.ticketOrder.ownerId;
                if (item.ticketOrder.solveTimeEnd)
                    this.rulesCondition.solveTimeEnd =
                        item.ticketOrder.solveTimeEnd;
                if (item.ticketOrder.solveTimeStart)
                    this.rulesCondition.solveTimeStart =
                        item.ticketOrder.solveTimeStart;
                if (item.ticketOrder.status)
                    this.rulesCondition.status = item.ticketOrder.status;
                this.$refs.ticketTree.setCurrentKey(item.type);
            }
            this.changTicket(item.data[0], 0, "object");
        },
        // -------------工单开始----------------
        // 获取处理人的集合列表
        listDeptTreeUsers() {
            let that = this;
            this.$axios.get(this.$httpServer.listDeptTreeUsers).then(res => {
                if (res && res.data.code == "0") {
                    // this.handler = this.getHandleChildren(
                    //   this.getTreeHandle(res.data.data)
                    // );
                    // this.ccData = this.getHandleChildren(
                    //   this.taCC(deepClone(res.data.data))
                    // );
                    this.handler = this.getHandleChildren(
                        this.getTreeHandle(res.data.data)
                    );

                    let newHandler = [];
                    this.handler.forEach((item, index) => {
                        if (item.userList && item.userList.length > 0) {
                            newHandler.push(item);
                        }
                    });
                    this.handler = newHandler;

                    this.ccData = this.getHandleChildren(
                        this.taCC(deepClone(res.data.data))
                    );
                    let newCCData = [];
                    this.ccData.forEach((item, index) => {
                        if (item.children && item.children.length > 0) {
                            newCCData.push(item);
                        }
                    });
                    this.ccData = newCCData;
                }
            });
        },
        // 将抄送的集合转换为指定的集合格式
        taCC(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].children && arr[i].children.length) {
                    arr[i].children = this.taCC(arr[i].children);
                } else {
                    arr[i].children = [];
                }
                arr[i].name && (arr[i].label = arr[i].name);
                arr[i].id && (arr[i].value = arr[i].id);
                delete arr[i].name;
                delete arr[i].id;
                delete arr[i].delFlag;
                delete arr[i].parentId;
                delete arr[i].sort;
                delete arr[i].tenantId;
                delete arr[i].userList;
            }
            return arr;
        },
        // 递归根据data 设置最后一个指定值为undeined
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
        // 递归根据对象的id，查找name值
        getHandleQueryName(data, id) {
            let name = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    name = data[i].name;
                } else {
                    this.getHandleQueryName(data[i].subcat, id);
                }
            }
            return name;
        },
        // 修改处理人的数据结构，把最后一项的children 追加userList数据
        getTreeHandle(data) {
            // 循环遍历json数据
            for (var i = 0; i < data.length; i++) {
                // 不存在分组
                // 不存在子children 或者有 userList
                if (
                    (data[i].children && data[i].children.length < 1) ||
                    data[i].userList.length > 0
                ) {
                    // children等于[] 并且 存在userList 的时候 赋值
                    if (
                        data[i].userList &&
                        data[i].userList.length > 0 &&
                        data[i].children.length < 1
                    ) {
                        let arr = [];
                        for (let index in data[i].userList) {
                            let item = data[i].userList[index];
                            let obj = {};
                            obj.id = item.userId;
                            obj.name = item.username;
                            obj.children = [];
                            arr.push(obj);
                        }
                        data[i].children = arr;
                        // children有值 且存在userList的时候 追加userList到children
                    } else if (
                        data[i].children &&
                        data[i].userList &&
                        data[i].children.length > 0
                    ) {
                        for (const key in data[i].userList) {
                            let items = data[i].userList[key];
                            let objs = {};
                            objs.id = items.userId;
                            objs.ownerType = 1;
                            objs.name = items.username;
                            objs.children = [];
                            data[i].children.push(objs);
                        }
                        this.getTreeHandle(data[i].children);
                    }
                } else {
                    this.getTreeHandle(data[i].children);
                }
            }
            return data;
        },
        getCurrentPart(id, data) {
            let obj = {};
            let arr = [];
            for (var i in data) {
                if (data[i].value == id) {
                    if (typeof data[i].children == "undefined") {
                        obj = {
                            ownerId: data[i].value,
                            ownerType: 0
                        };
                    } else {
                        obj = {
                            ownerId: data[i].value,
                            ownerType: 1
                        };
                    }
                    this.ticketOrder.cc.push(obj);
                    break;
                } else if (data[i].children) {
                    this.getCurrentPart(id, data[i].children);
                }
            }
            return arr;
        },
        /**
         * 获取抄送数据
         */
        ccChange(value) {
            this.ticketOrder.cc = [];
            let nodes = this.$refs["ccCascader"].getCheckedNodes();
            for (const key in nodes) {
                this.getCurrentPart(nodes[key].value, this.ccData);
            }
        },
        selectData(data, id) {
            let arr = [];
            let item = this.ccData;
            for (var i = 0; i < item.length; i++) {
                if (item[i].value == id) {
                    if (item[i].children && item[i].children.length > 0) {
                        arr.push(this.tree(item[i].children, id));
                    } else {
                        return false;
                    }
                }
            }
            return arr;
        },
        tree(item, id) {
            let arr = [];
            for (var i = 0; i < item.length; i++) {
                if (item[i].children && item[i].children.length > 0) {
                    this.tree(item, item[i].children);
                } else {
                    let ar = [];
                    ar[0] = id;
                    ar[1] = item[i].value;
                    arr.push(ar);
                }
            }
            return arr;
        },
        // -------------工单结束----------------
        /**
         * 获取工单分类
         */
        createdCatList() {
            this.$axios.get(this.$httpServer.getSubCats, {}).then(res => {
                if (res && res.data.code == "0") {
                    this.allSubCatList = this.getTreeData(res.data.data);
                }
            });
        },
        // 递归处理工单分类最后一级
        getTreeData(data) {
            // 循环遍历json数据
            for (var i = 0; i < data.length; i++) {
                if (data[i].subcat.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].subcat = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].subcat);
                }
            }
            return data;
        },
        // 判断处理人是人还是组
        recursive(data, obj) {
            let that = this;
            data.map(function(item) {
                if (
                    item.id !== obj.id &&
                    item.children &&
                    item.children.length
                ) {
                    that.recursive(item.children, obj);
                } else if (item.id == obj.id) {
                    if (item.name == obj.name && item.userList) {
                        that.ticketOrder.assigneeGroupId = obj.id;
                    }
                    if (
                        !item.children &&
                        !item.userList &&
                        item.name == obj.name
                    ) {
                        that.ticketOrder.assigneeId = obj.id;
                    }
                }
            });
            return data;
        },
        /**
         * 修改分配处理人
         */
        handleChange(value) {
            let name = this.$refs["refHandle"].getCheckedNodes()[0].label;
            let id = this.$refs["refHandle"].getCheckedNodes()[0].value;
            let object = {
                id: id,
                name: name
            };
            this.ticketOrder.assigneeGroupId = null;
            this.ticketOrder.assigneeId = null;
            this.recursive(this.handler, object);
            let params = {
                id: this.ticketObject.id,
                assigneeName: name
            };
            if (this.ticketOrder.assigneeGroupId != null) {
                params.assigneeGroupId = this.ticketOrder.assigneeGroupId;
            }
            if (this.ticketOrder.assigneeId != null) {
                params.assigneeId = this.ticketOrder.assigneeId;
            }
            this.$axios
                .put(this.$httpServer.updateTicketOrder, params)
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.$message1({
                            message: "保存成功",
                            type: "success",
                            duration: 500
                        });
                        this.handleNodeClick(this.types, this.ticketObject.id);
                        this.getTicketsNum();
                    }
                });
        },
        /**
         * 点击树形菜单查询工单---------------------------------------------------------------------------------------------------------------------
         * data  type 类型值
         * id 工单列表ID
         */
        handleNodeClick(data, id) {
            // console.log(data, id);
            this.rules = null;
            if (data && data.type) {
                // console.log(444);
                this.types = data.type;
                this.typesId = data.id;
                if (data != "undefined=") {
                    this.ticketsType(data.type, id, this.sortTicketsEvent);
                }
                sessionStorage.setItem("ticketsIndex", data.id);
            } else {
                // 不需要处理 , 最近工单
                if (data.children) return false; // 点击我的工单为父节点的时候不跳转
                this.types = data;
                this.ticketsType(data, id, this.sortTicketsEvent);
                if (data != 5 && this.$refs.ticketTree) {
                    this.$refs.ticketTree.setCurrentKey(
                        sessionStorage.getItem("ticketsIndex")
                    );
                }
            }
        },

        /**
         * 根据类型和ID查询主体 main 的对象信息
         */
        ticketsType(type, id, sortTicketsEvent) {
            this.type = type;
            this.id = id;
            this.$router.push({
                path: `/tickets/${type}`
            });
            let that = this;
            this.$axios
                .get(
                    that.$httpServer.getTicketList +
                        "/" +
                        type +
                        "/" +
                        sortTicketsEvent
                )
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.manageWordOrder = true;
                        this.addWordOrder = this.searchWordOrder = false;
                        this.ticketList = res.data.data;
                        this.formatTickets(this.ticketList);
                        this.isTicketList =
                            this.ticketList.length > 0 ? true : false;
                        // id 存在就是修改 id如果是字符串就是根据ID跳转
                        if (id) {
                            if (typeof id == "object" || id == "undefined=") {
                                // console.log(333)
                                this.sortRules(this.sortTicketsEvent);
                                this.changTicket(
                                    this.ticketList[0],
                                    0,
                                    "object"
                                );
                            } else if (
                                typeof id == "string" &&
                                id.indexOf("=") != -1
                            ) {
                                // console.log(999);
                                this.sortRules(this.sortTicketsEvent);
                                let item = {
                                    id: parseInt(id.split("=")[0])
                                };
                                let index = 0;
                                this.ticketList.forEach((v, i) => {
                                    if (v.id == item.id) {
                                        // console.log(v);
                                        let obj = v;
                                        this.ticketList.splice(i, 1);
                                        this.ticketList.unshift(v);
                                        // return (index = i);
                                    }
                                });
                                // 滚动到固定位置
                                let index_pro = index * 99;
                                this.$nextTick(() => {
                                    const container = document.getElementById(
                                        "list-info"
                                    );
                                    this.$refs.listInfo.scrollTo(
                                        0,
                                        index_pro + "px"
                                    );
                                    container.scrollTop = index_pro;
                                });
                                this.changTicket(item, index, "news");
                            } else {
                                // 修改工单等级，状态进
                                this.sortRules(this.sortTicketsEvent);
                                // 不需要处理进
                                this.ins = this.ins;
                                this.ticketObject = deepClone(
                                    this.ticketList[this.ins]
                                );
                                if (this.ticketList.length == this.ins) {
                                    let ins_c = this.ins - 1;
                                    this.changTicket(
                                        this.ticketList[ins_c],
                                        ins_c,
                                        "status"
                                    );
                                } else {
                                    this.changTicket(
                                        this.ticketList[this.ins],
                                        this.ins,
                                        "status"
                                    );
                                }
                                this.getTicketTimeList(2);
                            }
                        } else if (id == undefined) {
                            // console.log(777);
                            //  this.sortRules(this.sortTicketsEvent);
                            //   this.changTicket(this.ticketList[0], 0);
                        } else {
                            // console.log(888);
                            // 点击我的工单一进来
                            // 采用默认的排序
                            // 获取工单的第一个，index移动到第一个位置
                            // this.sortRules(this.sortTicketsEvent);
                            // this.changTicket(this.ticketList[0], 0);
                            // this.getTicketsNum();
                        }
                        this.manageWordOrder = true;
                        this.addWordOrder = this.searchWordOrder = false;
                    }
                    this.$nextTick(() => {
                        this.init();
                    });
                });
        },
        /**
         * 点击工单列表查询
         */
        changTicket(item, index, news) {
            let that = this;
            that.ins = index;
            that.ccValue = [];
            that.subCatValue = [];
            if (item && item.id) {
                that.$axios
                    .get(that.$httpServer.ticketOrder + "/" + item.id)
                    .then(res => {
                        if (res && res.data.code == "0") {
                            that.ticketObject = res.data.data.data;
                            if (news == "news") {
                                that.ticketMenus.forEach((v, i) => {
                                    v.children.forEach((v1, i1) => {
                                        if (
                                            v1.type == that.ticketObject.status
                                        ) {
                                            that.$refs.ticketTree.setCurrentKey(
                                                v1.id
                                            );
                                            return v1.id;
                                        }
                                    });
                                });
                            }
                            // 设置默认值工单分类
                            if (that.ticketObject.classId != null) {
                                // console.log(that.ticketObject.classId)
                                let arr = that.getSubCatParentsArr(
                                    that.allSubCatList,
                                    that.ticketObject.classId
                                );
                                if (arr) {
                                    let arr1 = arr.reverse();
                                    let arr2 = arr1.push(
                                        that.ticketObject.classId
                                    );
                                    that.subCatValue = arr1;
                                }
                            }
                            // 设置默认是组还是人
                            if (that.ticketObject.assigneeGroupId != null) {
                                // console.log(that.ticketObject.assigneeGroupId)
                                let arr = that.getParentsArr(
                                    that.handler,
                                    that.ticketObject.assigneeGroupId
                                );
                                let arr1 = arr.reverse();
                                let arr2 = arr1.push(
                                    that.ticketObject.assigneeGroupId
                                );
                                that.handlerValue = arr1;
                            }
                            if (that.ticketObject.assigneeId != null) {
                                // console.log(that.ticketObject.assigneeId)
                                let arr = that.getParentsArr(
                                    that.handler,
                                    that.ticketObject.assigneeId
                                );
                                let arr1 = arr.reverse();
                                let arr2 = arr1.push(
                                    that.ticketObject.assigneeId
                                );
                                that.handlerValue = arr1;
                            }
                            if (
                                that.ticketObject.assigneeGroupId == null &&
                                that.ticketObject.assigneeId == null
                            ) {
                                that.handlerValue = null;
                            }
                            if (
                                that.ticketObject.cc != null &&
                                that.ticketObject.cc.length > 0
                            ) {
                                that.ccValue = that.getCC(that.ticketObject.cc);
                            }
                            this.getTicketTimeList(2);
                            this.loadingVisitorInformation();
                            this.$nextTick(() => {
                                this.init();
                            });
                        }
                    });
            }
        },
        // 根据ID找到父下面的所有ID
        getSubCatParentsArr(data, id) {
            for (var i in data) {
                if (data[i].subcat) {
                    var ro = this.getSubCatParentsArr(data[i].subcat, id);
                    if (ro != undefined) {
                        return ro.concat(data[i].id);
                    }
                }
                if (data[i].id == id) {
                    return [];
                }
            }
        },
        // 根据ID找到父下面的所有ID
        getParentsArr(data, id) {
            // console.log(data,id)
            for (var i in data) {
                if (data[i].children) {
                    var ro = this.getParentsArr(data[i].children, id);
                    if (ro != undefined) {
                        return ro.concat(data[i].id);
                    }
                }
                if (data[i].id == id) {
                    return [];
                }
            }
        },
        /**
         * 获取未解决工单统计数
         * assigned 待回复 1
         * unassigned 待分配 0
         * ccToMe 抄送给我 6
         * assignedToMe 待我处理的 5
         * processing 处理中 2
         */
        getTicketsNum() {
            this.$axios.get(this.$httpServer.getTicketsNum).then(res => {
                if (res && res.data.code == "0") {
                    this.ticketsNum = res.data.data;
                    for (let index in this.ticketMenus) {
                        for (let i in this.ticketMenus[index].children) {
                            let type = this.ticketMenus[index].children[i].type;
                            if (type == 0)
                                this.ticketMenus[index].children[
                                    i
                                ].nums = this.ticketsNum.unassigned;
                            else if (type == 1)
                                this.ticketMenus[index].children[
                                    i
                                ].nums = this.ticketsNum.assigned;
                            else if (type == 2)
                                this.ticketMenus[index].children[
                                    i
                                ].nums = this.ticketsNum.processing;
                            else if (type == 5)
                                this.ticketMenus[index].children[
                                    i
                                ].nums = this.ticketsNum.assignedToMe;
                            else if (type == 6)
                                this.ticketMenus[index].children[
                                    i
                                ].nums = this.ticketsNum.ccToMe;
                        }
                    }
                }
            });
        },

        getCC(arr) {
            let arrs = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].ownerType == "0") {
                    let arri = this.getParents(this.ccData, arr[i].ownerId);
                    if (arri) {
                        arri.push(arr[i].ownerId);
                        arrs.unshift(arri);
                    }
                }
            }
            return arrs;
        },
        getParents(data, id) {
            for (var i in data) {
                if (data[i].children) {
                    var ro = this.getParents(data[i].children, id);
                    if (ro !== undefined) {
                        return ro.concat(data[i].value);
                    }
                }
                if (data[i].value == id) {
                    return [];
                }
            }
        },

        /**
         * 获取工单内容
         * 0 文字
         * 1 图片
         * 2 工单自动刷新
         */
        getTicketTimeList(type) {
            if (!this.ticketObject) {
                return false;
            }
            let that = this;
            this.$axios
                .get(
                    this.$httpServer.getTicketTimeList +
                        "/" +
                        this.ticketObject.id
                )
                .then(res => {
                    if (res && res.data.code == "0") {
                        let arr = [];
                        let data = res.data.data;
                        for (const key in data) {
                            if (data[key].contentType == "1") {
                                arr.push(data[key]);
                            } else {
                                if (this.$ak.Utils.isJSON(data[key].content)) {
                                    data[key].content = JSON.parse(
                                        data[key].content
                                    );
                                    arr.push(data[key]);
                                } else {
                                    arr.push(data[key]);
                                }
                            }
                            this.ticketTimeLineData = arr;
                        }
                        let arrs = [];
                        // 存在修改等级，修改抄送内容 过滤掉内容
                        this.ticketTimeLineData.forEach(item => {
                            if (item.type == 1) {
                                if (item.content.priority == undefined) {
                                    if (item.content.cc == undefined) {
                                        arrs.push(item);
                                    }
                                }
                            } else {
                                arrs.push(item);
                            }
                        });
                        this.ticketTimeLineData = arrs;
                        if (type == 0) {
                            this.$nextTick(() => {
                                if (
                                    document.getElementById("common_chat_input")
                                ) {
                                    document
                                        .getElementById("common_chat_input")
                                        .focus();
                                    document.getElementById(
                                        "common_chat_input"
                                    ).innerHTML = "";
                                }
                            });
                        }
                        if (type != 2) this.goTicketsEnd();
                    }
                });
        },
        /**
         * 工单信息发送【文字】
         */
        sendTicketTimeLine(type) {
            this.ticketTimeLine.content = document.querySelector(
                "#common_chat_input"
            ).innerHTML;
            let str = this.ticketTimeLine.content.replace(/&nbsp;/g, ""); //  去掉 nbsp;
            let newStr = str.replace(/\s+/g, ""); //  去掉空格;
            if (
                type == 0 &&
                (this.ticketTimeLine.content == null ||
                    this.ticketTimeLine.content.length == 0 ||
                    this.ticketTimeLine.content == "" ||
                    newStr == "")
            ) {
                this.ticketTimeLine.content = null;
                this.$message1({
                    message: "发送内容不能为空",
                    type: "warning"
                });
                return false;
            }
            let obj = {};
            obj.content = this.ticketTimeLine.content;
            let params = {
                content: JSON.stringify(obj),
                contentType: type,
                ticketId: this.ticketObject.id
            };
            if (type == 1) {
                params.content = this.ticketTimeSrc;
            }
            this.$axios
                .post(this.$httpServer.sendTicketTimeLine, params)
                .then(res => {
                    if (res && res.data.code == "0") {
                        if (type == 1) {
                            this.getTicketTimeList(1);
                        } else {
                            this.ticketTimeLine.content = "";
                            this.getTicketTimeList(0);
                        }
                        // 待回复刷新操作
                        if (
                            this.types == "1" ||
                            this.types == "5" ||
                            this.types == "7"
                        ) {
                            this.getTicketsNum();
                            this.handleNodeClick(
                                this.types,
                                this.ticketObject.id
                            );
                        }
                    }
                    // this.goTicketsEnd();
                });
        },
        /**
         * 工单信息发送【图片】
         */
        handleAvatarSuccess(res, file) {
            this.ticketTimeSrc = res.data;
            this.sendTicketTimeLine(1);
        },
        /**
         * 上传图片格式验证
         */
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!/^image\/(jpeg|png)$/.test(file.type)) {
                this.$message1({
                    message: "上传图片只能是 JPG或PNG 格式!",
                    type: "error"
                });
                return false;
            }
            if (!isLt2M) {
                this.$message1({
                    message: "上传图片大小不能超过 10MB!",
                    type: "error"
                });
            }
            // console.log(file);
            // let formData = new FormData();
            // formData.append("file", file);
            // this.$axios.post(this.ticketTimeAction, formData).then(res => {
            //     console.log(res.data.data);
            //     this.ticketTimeSrc = res.data.data;
            //     this.sendTicketTimeLine(1);
            // });
            return isLt2M;
        },
        // 新建工单
        addTickets() {
            this.addWordOrder = true;
            this.searchWordOrder = this.manageWordOrder = false;
        },
        // 搜索工单
        searchTickets() {
            this.searchWordOrder = true;
            this.addWordOrder = this.manageWordOrder = false;
        },
        /**
         * 修改工单状态
         * ticketsId 工单ID
         * status 工单状态 （2 重新打开；3 已解决；4 不需要处理）
         */
        modifyStatus(ticketsId, status) {
            // console.log(ticketsId,status)
            let that = this;
            if (ticketsId && status) {
                let params = {
                    id: ticketsId,
                    status: status
                };
                this.$axios
                    .put(that.$httpServer.updateTicketOrder, params)
                    .then(res => {
                        if (res && res.data.code == "0") {
                            that.$message1({
                                message: "保存成功",
                                type: "success"
                            });
                            that.handleNodeClick(this.types, ticketsId);
                            that.getTicketsNum();
                        }
                    });
            } else {
                return false;
            }
        },
        /**
         * 修改工单等级
         */
        changePriority(ticketObject, type) {
            if (ticketObject.priority == type) return false;
            let params = {
                id: ticketObject.id,
                priority: type
            };
            let that = this;
            this.$axios
                .put(this.$httpServer.updateTicketOrder, params)
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.$message1({
                            message: "保存成功",
                            type: "success",
                            duration: 500
                        });
                        this.handleNodeClick(this.types, ticketObject.id);
                    }
                });
            this.screenRule = false;
        },
        // 修改等级禁用
        isScreenRule(value) {
            if (value) this.screenRule = !this.screenRule;
        },
        /**
         * 修改工单分类
         */
        subCatChange(value) {
            let classId = value[value.length - 1];
            let className = this.$refs["refSubCat"].getCheckedNodes()[0].label;
            let params = {
                id: this.ticketObject.id,
                classId: classId,
                className: className
            };
            this.$axios
                .put(this.$httpServer.updateTicketOrder, params)
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.$message1({
                            message: "保存成功",
                            type: "success",
                            duration: 500
                        });
                        this.handleNodeClick(this.types, this.ticketObject.id);
                        this.getTicketsNum();
                        // 解决打开展开问题
                        this.createdCatList();
                    }
                });
        },
        // 工单历史记录
        dialogueRecord(trackId, visitId) {
            this.trackId = trackId;
            this.visitId = visitId;
            this.historyDialogue = !this.historyDialogue;
        },
        closeHistrory(value) {
            this.historyDialogue = value;
        },
        // 根据组ID判断返回name
        getGroupName(data, id) {
            var result, temp; //返回值和临时变量
            for (var i in data) {
                temp = data[i];
                if (temp["name"] && temp["id"] == id) {
                    result = temp["name"];
                    break; //如果已经返回了就中止
                }
                //如果还没有找到则遍历children参数下的数据
                if (typeof result == "undefined" && temp["children"]) {
                    result = this.getGroupName(temp["children"], id);
                }
            }
            return result;
        },
        // 根据人ID判断返回name
        getPeopleName(data, id) {
            var result, temp; //返回值和临时变量
            for (var i in data) {
                temp = data[i];
                if (temp.userList) {
                    for (const key in temp.userList) {
                        if (
                            temp["name"] &&
                            temp["userList"][key].userId == id
                        ) {
                            result = temp["userList"][key].username;
                            return result; //如果已经返回了就中止
                        }
                        // //如果还没有找到则遍历children参数下的数据
                        if (
                            typeof result == "undefined" &&
                            temp["children"] &&
                            temp.children.length > 0
                        ) {
                            result = this.getPeopleName(temp["children"], id);
                        }
                    }
                }
            }
            return result;
        },
        // 处理工单列表的客户名称和内容
        formatTickets(data) {
            let that = this;
            for (const key in data) {
                if (data) {
                    // 根据 assigneeGroupId 和 assigneeId 返回name 值
                    if (that.ticketList[key].assigneeGroupId) {
                        that.ticketList[key].handlerName = that.getGroupName(
                            that.handler,
                            that.ticketList[key].assigneeGroupId
                        );
                    } else if (that.ticketList[key].assigneeId) {
                        that.ticketList[key].handlerName = that.getPeopleName(
                            that.handler,
                            that.ticketList[key].assigneeId
                        );
                    }
                    that.ticketList[key].content = that.ticketList[
                        key
                    ].content.replace(/<img.*?src="(.*?)".*?>/g, "[图片]");
                }
            }
        },
        /**
         * 工单排序规则
         */
        sortRules(event) {
            // 控制选择
            let that = this;
            for (var i in this.sort) {
                if (this.sort[i].isCheck == true) {
                    this.sort[i].isCheck = false;
                }
                if (event == this.sort[i].value) {
                    this.sort[i].isCheck = true;
                }
            }
            // 如果是搜索的工单执行下面的搜索条件排序
            if (this.rules == "search") {
                this.rulesCondition.sortType = event;
                if (this.$ak.Utils.serialize(this.rulesCondition).length > 0) {
                    this.$axios
                        .get(
                            this.$httpServer.ticketSearch +
                                "?" +
                                this.$ak.Utils.serialize(this.rulesCondition)
                        )
                        .then(res => {
                            if (res && res.data.code == "0") {
                                this.ticketList = res.data.data;
                                this.formatTickets(this.ticketList);
                                this.changTicket(
                                    this.ticketList[0],
                                    0,
                                    "object"
                                );
                            }
                        });
                }
            } else {
                // 按照type选择排序
                switch (event) {
                    case 1:
                        this.sortTicketsEvent = 1;
                        break;
                    case 2:
                        this.sortTicketsEvent = 2;
                        break;
                    case 3:
                        this.sortTicketsEvent = 3;
                        break;
                    case 4:
                        this.sortTicketsEvent = 4;
                        break;
                }
            }
        }
    },
    mounted() {
        let that = this;
        setInterval(function() {
            document
                .querySelectorAll(".el-cascader-node__label")
                .forEach(el => {
                    el.onclick = function() {
                        if (this.previousElementSibling)
                            this.previousElementSibling.click();
                    };
                });
        }, 1000);
        this.$nextTick(function() {
            this.init();
            that.formatCC();
        });
    },
    updated() {
        this.$nextTick(function() {
            this.formatCC();
        });
    }
};
</script>

<style lang="less" scoped>
@import "../../common/css/base.less";
html,
body {
    width: 100%;
    height: 100%;
}
.rightContent {
    overflow-y: scroll;
}
.input-wrapper {
    position: relative;
    padding: 20px 0px 0px 10px;
    height: 60px;
    .inputContent {
        width: 99%;
        padding: 2px;
        height: 100%;
        resize: none;
        overflow: auto;
        line-height: 1.5;
        outline: 0px solid transparent;
    }
    .shortcutPopover-wrapper {
        position: absolute;
        top: 30px;
        left: 10px;
        width: 440px;
        max-height: 80px;
        padding: 4px;
        font-size: 12px;
        overflow-y: auto;
        border: 1px solid #9b9aab;
        border-radius: 3px;
        background-color: #fff;
        cursor: pointer;
        p {
            padding: 4px;
            &.selected {
                background-color: #ded1cc;
            }
            .key {
                display: inline-block;
                width: 50px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .content {
                display: inline-block;
                width: 350px;
                max-width: 350px;
                margin-left: 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .highlight {
                color: #00a8d7;
            }
        }
    }
    .tips {
        position: absolute;
        top: 7px;
        left: 20px;
        width: auto;
        color: #8d8d8d;
    }
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    color: #4d95fd;
    font-weight: bold;
}
.el-select-dropdown {
    min-width: 210px !important;
    .el-scrollbar {
        .eye {
            border-top: 1px solid rgb(240, 240, 240);
            display: block;
            height: 34px;
            line-height: 34px;
            color: rgb(96, 98, 102);
            font-size: 13px;
            padding: 0 20px;
            .check {
                float: left;
                padding-right: 30px;
                width: 20px;
                height: 20px;
            }
            span {
                font-size: 13px;
            }
            cursor: pointer;
            &:hover {
                background: #4ca0ff;
                span {
                    color: #fff;
                }
            }
        }
    }
}
.el-select-dropdown__item {
    padding: 0 20px;
    height: 34px;
    line-height: 34px;
    .check {
        float: left;
        padding-right: 30px;
        width: 20px;
        height: 20px;
    }
    &.selected {
        font-weight: normal;
    }
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
    height: 34px;
    line-height: 34px;
    background: none;
}
.el-select-dropdown__item:hover {
    background: #4ca0ff;
    // 样式需要修改的地方
    span {
        color: #fff;
    }
}

.wordOrder-wrapper {
    display: flex;
    padding-left: 70px;
    height: 100%;
    // 工单列表
    /deep/ .sidebar-info {
        min-width: 280px;
        max-width: 280px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #fbfbfc;
        float: left;
        .el-select {
            background-color: #ffffff;
            display: block;
            padding: 0 20px;
            font-size: 13px;
            border-bottom: 1px solid #edeef0;
            position: relative;
            .el-input__inner {
                border: none;
                height: 40px !important;
                line-height: 40px !important;
                padding: 0;
                font-size: 12px;
                color: #767d85;
            }
        }
        .list-info {
            overflow: auto;
            > li {
                padding: 15px 20px;
                font-size: 12px;
                color: #5a6978;
                cursor: pointer;
                &.active {
                    background-color: #f5f6f8;
                    box-shadow: 0 -1px 0 0 #edeef0, 0 1px 0 0 #edeef0;
                }
                &:hover {
                    background-color: #f5f6f8;
                    box-shadow: 0 -1px 0 0 #edeef0, 0 1px 0 0 #edeef0;
                }
                &.deadline {
                    max-height: 280px;
                    background-color: #fbe7e8;
                    box-shadow: 0 -1px 0 0 #edeef0, 0 1px 0 0 #edeef0;
                    .date {
                        color: #fe3824;
                    }
                }
                &.active.deadline {
                    max-height: 280px;
                    background-color: #f8d3d5;
                    box-shadow: 0 -1px 0 0 #edeef0, 0 1px 0 0 #edeef0;
                }
                header {
                    height: 20px;
                    position: relative;
                    span {
                        &.priority {
                            display: inline-block;
                            width: 32px;
                            height: 20px;
                            background-color: #4ca0ff;
                            position: absolute;
                            right: 0;
                            border-radius: 3px;
                            text-align: center;
                            line-height: 20px;
                            color: #fff;

                            &.low {
                                background-color: #808080;
                            }
                            &.in {
                                background-color: #4ca0ff;
                            }
                            &.high {
                                background-color: #fb894f;
                            }
                            &.urgent {
                                background-color: #f95f62;
                            }
                        }
                        &.orange {
                            color: #fb894f;
                        }
                        &.red {
                            color: #f95f62;
                        }
                        &.blue {
                            color: #4ca0ff;
                        }
                        &.green {
                            color: #2fcc80;
                        }
                        &.gray {
                            color: #808080;
                        }
                    }
                }
                .content {
                    margin: 7px 0;
                    color: #5a6978;
                    height: 16px;
                    line-height: 1.23;
                    font-size: 13px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                footer {
                    margin-top: 12px;
                    color: #969faa;
                    height: 14px;
                    font-size: 12px;
                    font-weight: 400;
                    font-style: normal;
                    font-stretch: normal;
                    .assigneeGroupId {
                        float: left;
                        i {
                            font-size: 18px;
                            width: 18px;
                            height: 18px;
                            vertical-align: middle;
                            &::before {
                                font-size: 18px;
                            }
                        }
                        span {
                            display: inline-block;
                            height: 20px;
                            line-height: 20px;
                            width: 100px;
                            vertical-align: middle;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .assigneeId {
                        float: left;
                        i {
                            width: 18px;
                            height: 18px;
                            display: inline-block;
                            background-size: 18px;
                            background-repeat: no-repeat;
                            vertical-align: middle;
                            margin-right: 2px;
                            &.handler-name {
                                background-image: url("../../../static/icon/administrator.png");
                                img {
                                    display: inline-block;
                                    border-radius: 50%;
                                    width: 20px;
                                    height: 20px;
                                    background-size: 20px;
                                    background-repeat: no-repeat;
                                    vertical-align: middle;
                                }
                            }
                        }
                        span {
                            display: inline-block;
                            height: 20px;
                            line-height: 20px;
                            width: 100px;
                            vertical-align: middle;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .date {
                        height: 18px;
                        line-height: 18px;
                        float: right;
                        color: #969faa;
                    }
                }
            }
        }
        .empty-status {
            text-align: center;
            padding-top: 60px;
            img {
                width: 80px;
            }
            .text {
                font-size: 12px;
                color: #989ea6;
            }
        }
    }
    // 我的任务
    .sidebar {
        float: left;
        min-width: 160px;
        max-width: 160px;
        background: #fff;
        border-right: 1px solid #f2f3f5;
        box-sizing: border-box;
        .tab {
            line-height: 40px;
            display: block;
            text-align: center;
            font-size: 13px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            a {
                color: #009de7;
            }
        }
        .menus {
            /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
                position: absolute;
                right: 10px;
                top: 6px;
            }
            /deep/ .el-tree-node__content {
                display: block;
                height: 34px;
                line-height: 34px;
                font-size: 12px;
                padding-left: 0 !important;
                .lable {
                    display: inline-block;
                    font-size: 12px;
                    color: #969faa;
                    width: 100%;
                    padding-left: 20px;
                }
            }
            /deep/ .el-tree-node__children {
                .aa {
                    display: block;
                    width: 100%;
                    height: 34px;
                    line-height: 34px;
                    box-sizing: border-box;
                }
                .aa:hover {
                    .edit {
                        display: block;
                    }
                }
                .lable {
                    font-size: 13px;
                    width: 100%;
                    display: inline-block;
                    padding-left: 30px;
                    padding-right: 30px;
                    text-overflow: ellipsis;
                    word-break: keep-all;
                    overflow: hidden;
                    color: #5a6978;
                    white-space: nowrap;
                }
            }
            /deep/ .el-tree-node {
                position: relative;
            }
            /deep/ .nums {
                position: absolute;
                right: 20px;
                font-size: 12px;
                color: red;
            }
            /deep/ .edit {
                display: none;
                position: absolute;
                right: 20px;
                top: 0;
                font-size: 15px;
                color: #4ca0ff;
            }
        }
    }
    .ticket-empty {
        flex: 1;
        background-color: rgb(242, 243, 245);
        margin: 0 auto;
        text-align: center;
        padding-top: 200px;
        border-left: 1px solid #f2f3f5;
        img {
            width: 80px;
        }
        .text {
            font-size: 12px;
            color: #989ea6;
        }
    }
    .tickets-main {
        flex: 1;
        display: flex;
        border-left: 1px solid #f2f3f5;
        height: 100%;
        /deep/ .tickets {
            flex: 1;
            display: flex;
            height: 100%;
            flex-direction: column;
            header {
                height: 80px;
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                .panel-description {
                    display: inline-block;
                    padding: 0 20px;
                    font-size: 13px;
                    height: 100%;
                    .panel-h {
                        margin-top: 10px;
                        position: relative;
                        .priority-item {
                            position: absolute;
                            top: 10px;
                            left: 10px;
                            z-index: 1;
                            border-radius: 4px;
                            background-color: #fff;
                            box-shadow: 0 5px 30px 0 rgba(52, 63, 75, 0.2);
                            min-width: 160px;
                            overflow-y: auto;
                            ul {
                                max-height: 410px;
                                overflow-y: auto;
                                padding: 5px 0;
                                margin: 2px 0 0;
                                font-size: 13px;
                                text-align: left;
                                list-style: none;
                                li {
                                    a {
                                        display: block;
                                        padding: 11px 18px;
                                        clear: both;
                                        font-weight: 400;
                                        line-height: 1.42857143;
                                        color: #333;
                                        text-decoration: none;
                                        cursor: pointer;
                                        &:active,
                                        &:hover {
                                            background-color: #009de7;
                                            color: #fff;
                                            text-decoration: none;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .panel-f {
                        margin-top: 8px;
                        color: #767d85;
                        .setup {
                            .el-button--info {
                                padding: 5px 8px;
                                background: #f2f3f5;
                                border: none;
                            }
                            span {
                                color: #767d85;
                                font-size: 12px;
                            }
                        }
                        .el-cascader {
                            .el-input__inner {
                                border: 0;
                                padding: 0;
                                height: 20px !important;
                                line-height: 20px !important;
                                width: 120px;
                            }
                            .el-cascader__label {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .el-cascader__tags {
                                display: inline-block;
                                overflow: hidden; //超出的文本隐藏
                                text-overflow: ellipsis; //溢出用省略号显示
                                white-space: nowrap; //溢出不换行
                                .el-tag__close.el-icon-close {
                                    display: none;
                                    line-height: 20px;
                                    top: -7px;
                                }
                                .el-tag {
                                    padding: 0px 10px;
                                }
                            }
                            .el-input__icon {
                                line-height: 20px !important;
                            }
                        }
                        .demonstration {
                            .el-select__tags {
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .el-input__inner {
                                border: 0;
                                padding: 0;
                                width: 100%;
                            }
                            .el-input.is-disabled {
                                background: none;
                                color: transparent;
                            }
                        }
                        .demonstration1 {
                            width: 300px;
                            .el-input__inner {
                                border: 0;
                                padding: 0;
                                width: 200px;
                                .el-tag {
                                    background: none;
                                }
                            }
                        }
                        .tip1 {
                            position: relative;
                            margin-left: 15px;
                            font-size: 12px;
                            &::before {
                                content: "";
                                width: 1px;
                                background-color: #cccccc;
                                position: absolute;
                                left: -10px;
                                height: 13px;
                                top: 2px;
                            }
                        }
                    }
                    span {
                        display: inline-block;
                        cursor: pointer;
                        &.priority {
                            color: #fff;
                            width: 32px;
                            height: 20px;
                            border-radius: 3px;
                            text-align: center;
                            font-size: 12px;
                            line-height: 20px;
                            &.low {
                                background-color: #808080;
                            }
                            &.in {
                                background-color: #4ca0ff;
                            }
                            &.high {
                                background-color: #fb894f;
                            }
                            &.urgent {
                                background-color: #f95f62;
                            }
                        }

                        &.name {
                            margin-left: 5px;
                            padding-right: 20px;
                            text-align: left;
                        }
                        &.state {
                            font-size: 12px;
                            color: #767d85;
                            position: relative;
                            &::before {
                                content: "";
                                width: 1px;
                                height: 70%;
                                background-color: #ccc;
                                position: absolute;
                                left: -10px;
                                height: 100%;
                                top: 1px;
                            }
                        }
                    }
                }
                .panel__actions {
                    float: right;
                    height: 100%;
                    display: inline-block;
                    display: flex;
                    // min-height: 100vh;
                    a {
                        width: 80px;
                        height: 60px;
                        // flex: 1;
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        text-align: center;
                        color: #28afec;
                        margin-top: 5px;
                        i {
                            width: 20px;
                            height: 20px;
                            margin: 10px auto;
                            display: block;
                            font-size: 24px;
                        }
                        span {
                            font-size: 14px;
                            font-weight: 400;
                        }
                    }
                }
            }
            .timeline-wrapper {
                background: #fff;
                overflow-y: auto;
                flex: 1;
                overflow-x: hidden;
                // height: 100%;
                padding: 30px 20px 100px 20px;
                &.none {
                    height: 100vh;
                    display: block;
                    ul {
                        display: block;
                    }
                }
                .time-message {
                    margin-bottom: 20px;
                    font-size: 12px;
                    &:first-child {
                        margin-bottom: 30px;
                        padding-bottom: 10px;
                        border-bottom: 1px dashed #ddd;
                        background-color: white;
                    }
                    span {
                        margin-left: 10px;
                    }
                    .role,
                    .receive {
                        color: #666;
                    }
                    .for,
                    .date {
                        color: #999;
                    }
                    .content {
                        margin-top: 10px;
                        margin-left: 35px;
                        background-color: #fffadd;
                        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.01);
                        border: 1px solid rgba(0, 0, 0, 0.06);
                        padding: 8px 12px;
                        border-radius: 4px;
                        line-height: 20px;
                        img {
                            // width: none;
                            max-width: 300px;
                            cursor: pointer;
                        }
                    }
                    .content-first {
                        margin-top: 10px;
                        margin-left: 35px;
                        background-color: red;
                        box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.01);
                        padding: 8px 0px;
                        border-radius: 4px;
                    }
                    .icon-item {
                        i {
                            width: 20px;
                            height: 20px;
                            display: inline-block;
                            background-size: 20px;
                            background-repeat: no-repeat;
                            vertical-align: middle;
                            &.creat {
                                background-image: url("../../../static/icon/create.png");
                            }
                            &.success {
                                background-image: url("../../../static/icon/complete.png");
                            }
                            &.transfer {
                                background-image: url("../../../static/icon/redeploy.png");
                            }
                            &.solve {
                                background-image: url("../../../static/icon/reopen.png");
                            }
                            &.close {
                                background-image: url("../../../static/icon/close.png");
                            }
                            &.admin {
                                img {
                                    display: inline-block;
                                    border-radius: 50%;
                                    width: 20px;
                                    height: 20px;
                                    background-size: 20px;
                                    background-repeat: no-repeat;
                                    vertical-align: middle;
                                }
                            }
                            &.edit {
                                background-image: url("../../../static/icon/set.png");
                            }
                        }
                    }
                    .dialogue {
                        display: inline-block;
                        cursor: pointer;
                        height: 24px;
                        line-height: 24px;
                        margin-left: 35px;
                        margin-top: 10px;
                        i {
                            font-size: 16px;
                            color: rgb(0, 160, 233);
                        }
                        span {
                            margin-left: 2px;
                            color: rgb(0, 160, 233);
                        }
                    }
                }
            }
            .editor-wrapper {
                height: 250px;
                background-color: #fffadd;
                // 客户端样式
                .imServerAndClient {
                    position: relative;
                }
                .common_chat_emoji-wrapper {
                    height: 0;
                }
                .imServerAndClient .imClientClass {
                    position: absolute;
                    left: 100px;
                    bottom: 31px;
                    z-index: 99999 !important;
                }
                // 坐席端样式
                .imServerAndClient .imServer {
                    padding: 12px !important;
                }
                .imServerAndClient .imClientBtoClass {
                    margin-bottom: 31px;
                }
                .imServerAndClient .iconfont-main {
                    font-size: 22px;
                    color: #969faa;
                }
                .imServerAndClient .iconfont-main:hover {
                    color: #ff0000;
                }
                .imServerAndClient .icon-biaoqing {
                    position: absolute;
                    top: 54px;
                    left: 46px;
                    z-index: 1111;
                }
                border-top: 1px solid #e4e7ed;
                .el-tabs {
                    box-shadow: none;
                }
                .el-tabs--border-card {
                    cursor: pointer;
                    border-bottom: none;
                    border-left: none;
                    border-right: none;
                    .icon-tupian {
                        font-size: 22px;
                        color: #969faa;
                        &:hover {
                            color: #ff0000;
                        }
                    }
                    .el-tabs__header {
                        .el-tabs__nav {
                            background-color: #fffadd;
                        }
                        .el-tabs__item.is-top.is-active {
                            .el-tabs__nav-scroll {
                                background-color: #fbfbfc;
                            }
                            background-color: #fffadd;
                            float: left;
                            min-width: 100px;
                            padding: 0 20px;
                            color: #969faa;
                            font-size: 13px;
                            line-height: 40px;
                            position: relative;
                            cursor: pointer;
                        }
                    }
                    .el-tabs__content {
                        background-color: #fffadd;
                    }
                    span {
                        &.bq {
                            float: left;
                            margin-right: 10px;
                        }
                        &.pic {
                            float: left;
                        }
                        &.kjhf {
                            float: right;
                            i {
                                font-size: 12px;
                                vertical-align: middle;
                                margin-left: 5px;
                            }
                        }
                    }
                }
                .content {
                    width: 100%;
                    height: 150px;
                    position: relative;
                    textarea {
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                        resize: none;
                    }
                    .send {
                        position: absolute;
                        bottom: 15px;
                        right: 0px;
                        padding: 7px 21px;
                    }
                }
            }
        }
    }
    .imCustomerlabel {
        background-color: #f2f3f5;
        border-left: 1px solid #e3e4e6;
    }
    .new-ticket {
        position: relative;
        width: 266px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f2f3f5;
        border-left: 1px solid #e3e4e6;
        .empty {
            font-size: 16px;
            text-align: center;
            margin-top: 150px;
            color: #969faa;
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
                    // height: 100%;
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
            &:hover {
                cursor: pointer;
            }
        }
    }
}
.el-popper.el-cascader__dropdown.subCat1 .el-cascader-node__label .tag {
    display: block;
    width: 100%;
    height: 100;
}
</style>

<style scoped>
.el-dialog__wrapper >>> .el-dialog__body {
    padding: 30px 20px 10px 20px;
    height: auto;
}
</style>