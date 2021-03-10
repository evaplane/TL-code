<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-09 10:44:06
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-26 11:30:18
 -->
<template>
  <div class="main">
    <div class="visitor-visitor">
      <div class="visitor-header">
        <div class="visitor-title">
          <span>在线访客</span>
          <span class="visitor-divider">|</span>
          <span class="visitor-info">{{tableData.length}}在线</span>
        </div>
        <!-- <div class="visitor-header-rightk">
          <a class="visitor-export-data">
            <i class="feature15-icons icon-share"></i>
            导出数据
          </a>
        </div> -->
      </div>
      <section class="visitors flex-table">
         <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              label="访客"
              width="300">
              <template slot-scope="scope">
                <div class="visitor-info flex10">
                  <i class="el-icon-time"></i>
                  <div class="info-right">
                    <div class="name" title="#12">{{ scope.row.clientChild }}</div>
                    <div class="other"><span title="IP : 113.104.213.77">{{ scope.row.clientIp }}</span></div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="clientBrowser"
              label="设备"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="来源">
            </el-table-column>
            <el-table-column
              prop="clientName"
              label="正在访问">
            </el-table-column>
            <el-table-column
              prop="usr"
              label="操作">
            </el-table-column>
          </el-table>
      </section>
    </div>
  </div>  
</template>
<script>
export default {
  data() {
        return {
          tableData: []
        }
  },
  methods:{
    /**
     * 数据加载
     */
    loading(){
      let that = this;
      this.$axios.get(this.$httpServer.getOnlineClientInfo+"?seatsId="+JSON.parse(sessionStorage.getItem('userInfo')).user_id).then((res)=>{
        that.tableData = [];
        res.data.data.records.map((v,i)=>{
          let newData = {
            clientChild:'',
            clientIp:v.clientIp,
            clientBrowser:v.clientPlatform,
            address:v.clientBrowser,
            clientName:v.clientName == null?'':v.clientName,
            usr:'对话中'
          }
          that.tableData.push(newData)
        })
      })
    }
  },
  mounted(){
    this.loading();
  }
}
</script>
<style scoped>
.main{
    position: relative;
    height: 100%;
    min-height: 100%;
    min-width: 1200px;
    margin-left: 70px;
    background-color: #f2f3f5;
}
.main .visitor-visitor{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.main .visitor-visitor .visitor-header{
    display: flex;
    /* height: 60px; */
    padding: 15px 30px;
    background-color: #fff;
    border-bottom: 1px solid #e0e1e3;
    justify-content: space-between;
}
.visitor-title{
    width: 150px;
    font-size: 16px;
    color: #323c42;
    line-height: 30px;
}
.visitor-title span{
  float: left;
}
.visitor-title .visitor-divider{
    font-size: 13px;
    color: #f0f0f0;
    display: inline-block;
    margin: 0 5px;
}
.visitor-title .visitor-info{
    font-size: 13px;
    color: #767d85;
}
.visitor-export-data{
    display: inline-block;
    margin-left: 20px;
    line-height: 30px;
    font-size: 13px;
    color: #009de7;
    text-decoration: none;
}
.visitors{
    color: #c7cac9;
    display: block;
    -ms-flex-direction: column;
    flex-direction: column;
    background-color: #fff;
    margin: 20px;
    -ms-flex: 1;
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    padding: 15px;
}
.visitor-info{
    position: relative;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-pack: center;
    justify-content: center;
    font-size: 13px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    flex: 10;
}
.visitor-info .el-icon-time{
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    margin: auto 0;
    border-radius: 16px;
    font-size: 18px;
}
.info-right{
    width: 100%;
    text-align: left;
    padding: 10px 10px 10px 74px;
}
.info-right .name{
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    padding-right: 5px;
    -ms-flex-item-align: start;
    align-self: flex-start;
    color: #5a6978;
    font-size: 14px;
    margin-bottom: 4px;
}
.other{
     word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    padding-right: 5px;
    -ms-flex-item-align: start;
    align-self: flex-start;
        color: #767d85;
    font-size: 12px;
    font-weight: 200;
}
</style>
