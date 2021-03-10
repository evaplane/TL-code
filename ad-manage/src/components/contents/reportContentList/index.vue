<template>
  <div class='user'>
    <!-- 栅格 -->
    <el-row class='operation' style='min-width:1600px;'>
      <el-form :inline="true" :model='userData' class="demo-form-inline">
      <!-- 输入框 -->
        <el-col :span="5">
            <el-form-item label="用户类型: " prop="pid">
              <el-select v-model="userData.userType" clearable placeholder="请选择">
                <el-option
                  v-for="item in userTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="内容类型: " prop="pid">
                <el-select v-model="userData.contentType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in contentTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="上传形式: " prop="pid">
                <el-select v-model="userData.uploadWay" clearable placeholder="请选择">
                  <el-option
                    v-for="item in uploadWays"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
        <el-col :span="8">
          <!-- 按钮 -->
          <el-button type="primary" size="medium"  @click='handleSearch'>查询</el-button>
          <el-button type="primary"  size="medium" @click="checkComment">查看评论</el-button>
          <el-button type="primary"  size="medium" @click="handleDelete">下线</el-button>
          <el-button type="primary"  size="medium" @click="relieveReport">解除举报</el-button>
        </el-col>
      </el-form>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
        @row-dblclick="showDetail">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户名" width="100"></el-table-column>
        <el-table-column label="用户类型" width="80">
          <template slot-scope="scope">
            {{scope.row.userType==1?'普通':'运营'}}
          </template>
        </el-table-column>
        <el-table-column prop="contentTitle" label="内容标题" width="150"></el-table-column>
        <el-table-column label="内容类型" width="80">
          <template slot-scope="scope">
            {{scope.row.contentType==1?'公共':'私人影集'}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :value="scope.row.status" disabled active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上传形式" width="100">
          <template slot-scope="scope">
            {{scope.row.uploadWay==1?'图片':'视频'}}
          </template>
        </el-table-column>
        <el-table-column prop="reportCount" label="被举报次数" width="100"></el-table-column>
        <el-table-column label="被举报比率(%)" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.visitCount!=0">{{((scope.row.reportCount/scope.row.visitCount)*100).toFixed(2)}}</span>
            <span v-else>{{scope.row.visitCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator" label="操作员" width="100"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userData.pageNo"
          :page-sizes="userData.pagesizes"
          :page-size="userData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {formatterDateTime} from '../../../js/util'
export default {
  name: 'reportContentList',
  data() {
    return {
      // 搜索框
      userData: {
        userType: '',
        contentType: '',
        uploadWay: '',
        pagesizes:[10,20,50],
        pageNo:1,
        pageSize:10
      },
      userTypes:[
        {
          value:'',
          label:'全部',
        },
        {
          value:1,
          label:'普通',
        },
        {
          value:2,
          label:'运营'
        }
      ],
      contentTypes:[
        {
          value:'',
          label:'全部',
        },
        {
          value:1,
          label:'公共',
        },
        {
          value:2,
          label:'私密'
        }
      ],
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
      // 表格信息
      tableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      showContentData:{},
      listArr:[],
      // 显示详情
      reportContentListDetailVisible:false,
      // 图片预览
      innerVisible:false,
    }
  },
  created() {
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.getUserData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        this.getUserData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      this.$router.replace('?page='+val);
      this.getUserData()
    },
    // 获取用户
    getUserData(flag) {
      if(flag){
        this.userData.pageNo = 1;
        this.$router.replace('?page=1');
      }
      this.$get('content-web/contentReport/pageList', this.userData).then(res => {
        if (res.code == '000000') {
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            if(v.status == 100){
              v.status = true;
              v.err = false;
            }else if(v.status == -100){
              v.status = false;
              v.err = false;
            }else{
              v.status = false;
              v.err = true;
            }
          });
          this.tableData = JSON.parse(JSON.stringify(res.data.rows));
          this.total = Number(res.data.total);
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        };
      })
    },
    // 查询
    handleSearch() {
      this.getUserData(1)
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 状态改变
    statechange(row){
      let status =0;
      if(row.status==true){
        status=100
      }else{
        status=-100
      };
      const data = {status:status,id:row.id}
      this.$post('content-web/contentReport/updateStatus',data).then(res=>{
        if(res.code !='000000'){
          this.$message({
            type: 'warning',
            message: res.message
          });
        }else{
          this.$message({
            type: 'success',
            message: res.message
          });
        }
      })
    },
    // 查看评论
    checkComment(){
        if(this.selectRows.length==0){
          this.$message({
            showClose: true,
            message: '请选择需要查看的用户',
            type: 'warning'
          });
          return
        }else if(this.selectRows.length>1){
          this.$message({
            showClose: true,
            message: '选择过多，当前仅支持查看单个用户',
            type: 'warning'
          });
          return
        }else{
          this.$router.push({
            path:'/modules/contents/reportContentList/contentComment.html',
            query:{
              content:this.selectRows[0].id,
              userId:this.selectRows[0].userId,
            }
          });
        }
    },
    // dialog展开播放视频
    dialogopen(){
      if(this.$refs.video){
        this.$refs.video.play();
      };
    },
    // dialog关闭停止视频
    destroyvideo(){
      if(this.$refs.video){
        this.$refs.video.pause();
        this.$refs.video.currentTime=0;
      }
    },
    // 显示详情
    showDetail(item){
      console.log(item)
      this.$post('content-web/contentReport/view',{
        id:item.id
      }).then(res=>{
        if(res.code =='000000'){
          console.log(res.data);
          if(res.data.uploadWay==1){
            let imgUrls = res.data.contentVideoUrl.split(',')
            res.data.imgUrls = imgUrls;
          };
          this.showContentData = res.data;
          this.reportContentListDetailVisible = true;
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
      
    },
    // 显示预览
    showDigPic(item){
      this.listArr = [item];
      this.innerVisible = true;
    },
    // 下线
    handleDelete(){
      if(this.selectRows.length==0){
        return this.$message({
          showClose: true,
          message: '请选择需要下线的数据',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectRows.length;i++){
          if(!this.selectRows[i].status){
            return this.$message({
              type: 'warning',
              message: "所选内容包含已被下线内容，需要移除已被下线内容再执行下线"
            });
          }
        };
        this.$confirm('是否确认执行下线?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let userIds =[];
          this.selectRows.forEach(v=>{
            userIds.push(v.id)
          });
          this.$post(`content-web/contentReport/onlineStatus`,{ids:userIds.join(","),status:110}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '下线成功!'
              });
              this.getUserData()
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
            message: '已取消下线'
          });          
        });
      }
    },
    // 解除举报
    relieveReport(){
      if(this.selectRows.length==0){
        return this.$message({
          showClose: true,
          message: '请选择需要解除举报的数据',
          type: 'warning'
        });
      }else{
        for(let i=0;i<this.selectRows.length;i++){
          if(this.selectRows[i].status){
            return this.$message({
              type: 'warning',
              message: "所选内容包含未被举报内容，需要移除未被举报内容后再执行解除举报"
            });
          }
        };
        this.$confirm('是否确认执行解除举报?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let userIds =[];
          this.selectRows.forEach(v=>{
            userIds.push(v.id)
          });
          this.$post(`content-web/contentReport/onlineStatus`,{ids:userIds.join(","),status:100}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '解除举报成功!'
              });
              this.getUserData()
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
            message: '已取消解除举报'
          });          
        });
      }
    }
  },
}
</script>
<style lang="scss">
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
.opendialog{
  .el-row{
    min-width: 100% !important;
  }
  .el-col-6{
    min-width: unset !important;
  }
  .grid-content{
    min-width: unset !important;
  }
  .imgbox{
    border-right:1px solid #ccc;
    text-align:left;
    line-height:10px;
    height: calc( 100% - 2px);
  }
  .videobox{
    border-right:1px solid #ccc;
    text-align:left;
    line-height:10px;
    height: 200px;
  }
}
</style>

