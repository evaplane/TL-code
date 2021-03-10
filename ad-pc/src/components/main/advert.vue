<template>
  <div class="bodyvertbody" v-if="show">
    <div class="closeAd" @click="closeAd"><img src="../../assets/c@2x.png" alt=""></div>
    <div class="showad">广告</div>
    <!-- <div class="showtime" v-if="vertData.contentType == 20&&videotime">{{videotime}}</div> -->
    <div class="shade" @click="onAdvertClick(vertData)"></div>
    <el-carousel trigger="click" indicator-position="none" ref="carousel" arrow="never" :interval="2000">
      <el-carousel-item v-for="(url,i) in vertData.contentUrl" :key="i">
        <div v-if="vertData.contentType == 10" style="position:absolute;width:100%;height:100%">
          <div v-if="isIE" class="ieimg" :style="{'background-image':'url('+url+')'}"></div>
          <img v-else class="img" v-lazy="url" :key="url" style="width:100%;height:100%;">
        </div>
        <div v-else style="height:100%;position:relative;">
          <video 
            class="vert" 
            style="height:100%;width:100%;object-fit:cover;"
            playsinline=""
            preload="auto"
            autoplay="autoplay"
            muted
            :src="url"
            @loadedmetadata="loadvideo"
            type="video/mp4"
            loop=""
            ></video>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "bodyvertbody",
  data() {
    return {
      videotime:null,
      show:true,
      isIE:false
    };
  },
  props: ['vertData'],
  created() {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      this.isIE = true;
    }
    if(this.vertData.contentType == 10){
      this.vertData.contentUrl = this.vertData.contentUrl.split(",");
    }else{
      this.vertData.contentUrl = [this.vertData.contentUrl];
    }
  },
  mounted() {
  },
  methods: {
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
    loadvideo(e){
      this.videotime = this.getFormatVideoTime(e.target.duration);
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
    closeAd(){
      this.show = false;event.stopPropagation();
    },
  }
};
</script>
<style  lang="scss">
  .bodyvertbody{
    position: relative;
    .closeAd,.showad,.showtime{
      position: absolute;
      z-index: 3;
    }
    .closeAd{
      width:26px;
      z-index: 10;
      height:26px;
      cursor: pointer;
      top:0;
      right:0;
      img{
        width:100%;
        height:100%;
        object-fit: cover;
      }
    }
    .showad{
      line-height: 20px;
      font-size: 12px;
      padding: 0 7px;
      color:#fff;
      top:10px;
      left:10px;
      background:rgba(0,0,0,0.4);
    }
    .showtime{
      line-height: 20px;
      font-size: 12px;
      padding: 0 7px;
      color:#fff;
      bottom:20px;
      right:10px;
      background:rgba(0,0,0,0.4);
    }
    .shade{
      position:absolute;
      top:0;
      left:0;
      height:100%;
      width:100%;
      z-index:8;
      cursor: pointer;
    }
  }
</style>
