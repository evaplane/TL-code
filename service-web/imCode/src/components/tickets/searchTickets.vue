<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-12 09:53:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-12 10:52:36
 -->
<template>
    <div @click="isTicketStatus = false">
        <div class="sidebar-add">
            <header>搜索筛选</header>
            <div class="content">
                <div class="content-item">
                    <!-- 创建时间 -->
                    <div>
                        <label class="label">创建时间</label>
                        <el-date-picker
                            v-model="solveTime"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            @change="handSolveTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </div>
                    <!-- 截至时间 -->
                    <div>
                        <label class="label">截至时间</label>
                        <el-date-picker
                            v-model="deadlineTime"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            @change="handDeadlineTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </div>
                    <!-- 创建人 -->
                    <div>
                        <label class="label">创建人</label>
                        <el-cascader
                            v-model="establishValue"
                            ref="establishValue"
                            :show-all-levels="false"
                            :options="handler"
                            change-on-select
                            :props="handleOprops"
                            @change="handleOwner"
                            expand-trigger="hover"
                        ></el-cascader>
                    </div>

                    <!-- 处理人 -->
                    <div>
                        <label class="label">处理人</label>
                        <el-cascader
                            v-model="handlerValue"
                            ref="refHandle"
                            :show-all-levels="false"
                            change-on-select
                            :options="handler"
                            :props="handleOprops"
                            expand-trigger="hover"
                            @change="handleChange"
                        ></el-cascader>
                    </div>
                    <!-- 工单分类 -->
                    <div>
                        <label class="label">工单分类</label>
                        <el-cascader
                            ref="refSubCat"
                            :show-all-levels="false"
                            :options="allSubCatList"
                            :props="subCatProps"
                            @change="handleSubCat"
                            v-model="subCatValue"
                            expand-trigger="hover"
                            popper-class="subCat"
                        >
                            <template slot-scope="{ node, data }">
                                <span
                                    class="tag"
                                    v-if="node.isLeaf"
                                    @mouseenter="mouseenterSubcat(node)"
                                    @mouseleave="mouseleaveSubcat(node)"
                                >{{ data.className }}</span>
                                <span v-if="!node.isLeaf">{{ data.className }}</span>
                                <!-- <span v-if="!node.isLeaf">({{ data.subcat.length }})</span> -->
                            </template>
                        </el-cascader>
                    </div>
                    <!-- 工单状态 -->
                    <div class="ticketStatus">
                        <label class="label">工单状态</label>
                        <div @click.stop="isTicketStatus=true">
                            <el-input
                                placeholder="请选择工单状态"
                                v-model="ticketStatusValue"
                                suffix-icon="el-icon-arrow-down"
                            ></el-input>
                        </div>
                        <div
                            class="ticketStatus-item"
                            v-show="isTicketStatus"
                        >
                            <ul>
                                <li
                                    v-for="(item,index) in ticketStatusList"
                                    :key="index"
                                >
                                    <a @click.stop="changeStatus(item)">{{item.name}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div
                    class="content-item search-work-order"
                    @click="searchTicket()"
                >
                    <span>开始筛选</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            index: 0,
            // 日期选择器
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            const end = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000 -
                                    1
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() -
                                    24 * 60 * 60 * 1000
                            );
                            const end = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() - 1
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000
                            );
                            const end = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000 -
                                    1
                            );
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const start = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime()
                            );
                            const end = new Date(
                                new Date(
                                    new Date().toLocaleDateString()
                                ).getTime() +
                                    24 * 60 * 60 * 1000 -
                                    1
                            );
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            // 工单状态
            ticketStatusList: [
                { id: "0", name: "待分配" },
                { id: "1", name: "待回复" },
                { id: "2", name: "处理中" },
                { id: "3", name: "已解决" },
                { id: "4", name: "不需要处理" }
            ],
            isTicketStatus: false,
            ticketStatusValue: "",
            solveTime: "",
            deadlineTime: "",
            allSubCatList: [], // 工单分类列表
            subCatValue: "",
            subCatProps: {
                value: "id",
                label: "className",
                children: "subcat"
            }, // 格式化工单信息
            handleOprops: {
                value: "id",
                label: "name",
                children: "children"
            }, // 格式化处理人
            handler: [], // 处理人列表
            handlerValue: [],
            establishValue: [],
            ticketOrder: {
                solveTimeEnd: "", //解决结束时间
                solveTimeStart: "", //解决开始时间
                deadlineTimeEnd: "", //截止结束时间
                deadlineTimeStart: "", //截止开始时间
                classId: null, //工单分类ID
                assigneeId: null, //处理人ID(处理人ID与处理人分组ID只会一个存在)
                assigneeGroupId: null, //处理人分组ID(处理人ID与处理人分组ID只会一个存在)
                status: null, //工单状态[0:待分配,1:待回复,2:处理中,3:已解决,4:不需处理]
                ownerId: null //归属人ID
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
        // 解决时间
        handSolveTime(value) {
            if (value) {
                this.ticketOrder.solveTimeStart = value[0];
                value[1] = value[1].replace("00:00:00", "23:59:59");
                this.ticketOrder.solveTimeEnd = value[1];
            } else {
                this.ticketOrder.solveTimeStart = this.ticketOrder.solveTimeEnd =
                    "";
            }
        },
        // 截至时间
        handDeadlineTime(value) {
            if (value) {
                this.ticketOrder.deadlineTimeStart = value[0];
                value[1] = value[1].replace("00:00:00", "23:59:59");
                this.ticketOrder.deadlineTimeEnd = value[1];
            } else {
                this.ticketOrder.deadlineTimeStart = this.ticketOrder.deadlineTimeEnd =
                    "";
            }
        },
        // 工单分类
        handleSubCat(value) {
            this.ticketOrder.classId = value[value.length - 1];
            this.getAllSubCatList();
        },
        // 获取工单分类的数据
        getAllSubCatList() {
            this.$axios.get(this.$httpServer.getSubCats, {}).then(res => {
                if (res && res.data.code == "0") {
                    this.allSubCatList = this.getTreeSubCat(res.data.data);
                }
            });
        },
        // children 若为空数组，则将children设为undefined
        getTreeSubCat(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].subcat.length < 1) {
                    data[i].subcat = undefined;
                } else {
                    this.getTreeSubCat(data[i].subcat);
                }
            }
            return data;
        },

        // 获取处理人
        handleChange() {
            let name = this.$refs["refHandle"].getCheckedNodes()[0].label;
            let id = this.$refs["refHandle"].getCheckedNodes()[0].value;
            let object = {
                id: id,
                name: name
            };
            this.ticketOrder.assigneeGroupId = null;
            this.ticketOrder.assigneeId = null;
            this.index = 0;
            this.recursive(this.handler, object);
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

        // 创建人ID
        handleOwner(value) {
            let id = value[value.length - 1];
            this.ticketOrder.ownerId = id;
            // refHandle
        },
        // 获取处理人的集合列表
        listDeptTreeUsers() {
            this.$axios.get(this.$httpServer.listDeptTreeUsers).then(res => {
                if (res && res.data.code == "0") {
                    // this.handler = this.getHandleChildren(
                    //   this.getTreeHandle(res.data.data)
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
                    // this.ccData = this.getHandleChildren(
                    //   this.taCC(deepClone(res.data.data))
                    // );
                    // let newCCData = [];
                    //  this.ccData.forEach((item, index) => {
                    //   if (item.children && item.children.length > 0) {
                    //     newCCData.push(item);
                    //   }
                    // });
                    //  this.ccData = newCCData;
                }
            });
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
                            obj.id = item.userId;
                            obj.userId = item.userId;
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
                            objs.userId = items.userId;
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
        changTicketStatus() {
            this.isTicketStatus = true;
        },
        changeStatus(item) {
            if (item) {
                this.ticketStatusValue = item.name;
                this.ticketOrder.status = item.id;
            }
            this.isTicketStatus = !this.isTicketStatus;
        },
        // 搜索筛选
        searchTicket() {
            let ticketOrder = {
                sortType: 1
            };
            let that = this;
            if (this.ticketOrder.ownerId)
                ticketOrder.ownerId = this.ticketOrder.ownerId;
            if (this.ticketOrder.status)
                ticketOrder.status = this.ticketOrder.status;
            if (this.ticketOrder.assigneeGroupId)
                ticketOrder.assigneeGroupId = this.ticketOrder.assigneeGroupId;
            if (this.ticketOrder.assigneeId)
                ticketOrder.assigneeId = this.ticketOrder.assigneeId;
            if (this.ticketOrder.classId)
                ticketOrder.classId = this.ticketOrder.classId;
            if (
                this.ticketOrder.deadlineTimeEnd &&
                this.ticketOrder.deadlineTimeStart
            ) {
                ticketOrder.deadlineTimeEnd = this.ticketOrder.deadlineTimeEnd;
                ticketOrder.deadlineTimeStart = this.ticketOrder.deadlineTimeStart;
            }
            if (
                this.ticketOrder.solveTimeEnd &&
                this.ticketOrder.solveTimeStart
            ) {
                ticketOrder.solveTimeEnd = this.ticketOrder.solveTimeEnd;
                ticketOrder.solveTimeStart = this.ticketOrder.solveTimeStart;
            }
            // 判断创建时间不能大于截至时间
            if (
                this.ticketOrder.deadlineTimeStart &&
                this.ticketOrder.solveTimeStart
            ) {
                if (
                    this.ticketOrder.solveTimeStart >
                    this.ticketOrder.deadlineTimeStart
                ) {
                    this.$message1({
                        message: "创建时间不能大于截至时间"
                    });
                    return;
                }
            }
            if (this.$ak.Utils.serialize(ticketOrder).length > 0) {
                this.$axios
                    .get(
                        this.$httpServer.ticketSearch +
                            "?" +
                            this.$ak.Utils.serialize(ticketOrder)
                    )
                    .then(res => {
                        if (res && res.data.code == "0") {
                            that.$emit("searchTicketsType", {
                                ticketOrder: this.ticketOrder,
                                type: null,
                                rules: "search",
                                data: res.data.data
                            });
                        }
                    });
            }
        }
    },
    mounted() {
        this.timeDefaultShow = new Date();
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
    },
    watch: {
        handlerValue() {
            if (this.$refs.refHandle) {
                this.$refs.refHandle.dropDownVisible = false;
            }
        },
        establishValue() {
            if (this.$refs.establishValue) {
                this.$refs.establishValue.dropDownVisible = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../common/css/base.less";

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
        height: 100%;
        background-color: #fbfbfc;
        box-sizing: border-box;
        padding: 20px 20px 80px 20px;
        /deep/ .content-item {
            margin-bottom: 20px;
            > div {
                margin-bottom: 15px;
            }
            .ticketStatus {
                position: relative;
                .ticketStatus-item {
                    position: absolute;
                    top: 40px;
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
                .el-input__inner {
                    width: 100%;
                    cursor: pointer;
                }
            }
            .label {
                display: inline-block;
                font-size: 12px;
                color: #767d85;
                height: 20px;
                line-height: 20px;
                margin-bottom: 6px;
            }
            .w-e-toolbar {
                width: 100%;
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
            }
            .el-select {
                height: 34px;
                width: 100%;
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
            .el-cascader__label {
                width: 100%;
            }
            &.search-work-order {
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
            &.saveSearch {
                a {
                    display: block;
                    text-align: center;
                    color: #009de7;
                    font-size: 13px;
                }
            }
            .el-range-editor {
                height: 34px;
                border-radius: 0px;
                border: none;
                box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                color: #969faa;
                .el-input__icon {
                    height: 34px;
                    line-height: 34px;
                }
                .el-range-separator {
                    padding: 0;
                    line-height: 28px;
                }
            }
            .el-input__inner {
                width: 100%;
            }
            // 日期
            .el-date-editor {
                .el-input__inner {
                    padding-left: 30px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 0px;
                    border: none;
                    font-size: 13px;
                    width: 100%;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                .el-input__icon {
                    line-height: 34px;
                }
            }
            .el-input__inner {
                height: 34px;
                border-radius: 0px;
                border: none;
                font-size: 13px;
                box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                color: #969faa;
            }
        }
    }
}
.el-popper.el-cascader__dropdown.subCat .el-cascader-node__label .tag {
    display: block;
    width: 100%;
    height: 100;
}
</style>