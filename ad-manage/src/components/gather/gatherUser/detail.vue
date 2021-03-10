<template>
  <div class='user'>
     <!-- 内容 -->
    <div class="content" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;padding-left:10px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>关注详情</div></el-col>
        </el-row>
        <!-- 栅格 -->
        <el-row class='operation' style="margin-bottom:10px;">
          <!-- 输入框 -->
          <el-col :span="5">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="用户ID:">
                <el-input placeholder="请输入用户ID" v-model="gatherUserDetailData.fansId" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="昵称:">
                <el-input placeholder="请输入昵称" v-model="gatherUserDetailData.fansUserName" clearable></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <!-- 按钮 -->
            <el-button type="primary" size="medium"  @click='handleSearch'>查询</el-button>
          </el-col>
        </el-row>
        <!-- 内容 -->
        <div class='content'>
            <!-- 表格 -->
          <el-table ref="multipleTable" border :data="gatherUserDetailTableData" tooltip-effect="dark" style="width: 100%" >
            <el-table-column type="selection" width="80"></el-table-column>
            <el-table-column type="index" label="序号" width="100">
              <template slot-scope="scope">
                <span>{{(gatherUserDetailData.pageNo - 1) * gatherUserDetailData.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fansId" label="用户ID" width="300"></el-table-column>
            <el-table-column prop="fansUserName" label="昵称" width="300"></el-table-column>
            <el-table-column prop="status" label="状态" width="200">
              <template slot-scope="scope">
                <switchItem :val="scope.row.status" :id="scope.row.id" :reqUrl="'common-web/collectUserFans/updateStatus'" @result="getGatherUserDetailData"></switchItem>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最近更新时间" width="300"></el-table-column>
            <el-table-column prop="updateUser" label="操作员" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              v-show="showPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="getGatherUserDetailData.pageNo"
              :page-sizes="pageSizes"
              :page-size="getGatherUserDetailData.pageSize"
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
</template>

<script>
import {formatterDateTime,delSelectTag} from '../../../js/util'
import loginVue from '../../login/login.vue';
import switchItem from '../../common/switchItem'
export default {
  name: 'gatherUserDetail',
  data() {
    return {
      // 搜索框
      gatherUserDetailData: {
        userId: '',
        fansId:'',
        fansUserName:'',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      gatherUserDetailTableData: [],
      // 总条数
      total:0,
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false
    }
  },
  created() {
    let v = this.$store.state.tagsview.visitedviews.filter(v=>{
      if(v.path == this.$route.path){
        return v
      }
    })
    this.getGatherUserDetailData();
    this.gatherUserDetailData.userId = v[0].query.userId;
  },
  components:{
    switchItem
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.gatherUserDetailData.pageSize = val
        this.getGatherUserDetailData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.gatherUserDetailData.pageNo= val;
      this.getGatherUserDetailData()
    },
    // 获取用户
    getGatherUserDetailData(type) {
      if(type){
        this.gatherUserDetailData.pageNo=1
      }
      this.gatherUserDetailData.userId = this.gatherUserDetailData.userId.trim()
      this.gatherUserDetailData.fansUserName = this.gatherUserDetailData.fansUserName.trim()
      this.gatherUserDetailData.fansId = this.gatherUserDetailData.fansId.trim()
      this.$post('common-web/collectUserFans/fansDetail', this.gatherUserDetailData).then(res => {
        if (res.code == '000000') {
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.gatherUserDetailTableData = res.data.rows
          this.total = res.data.total
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>50){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          }
        }
      })
    },
    // 查询
    handleSearch() {
      this.getGatherUserDetailData(1)
    },
    // 返回首页
    backToGatherUser(){
      delSelectTag(this.$route);
      this.$router.history.go(-1);
    },
    // 状态改变
    statechange(row){
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('common-web/collectUserFans/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getGatherUserDetailData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style style="scss">
</style>

