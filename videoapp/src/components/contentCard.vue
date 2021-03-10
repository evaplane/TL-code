<template>
  <div class="contentCard">
    <template v-if="data && data.userId">
      <div class="maincard">
        <template v-if="data && data.uploadWay == 2">
          <videoPlay ref="myplay" :content="data"></videoPlay>
        </template>
        <!-- <img  v-if="data&&data.uploadWay == 2" style="width:100%;height:211px;" v-lazy="data.mainImageUrl" /> -->
        <div v-if="data && data.uploadWay == 1" class="piccontent">
          <van-grid
            style="height:100%;"
            v-if="picList.length <= 3"
            :column-num="picList.length"
          >
            <van-grid-item v-for="value in picList" :key="value">
              <img
                style="width:100%;height:100%;"
                @click="toview"
                :src="value"
                alt=""
              />
            </van-grid-item>
          </van-grid>
          <ul
            v-else
            style="overflow-y:hidden;overflow-x:auto;white-space: nowrap;height:100%;"
          >
            <li class="cardlist" v-for="value in picList" :key="value">
              <img :src="value" @click="toview" alt="" />
            </li>
          </ul>
        </div>
      </div>
      <div class="infocard">
        <van-col span="3" @click="touser">
          <div style="height:30px;width:30px;padding:7px 0;padding-left:15px;">
            <van-image round width="100%" height="100%" :src="data.avatarImg">
              <template v-slot:error>
                <img :src="`${publicPath}img/icons/favicon-32x32.png`" alt="" />
              </template>
            </van-image>
          </div>
        </van-col>
        <van-col
          span="10"
          class="contwhite"
          style="line-height:44px;height: 44px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
        >
          {{ data.contentTitle }}
        </van-col>
        <van-col span="11" class="rightbtn">
          <!-- <van-col class="icon" style="padding-right:8px;" @click="toview">
              <img src="../assets/s111@2x.png" alt="">
            </van-col> -->
          <van-col class="icon" @click="toview" style="padding-right:8px;">
            <img src="../assets/comment1@2x.png" alt="" /><span
              class="contwhite"
              style="font-size:18px;vertical-align: bottom;"
            >
              {{ data.commentCount >= 0 ? data.commentCount : 0 }}</span
            >
          </van-col>
          <van-col class="icon" @click="favorite">
            <img
              v-if="!data.favoriteFlag"
              src="../assets/gwhite1@2x.png"
              alt=""
            />
            <img v-if="data.favoriteFlag" src="../assets/g-2@2x.png" alt="" />
            <span
              class="contwhite"
              style="font-size:18px;vertical-align: bottom;"
            >
              {{ data.favoriteCount >= 0 ? data.favoriteCount : 0 }}</span
            >
          </van-col>
        </van-col>
      </div>
    </template>
    <template v-else>
      <div class="error">
        <p>内容ID[{{ data.contentId }}]不存在</p>
      </div>
    </template>
    <!-- <p>{{data}}</p> -->
  </div>
</template>

<script>
import videoPlay from "./video";
export default {
  name: "contentCard",
  props: {
    data: Object
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      Player: null,
      onplay: false,
      classifyActive: 0,
      showplay: true
    };
  },
  components: {
    videoPlay
  },
  computed: {
    picList() {
      if (this.data.uploadWay == 1) {
        return this.data.contentVideoUrl.split(",");
      } else {
        return [];
      }
    }
  },
  activated(){
    let count = window.sessionStorage.getItem(this.data.contentId);
    if(count){
      count = count.split(",");
      this.data.favoriteCount = count[0];
      this.data.favoriteFlag = Boolean(count[1]);
    }else{
      return;
    };
  },
  methods: {
    toview() {
      if (this.$refs.myplay) {
        this.$store.commit("playList", this.data.screenList);
        let data = {};
        if (this.$refs.myplay.$refs.video.src) {
          data.src = this.$refs.myplay.$refs.video.src;
          if (this.$refs.myplay.$refs.video.ended) {
            data.curTime = 0;
          } else {
            data.curTime = this.$refs.myplay.$refs.video.currentTime;
          }
        } else {
          data.src = this.$refs.myplay.content.previewVideoUrl;
          data.curTime = 0;
        }
        this.$store.commit("setPlay", data);
      }
      this.$router.push({
        path: "/view",
        query: {
          id: this.data.contentId,
          n:this.data.favoriteCount
        }
      });
    },
    favorite() {
      let favoriteFlag = this.data.favoriteFlag;
      if (favoriteFlag) {
        this.data.favoriteCount--;
      } else {
        this.data.favoriteCount++;
      };
      this.$post("api/fig-manager/api/user/favorite", {
        contentId: this.data.contentId,
        type: !this.data.favoriteFlag ? 1 : 0,
        userId: this.$store.state.info.id
      }).then(() => {});
      this.data.favoriteFlag = !favoriteFlag;
    },
    touser() {
      this.$router.push({
        path: "/user",
        query: {
          id: this.data.userId,
          name: this.data.nickName
        }
      });
    }
  }
};
</script>

<style lang="scss">
.contentCard {
  ::-webkit-scrollbar {
    display: none;
  }
  position: relative;
  .contwhite {
    color: #333;
  }
  .maincard {
    height: 56vw;
    position: relative;
    .piccontent{
      height:100%;
    }
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
.cardlist {
  display: inline-table;
  height: 100%;
  vertical-align: top;
  width: calc(33.33% - 5px);
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
.cardlist:last-child {
  margin-right: 0;
}
</style>
