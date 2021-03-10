<template>
  <div class="autoMessage">
    <el-form :model="form" :rules="rules" ref="form">
      <section>
        <div class="title">
		  <el-row>
			  <el-col :span="18">
				<el-form-item prop="propagandaMessageSwitch" label="推广消息">
					<el-switch v-model="form.propagandaMessageSwitch" @change="setAutoMessage('propagandaMessageSwitch')"></el-switch>
				</el-form-item>
			  </el-col>
			  <el-col :span="6" v-show="form.propagandaMessageSwitch">
					<el-checkbox v-model="form.stopAfterVisitorsReply" @change="setStopAfterVisitorsReply">访客回复后停止推广消息</el-checkbox>
			  </el-col>
		  </el-row>

          <p>每段对话开启时，系统自动向顾客发送一组推广消息</p>
        </div>
        <div class="main" v-if="form.propagandaMessageSwitch && form.propagandaMessageList.length>0 && !editAutoMessageFlag">
          <el-row :gutter="20" v-for="(tmp, i) in form.propagandaMessageList" :key="i">
            <el-col :span="10">
              <div class="text" v-if="tmp.isShow" v-html="tmp.message1" @mouseenter="tmp.isShow = false"></div>
			  <div class="text textCenter" v-else @mouseleave="tmp.isShow = true">
				  <div>
					  <span @click="editPropagandaMessage(tmp)"><i class="el-icon-edit-outline"></i>编辑</span>
					  <span @click="delPropagandaMessage(tmp.id)"><i class="el-icon-delete"></i>删除</span>
				  </div>
			  </div>
            </el-col>
            <el-col :span="10">
              <div class>
                开启对话
                <el-input-number
                  class="numInt"
                  controls-position="right"
                  :min="0"
                  :max="60"
                  size="small"
                  :precision="0"
                  v-model="tmp.delay"
                  @change="updatePropagandaMessage(tmp)"
                ></el-input-number>秒后发送
              </div>
            </el-col>
            <el-col :span="4">
              <el-checkbox v-model="tmp.enable" @change="updatePropagandaMessage(tmp)">启用</el-checkbox>
            </el-col>
          </el-row>
        </div>
        <div v-if="editAutoMessageFlag && form.propagandaMessageSwitch">
          <quill-editor @inputContent="inputContent" :contentP="defaultAnswerRich"></quill-editor>
          <div class="editor-content" v-html="defaultAnswerRich" hidden></div>
		  <el-row>
			<el-col :span="12">
				<el-button type="primary" class="btn" @click="addPropagandaMessage">确定</el-button>
			</el-col>
			<el-col :span="12">
				<el-button class="btn" @click="editAutoMessageFlag = false;">取消</el-button>
			</el-col>
		  </el-row>
        </div>
        <div class="footer" v-if="form.propagandaMessageSwitch && form.propagandaMessageList.length < 5 && !editAutoMessageFlag">
          <el-button type="primary" icon="el-icon-plus" @click="addItem">添加一条推广消息</el-button>
          <span>
            还可以添加
            <i>{{5-form.propagandaMessageList.length}}</i>条推广消息
          </span>
        </div>
      </section>
      <section>
        <div class="title">
          <!-- <h1>企业欢迎消息</h1> -->
          <el-form-item prop="welcomeMessageSwitch" label="企业欢迎消息">
            <el-switch v-model="form.welcomeMessageSwitch" @change="setAutoMessage('welcomeMessageSwitch')"></el-switch>
          </el-form-item>
          <p>每段对话开启时，系统将自动向顾客发送一段欢迎语</p>
        </div>
        <div class="main" v-if="form.welcomeMessageSwitch">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item prop="welcomeMessage">
                <el-input
                  v-model.trim="form.welcomeMessage"
                  placeholder="请输入内容"
                  @blur="setAutoMessage('welcomeMessage')"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </section>
      <section>
        <div class="title">
          <el-form-item label="客服无应答时消息" prop="customerServiceNoResponseSwitch">
            <el-switch v-model="form.customerServiceNoResponseSwitch" @change="setAutoMessage('customerServiceNoResponseSwitch')"></el-switch>
          </el-form-item>
          <p>客服一段时间没有响应顾客消息时，系统自动向他发送一段消息</p>
        </div>
        <div class="main" v-if="form.customerServiceNoResponseSwitch">
          <el-row :gutter="20">
            <el-col :span="16">
              <div>
                客服超过
                <el-input-number
                  class="numInt"
                  controls-position="right"
                  size="medium"
                  :min="min"
                  :max="max"
                  :precision="0"
                  v-model="form.customerServiceNoResponseSecond"
                  @change="setAutoMessage('customerServiceNoResponseSecond')"
                ></el-input-number>秒无响应时自动发送
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item prop="customerServiceNoResponseMessage">
                <el-input
                  v-model.trim="form.customerServiceNoResponseMessage"
                  placeholder="请输入内容"
                  @blur="setAutoMessage('customerServiceNoResponseMessage')"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </section>
      <section>
        <div class="title">
          <el-form-item label="顾客无响应时消息" prop="customerNoResponseSwitch">
            <el-switch v-model="form.customerNoResponseSwitch" @change="setAutoMessage('customerNoResponseSwitch')"></el-switch>
          </el-form-item>
          <p>顾客一段时间没有响应客服消息时，系统自动向他发送一段消息</p>
        </div>
        <div class="main" v-if="form.customerNoResponseSwitch">
          <el-row :gutter="20">
            <el-col :span="16">
              <div>
                顾客超过
                <el-input-number
                  class="numInt"
                  controls-position="right"
                  size="medium"
                  :min="min"
                  :max="max"
                  :precision="0"
                  v-model="form.customerNoResponseSecond"
                  @change="setAutoMessage('customerNoResponseSecond')"
                ></el-input-number>秒无响应时自动发送
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item prop="customerNoResponseMessage">
                <el-input
                  v-model.trim="form.customerNoResponseMessage"
                  placeholder="请输入内容"
                  @blur="setAutoMessage('customerNoResponseMessage')"
                  maxlength="100"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </section>
      <!-- <section>
                <div class="title">
                    <el-form-item label="对话结束" prop="endConversationSwitch">
                        <el-switch v-model="form.endConversationSwitch" @change="setAutoMessage('endConversationSwitch')"></el-switch>
                    </el-form-item>
                    <p>对话结束后，系统自动向顾客发送一段结束语</p>
                </div>
                <div class="main" v-if="form.endConversationSwitch">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div>客服手动结束时</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item prop="endWithManualMessage">
                                <el-input
                                    v-model.trim="form.endWithManualMessage"
                                    placeholder="请输入内容"
                                    @blur="setAutoMessage('endWithManualMessage')"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div>系统自动关闭时</div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form-item prop="endWithAutoMessage">
                                <el-input
                                    v-model="form.endWithAutoMessage"
                                    placeholder="请输入内容"
                                    @blur="setAutoMessage('endWithAutoMessage')"
                                    maxlength="100"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
      </section>-->
    </el-form>

    <!-- 推广消息预览 -->
    <div class="messagePreview" v-if="editAutoMessageFlag && form.propagandaMessageSwitch">
      <section>
        <header>
          <img src="../../../assets/img/default-avatar.jpg" class />
          <div>管理员</div>
        </header>
        <div class="context">
          <div>
            <div class="box">
              <div class="msgBox">
                <div class="name">管理员</div>
                <div class="msg">
                  <span class="borderBox"></span>
                  <span class="borderBox_1"></span>
                  <div class="text">
                    <div v-html="defaultAnswerRich" v-if="defaultAnswerRich.length > 0"></div>
					<div v-else><br/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import quillEditor from "../../../components/common/quillEditor";
import { getAutoMessage, setAutoMessage, getMsg, addMsg, editMsg, delMsg } from "@/common/api";

export default {
  components: {
    quillEditor
  },
  data() {
    let _this = this;
    const checkConMessge = function(rule, value, callback) {
      if (!_this.form.endWithManualMessage) {
        callback(new Error("客服手动结束对话时推送消息不能为空"));
      } else if (!_this.form.endWithAutoMessage) {
        callback(new Error("系统自动关闭对话时推送消息不能为空"));
      } else {
        callback();
      }
    };
    const checkWelMessage = function(rule, value, callback) {
      if (!_this.form.welcomeMessage && _this.form.welcomeMessageSwitch) {
        callback(new Error("企业欢迎消息不能为空"));
      } else {
        callback();
      }
    };
    const checkCusSerMessage = function(rule, value, callback) {
      if (!_this.form.customerServiceNoResponseMessage && _this.form.customerServiceNoResponseSwitch) {
        callback(new Error("客服无响应时推送消息不能为空"));
      } else {
        callback();
      }
    };
    const checkCusMessage = function(rule, value, callback) {
      if (!_this.form.customerNoResponseMessage && _this.form.customerNoResponseSwitch) {
        callback(new Error("客户无响应时推送消息不能为空"));
      } else {
        callback();
      }
    };
    return {
      form: {
        customerNoResponseMessage:
          "我还在等待你的消息哟~请问还有什么可以帮到您的吗？",
        customerNoResponseSecond: 30,
        customerNoResponseSwitch: 0,
        customerServiceNoResponseMessage: "您好，工作人员正在忙，请稍等。",
        customerServiceNoResponseSecond: 30,
        customerServiceNoResponseSwitch: 0,
        endConversationSwitch: 0,
        endWithAutoMessage:
          "【系统消息】您好，由于很久没有收到您的消息，系统自动结束了对话。如果还有需要，欢迎随时联系我们。",
        endWithManualMessage:
          "【系统消息】您好，为了保证服务质量，我们已经结束了对话，期待再次为您服务。",
        // id: 0,
        messageType: 0,
        ownerId: 0,
        propagandaMessageList: [],
		propagandaMessageSwitch: 0,
		stopAfterVisitorsReply: false,
        welcomeMessage: "【系统消息】您好，有什么需要帮助的？",
        welcomeMessageSwitch: 0
	  },
	  isShow: true,
	  editAutoMessageFlag: false,
	  editAutoMessageObj: null,
	  defaultAnswerRich: '',
      min: 1,
      max: 2200,
      rules: {
        welcomeMessageSwitch: {
          validator: checkWelMessage,
          trigger: ["blur", "change"]
        },
        welcomeMessage: {
          validator: checkWelMessage,
          trigger: ["blur", "change"]
        },
        customerServiceNoResponseSwitch: {
          validator: checkCusSerMessage,
          trigger: ["blur", "change"]
        },
        customerServiceNoResponseMessage: {
          validator: checkCusSerMessage,
          trigger: ["blur", "change"]
        },
        customerNoResponseSwitch: {
          validator: checkCusMessage,
          trigger: ["blur", "change"]
        },
        customerNoResponseMessage: {
          validator: checkCusMessage,
          trigger: ["blur", "change"]
        },
        endConversationSwitch: {
          validator: checkConMessge,
          trigger: ["blur", "change"]
        },
        endWithAutoMessage: {
          required: true,
          message: "系统自动关闭对话时推送消息不能为空",
          trigger: ["blur", "change"]
        },
        endWithManualMessage: {
          required: true,
          message: "客服手动结束对话时推送消息不能为空",
          trigger: ["blur", "change"]
        }
      }
    };
  },
  methods: {
    // 获取组内自动消息规则
    getAutoMessage(type) {
      getAutoMessage().then(res => {
        if (res.data.data) {
          let data = res.data.data;
          if (data.propagandaMessageList) {
            data.propagandaMessageList = JSON.parse(data.propagandaMessageList);
          } else {
            data.propagandaMessageList = [];
          }
          for (let i in data) {
            if (i.toLowerCase().indexOf("switch") !== -1) {
              if (data[i] == 0) {
                data[i] = false;
              } else {
                data[i] = true;
              }
            }
		  }
		  this.form.ownerId = data.ownerId;
		  if(type){
			  this.form[type] = data[type];
			  if(this.form.propagandaMessageSwitch && type == 'propagandaMessageSwitch'){
				this.getPropagandaMessage();
			  }
		  }else{
			  this.form = data;
				if(this.form.propagandaMessageSwitch){
					this.getPropagandaMessage();
				}
		  }
        }
      });
    },
    // 设置组内自动消息规则
    setAutoMessage(type) {
      this.$refs.form.validate(valid => {
        // console.log(valid);
        if (valid) {
          let data = Object.assign({}, this.form);
          if (data.propagandaMessageList.length) {
            data.propagandaMessageList = JSON.stringify(
              data.propagandaMessageList
            );
          } else {
            data.propagandaMessageList = "";
          }
          for (let i in data) {
            if (i.toLowerCase().indexOf("switch") !== -1) {
              if (data[i] === true) {
                data[i] = 1;
              } else if (data[i] === false) {
                data[i] = 0;
              }
            }
          }
          setAutoMessage(data).then(res => {
            if (res.data.code == 0) {
			  if(!this.form.propagandaMessageSwitch){
				  this.editAutoMessageFlag = false;
			  }
			  this.getAutoMessage(type);
              this.$message1({
                type: "success",
                message: "修改成功"
              });
            }
          });
        } else {
          return false;
        }
      });
	},
	// 访客回复是否停止推广消息
	setStopAfterVisitorsReply(){
		let data = {
			stopAfterVisitorsReply: this.form.stopAfterVisitorsReply
		}
		setAutoMessage(data).then(res => {
			if (res.data.code == 0) {
				this.$message1({
					type: "success",
					message: "修改成功"
				});
			}
		})
	},
    // 显示 推广消息 富文本
    addItem() {
      let len = this.form.propagandaMessageList.length;
      if (len < 5) {
		this.editAutoMessageFlag = true;
		this.defaultAnswerRich = '';
		this.editAutoMessageObj = null;
      }
      return;
    },
	inputContent(value){
      this.defaultAnswerRich = value;
	},
	// 获取推广消息
	getPropagandaMessage(){
		getMsg().then( res => {
			if(res && res.data.code == 0){
				let data = res.data.data ? res.data.data : [];
				for(let i=0;i<data.length;i++){
					data[i].isShow = true;
					data[i].message1 = data[i].message.replace(/<img[^>]*>/g,'[图片]');
					data[i].message1 = data[i].message1.replace(/<br[^>]*>/g,'&nbsp;');
				}
				this.form.propagandaMessageList = data;
			}
		})
	},
	// 增加一条推广消息
	addPropagandaMessage(){
		if(this.defaultAnswerRich.length == 0){
			this.$message1({
				message: '内容不能为空',
				type: 'error'
			})
			return;
		}
		if(this.defaultAnswerRich.length > 3000){
			this.$message1({
				message: '内容不能超过3000个字符',
				type: 'error'
			})
			return;
		}
		if(this.editAutoMessageObj){
			let data = this.editAutoMessageObj;
			data.message = this.defaultAnswerRich;
			editMsg(data).then( res => {
				if(res && res.data.code == 0){
					this.$message1({
						message: '修改成功',
						type: 'success'
					})
					this.editAutoMessageFlag = false;
					this.getPropagandaMessage();
				}
			})
		}else{
			let data = {
				delay: 0,
				enable: true,
				message : this.defaultAnswerRich
			};
			addMsg(data).then( res => {
				if(res && res.data.code == 0){
					this.$message1({
						message: '添加成功',
						type: 'success'
					})
					this.editAutoMessageFlag = false;
					this.getPropagandaMessage();
				}
			})
		}
	},
	// 编辑当前推广消息
	editPropagandaMessage(obj){
		this.defaultAnswerRich = obj.message;
		this.editAutoMessageFlag = true;
		this.editAutoMessageObj = obj;
		obj.isShow = true;
	},
	// 更新推广信息
	updatePropagandaMessage(obj){
		if(obj.delay < 0 || obj.delay > 60){
			this.$message1({
				message: '延迟发送时间不能大于60秒或小于0秒',
				type: 'error'
			})
		}
		editMsg(obj).then( res => {
			if(res && res.data.code == 0){
				this.$message1({
					message: '修改成功',
					type: 'success'
				})
				this.getPropagandaMessage();
			}
		})
	},
	// 删除当前推广消息
	delPropagandaMessage(id){
		this.$confirm('确定删除该消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
			delMsg(id).then( res => {
				if(res && res.data.code == 0){
					this.$message1({
						message: '删除成功',
						type: 'success'
					})
					this.getPropagandaMessage();
				}
			})
		})
	}
  },
  created() {
    this.getAutoMessage();
  }
};
</script>

<style lang="less" scoped>
.autoMessage {
  width: 100%;
  font-size: 13px;
  line-height: 28px;
  position: relative;
  .el-form {
    width: 710px;
  }
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
        // position: relative;
        font-size: 14px;
        p {
          color: #969faa;
        }
        // > div,
        // h1 {
        //     display: inline-block;
        //     vertical-align: middle;
        // }
      }
      &.main {
		.text{
			box-sizing: border-box;
			position: relative;
			border-radius: 3px;
			background-color: #f9fafc;
			border: 1px solid #eff0f2;
			max-width: 250px;
			color: #5a6978;
			font-size: 13px;
			padding: 10px;
			margin-right: 10px;
			min-width: 200px;
			max-width: 428px;
			line-height: 1.7;
			word-break: break-all;
			min-height: 38px;
			margin-right: 30px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex: 1;
			&.textCenter{
				text-align: center;
			}
		}
        .grid-content {
          padding: 4px;
          border: 1px solid #eff0f2;
          background: #f9fafc;
          border-radius: 4px;
        }
        // .numInt {
        //     width: 80px;
        // }
        .el-row {
          margin-bottom: 10px;
          .numInt {
            margin: 0 10px;
            width: 100px;
          }
          span {
            margin-left: 10px;
            color: #409eff;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
      &.footer {
        span {
          margin-left: 10px;
          color: #969faa;
        }
      }
    }
  }

  .messagePreview{
	  position: absolute;
	  top: 0;
	  left: 710px;
	  section{
		width: 320px;
		height: 480px;
		background-color: #fff;
		box-shadow: 0 0 20px 0 rgba(0,0,0,.15);
		overflow: hidden;
		header{
			width: 100%;
			height: 60px;
			padding: 16px;
			background-color: #4ca0ff;
			color: #fff;
			font-size: 13px;
			line-height: 60px;
			box-shadow: 0 1px 0 0 rgba(0,0,0,.06), 0 2px 0 0 rgba(0,0,0,.01);
			display: flex;
			align-items: center;
			box-sizing: border-box;
			img{
				width: 32px;
				height: 32px;
				border-radius: 16px;
			}
			div{
				flex: 1;
				margin-left: 10px;
			}
		}
		.context{
			box-sizing: border-box;
			top: 60px;
			background-color: hsla(0,0%,99%,.96);
			position: absolute;
			height: 370px;
			width: 100%;
			overflow-x: hidden;
			overflow-y: auto;
			word-wrap: break-word;
			padding: 0;
			.box{
				margin: 14px;
				.msgBox{
					margin-bottom: 20px;
					.name{
						margin-bottom: 2px;
    					font-size: 12px;
					}
					.msg{
						margin-right: 0;
						padding: 12px;
						color: #000;
						background-color: #fff;
						border: 1px solid #f0f0f0;
						position: relative;
						border-radius: 3px;
						font-size: 13px;
						line-height: 20px;
						word-wrap: break-word;
						word-break: break-all;
						float: left;
						width: 100%;
						box-sizing: border-box;
						.borderBox, .borderBox_1{
							box-sizing: border-box;
							position: absolute;
							display: block;
							width: 0;
							height: 0;
							font-size: 0;
						}
						.borderBox{
							top: 13px;
							left: -7px;
							border-top: 6px solid transparent;
							border-bottom: 6px solid transparent;
							border-right: 7px solid #f0f0f0;
						}
						.borderBox_1{
							top: 14px;
							left: -6px;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-right: 6px solid #fff;
						}
					}
				}
			}
		}
	  }
  }
}
</style>
