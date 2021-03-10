<template>
  <div class="home">
    <van-popup
      v-model="show"
      class="leftcontent"
      position="left"
      :style="{ height: '100%', width: '70%' }"
    >
      <div>
        <div>
          <van-row>
            <van-col span="8">
              <div style="height:50px;width:50px;padding:10px 15px;">
                <van-image
                  round
                  @click="toshow"
                  width="100%"
                  height="100%"
                  :src="`${publicPath}img/icons/favicon-32x32.png`"
                />
              </div>
            </van-col>
            <van-col span="12" style="line-height:70px;">
              {{ info.nickName }}
            </van-col>
          </van-row>
          <van-row>
            <van-cell :title="titleMessage" />
          </van-row>
        </div>
        <van-cell title="观看历史" @click="tohistory" is-link />
        <!-- <van-cell title="离线缓存" @click="toDownApp" is-link /> -->
        <van-cell title="版本号" value="1.0.0" />
        <!-- <van-row style="text-align:center;">
        <van-button round type="info" to="user" style="width:60%;margin-top:20px">我的作品</van-button>
      </van-row> -->
      </div>
    </van-popup>
    <div class="homehead">
      <van-row>
        <van-col span="6">
          <div
            style="height:30px;width:30px;padding-top:7px;padding-left:15px;"
          >
            <van-image
              round
              @click="toshow"
              width="100%"
              height="100%"
              :src="`${publicPath}img/icons/favicon-32x32.png`"
            />
          </div>
        </van-col>
        <van-col span="12">
          <van-tabs class="classifylist" v-model="active">
            <van-tab title="热门"></van-tab>
            <van-tab title="分类"></van-tab>
            <van-tab title="收藏"></van-tab>
          </van-tabs>
        </van-col>
        <van-col span="6" class="icon" @click="toDownApp">
          <img src="../assets/camera-2@2x.png" alt="" />
        </van-col>
      </van-row>
    </div>
    <div class="homecontent" v-if="active == 0">
      <van-list
        v-model="loading"
        v-if="active == 0&&!scnodatamide"
        ref="hot"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoadA"
      >
        <template v-for="(content, index) in forHomeList">
          <template v-if="!content.redirectUrl">
            <contentCard :data="content" v-bind:key="index"></contentCard>
          </template>
          <template v-else>
            <playad :data="content" v-bind:key="index"></playad>
          </template>
        </template>
      </van-list>
      <van-row v-if="scnodatamide" class="nodata">
        <img style="width:100%;" src="../assets/nodata@2x.png" alt="" />
        <p @click="reloadhtml">网络异常，点此刷新</p>
      </van-row>
    </div>
    <div class="homecontent" v-if="active == 1">
      <van-row>
        <div class="lineonepx"></div>
        <van-col span="24">
          <van-tabs
            class="classifylist"
            v-model="classifyActive"
            swipeable
            lineHeight="0px;"
          >
            <van-tab
              v-for="label in labelList"
              :title="label.categoryName"
              :name="label.id"
              v-bind:key="label.id"
            ></van-tab>
          </van-tabs>
        </van-col>
      </van-row>
      <van-row v-if="!nodata">
        <van-grid :column-num="checked ? 3 : 4">
          <van-grid-item
            v-for="sub in subLeft"
            :key="sub.id"
            @click="toClassify(sub)"
          >
            <div
              class="classify caldpal"
              :style="{
                backgroundImage: 'url(' + sub.categoryUrl + ')',
                borderRadius: checked ? '0' : '50%',
                width: checked ? '100%' : '60%',
                'padding-bottom': checked ? '100%' : '60%'
              }"
            ></div>
            <p class="classifyName">{{ sub.categoryName }}</p>
          </van-grid-item>
        </van-grid>
      </van-row>
      <van-row v-if="nodata" class="nodata">
        <!-- <img style="width:100%;" src="../assets/nodata@2x.png" alt=""> -->
        <p style="margin:20px 0;">当前分类下无内容</p>
      </van-row>
      <van-row v-if="subRight.length > 0">
        <p class="moreclassify">更多分类</p>
      </van-row>
      <van-row v-if="subRight.length > 0">
        <van-grid :column-num="checked ? 3 : 4">
          <template v-for="(value, index) in subRight">
            <van-grid-item
              :key="value.id"
              @click="toClassify(value)"
              v-if="downArrow ? index < (checked ? 3 : 4) : true"
              style="overflow:hidden;"
            >
              <div
                class="classify"
                :style="{
                  backgroundImage: 'url(' + value.categoryUrl + ')',
                  borderRadius: checked ? '0' : '50%',
                  width: checked ? '100%' : '60%',
                  'padding-bottom': checked ? '100%' : '60%'
                }"
              ></div>
              <p class="classifyName">{{ value.categoryName }}</p>
            </van-grid-item>
          </template>
        </van-grid>
      </van-row>
      <van-row
        style="text-align:center;"
        v-show="downArrow && subRight.length > (checked ? 3 : 4)"
        @click="downArrow = false"
      >
        <img
          style="width:18px;height:10px;"
          src="../assets/downww@2x.png"
          alt=""
        />
      </van-row>
      <van-row v-if="toBigSwitch">
        <van-col span="6" class="bigcontrol">大缩略图</van-col>
        <van-col span="12"> </van-col>
        <van-col span="4" style="text-align: right;">
          <van-switch v-model="checked" class="switchbig" size="18px" />
        </van-col>
      </van-row>
    </div>
    <div class="homecontent" v-if="active == 2">
      <!-- v-if="active == 2" -->
      <van-row>
        <van-list
          v-model="loading2"
          :finished="finished2"
          v-if="!scnodata"
          ref="favorite"
          finished-text="没有更多了"
          :immediate-check="false"
          :error.sync="error2"
          error-text="请求失败，点击重新加载"
          @load="getFavoriteList"
        >
          <template v-for="content in favoriteList">
            <contentCard
              :data="content"
              v-bind:key="content.contentId"
            ></contentCard>
          </template>
        </van-list>
      </van-row>
      <van-row v-if="scnodata" class="nodata">
        <img style="width:100%;" src="../assets/nodata@2x.png" alt="" />
        <p>当前没有任何收藏</p>
      </van-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import contentCard from "@/components/contentCard.vue";
import playad from "@/components/playad.vue";
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {
      publicPath: process.env.BASE_URL,
      active: 0,
      show: false,
      titleMessage: this.$store.state.appLaguage || "看视频就来视频APP",
      classifyActive: null,
      checked: false,
      loading: false,
      error: false,
      finished: false,
      scnodatamide:false,
      contentLists: [],
      reqDataA: {
        pageNum: 1,
        pageSize: 20
      },
      subLeft: [],
      subRight: [],
      labelList: [],
      sublabel: [],
      toBigSwitch: true,
      nodata: false,
      scnodata: false,
      downArrow: true,
      timer: null,
      favoriteList: [],
      reqDataB: {
        pageNum: 1,
        pageSize: 10
      },
      loading2: false,
      finished2: false,
      error2: false
    };
  },
  components: {
    contentCard,
    playad
  },
  computed: {
    ...mapState(["info", "homeAd"]),
    forHomeList() {
      if (this.homeAd.length > 0 && this.contentLists.length > 0) {
        let homeAd = this.homeAd;
        var contentData = [];
        for (var i = 0, len = this.contentLists.length; i < len; i += 10) {
          contentData.push(this.contentLists.slice(i, i + 10));
        }
        for (let index = 0; index < contentData.length; index++) {
          let data = homeAd[Math.floor(Math.random() * homeAd.length)];
          if (index !== contentData.length - 1) {
            contentData[index].push(data);
          }
        }
        return [].concat.apply([], contentData);
      } else {
        return this.contentLists;
      }
    }
  },
  mounted() {
    this.scrollTop();
  },
  watch: {
    checked(val) {
      let length = val ? 6 : 8;
      if (this.sublabel.length > length) {
        this.subLeft = this.sublabel.slice(0, length);
        this.subRight = this.sublabel.slice(length);
      } else {
        this.subLeft = this.sublabel.slice(0);
      }
    },
    active(val) {
      this.scrollTop();
      this.contentInit();
      if (val == 0) {
        // this.$nextTick(()=>{
        //   this.$refs.hot.check();
        //   console.log(1);
        // });
      } else if (val == 1) {
        this.getClass();
      } else if (val == 2) {
        this.$nextTick(() => {
          this.$refs.favorite.check();
        });
      }
    },
    classifyActive(active, oldactive) {
      if (oldactive && active) {
        this.loadSubLabel(active);
      }
    }
  },
  methods: {
    toDownApp() {
      window.location.href = this.$toapp;
    },
    reloadhtml(){
      window.location.reload();
    },
    scrollTop() {
      let that = this;
      // 取消一个通过调用requestAnimationFrame()方法添加到计划中的动画帧请求.
      cancelAnimationFrame(this.timer);
      /* requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，
        在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
        一般来说，这个频率为每秒60帧。 */
      this.timer = requestAnimationFrame(function sTop() {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (top > 0) {
          //使用定时器，将scrollTop的值每次减少20（自行设置），直到减少到0，则滚动完毕
          document.body.scrollTop = document.documentElement.scrollTop =
            top - 20;
          that.timer = requestAnimationFrame(sTop);
        } else {
          cancelAnimationFrame(that.timer);
        }
      });
    },
    // scroll_Top.addEventListener('click', scrollTop, false);
    onLoadA() {
      if(!this.info.id) return (this.scnodatamide = true);
      this.$post("api/fig-manager/api/content/findPopMediaList", {
        ...this.reqDataA,
        userId: Number(this.info.id)
      })
        .then(res => {
          if (!res.data||res.data.rows.length == 0) {
            return (this.scnodatamide = true);
          };
          res.data.rows.forEach(row => {
            if (row.avatarImg.indexOf("http") == -1&&row.avatarImg.indexOf(";base64,") == -1) {
              row.avatarImg = "data:image/png;base64," + row.avatarImg;
            }
          });
          this.contentLists = this.contentLists.concat(res.data.rows);
          this.reqDataA.pageNum++;
          this.loading = false;
          if (res.data.rows.length != 10) {
            this.finished = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.error = true;
        });
    },
    contentInit() {
      this.loading = false;
      this.finished = false;
      this.contentLists = [];
      this.reqDataA = {
        pageNum: 1,
        pageSize: 10
      };
      this.subLeft = [];
      this.subRight = [];
      this.labelList = [];
      this.sublabel = [];
      this.nodata = false;
      this.favoriteList = [];
      this.reqDataB = {
        pageNum: 1,
        pageSize: 10
      };
      this.classifyActive = null;
      this.loading2 = false;
      this.finished2 = false;
      this.scnodata = false;
      this.scnodatamide = false;
    },
    getClass() {
      this.$post("api/fig-manager/api/content/findLabelList").then(res => {
        this.labelList = res.data.dataList;
        this.classifyActive = res.data.dataList[0].id;
        this.loadSubLabel(res.data.dataList[0].id);
      });
    },
    loadSubLabel(id) {
      this.downArrow = true;
      this.$post("api/fig-manager/api/content/findSubLabelList", {
        parentId: id
      }).then(res => {
        if (res.data.dataList.length == 0) {
          return (this.nodata = true);
        }
        this.nodata = false;
        res.data.dataList.forEach(row => {
          if (row.categoryUrl.indexOf("http") == -1&&row.categoryUrl.indexOf(";base64,") == -1) {
            row.categoryUrl = "data:image/png;base64," + row.categoryUrl;
          }
        });
        this.sublabel = res.data.dataList;
        let length = this.checked ? 6 : 8;
        if (res.data.dataList.length > length) {
          this.subLeft = this.sublabel.slice(0, length);
          this.subRight = this.sublabel.slice(length);
        } else {
          this.subLeft = this.sublabel.slice(0);
          this.subRight = [];
        }
      });
    },
    toClassify(sub) {
      this.$router.push({
        path: "/classify",
        query: {
          id: sub.categoryValue,
          categoryName: sub.categoryName
        }
      });
    },
    getFavoriteList() {
      this.$post("api/fig-manager/api/user/findMyFavoriteList", {
        ...this.reqDataB,
        userId: Number(this.info.id)
      })
        .then(res => {
          if (res.data.rows.length == 0) {
            return (this.scnodata = true);
          }
          res.data.rows.forEach(row => {
            if (row.avatarImg.indexOf("http") == -1&&row.avatarImg.indexOf(";base64,") == -1) {
              row.avatarImg = "data:image/png;base64," + row.avatarImg;
            }
          });
          this.scnodata = false;
          this.favoriteList = this.favoriteList.concat(res.data.rows);
          this.reqDataB.pageNum++;
          this.loading2 = false;
          if (res.data.rows.length != 10) {
            this.finished2 = true;
          }
        })
        .catch(() => {
          this.loading2 = false;
          this.error2 = true;
        });
    },
    tohistory() {
      this.$router.push({
        path: "/playhistory"
      });
    },
    toshow() {
      this.show = true;
    }
  }
};
</script>
<style lang="scss">
.home {
  .leftcontent {
    .van-button--info {
      background-color: #ee5252;
      border-color: #ee5252;
    }
  }
  .homehead {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: #fff;
    width: 100%;
    .icon {
      text-align: right;
      line-height: 36px;
      font-size: 18px;
      img {
        width: 24px;
        margin-right: 15px;
        margin-top: 9px;
        height: 24px;
      }
    }
  }
  [class*="van-hairline"]::after {
    border: none;
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
  .lineonepx {
    height: 2px;
    width: 100%;
    background: #f0f0f0;
  }
  .homecontent {
    margin-top: 44px;
    .van-tabs__line {
      display: none;
    }
    .van-tabs__wrap {
      height: 24px;
    }
    .van-tab {
      line-height: 24px;
    }
    .moreclassify {
      margin-left: 15px;
      font-size: 12px;
      color: #333333;
      line-height: 24px;
    }
    .nodata {
      text-align: center;
      color: #333333;
    }
    .classify {
      background-origin: center;
      background-repeat: no-repeat;
      background-size: cover;
      height: 0;
    }
    .bigcontrol {
      font-size: 12px;
      line-height: 24px;
      margin-left: 15px;
      color: #333333;
    }
    .classifyName {
      margin: 9px 0;
      line-height: 24px;
      color: #333333;
      height: 24px;
      text-overflow: ellipsis;
      overflow: hidden;
      // white-space: nowrap;
      white-space: pre-line;
      width: 100%;
      font-size: 12px;
      text-align: center;
    }
    .van-grid-item__content {
      background-color: #fff;
    }
    .switchbig {
      background-color: #d9d9d9;
    }
    .switchbig.van-switch--on {
      background-color: #ee5252;
      // active-color="#EE5252"
      // inactive-color="#D9D9D9"
    }
  }
}
</style>
