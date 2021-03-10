<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-17 16:08:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-14 15:24:05
 -->
<template>
    <div class="imCustomerlabel">
        <el-row class="title">
            <el-col
                class="title-left"
                :span="18"
            >来源信息</el-col>
        </el-row>
        <el-row
            class="child"
            style="margin-top:10px"
        >
            <el-col
                class="title-left"
                :span="4"
            >IP</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <span>{{visitorInformationData.clientIp}}</span>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >地区</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <span>{{visitorInformationData.clientProvince}} {{visitorInformationData.clientCity}}</span>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >系统</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <span>{{visitorInformationData.clientPlatform}}</span>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >浏览器</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <span>{{visitorInformationData.clientBrowser}}</span>
            </el-col>
        </el-row>
        <el-row class="title">
            <el-col
                class="title-left"
                :span="18"
            >顾客名片</el-col>
        </el-row>
        <el-row
            class="child"
            style="margin-top:10px"
        >
            <el-col
                class="title-left"
                :span="4"
            >姓名</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.clientName"
                    :userBlack="userBlackList"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'clientName'"
                    :valueData="visitorInformationData.clientName == null?'':visitorInformationData.clientName"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >年龄</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerAge"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerAge'"
                    :valueData="visitorInformationData.customerAge == null?'':visitorInformationData.customerAge"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >性别</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerGender"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerGender'"
                    :valueData="visitorInformationData.customerGender == null?'':visitorInformationData.customerGender"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >电话</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerPhone"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerPhone'"
                    :valueData="visitorInformationData.customerPhone == null?'':visitorInformationData.customerPhone"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >QQ</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerQq"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerQq'"
                    :valueData="visitorInformationData.customerQq == null?'':visitorInformationData.customerQq"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >微信</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerWx"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerWx'"
                    :valueData="visitorInformationData.customerWx == null?'':visitorInformationData.customerWx"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >地址</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerAddress"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerAddress'"
                    :valueData="visitorInformationData.customerAddress== null?'':visitorInformationData.customerAddress"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >邮箱</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerEmail"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerEmail'"
                    :valueData="visitorInformationData.customerEmail== null?'':visitorInformationData.customerEmail"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >备注</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerRemark"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerRemark'"
                    :valueData="visitorInformationData.customerRemark== null?'':visitorInformationData.customerRemark"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child">
            <el-col
                class="title-left"
                :span="4"
            >联系人</el-col>
            <el-col
                class="title-right"
                :span="12"
            >
                <editDiv
                    v-model="visitorInformationData.customerLinkman"
                    @loadingVisitorInformation="loadingVisitorInformation"
                    :userBlack="userBlackList"
                    :visitorInformationData="visitorInformationData"
                    :valueDataString="'customerLinkman'"
                    :valueData="visitorInformationData.customerLinkman== null?'':visitorInformationData.customerLinkman"
                ></editDiv>
            </el-col>
        </el-row>
        <el-row class="child tab">
            <el-col :span="18">1NOnTugYK0mWCJEyuLV</el-col>
        </el-row>
    </div>
</template>
<script>
import editDiv from "../imServer/innerHtml";
export default {
    props: {
        operatingSystems: {
            required: true,
            type: String,
            default: ""
        },
        // 所有对话标签
        // cusData:{
        //   required: true,
        //   type: Array,
        //   default: ()=>{
        //     return [];
        //   }
        // },
        storeSelectedChatEn: {
            required: true,
            type: Object,
            default: {}
        },
        visitorInformationData: {
            required: true,
            type: Object,
            default: []
        },
        dialogueLabelData: {
            required: true,
            type: Array,
            default: []
        },
        tableShowData: {
            required: true,
            type: Array,
            default: () => {
                return [];
            }
        },
        // 黑名单
        userBlackList: {
            required: true,
            type: Boolean,
            default: false
        }
    },
    components: {
        editDiv
    },

    data() {
        return {
            dialogueLabelAllData: [], //所有标签数据
            sumDataNum: [], // 标签等级个数
            visible: false, //是否显示顾客标签
            visibleLabel: false, //是否显示对话标签
            cusData: [], //所有对话标签
            tableData: [], //所有顾客标签
            // tableShowData:[], //添加的顾客标签数据
            // dialogueLabelData:[], //对话标签数据
            colorLable: [
                "#ffb652",
                "#b59177",
                "#6fd048",
                "#9264cd",
                "#fc7cb3",
                "#ff8947",
                "#00ce7d",
                "#4ca0ff",
                "#ff5c5e",
                "#707070"
            ], //标签颜色
            activeName: "first", //默认展示
            socket: null
        };
    },
    mounted() {},
    methods: {
        /**
         * 删除标签
         */
        delCus(k, id) {
            let that = this;
            let newStr = this.visitorInformationData[k].split(",");
            newStr.map((v, i) => {
                if (v == id) {
                    newStr.splice(i, 1);
                }
            });
            /**
             * 转字符串
             */
            let str = "";
            newStr.map((v, i) => {
                if (i == newStr.length - 1) {
                    str += v;
                } else {
                    str += v + ",";
                }
            });
            this.visitorInformationData[k] = str;
            this.$axios
                .post(
                    this.$httpServer.saveOrUpdateClientInfo,
                    this.visitorInformationData
                )
                .then(res => {
                    //  that.$emit("loadingVisitorInformation",'')
                    this.$parent.loadingVisitorInformation(); //加载访客数据
                    this.$message1({
                        message: "修改成功",
                        type: "success"
                    });
                });
        },
        /**
         * 提交新增标签
         */
        submitCus(k, obj) {
            let that = this;
            let newStr = this.visitorInformationData[k];
            if (newStr != "" && newStr != null) {
                newStr = newStr + "," + obj.id;
            } else {
                newStr = obj.id.toString();
            }
            this.visitorInformationData[k] = newStr;
            this.$axios
                .post(
                    this.$httpServer.saveOrUpdateClientInfo,
                    this.visitorInformationData
                )
                .then(res => {
                    //  that.$emit("loadingVisitorInformation",'')
                    //  this.$parent.loadingVisitorInformation(); //加载访客数据
                    that.$parent.loadingVisitorInformation(); //重新加载数据
                    this.$message1({
                        message: "修改成功",
                        type: "success"
                    });
                });
        },
        loadingVisitorInformation() {
            this.$parent.loadingVisitorInformation();
        },
        /**
         * 查询当前ID子集
         */
        choseLab(id, oldData, index) {
            let that = this;
            that.cusData = [];
            let opt = {
                dialogueTag: "", // 对话标签ID
                trackId: "" //会话ID
            };
            let newData = [];
            // 加载当前标签的子集
            that.dialogueLabelAllData.map((v, i) => {
                if (v.labelExp == index && id == v.parentId) {
                    newData.push(v);
                }
            });
            /**
             * 两种情况：
             * 1、当前标签没有子集，选择自身
             * 2、当前标签有子集
             */
            if (newData.length == 0) {
                that.$parent.$data.dialogueLabelData.push({
                    id: oldData.id,
                    lable: oldData.lable,
                    color: oldData.color,
                    colorIndex: oldData.colorIndex,
                    parentId: oldData.parentId
                });
                that.visible = false; //关闭弹框
                that.submitCus("customerTag", {
                    color: oldData.color,
                    lable: oldData.lable,
                    id: oldData.id,
                    colorIndex: parseInt(oldData.colorIndex),
                    parentId: oldData.parentId
                });
                return;
            } else {
                // 删除自身
                // 当前已存在标签
                for (let i = 0; i < newData.length; i++) {
                    let sum = 0;
                    // 已选择标签
                    for (
                        let j = 0;
                        j < that.$parent.$data.dialogueLabelData.length;
                        j++
                    ) {
                        //排除第一级，下方在处理
                        if (
                            that.$parent.$data.dialogueLabelData[j].parentId !=
                                0 &&
                            that.$parent.$data.dialogueLabelData[j].labelExp ==
                                2
                        ) {
                            if (
                                newData[i].id ==
                                that.$parent.$data.dialogueLabelData[j].id
                            ) {
                                sum += 1;
                            }
                        }
                    }
                    if (sum > 0 && sum == newData.length) {
                        return;
                    }
                }
                that.dataFilter(newData, that.$parent.$data.dialogueLabelData);
            }
            if (that.cusData.length == 0) {
                index = index - 1;
            }
            // that.visible = false; //关闭弹框
            if (index == 2) {
                that.activeName = "second"; //默认展示
            } else {
                that.activeName = "third"; //默认展示
            }
            return;
        },
        /**
         * 选择顾客标签
         */
        selectingCustomerLabels(id, oldData, index) {
            let that = this;
            let newData = {
                // index:i,
                name: oldData.name, //标签名
                id: oldData.id, // 标签ID
                num: oldData.num, // 标签使用次数
                bgColor: oldData.bgColor, //标签颜色
                bgColorIndex: oldData.bgColorIndex // 标签颜色下标
            };
            that.visibleLabel = false;
            that.$parent.$data.tableShowData.push(newData);
            that.submitCus("dialogueTag", newData);
        },
        /**
         * 查询所以顾客标签
         */
        getLabele() {
            let that = this;
            this.$axios.get(this.$httpServer.getLabele).then(res => {
                that.tableData = [];
                that.dataCustomerFilter(
                    res.data.data,
                    that.$parent.$data.tableShowData
                );
            });
        },
        /**
         * 加载标签数据
         */
        loadData() {
            let that = this;
            that.activeName = "first"; //默认展示
            that.dialogueLabelAllData = [];
            this.$axios.get(this.$httpServer.getTab).then(res => {
                that.dialogueLabelAllData = res.data.data;
                let newData = [];
                that.sumDataNum = [];
                let sumData = [0, 0, 0];

                // 加载一级数据
                res.data.data.map((v, i) => {
                    if (v.labelExp == 1) {
                        newData.push(v);
                        sumData[0] += 1;
                    }
                    if (v.labelExp == 2) {
                        sumData[1] += 1;
                    }
                    if (v.labelExp == 3) {
                        sumData[2] += 1;
                    }
                });
                that.sumDataNum = sumData;
                // 当前已存在标签
                // for(let i = 0; i<newData.length;i++){
                //   let sum = 0;
                //   // 已选择标签
                //   for(let j = 0; j<that.dialogueLabelData.length;j++){
                //     //排除第一级，下方在处理
                //     if(that.dialogueLabelData[j].parentId != 0 && that.dialogueLabelData[j].labelExp == 2){
                //       if(newData[i].id == that.dialogueLabelData[j].id){
                //         sum +=1
                //       }
                //     }
                //   }
                //   if(sum>0 && sum == newData.length){
                //     return;
                //   }
                // }
                //数据过滤
                that.dataFilter(
                    newData,
                    that.$parent.$data.dialogueLabelData,
                    "1"
                );
            });
        },
        choseCustomer() {},
        /**
         * 数据过滤
         * 新数据、顾客标签数据
         */
        dataCustomerFilter(newData, dataLab) {
            let that = this;
            for (let i = 0; i < newData.length; i++) {
                let pushTrue = true;
                let data = {
                    id: newData[i].id,
                    name: newData[i].labelName,
                    bgColor: that.colorLable[parseInt(newData[i].labelStype)],
                    bgColorIndex: parseInt(newData[i].labelStype)
                };
                for (let j = 0; j < dataLab.length; j++) {
                    if (dataLab[j].id == newData[i].id) {
                        pushTrue = false;
                        break;
                    }
                }
                if (pushTrue) {
                    that.tableData.push(data);
                }
            }
        },
        /**
         * 数据过滤
         * 新数据、对话标签数据
         * newData：当前标签的所有数据，dataLab：已选数据
         */
        dataFilter(newData, dataLab, lv) {
            let that = this;
            that.cusData = []; // 数据清空
            // 是否删除父标签
            // 判断当前父标签的子集与选中的标签对比
            /**
             * 删除子集
             */

            for (let i = 0; i < newData.length; i++) {
                let pushTrue = true;
                let data = {
                    id: newData[i].id,
                    lable: newData[i].labelName,
                    color:
                        that.colorLable[parseInt(newData[i].dialogueLabelType)],
                    colorIndex: parseInt(newData[i].dialogueLabelType),
                    parentId: newData[i].parentId
                };

                for (let j = 0; j < dataLab.length; j++) {
                    if (dataLab[j].id == newData[i].id) {
                        pushTrue = false;
                        break;
                    }
                }
                if (pushTrue) {
                    that.cusData.push(data);
                }
            }
        },
        addLable() {
            this.tableData = [];
            this.visibleLabel = false;
            this.getLabele();
        },
        /**
         * 添加对话标签
         */
        addSublabe() {
            this.loadData();
        },
        /**
         * 加载数据
         */
        handleClick(tab, event) {},
        /**
         * 删除对话标签
         */
        delConversationsTab(k, id) {
            let that = this;
            // that.$parent.$data.dialogueLabelData.map((v,i)=>{
            //   if(v.id == id){
            //     that.$parent.$data.dialogueLabelData.splice(i,1);
            //   }

            // })
            that.delCus(k, id);
        },
        /**
         * 删除顾客标签
         */
        delLab(k, id) {
            let that = this;
            // that.$parent.$data.tableShowData.map((v,i)=>{
            //   if(v.id == id){
            //     that.$parent.$data.tableShowData.splice(i,1);
            //   }
            // })
            that.delCus(k, id);
        },
        // 修改访客信息
        updVisitor(k, value) {}
    }
};
</script>
<style scoped>
.imCustomerlabel {
    width: 236px;
    padding: 0 15px;
    height: 100%;
    float: right;
    min-width: 236px;
}
.imCustomerlabel > .title {
    font-size: 13px;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
    color: #343f4b;
    height: 36px;
    line-height: 36px;
    padding: 0 6px;
}

.imCustomerlabel > .title .title-right {
    text-align: right;
    color: #009de7;
}

.imCustomerlabel > .child {
    padding-left: 16px;
    color: #161e26;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    margin-bottom: 6px;
}
.imCustomerlabel > .child.tab {
    color: #969faa;
    font-size: 12px;
}
.imCustomerlabel > .child .title-left {
    color: #767d85;
    width: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.imCustomerlabel > .child .title-right {
    line-height: 24px;
    min-height: 24px;
    min-width: 150px;
    cursor: pointer;
    transition: background 0.3s;
    width: 180px;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.imCustomerlabel > .child .title-right:hover {
    background: #fdf7d7;
}
.el-popover__reference {
    cursor: pointer;
}
.tag-item {
    float: left;
    max-width: 180px;
    margin: 0;
    padding: 6px 14px;
    cursor: pointer;
    line-height: normal;
    position: relative;
    /* display: inline-block; */
    font-size: 12px;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    text-overflow: ellipsis;
    word-break: keep-all;
    margin-right: 10px;
    margin-bottom: 10px;
    /* overflow: hidden; */
}
.tag-tag {
    max-width: 120px;
    position: relative;
    display: inline-block;
    padding: 4px 7px;
    margin-right: 5px;
    margin-bottom: 5px;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
    float: left;
}
.pull-top {
    margin-top: 130px;
    height: 200px;
}
.tag-del {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    background: #2d2d2d;
    line-height: 20px;
    cursor: pointer;
    border-radius: 3px;
}
.tag-tag:hover .tag-del {
    display: block;
}
.agent-single-selector-shadowPanel {
    padding: 3px 0;
    min-width: 160px;
    min-height: 120px;
    text-align: left;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
    box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
    padding: 10px 0 15px 15px;
}
</style>


