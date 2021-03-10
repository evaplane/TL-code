<template>
  <div class='manual'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="上传形式:">
            <el-select v-model="labelData.uploadWay" clearable placeholder="全部">
                <el-option
                  v-for="item in uploadWays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="审核状态:">
            <el-select v-model="labelData.auditStatus" clearable placeholder="全部">
                <el-option
                  v-for="item in auditStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('manualAudit:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('manualAudit:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
        <i class="el-select__caret el-input__icon el-icon-circle-colse"></i>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table 
        ref="multipleTable"
        border :data="deptTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleView"
      >
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column type="index" label="序号" width="60" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" :resizable = "false" v-if="lockDisabled">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.auditStatus == 0&&scope.row.genPreviewVideoStatus==0&&scope.row.publishStatus==1"
              @click="handleEdit(scope.$index, scope.row)">审核</el-button>
            <el-button
              size="mini"
              type="primary"
              v-else-if="scope.row.auditStatus == 2&&scope.row.genPreviewVideoStatus==0&&scope.row.publishStatus==2"
              @click="handleEdit(scope.$index, scope.row)">重新审核</el-button>
            <el-button
              size="mini"
              type="primary"
              v-else-if="scope.row.auditStatus == 2&&scope.row.genPreviewVideoStatus==0&&scope.row.publishStatus==2"
              @click="handleEdit(scope.$index, scope.row)">审核</el-button>
            <el-button
              size="mini"
              type="info"
              v-else
              disabled>审核</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="contentTitle" label="内容标题" show-overflow-tooltip :resizable = "false">
          <template slot-scope="scope">
            <div v-html="scope.row.contentTitle"></div>
          </template>
        </el-table-column>
        <el-table-column label="上传形式" width="100" :resizable = "false">
          <template slot-scope="scope">
            {{scope.row.uploadWay==1?'图片':'视频'}}
          </template>
        </el-table-column>
        <el-table-column prop="genPreviewVideoStatus" label="预览视频状态" width="120" :resizable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.genPreviewVideoStatus==0">已生成</span>
            <span v-if="scope.row.genPreviewVideoStatus==1">重新生成中</span>
            <span v-if="scope.row.genPreviewVideoStatus==2">生成中</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="内容发布状态" width="120" :resizable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus==0">机器审核中</span>
            <span v-else-if="scope.row.publishStatus==1">机器审核成功</span>
            <span v-else-if="scope.row.publishStatus==2">机器审核失败</span>
            <span v-else-if="scope.row.publishStatus==3">视频切片中</span>
            <span v-else-if="scope.row.publishStatus==4">视频切片完成</span>
            <span v-else>视频切片失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" width="120" :resizable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus==0">待审核</span>
            <span v-else-if="scope.row.auditStatus==1">审核通过</span>
            <span v-else-if="scope.row.auditStatus==2">审核驳回</span>
            <span v-else-if="scope.row.auditStatus==3">审核中</span>
            <span v-else>部分审核通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="operator" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
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
  </div>
  <div v-if="showErrorDom" style="text-align:center;line-height:400px;">
      {{showErrorDom}}
    </div>
  </div>
</template>

<script>
import {formatterDateTime} from '../../../js/util'
import { setInterval } from 'timers';
export default {
  name: 'manual',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      labelData: {
        uploadWay: '',
        auditStatus: '',
      },
      reportContentListDetailVisible:false,
      innerVisible:false,
      listArr:[],
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        pageSizes:[],
        pageNo:1,
        pageSize:10,
      },
      uploadWays:[
        {
          value:'',
          label:'全部',
        },
        {
          value:1,
          label:'图片',
        },
        {
          value:2,
          label:'视频'
        }
      ],
      auditStatusOptions: [
        {
          value:'',
          label:'全部',
        },{
        value: '0',
        label: '待审核'
      },{
        value: '3',
        label: '审核中'
      }, {
        value: '2',
        label: '审核驳回'
      },
      ],
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:{},
      showContentData:{},
      showPage:false,
      lockDisabled:false,
      intervaltimer:null
    }
  },
  created() {
    this.lockDisabled = this.$store.state.roleList.indexOf('manualAudit:audit') > -1;
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.labelData.auditStatus = query.auditStatus;
    this.labelData.uploadWay = query.uploadWay;
    this.getDeptData();
  },
  methods: {
    // 获取列表数据
    getDeptData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.pagingDetails.pageNo = 1;
        query.page = 1;
      };
      query.auditStatus = this.labelData.auditStatus;
      query.uploadWay = this.labelData.uploadWay;
      this.$router.replace({query:query});
      this.$post("content-web/manualAudit/pageList",{
        auditStatus:this.labelData.auditStatus,
        uploadWay:this.labelData.uploadWay,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.showAllData = true;
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.auditTime = formatterDateTime(row.auditTime);
            let title = row.contentTitle;
            let that = this;
            title = title.replace(/<e:(.*?)>/g,function(){
                return eval("'" + arguments[1] + "'");
            });
            row.contentTitle = this.$emoji.parse(title);
            row.status === 100 ? row.status = true : row.status = false;
          })


          this.deptTableData = res.data.rows;
          this.pagingDetails.total = Number(res.data.total);
          if(this.pagingDetails.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.pagingDetails.total>20){
              this.pagingDetails.pageSizes=[10,20,50]
            }else{
              this.pagingDetails.pageSizes=[10,20]
            }
          }
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        }
      });
    },
    handleEdit(index, row) {
      if(row.publishStatus == 2){
        this.$post("content-web/manualAudit/reAutoAudit",{
          contentId:row.id
        }).then(res => {
          if (res.code == "000000") {
            this.$message.success(res.message);
            this.getDeptData();
          }else{
            this.$message.warning(res.message);
          }
        });
      }else{
        this.$router.push({path:'/modules/contents/manualSub.html',query:{id:row.id}})
      }
    },
    handleView(row) {
      this.$router.push({path:'/modules/contents/manualview.html',query:{id:row.id}})
    },
    // 改变页容量
    handleSizeChange(val) {
        this.pagingDetails.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getDeptData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.pagingDetails.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getDeptData()
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectEditRow = val
    },
    // 查询
    handleSearch() {
      this.getDeptData(1)
    },
    // 删除
    handleDelete(){
       // 判断对象是否为空
      if(Object.keys(this.selectEditRow).length==0){
        this.$message({
          showClose: true,
          message: '请选择需要删除的数据',
          type: 'warning'
        });
        return
      }else{
        for (let index = 0; index < this.selectEditRow.length; index++) {
          const element = this.selectEditRow[index];
          if(element.auditStatus == 0&&element.publishStatus != 2){
            this.$message({
              type: 'warning',
              message: '所选内容包含待审核数据，需要移除待审核数据才能执行删除'
            });
            return 
          }
        };
         this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let ids = [];
          this.selectEditRow.forEach(item=>{
            ids.push(item.id);
          });
          this.$post('content-web/manualAudit/delete',{ids:ids.join(",")}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.pagingDetails.pageNo == Math.max(1, Math.ceil(this.pagingDetails.total / this.pagingDetails.pageSize))&&this.selectEditRow.length==this.deptTableData.length){
                this.pagingDetails.pageNo = 1;
              };
              this.getDeptData()
            }else{
              this.$message({
                type: 'warning',
                message: res.message
              });
            }
          })
        }).catch((e) => {
          console.log(e);
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
  },

}
</script>
<style lang="scss">
.manual{
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
  .grid-content{
    text-align: left;
    padding-right: 10px;
    text-indent: 10px
  }
  .detail-bg{
    text-align: right;
    justify-content: flex-end;
  }
  .grid-content:last-of-type{
    height:calc(100% - 2px);
  }
  .detailBottom .detail-bg{
    height: calc( 100% - 2px);
  }
}
.showimgpic .el-carousel__container{
  height:500px;
}
</style>

