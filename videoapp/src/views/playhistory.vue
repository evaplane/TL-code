<template>
  <div class="playhistory">
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
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <template v-for="content in histroyList">
            <contentCard
              :data="content"
              v-bind:key="content.contentId"
            ></contentCard>
          </template>
        </van-list>
      </van-row>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import contentCard from "@/components/contentCard.vue";

export default {
  name: "playhostory",
  data() {
    return {
      title: "观看历史",
      loading: false,
      finished: false,
      classifyActive: 0,
      reqData: {
        pageNum: 1,
        pageSize: 10
      },
      histroyList: []
    };
  },
  components: {
    contentCard
  },
  created() {},
  methods: {
    backup() {
      this.$router.history.go(-1);
    },
    onLoad() {
      this.$post("api/fig-manager/api/user/findWatchHistoryList", {
        ...this.reqData,
        userId: Number(this.$store.state.info.id)
      }).then(res => {
        res.data.rows.forEach(row => {
          if (row.avatarImg.indexOf("http") == -1&&row.avatarImg.indexOf(";base64,") == -1) {
            row.avatarImg = "data:image/png;base64," + row.avatarImg;
          }
        });
        this.histroyList = this.histroyList.concat(res.data.rows);
        this.reqData.pageNum++;
        this.loading = false;
        if (res.data.rows.length != 10) {
          this.finished = true;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.playhistory {
  .homehead {
    position: fixed;
    top: 0;
    left: 0;
    color: #333;
    z-index: 10;
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
  }
}
</style>
