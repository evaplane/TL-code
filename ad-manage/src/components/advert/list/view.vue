<template>
  <div>
    <!-- 内容 -->
    <div class="content sub" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>广告详情</div></el-col>
        </el-row>
        <el-form v-if="showData" :model="editDeptForm" ref="editDeptForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="广告分类名称:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="广告分类值:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.categoryValue"></el-input>
          </el-form-item>
          <el-form-item label="广告类别名称:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.advtTypeName"></el-input>
          </el-form-item>
          <el-form-item label="广告名称:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.advtName"></el-input>
          </el-form-item>
          <el-form-item label="广告URL:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.redirectUrl"></el-input>
          </el-form-item>
          <el-form-item label="广告标识:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.advtSign"></el-input>
          </el-form-item>
          <el-form-item label="广告简介:">
            <el-input type="textarea" :rows="2" autocomplete="off" readonly="readonly" :disabled="true" :value="showData.advtDesc"></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.createTime"></el-input>
          </el-form-item>
          <el-form-item label="最近更新时间:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.updateTime"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.status"></el-input>
          </el-form-item>
          <el-form-item label="操作员:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.updateUser"></el-input>
          </el-form-item>
          <el-form-item label="广告缩略图:" v-if="showData.contentType==20">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content">
                <el-image 
                  v-show="showData.thumbnailUrl"
                  class="showImg"
                  :src='showData.thumbnailUrl'
                   ref="mainImg"
                   style="width:120px;"
                   fit="contain"
                   @load="loadimg"
                  :preview-src-list="[showData.thumbnailUrl]"
                >
                </el-image>
              </div>
              </el-row>
          </el-form-item>
          <el-form-item label="广告视频:" v-if="showData.contentType==20">
            <el-row style="margin-bottom:0px;">
              <videoPlay  class="grid-content lookvideo videobox" :type='2' :contentVideoUrl="showData.contentUrl" :mainSrc="showData.thumbnailUrl"></videoPlay>
            </el-row>
          </el-form-item>
          <el-form-item label="内容明细:" v-if="showData.contentType==10">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content showallpic">
                <el-image 
                  v-for="(src,index) in showData.imgUrls" :key="index"
                  class="showImg"
                  :src='src'
                  fit="contain"
                  :preview-src-list="showData.imgUrls"
                  @load='loadimg2($event,index)'
                >
                <!-- @dblclick="showDigPic(src)" -->
                </el-image>
              </div>
            </el-row>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="10"><div class="grid-content"></div></el-col>
          <el-col :span="2"><div class="grid-content">
              <el-button plain @click="backToDept">返回</el-button>
          </div></el-col>
        </el-row>
    </div>
  </div>
</template>
<script>
import {formatterDateTime,delSelectTag,sys_formatDate} from '../../../js/util'
import videoPlay from '../../common/video'
import { setTimeout } from 'timers';
export default {
    name:'manualSub',
    data(){
      return {
        // 新增数据
        editDeptForm:{
            name:'',
            region:'',
            categorySelectList:'',
            videoWidth:'',
            videoHeight:'',
        },
        mainSrc:null,
        showData:null,
        imgWidth:null,
        imgHeight:null,
        error:null,
        vcCurrentTime:'00:00',//当前进度
        vcTotalTime:'00:00',//总时长
        vcIsPlay:true,//video是否播放
        vcProgress:0,//video进度
        muted:true,//是否静音
        volumeLength:0,// 音量大小
        vcIsFull:false,//是否全屏
        changeBtn:''
      }
    },
    components:{
      videoPlay,
    },
    created(){
      this.getDeptData(this.$route.query.id);
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
      }
    },
    methods:{
        // 返回
        backToDept(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        loadimg(){
          this.imgWidth = this.$refs['mainImg'].naturalWidth
          this.imgHeight = this.$refs['mainImg'].naturalHeight
        },
        loadimg2(event,index){
          if(index == 0){
            this.imgWidth = event.target.naturalWidth
            this.imgHeight = event.target.naturalHeight
          }
        },
        // 获取审核内容
        getDeptData(id){
            this.$get(`content-web/advtInfo/view`,{id}).then(res=>{
                if(res.code=="000000"){
                  res.data.createTime = formatterDateTime(res.data.createTime)
                  res.data.updateTime = formatterDateTime(res.data.updateTime)
                  if(res.data.status==100){
                    res.data.status='启用'
                  }else{
                    res.data.status='禁用'
                  }
                  if(res.data.contentType==10){
                    res.data.imgUrls = res.data.contentUrl.split(',')
                  };
                  this.showData = res.data;
                }
            })
        },
        // 视频控制相关
        showFullScreen(){
          if (!this.vcIsFull) {
            this.vcIsFull = true;
          } else {
            this.vcIsFull = false;
          }
        },
        videoTimeUpdate(){
          if(this.$refs.video){
            var currTime =this.$refs.video.currentTime;
            var duration =this.$refs.video.duration;
            this.vcCurrentTime = this.getFormatVideoTime(currTime);
            var pre = currTime / duration;
            this.vcProgress = pre*100;
            if(pre == 1){
              this.videoPlay();
            }
          };
        },
        changeSrc(){
          if(this.changeBtn == '播放完整视频'){
            this.changeBtn = '播放审核视频';
            this.$refs['video'].src = this.showData.contentVideoUrl;
          }else{
            this.changeBtn = '播放完整视频';
            this.$refs['video'].src = this.showData.contentVideoUrl;
          };
          this.$refs['video'].currentTime = 0;
        },
        getVideoTime(e){
          this.editDeptForm.videoWidth = e.target.videoWidth;
          this.editDeptForm.videoHeight = e.target.videoHeight;
          if(!this.changeBtn){
            this.changeBtn = '播放完整视频';
          };
        },
        showerrormsg(e){
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
          console.log(this.vcIsPlay)
            if(this.vcIsPlay){
              this.$refs.video.pause();
            }else{
              this.$refs.video.play();
            }
            this.vcIsPlay = !this.vcIsPlay;
        },
        onplay(){
          if(!this.vcIsPlay){
            this.vcIsPlay = true;
          };
        },
        progressControl(event){
          var mediaplayer = document.querySelector("#media");
          var progress_width = document.querySelector(".videoContent");
          var newCoor = event.pageX,
            offLeft = progress_width.getClientRects()[0].left, //距左边的距离
            progress_list_width = progress_width.offsetWidth,
          curPlay = newCoor - offLeft; //拖到的新的位置
          var newLocation = curPlay / progress_list_width * mediaplayer.duration;
          mediaplayer.currentTime = newLocation;
        },
        mutedControl(){
          var player = document.querySelector("#media");
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
          var video = document.querySelector("#media");
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
          console.log(event)
          var voice_box = document.querySelector(".voice-box");
          var player = document.querySelector("#media");
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
            var time = time;
            var m = parseInt(time%3600/60),
                s = parseInt(time%60);
            m = m < 10 ? "0"+m : m;
            s = s < 10 ? "0"+s : s;
            return m+":"+s;
        },
        getRandom(num){
            return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
        }
    }
}
</script>

<style lang='scss'>
  .sub .el-dialog{
    width:50% !important;
  }
  .elradio{
    margin-right:20px;
  }
  .inlinetop{
    vertical-align: top;
    display: inline-block;
    float: none;
  }
  .showallpic{
    max-width: 750px;
    display: flex;
    flex-wrap: wrap;
  }
  .showallpic .showImg{
    width:33.33%;
    margin-bottom:5px;
  }
.sub{
  .el-col-10{
    min-width: unset !important;
  }
  .grid-content{
    text-align: left;
    padding-right: 10px;
    text-indent: 10px
  }
  .detail-bg{
    text-align: right;
    justify-content: flex-end;
  }
  .demo-ruleForm{
    padding: 30px 30px 10px 50px;
  }
}
.subdialog .el-dialog__body{
  padding:0!important;
}
.subdialog .el-dialog__header{
  position: absolute;
  height: 25px;
  width: 15px;
  right: -55px;
  background-color: transparent;
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
  height:300px;
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
  line-height: 30px;
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
  }
  .videoControll{
    position: absolute;
    left:0;
    width:100%;
    z-index:10;
    background-color:rgba(0,0,0,0.4);
    bottom:0;
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
        font-size:24px;
        margin-right:10px;
      }
      .vcFullBtn{
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
.videobox{
  height:300px;
}
.sub .el-icon-circle-close:before{
  font-size:40px;
  color:#fff;
}
</style>
