<template>
  <div class="userInfoCard">
    <el-card :body-style="{ padding: '0px' }">
      <div class="title"><span v-html='returnEmoji(userInfo.contentTitle)'></span></div>
      <div class="image" @click="dialogCheck">
        <div class="nostatus" v-if="userInfo.auditStatus>1||userInfo.status==-100">审核未通过</div>
        <div v-if="isIE" class="ieimg" :style="{'background-image':'url('+userInfo.mainImageUrl+')'}"></div>
        <img v-else class="img" v-lazy="userInfo.mainImageUrl||userInfo.contentVideoUrl.split(',')[0]" :key="userInfo.mainImageUrl||userInfo.contentVideoUrl.split(',')[0]">
        <div class="backgroundimg">
          <img v-lazy="userInfo.mainImageUrl||userInfo.contentVideoUrl.split(',')[0]" style="width:100%;height:100%;object-fit:cover;">
        </div>
      </div>
      <template>
        <img class="rightpoint" v-if="userInfo.uploadWay==2" src="../../assets/s@2x.png" alt="">
        <img class="rightpoint" v-if="userInfo.uploadWay==1&&userInfo.contentVideoUrl.split(',').length>1" src="../../assets/p@2x.png" alt="">
      </template>
      <div style="height:63px;">
        <div class="wordmsg">
          <div class="footer">
            <div  v-if="userInfo.userInfo&&showTitle"  @click="toUserHome" class="headImg" v-lazy-container="{ selector: 'img' }">
              <img :data-src="userInfo.userInfo.userPic" :data-error="avatarurl" :key="userInfo.userInfo.userPic"> 
            </div>
            <div class="name" v-if="userInfo.userInfo&&showTitle" v-html="returnEmoji(userInfo.userInfo.nickName)"></div>
            <div class="time" :style="{top:showTitle?'28px':'12px',left:showTitle?'50px':'16px'}"> {{$handleDate(new Date(userInfo.createTime).getTime())}}</div>
          </div>
          <div class="nubmsg" :style="{paddingTop:showTitle?'12px':'18px'}">
            <img src="../../assets/guan@2x.png" alt=""><span>{{$numberFormatter(userInfo.praiseCount > 0?userInfo.praiseCount:0)}}</span>
            <img src="../../assets/liuy@2x.png" alt=""><span>{{$numberFormatter(userInfo.commentCount > 0?userInfo.commentCount:0)}}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "userInfoCard",
  props: ['userInfo','index','showTitle'],
  data() {
    return {
      isIE:false,
      avatarurl:require("../../assets/07.jpg"),
    };
  },
  created() {
     if (!!window.ActiveXObject || "ActiveXObject" in window){
       this.isIE = true;
      }
  },
  methods: {
    // 打开弹窗
    dialogCheck() {
      this.$emit('dialogCheck',this.userInfo);
    },
    toUserHome(){
      this.$router.push('/user?id='+this.userInfo.userId);
    },
    returnEmoji(value){
      value = value.replace(/<e:(.*?)>/g,function(){
          return eval("'" + arguments[1] + "'");
      });
      return this.$emoji.parse(value);
    },
  }
};
</script>
<style  lang="scss">
.userInfoCard{
  text-align: left;
  margin:0 auto;
  position: relative;
  color: #2c3e50;
  .nostatus{
    position: absolute;
    top: 0;
    z-index:100;
    left:0;
    align-items:center;
    display: -webkit-flex;
    text-align: center;
    cursor: pointer;
    justify-content: center;
    background-color:rgba($color: #000000, $alpha: 0.6);
    color:#fff;
    vertical-align: middle;
    width:100%;
    height:100%;
    font-size:24px;
  }
  .rightpoint{
    height:14px;
    width:20px;
    z-index: 4;
    opacity: .4;
    position: absolute;
    right:10px;
    top:10px;
  }
  .image {
    width: 100%;
    position: relative;
    z-index: 3;
    display: block;
    height:282px;
    // object-fit: cover;
    .ieimg{
      background-position:center;
      background-size:contain;
      background-repeat:no-repeat;
      width:100%;
      height:100%;
      position: relative;
      z-index: 4;
    }
    .img{
      object-fit: contain;
      width:100%;
      height:100%;
      position: relative;
      z-index: 4;
    }
    .backgroundimg{
      width:100%;height:100%;
      position:absolute;
      left:0;top:0;
      z-index:2;
      background-color: #000;
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -ms-filter: blur(5px);
      filter: blur(5px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5, MakeShadow=false);
    }
  }
  .title{
    font-size:14px;
    color:#fff;
    height:40px;
    line-height:36px;
    z-index: 4;
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    width:100%;
    overflow: hidden;
    bottom: 57px;
    span{
      margin-left:16px;
    }
  }
  .wordmsg{
    .content{
      color:#666;
      font-size: 12px;
      padding:0 31px 0 16px;
      height:31px;
      overflow: hidden;
      position: relative;
      div{
        float: right;
        margin-left: -5px;
        width: 100%;
        word-break: break-all;
      }
    }
    .showafter::after {
      float: right;
      content: "...";
      height: 20px;
      line-height: 20px;
      /* 为三个省略号的宽度 */
      width: 3em;
      /* 使盒子不占位置 */
      margin-left: -3em;
      /* 移动省略号位置 */
      position: absolute;
      left: 96%;
      top: 16px;
      padding-right: 5px;
      background-color: #FFF;
    }
    .nubmsg{
      padding:12px 0 0 16px;
      float: right;
      min-width: 100px;
      float: right;
      img{
        width:12px;
        height:12px;
        margin-right:4px;
      }
      span{
        font-size:12px;
        margin-right:19px;
        display: inline-block;
        color:#bbb;
      }
      &:after{
        clear: both;
      }
    }
  }
  .footer{
    position: relative;
    .headImg{
      width:26px;height:26px;border-radius:50%;cursor: pointer;
      position: absolute;
      left:16px;
      top:16px;
      overflow: hidden;
      img{
        width:100%;
        height:100%;
        object-fit: cover;
      }
    }
    .name{
      font-size: 12px;
      line-height:30px;
      height:30px;
      width:60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: absolute;
      left:50px;
      color:#333;
      top:8px;
    }
    .time{
      font-size: 12px;
      line-height:30px;
      height:20px;
      width:100px;
      position: absolute;
      left: 50px;
      color: #bbb;
      top: 28px;
      text-align: left;
    }
    .maintime{
      top: 8px;
      left: 16px;
    }
  }
}

@media (min-width: 0px){
  .conbody .el-col-8{
    width:213px;
  }
  .userInfoCard .image{
    height:158px;
  }
} /*>=1024的设备  700px*/

@media (min-width: 1100px) {
  .conbody .el-col-8{
    width:278px;
  }
  .userInfoCard .image{
    height:207px;
  }
} /*>=1100的设备  900px*/
@media (min-width: 1280px) {
  .conbody .el-col-8{
    width:378px;
  }
  .userInfoCard .image{
    height:282px;
  }
} /*>=1280的设备  1200px*/
</style>
