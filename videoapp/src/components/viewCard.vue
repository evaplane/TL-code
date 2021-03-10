<template>
  <div class="contentCard">
    <div class="maincard">
      <template v-if="contentData && contentData.uploadWay == 2">
        <videoPlay
          style="height:200px;width:100%;"
          :onplay="true"
          :content="contentData"
        ></videoPlay>
      </template>
      <van-swipe
        v-if="contentData && contentData.uploadWay == 1"
        :autoplay="3000"
        style="height:211px;"
      >
        <van-swipe-item v-for="(image, index) in contentimages" :key="index">
          <img
            style="width:100%;height:100%;"
            @click="picPreview(index)"
            v-lazy="image"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="viewbody">
      <van-row style="padding:0 15px;">
        <van-col span="2">
          <div style="height:30px;width:30px;padding:7px 0;" @click="touser">
            <van-image
              round
              width="100%"
              height="100%"
              v-if="contentData && contentData.avatarImg"
              :src="contentData.avatarImg"
            />
          </div>
        </van-col>
        <van-col span="1"></van-col>
        <van-col span="15" class="userinfo">
          <van-cell
            v-if="contentData && contentData.contentTitle"
            :title="contentData.contentTitle"
            :label="formatterDateTime3(contentData.createTime) + '发布'"
          />
        </van-col>
        <van-col span="6" class="right jubao" @click="show = true">
          举报
        </van-col>
      </van-row>
      <!-- <van-row class="control">
        <van-col span="6">
          <van-button class="btn" type="default">清晰度</van-button>
        </van-col>
        <van-col span="12">
        </van-col>
        <van-col span="6" class="right" @click="show=true">
          举报
        </van-col>
      </van-row> -->
      <van-row class="controlbtn">
        <van-col span="8" @click="toDownApp">
          <img src="../assets/xwhite@2x.png" alt="下载" /><span class="rightmsg"
            >下载</span
          >
        </van-col>
        <van-col span="8" @click="favorite" style="text-align:center;">
          <template v-if="contentData && !contentData.favoriteFlag">
            <img src="../assets/gwhite1@2x.png" />
            <span class="rightmsg">{{
              contentData.favoriteCount >= 0 ? contentData.favoriteCount : 0
            }}</span>
          </template>
          <template v-if="contentData && contentData.favoriteFlag">
            <img src="../assets/g-2@2x.png" />
            <span class="rightmsg">{{
              contentData.favoriteCount >= 0 ? contentData.favoriteCount : 0
            }}</span>
          </template>
        </van-col>
        <van-col span="8" class="right" @click="reqOther">
          <img src="../assets/zwhite@2x.png" alt="转发" /><span class="rightmsg"
            >转发</span
          >
        </van-col>
      </van-row>
    </div>
    <van-popup class="popupshare" v-model="showshare">
      <p class="head">分享</p>
      <div class="content">
        {{ shareData }}
      </div>
      <div class="foot">
        <div class="btn" @click="showshare = false">复制</div>
      </div>
    </van-popup>
    <van-popup class="popupshare" style="height: 80%;" v-model="show">
      <van-cell
        v-for="(list, index) in reasonList"
        v-bind:key="index"
        :value="list.reason"
        @click="updateReason(list.reason)"
      />
    </van-popup>
  </div>
</template>

<script>
import videoPlay from "./video";
import { ImagePreview } from "vant";
import { mapState } from "vuex";
import { formatterDateTime3 } from "./../utls/utls.js";
export default {
  name: "viewCard",
  props: {
    contentData: Object
  },
  data() {
    return {
      config: {
        id: "vs",
        url: "http://chimee.org/vod/1.mp4"
      },
      Player: null,
      onplay: false,
      showplay: true,
      show: false,
      contentimages: [],
      showshare: false,
      shareData: null,
      reasonList: []
    };
  },
  components: {
    videoPlay
  },
  computed: {
    ...mapState(["shareUrl"])
  },
  watch: {
    contentData: {
      handler(newValue,oldvalue) {
        if(!oldvalue){
          let count = this.$route.query.n;
          if(count){
            this.contentData.favoriteCount = count;
          };
        }
        if (newValue.uploadWay == 1) {
          this.contentimages = newValue.contentVideoUrl.split(",");
        }
      },
      deep: true
    }
  },
  created() {
    this.getInformReasonList();
  },
  mounted(){
  },
  methods: {
    reqOther() {
      this.shareData = this.shareUrl
        .replace("<userId>", this.$store.state.info.id)
        .replace("<contentId>", this.contentData.contentId);
      this.showshare = true;
    },
    getInformReasonList() {
      this.$post("api/fig-manager/api/content/findInformReasonList").then(
        res => {
          this.reasonList = res.data.dataList;
        }
      );
    },
    favorite() {
      let favoriteFlag = this.contentData.favoriteFlag;
      if (favoriteFlag) {
        this.contentData.favoriteCount--;
      } else {
        this.contentData.favoriteCount++;
      };
      console.log(this.contentData.favoriteCount);
      window.sessionStorage.setItem(this.contentData.contentId,this.contentData.favoriteCount+','+!favoriteFlag);
      this.$post("api/fig-manager/api/user/favorite", {
        contentId: this.contentData.contentId,
        type: !favoriteFlag ? 1 : 0,
        userId: this.$store.state.info.id
      }).then(() => {});
      this.contentData.favoriteFlag = !favoriteFlag;
    },
    updateReason(reason) {
      this.show = false;
      this.$post("api/fig-manager/api/content/inform", {
        contentId: this.contentData.contentId,
        reason: reason,
        userId: this.$store.state.info.id
      }).then(res => {
        if (res.code === "000000") {
          this.$toast.success("举报成功");
        } else {
          this.$toast.fail("举报失败");
        }
      });
    },
    formatterDateTime3(date, bool) {
      return formatterDateTime3(date, bool);
    },
    touser() {
      this.$router.push({
        path: "/user",
        query: {
          id: this.contentData.userId,
          name: this.contentData.nickName
        }
      });
    },
    toDownApp() {
      window.location.href = this.$toapp;
    },
    picPreview(index) {
      console.log(111);
      ImagePreview({
        images: this.contentimages,
        showIndex: true,
        loop: false,
        startPosition: index
      });
      // console.log(event)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.contentCard {
  .maincard {
    height: 211px;
    position: relative;
    .van-image {
      display: block;
    }
    .fullout {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      text-align: center;
      justify-content: center; //子元素水平居中
      align-items: center; //子元素垂直居中
      display: -webkit-flex;
      font-size: 36px;
    }
  }
  .jubao {
    line-height: 40px;
    color: #ccc;
    text-align: right;
    font-size: 10px;
  }
  .userinfo {
    .van-cell {
      background-color: #fff;
      color: #333;
      padding: 0;
      font-weight: 600;
      .van-cell__label {
        margin-top: -2px;
        font-weight: 100;
      }
    }
  }
  .controlbtn {
    padding: 0 15px 15px 15px;
    font-size: 9px;
    line-height: 35px;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    .rightmsg {
      display: inline-block;
      vertical-align: middle;
    }
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .right {
      text-align: right;
    }
  }
  .popupshare {
    width: 80%;
    border-radius: 10px;
    .head {
      text-align: center;
      font-size: 18px;
      color: #333;
      font-weight: 400;
      margin: 20px auto 0;
    }
    .content {
      margin: 15px 20px;
      word-wrap: break-word;
      background-color: #e1e1e1;
      color: #333333;
      padding: 12px 15px;
      border-radius: 10px;
    }
    .foot {
      width: 165px;
      height: 50px;
      margin: 0 auto;
      padding-top: 10px;
      text-align: center;
      .btn {
        height: 32px;
        color: #fff;
        line-height: 32px;
        background-color: #f92255;
        border-radius: 5px;
      }
    }
  }
}
</style>
