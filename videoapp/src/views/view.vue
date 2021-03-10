<template>
  <div class="view">
    <template v-if="isloading">
      <div class="backgo" @click="backup">
        <img
          style="width: 14px;height: 25px;"
          src="../assets/BacArrow@2x.png"
          alt=""
        />
      </div>
      <div class="bottominput">
        <van-row>
          <van-col span="21">
            <van-field
              class="inputbtn"
              v-model="talkvalue"
              placeholder="快来评论一句吧！"
            />
          </van-col>
          <van-col
            span="3"
            class="userinfo"
            style="text-align:right;line-height:34px;"
            @click="sendTalk"
          >
            <img
              style="width:20px;height:20px;vertical-align: middle;"
              src="../assets/p@2x.png"
              alt=""
            />
          </van-col>
        </van-row>
      </div>
      <viewCard ref="viewcard" :contentData="contentData"></viewCard>
      <div class="hrone"></div>
      <div class="viewbody" v-if="contentData && contentData.categoryName">
        <van-row class="classbtn" @click="toclassify">
          <van-col span="3">
            <div style="height:30px;width:30px;">
              <van-image
                round
                width="100%"
                height="100%"
                :src="contentData.categoryUrl"
              />
            </div>
          </van-col>
          <van-col span="15" style="line-height:30px;">
            {{ contentData.categoryName }}
          </van-col>
          <van-col span="6" class="userinfo">
            <van-button class="btn" round type="default">进入</van-button>
          </van-col>
        </van-row>
      </div>
      <van-row class="viewad" style="height:60px;" v-if="detailsAd">
        <div class="tit">广告</div>
        <van-image
          width="100%"
          height="60px"
          @click="loadTo(detailsAd)"
          :src="detailsAd.contentUrl"
        />
      </van-row>
      <van-list
        style="margin-bottom:45px;"
        v-model="loading"
        ref="talk"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoadtalk"
      >
        <template>
          <div class="talkcontents">
            <div class="title">评论区</div>
            <template v-for="talk in talkLists">
              <div
                style="margin-top:10px;"
                v-bind:key="talk.id"
                v-if="!nodatatalk"
              >
                <van-row>
                  <van-col span="2">
                    <div
                      style="height:30px;width:30px;margin-top:6px;"
                      @click="touser(talk)"
                    >
                      <van-image
                        round
                        width="100%"
                        height="100%"
                        :src="talk.avatarImg"
                      />
                    </div>
                  </van-col>
                  <van-col span="15" class="userinfo">
                    <van-cell
                      :title="talk.nickName"
                      v-if="talk.createTime"
                      :label="formartDate(talk.createTime)"
                    />
                  </van-col>
                </van-row>
                <van-row>
                  <van-col span="2"> </van-col>
                  <van-col span="20" class="userinfo">
                    <div>{{ talk.content }}</div>
                  </van-col>
                </van-row>
              </div>
            </template>
            <van-row v-if="nodatatalk" class="nodata">
              <img style="width:100%;" src="../assets/notalk@2x.png" alt="" />
              <p>暂无评论</p>
            </van-row>
          </div>
        </template>
      </van-list>
    </template>
    <template v-if="!isloading&&!iserror">
      <div class="showmessage">
        <img src="../assets/logo.png" alt="" />
        <p>正在努力加载中</p>
      </div>
    </template>
    <template v-if="iserror">
      <div class="showmessage">
        <img src="../assets/nocontent@2x.png" alt="">
        <p>{{iserror}}</p>
        <div class="backgo" @click="backup">
          <van-icon name="arrow-left" />
        </div>
      </div>
      
    </template>
  </div>
</template>
<script>
// @ is an alias to /src
import viewCard from "@/components/viewCard.vue";
import { formartDate } from "./../utls/utls.js";
export default {
  name: "viewcontent",
  data() {
    return {
      title: "我的作品",
      loading: false,
      finished: false,
      classifyActive: 0,
      contentData: null,
      lastCount: 0,
      talkLists: [],
      talkvalue: "",
      timer: null,
      reqData: {
        pageNum: 1,
        pageSize: 10
      },
      illegalKeywords: [],
      isloading:false,
      iserror:false,
      nodatatalk:false,
    };
  },
  components: {
    viewCard
  },
  computed: {
    detailsAd() {
      let detailsAd = this.$store.state.detailsAd;
      return detailsAd[Math.floor(Math.random() * detailsAd.length)];
    }
  },
  // deactivated(){
  //   this.showlist = false;
  //   this.finished = false;
  // },
  // activated(){
  //   console.log(this.showlist,'xxxx')
  //   this.scrollTop();
  //   this.getview();
  //   this.findIllegalKeywords();
  //   this.talkLists = [];
  //   this.$refs.talk.check();
  // },
  created() {
    this.scrollTop();
    this.getview();
  },
  methods: {
    backup() {
      let data = this.$refs.viewcard;
      if(data){
        let data = data.contentData;
        window.sessionStorage.setItem(data.contentId,data.favoriteCount+','+data.favoriteFlag);
        this.$router.history.go(-1);
      }else{
        this.$router.history.go(-1);
      }
      
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
    findIllegalKeywords() {
      this.$post("api/fig-manager/api/common/findIllegalKeywords").then(res => {
        this.illegalKeywords = res.data.dataList;
      });
    },
    getview() {
      this.$post("api/fig-manager/api/content/contentDetail", {
        contentId: this.$route.query.id,
        userId: this.$store.state.info.id
      }).then(res => {
        this.showlist = true;
        if (res.code == "000000") {
          this.isloading = true;
          if (res.data.avatarImg.indexOf("http") == -1&&res.data.avatarImg.indexOf(";base64,") == -1) {
            res.data.avatarImg = "data:image/png;base64," + res.data.avatarImg;
          }
          if (res.data.categoryUrl.indexOf("http") == -1&&res.data.categoryUrl.indexOf(";base64,") == -1) {
            res.data.categoryUrl = "data:image/png;base64," + res.data.categoryUrl;
          };
          this.contentData = res.data;
        }else{
          this.iserror='内容不存在'
        }
      });
    },
    onLoadtalk(flag) {
      this.$post("api/fig-manager/api/content/findTalkList", {
        contentId: this.$route.query.id,
        ...this.reqData
      }).then(res => {
        if (!res.data||res.data.rows.length == 0) {
          return (this.nodatatalk = true);
        };
        if (flag) {
          this.talkLists = this.talkLists.slice(
            0,
            this.talkLists.length - this.lastCount
          );
        };
        res.data.rows.forEach(row => {
          if (row.avatarImg.indexOf("http") == -1&&row.avatarImg.indexOf(";base64,") == -1) {
            row.avatarImg = "data:image/png;base64," + row.avatarImg;
          }
        });
        this.talkLists = this.talkLists.concat(res.data.rows);
        this.lastCount = res.data.rows.length;
        this.loading = false;
        if (res.data.rows.length != 10) {
          this.finished = true;
        } else {
          this.reqData.pageNum++;
        }
      });
    },
    toclassify() {
      this.$router.push({
        path: "/classify",
        query: {
          id: this.contentData.categoryValue,
          categoryName: this.contentData.categoryName
        }
      });
    },
    sendTalkServer(content) {
      this.$post("api/fig-manager/api/content/pubTalk", {
        contentId: this.$route.query.id,
        content: content,
        userId: this.$store.state.info.id
      }).then(res => {
        if (res.code === "000000") {
          this.onLoadtalk(1);
        }
      });
    },
    loadTo(content) {
      window.location.href = content.redirectUrl;
    },
    sendTalk() {
      let talkcontent = this.talkvalue;
      this.talkvalue = "";
      for (let index = 0; index < this.illegalKeywords.length; index++) {
        const element = this.illegalKeywords[index];
        talkcontent = talkcontent.replace(new RegExp(element, "g"), "");
      }
      console.log(talkcontent);
      if (talkcontent.length > 0) {
        this.sendTalkServer(talkcontent);
      }
    },
    formartDate(date) {
      return formartDate(date);
    },
    touser(data) {
      this.$router.push({
        path: "/user",
        query: {
          id: data.userId,
          name: data.nickName
        }
      });
    }
  }
};
</script>
<style lang="scss">
.view {
  .backgo {
    height: 30px;
    padding-top: 10px;
    padding-left: 15px;
    font-size: 30px;
    position: fixed;
    z-index: 20;
    width: 30px;
    top:15px;
  }
  .bottominput {
    height: 45px;
    padding: 7px 15px 0;
    font-size: 24px;
    bottom: 0;
    position: fixed;
    background-color: #fff;
    border-top: 2px solid #f0f0f0;
    z-index: 20;
    width: calc(100% - 30px);
    .inputbtn {
      background-color: #e6e6e6;
      border-radius: 17px;
      padding: 5px 15px;
      input {
        color: #666666;
      }
      input::placeholder {
        color: #666666;
      }
    }
  }
  .hrone {
    height: 5px;
    background-color: #f0f0f0;
  }
  .viewad {
    position: relative;
    .tit {
      position: absolute;
      left: 15px;
      top: 5px;
      z-index: 1;
      font-size: 12px;
      color: #fff;
    }
  }
  .viewbody {
    margin-top: 10px;
    .control {
      margin: 0 15px;
      font-size: 9px;
      line-height: 35px;
      color: #999999;
      .btn {
        height: 36px;
        color: #999999;
        line-height: 35px;
      }
      .right {
        text-align: right;
      }
    }
    .classbtn {
      padding: 10px 15px 10px 15px;
      color: #333;
      .userinfo {
        text-align: right;
        .btn {
          padding: 0;
          height: 30px;
          line-height: 30px;
          width: 40px;
          font-size: 12px;
          color: #ee5252;
          border-color: #ee5252;
        }
      }
    }
  }
  .talkcontents {
    color: #333;
    margin: 15px;
    .title {
      // color:#666666;
      font-size: 14px;
    }
    .userinfo {
      margin-left: 5px;
      .van-cell {
        background-color: #fff;
        color: #333;
        padding: 0;
        .van-cell__label {
          margin-top: -2px;
        }
      }
    }
  }
  .nodata{
    text-align: center;
    color:#333;
    img{
      width:140px;
      height:80px;
    }
  }
  .showmessage{
    padding-top:250px;
    text-align: center;
    color:#333;
    img{
      width:110px;
      height:110px;
      margin-bottom: 25px;
    }
  }
}
</style>
