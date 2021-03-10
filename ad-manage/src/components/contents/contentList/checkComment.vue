<template>
  <div class='user'>
    <div v-if="showAllData">
     <!-- 内容 -->
    <div class="content" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;padding-left:10px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>评论</div></el-col>
        </el-row>
        <!-- 栅格 -->
        <el-row class='operation' style="margin-bottom:10px;">
          <!-- 输入框 -->
          <el-col :span="5">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="评论人ID:">
                <el-input placeholder="请输入评论人ID" clearable v-model="userData.userId"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <!-- 按钮 -->
            <el-button type="primary" v-if="this.$store.state.roleList.indexOf('comment:pageList') > -1" size="medium"  @click='handleSearch'>查询</el-button>
            <el-button type="primary" v-if="this.$store.state.roleList.indexOf('comment:delete') > -1" size="medium"  @click='handleDelete'>删除</el-button>
          </el-col>
        </el-row>
        <!-- 内容 -->
        <div class='content'>
            <!-- 表格 -->
          <el-table ref="multipleTable" border :data="gatherUserDetailTableData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"></el-table-column>
            <el-table-column type="index" label="序号" width="100" :resizable = "false">
              <template slot-scope="scope">
                <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="评论人ID" width="100" :resizable = "false"></el-table-column>
            <el-table-column prop="content" label="评论内容"  show-overflow-tooltip :resizable = "false">
              <template slot-scope="scope">
                <div v-html="scope.row.content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" :resizable = "false">
              <template slot-scope="scope">
                <switchItem :val="scope.row.status" :id="scope.row.id" :reqUrl="'content-web/comment/updateStatus'" @result="getData"></switchItem>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="评论时间" width="200" :resizable = "false"></el-table-column>
            <el-table-column prop="updateTime" label="最近更新时间" width="200" :resizable = "false"></el-table-column>
            <el-table-column prop="operator" label="操作员" width="100" :resizable = "false"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              v-show="showPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="userData.pageNo"
              :page-sizes="pageSizes"
              :page-size="userData.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div> 
        </div>
          <el-row>
            <el-col :span="8"><div class="grid-content"></div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToGatherUser">返回</el-button>
            </div></el-col>
          </el-row>
    </div>
  </div>
  <div v-if="showErrorDom" style="text-align:center;line-height:400px;">
      {{showErrorDom}}
    </div>
  </div>
</template>

<script>
import {formatterDateTime,delSelectTag} from '../../../js/util'
import switchItem from '../../common/switchItem'
export default {
  name: 'checkComment',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      userData: {
        userId:'',
        pageSize:10,
        pageNo:1,
        contentId:''
      },
      // 表格信息
      gatherUserDetailTableData: [],
      // 获取选中行
      selectRows:[],
      // 总条数
      total:0,
      pageSizes:[],
      showPage:false,
    }
  },
  components:{
    switchItem
  },
  
  created() {
    this.userData.pageNo = Number(this.$route.query.page)||1;
    this.userData.contentId = this.$route.query.contentId;
    this.getData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        this.getData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getData()
    },
    // 获取用户
    getData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.userData.pageNo = 1;
        query.page = 1;
      };
      query.contentId = this.userData.contentId;
      this.$router.replace({query:query});
      this.$get('content-web/comment/pageList', this.userData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            let content = v.content;
            content = content.replace(/<e:(.*?)>/g,function(){
                return eval("'" + arguments[1] + "'");
            });
            v.content = this.$emoji.parse(content);
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.gatherUserDetailTableData = res.data.rows
          this.total = Number(res.data.total);
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>20){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          };
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        };
      })
    },
    // 查询
    handleSearch() {
      this.getData(1)
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 返回首页
    backToGatherUser(){
        delSelectTag(this.$route)
        this.$router.history.go(-1);
    },
    // 删除
    handleDelete(){
      if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择要删除的数据',
          type: 'warning'
        });
        return
      }else{
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let ids =[];
          this.selectRows.forEach(v=>{
            ids.push(v.id)
          })
          this.$post(`content-web/comment/delete`,{ids:ids.join(",")}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.userData.pageNo == Math.max(1, Math.ceil(this.total / this.userData.pageSize))&&this.selectRows.length==this.gatherUserDetailTableData.length){
                this.userData.pageNo = 1;
              };
              this.getData()
            }else{
              this.$message({
                type: 'warning',
                message: res.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    // 修改当前行状态
    statechange(row){
      this.getData();
      return;
    },
  },
}
</script>
<style style="scss">
.distpicker-address-wrapper select {
  height: 35px;
  font-size: 14px;
}
.phoneSelect .el-input__inner {
  width: 65px;
  padding: 15px;
  font-size: 12px;
}
.phoneSelect .el-input__suffix {
  right: 0;
}
.phoneSelect .el-select__caret {
  font-size: 12px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 150px;
}
.el-date-editor .el-input__inner{
  width: 150px;
}
</style>

