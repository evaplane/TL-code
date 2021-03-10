<template>
  <div class="playAdCard">
    <template v-if="data && data.contentType">
      <div class="maincard">
        <template v-if="data && data.contentType == 20">
          <videoPlay
            style="height:211px;width:100%;"
            :content="content"
          ></videoPlay>
        </template>
        <div v-if="data && data.contentType == 10">
          <van-grid style="height:100%;" :column-num="picList.length">
            <van-grid-item v-for="value in picList" :key="value">
              <img
                style="width:100%;height:100%;"
                @click="toview"
                :src="value"
                alt=""
              />
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <div class="infocard" @click="toview">
        <van-col span="3">
          <div style="height:30px;width:30px;padding:7px 0;padding-left:15px;">
            <img
              style="width:100%;height:100%"
              src="../assets/imgad@2x.png"
              alt=""
            />
          </div>
        </van-col>
        <van-col
          span="18"
          class="contwhite"
          style="line-height:44px;height: 44px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
        >
          {{ data.advtName }}<span class="titlead">广告</span>
        </van-col>
        <van-col span="3" class="rightbtn">
          <van-col class="icon" style="padding-right:8px;">
            <img src="../assets/s111@2x.png" alt="" />
          </van-col>
          <van-col class="icon"></van-col>
          <van-col class="icon"> </van-col>
        </van-col>
      </div>
    </template>
    <template v-else>
      <div class="error">
        <p>内容ID[{{ data }}]不存在</p>
      </div>
    </template>
  </div>
</template>

<script>
import videoPlay from "./video";
export default {
  name: "playad",
  props: {
    data: Object
  },
  data() {
    return {};
  },
  components: {
    videoPlay
  },
  computed: {
    picList() {
      if (this.data.contentType == 10) {
        return this.data.contentUrl.split(",");
      } else {
        return null;
      }
    },
    content() {
      if (this.data.contentType == 20) {
        let content = this.data;
        content.previewVideoUrl = content.contentUrl;
        content.mainImageUrl = content.thumbnailUrl;
        return content;
      } else {
        return null;
      }
    }
  },
  methods: {
    toview() {
      window.location.href = this.data.redirectUrl;
    }
  }
};
</script>

<style lang="scss">
.playAdCard {
  ::-webkit-scrollbar {
    display: none;
  }
  position: relative;
  .contwhite {
    color: #333;
  }
  .maincard {
    position: relative;
    // z-index: 1;
    .van-image {
      display: block;
    }
    .fullout {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      text-align: center;
      justify-content: center; //子元素水平居中
      align-items: center; //子元素垂直居中
      display: -webkit-flex;
      font-size: 36px;
    }
    .outfull {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      text-align: center;
      justify-content: center; //子元素水平居中
      align-items: center; //子元素垂直居中
      display: -webkit-flex;
      img {
        width: 36px;
        height: 36px;
      }
    }
    .van-grid-item {
      height: 100%;
    }
    .van-grid-item__content {
      padding: 0px 5px;
      height: 100%;
    }
    .van-grid-item:first-child {
      .van-grid-item__content {
        padding-left: 0;
      }
    }
    .van-grid-item:last-child {
      .van-grid-item__content {
        padding-right: 0;
      }
    }
  }
  .infocard {
    height: 44px;
    position: relative;
    font-size: 14px;
    z-index: 3;
    .titlead {
      display: inline-block;
      border: 1px solid #ee5252;
      height: 24px;
      line-height: 24px;
      width: 40px;
      color: #ee5252;
      margin-left: 10px;
      border-radius: 10px;
      text-align: center;
    }
    .icon {
      text-align: center;
      line-height: 44px;
      font-size: 30px;
      float: right;
      margin: 0 7px;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .rightbtn {
      position: relative;
      .outfull {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
      }
    }
  }
  .classifylist {
    .van-tabs__nav {
      background-color: #fff;
    }
    .van-tab {
      color: #333;
    }
    .van-tab--active {
      color: #ee5252;
    }
  }
  .error {
    height: 200px;
    p {
      height: 100px;
      color: #333;
      line-height: 200px;
      text-align: center;
    }
  }
}
</style>
