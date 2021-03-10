<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-12 15:25:39
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-22 16:30:31
 -->
<template>
  <div>
    <el-popover
      placement="bottom"
      height:0
      trigger="click">
      <div class="agent-single-selector">
          <div class="agent-single-selector-shadowPanel">
              <div class="agent-single-selector-searchWrap">
                  <i class="el-icon el-icon-search"></i>
                  <input class="stop" placeholder="搜索客服 ..." v-model="searchCustomer">
              </div>
              <el-table
              v-if="seatTableData.length>0"
                :data="tables"
                @row-click="changeOver"
                style="width: 100%"
                >
                <el-table-column
                min-width="150"
                  prop="name"
                  label=""
                >
                </el-table-column>
              </el-table>
              <div v-else class="agent-single-selector-placeholder">
                  无客服
              </div>
          </div>
      </div>
      <span slot="reference"><i class="iconfont-main icon-transfer" @click="transfer()"></i>转接</span>
  </el-popover>
  </div>
</template>
<script>
export default {
  props:{
    seatTableData:{
      required: true,
      type: Array ,
      default: []
    }
  },
  data(){
    return{
      searchCustomer:'',
    }
  },
  computed:{
      tables:function(){
        var search=this.searchCustomer;
        if(search){
          return  this.$parent.$data.seatTableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.$parent.$data.seatTableData
      },
      userInfo() {
          return this.$store.imServerStore.state.userInfo;
      }
    },
  created(){
    this.loadAllData();
  },
  methods:{
    /**
     * 获取所有坐席
     */
    loadAllData(){

    },
    transfer(){

    },
    /**
     * 排队变更状态
     */
    queueChatEnlistFun() {
        let that = this;
        if(that.userInfo.serviceStatus != 0){
          return;
        }
        let currentChatData =
            that.$store.imServerStore.getters.currentChatEnlist;
        let isFirst = true;
        let clientIdFirst = "";
        if (currentChatData != null) {
            currentChatData.map((v, i) => {
                if (isFirst && v.contentType == 8) {
                    clientIdFirst = v.sender;
                    isFirst = false;
                }
            });
            if (!isFirst) {
                that.$axios
                    .get(
                        that.$httpServer.lineUpTurnDialogue +
                            "?clientId=" +
                            clientIdFirst +
                            "&seatsId=" +
                            JSON.parse(sessionStorage.getItem("userInfo"))
                                .user_id
                    )
                    .then(res => {
                        // 可能存在异步操作list,需重新执行
                        currentChatData.map((v, i) => {
                            if (v.sender == clientIdFirst) {
                                currentChatData[i].contentType = 3;
                            }
                        });
                    });
            }
        }
    },
    changeOver(row,index,e){
      let that = this;
      this.$confirm('是否转接给坐席：'+row.name+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          let clientData = that.$store.imServerStore.getters.selectedChatEn; // 对话数据
          if(that.$store.imServerStore.getters.selectedChatEn.state == "off"){
            this.$message1({
                type: 'error',
                message: '当前会话已离线，不允许转接!'
            });
            return;
          }
            let sessData = JSON.parse(sessionStorage.getItem("userInfo")); // 登录数据
            // let opt = {
            //   clientId:clientData.sender, // 访客ID
            //   seatsId:sessData.user_id,  //当前ID
            //   trackId:clientData.trackid, //会话ID
            //   transferSeatsId:row.seatsId, //转接ID
            // }
            that.$axios.get(that.$httpServer.transfer+"?clientId="+clientData.sender+"&seatsId="+sessData.user_id+"&trackId="+clientData.trackid+"&transferSeatsId="+row.seatsId+"&transferSeatsName="+row.name+"&seatsGroupId="+this.userInfo.deptId).then((res)=>{
              // 转接成功删除当前会话
              if(res){
                let sessionValue = that.$store.imServerStore.state.currentChatEnlist; //当前会话数据
              sessionValue.map((v,i)=>{
                if(v.sender == clientData.sender){
                  that.$store.imServerStore.state.currentChatEnlist.splice(i,1);
                }
              })
              that.queueChatEnlistFun();
              // 清空当前会话
              this.$message1({
                type: 'success',
                message: '转接成功!'
              });
              that.$store.imServerStore.state.selectedChatEn = null;
              }
            })
          

        }).catch(() => {
          // this.$message1({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    }
  }
}
</script>
<style scoped>
.agent-single-selector .agent-single-selector-shadowPanel{
    padding: 3px 0;
    min-width: 160px;
    text-align: left;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(52,63,75,.25);
}
.agent-single-selector .agent-single-selector-shadowPanel .agent-single-selector-searchWrap{
    position: relative;
    border-bottom: 1px solid rgba(0,0,0,.06);
}
.agent-single-selector-searchWrap .el-icon{
    position: absolute;
    color: #969faa;
    left: 10px;
    top: 12px;
    font-size: 17px;
    margin-right: 8px;
    vertical-align: text-bottom;
}
.agent-single-selector-searchWrap input{
    color: #969faa;
    height: 40px;
    border: none;
    padding-left: 30px;
}
.agent-single-selector-shadowPanel .agent-single-selector-placeholder{
    text-align: center;
    color: #999;
    list-style: none;
    padding: 10px 0;
}

</style>
