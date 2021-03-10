<template>
  <div class="mainvideo">
    <div class="loadingvideo" v-if="loading">
      <div>
        <i class="el-icon-loading" style="text-indent:0;font-size:40px;"></i>
        <p>正在加载</p>
      </div>
    </div>
    <div :class="[vcIsFull ? 'onfull' : 'infull', { little: loading == true }]">
      <div class="errshow" v-if="error">{{ error }}</div>
      <div class="videoContent" ref="videocontent" v-else>
        <div class="redirect" v-if="stopshow && stopcontent.categoryValue">
          <div class="contentredir">
            <div class="rightclose" @click="stopshow = false">
              <van-icon name="cross" />
            </div>
            <div class="lefttitle">广告</div>
            <img
              :src="stopcontent.contentUrl"
              @click="loadTo(stopcontent)"
              alt=""
            />
          </div>
        </div>
        <div class="controlBody">
          <div
            class="fullout"
            @click="toplay"
            v-if="showplay"
            :style="{ backgroundImage: 'url(' + content.mainImageUrl + ')' }"
          >
            <img
              style="width:36px;height:36px;"
              src="../assets/play@2x.png"
              alt=""
            />
          </div>
          <div
            class="fullout"
            style="z-index:8;"
            v-if="overbtn"
            @click="toshowoverbtn"
          ></div>
          <div
            class="closefull"
            v-if="!overbtn && vcIsFull"
            @click="showFullScreen"
          >
            <img
              style="width: 13px;height: 23px;"
              src="../assets/BacArrow@2x.png"
              alt=""
            />
          </div>
          <!-- <div class="shade" @click="videoPlay"></div> -->
          <div class="shade" v-if="staticshow && (!loading && !overbtn)">
            <p style="text-align:center;">
              <span @click="controlPlay(false)"
                ><img
                  style="width:36px;height:36px;"
                  src="../assets/left@2x.png"
                  alt=""
              /></span>
              <span @click="videoPlay" style="margin:0 30px;">
                <img
                  style="width:36px;height:36px;"
                  v-show="!vcIsPlay"
                  src="../assets/play@2x.png"
                  alt=""
                />
                <img
                  style="width:36px;height:36px;"
                  v-show="vcIsPlay"
                  src="../assets/stop@2x.png"
                  alt=""
                />
              </span>
              <span @click="controlPlay(true)"
                ><img
                  style="width:36px;height:36px;"
                  src="../assets/right@2x.png"
                  alt=""
              /></span>
              <!-- <div class="mute" @click="mutedControl"> -->
              <!-- <img v-if="!muted" style="width:13px;height:13px;" src="../assets/sm@2x.png" alt=""> -->
              <!-- <img v-if="muted" style="width:13px;height:13px;" src="../assets/wm@2x.png" alt=""> -->
              <!-- </div> -->
            </p>
          </div>
          <div
            class="shade"
            style="bottom:0;"
            v-if="!staticshow && (!loading && !overbtn)"
          >
            <div style="text-align:center;">
              <div style="display:inline-block" @click="repPlay">
                <img
                  style="width:36px;height:36px;"
                  src="../assets/c@2x.png"
                  alt=""
                />
                <p class="white" style="font-size:14px;">重播</p>
              </div>
              <span
                style="margin:0 30px;"
                v-if="tofull && content.contentVideoUrl"
              ></span>
              <div
                style="display:inline-block"
                @click="playAll"
                v-if="tofull && content.contentVideoUrl"
              >
                <img
                  style="width:36px;height:36px;"
                  src="../assets/w@2x.png"
                  alt=""
                />
                <p class="white" style="font-size:14px;">完整视频</p>
              </div>
            </div>
          </div>
          <!-- 控制器 -->
          <div></div>
          <div
            class="videoControl"
            v-if="!showplay && !overbtn && showctrol"
            :style="{ display: loading ? 'none' : 'block' }"
          >
            <div ref="vcontrol" class="vcontrol">
              <div class="vcTop">
                <!-- 播放时间 -->
                <div title="播放时间">
                  <span style="cursor:pointer">{{ vcCurrentTime }}</span>
                </div>
                <!-- 进度 -->
                <div
                  class="vcBottom"
                  :style="{ width: vcIsFull ? '50%' : '68%' }"
                >
                  <div class="up" @click="progressControl">
                    <div
                      class="centercolor"
                      :style="{ width: (vcProgress * 100) / 100 + '%' }"
                    ></div>
                    <div
                      class="voice-btn"
                      :style="{
                        left: 'calc(' + (vcProgress * 100) / 100 + '% - 5px)'
                      }"
                    ></div>
                  </div>
                </div>

                <div>
                  <span> {{ vcTotalTime }}</span>
                </div>
                <div
                  v-if="vcIsFull && actionsList.length > 0"
                  @click="checkbtn"
                >
                  <template v-if="tofull">
                    <span class="btn">完整视频</span>
                  </template>
                  <template v-if="!tofull">
                    <span class="btn">{{ resolvingBtn }}</span>
                  </template>
                </div>
                <!-- 全屏 -->
                <div class="vcFullBtn" title="全屏" @click="showFullScreen()">
                  <img
                    style="width:15px;height:15px;"
                    src="../assets/view@2x.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- autoplay -->
        <!-- :muted="muted" -->
        <video
          id="media"
          @loadedmetadata="getVideoTime"
          @ended="endVideo"
          @pause="videoOnPause"
          @error="showerrormsg"
          crossOrigin="anonymous"
          @playing="onplaying"
          @canplay="videoCanPlay()"
          @timeupdate="videoTimeUpdate()"
          webkit-playsinline="true"
          playsinline="true"
          x5-playsinline
          x5-video-player-type="h5-page"
          x-webkit-airplay="allow"
          ref="video"
        ></video>
        <div class="backgroundimg" :class="loading ? '' : 'backgroundimg'">
          <img
            :src="content.mainImageUrl"
            style="width: 100%; height: 100%; object-fit: fill;"
          />
        </div>
      </div>
      <van-action-sheet
        :round="false"
        v-model="show"
        :actions="actionsList"
        @select="onSelect"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "videoplay",
  props: ["content", "onplay"],
  data() {
    return {
      loading: true,
      error: null,
      overbtn: true,
      vcCurrentTime: "00:00", //当前进度
      vcTotalTime: "00:00", //总时长
      vcIsPlay: false, //video是否播放
      vcProgress: 0, //video进度
      muted: false, //是否静音
      volumeLength: 0, // 音量大小
      vcIsFull: false, //是否全屏
      changeBtn: "",
      videoWidth: "",
      videoHeight: "",
      showctrol: true,
      tofull: true,
      toChange: null,
      stopshow: false,
      staticshow: true,
      showplay: true,
      stopcontent: {},
      sendmsg: false,
      show: false,
      overtimer: null,
      resolvingBtn: "高清",
      actionsList: []
    };
  },
  computed: {
    listenStop() {
      return this.$store.state.stop;
    }
  },
  watch: {
    // 监听vuex中的停止状态判断是否是当前播放器并执行相应操作
    listenStop() {
      if (!this.sendmsg) {
        this.showplay = true;
        this.tofull = true;
        this.staticshow = true;
        this.videoPause(1);
        setTimeout(() => {
          this.stopshow = false;
        }, 0);
      }
      this.sendmsg = false;
    }
  },
  beforeDestroy() {
    // 将video标签的url置空避免持续请求
    if (this.$refs.video) {
      this.$refs.video.src = null;
    }
  },
  created() {
    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      document.attachEvent("onkeydown", () => {
        if (event.keyCode == 27) {
          if (this.vcIsFull) {
            this.vcIsFull = false;
          }
        }
      });
    } else {
      document.addEventListener(
        "keydown",
        e => {
          if (e.which == 27) {
            if (this.vcIsFull) {
              this.vcIsFull = false;
            }
          }
        },
        false
      );
    }
  },
  mounted() {
    // 添加暂停图片
    let videoPauseAd = this.$store.state.videoPauseAd;
    this.stopcontent =
      videoPauseAd[Math.floor(Math.random() * videoPauseAd.length)];
    let play = this.$store.state.play;
    if (this.onplay && play.src) {
      this.onloadplay(play);
    } else {
      this.getVideoTime();
    }
  },
  methods: {
    onloadplay(play) {
      this.toChange = play.curTime;
      this.loading = false;
      this.setHlc(play.src);
      this.showplay = false;
      setTimeout(() => {
        this.videoPlay();
      }, 100);
    },
    setActionsList(url) {
      let playList = this.content.screenList;
      let list = [];
      if (playList.length > 0) {
        for (let index = 0; index < playList.length; index++) {
          const element = playList[index];
          if (element.screenSize == 1) {
            element.name = "标清";
          } else if (element.screenSize == 2) {
            element.name = "高清";
          } else if (element.screenSize == 3) {
            element.name = "超清";
          }
          if (url == element.mediaUrl) {
            this.resolvingBtn = element.name;
            element.color = "red";
          } else {
            element.color = "#fff";
          }
          list.push(element);
        }
        return (this.actionsList = list);
      } else {
        return (this.actionsList = []);
      }
    },
    toplay() {
      // 播放预览视频
      this.setHlc(this.content.previewVideoUrl);
      this.showplay = false;
      setTimeout(() => {
        this.videoPlay();
      }, 100);
    },
    // 设置播放地址，判断m3u8
    setHlc(url) {
      setTimeout(() => {
        this.setActionsList(url);
      }, 0);
      // 设置播放路径,存在flag时
      if (url.indexOf(".m3u8") == -1) {
        this.$refs.video.src = url;
        return;
      }
      var video = this.$refs.video;
      /*global Hls*/
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
      this.loading = false;
    },
    // 视频控制相关
    showFullScreen() {
      if (!this.vcIsFull) {
        this.vcIsFull = true;
      } else {
        this.vcIsFull = false;
      }
    },
    // 播放时间改变监听
    videoTimeUpdate() {
      if (this.$refs.video) {
        var currTime = this.$refs.video.currentTime;
        var duration = this.$refs.video.duration;
        this.vcCurrentTime = this.getFormatVideoTime(currTime);
        var pre = currTime / duration;
        this.vcProgress = pre * 100;
        // 当播放进度为1时暂停视频
        // if(pre == 1){
        //   this.videoPause();
        // }
      }
    },
    // 快进、快退按钮
    controlPlay(bool) {
      if (this.$refs.video) {
        if (bool) {
          this.$refs.video.currentTime += 10;
        } else {
          this.$refs.video.currentTime -= 10;
        }
      }
      this.clearoverbtn();
    },
    // 重播按钮
    repPlay() {
      this.overbtn = true;
      this.showctrol = true;
      this.$refs.video.currentTime = 0;
      this.staticshow = true;
      this.vcIsPlay = false;
      this.videoPlay();
    },
    // 播放完整视频按钮
    playAll() {
      this.showctrol = true;
      setTimeout(() => {
        // 视频列表超过两个时播放第二个
        console.log(this.actionsList);
        if (this.actionsList.length >= 2) {
          if (this.actionsList.length >= 2) {
            this.setHlc(this.actionsList[1].mediaUrl);
          } else {
            this.setHlc(this.actionsList[0].mediaUrl);
          }
        } else {
          this.setHlc(this.content.previewVideoUrl);
        }
        this.tofull = false;
        this.staticshow = true;
        this.vcIsPlay = false;
        this.videoPlay();
      }, 100);
    },
    // 展示控制组件
    toshowoverbtn() {
      this.overbtn = false;
      this.clearoverbtn();
    },
    // 延时关闭控制组件的展示
    clearoverbtn() {
      if (this.overtimer) {
        clearTimeout(this.overtimer);
      }
      this.overtimer = setTimeout(() => {
        if (this.vcIsPlay) {
          this.overbtn = true;
        }
      }, 2000);
    },
    // 完整视频和清晰度按钮
    checkbtn() {
      if (this.tofull) {
        this.playAll();
      } else {
        this.show = true;
      }
    },
    // 显示播放按钮
    getVideoTime() {
      this.loading = false;
    },
    // 当视频加载失败时错误信息
    showerrormsg(e) {
      if (e.target.src.indexOf("/null") > -1) return;
      let str;
      if (e.target.networkState == 3) {
        str = "没有找到资源";
      } else {
        str = "视频加载失败，请稍后再试";
      }
      this.loading = false;
      this.vcIsFull = false;
      this.error = str;
    },
    videoCanPlay() {
      if (this.$refs.video) {
        var duration = this.$refs.video.duration;
        this.vcTotalTime = this.getFormatVideoTime(duration);
      }
    },
    // 控制视频播放，当存在toChange时将播放时间置为已播放位置
    videoPlay() {
      this.clearoverbtn();
      if (this.vcIsPlay) {
        this.$refs.video.pause();
      } else {
        this.sendmsg = true;
        this.$store.commit("topause");
        setTimeout(() => {
          this.$refs.video.play();
          // 判断toCange有值时为切换清晰度播放
          if (this.toChange) {
            this.$refs.video.currentTime = this.toChange;
            this.toChange = null;
          }
        }, 0);
      }
      this.vcIsPlay = !this.vcIsPlay;
    },
    // 控制视频暂停，当存在flag时重置数据
    videoPause(flag) {
      this.clearoverbtn();
      if (this.vcIsPlay) {
        this.vcIsPlay = !this.vcIsPlay;
        this.$refs.video.pause();
        if (flag) {
          this.$refs.video.currentTime = 0;
          this.vcProgress = 0;
          this.setHlc(this.content.previewVideoUrl);
        }
      }
    },
    // 点击控制条执行的事件
    progressControl(event) {
      var mediaplayer = this.$refs.video;
      var progress_width = this.$refs.vcontrol;
      var newCoor = event.pageX,
        offLeft = progress_width.getClientRects()[0].left, //距左边的距离
        progress_list_width = progress_width.offsetWidth,
        curPlay = newCoor - offLeft; //拖到的新的位置
      var newLocation = (curPlay / progress_list_width) * mediaplayer.duration;
      mediaplayer.currentTime = newLocation;
    },
    // 静音控制，暂时不用
    mutedControl() {
      this.clearoverbtn();
      var player = this.$refs.video;
      player.muted = !player.muted;
      if (player.muted) {
        this.muted = true;
      } else {
        this.muted = false;
      }
    },
    // 监听视频是否在播放
    onplaying() {
      this.vcIsPlay = true;
      this.stopshow = false;
    },
    // 监听视频暂停事件
    videoOnPause() {
      this.vcIsPlay = false;
      if (this.$refs.video && !this.$refs.video.ended) {
        this.stopshow = true;
      }
    },
    // 声音控制条按钮，暂时不用
    voiceMove(event) {
      var voice_box = this.$refs.voicebox;
      var player = this.$refs.video;
      var clientX = event.pageX,
        ClientRect = voice_box.getBoundingClientRect().left, //相对于左边视口的距离
        volumeWidth = clientX - ClientRect;
      volumeWidth > voice_box.offsetWidth
        ? (volumeWidth = voice_box.offsetWidth)
        : volumeWidth;
      volumeWidth > 2 ? volumeWidth : (volumeWidth = 0);
      if (volumeWidth == 0) {
        this.muted = true;
        this.volumeLength = 0;
      } else {
        this.muted = false;
        var volumeLength = (volumeWidth / voice_box.offsetWidth).toFixed(2);
        player.volume = volumeLength;
        this.volumeLength = volumeLength;
      }
    },
    //格式化时间
    getFormatVideoTime(time) {
      var theTime = parseInt(time); // 秒
      var middle = 0; // 分
      var hour = 0; // 小时
      if (theTime > 60) {
        middle = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (middle > 60) {
          hour = parseInt(middle / 60);
          middle = parseInt(middle % 60);
        }
      }
      theTime = theTime < 10 ? "0" + theTime : theTime;
      middle = middle < 10 ? "0" + middle : middle;
      var result = theTime;
      if (middle > 0) {
        result = middle + ":" + result;
      } else {
        result = "00:" + result;
      }
      if (hour > 0) {
        result = parseInt(hour) + ":" + result;
      }
      return result;
    },
    // 视频播放结束事件
    endVideo() {
      this.staticshow = false;
      this.overbtn = false;
      this.vcIsPlay = false;
      this.showctrol = false;
    },
    // 跳转其他地址
    loadTo(content) {
      window.location.href = content.redirectUrl;
    },
    // 清晰度切换按钮
    onSelect(item) {
      this.toChange = this.$refs.video.currentTime;
      this.vcIsPlay = false;
      this.setHlc(item.mediaUrl);
      this.videoPlay();
      this.show = false;
    },
    getRandom(num) {
      return Math.floor(
        (Math.random() + Math.floor(Math.random() * 9 + 1)) *
          Math.pow(10, num - 1)
      );
    }
  }
};
</script>

<style lang="scss">
.mainvideo {
  height: 100%;
  width: 100%;
  position: relative;
  .white {
    color: #fff;
  }
  .loadingvideo {
    position: absolute;
    z-index: 2;
    text-align: center;
    text-indent: 0;
    line-height: 20px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    div {
      margin: 0 auto;
      top: 50%;
      position: relative;
      height: 40px;
      color: #fff;
      transform: translateY(-50%);
      width: 100px;
    }
  }
  #media {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
  }
  .infull {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .little.infull {
    height: 1px;
    width: 1px;
  }
  .closefull {
    height: 30px;
    padding-top: 15px;
    padding-left: 15px;
    font-size: 24px;
    position: fixed;
    z-index: 20;
    width: 30px;
  }
  .onfull {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    // object-fit: fill;
    background-color: #fff;
    height: 100%;
    z-index: 99999;
    .big {
      font-size: 34px;
      margin-top: 5px;
    }
    .van-action-sheet {
      background: transparent;
      .van-action-sheet__item {
        background: transparent;
        color: #fff;
      }
    }
  }
  .errshow {
    line-height: 40px;
    padding-top: 80px;
    color: #333;
  }
  .videoContent {
    width: 100%;
    height: 100%;
    text-indent: 0;
    overflow: hidden;
    position: relative;
    .redirect {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 11;
      text-align: center;
      justify-content: center; //子元素水平居中
      align-items: center; //子元素垂直居中
      display: -webkit-flex;
      .contentredir {
        position: relative;
        width: 50vw;
        height: 30vw;
        .lefttitle {
          position: absolute;
          left: 4%;
          top: 5%;
          font-size: 12px;
          color: #fff;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .rightclose {
          position: absolute;
          right: 4%;
          top: 4%;
          font-size: 14px;
          color: #fff;
          width: 14px;
          padding: 5px;
          height: 14px;
        }
      }
    }
    .backgroundimg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      background-color: #fff;
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -ms-filter: blur(5px);
      filter: blur(5px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5,MakeShadow=false);
    }
    .controlBody {
      height: 100%;
      width: 100%;
      position: absolute;
      .shade.single {
        bottom: 40px;
      }
      .fullout {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        text-align: center;
        justify-content: center; //子元素水平居中
        align-items: center; //子元素垂直居中
        display: -webkit-flex;
        // background-color:#fff;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        // -webkit-filter: blur(5px);
        // -moz-filter: blur(5px);
        // -ms-filter: blur(5px);
        // filter: blur(5px);
        // filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5,MakeShadow=false);
      }
      .shade {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        width: 100%;
        bottom: 30px;
        z-index: 8;
        text-align: center;
        justify-content: center; //子元素水平居中
        align-items: center; //子元素垂直居中
        display: -webkit-flex;
        font-size: 34px;
        .mute {
          width: 13px;
          height: 13px;
          padding: 5px;
          position: absolute;
          bottom: 50px;
          right: 15px;
          font-size: 0;
        }
      }
      .videoControl {
        position: absolute;
        left: 0;
        width: 100%;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.4);
        bottom: 0;

        .vcontrol.single {
          width: 100%;
          margin-left: 0;
          height: 40px;
        }
        .vcontrol {
          float: left;
          font-size: 12px;
          width: calc(100% - 30px);
          height: 100%;
          margin: 0 15px;
          height: 30px;
          .vcTop {
            padding: 0;
            margin: 0;
            line-height: 200px;
            list-style: none;
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            color: #fff;
            -webkit-flex-flow: row nowrap;
            justify-content: space-between;
            height: 30px;
            line-height: 30px;
            .vcPlayBtn {
              cursor: pointer;
              margin-right: 10px;
              font-size: 24px;
            }
            .btn {
              display: inline-block;
              padding: 4px;
              height: 14px;
              line-height: 14px;
              border: 1px solid #ccc;
            }
            .volumecontrol {
              display: table-cell;
              vertical-align: middle;
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
              .voice-btn {
                position: absolute;
                top: 9px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
              }
            }
            .captureBtn {
              cursor: pointer;
              font-size: 24px;
              margin-right: 10px;
            }
            .vcFullBtn {
              cursor: pointer;
              font-size: 24px;
            }
          }
          .vcBottom {
            position: relative;
            // width:68%;
            padding-top: 4px;
            height: 22px;
            .up {
              position: relative;
              top: 9px;
              height: 4px;
              cursor: pointer;
              background-color: rgba(255, 255, 255, 0.3);
              &:before {
                content: "";
                position: absolute;
                top: -9px;
                left: 0;
                bottom: -9px;
                right: 0;
              }
              .centercolor {
                height: 4px;
                margin-top: 0px;
                width: 0px;
                top: 0px;
                position: absolute;
                background-color: #ee5252;
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
        .vcPlayTime {
          margin-right: 10px;
          position: absolute;
          bottom: 0;
          color: #fff;
          line-height: 22px;
          right: 50px;
        }
      }
    }
  }
}
</style>
