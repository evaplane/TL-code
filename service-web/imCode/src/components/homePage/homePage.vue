<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-18 20:50:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-29 17:04:32
 -->
<template>
  <div class="home">
    <div class="header">
      <div class="tilte">你好, {{userInfo.username}}</div>
      <div class="time">
        <el-button-group>
          <el-button :class="{active: num == 0}" @click="toDayData('0')">今天</el-button>
          <!-- type="primary" -->
          <el-button :class="{active: num == 1}" @click="toDayData('1')">昨天</el-button>
          <el-button :class="{active: num == 8}" @click="toDayData('8')">过去7天</el-button>
          <el-button :class="{active: num == 31}" @click="toDayData('31')">过去30天</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="conter">
      <el-table :data="tableData" @cell-mouse-enter="hoverTable" @cell-mouse-leave="leaveTable">
        <el-table-column prop="index" label="#" width></el-table-column>
        <el-table-column label="客服" width="300">
          <template slot-scope="scope" >
            <div class="changClass">
              <div>
                <i class="customerServiceStatus" :class=" scope.row.serviceStatus === 0 ? 'online' : scope.row.serviceStatus === 1 ? 'invisible' : 'offline' "></i>
                <img />
                <span>{{ scope.row.name }}</span>
              </div>
              <div class="changClassRight" v-if="showStatus == scope.row.seatsId">
                <div>
                  <span class="statusClass" v-if="scope.row.serviceStatus == 0"  @click="changeCheckStatus(scope.$index,scope.row.seatsId,scope.row.serviceStatus)">设为{{ scope.row.serviceStatus === 0?'隐身':'在线' }}</span>
                </div>
                <div>
                  <span class="statusClass"  v-if="scope.row.serviceStatus != 2" @click="changeCheckStatus(scope.$index,scope.row.seatsId,'2')">强制{{ scope.row.serviceStatus != 2?'下线':'' }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sum" label="对话量" width></el-table-column>
        <el-table-column prop="mes" label="消息数" width></el-table-column>
        <el-table-column prop="avgTime" label="平均对话持续时长" width></el-table-column>
        <el-table-column prop="firstResponse" label="平均首次响应时长" width></el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="dialogVisible" width="20%">
      <span v-if="statusSession == 2" >该客服所有进行中的对话将被强制打断</span>
      <span v-else>设为隐身后, 该客服将不会被分配新的对话</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="endSession">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      num: 0,
      showStatus:-1 , //需要显示的按钮
      dialogVisible: false,
      opt:{},
      statusSession:-1,
    };
  },
  computed: {
      userInfo() {
        return this.$store.imServerStore.state.userInfo;
      }
    },
  methods: {
    /**
     * 鼠标hover
     */
    hoverTable(row,column){
      this.showStatus = row.seatsId;
    },
    /**
     * 鼠标移除事件
     */
    leaveTable(){
      this.showStatus = -1;
    },
    /**
     * 下线
     */
    insertWinding(index,id,status){
      let that = this;
      this.$axios.get(this.$httpServer.logoutDelToken+"/"+id).then((res)=>{
        if(res){
          this.$message1({
            type: "success",
            message: "客服登出成功",
            showClose: true
          });
          that.tableData[index].serviceStatus = status;
          // 如果修改的坐席是当前登录账号，则重新加载权限接口
          if(id == that.userInfo.userId){
            that.$store.imServerStore.dispatch('getUserInfo');
          }
          that.dialogVisible = false;
        }
      })
    },
    /**
     * 改变状态
     */
    changeStatus(index,id,status){
      let that = this;
      this.$axios.get(this.$httpServer.modifyOnlineOrInvisible+"?seatsId="+id+"&seatStatus="+status).then((res)=>{
        if(res){
          this.$message1({
            type: "success",
            message: "修改客服状态成功",
            showClose: true
          });
          that.tableData[index].serviceStatus = status;
          // 如果修改的坐席是当前登录账号，则重新加载权限接口
          if(id == that.userInfo.userId){
            that.$store.imServerStore.dispatch('getUserInfo');
          }
        }
      })
    },
    /**
     * 在线转离线 、 在线转下线
     */
    endSession(){
      if(this.opt.status == 2){
        this.insertWinding(this.opt.index,this.opt.id,this.opt.status);
      }else{
        this.changeStatus(this.opt.index,this.opt.id,this.opt.status);
      }
      
      this.dialogVisible = false;
    },
    /**
     * 改变状态
     */
    changeCheckStatus(index,id,status){
      let that = this;
      // 2：下线
      if(status == 2){
        status = 2;
        this.statusSession = 2;
      }else{
        status = status===0 ? 1 : 0; // 0:在线 1:隐身
        this.statusSession = status;
      }
      // 在线转隐身、在线转下线
      if(status == 1 || status == 2){
        that.dialogVisible = true;
        that.opt = {
          index:index,
          id:id,
          status:status
        };
        return false;
      }
      that.changeStatus(index,id,status);
    },
    /**
     * 数据加载
     */
    loading(num) {
      this.num = num;
      let that = this;
      let beginDate = this.$ak.Utils.getNowFormatDateYMD(num);
      let endData = this.$ak.Utils.getNowFormatDateEndYMD(num - 1 >= 0 ? 1 : 0);
      let seatsGroupId = that.userInfo.roles[0] == 1 ? '':that.userInfo.deptId;
      this.$axios
        .get(
          this.$httpServer.getIndexQueryInfoBySeatsId +
            "?seatsGroupId=" + seatsGroupId +
            "&beginDate=" +
            beginDate +
            "&endDate=" +
            endData
        )
        .then(res => {
          that.tableData = [];
          res.data.data.map((v, i) => {
            let newData = {
              index: i + 1,
              name: v.seatsName,
              sum: v.trackNum == null || v.trackNum == "" ? 0 : v.trackNum,
              mes:
                v.messageNum == null || v.messageNum == "" ? 0 : v.messageNum,
              avgTime:
                v.avgDialogueTime == null || v.avgDialogueTime == ""
                  ? "少于1秒"
                  : that.$ak.Utils.timeStamp(v.avgDialogueTime),
              firstResponse:
                v.avgFirstResponseTime == null || v.avgFirstResponseTime == ""
                  ? "少于1秒"
				  : that.$ak.Utils.timeStamp(v.avgFirstResponseTime),
              serviceStatus: v.serviceStatus,
              seatsId:v.seatsId
            };
            that.tableData.push(newData);
          });
        });
    },
    /**
     * 数据
     */
    toDayData(num) {
      this.loading(num);
    }
  },
  watch: {
	  '$store.imServerStore.state.userInfo.serviceStatus'(){
		  this.loading(this.num)
	  }
  },
  mounted() {
    this.loading("0");
  }
};
</script>
<style scoped>
.home {
  width: calc(100% - 70px);
  height: 100%;
  margin-left: 70px;
  background-color: #f2f3f5;
}
.header {
  line-height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e0e1e3;
}
.header > .tilte {
  font-weight: 700;
  font-size: 16px;
  color: #323c42;
  padding-left: 30px;
}
.header > .time {
  padding-right: 30px;
}
.header > .time > .el-button-group > .el-button:hover,
.header > .time > .el-button-group > .el-button.active{
  background-color: #009de7;
  color: #fff;
}
.header > .time > .el-button-group > .el-button {
  color: #009de7;
  padding: 8px 15px !important;
  border: 1px solid #009de7 !important;
}
.conter {
  margin: 20px;
  padding: 0 20px;
  height: calc(100% - 110px);
  background-color: #fff;
      overflow-y: auto;
}
.conter .customerServiceStatus {
  display: inline-block;
  margin: auto 10px auto 0;
  width: 6px;
  height: 6px;
  border-radius: 3px;
}
.conter  .statusClass{
      color: #009de7;
      margin-left: 8PX;
      cursor: pointer;
}
.conter .customerServiceStatus.online{
	background-color: #30cc80; /* 在线样式 #30cc80 */
}
.conter .customerServiceStatus.invisible{
	background-color: #ff5c5e; /* 隐身样式 ##ff5c5e */
}
.conter .customerServiceStatus.offline{
	background-color: #9e9e9e; /* 离线样式 #9e9e9e */
}
.cell .changClass{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cell .changClass .changClassRight{
  padding-right: 10px;
  font-size: 12px;
  font-weight: 500;
}

</style>


