<template>
  <div class="user">
    <div v-if="!loaderror">
      <div class="header" v-if="baseUserPage">
        <div class="headimg">
          <img :src="baseUserPage.userPic||baseUrl" alt="">
        </div>
        <div class="userinfo">
          <p style="height:35px;">
            <span v-html="returnEmoji(baseUserPage.nickName)||'无名'"></span>
            <img class="img" v-show="baseUserPage.sex == 2" src="../../assets/girl@2x.png" alt="">
            <img class="img" v-show="baseUserPage.sex == 1" style="width:21px;height:21px;" src="../../assets/boy@2x.png" alt="">
            <span class="changemsg" @click="showShare" v-show="list.length > 1">修改资料</span>
          </p>
          <p class="desc" v-html="returnEmoji(baseUserPage.userSign)||'当前未设置签名'"></p>
        </div>
        <div class="infonumber">
          <el-col :span="12" style="boder-right:1px solid background:rgba(230,230,230,1);">
            <p @click="showShare" v-if="baseUserPage.fansNum&&baseUserPage.fansNum > 0">{{$numberFormatter(baseUserPage.fansNum)}}</p>
            <p @click="showShare" v-else>0</p>
            <div  @click="showShare" class="exshow">粉丝</div>
          </el-col>
          <el-col :span="12">
            <p @click="showShare" v-if="baseUserPage.attNum&&baseUserPage.attNum > 0">{{$numberFormatter(baseUserPage.attNum)}}</p>
            <p @click="showShare" v-else>0</p>
            <div @click="showShare" class="exshow">关注</div>
          </el-col>
        </div>
        <div class="footnav">
          <ul>
            <li v-for="item in list" :key="item.id" :class="activeIndex == item.id ? 'isactive':''" @click="handleSelect(item.id)">{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="body">
        <el-row class="conbody" v-if="listData.length>0">
          <!-- <el-col style="width:380px;height:460px;" v-for="(item, index) in deptTableData" :key="index">
            <userInfoCard :userInfo="item" :index="index" @dialogCheck="dialogCheck"></userInfoCard>
          </el-col> -->
          <el-row class="conbody" type="flex" v-for="(list,i) in listData" :key="i">
            <el-col :span="8" style="max-width:380px;max-height:460px;" v-for="(item, index) in list" :key="index">
              <userInfoCard  v-if="item" :userInfo="item" :index="index" :showTitle="showTitle" @dialogCheck="dialogCheck"></userInfoCard>
            </el-col>
          </el-row>
          <p v-if="!hasNextPage&&listData.length>0" style="height:40px;font-size:18px;color:#000;font-weight:bloder;text-align:center;line-height:40px;margin-bottom:30px;">已经到底了，亲</p>
        </el-row>
        <div v-else style="padding:200px;">
          <p>当前没有任何作品哦</p>
        </div>
      </div>
    </div>
    <div class="error" v-else style="overflow-y:auto;overflow-x:hidden;">
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
    <div class="leftadvert" v-if="advtLists.length>0">
      <div v-for="(item,index) in advtLists" :key="index" @click="onAdvertClick(item)">
        <advert  style="max-height:300px;overflow:hidden;margin-bottom:10px;" :vertData='item' v-if="index % 2 == 0"></advert>
      </div>
    </div>
    <div class="rightadvert" v-if="advtLists.length>0">
      <div v-for="(item,index) in advtLists" :key="index" @click="onAdvertClick(item)">
        <advert  style="max-height:300px;overflow:hidden;margin-bottom:10px;" :vertData='item' v-if="index % 2 == 1"></advert>
      </div>
    </div>
    <!-- 分享弹窗 -->
    <shareDialog :dialogShareVisible="dialogShareTableTableVisible" @changeShareTable="closeShareDialog"></shareDialog>
    <!-- 详情弹窗 -->
    <msgDialog :dialogTableVisible="dialogTableVisible" :swpierData="swpierData" @changeDialogTableVisible="closeMsgDialog" @showShare="showShare"></msgDialog>
  </div>
</template>

<script>
import userInfoCard from './userInfoCard'
import msgDialog from './msgDialog'
import shareDialog from './shareDialog'
import advert from './advert'
import {mapActions} from 'vuex'
  export default {
    name: "user",
    data () {
      return {
        baseUrl:require("../../assets/07.jpg"),
        activeIndex:0,
        userId:null,
        loaderror:false,
        showTitle:false,
        userData:{},
        hasNextPage:true,
        baseUserPage:null,
        lockList:false,
        dialogTableVisible:false,
        dialogShareTableTableVisible:false,
        pageData:{
          id:-1,
          pageSize:9,
          userId:this.userId
        },
        swpierData: [],
        list:[{
          id:0,
          url:'external-web/content/search',
          name:'作品'
        }],
        navarray:[
          {
            id:0,
            url:'external-web/content/myContentList',
            name:'作品'
          },
          {
            id:1,
            url:'external-web/content/praiseList',
            name:'喜欢'
          },
        ],
        othernav:[
          {
            id:0,
            url:'external-web/content/search',
            name:'作品'
          }
        ],
        deptTableData: [],
        advtLists:[],
        isIE:false,
      }
    },
    components: {
      userInfoCard,
      msgDialog,
      shareDialog,
      advert
    },
    beforeRouteUpdate(to, from, next) {
      this.updateList(to.query.id);
      this.getUserPage();
      next();
    },
    created(){
      this.updateList(this.$route.query.id);
      this.getUserPage();
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
      this.scroll()
    },
    methods: {
      //在这里引入 action 里的方法，使用方法和 methods 里的其他方法一样
      ...mapActions([
          'updateIndexMsgData'
      ]),
      handleSelect(id){
        if(this.activeIndex!=id){
          if(id == 1){
            this.showTitle = true;
          }else{
            this.showTitle = false;
          };
          this.hasNextPage = true;
          this.pageData.id = -1;
          this.activeIndex = id;
          this.deptTableData = [];
          this.getList();
        }
        return;
      },
      makeUserId(id){
        if(id){
          this.userId = id;
          this.hasNextPage = true;
        }else{
          this.userId = this.$store.state.userId;
          this.hasNextPage = true;
        }
      },
      getUserBasicInfo(){
        this.$get('external-web/basic/findUserDetail',{
          userId:this.userId
        }).then(res => {
          if(res.code == "000000"){
            this.baseUserData = res.data;
          }else{
            this.$message({
              type: 'warning',
              message: '当前网络异常，请稍后再试'
            });
          }
          return;
        }).catch(error => {
            this.$message({
              type: 'error',
              message: '当前网络异常，请稍后再试'
            });
        });
      },
      getUserPage(){
        this.lockList = true;
        this.deptTableData = [];
        this.$get('external-web/basic/findUserBasicInfo',{
          userId:this.userId
        }).then(res => {
          if(res.code == "000000"){
            this.baseUserPage = res.data;
            this.getList();
          }else{
            this.lockList = false;
            this.loaderror = true;
            this.$message({
              type: 'warning',
              message: '当前网络异常，请稍后再试'
            });
          }
          return;
        }).catch(error => {
          this.loaderror = true;
          this.lockList = false;
            this.$message({
              type: 'error',
              message: '当前网络异常，请稍后再试'
            });
        });
      },
      returnEmoji(value){
        value = value.replace(/<e:(.*?)>/g,function(){
            return eval("'" + arguments[1] + "'");
        });
        return this.$emoji.parse(value);
      },
      // 获取数据
      getList(){
        if(!this.hasNextPage){
          return new Promise(function(resolve){
              resolve();
          });
        };
        var sendObj = Object.assign({},this.pageData);
        sendObj.userId = this.userId;
        if(this.activeIndex == 0){
          sendObj.auditStatus = null;
          sendObj.status  = null;
        }else if(this.activeIndex == 1){
          sendObj.praiseType = 1;
        }
        let url = this.list[this.activeIndex].url;
        return this.$post(url,sendObj).then(res => {
          this.lockList = false;
          if(res.code == "000000"){
            this.deptTableData = this.deptTableData.concat(res.data.rows);
            if(res.data.rows.length == this.pageData.pageSize){
              this.hasNextPage = true;
            }else{
              this.hasNextPage = false;
            };
            if(res.data.rows.length > 0){
              if(this.activeIndex == 0){
                this.pageData.id = res.data.rows[res.data.rows.length-1].id;
              }else if(this.activeIndex == 1){
                this.pageData.id = res.data.rows[res.data.rows.length-1].contentPraiseDataId;
              };
            };
          }else{
            this.$message({
              type: 'warning',
              message: '当前网络异常，请稍后再试'
            });
          };
          return res.data;
        }).catch(error => {
          this.lockList = false;
            this.$message({
              type: 'error',
              message: '当前网络异常，请稍后再试'
            });
        });
      },
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
          if(res.data.auditStatus > 1){
            this.$alert("审核未通过："+res.data.auditMsg, '警告', {
              confirmButtonText: '确定',
              type:'error'
            });
          }else{
            this.dialogTableVisible = true;
          };
          // 
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
        this.closeMsgDialog(false);
        this.closeShareDialog(true);
      },
      updateList(id){
        this.activeIndex = 0;
        if(id && id != this.$store.state.userId){
          this.list.splice(0);
          this.list.push(this.othernav[0]);
          this.pageData = {
            id:-1,
            pageSize:9,
            userId:this.userId
          };
          this.deptTableData = [];
        }else{
          this.list.splice(0);
          this.list.push(...this.navarray);
          this.pageData = {
            id:-1,
            pageSize:9,
            userId:this.userId
          };
          this.deptTableData = [];
        };
        this.makeUserId(id);
      },
      scroll() {
        let isLoading = false
        window.onscroll = () => {
          // 距离底部200px时加载一次
          let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200
          if (bottomOfWindow && isLoading == false) {
            if(this.lockList) return;
            isLoading = true
            this.getList().then(() => {
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
          }else{
            this.$message({
              type: 'warning',
              message: '当前网络异常，请稍后再试'
            });
            this.loaderror = true;
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
  }
</script>
<style lang="scss">
.user{
  .error{
    background-image: url('../../assets/Artwork@2x.png');
    background-size: cover; 
    background-repeat: no-repeat;
    min-height: 740px;
  }
  max-width:1200px;
  margin:150px auto 0;
  position: relative;
  z-index: 20;
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
  .header{
    height:210px;
    margin-top:71px;
    position: relative;
    background:rgba(255,255,255,1);
    .headimg{
      width:120px;
      height:120px;
      background:rgba(187,187,187,1);
      border-radius:50%;
      position: absolute;
      left:26px;
      top:-40px;
      overflow: hidden;
      img{
        height:100%;
        width:100%;
        object-fit: cover;
      }
    }
    .userinfo{
      position: relative;
      height:24px;
      font-size:24px;
      font-weight: bolder;
      margin-left:173px;
      padding-top:16px;
      .img{
        display: inline-block;
        height:24px;
        width:14px;
        vertical-align:sub;
        margin-left:10px;
      }
      .changemsg{
        margin-left:50px;
        color:#fff;
        font-size:14px;
        display: inline-block;
        padding:6px;
        cursor: pointer;
        background-color: rgba(204,204,204,1);
        border-radius: 4px;
      }
      .desc{
        margin-top:26px;
        font-size: 14px;
        color:#bababa;
      }
    }
    .infonumber{
      width:120px;
      text-align: center;
      height:40px;
      position: absolute;
      top:100px;
      color:#333;
      font-size: 14px;
      font-weight: bolder;
      left:25px;
      cursor: pointer;
      .el-col:first-child{
        border-right:1px solid rgb(230,230,230);
      }
      .exshow{
        color:#bababa;
      }
    }
    .footnav{
      position: absolute;
      text-align: center;
      border-top:1px solid #E6E6E6;
      height:50px;
      bottom:0;
      left:0;
      right:0;
      margin:0 auto;
      ul{
        display: inline-block;
        height:100%;
        li{
          float:left;
          width:80px;
          height:50px;
          line-height: 50px;
          color:rgba(153,153,153,1);
          list-style: none;
          cursor: pointer;
        }
        .isactive{
          color:rgba(51,51,51,1);
        }
      }
    }
  }
  .body{
    text-align: center;
    margin:30px auto 0;
    color: #2c3e50;
    .conbody .el-col{
      margin-bottom:30px;
    }
    .conbody .el-col:nth-child(3n+2){
      margin:0 30px 0;
    }
  }
}
@media (min-width: 0px){
  .user{
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
  .user{
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
  .user{
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
