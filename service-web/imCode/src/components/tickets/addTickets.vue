<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-12 09:53:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-15 20:56:32
 -->
<template>
    <div>
        <div class="sidebar-add">
            <header>新建工单</header>
            <div class="content">
                <div class="content-item">
                    <label>工单分类</label>
                    <div>
                        <el-cascader
                            ref="refSubCat"
                            :show-all-levels="false"
                            :options="allSubCatList"
                            :props="subCatProps"
                            @change="handleSubCat"
                            clearable
                            expand-trigger="hover"
                            v-model="subCatValue"
                            popper-class="subCat"
                        >
                            <template slot-scope="{ node, data }">
                                <span
                                    class="tag"
                                    v-if="node.isLeaf"
                                    @mouseenter="mouseenterSubcat(node)"
                                    @mouseleave="mouseleaveSubcat(node)"
                                >{{ data.className }}</span>
                                <span v-if="!node.isLeaf">{{
                                    data.className
                                }}</span>
                            </template>
                        </el-cascader>
                    </div>
                </div>

                <div class="content-item">
                    <label>描述</label>
                    <div>
                        <quill-editor @inputContent="inputContent"></quill-editor>
                        <div
                            class="editor-content"
                            v-html="ticketOrder.content"
                            hidden
                        ></div>
                    </div>
                </div>
                <div class="content-item">
                    <label>处理人</label>
                    <div>
                        <el-cascader
                            v-model="handlerValue"
                            ref="refHandle"
                            :show-all-levels="false"
                            change-on-select
                            :options="handler"
                            @change="handleChange"
                            :props="handleOprops"
                            clearable
                            expand-trigger="hover"
                        ></el-cascader>
                    </div>
                </div>
                <div class="content-item">
                    <label>抄送</label>
                    <div class="cc">
                        <el-cascader
                            v-model="ccValue"
                            ref="ccCascader"
                            separator="/"
                            :options="ccData"
                            :props="props"
                            @change="ccChange"
                            clearable
                            expand-trigger="hover"
                            collapse-tags
                            popper-class="add_ccCascader"
                        ></el-cascader>
                    </div>
                </div>
                <div class="content-item">
                    <label>优先级</label>
                    <div class="priority">
                        <el-radio-group v-model="ticketOrder.priority">
                            <el-radio :label="0">低</el-radio>
                            <el-radio :label="1">中</el-radio>
                            <el-radio :label="2">高</el-radio>
                            <el-radio :label="3">紧急</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="content-item">
                    <label>截止时间</label>
                    <div>
                        <el-date-picker
                            v-model="ticketOrder.deadline"
                            type="datetime"
                            placeholder="选择日期时间"
                            @change="handleDate"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="expireTimeOption"
                        ></el-date-picker>
                    </div>
                </div>
                <div
                    class="content-item add-work-order"
                    @click="addTicketOrder()"
                >
                    <span>创建工单</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { deepClone } from "../util/util";
import quillEditor from "../../components/common/quillEditor";

export default {
    name: "addTickets",
    components: {
        quillEditor
    },
    props: {
        ticketOrderData: {
            required: true,
            type: Object,
            default: {
                trackId: "",
                visitId: ""
            }
        }
    },
    data() {
        return {
            expireTimeOption: {
                disabledDate(date) {
                    //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
                    return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            },
            props: {
                multiple: true
            },
            subCatProps: {
                value: "id",
                label: "className",
                children: "subcat"
            }, // 格式化工单信息
            allSubCatList: [], // 工单分类列表
            subCatValue: "",
            handleOprops: {
                value: "id",
                label: "name",
                children: "children"
                // checkStrictly: true
            }, // 格式化处理人
            handler: [], // 处理人列表
            handlerValue: [], //处理人默认值
            ccData: [], //抄送列表
            ccValue: [],
            ccList: [],
            checkList: [], //抄送,二维数组格式 [[25, 13, 16, 11]]
            // 工单对象
            ticketOrder: {
                // 如果选择的是具体人就传assigneeId   如果选择的某个组就传assigneeGroupId
                assigneeGroupId: null, // 处理人分组ID
                assigneeId: null, // 处理人ID,
                assigneeName: "",
                cc: [], //抄送
                classId: null, // 工单ID
                className: "",
                content: "", // 内容
                deadline: "", // 截止时间
                priority: 1, // 优先级 ， 默认为1
                trackId: "", //会话ID
                visitId: "", //访客ID
                autoRule: []
            },
            autoRule: {
                processTeamId: "",
                processPersonIdList: ""
            }
        };
    },
    created() {
        this.getAllSubCatList();
        this.listDeptTreeUsers();
    },
    methods: {
        mouseenterSubcat(node) {
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.subCat .el-cascader-panel .el-cascader-menu"
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
        mouseleaveSubcat(node) {
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.subCat .el-cascader-panel .el-cascader-menu"
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
        inputContent(value) {
            this.ticketOrder.content = value;
        },
        // ----------------------------------------------工单------------------------------------------------
        // 获取工单分类列表
        getAllSubCatList() {
            // this.$axios.get(this.$httpServer.getAllSubCatList, {}).then(res => {
            this.$axios.get(this.$httpServer.getSubCats, {}).then(res => {
                if (res && res.data.code == "0") {
                    this.allSubCatList = this.getTreeSubCat(res.data.data);
                }
            });
        },
        // 获取工单分类ID
        handleSubCat(value) {
            let that = this;
            this.ticketOrder.classId = value[value.length - 1];
            this.ticketOrder.className = this.$refs[
                "refSubCat"
            ].getCheckedNodes()[0].label;
            this.getAllSubCatList();
            // this.handlerValue = [1, "100088="];
            // // 获取默认的工单自动规则
            // this.$axios
            //   .get(this.$httpServer.autoRule + "/" + this.ticketOrder.classId)
            //   .then(res => {
            //     if (res && res.data.code == "0" && res.data.data) {
            //       // ccTeamId:
            //       let data = {
            //         // 抄送
            //         // ccTeamId:[23,17],
            //         // ccPersonIdList: [24, 22]
            //         // 处理人
            //         // processTeamId:25, //团队
            //         // processPersonIdList:13+"=" //个人
            //       };
            //       this.autoRule = data;
            //       this.autoRule = res.data.data;
            //       this.handlerValue = [];
            //       // 处理人 团队
            //       if (this.autoRule.processTeamId) {
            //         this.handlerValue = this.autoRule.processTeamId;
            //       }
            //       // 处理人 个人
            //       if (this.autoRule.processPersonIdList) {
            //         this.handlerValue = this.autoRule.processPersonIdList + "=";
            //       }
            //       // 抄送个人
            //       if (data.ccTeamId) {
            //         let arr = data.ccTeamId;
            //         let item = [];
            //         for (let i = 0; i < arr.length; i++) {
            //           let arr1 = this.getParents(this.ccData, arr[i] + "=").reverse();
            //           arr1.push(arr[i] + "=");
            //           item.push(arr1);
            //         }
            //         this.ccValue = item;
            //       }
            //       // 抄送团队
            //       // if(data.ccPersonIdList){
            //       // }
            //       // console.log(this.ccData);

            //       // this.getChildIds(this.ccData, 24);
            //       // console.log(this.getChildIds(this.ccData, 24));
            //     }
            //   });
        },
        //获取指定id的子节点id数组
        //找到某一父节点下的所有子节点
        getChildIds(arr, id) {
            var childIds = [];
            function a(arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (id.length >= arr[i].id.length) {
                        if (id.startsWith(arr[i].id)) {
                            if (arr[i].id.length == id.length) {
                                childIds.push(arr[i].id);
                            }
                            a(arr[i].children);
                        }
                    } else {
                        if (arr[i].id.startsWith(id)) {
                            childIds.push(arr[i].id);
                            a(arr[i].children);
                        }
                    }
                }
            }
            a(arr);
            return childIds;
        },

        // 根据 子ID 找到所有的父节点
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
        // children 若为空数组，则将children设为undefined
        getTreeSubCat(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].subcat.length < 1) {
                    delete data[i].subcat;
                    // data[i].subcat = [];
                } else {
                    this.getTreeSubCat(data[i].subcat);
                }
            }
            return data;
        },
        getIsFolder(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].subcat.length < 1 && data[i].isFolder == 1) {
                    delete data[i].subcat[i];
                } else {
                    this.getIsFolder(data[i].subcat);
                }
            }
            return data;
        },

        // ----------------------------------------------处理人------------------------------------------------
        // 获取处理人的集合列表
        listDeptTreeUsers() {
            this.$axios.get(this.$httpServer.listDeptTreeUsers).then(res => {
                if (res && res.data.code == "0") {
                    this.handler = this.getHandleChildren(
                        this.getTreeHandle(res.data.data)
                    );
                    // 过滤为空的处理人
                    let newHandler = [];
                    this.handler.forEach((item, index) => {
                        if (item.userList && item.userList.length > 0) {
                            newHandler.push(item);
                        }
                    });
                    this.handler = newHandler;

                    // 过滤为空的抄送
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
        removeEmptyArrayEle(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == "undefined") {
                    arr.splice(i, 1);
                    i = i - 1;
                }
            }
            return arr;
        },
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
                            obj.id = item.userId + "=";
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
                            objs.id = items.userId + "=";
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

        // 根据ID值 递归遍历集合 判断是组还是个人
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
        // 获取处理人
        handleChange(value) {
            let name = this.$refs["refHandle"].getCheckedNodes()[0].label;
            let id = this.$refs["refHandle"].getCheckedNodes()[0].value;
            this.ticketOrder.assigneeName = name;
            let object = {
                id: id,
                name: name
            };
            this.ticketOrder.assigneeGroupId = null;
            this.ticketOrder.assigneeId = null;
            this.index = 0;
            this.recursive(this.handler, object);
        },
        // ----------------------------------------------抄送------------------------------------------------
        // 将抄送的集合转换为指定的集合格式
        taCC(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].children && arr[i].children.length) {
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
        // 获取抄送
        ccChange(value) {
            this.ticketOrder.cc = [];
            let nodes = this.$refs["ccCascader"].getCheckedNodes();
            for (const key in nodes) {
                this.getCurrentPart(nodes[key].value, this.ccData);
            }
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
        // ----------------------------------------------截止日期------------------------------------------------
        // 截止日期
        handleDate(value) {
            this.deadline = value;
        },

        // 添加工单信息
        addTicketOrder() {
            let url = `/ticket/ticketOrder`;
            let ticketOrder = {
                classId: this.ticketOrder.classId,
                className: this.ticketOrder.className,
                assigneeName: this.ticketOrder.assigneeName,
                content: this.ticketOrder.content,
                deadline: this.ticketOrder.deadline,
                priority: this.ticketOrder.priority,
                trackId: this.ticketOrderData.trackId,
                visitId: this.ticketOrderData.visitId
            };

            if (this.ticketOrder.assigneeGroupId)
                ticketOrder.assigneeGroupId = this.ticketOrder.assigneeGroupId;

            if (
                this.ticketOrder.assigneeId &&
                this.ticketOrder.assigneeId.indexOf("=")
            ) {
                var str = this.ticketOrder.assigneeId;
                ticketOrder.assigneeId = parseInt(str.split("=")[0]);
            } else if (this.ticketOrder.assigneeId) {
                ticketOrder.assigneeId = this.ticketOrder.assigneeId;
            }
            if (this.ticketOrder.cc.length > 0) {
                let data = deepClone(this.ticketOrder.cc);
                for (const key in data) {
                    if (typeof data[key].ownerId == "string")
                        if (data[key].ownerId) {
                            data[key].ownerId = parseInt(
                                data[key].ownerId.split("=")[0]
                            );
                        }
                }
                ticketOrder.cc = data;
            }

            if (ticketOrder.content == null || ticketOrder.content == "") {
                this.$message1("描述信息不能为空");
                return false;
            }
            let that = this;

            this.$axios
                .post(this.$httpServer.addTicketOrder, ticketOrder)
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.$message1({
                            type: "success",
                            message: "新建成功",
                            showClose: true
                        });
                        that.$emit("addTicketsTtpe", 7);
                        // 关闭窗口
                        that.$emit("closeAddTickets", "");
                        that.$emit("getVisitorLatestTicket", "");
                    }
                });
        }
    },
    watch: {
        handlerValue() {
            if (this.$refs.refHandle) {
                this.$refs.refHandle.dropDownVisible = false;
            }
        }
    },
    mounted() {
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
            let that = this;
            var htmladd = document.createElement("bottom");
            htmladd.innerHTML = "确认";
            htmladd.className = "htmladd";
            htmladd.style.cssText =
                "cursor: pointer;position: absolute;bottom: -35px;height: 35px;line-height:35px;width:100%;background:#fff;text-align: center;color:#606266;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);";
            var el_l = document.querySelectorAll(
                ".el-popper.el-cascader__dropdown.add_ccCascader"
            );
            if (el_l.length > 0 && el_l.length == 1) {
                // 工单
                var el = el_l[0];
                console.log(el);
                if (!el.querySelector(".htmladd")) {
                    el.appendChild(htmladd);
                    var bo = el.querySelectorAll(".htmladd")[0];
                    bo.onclick = function() {
                        that.$refs.ccCascader.dropDownVisible = false;
                    };
                }
            }
        });
    },
    updated() {}
};
</script>

<style lang="less" scoped>
@import "../../common/css/base.less";
/deep/ #htmladd {
    position: absolute;
    bottom: -35px;
    height: 35px;
    line-height: 35px;
    // border: 1px solid red;
    width: 100%;
    background: #fff;
    text-align: center;
    color: red;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
}
// 工单列表
.sidebar-add {
    width: 280px;
    height: 100vh;
    background: #fff;
    float: left;
    header {
        line-height: 40px;
        display: block;
        padding: 0 20px;
        font-size: 13px;
        text-align: center;
        border-bottom: 1px solid #edeef0;
    }
    .content {
        overflow: auto;
        box-sizing: border-box;
        height: 100%;
        background-color: #fbfbfc;
        padding: 20px 20px 40px 20px;
        /deep/ .content-item {
            margin-bottom: 20px;
            label {
                display: block;
                font-size: 12px;
                color: #767d85;
                margin-bottom: 8px;
            }
            .el-cascader {
                height: 34px;
                width: 100%;
                .el-input__inner {
                    height: 34px;
                    border-radius: 0px;
                    border: none;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                .el-cascader__tags {
                    display: inline-block;
                    overflow: hidden; //超出的文本隐藏
                    text-overflow: ellipsis; //溢出用省略号显示
                    white-space: nowrap; //溢出不换行
                    .el-tag {
                        margin: 10px 0 2px 6px;
                    }
                }
            }
            .el-cascader__label {
                width: 100%;
            }
            &.add-work-order {
                span {
                    background: #009de7;
                    border: none;
                    color: #fff;
                }
                width: 100%;
                display: inline-block;
                height: 32px;
                line-height: 32px;
                font-size: 13px;
                font-weight: 400;
                text-align: center;
                cursor: pointer;
                border: none;
                border-radius: 4px;
                background: #009de7;
                &:hover {
                    background-color: #008cce;
                    span {
                        background: #008cce;
                    }
                }
            }
            // 抄送
            .el-select {
                .el-input__inner {
                    height: 34px;
                    border-radius: 0px;
                    border: none;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                .el-input__icon {
                    line-height: 34px;
                }
            }
            // 等级
            .priority {
                .el-radio-group {
                    display: flex;
                    label {
                        margin-right: 0;
                        flex: 1;
                    }
                }
            }
            // 日期
            .el-date-editor {
                width: 100%;
                .el-input__inner {
                    padding-left: 30px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 0px;
                    border: none;
                    font-size: 13px;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                .el-input__icon {
                    line-height: 34px;
                }
            }
        }
    }
}
/deep/ .mce-content-body.panel-body {
    p {
        img {
            width: 100%;
        }
    }
}
.el-popper.el-cascader__dropdown.subCat .el-cascader-node__label .tag {
    display: block;
    width: 100%;
    height: 100;
}
</style>
