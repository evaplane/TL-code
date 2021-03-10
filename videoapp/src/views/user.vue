<template>
  <div class="meuser">
    <div class="homehead">
      <van-row>
        <van-col span="3">
          <div
            style="height:30px;padding-top:10px;padding-left:15px;font-size:24px;"
            @click="backup"
          >
            <van-icon name="arrow-left" />
          </div>
        </van-col>
        <van-col
          span="18"
          style="line-height:44px;height:44px;text-align:center;"
          >{{ title }}</van-col
        >
      </van-row>
    </div>
    <div class="classContent" v-if="classifyActive == 0">
      <van-row>
        <van-list
          v-model="loading"
          v-if="!nodata && classifyActive == 0"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <template v-for="content in mediaList">
            <contentCard
              :data="content"
              v-bind:key="content.contentId"
            ></contentCard>
          </template>
        </van-list>
      </van-row>
      <van-row v-if="nodata" class="nodata">
        <img style="width:100%;" src="../assets/nodata@2x.png" alt="" />
        <p>{{ lookuser ? "该用户没有作品" : "当前没有作品" }}</p>
      </van-row>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import contentCard from "@/components/contentCard.vue";

export default {
  name: "userhome",
  data() {
    return {
      title: "",
      loading: false,
      finished: false,
      userId: null,
      classifyActive: 0,
      mediaList: [],
      reqData: {
        pageNum: 1,
        pageSize: 10
      },
      nodata: false,
      lookuser: false,
      timer: null
    };
  },
  components: {
    contentCard
  },
  created() {
    this.scrollTop();
    this.userId = this.$store.state.info.id;
    if (this.$route.query.id) {
      // this.reqData.currentUserId = Number(this.userId);
      this.title = this.$route.query.name;
      this.lookuser = true;
    } else {
      this.lookuser = false;
    }
  },
  methods: {
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
    backup() {
      this.$router.history.go(-1);
    },
    onLoad() {
      let url;
      if (this.lookuser) {
        url = "api/fig-manager/api/user/findOtherMediaList";
      } else {
        url = "api/fig-manager/api/user/findMyMediaList";
      }
      this.$post(url, {
        ...this.reqData,
        userId: Number(this.$route.query.id)
      }).then(res => {
        if (this.reqData.pageNum == 1 && res.data.rows.length == 0) {
          this.nodata = true;
        } else {
          res.data.rows.forEach(row => {
            if (row.avatarImg.indexOf("http") == -1&&row.avatarImg.indexOf(";base64,") == -1) {
              row.avatarImg = "data:image/png;base64," + row.avatarImg;
            }
          });
          this.mediaList = this.mediaList.concat(res.data.rows);
          this.reqData.pageNum++;
          this.loading = false;
          if (res.data.rows.length != 10) {
            this.finished = true;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.meuser {
  .homehead {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    color: #333;
    background-color: #fff;
    width: 100%;
  }
  .van-divider {
    margin: 1px 0;
  }
  [class*="van-hairline"]::after {
    border: none;
  }
  .van-tabs__line {
    display: none;
  }
  .classContent {
    margin-top: 44px;
    position: relative;
    .nodata {
      text-align: center;
      color: #333;
    }
  }
}
</style>
