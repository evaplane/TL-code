<template>
    <!-- 快捷回复 -->
    <div class="fastReply">
        <!-- header -->
        <div class="header layout">
            <!-- 菜单栏 -->
            <div class="title">
                <div>快捷回复列表管理</div>
                <div>
                    <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
                        {{classic[command]}}
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="(temp, i) in classic"
                                :key="i"
                                :command="i"
                            >{{temp}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div>
                    <el-upload
                        ref="upload"
                        class="upload-demo"
                        :action="'/set/fastReplyConfig/parserFastReplyExcel?fastReplyType='+command"
                        :headers="header"
                        :show-file-list="false"
                        :auto-upload="true"
                        :on-success="pret"
                        :before-upload="progress"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    >
                        <span class="el-icon-download"></span>
                        <span>导入数据</span>
                    </el-upload>
                </div>
                <div @click="exportFastReply(command)">
                    <span class="el-icon-upload2"></span>
                    <span>导出数据</span>
                </div>
                <div @click="emptyData(command)">
                    <span class="el-icon-delete-solid"></span>
                    <span>清空数据</span>
                </div>
                <div>
                    <a href="static/template/kefuyun-template.xls" download="kefuyun-template.xls">
                        <span class="el-icon-tickets"></span>下载模板
                    </a>
                </div>
            </div>
            <p>预先设置一些常见问题的回复用语，帮助客服人员提高服务效率</p>
            <div class="groupAttenconfig">
                <el-button type="primary" icon="el-icon-folder-add" @click="handleGroup(1)">添加分组</el-button>
                <span style="cursor:pointer;" @click="attentionDia = true">快捷回复引用规则</span>
            </div>
        </div>
        <!-- 快捷回复展示 -->
        <div class="main layout" v-loading="loading">
            <p v-if="!fastReplyGroupConfigs.length">暂无分组快捷回复信息</p>
            <el-collapse :accordion="false" v-else>
				<vuedraggable class="wrapper" v-model="fastReplyGroupConfigs" @start="groupStart(fastReplyGroupConfigs)" @end="groupEnd">
					<el-collapse-item v-for="(temp,i) in fastReplyGroupConfigs" :key="i">
						<!-- 分组 -->
						<template slot="title">
							<el-row :gutter="20" class="header-icon">
								<el-col :span="1">
									<i class="el-icon-rank"></i>
								</el-col>
								<el-col :span="15">
									<div class="grid-content bg-purple" :title="temp.groupName">
										<i class="el-icon-folder"></i>
										<span>{{temp.groupName}}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="menu-bar">
										<i
											class="el-icon-document-add"
											@click.stop="replySet(1, i)"
										>添加回复</i>
										<i class="el-icon-edit" @click.stop="handleGroup(0, i)">重命名</i>
										<i class="el-icon-delete" @click.stop="delItem(i)">删除</i>
									</div>
								</el-col>
							</el-row>
						</template>
						<!-- 分组下的回复 -->
						<div class="replyItem">
							<p v-if="!temp.fastReplyConfigs.length">
								当前暂无快捷回复，可以选择
								<span
									@click="delItem(i)"
									style="color:red;cursor:pointer;"
								>删除分组</span>
							</p>
							<div v-else>
								<vuedraggable class="wrapper" v-model="fastReplyGroupConfigs[i].fastReplyConfigs" @start="start(fastReplyGroupConfigs[i].fastReplyConfigs)" @end="end">
									<el-row
										:gutter="20"
										v-for="(tmp, index) in fastReplyGroupConfigs[i].fastReplyConfigs"
										:key="index"
									>
											<el-col :span="1">
												<i class="el-icon-rank"></i>
											</el-col>
											<el-col :span="4">
												<div class="subTitle">{{tmp.fastReplyTitle}}</div>
											</el-col>
											<el-col :span="13">
												<p>{{tmp.fastReplyContent}}</p>
											</el-col>
											<!-- <el-col :span="4">
												<Keys :data="tmp.hotKey"></Keys>
											</el-col>-->
											<el-col :span="6" class="menu-bar">
												<i class="el-icon-edit" @click="replySet(0, index, tmp)">修改</i>
												<i class="el-icon-delete" @click="replyDel(tmp)">删除</i>
											</el-col>
									</el-row>
								</vuedraggable>
							</div>
						</div>
					</el-collapse-item>
				</vuedraggable>
            </el-collapse>
        </div>
        <!-- 增、改分组弹窗 -->
        <el-dialog
            :title="handleGroupType === 1 ? '添加分组' : '重命名分组'"
            :visible.sync="createItem"
            width="400px"
            :modal-append-to-body="false"
            @keyup.enter.native="saveGroup(handleGroupType, handleGroupIndex)"
        >
            <el-input
                v-model.trim="groupName"
                placeholder="请输入分组名称"
                size="small"
                maxlength="30"
                show-word-limit
            ></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createItem = false">取 消</el-button>
                <el-button type="primary" @click="saveGroup(handleGroupType, handleGroupIndex)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 引用规则弹窗 -->
        <el-dialog
            title="快捷回复引用规则"
            :visible.sync="attentionDia"
            width="700px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <div>
                <el-radio-group v-model="ruleInfo.refRuleType" @change="radioChange">
                    <el-radio label="1" class="attention">叠加引用，引用新快捷回复时词条内容会累加至输入框，支持在单条消息中引用多条快捷回复。</el-radio>
                    <el-radio label="2" class="attention">覆盖引用，引用新快捷回复时词条内容会覆盖输入框中已有内容。</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="attentionDia = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 增、改快捷回复弹窗 -->
        <el-dialog
            title="编辑快捷回复"
            :visible.sync="replySetDia"
            width="700px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @keyup.enter.native="replySave(handleReplyType)"
        >
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-if="replySetDia">
                <el-form-item label="标题" prop="fastReplyTitle">
                    <el-input
                        v-model.trim="form.fastReplyTitle"
                        placeholder="请输入标题"
                        size="small"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="回复内容" prop="fastReplyContent">
                    <el-input
                        type="textarea"
                        v-model.trim="form.fastReplyContent"
                        :autosize="{ minRows: 8}"
                        maxlength="150"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item label="快捷键">
                    <KeyInt :keyCombination="form.hotKey || ''" @keyDown="keyDown"></KeyInt>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="replySetDia = false">取 消</el-button>
                <el-button type="primary" @click="replySave(handleReplyType)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import KeyInt from "@/components/common/keyInt/keyInt";
import vuedraggable from 'vuedraggable';
import Keys from "./kyes";
import {
    getFastReplyList,
    updateReplyRule,
    saveFastReplyGroup,
    updateReplyGroupById,
    deleteReplyGroupById,
    saveReply,
    updateReply,
    deleteReplyById,
    emptyData,
	exportFastReply,
	editReplyGroupById,
	editReply
} from "@/common/api";

export default {
    components: {
		KeyInt,
		vuedraggable,
        Keys
    },
    data() {
        return {
            header: "", // 导入时传入的header
            classic: ["", "组内回复", "个人回复"], // 后台传参1，2，为了少些代码所以添加一个空对象在0下标
            command: 1, // 下拉菜单默认展示
            fastReplyGroupConfigs: [], // 快捷回复数据
            ruleInfo: {
                // 回复规则数据
                refRuleType: "1"
            },
            handleGroupType: 1, // 操作分组的类型（1——创建；0——修改）
            handleGroupIndex: "", // 操作分组的组ID
            handleReplyType: 1, // 操作回复的类型（1——创建；0——修改）
            handleReplayIndex: "", // 操作回复的ID
            loading: false, // 控制快捷回复展示界面在数据回复之前呈加载状态
            groupName: "", // 增、改组名的表单
            createItem: false, // 增改分组弹窗的开关
            attentionDia: false, // 引用规则弹窗的开关
            replySetDia: false, // 增改回复弹窗的开关
            form: {}, // 增改回复弹窗内的表单
            rules: {
                // 表单的验证规则
                fastReplyTitle: {
                    required: true,
                    message: "请输入分组名称",
                    trigger: ["blur"]
                },
                fastReplyContent: {
                    required: true,
                    message: "请输入回复内容",
                    trigger: ["blur"]
                }
			},
			dragList: []
        };
    },
    methods: {
        /**
         * 上传成功后的回调函数
         */
        pret(res) {
            if (res.code == 1) {
                this.$message1({
                    message: res.msg,
                    type: "error"
                });
            } else {
                this.getFastReplyList(this.command);
            }
        },
        /**
         * 下拉菜单的回调函数
         */
        handleCommand(command) {
            this.command = command;
            this.getFastReplyList(command);
        },
        /**
         * 初始化数据
         */
        async getFastReplyList(type) {
            await getFastReplyList(type).then(res => {
                if (res.data.code == 0) {
					let data = res.data.data;
                    let { fastReplyGroupConfigs, ruleInfo } = data;
                    if (fastReplyGroupConfigs) {
                        this.fastReplyGroupConfigs = fastReplyGroupConfigs;
                    }
                    if (ruleInfo) {
                        this.ruleInfo = ruleInfo;
                        this.ruleInfo.refRuleType += "";
                    }
                }
            });
        },
        /**
         * 更改引用规则
         */
        radioChange() {
            this.ruleInfo.refRuleId = this.ruleInfo.refRuleType;
            updateReplyRule(this.ruleInfo).then(res => {
                if (res.data.code === 0) {
                    this.$message1({
                        message: "操作成功",
                        type: "success"
                    });
                }
            });
        },
        /**
         * 创建分组、重命名分组弹窗开启
         */
        handleGroup(type, index) {
            if (type) {
                this.groupName = "";
            } else {
                this.groupName = this.fastReplyGroupConfigs[index].groupName;
            }
            this.createItem = true;
            this.handleGroupType = type;
            this.handleGroupIndex = index;
        },
        /**
         * 保存分组
         */
        saveGroup(type, index) {
            let obj;
            if (!this.groupName) {
                this.$message1({
                    type: "warning",
                    message: "组名不能为空"
                });
            } else {
                if (type) {
                    // 创建分组
                    obj = {
                        fastReplyType: this.command,
                        groupName: this.groupName
                    };
                    saveFastReplyGroup(obj).then(res => {
                        if (res.data.code === 0) {
                            this.getFastReplyList(this.command);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                            this.createItem = false;
                        }
                    });
                } else {
                    // 重命名分组
                    obj = Object.assign({}, this.fastReplyGroupConfigs[index]);
                    obj.groupName = this.groupName;
                    updateReplyGroupById(obj).then(res => {
                        if (res.data.code === 0) {
                            this.getFastReplyList(this.command);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                            this.createItem = false;
                        }
                    });
                }
            }
        },
        /**
         * 删除分组
         */
        delItem(index) {
            this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let id = this.fastReplyGroupConfigs[index].id;
                    deleteReplyGroupById(id).then(res => {
                        if (res.data.code === 0) {
                            this.getFastReplyList(this.command);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message1({
                        type: "info",
                        message: "已取消该操作"
                    });
                });
        },
        /**
         * 快捷键组件的回调
         */
        keyDown(arr) {
            this.form.hotKey = arr;
        },
        /**
         * 新增、修改快捷回复
         */
        replySet(type, index, data) {
            this.handleReplayIndex = index;
            if (type) {
                // 添加回复
                this.form = Object.assign(
                    {},
                    {
                        fastReplyContent: "",
                        fastReplyTitle: "",
                        fastReplyType: this.command,
                        groupId: this.fastReplyGroupConfigs[index].id,
                        hotKey: ""
                    }
                );
            } else {
                this.form = Object.assign({}, data);
            }
            this.handleReplyType = type;
            this.replySetDia = true;
        },
        async replySave(type) {
            let flag = false;
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    if (type) {
                        await saveReply(this.form).then(res => {
                            if (res.data.code === 0) {
                                flag = true;
                            }
                        });
                        } else {
                            await updateReply(this.form).then(res => {
                                if (res.data.code === 0) {
                                    flag = true;
                                }
                            });
                        }
                        if (flag) {
                            this.getFastReplyList(this.command);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                            this.replySetDia = false;
                        }
                } else {
                    return false;
                }
            });
        },
        /**
         * 删除快捷回复
         */
        replyDel(data) {
            this.$confirm("此操作将永久删除该回复, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    deleteReplyById(data.id).then(res => {
                        if (res.data.code === 0) {
                            this.getFastReplyList(this.command);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message1({
                        type: "info",
                        message: "已取消该操作"
                    });
                });
        },
        /**
         * 清空该栏目下的所有数据
         */
        emptyData(type) {
            emptyData(type).then(res => {
                if (res.data.code === 0) {
                    this.getFastReplyList(this.command);
                    this.$message1({
                        message: "操作成功",
                        type: "success"
                    });
                }
            });
        },
        /**
         * 导出快捷回复（要传token）
         */
        exportFastReply(type) {
            exportFastReply(type).then(res => {
                let fileName = decodeURI(
                    res.headers["content-disposition"]
                        .split(";")[1]
                        .split("=")[1]
                );
                let blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel;charset=utf-8"
                });
                if ("download" in document.createElement("a")) {
                    // 非IE下载
                    let elink = document.createElement("a");
                    elink.download = fileName;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
            });
        },
        progress(file) {
            // console.log('上传',event, file, fileList)
            if (file.size >= 1048576) {
                this.$message1({
                    type: "warning",
                    message: "上传的文件大小不能超过1Mb"
                });
                return false
            } else {
                return true
            }
		},
		groupStart(obj){
			this.dragList = obj;
		},
		groupEnd(evt){
			let oldObj = this.dragList[evt.oldIndex];
			let index = evt.newIndex;
			if(index == evt.oldIndex){
				return;
			}
			let obj = {
				position: index
			}
			editReplyGroupById(oldObj.id,obj).then(res => {

			})
		},
		start(obj){
			this.dragList = obj;
		},
		end(evt){
			let oldObj = this.dragList[evt.oldIndex];
			let index = evt.newIndex;
			if(index == evt.oldIndex){
				return;
			}
			let obj = {
				position: index,
				title: oldObj.fastReplyTitle
			}
			editReply(oldObj.id,obj).then(res => {

			})
		}
    },
    created() {
        let obj = {
            Authorization: "Bearer " + sessionStorage.getItem("token")
        };
        this.header = obj;
        this.getFastReplyList(1);
    }
};
</script>

<style lang="less" scoped>
.fastReply {
    width: 710px;
    a,
    span {
        font-size: 14px;
    }
    > div.layout {
        width: 100%;
        background: #fff;
        padding: 20px 30px;
        margin-bottom: 30px;
        &.header {
            > .title {
                margin-bottom: 10px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                > div {
                    height: 40px;
                    vertical-align: middle;
                    line-height: 40px;
                    // display: inline-block;
                    // margin-right: 20px;
                    &:first-child {
                        font-size: 16px;
                        padding-right: 20px;
                        border-right: 1px solid #ddd;
                    }
                    span,
                    a {
                        cursor: pointer;
                        color: #409eff;
                    }
                }
                .subtn {
                    vertical-align: middle;
                }
            }
            > p {
                color: #969faa;
                margin-bottom: 10px;
            }
            > div.groupAttenconfig {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                > span {
                    color: #409eff;
                }
            }
        }
        &.main {
            font-size: 14px;
            min-height: 400px;
            > p {
                color: #969faa;
                width: 100%;
                text-align: center;
			}

        }
    }
}
.header-icon {
    width: 100%;
    i {
        color: #409eff;
        margin-right: 10px;
    }
    div.menu-bar {
        display: none;
    }
    &:hover .menu-bar {
        display: block;
    }
    .el-col {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.replyItem {
    color: #858e99;
	background: #fff;
    > div {
        line-height: 40px;
		padding-left: 40px;
		.wrapper{
			width: 100%;
		}
        .subTitle {
            width: 55px;
            vertical-align: middle;
            color: #5a6978;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .menu-bar {
            color: #409eff;
            display: none;
            i {
                cursor: pointer;
            }
        }
        .el-row:hover {
            background: rgba(0, 159, 233, 0.04);
        }
        .el-row:hover .menu-bar {
            display: block;
        }
    }
}
.title-icon {
    i {
        color: #409eff;
        margin-right: 10px;
    }
}
.attention {
    width: 500px;
    margin-bottom: 29px;
}
</style>
<style lang="less">
// 解决下拉按钮在ie内核浏览器下的不平整问题
.el-dropdown .el-button-group .el-button {
    vertical-align: middle;
}
</style>
