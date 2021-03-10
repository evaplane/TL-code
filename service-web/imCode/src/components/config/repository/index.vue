<template>
  <div class="repository" id="common-wrapper">
    <div class="leftMenu float-left">
      <el-tree
        :data="ticketMenus"
        @node-click="handleNodeClick"
        default-expand-all
        ref="ticketTree"
        node-key="id"
        :current-node-key="currentNodekey"
      >
        <span slot-scope="{ node, data }">
          <span class="lable">{{node.label}}</span>
          <i class="nums" v-show="data.nums>0">{{data.nums}}</i>
        </span>
      </el-tree>
    </div>
    <div class="rightBox float-left">
      <ul class="list float-left">
        <li
          v-for="(obj,index) in classify"
          :key="obj.id"
          @mouseenter="obj.active = true"
          @mouseleave="obj.active = false"
        >
          <p @click="changeClassify(index,obj.id)" :class="{active:inx==index}">
            <span class="title name" :title="obj.categoryTitle">{{obj.categoryTitle}}</span>
            <span class="title">{{'('+obj.total+')'}}</span>
            <span v-if="obj.id === 1" class="float-right el-icon-plus" @click="add"></span>
            <span
              v-if="obj.id > 2"
              v-show="obj.active"
              class="float-right el-icon-delete"
              @click="del(obj)"
            ></span>
            <span
              v-if="obj.id > 2"
              v-show="obj.active"
              class="float-right el-icon-edit-outline"
              @click="edit(obj)"
            ></span>
          </p>
        </li>
      </ul>
      <div class="tableBox float-left">
        <div class="searchBox" v-show="tableFlag">
          <div class="float-left inputBox">
            <el-input
              class="paddingLeft"
              placeholder="问题或答案"
              prefix-icon="el-icon-search"
              v-model="questionTitle"
            ></el-input>
            <el-button class="btn" type="primary" @click="getQuestion">搜索</el-button>
          </div>
          <div class="float-right">
            <p class="addQs el-icon-plus" @click="addQs">添加问题</p>
          </div>
        </div>
        <div class="box" v-show="tableFlag">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="questionTitle" label="标准问题" width="250">
              <template slot-scope="scope">
                <a
                  class="btn"
                  href="javascript:;"
                  :title="scope.row.questionTitle"
                  @click="editQs(scope.row)"
                >{{scope.row.questionTitle}}</a>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="name" label="有效期" width="150"></el-table-column> -->
            <el-table-column prop="status" label="当前状态" width="150" :formatter="formatter_status"></el-table-column>
            <el-table-column prop="updateTime" label="操作时间" width="200"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status"
                  type="text"
                  size="small"
                  @click="blockUp(scope.row)"
                >停用</el-button>
                <el-button v-else type="text" size="small" @click="startUsing(scope.row)">启用</el-button>
                <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagerClass text-right"
            background
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            layout="prev, pager, next, jumper"
            :page-size="pageSize"
            :total="total"
          ></el-pagination>
        </div>
        <div class="addQsBox" v-show="!tableFlag">
          <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
            <el-form-item label="标准问题" prop="questionTitle">
              <el-input v-model="form.questionTitle"></el-input>
            </el-form-item>
            <el-form-item label="默认回答" class="tinymce" v-if="!tableFlag">
              <quill-editor @inputContent='inputContent' :contentP="form.defaultAnswerRich"></quill-editor>
              <div class="editor-content" v-html="form.defaultAnswerRich" hidden></div>
            </el-form-item>
            <el-form-item label="分类名称" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类">
                <el-option
                  v-for="item in classify_2"
                  :key="item.id"
                  :label="item.categoryTitle"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="footer text-center">
            <el-button class="btn" type="primary" @click="submit">保存</el-button>
            <el-button class="btn" @click="tableFlag = true">取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类 新建/编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="400px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :model="categoryTitleForm"
          :rules="rules"
          ref="categoryTitleForm"
          v-if="dialogVisible"
        >
          <el-form-item prop="text">
            <el-input v-model="categoryTitleForm.text" placeholder="分类名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="categoryTitleSubmit">保存</el-button>
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
    var validate = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback(new Error("请输入分类名称"));
      } else if (value.length > 20) {
        callback(new Error("名称不得超过 20 个字符!"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      value = value.trim();
      if (!value) {
        callback(new Error("请输入标准问题"));
      } else if (value.length > 100) {
        callback(new Error("问题不得超过 100 个字符!"));
      } else {
        callback();
      }
    };
    return {
      currentNodekey: "",
      ticketMenus: [
        {
          id: 1,
          label: "企业知识库",
          children: [
            {
              id: 2,
              label: "单轮问题",
              nums: "0",
              type: 1
            }
          ]
        }
      ],
      classify: [],
      classify_2: [],
      inx: 0,
      categoryId: 1,
      dialogVisible: false,
      title: "",
      type: "",
      categoryTitleForm: {
        id: "",
        text: ""
      },
      rules: {
        text: [
          {
            required: true,
            validator: validate,
            trigger: ["blur", "change"]
          }
        ]
      },
      questionTitle: "",
      tableFlag: true,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      form: {
        id: "",
        questionTitle: "",
        categoryId: "",
        defaultAnswerRich: ""
      },
      formRules: {
        questionTitle: [
          {
            required: true,
            validator: validateName,
            trigger: ["blur", "change"]
          }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择分类",
            trigger: ["blur", "change"]
          }
        ],
        defaultAnswerRich: [
          {
            required: true,
            message: "请输入默认回答",
            trigger: ["blur", "change"]
          }
        ]
      },
      formType: ""
    };
  },
  methods: {
    getAllClassify() {
      getClassify().then(res => {
        let data = res.data.data;
        if (data) {
          let index, obj;
          for (var i in data) {
            data[i].active = false;
            if (data[i].id === 2) {
              index = i;
              obj = data[i];
            }
          }
          data.splice(index, 1);
          data.push(obj);
          this.classify = data;
          this.classify_2 = this.classify.filter(obj => {
            return obj.id > 2;
          });
        }
      });
    },
    handleNodeClick(e) {},
    changeClassify(index, id) {
      this.inx = index;
      this.categoryId = id;
      this.tableFlag = true;
      this.getQuestion();
    },
    add() {
      this.title = "新建分类";
      this.type = "add";
      this.categoryTitleForm.id = "";
      this.categoryTitleForm.text = "";
      this.dialogVisible = true;
    },
    edit(obj) {
      this.title = "编辑分类";
      this.type = "edit";
      this.categoryTitleForm.id = obj.id;
      this.categoryTitleForm.text = obj.categoryTitle;
      this.dialogVisible = true;
    },
    del(obj) {
      let id = obj.id;
      this.$confirm('删除 "' + obj.categoryTitle + '"', "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.delete(`/set/questionCategoryConfig/${id}`).then(res => {
          if (res.data.code === 0) {
            this.$message1({
              message: "恭喜你，操作成功",
              type: "success"
            });
            this.getAllClassify();
          } else {
            this.$message1({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    categoryTitleSubmit() {
      let data = {
        categoryTitle: this.categoryTitleForm.text
      };
      let message = "添加成功";
      let type = "post";
      if (this.type === "edit") {
        message = "修改成功";
        type = "put";
        data.id = this.categoryTitleForm.id;
      }
      this.$refs["categoryTitleForm"].validate(valid => {
        if (valid) {
          this.$axios[type]("/set/questionCategoryConfig", data).then(res => {
            if (res.data.code == 0) {
              this.$message1({
                message: message,
                type: "success"
              });
              this.dialogVisible = false;
              this.getAllClassify();
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
    getQuestion() {
      let data = {
        categoryId: this.categoryId,
        questionTitle: this.questionTitle,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      setTimeout(() => {
        getQuestion(data).then(res => {
          if (res.data.data) {
            this.tableData = res.data.data.content;
            this.total = res.data.data.totalElements;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        });
      }, 800);
    },
    handleCurrentChange() {
      this.getQuestion();
    },
    addQs() {
      this.tableFlag = false;
      this.formType = "add";
      this.form.defaultAnswerRich = "";
      this.$refs.form.resetFields();
    },
    editQs(row) {
      this.tableFlag = false;
      this.formType = "edit";
      this.form.id = row.id;
      this.form.questionTitle = row.questionTitle;
      this.form.categoryId = row.categoryId == 2 ? "" : row.categoryId;
      this.form.defaultAnswerRich = row.defaultAnswerRich;
      this.$refs.form.clearValidate();
    },
    submit() {
      let answer = this.form.defaultAnswerRich.replace(/<(?!img)[^>]+>/g, ""); // 去掉除img标签外的所有html标签
      let isTooLang = this.form.defaultAnswerRich.replace(/<[^>]+>/g, ""); // 去掉所有html标签
      let str = answer.replace(/&nbsp;/g, ""); //  去掉 nbsp;
      let newStr = str.trim(); //  去掉空格;
      if (!newStr) {
        this.$message1({
          message: "回答不能为空",
          type: "error"
        });
        return false;
      }
      if(isTooLang.replace(/&nbsp;/g, "").trim().length > 255){
        this.$message1({
          message: "回答不得超过 255 个字符!",
          type: "error"
        });
        return false;
      }
      let data = {
        defaultAnswerRich: this.form.defaultAnswerRich,
        defaultAnswer: answer,
        categoryId: this.form.categoryId,
        questionTitle: this.form.questionTitle
      };
      let message = "添加成功";
      let type = "post";
      if (this.formType === "edit") {
        data.id = this.form.id;
        type = "put";
        message = "修改成功";
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$axios[type]("/set/questionConfig", data).then(res => {
            if (res.data.code == 0) {
              this.$message1({
                message: message,
                type: "success"
              });
              this.tableFlag = true;
              this.getAllClassify(this.form.categoryId);
              this.getQuestion();
            } else {
              this.$message1({
                message: res.data.msg,
                type: "error"
              });
            }
          }).catch( res => {
              this.$message1({
                message: '系统维护中，请稍后尝试',
                type: "error"
              });
          });
        }
      });
    },
    formatter_status(row) {
      return this.$Params.getText(row.status, "QS_STATUS");
    },
    blockUp(row) {
      this.$confirm('停用 "' + row.questionTitle + '"', "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          id: row.id,
          status: false
        };
        this.$axios.put("/set/questionConfig/status", data).then(res => {
          if (res.data.code === 0) {
            this.$message1({
              message: "恭喜你，操作成功",
              type: "success"
            });
            this.getQuestion();
          } else {
            this.$message1({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    startUsing(row) {
      this.$confirm('启用 "' + row.questionTitle + '"', "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          id: row.id,
          status: true
        };
        this.$axios.put("/set/questionConfig/status", data).then(res => {
          if (res.data.code === 0) {
            this.$message1({
              message: "恭喜你，操作成功",
              type: "success"
            });
            this.getQuestion();
          } else {
            this.$message1({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    remove(row) {
      let id = row.id;
      this.$confirm('删除 "' + row.questionTitle + '"', "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.delete(`/set/questionConfig/${id}`).then(res => {
          if (res.data.code === 0) {
            this.$message1({
              message: "恭喜你，操作成功",
              type: "success"
            });
            this.getAllClassify();
            this.getQuestion();
          } else {
            this.$message1({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    inputContent(value){
      this.form.defaultAnswerRich = value;
      console.log(value);
    }
  },
  created() {
    this.getAllClassify();
    this.getQuestion();
  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/base.less";

.repository {
  display: block;
  flex-direction: column;
  background-color: #fff;
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  .leftMenu {
    width: 160px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
  .rightBox {
    width: calc(~"100% - 161px");
    height: 100%;
    .list {
      width: 180px;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      height: 100%;
      overflow: auto;
      li {
        color: #323c42;
        line-height: 36px;
        height: 36px;
        font-size: 13px;
        text-overflow: ellipsis;
        word-break: keep-all;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        p {
          padding: 0 10px;
          &:hover,
          &.active {
            background-color: #f5f6f8;
          }
        }
        span {
          color: #009de7;
          margin-right: 5px;
          line-height: 36px;
          &.title {
            color: #323c42;
            margin-right: 0;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            &.name {
              text-overflow: ellipsis;
              max-width: 95px;
            }
          }
        }
      }
    }
    .tableBox {
      width: calc(~"100% - 181px");
      height: 100%;
      padding-left: 20px;
      .searchBox {
        height: 50px;
        line-height: 50px;
        .inputBox {
          .paddingLeft {
            width: 300px;
            margin-right: 10px;
          }
          .btn {
            width: 100px;
            background-color: #009de7 !important;
            font-size: 13px;
            line-height: 1.385;
            padding: 7px 21px;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            color: #fff;
          }
        }
        .addQs {
          margin-left: 10px;
          color: #009de7;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .box {
        .btn {
          display: inline-block;
          max-width: 210px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .pagerClass {
        margin-top: 20px;
      }
      .addQsBox {
        width: 550px;
        .tinymce {
          margin: 20px 0;
        }
        .el-select {
          width: 100%;
        }
        .footer {
          margin: 20px 0;
          .btn {
            width: 100px;
            font-size: 13px;
            line-height: 1.385;
            padding: 7px 21px;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
.el-select-dropdown__item {
  line-height: 34px;
  font-size: 14px;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
