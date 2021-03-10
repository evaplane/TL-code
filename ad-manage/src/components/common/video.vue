<template>
  <div class="mainvideo">
    <div class="loadingvideo" v-if="loading">
      <div>
        <i class="el-icon-loading" style="text-indent:0;font-size:40px;"></i>
        <p>正在加载视频中</p>
      </div>
    </div>
    <!-- <div :class="[{vcIsFull?'onfull':'infull','little'}:{loading==true}]"> -->
    <div :class="[vcIsFull?'onfull':'infull',{'little':loading==true}]">
      <div class="errshow" v-if="error">视频生成中...</div>
      <div class="videoContent" ref="videocontent" v-else>
        <div class="controlBody">
          <div class="shade" :class="type>0?'':'single'" @click="videoPlay"></div>
          <!-- 控制器 -->
          <div class="videoControl" :style="{display:loading?'none':'block'}">
              <div ref="vcontrol" class="vcontrol" :class="type>0?'':'single'">
                <div class="vcTop">
                    <!-- 播放按钮 -->
                    <div class="vcPlayBtn" @click="videoPlay" title="播放">
                      <i :class="vcIsPlay?'el-icon-video-pause':'el-icon-video-play'" class="big"></i>
                    </div>
                    <!-- 音量 -->
                    <div class="volumecontrol" v-if="type > 0" title="音量">
                      <span style="position: relative;top: -15%;transform: translateY(-50%);" @click="mutedControl"> <i class="fa" :class="muted?'fa-volume-off':'fa-volume-up'" aria-hidden="true"></i></span>
                      <span class="volume_wrap voice-box" ref="voicebox" @click="voiceMove">
                        <div class="voice-line"></div>
                        <div class="voice-volume" :style="{width: volumeLength*100 + '%'}"></div>
                        <div class="voice-btn" :style="{left: 'calc('+ volumeLength*100 +'% - 6px)'}"></div>
                      </span>
                    </div>
                    <!-- 播放时间 -->
                    <div v-if="type == 0" title="播放时间"><span style="cursor:pointer">{{vcCurrentTime}} / {{vcTotalTime}}</span></div>
                    <div class="pictopic" title="画中画" @click="pictopic"><span style="cursor:pointer">画中画</span></div>
                    <!-- 截图 -->
                    <div class="captureBtn" v-if="subBtn" title="截封面图" @click="captureImage()"><i class="el-icon-scissors big"></i></div>
                    <!-- 截图 -->
                    <!-- <div class="captureBtn" v-if="subBtn" title="截取预览" @click="captureImage2()"><i class="el-icon-camera big"></i></div> -->
                    <div class="captureBtn" v-if="subBtn" title="截取预览" @click="captureImage2()"><i class="fa fa-scissors" aria-hidden="true"></i></div>
                    <!-- 下载 -->
                    <div class="captureBtn" title="下载" @click="download()"><i class="el-icon-download big"></i></div>
                    <!-- 全屏 -->
                    <div class="vcFullBtn" title="全屏" @click="showFullScreen()"><i class="fa big" :class="vcIsFull?'fa-compress':'fa-expand'"></i></div>
                </div>
                <div class="vcBottom" v-if="type > 0">
                  <!-- 进度 -->
                  <div class="up" @click="progressControl">
                    <div class="centercolor" :style="{width: vcProgress*100/100 + '%'}"></div>
                    <div class="voice-btn" :style="{left: 'calc('+ vcProgress*100/100 +'% - 5px)'}"></div>
                  </div>
                </div>
              </div>
              <!-- 播放时间 -->
              <div class="vcPlayTime" v-if="type > 0" title="播放时间"><span style="cursor:pointer">{{vcCurrentTime}} / {{vcTotalTime}}</span></div>
          </div>
        </div>
        <video id="media" 
        @loadedmetadata="getVideoTime"
        @error="showerrormsg"
        crossOrigin="anonymous"
        :muted="muted"
        @canplay="videoCanPlay()"
        autoplay
        @timeupdate="videoTimeUpdate()"
        ref="video" ></video>
        <div v-if="type > 0" class="backgroundimg" :class="loading?'':'backgroundimg'"><img :src="mainSrc" style="width: 100%; height: 100%; object-fit: fill;"></div>
        <div class="changesrc" v-if="changeBtn&&type==1" :style="{display:loading?'none':'block'}">
          <el-button type="primary" plain  @click="changeSrc">{{changeBtn}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {formatterDateTime,delSelectTag,sys_formatDate} from '../../js/util'
export default {
    name:'videoplay',
    props:['contentVideoUrl','mainSrc','type','sub','fullUrl'],
    data(){
      return {
        loading:true,
        error:null,
        vcCurrentTime:'00:00',//当前进度
        vcTotalTime:'00:00',//总时长
        vcIsPlay:true,//video是否播放
        vcProgress:0,//video进度
        muted:true,//是否静音
        volumeLength:0,// 音量大小
        vcIsFull:false,//是否全屏
        changeBtn:'',
        videoWidth:'',
        videoHeight:''
      }
    },
    created(){
      this.subBtn = this.sub;
      this.videoFullUrl = this.fullUrl||this.contentVideoUrl;
      if(navigator.userAgent.indexOf('MSIE') !== -1){
        document.attachEvent('onkeydown', ()=>{
          if(event.keyCode == 27){
            if (this.vcIsFull) {
              this.vcIsFull = false;
            };
          }
        });
      }else{
        document.addEventListener('keydown', (e)=>{
          if(e.which == 27){
            if (this.vcIsFull) {
              this.vcIsFull = false;
            };
          }
        }, false);
      };
    },
    mounted(){
      setTimeout(()=>{
        this.setHlc(this.contentVideoUrl);
      },100)
    },
    beforeDestroy(){
      this.$refs.video.src = null;
    },
    methods:{
      setHlc(url){
        if(this.contentVideoUrl.indexOf(".m3u8") == -1){
          this.$refs.video.src = url;
          return;
        };
        url = url.split('?')[0]
        var video = this.$refs.video;
        if (Hls.isSupported()) {
          var hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        };
      },
        // 视频控制相关
        showFullScreen(){
          if (!this.vcIsFull) {
            this.vcIsFull = true;
          } else {
            this.vcIsFull = false;
          }
        },
        download(){
          const xhr = new XMLHttpRequest();
          xhr.open('GET', this.contentVideoUrl, true);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.status === 200) {
              // 获取图片blob数据并保存
              this.save(prename[prename.length-1],xhr.response);
            }
          };
          
          xhr.send();
        },
        save(name, data) {
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([data]);
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            save_link.click();
        },
        videoTimeUpdate(){
          if(this.$refs.video){
            var currTime =this.$refs.video.currentTime;
            var duration =this.$refs.video.duration;
            this.vcCurrentTime = this.getFormatVideoTime(currTime);
            var pre = currTime / duration;
            this.vcProgress = pre*100;
            if(pre == 1){
              this.videoPause();
            }
          };
        },
        changeSrc(){
          if(this.changeBtn == '播放完整视频'){
            this.changeBtn = '播放审核视频';
            // this.$refs['video'].src = this.videoFullUrl;
            setTimeout(()=>{
              this.setHlc(this.videoFullUrl);
            },100)
          }else{
            this.changeBtn = '播放完整视频';
            // this.$refs['video'].src = this.contentVideoUrl;
            setTimeout(()=>{
              this.setHlc(this.contentVideoUrl);
            },100)
          };
          if(this.sub){
            this.subBtn = !this.subBtn;
          };
          this.$refs['video'].currentTime = 0;
        },
        getVideoTime(e){
          this.loading = false;
          this.$emit('loadvideo',{
            videoWidth:e.target.videoWidth,
            videoHeight:e.target.videoHeight
          })
          if(!this.changeBtn){
            this.changeBtn = '播放完整视频';
          };
        },
        showerrormsg(e){
          console.log(e);
          this.loading = false;
          let str = "错误信息："+e.target.error.message;
          str += "<br/>";
          str += "视频链接："+e.target.src;
          this.error = str;
        },
        videoCanPlay(){
          if(this.$refs.video){
            var duration =this.$refs.video.duration;
            this.vcTotalTime = this.getFormatVideoTime(duration);
          };
        },
        //video play or stop
        videoPlay(){
            if(this.vcIsPlay){
              this.$refs.video.pause();
            }else{
              this.$refs.video.play();
            }
            this.vcIsPlay = !this.vcIsPlay;
        },
        videoPause(){
            if(this.vcIsPlay){
              this.vcIsPlay = !this.vcIsPlay;
              this.$refs.video.pause();
            };
        },
        progressControl(event){
          var mediaplayer = this.$refs.video;
          var progress_width = this.$refs.vcontrol;
          var newCoor = event.pageX,
            offLeft = progress_width.getClientRects()[0].left, //距左边的距离
            progress_list_width = progress_width.offsetWidth,
          curPlay = newCoor - offLeft; //拖到的新的位置
          var newLocation = curPlay / progress_list_width * mediaplayer.duration;
          mediaplayer.currentTime = newLocation;
        },
        mutedControl(){
          var player = this.$refs.video;
          player.muted = !player.muted;
          if(player.muted) {
            //静音时，设置音量盒,不需要设置player.volume
            this.volumeLength = 0;
            this.muted = true;
          } else {
            this.volumeLength = player.volume;
            this.muted = false;
          }
        },
        pictopic(){
          var video = this.$refs.video;
          try {
            if (video !== document.pictureInPictureElement)
              video.requestPictureInPicture();
            else
              document.exitPictureInPicture();
          } catch(error) {
            console.log(`> Argh! ${error}`);
          } finally {
            console.log("结束")
          }
        },
        voiceMove(event){
          var voice_box = this.$refs.voicebox;
          var player = this.$refs.video;
          var clientX = event.pageX,
            ClientRect = voice_box.getBoundingClientRect().left, //相对于左边视口的距离
            volumeWidth = clientX - ClientRect;
          volumeWidth > voice_box.offsetWidth ? volumeWidth = voice_box.offsetWidth : volumeWidth;
          volumeWidth > 2 ? volumeWidth : volumeWidth = 0;
          if(volumeWidth == 0){
            this.muted = true;
            this.volumeLength = 0;
          }else{
            this.muted = false;
            var volumeLength = (volumeWidth / voice_box.offsetWidth).toFixed(2);
            player.volume = volumeLength;
            this.volumeLength = volumeLength;
          }
        },
        //格式化时间
        getFormatVideoTime(time) {
          var theTime = parseInt(time);// 秒
          var middle= 0;// 分
          var hour= 0;// 小时
          if(theTime > 60) {
              middle= parseInt(theTime/60);
              theTime = parseInt(theTime%60);
              if(middle> 60) {
                  hour= parseInt(middle/60);
                  middle= parseInt(middle%60);
              }
          };
          theTime = theTime < 10 ? "0"+theTime : theTime;
          middle = middle < 10 ? "0"+middle : middle;
          var result =theTime;
          if(middle > 0) {
              result = middle+':'+result;
          }else{
            result = '00:'+result;
          }
          if(hour> 0) {
              result = parseInt(hour)+':'+result;
          }
          return result;
        },
        captureImage() {
          if(this.changeBtn == '播放审核视频'){
            return;
          }
          setTimeout(()=>{
            try {
              const video = this.$refs.video
              const canvas = document.createElement('canvas')
              canvas.width = video.videoWidth 
              canvas.height = video.videoHeight
              const img = new Image()
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
              const dataUrl = canvas.toDataURL('image/png');
              this.$emit('captureImage',dataUrl);
              return;
            } catch (error) {
              this.$message({
                message: error.message,
                type: 'warning'
              });
            };
          },100)
        },
        captureImage2() {
          if(this.changeBtn == '播放审核视频'){
            return;
          }
          setTimeout(()=>{
            try {
              const video = this.$refs.video
              const canvas = document.createElement('canvas')
              const time = video.currentTime;
              canvas.width = video.videoWidth 
              canvas.height = video.videoHeight
              const img = new Image()
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
              const dataUrl = canvas.toDataURL('image/png');
              this.$emit('captureImage2',{
                src:dataUrl,
                time:time
              });
              return;
            } catch (error) {
              this.$message({
                message: error.message,
                type: 'warning'
              });
            };
          },100)
        },
        getRandom(num){
            return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
        }
    }
}
</script>

<style lang='scss'>
.mainvideo{
  height:100%;
  width:100%;
  position: relative;
  .loadingvideo{
    position: absolute;
    z-index: 2;
    text-align: center;
    text-indent: 0;
    line-height: 20px;
    width:100%;
    height:100%;
    background-color: #ccc;
    div{
      margin:0 auto;
      top:50%;
      position: relative;
      height:40px;
      transform: translateY(-50%);
      width:100px;
    }
  }
  #media{
    width: 100%;
    height:100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
  }
  .infull{
    height:100%;
    width:100%;
    position: relative;z-index: 1;
  }
  .little.infull{
    height:1px;
    width:1px;
  }
  .onfull{
    width:100%;
    position: fixed;
    top:0;
    left:0;
    background-color:#fff;
    height:100%;
    z-index: 99999;
    .big{
      font-size:34px;
      margin-top: 5px;
    }
  }
  .errshow{
    line-height: 40px;
  }
  .videoContent{
    width:100%;
    height:100%;
    text-indent:0;
    position: relative;
    .backgroundimg{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      background-color: #000;
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -ms-filter: blur(5px);
      filter: blur(5px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5,MakeShadow=false);
    }
    .changesrc{
      position: absolute;
      top:20px;
      right:20px;
      z-index:10;
    }
    .controlBody{
      height:100%;
      width:100%;
      position: absolute;
      .shade.single{
        bottom:40px;
      }
      .shade{
        position: absolute;
        top:0;
        left:0;
        cursor: pointer;
        width: 100%;
        bottom:60px;
        z-index: 8;
      }
      .videoControl{
        position: absolute;
        left:0;
        width:100%;
        z-index: 10;
        background-color:rgba(0,0,0,0.4);
        bottom:0;
        
        .vcontrol.single{
          width:100%;
          margin-left:0;
          height:40px;
        }
        .vcontrol{
          float:left;
          width:85%;
          height:100%;
          margin-left:30px;
          height:60px;
          .vcTop{
            padding:0;
            margin:0;
            line-height:200px;
            list-style:none;
            display:-webkit-box;
            display:-moz-box;
            display:-ms-flexbox;
            display:-webkit-flex;
            display:flex;
            color:#fff;
            -webkit-flex-flow:row nowrap;
            justify-content:space-around;
            height:38px;
            line-height: 40px;
            .vcPlayBtn{
              cursor: pointer;
              margin-right:10px;
              font-size:24px;
            }
            .volumecontrol{
              display:table-cell;
              vertical-align:middle;
              .voice-box {
                display: inline-block;
                position: relative;
                height: 30px;
                width: 124px;
                opacity: 0.7;
                line-height: 30px;
                top: 5px;
                margin-left: 5px;
                filter: alpha(opacity=70);
              }

              .voice-line {
                cursor: pointer;
                position: absolute;
                top: 13px;
                height: 4px;
                width: 124px;
                background: #ddd;
              }

              .voice-volume {
                position: absolute;
                top: 13px;
                height: 4px;
                cursor: pointer;
                background: #57a900;
              }
              .pictopic{
                cursor: pointer;
              }
              .voice-btn {
                position: absolute;
                top: 9px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
              }
            }
            .captureBtn{
              cursor: pointer;
              font-size:24px;
              margin-right:10px;
            }
            .vcFullBtn{
              cursor: pointer;
              font-size:24px;
            }
          }
          .vcBottom{
            position: relative;
            height:22px;
            .up{
              position: relative;
              top:9px;
              height:4px;
              cursor: pointer;
              background-color:rgba(0,0,0,0.5);
              &:before{
                content:"";
                position:absolute;
                top:-9px;
                left:0;
                bottom:-9px;
                right:0;
              }
              .centercolor{
                height: 4px;
                margin-top: 0px;
                width: 0px;
                top: 0px;
                position: absolute;
                background-color:#fff;
              }
              .voice-btn {
                position: absolute;
                top: -3px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: white;
              }
            }
          }
        }
        .vcPlayTime{
          margin-right:10px;
          position: absolute;
          bottom:0;
          color:#fff;
          line-height: 22px;
          right:50px;
        }
        
      } 
    }
  }
}

</style>
