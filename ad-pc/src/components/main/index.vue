<template>
  <div class="maindom">
    <div class="container">
      <div class="infinite-list-wrapper" v-if="!loaderror" style="overflow-y:auto;overflow-x:hidden">
        <!-- <el-row class="conbody"> -->
        <el-row class="conbody" type="flex" v-for="(list,i) in listData" :key="i">
          <el-col :span="8" style="max-width:380px;max-height:460px;" v-for="(item, index) in list" :key="index">
            <userInfoCard  v-if="item" :userInfo="item" :showTitle="true" :index="index" @dialogCheck="dialogCheck" @toUserHome="toUserHome"></userInfoCard>
          </el-col>
        </el-row>
      </div>
      <div class="infinite-list-wrapper error" v-else style="overflow-y:auto;overflow-x:hidden;">
        <div style="text-align:center;margin:auto;">
          <p style="margin:150px auto 0;width:448px;height:90px;font-size:64px;font-weight:600;color:rgba(48,44,72,1);line-height:90px;">无法访问此网站</p>
          <p style="margin:0px auto;font-size:21px;line-height:24px;font-weight:400;line-height:53px;color:rgba(98,97,107,1);">请试试以下方法：</p>
          <p style="margin:0px auto;font-size:21px;line-height:24px;font-weight:400;line-height:53px;color:rgba(98,97,107,1);">·检查网络连接</p>
          <p style="margin:0 auto;font-size:21px;line-height:24px;font-weight:400;line-height:53px;color:rgba(98,97,107,1);">·检查代理服务器和防火墙</p>
          <p style="width:180px;height:60px;background:rgba(249,34,85,1);border-radius:30px;margin:20px auto 0;">
            <a style="color:#fff;font-size:20px;line-height:60px;text-decoration:none;" href="javascript:window.location.reload()">点击重试</a>
          </p>
        </div>
      </div>
    </div>
    <el-backtop :bottom="100">
      <div
        style="{
          height: 100%;
          width: 100%;
          background-color: #f2f5f6;
          box-shadow: 0 0 6px rgba(0,0,0, .12);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        }"
      >UP</div>
    </el-backtop>
    <div class="leftadvert" v-if="advtLists.length>0">
      <div v-for="(item,index) in advtLists" :key="index">
        <advert  style="max-height:300px;overflow:hidden;margin-bottom:10px;" :vertData='item' v-if="index % 2 == 0"></advert>
      </div>
    </div>
    <div class="rightadvert" v-if="advtLists.length>0">
      <div v-for="(item,index) in advtLists" :key="index" @click="onAdvertClick(item)">
        <advert  style="max-height:300px;overflow:hidden;margin-bottom:10px;" :vertData='item' v-if="index % 2 == 1"></advert>
      </div>
    </div>
    <p v-if="!hasNextPage" style="height:40px;font-size:18px;color:#000;font-weight:bloder;text-align:center;line-height:40px;margin-bottom:30px;">已经到底了，亲</p>
    <!-- 分享弹窗 -->
    <shareDialog :dialogShareVisible="dialogShareTableTableVisible" @changeShareTable="closeShareDialog"></shareDialog>
    <!-- 详情弹窗 -->
    <msgDialog :dialogTableVisible="dialogTableVisible" @changeDialogTableVisible="closeMsgDialog" @showShare="showShare"></msgDialog>
  </div>
</template>

<script>
import userInfoCard from './userInfoCard'
import msgDialog from './msgDialog'
import shareDialog from './shareDialog'
import advert from './advert'
import {mapActions} from 'vuex'
export default {
  name: "maindom",
  data() {
    return {
      dialogShareTableTableVisible:false,
      dialogTableVisible: false,
      hasNextPage:true,
      loaderror:false,
      pageData:{
        pageSize:12,
        id:-1
      },
      deptTableData: [],
      advtLists:[],
      headerSweper:{
        type:null,
        array:[]
      },
      rightSweper:{
        type:null,
        array:[]
      },
      leftSweper:{
        type:null,
        array:[]
      },
      isIE:false
    };
  },
  components: {
    userInfoCard,
    msgDialog,
    shareDialog,
    advert
  },
  created() {
    if(this.$store.state.userId){
      this.getVideos();
    };
    this.getadvert();
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      this.isIE = true;
    }
  },
  computed:{
    listData(){
      var result = [];
      for(var i=0;i<this.deptTableData.length;i+=3){
          result.push(this.deptTableData.slice(i,i+3));
      }
      return result;
    }
  },
  mounted() {
    this.scroll();
  
  },
  methods: {
    //在这里引入 action 里的方法，使用方法和 methods 里的其他方法一样
    ...mapActions([
        'updateIndexMsgData'
    ]),
    // 跳转到其他用户地址
    toUserHome(id){
      this.$router.push('/user?id='+id);
    },
    
    // 用户卡通知 打开弹窗
    dialogCheck(item) {
      this.updateIndexMsgData({
        "contentId": item.id,
        "userId": item.userId
      }).then((res)=>{
        if(res){
          this.dialogTableVisible = true;
        };
      });
    },
    // 控制详情弹窗
    closeMsgDialog(bool){
      this.dialogTableVisible = bool;
    },
    // 控制分享弹窗
    closeShareDialog(bool){
      this.dialogShareTableTableVisible = bool;
    },
    // 展示二维码
    showShare(){
      this.closeShareDialog(true);
    },
    // 获取展示数据
    getVideos() {
      if(!this.hasNextPage)return new Promise(function (resolve) {resolve()});
      return this.$get('external-web/content/recommend',this.pageData).then(res => {
        if(res.code == "000000"){
          this.deptTableData = this.deptTableData.concat(res.data.rows);
          if(res.data.rows.length == this.pageData.pageSize){
            this.hasNextPage =true;
          }else{
            this.hasNextPage = false;
          };
          if(res.data.rows.length > 0){
            this.pageData.id = res.data.rows[res.data.rows.length-1].id;
          };
        }else{
          this.$message({
            type: 'warning',
            message: '当前网络异常，请稍后再试'
          });
          this.loaderror = true;
        }
        return;
      }).catch(error => {
        this.$message({
          type: 'error',
          message: '当前网络异常，请稍后再试'
        });
        this.loaderror = true;
      });
    },
    scroll() {
      let isLoading = false
      window.onscroll = () => {
        // 距离底部200px时加载一次
        let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200
        if (bottomOfWindow && isLoading == false) {
          isLoading = true
          this.getVideos().then(() => {
            isLoading = false
          });
          return;
        }
      }
    },
    getadvert(){
      this.$get('external-web/advertisement/getAllAdvert?categoryValue=webPageAd').then(res => {
        if(res.code == "000000"){
          if(res.data.length > 0){
            this.advtLists = res.data;
          };
        }
        return;
      });
    },
    onAdvertClick(item){
      this.$post('external-web/commonPoint/advertPoint',JSON.stringify([{
        advtName:item.advtName,
        categoryName:item.categoryName,
        count:1,
        platform:3,
        pointTime:Math.round(new Date()),
        version:'1.0.0_web'
      }]));
      window.open(item.redirectUrl);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.maindom{
  text-align: center;
  margin:80px auto 0;
  max-width: 500px;
  color: #2c3e50;
  .infinite-list-wrapper{
    padding-top:10px;
    min-height: 740px;
  }
  .error{
    background-image: url('../../assets/Artwork@2x.png');
    background-size: cover; 
    background-repeat: no-repeat;
  }
  .conbody .el-col{
    margin-bottom:10px;
  }
  .conbody .el-col:nth-child(3n+2){
    margin:0 30px 0;
  }
  .leftadvert{
    position: fixed;
    top:230px;
    width:200px;
    z-index: 1000;
  }
  .rightadvert{
    position: fixed;
    top:230px;
    width:200px;
    z-index: 1000;
  }
}
@media (min-width: 0px){
  .maindom{
    max-width: 700px;
  }
  .leftadvert{
    left:30px;
  }
  .rightadvert{
    right:30px;
  }
} /*>=1024的设备*/

@media (min-width: 1100px) {
  .maindom{
    max-width: 900px;
  }
  .leftadvert{
    left:100px;
  }
  .rightadvert{
    right:100px;
  }
} /*>=1100的设备*/
@media (min-width: 1280px) {
  .maindom{
    max-width: 1200px;
  }
  .leftadvert{
    left:140px;
  }
  .rightadvert{
    right:140px;
  }
} /*>=1280的设备*/
</style>
