<template>
  <div class="classify">
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
      <van-divider />
      <!-- <van-row>
        <van-col span="1"></van-col>
        <van-col span="6">
          <van-tabs class="classifylist" v-model="classifyActive" lineHeight="0px;">
            <van-tab title="最新"></van-tab>
            <van-tab title="热门"></van-tab>
          </van-tabs>
        </van-col>
        <van-col span="9"></van-col>
      </van-row> -->
    </div>
    <div class="classContent">
      <van-row>
        <van-list
          v-if="classifyActive == 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="queryNewList"
        >
          <template v-for="content in contentLists">
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
  name: "classify",
  data() {
    return {
      title: "萌宠",
      reqDataA: {
        pageNum: 1,
        pageSize: 10,
        subCategoryValue: null
      },
      loading: false,
      finished: false,
      classifyActive: 0,
      contentLists: [],
      loading2: false,
      finished2: false,
      reqDataB: {
        pageNum: 1,
        pageSize: 10,
        subCategoryValue: null
      },
      contentHotLists: []
    };
  },
  components: {
    contentCard
  },
  created() {
    this.reqDataB.subCategoryValue = this.$route.query.id;
    this.reqDataA.subCategoryValue = this.$route.query.id;
    this.title = this.$route.query.categoryName;
  },
  methods: {
    queryNewList() {
      this.$post("api/fig-manager/api/content/findNewMediaList", {
        ...this.reqDataA,
        userId: Number(this.$store.state.info.id)
      }).then(res => {
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
      });
    },
    queryHotList() {
      this.$post("api/fig-manager/api/content/findHotMediaList", {
        ...this.reqDataB,
        userId: Number(this.$store.state.info.id)
      }).then(res => {
        this.contentHotLists = this.contentHotLists.concat(res.data.rows);
        this.reqDataB.pageNum++;
        this.loading2 = false;
        if (res.data.rows.length != 10) {
          this.finished2 = true;
        }
      });
    },
    backup() {
      this.$router.history.go(-1);
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.contentLists.push(this.contentLists.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.contentLists.length >= 40) {
          this.finished = true;
        }
      }, 500);
    }
  }
};
</script>
<style lang="scss">
.classify {
  .homehead {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    color: #333;
    background-color: #fff;
    width: 100%;
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
    margin-top: 46px;
    position: relative;
  }
}
</style>
