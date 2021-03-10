<template>
  <div class="news-box">
    <scroll>
      <van-skeleton title :row="2" :row-width="['70%', '70%']" :loading="loading" v-for="item in 3" :key="item" />
      <ul class="news-list" v-if="loading === false">
        <router-link tag="li" class="news-item" :to="{ name: 'index' }" v-for="item in 15" :key="item">
          <div class="line"></div>
          <div class="info">
            <div class="info-text">
              <div class="info-top u-clear">
                <div class="author" v-calc-width>糖果</div>
                <h2 class="u-text-overflow3">
                  关于ZB开放充值关于ZB开放充值关于ZB开放充值关于ZB开放
                </h2>
              </div>
              <div class="info-bottom">
                <time>2019/12/14 09:03:12</time>
                <span><i class="icon zbicon-share"></i>2884</span>
              </div>
            </div>
            <div class="info-img"></div>
          </div>
        </router-link>
      </ul>
    </scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component({
  directives: {
    calcWidth(el) {
      Vue.nextTick(() => {
        if (el.parentNode !== null) {
          let h2El = el.parentNode.querySelector('h2');
          if (h2El !== null) {
            h2El.style.textIndent = el.offsetWidth + 3 + 'px';
          }
        }
      });
    }
  }
})
export default class TradeNews extends Vue {
  loading = true;
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
</script>

<style lang='scss'>
.news-box {
  height: 100%;
  .news-list {
    .info {
      display: flex;
      justify-content: space-between;
      color: var(--theme-color);
      padding: 15px;
      .info-text {
        position: relative;
        padding-right: 15px;
        flex: 1;
      }
      .author {
        font-size: 11px;
        height: 17px;
        line-height: 17px;
        color: #fff;
        background: var(--primary-color);
        padding: 0px 5px;
        vertical-align: middle;
        margin-right: 3px;
        border-radius: 2px;
        position: absolute;
        left: 0;
        top: 0;
      }
      h2 {
        font-size: 15px;
        font-weight: 500;
        line-height: 18px;
      }
      .info-bottom {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        time {
          font-size: 13px;
          line-height: 22px;
        }
        .icon {
          margin-right: 5px;
        }
      }
    }
    .info-img {
      width: 114px;
      height: 77px;
      border-radius: 5px;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-image: url(https://www.bitkk.com/src/images/home/sban-nwt.jpg);
    }
  }
}
</style>
