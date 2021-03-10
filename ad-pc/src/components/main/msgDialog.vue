<template>
  <div class="msgDialog">
    <transition name="dialog-fade">
      <div v-if="dialogTableVisible" class="dialogcontainer">
        <div class="dialogbody" element-loading-background="rgb(255, 255, 255,)">
          <div class="close" @click="closeDialog">X</div>
          <div style="height:100%;">
            <el-col style="height:100%;width:61%;float:left;">
              <div class="grid-content bg-purple" style="height:100%;">
                <el-carousel trigger="click" :autoplay="false" indicator-position="none" ref="carousel" @change="changeitem" :arrow="carArrow">
                  <el-carousel-item v-for="(item,index) in swiperData" :key="index">
                    <div v-if="indexMsgData.uploadWay == 1 ? true:false" style="position:absolute;width:100%;height:100%">
                      <div v-if="isIE" class="ieimg" :style="{'background-image':'url('+item+')'}"></div>
                      <img v-else class="img" v-lazy="item" :key="item">
                      <div class="backgroundimg">
                        <img :src="item" style="width:100%;height:100%;object-fit:fill;" :onerror="errorImg">
                      </div>
                    </div>
                    <div v-else style="height:100%;position:relative;">
                      <div style="position:absolute;right:0;height:100%;width:5px;z-index:6;background-color: rgb(0, 0, 0);filter: blur(5px);"></div>
                      <div class="playContainer" @click="controlPlay($event)" ref="playContainer">
                        <div class="playBtn" ></div>
                        <div class="loading"></div>
                      </div>
                      <video 
                        @error="showerrormsg"
                        class="tWeCl" 
                        style="height:100%;width:100%;object-fit:contain;"
                        playsinline="" :poster="indexMsgData.mainImageUrl"
                        preload="auto"
                        ref="mainvideo"
                        type="video/mp4"
                        loop=""
                        @waiting="onPlayerWaiting($event)"
                        @playing="onPlayerPlaying($event)"
                        >
                          <!-- <source :src="item.split('?')[0]" type="application/x-mpegURL"> -->
                        </video>
                        
                      <div style="display:none;width:100%;height:100%;text-align:center;background-color:#ccc;color:red;line-height:600px;">未找到视频来源或无法加载该视频;请查看是否开启了拦截广告等插件</div>
                      <div class="backgroundimg">
                        <img :src="indexMsgData.mainImageUrl" style="width:100%;height:100%;object-fit:fill;" :onerror="errorImg">
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-col>
            <el-col style="height:100%;display:inline-block;width: 39%;">
              <div class="headertop" style="height:68px;">
                  <div v-if="indexMsgData.userInfo"  @click="toUserHome(indexMsgData.userInfo.userId)" class="headImg" v-lazy-container="{ selector: 'img' }">
                    <img :data-src="indexMsgData.userInfo.userPic" :data-error="avatarurl" :key="indexMsgData.userInfo.userPic"> 
                  </div>
                  <div class="name"><span v-if="indexMsgData.userInfo" v-html='returnEmoji(indexMsgData.userInfo.nickName)'></span><span class="point">·</span><span class="guan" @click="showShare">{{onrel=='已关注'?'已关注':'关注'}}</span></div>
              </div>
              <div class="bodycenter">
                <div class="bodymsg">
                  <div class="wordmsg">
                    <div class="title"><span v-html='returnEmoji(indexMsgData.contentTitle)'></span></div>
                    <div class="nubmsg" @click="showShare">
                      <img src="../../assets/guan@2x.png" alt=""><span>{{$numberFormatter(indexMsgData.praiseCount > 0?indexMsgData.praiseCount:0)}}</span>
                      <img src="../../assets/liuy@2x.png" alt=""><span>{{$numberFormatter(indexMsgData.commentCount > 0?indexMsgData.commentCount:0)}}</span>
                    </div>
                    <div class="showtime">发布于<span style="margin-left:10px;">{{$formatterDateTime(indexMsgData.auditTime)}}</span></div>
                  </div>
                </div>
                <div class="bodytalk"  v-if="contentList.allList&&contentList.allList.length>0">
                  <div class="talkframe"  v-for="(data,index) in contentList.allList" :key="index">
                    <div class="head">
                      <div v-if="data.userInfo"  @click="toUserHome(data.userInfo.userId)" class="headImg" v-lazy-container="{ selector: 'img' }">
                        <img :data-src="data.userInfo.userPic" :data-error="avatarurl" :key="data.userInfo.userPic"> 
                      </div>
                      <div class="name"><span v-html='returnEmoji(data.userInfo.nickName)'></span></div>
                        <!-- <div class="nubmsg" @click="showShare"><img src="../../assets/guan@2x.png" alt=""><span>{{$numberFormatter(data.praiseCount)}}</span></div> -->
                    </div>
                    <div class="msgbody" v-html='returnEmoji(data.content)'></div>
                    <div class="tiemshow"><span>{{$handleDate(new Date(data.createTime).getTime())}}</span></div>
                    <!-- <div class="footer" v-if="data.replyCount>0&&!data.children"><span class="line"></span><span class="look" @click="checkmore(data)">查看回复</span>（<span>{{data.replyCount}}</span>）</div> -->
                    <!-- <div class="talkframe" style="padding-left:20px;" v-else  v-for="(item,i) in data.children" :key="i">
                      <div class="head">
                        <el-image
                          class="headImg"
                          v-if='item.userInfo'
                          :src="item.userInfo.userPic"
                          fit="fill" @click="toUserHome(item.userInfo.userId)"></el-image>
                          <div class="name"><span>{{item.userName}}</span></div>
                          <div class="nubmsg"  @click="showShare"><img src="../../assets/guan@2x.png" alt=""><span>{{$numberFormatter(item.praiseCount)}}</span></div>
                      </div>
                      <div class="msgbody">
                        {{item.content}}
                      </div>
                      <div class="tiemshow"><span>{{$handleDate(new Date(item.createTime).getTime())}}</span><span @click="showShare" style="cursor: pointer;">回复</span></div>
                    </div> -->
                  </div>
                  <div class="lookTalkMore" v-if="contentList.allList.length>=4&&contentList.hasNextPage" @click="addMoreContent">查看更多评论</div>
                </div>
                <div class="bodytalk"  v-else>
                  <p style="color:#666;font-size:12px;">当前无任何评论，欢迎多多发言哦</p>
                </div>
              </div>
              <div class="footright">
                <div class="left" @click="showShare">添加评论...</div>
                <div class="right" @click="showShare">发布</div>
              </div>
            </el-col>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  name: "msgDialog",
  props: ['dialogTableVisible'],
  data() {
    return {
      bodyData:{
        contentId:'',
        id:-1,
        pageSize:10,
        replyId:0,
      },
      avatarurl:require("../../assets/07.jpg"),
      isIE:false,
      errorImg: 'this.src="https://demo.chevereto.com/images/2018/11/23/Map.md.png"', //加载图片报错时处理方法
      carArrow:'never',
      totalTime:0,
      intervalDur: 100,
      flagWaiting:false,
    };
  },
  created() {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      this.isIE = true;
    };
    if(navigator.userAgent.indexOf('MSIE') !== -1){
      document.attachEvent('onkeydown', ()=>{
        if(event.keyCode == 27){
          if(this.dialogTableVisible){
            this.closeDialog();
          };
        }
      });
    }else{
      document.addEventListener('keydown', (e)=>{
        if(e.which == 27){
          if(this.dialogTableVisible){
            this.closeDialog();
          };
        }
      }, false);
    }
  },
  computed: {
    //在这里映射 store.state.count，使用方法和 computed 里的其他属性一样
    ...mapState([
        'indexMsgData','contentList','onrel','swiperData'
    ])
  },
  watch:{
    dialogTableVisible(val){
      if(val){
        this.stop();
        this.tocheckRel().then(()=>{
          this.getComment();
        });
        sessionStorage.setItem("vtime",Math.round(new Date() / 1000))
        this.contentPointVideo({
          type:1,
          count:1
        });
        if(this.indexMsgData.uploadWay == 1) return;
        
        setTimeout(()=>{
          if(this.swiperData[0].indexOf(".m3u8") == -1){
            this.$refs['mainvideo'][0].src = this.swiperData[0];
            this.oncePlay()
            return;
          };
          var Hls = window.Hls
          var url = this.swiperData[0].split('?')[0];
          var video = this.$refs['mainvideo'][0];
          if (Hls.isSupported()) {
            var hls = new Hls()
            hls.loadSource(url)
            hls.attachMedia(video)
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url
          };
          video.poster=this.indexMsgData.mainImageUrl;
          this.oncePlay()
        },100)
      }else{
        var vtime = Math.floor(sessionStorage.getItem("vtime"));
        let nowTime = Math.round(new Date() / 1000);
        this.contentPointVideo({
          type:2,
          count:(nowTime - vtime)
        });
        var dom = document.querySelector(".tWeCl");
        if(dom&&(dom.src.indexOf("mp4") > -1||dom.src.indexOf("m3u8") > -1)){
          dom.style.display='block';
          dom.src = '';
          dom.nextSibling.style.display='none';
          dom.nextSibling.nextSibling.style.display='block';
        }
        this.bodyData.id = -1;
        this.cleanData();
        this.move();
      }
    },
    swiperData(swiper){
      if(swiper.length > 1){
        this.carArrow = 'hover';
      }else{
        this.carArrow = 'never';
      }
    }
  },
  methods: {
    //增加action方法
    ...mapActions([
        'addContentList','checkRel','cleanData','contentPointVideo'
    ]),
    oncePlay(){
      let dom = this.$refs['playContainer'][0];
      this.toPlay(dom);
      dom.children[0].style.display = "none"
    },
    checkmore(item){
      this.bodyData.replyId = item.id;
      this.bodyData.pageSize = 10;
      this.addContentList({
        ...this.bodyData
      });
    },
    getComment(){
      this.bodyData.contentId = this.indexMsgData.contentId;
      this.addContentList({
        ...this.bodyData
      });
    },
    tocheckRel(){
      return this.checkRel({
        userId:this.$store.state.userId,
        attUserId:this.$store.state.indexMsgData.userInfo.userId
      });
    },
    showerrormsg(e){
      if(e.target.error&&e.target.src.indexOf("mp4") > -1){
         e.target.style.display='none';
         e.target.nextSibling.style.display='block';
         e.target.nextSibling.nextSibling.style.display='none';
      }
    },
    changeitem(a,b){
      var el = this.$refs.carousel.$children[b];
      el&&this.toPause(el.$el.querySelector('.playContainer'));
    },
    // 操作dom控制视频
    toPlay(dom){
      if(dom){
        dom.nextSibling.play();
        this.carArrow = 'never';
        dom.children[0].style.display = "none";
      };
    },
    // 操作dom控制视频
    toPause(dom){
      if(dom){
        dom.nextSibling.pause();
        if(this.swiperData.length <= 1){
          this.carArrow = 'never';
        }else{
          this.carArrow = 'hover';
        };
        dom.children[1].style.display = "none"; 
        dom.children[0].style.display = "block";
      }
      return;
    },
    // 视频蒙版的点击事件
    controlPlay(event){
      var Dom = event.currentTarget;
      if(Dom.children[0].style.display === "none"){
        this.toPause(Dom);
      }else{
        this.toPlay(Dom);
      }
    },
    onPlayerWaiting(e){
      e.target.previousSibling.children[1].style.display = 'block';
    },
    onPlayerPlaying(e){
      e.target.previousSibling.children[1].style.display = 'none';
    },
    // 重置滑动组件
    reloadSwiper() {
      if(this.swiperData.length <= 1){
        this.carArrow = 'never';
      }else{
        this.carArrow = 'hover';
      }
      this.$refs.carousel.setActiveItem(0);
    },
    // 关闭弹窗
    closeDialog(){
      this.reloadSwiper();
      let playDomArr = this.$refs.carousel.$el.querySelectorAll('.playContainer');
      if(playDomArr.length>0){
        for(let i=0;i<playDomArr.length;i++){
          this.toPause(playDomArr[i]);
        }
      }
      this.$emit('changeDialogTableVisible',false);
    },
    toUserHome(id){
      if(this.$route.fullPath !== '/user?id='+id){
        this.move();
        this.closeDialog();
        this.$router.push('/user?id='+id);
      }else{
        return;
      }
    },
    addMoreContent(){
      this.bodyData.replyId = '0';
      this.bodyData.pageSize = 10;
      this.bodyData.id = this.contentList.allList[this.contentList.allList.length-1].id;
      this.getComment();
    },
    showShare(){
      this.closeDialog();
      this.$emit("showShare");
    },
    /***滑动限制***/
    stop(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",mo,false);//禁止页面滑动
    },
    /***取消滑动限制***/
    move(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",mo,false);
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.dialogcontainer .dialogbody .left,
.dialogcontainer .dialogbody .right {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
}
.dialogcontainer {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 200;
  .dialogbody {
    position: relative;
    margin: 200px auto 0;
    background: #ffffff;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 1080px;
    height: 600px;
    .playContainer{
      position:absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      z-index:10;
      .playBtn{
        position: absolute;
        width:42px;
        height:50px;
        background: url('../../assets/playbtn.png')  no-repeat;
        background-size:100% 100%;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
      }
      .loading{
        position: absolute;
        width:42px;
        display: none;
        height:42px;
        background: url('../../assets/loadingv.gif')  no-repeat;
        background-size:100% 100%;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
      }
    }
    .tWeCl{
      position: absolute;
      left:0;
      top:0;
      z-index: 5;
    }

    .close {
        position: absolute;
        cursor: pointer;
        color:#fff;
        right: -60px;
        width: 30px;
        line-height: 30px;
        height: 30px;
        top: -90px;
        font-size: 30px;
    }
    .el-carousel__container .outimg {
      width:100%;
      height: 100%;
      position:absolute;
      left:0;
      top:0;
      z-index: 4;
      object-fit: contain;
    }
    .el-carousel__container .ieimg {
      background-position:center;
      background-size:contain;
      background-repeat:no-repeat;
      width:100%;
      height:100%;
      position: relative;
      z-index: 4;
    }
    .el-carousel__container .backgroundimg {
      width:100%;
      height:100%;
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
    
    .el-carousel__container .img {
      object-fit: contain;
      width:100%;
      height:100%;
      position: relative;
      z-index: 4;
    }
    .headertop{
      position: relative;
      text-align: left;
      border-bottom: 1px solid #ccc;
      .headImg{
        width:40px;height:40px;
        border-radius:50%;cursor: pointer;
        position: absolute;
        overflow: hidden;
        left:16px;
        top:14px;
        img{
          width:100%;
          height:100%;
          object-fit: cover;
        }
      }
      .name{
        font-size: 14px;
        line-height:16px;
        height: 20px;
        position: absolute;
        left:66px;
        font-weight: bolder;
        color:#333;
        top:27px;
        .point{
          margin:0 10px;
        }
        .guan{
          color:#F92255;
          cursor: pointer;
        }
      }
    }
    .bodycenter{
      text-align: left;
       height:470px;
       overflow-x: auto;
       border-bottom: 1px solid #ccc;
       padding:0 16px;
       .bodymsg{
        border-bottom: 1px solid #ccc;
        .wordmsg{
          .title{
            font-size:16px;color:#000;line-height:30px;
            font-weight: bolder;
          }
          .content{
            color:#666;
            font-size: 12px;
            min-height: 102px;
            line-height: 15px;
            position: relative;
          }
          .nubmsg{
            padding:10px 0;
            cursor: pointer;
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
          }
          .showtime{
            font-size: 12px;
            line-height: 30px;
            height:30px;
            color:#bbb;
          }
        }
       }
       .bodytalk{
        padding-top:15px;
        overflow-y: auto;
        .talkframe{
           .head{
             position: relative;
             height:30px;
             .headImg{
              width:30px;
              height:30px;
              border-radius:50%;cursor: pointer;
              position: absolute;
              overflow: hidden;
              left:0;
              top:0;
              img{
                width:100%;
                height:100%;
                object-fit: cover;
              }
             }
            .name{
              font-size: 14px;
              line-height:16px;
              height:20px;
              overflow: hidden;
              position: absolute;
              left:40px;
              font-weight: bolder;
              color:#333;
              top:8px;
             }
             .nubmsg{
               position: absolute;
               right:0;
               color:#ccc;
               font-size:12px;
               top:8px;
               cursor: pointer;
              img{
                width:10px;
                height:10px;
                margin-right:10px;
              } 
             }
           }
           .msgbody{
             position: relative;
             color:#666;
             padding-left:40px;
             overflow: hidden;
             font-size:12px;
           }
          .tiemshow{
            padding-left:40px;
            padding-top:8px;
            color:#666;
            font-size: 13px;
            span:first-child{
              color:#bbb;
              margin-right:16px;
            }
          }
          .footer{
            padding-left:40px;
            padding-top:8px;
            font-weight:400;
            font-size:12px;
            color:#666;
            position: relative;
            .line{
              display: inline-block;
              position: absolute;
              left: 26px;
              top: 16px;
              width:26px;
              margin:0 15px;
              height:1px;
              background:rgba(102,102,102,1);
            }
            .look{
              margin-left:40px;
              cursor: pointer;
            }
          }
        }
        .lookTalkMore{
            height:48px;
            font-size:12px;
            font-weight:bolder;
            color:rgba(51,51,51,1);
            line-height:18px;
            line-height: 48px;
            text-align: center;
            cursor: pointer;
        }
       }
    }
    .footright{
      position: relative;
      cursor: pointer;
      font-size:13px;
      font-weight:400;
      .left{
        position: absolute;
        color:rgba(187,187,187,1);
        top:20px;
        width:63px;
        left:16px;
      }
      .right{
        position: absolute;
        color:#F92255;
        top:20px;
        right:16px;
      }
    }
  }
}
@media (min-width: 0px){
  .dialogcontainer .dialogbody{
    width: 580px;
    height: 322px;
    .el-carousel__container{
      height:322px;
    }
    .bodycenter{
      height:200px;
    }
  }
} /* 700px*/

@media (min-width: 1100px) {
  .dialogcontainer .dialogbody{
    width: 770px;
    height: 427px;
    .el-carousel__container{
      height:427px;
    }
    .bodycenter{
      height:300px;
    }
  }
} /* 900px*/
@media (min-width: 1280px) {
  .dialogcontainer .dialogbody{
    width: 1070px;
    height: 600px;
    .el-carousel__container{
      height:600px;
    }
    .bodycenter{
      height:475px;
    }
  }
} /*  1200px*/
</style>
