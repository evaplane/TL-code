<template>
  <div class="user showdia">
    <!-- 栅格 -->
    <el-row class="operation">
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="公告标题:">
            <el-input
              placeholder="请输入公告标题"
              v-model="labelData.labelName"
              type="text"
              clearable
              :change="check_num()"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
        <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class="content">
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        border
        :data="deptTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-dblclick="openDetails"
        @selection-change="handleSelectionChange"
         :default-sort = "{prop: 'createTime', order: 'descending'}"
      >
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column type="index" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="noticeTitle" label="公告标题" show-overflow-tooltip></el-table-column>
        <el-table-column label="公告类型" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.noticeType == 1 ? '网页内容' : '网页地址'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="noticeIntro" label="公告简介" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statechange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="最新更新时间" width="180"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagingDetails.pageNo"
          :page-sizes="pagingDetails.pageSizes"
          :page-size="pagingDetails.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagingDetails.total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="详情"  :visible.sync="dialogFormVisible">
      <table class="table">
        <tbody>
          <tr>
            <th width="400" class="right">公告标题：</th>
            <th width="800">{{dialogData.noticeTitle}}</th>
            <th width="400" class="right">公告类型：</th>
            <th width="600">{{dialogData.noticeType}}</th>
          </tr>
          <tr>
            <th class="right">公告简介：</th>
            <th style="height:40px;overflow:hidden;">{{dialogData.noticeIntro}}</th>
            <th class="right">状态：</th>
            <th>{{dialogData.status}}</th>
          </tr>
          <tr>
            <th class="right">公告链接：</th>
            <th colspan="3">
              {{dialogData.noticeImageUrl}}
            </th>
          </tr>
          <tr>
            <th class="right" style="height:120px;">公告内容：</th>
            <th colspan="3">{{dialogData.noticeContent}}</th>
          </tr>
          <tr>
            <th width="300" class="right">创建时间：</th>
            <th width="300">{{dialogData.createTime}}</th>
            <th width="300" class="right">最新更新时间：</th>
            <th width="300">{{dialogData.updateTime}}</th>
          </tr>
          <tr>
            <th width="300" class="right">操作员：</th>
            <th width="300">{{dialogData.updateUser}}</th>
            <th width="300" class="right"></th>
            <th width="300"></th>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tree,formatterDateTime } from "../../../js/util";
export default {
  name: "notice",
  data() {
    return {
      // 搜索框
      labelData: {
        labelName: "",
      },
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        pageSizes:[5, 10, 20],
        pageNo:1,
        pageSize:10,
      },
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow: {},
      dialogFormVisible: false,
      dialogData: {
        noticeTitle: "",
        noticeType: "",
        noticeIntro: "",
        status: "",
        noticeImageUrl: "",
        noticeContent: "",
        createTime: "",
        updateTime: "",
        updateUser: ""
      }
    };
  },
  created() {
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.getDeptData();
  },
  methods: {
    // 获取列表数据
    getDeptData(flag) {
      if(flag){
        this.pagingDetails.pageNo = 1;
        this.$router.replace('?page=1');
      }
      this.$get("common-web/notice/pageList",{
        noticeTitle:this.labelData.labelName,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize
      }).then(res => {
        if (res.code == "000000") {
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.status === 100 ? row.status = true : row.status = false;
          })
          this.deptTableData = res.data.rows;
          this.pagingDetails.total = res.data.total;
        }
      });
    },
    // 改变页容量
    handleSizeChange(val) {
      this.pagingDetails.pageSize = val;
      this.getDeptData();
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.pagingDetails.pageNo= val;
      this.$router.replace('?page='+val);
      this.getDeptData();
    },
    handleSelectionChange(val) {
      this.selectEditRow = val;
    },
    // 限制输入
    check_num() {
      this.labelData.labelName = this.labelData.labelName.trim();
    },
    openDetails(row) {
      console.log(row);
      console.log(this.dialogData);
      for(let i in row){
        if(i == 'noticeType'){
          this.dialogData[i] = (row[i] == 1)? '网页内容':'网页地址'
        }else if(i === 'status'){
          this.dialogData[i] = Boolean(row[i]) ? '启用':'停用'
        }else{
          this.dialogData[i] = row[i];
        }
      };
      this.dialogFormVisible = true;
    },
    close() {
      for(let i in this.dialogData){
        this.dialogData[i] = '';
      }
      this.dialogFormVisible = false;
    },
    statechange(row){
      let status = row.status ? 100 : -100;
      this.$get("common-web/notice/updateStatus",{
        id:row.id,
        status:status
      }).then(res => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: res.message
          });
          this.getDeptData();
        }else{
          this.$message({
          type: "warning",
          message: res.message
        });
        }
      })
      .catch((e) => {
        this.$message({
          type: "info",
          message: e
        });
      });
    },
    // 查询
    handleSearch() {
      this.getDeptData(1);
    },
    // 新增操作
    handleAdd() {
      this.$router.push("/modules/basicConfiguration/noticeAdd.html");
    },
    // 修改
    handleEdit() {
      // 判断对象是否为空
      let length = Object.keys(this.selectEditRow).length;
      if (length == 0) {
        return this.$message({
          showClose: true,
          message: "请选择要修改的数据",
          type: "warning"
        });
      } else if(length > 1){
        return this.$message({
          showClose: true,
          message: "选择数据过多，当前仅支持单条数据修改",
          type: "warning"
        });
      }else{
        // 注意修改数据，此处传递是数组
        return this.$router.push({
          path: "/modules/basicConfiguration/noticeEdit.html",
          query: { ...this.selectEditRow[0] }
        });
      }
    },
    // 删除
    handleDelete() {
      // 判断对象是否为空
      if (Object.keys(this.selectEditRow).length == 0) {
        return this.$message({
          showClose: true,
          message: "请选择要删除的数据",
          type: "warning"
        });
      } else {
        let deleteArr = [];
            this.selectEditRow.forEach(item=>{
              
            });
            console.log(deleteArr);


        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let deleteArr = [];
            this.selectEditRow.forEach(item=>{
              deleteArr.push(item.id);
            });
            this.$post("common-web/notice/deleteNotice", {
              ids: deleteArr.join(",")
            }).then(res => {
              if (res.code == "000000") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getDeptData();
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    }
  }
};
</script>
<style style="scss">
.showdia .table {
  width: 100%;
  border: solid 1px #ddd;
  text-align: center; /*文本居中*/
  border-collapse: collapse; /*表格的边框合并，如果相邻，则共用一个边框*/
  border-spacing: 0; /*设置行与单元格边框的间距。当表格边框独立（即border-collapse:separate;）此属性才起作用*/
}

.showdia .table td {
  word-break: break-all; /*允许在字内换行,即单词可分*/
  word-wrap: break-word; /*允许长单词或URL地址换行*/
  border: solid 1px #ddd;  
  font: 500 14px Arial;
}
.showdia .table th {
  text-align: left;
  padding-left: 10px;
  border: solid 1px #ddd; 
  font-weight: 400;
  width: 300px;
  height: 30px;
}
.showdia .table .right {
  text-align: right;
  background-color: #eee;
}
.showdia .el-dialog {
  width: 50% !important;
}
</style>

