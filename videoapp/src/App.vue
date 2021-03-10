<template>
  <div id="app">
    <template v-if="show">
      <keep-alive exclude="viewcontent,userhome,classify,playhostory">
        <router-view />
      </keep-alive>
    </template>
    <div class="loading" v-else>
      <img src="./assets/logo.png" alt="" />
      <p v-if="loading">正在努力加载中</p>
      <p v-else>请使用Google浏览器</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      show: false,
      time: 0,
      loading:true,
      timer: null
    };
  },
  created() {
    this.getUA();
  },
  mounted() {
    this.scrollTop();
  },
  methods: {
    getUA(){
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      let result;
      if(isiOS){
        if (u.toLowerCase().indexOf("safari") > -1) {
          result = true;
        }else {
          result = false;
        };
      }else {
        if(u.toLowerCase().indexOf("chrome") == -1){
          result = false;
        }else{
          var re = new RegExp('Chrome/(.+?) ');
          result = true;
        }
      };
      if(result){
        this.loaduser();
      }else{
        this.loading = false;
      };
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
    async loaduser() {
      var res = await this.$post("api/fig-manager/api/user/autoRegLogin", {});
      if (res.code && res.code === "000000") {
        this.$store.commit("userinfo", res.data);
        this.show = true;
        this.loadvertList();
      } else {
        if (this.time > 3) {
          this.show = true;
          this.$router.push({
            path: "/"
          });
        } else {
          this.time++;
          this.loaduser();
        }
      }
    },
    loadvertList() {
      this.$post("api/fig-manager/api/content/findAdvtList", {}).then(res => {
        this.loadFontList();
        if (res.code && res.code === "000000") {
          this.$store.commit("verlist", res.data.dataList);
        }
      });
    },
    loadFontList() {
      this.$post("api/fig-manager/api/common/findFrontConfigList", {}).then(
        res => {
          if (res.code && res.code === "000000") {
            this.$store.commit("fontlist", res.data.dataList);
          }
        }
      );
    }
  }
};
</script>
<style lang="scss">
*{
  -webkit-tap-highlight-color:transparent;
}
html,
body {
  width: 100%;
  height: 100%;
  // background-color: #1A2644;
}
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  .loading {
    width: 60%;
    margin: 150px auto 0;
    text-align: center;
    color: #000;
    position: relative;
    img {
      width: 100px;
      height: 100px;
      margin-bottom: 40px;
    }
  }
}
</style>
