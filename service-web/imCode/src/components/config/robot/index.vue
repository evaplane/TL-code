<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-10-10 21:36:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-10 21:36:18
 -->
<template>
    <div
        class="robot"
        id="common-wrapper"
    >
        <section>
            <div class="title">
                <h1>机器人开关</h1>
                <el-switch
                    v-model="robotSwitch"
                    @change="setRobotSwitch"
                ></el-switch>
                <p>是否开启机器人接触客户的功能</p>
                <!-- <div class="msg">
          剩余消息数
          <span>{{msgNum}}</span>条
        </div>-->
                <div class="hr"></div>
                <div class="box">
                    <div class="imgBox">
                        <div
                            class="img float-left"
                            :style="{backgroundImage: 'url(' + (userInfo.headPhoto ? userInfo.headPhoto : baseImg) + ')'}"
                        ></div>
                        <div class="text">
                            <h6>{{robotName}}</h6>
                            <!-- <p>{{signature}}</p> -->
                        </div>
                    </div>
                    <div class="editBox">
                        <a
                            class="float-right el-icon-edit-outline"
                            href="javascript:;"
                            @click="editSignature"
                        >&nbsp;修改机器人名片</a>
                    </div>
                </div>
            </div>
        </section>
        <section v-if="robotSwitch">
            <div class="title">
                <h1>机器人欢迎语和常见问题</h1>
                <p>每段对话开启时，系统自动向顾客发送一段欢迎语和常见问题列表</p>
            </div>
            <div class="darkBg">
                <a
                    class="float-right el-icon-edit-outline"
                    href="javascript:;"
                    @click="edit"
                >&nbsp;修改欢迎语</a>
                <div class="helloTextBox">
                    <div v-html="text"></div>
                </div>
            </div>
            <div>
                <h1>
                    常见问题
                    <span class="gray">(最多可添加10个问题)</span>
                    <a
                        class="float-right el-icon-plus"
                        href="javascript:;"
                        @click="addQs"
                    >&nbsp;添加问题</a>
                </h1>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    v-if="tableData.length > 0"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="70"
                    ></el-table-column>
                    <el-table-column
                        prop="questionTitle"
                        label="问题"
                        width="240"
                    >
                        <template slot-scope="scope">
                            <span class="questionTitle">{{scope.row.questionTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="defaultAnswerRich"
                        label="回答"
                        width="240"
                    >
                        <template slot-scope="scope">
                            <div
                                class="defaultAnswerRich"
                                v-html="scope.row.defaultAnswerRich"
                            ></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="70"
                    >
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="deleteRow(scope.row.id)"
                                type="text"
                                size="small"
                            >移出</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <p
                    class="text-center gray"
                    v-else
                >
                    还未设置常见问题.
                    <a
                        href="javascript:;"
                        @click="addQs"
                    >&nbsp;点击添加</a>
                </p>
            </div>
        </section>

        <!-- 弹窗 修改机器人名片 -->
        <el-dialog
            title="机器人名片"
            :visible.sync="visible"
            width="600px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <div class="robotMsgBox">
                <div
                    class="img float-left"
                    :style="{backgroundImage: 'url(' + (coverImgUrl ? coverImgUrl : baseImg) + ')'}"
                ></div>
                <div class="btn">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/gif, image/jpeg, image/jpg, image/png, image/gif"
                        :action="action"
                        :headers="headers"
                        :show-file-list="false"
                        :before-upload="progress"
                        :on-success="handleAvatarSuccess"
                    >
                        <a
                            class="float-right el-icon-upload"
                            href="javascript:;"
                        >&nbsp;上传新头像</a>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过500kb</div> -->
                    </el-upload>
                </div>
            </div>
            <el-form
                :model="robotForm"
                :rules="rules"
                ref="robotForm"
                v-if="visible"
            >
                <el-form-item prop="name">
                    <h3>名字</h3>
                    <el-input
                        v-model="robotForm.name"
                        placeholder="请输入名字"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item prop="signature" class="marginTop">
          <h3>签名</h3>
          <el-input v-model="robotForm.signature" placeholder="请输入签名"></el-input>
        </el-form-item>-->
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="visible = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="submitRobot"
                >保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹窗 修改欢迎语 -->
        <el-dialog
            title="修改欢迎语"
            :visible.sync="dialogVisible"
            width="600px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <el-form
                :model="form"
                ref="form"
                v-if="dialogVisible"
                class="editWelcomeDialog"
            >
                <el-form-item prop="content">
                    <quill-editor
                        @inputContent='inputContent'
                        :contentP="form.content"
                    ></quill-editor>
                    <div
                        class="editor-content"
                        v-html="form.content"
                        hidden
                    ></div>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="update"
                >保存</el-button>
            </span>
        </el-dialog>

        <!-- 弹窗 添加常见问题 -->
        <el-dialog
            :class="{hasFooter:classify.length==0}"
            title="添加常见问题"
            :visible.sync="dialogVisible_qs"
            width="800px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <div class="box">
                <div
                    v-show="classify.length>0"
                    class="rightBox float-left"
                >
                    <h3>分类</h3>
                    <ul class="list float-left">
                        <li
                            v-for="(obj,index) in classify"
                            :key="obj.id"
                        >
                            <p
                                @click="changeClassify(index,obj.id)"
                                :class="{active:inx==index}"
                            >
                                <span
                                    class="float-left"
                                    :title="obj.categoryTitle"
                                >{{obj.categoryTitle}}</span>
                                <span class="float-right">{{'('+obj.total+')'}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div
                    v-show="classify.length>0"
                    class="leftBox float-left"
                >
                    <div class="inputBox">
                        <el-input
                            class="paddingLeft"
                            placeholder="搜索问题"
                            prefix-icon="el-icon-search"
                            v-model="questionTitle"
                            @keyup.native="getQuestionById"
                        ></el-input>
                    </div>
                    <div class="checkbox">
                        <h1>勾选常见问题</h1>
                        <el-checkbox-group
                            v-model="hasCheck"
                            :max="10"
                        >
                            <el-checkbox
                                v-for="obj in questionList"
                                :key="obj.id"
                                :label="obj.id"
                            >{{obj.questionTitle}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <el-pagination
                        class="pagerClass text-center"
                        background
                        @current-change="handleCurrentChange"
                        :hide-on-single-page="hidePage"
                        :current-page.sync="currentPage"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total"
                    ></el-pagination>
                </div>
                <div
                    v-show="classify.length>0"
                    class="clearFix"
                ></div>
                <p
                    class="toAddQs text-center"
                    v-show="classify.length==0"
                >
                    暂无可选问题。
                    <router-link to="/config/repository">去添加问题</router-link>
                </p>
            </div>
            <span
                v-show="classify.length>0"
                slot="footer"
                class="dialog-footer"
            >
                <span class="hasChecked float-left">{{hasCheck.length}} 已选</span>
                <el-button @click="dialogVisible_qs = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="submit"
                >保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import quillEditor from "../../../components/common/quillEditor";
import { getClassify, getQuestion } from "@/common/api";
export default {
    components: {
        quillEditor
    },
    data() {
        var validateName = (rule, value, callback) => {
            value = value.trim();
            if (!value) {
                callback(new Error("请输入名字"));
            } else if (value.length > 30) {
                callback(new Error("名字不得超过 30 个字符!"));
            } else {
                callback();
            }
        };
        return {
            action: this.$httpServer.im_fdfsupload,
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            },
            toolbar: [
                "bold italic underline strikethrough numlist bullist alignleft aligncenter alignright"
            ],
            hasImg: false,
            userInfo: "",
            robotSwitch: false,
            msgNum: 0,
            robotName: "",
            //   signature: "",
            visible: false,
            header: "",
            robotForm: {
                name: ""
                //   signature: ""
            },
            rules: {
                name: [
                    {
                        required: true,
                        validator: validateName,
                        trigger: ["blur", "change"]
                    }
                ]
                //   signature: [
                //     { required: true, message: '请输入签名', trigger: ["blur", "change"] },
                //     { max: 100, message: '签名不得超过 100 个字符!', trigger: ["blur", "change"] }
                //   ]
            },
            baseImg: "../../../../static/icon/robotSetup.png",
            coverImgUrl: "",
            text: "",
            form: {
                content: ""
            },
            familiarQuestion: "",
            tableData: [],
            hasCheck: [],
            dialogVisible: false,
            dialogVisible_qs: false,
            classify: [],
            inx: 0,
            categoryId: 1,
            questionTitle: "",
            currentPage: 1,
            pageSize: 9999,
            hidePage: true,
            total: 0,
            questionList: []
        };
    },
    methods: {
        setRobotSwitch() {
            this.$axios
                .put("/set/robotServiceConfig/robot", {
                    status: this.robotSwitch
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message1({
                            message: "修改成功",
                            type: "success"
                        });
                        this.getWelcomeText();
                    } else {
                        this.robotSwitch = !this.robotSwitch;
                        this.$message1({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                });
        },
        editSignature() {
            this.visible = true;
            this.coverImgUrl = this.userInfo.headPhoto;
            this.robotForm.name = this.robotName;
            //   this.robotForm.signature = this.signature;
        },
        progress(file) {
            if (file.size >= 1048576) {
                // this.$refs.uploaded.abort(file);
                this.$message1({
                    type: "warning",
                    message: "上传的文件大小不能超过1Mb"
                });
                return false;
            } else {
                return true;
            }
        },
        handleAvatarSuccess(response, file, fileList) {
            this.coverImgUrl = response.data;
        },
        submitRobot() {
            this.$refs["robotForm"].validate(valid => {
                if (valid) {
                    this.$axios
                        .put("/set/robotServiceConfig/robot", {
                            name: this.robotForm.name.trim(),
                            headPhoto: this.coverImgUrl
                        })
                        .then(res => {
                            if (res.data.code === 0) {
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                                this.visible = false;
                                this.getWelcomeText();
                            } else {
                                this.$message1({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        });
                }
            });
        },
        getWelcomeText() {
            this.hasCheck = [];
            this.$axios.get("/set/robotServiceConfig/robot").then(res => {
                if (res.data.code === 0) {
                    this.userInfo = res.data.data;
                    this.text = res.data.data.welcomeText;
                    this.familiarQuestion = res.data.data.familiarQuestion;
                    this.robotSwitch = res.data.data.status;
                    this.robotName = res.data.data.name;
                    //   this.signature = res.data.data.sign;
                    console.log(this.familiarQuestion);
                    this.getQuestions();
                }
            });
        },
        edit() {
            this.dialogVisible = true;
            this.form.content = this.text;
        },
        update() {
            let text = this.form.content.replace(/<(?!img)[^>]+>/g, ""); // 去掉除img标签外的所有html标签
            let isTooLang = this.form.content.replace(/<[^>]+>/g, ""); // 去掉除img标签外的所有html标签
            let str = text.replace(/&nbsp;/g, ""); //  去掉 nbsp;
            let newStr = str.trim(); //  去掉空格;
            if (!newStr) {
                this.$message1({
                    message: "请输入欢迎语",
                    type: "error"
                });
                return false;
            }
            if (isTooLang.replace(/&nbsp;/g, "").trim().length > 100) {
                this.$message1({
                    message: "欢迎语不得超过 100 个字符!",
                    type: "error"
                });
                return false;
            }

            this.$axios
                .put("/set/robotServiceConfig/robot", {
                    welcomeText: this.form.content
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.$message1({
                            message: "修改成功",
                            type: "success"
                        });
                        this.dialogVisible = false;
                        this.getWelcomeText();
                    } else {
                        this.$message1({
                            message: "欢迎语大小超出限制",
                            type: "error"
                        });
                    }
                })
                .catch(res => {
                    this.$message1({
                        message: "欢迎语大小超出限制",
                        type: "error"
                    });
                });
        },
        addQs() {
            this.dialogVisible_qs = true;
            this.categoryId = 1;
            this.questionTitle = "";
            this.currentPage = 1;
            this.hasCheck = [];
            this.getAllClassify();
            this.getQuestionById();
            this.getQuestions();
        },
        getQuestions() {
            if (!this.familiarQuestion) {
                this.tableData = [];
                return;
            }
            let params = {
                ids: this.familiarQuestion
            };
            this.$axios
                .get("/set/questionConfig/list", { params })
                .then(res => {
                    if (res.data.data) {
                        this.tableData = res.data.data;
                        let arr = this.familiarQuestion.split(",");
                        arr.forEach(obj => {
                            return arr.push(Number(obj));
                        });
                        let newArr = [];
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (arr.indexOf(res.data.data[i].id) > -1) {
                                newArr.push(res.data.data[i].id);
                            }
                        }
                        this.familiarQuestion = newArr.toString();
                        console.log(this.familiarQuestion);
                        if (this.familiarQuestion) {
                            let arr = this.familiarQuestion.split(",");
                            arr.forEach(obj => {
                                return this.hasCheck.push(Number(obj));
                            });
                        }
                    }
                });
        },
        getAllClassify() {
            let params = {
                statisticsDisable: false
            };
            getClassify(params).then(res => {
                let data = res.data.data;
                if (data) {
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].total > 0) {
                            arr.push(data[i]);
                        }
                    }
                    this.classify = arr;
                }
            });
        },
        changeClassify(index, id) {
            this.inx = index;
            this.categoryId = id;
            this.getQuestionById();
        },
        getQuestionById() {
            let data = {
                categoryId: this.categoryId,
                questionTitle: this.questionTitle,
                pageNo: this.currentPage,
                pageSize: this.pageSize,
                status: true
            };
            getQuestion(data).then(res => {
                this.questionList = res.data.data.content;
                this.total = res.data.data.totalElements;
            });
        },
        handleCurrentChange() {
            this.getQuestionById();
        },
        submit() {
            let data = {
                familiarQuestion: this.hasCheck.toString()
            };
            this.$axios.put("/set/robotServiceConfig/robot", data).then(res => {
                if (res.data.code === 0) {
                    this.$message1({
                        message: "添加成功",
                        type: "success"
                    });
                    this.dialogVisible_qs = false;
                    this.getWelcomeText();
                } else {
                    this.$message1({
                        message: res.data.msg,
                        type: "error"
                    });
                }
            });
        },
        deleteRow(id) {
            this.$confirm("确定要删除该问题吗？", "温馨提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$axios
                    .delete(`/set/robotServiceConfig/familiarQuestion/${id}`)
                    .then(res => {
                        if (res.data.code === 0) {
                            this.$message1({
                                message: "删除成功",
                                type: "success"
                            });
                            this.getWelcomeText();
                        } else {
                            this.$message1({
                                message: res.data.msg,
                                type: "error"
                            });
                        }
                    });
            });
        },
        inputContent(value) {
            this.form.content = value;
            console.log(value);
        }
    },
    created() {
        this.getWelcomeText();
        // console.log("http://" + $API_CONFIG.server_api + "/im/file/upload");
    }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/base.less";
.robot {
    width: 680px;
    font-size: 13px;
    line-height: 28px;
    position: relative;
    section {
        background: #fff;
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
        > div {
            padding: 20px 30px;
            &:nth-child(even) {
                border: 1px solid #f5f5f5;
            }
            &.title {
                position: relative;
                font-size: 14px;
                p {
                    color: #969faa;
                }
                > div,
                h1 {
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 14px;
                }
                .msg {
                    font-size: 13px;
                    position: absolute;
                    top: 33px;
                    right: 30px;
                    color: #969faa;
                    line-height: 22px;
                    span {
                        font-size: 16px;
                        color: #009de7;
                        margin: 0 3px;
                    }
                }
                .hr {
                    height: 1px;
                    width: 100%;
                    box-sizing: content-box;
                    margin: 20px 0 20px -30px;
                    padding: 0 30px;
                    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
                }
                .box {
                    display: flex;
                    position: relative;
                    .imgBox {
                        flex: 1;
                        .img {
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            background-position: 50%;
                            background-size: cover;
                            background-repeat: no-repeat;
                            margin-right: 20px;
                        }
                        h6 {
                            font-size: 14px;
                            color: #323c42;
                            font-weight: 400;
                            margin-bottom: 6px;
                        }
                        p {
                            font-size: 12px;
                            line-height: 18px;
                        }
                    }
                    .editBox {
                        font-size: 13px;
                    }
                }
            }
            &.darkBg {
                background-color: #fbfbfc;
            }
            .helloTextBox {
                display: inline-block;
                border: 1px solid #eff0f2;
                padding: 8px 10px;
                background: #fff;
                color: #5a6978;
                margin: 0;
                position: relative;
                white-space: pre-wrap;
                word-break: break-all;
                max-width: 70%;
                &:before {
                    content: "";
                    width: 0;
                    height: 0;
                    border: 5px solid transparent;
                    border-right-color: #fff;
                    position: absolute;
                    left: -10px;
                    top: 13px;
                    z-index: 2;
                }
                &:after {
                    border-right-color: #eff0f2;
                    left: -11px;
                    z-index: 1;
                }
                div {
                    max-width: 420px;
                    padding: 16px 20px;
                }
            }
            .gray {
                color: #adb2bb;
            }
            .text-center {
                padding: 2rem 0;
            }
            .questionTitle,
            .defaultAnswerRich {
                display: inline-block;
                max-width: 210px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
    .robotMsgBox {
        display: flex;
        margin: 20px 0;
        align-items: center;
        .img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            margin-right: 20px;
        }
    }
    .marginTop {
        margin-top: 20px;
    }
    .box {
        width: 100%;
        height: auto;
        .rightBox {
            font-size: 13px;
            width: 170px;
            margin-right: 20px;
            border-right: 1px solid #f4f5f7;
            h3 {
                color: #343f4b;
                font-size: 14px;
                font-weight: 400;
                margin: 0 0 13px 13px;
            }
            .list {
                width: 100%;
                overflow: hidden;
                box-sizing: border-box;
                padding-right: 20px;
                li {
                    color: #767d85;
                    border-radius: 3px;
                    margin-bottom: 1px;
                    p {
                        padding: 9px 13px;
                        display: inline-block;
                        width: 100%;
                        cursor: pointer;
                        &:hover,
                        &.active {
                            background: #f4f5f7;
                        }
                        .float-left {
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 95px;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
        .leftBox {
            width: calc(~"100% - 191px");
            .inputBox {
                width: 100%;
            }
            .checkbox {
                width: 100%;
                margin: 20px 0;
                .el-checkbox-group {
                    height: 300px;
                    overflow: auto;
                }
                .el-checkbox {
                    width: 100%;
                    padding: 5px 0;
                }
            }
        }
        .clearFix {
            clear: both;
        }
    }
    .dialog-footer {
        display: inline-block;
        width: 100%;
    }
    .editWelcomeDialog {
        margin: 20px;
    }
    .hasFooter {
        .toAddQs {
            line-height: 40px;
            padding: 50px 0;
        }
    }
}
</style>
