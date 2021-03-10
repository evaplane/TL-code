<template>
  <div class="college-box">
    <native-scroll>
      <div class="college-item-title">
        <div class="title-items" v-hover:hover-active-user>
          <img alt src="@/assets/img/user/zbicon-knowledgeWiki.svg" />
          <div>
            <b>__('知识百科')</b>
            <span class="gray-color">__('交易规则、专业术语')</span>
          </div>
        </div>
        <div class="title-items" v-hover:hover-active-user>
          <img alt src="@/assets/img/user/zbicon-industryWiki.svg" />
          <div>
            <b>__('业内百科')</b>
            <span class="gray-color">__('币种、公司、产品')</span>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="college-help">
        <div class="box-title">
          <span>__('帮助中心')</span>
          <a v-hover:hover-active-user>__('全部')</a>
        </div>
        <ul class="help-item">
          <li :key="item" v-for="item of 3">
            <div class="help-item-title">
              <div class="help-item-titleleft">
                <img alt="icon" src="@/assets/img/user/zbicon-safe-color.svg" />
                <h3>安全</h3>
              </div>
              <i class="zbicon-icon-arrow-o"></i>
            </div>
            <ul class="help-item-list">
              <li :key="list" v-for="list of 3" v-hover:hover-active-user>
                <i class="zbicon-zbicon-play"></i>
                <span>手机设置Google验证码</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="swipe-skeleton"></div>
      <van-swipe :height="90" :loop="false" :show-indicators="false" :width="255" v-if="!loading">
        <van-swipe-item :key="index" v-for="(item, index) in 5">
          <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <i class="zbicon-zbicon-play"></i>
          <span>新手充值指南</span>
        </van-swipe-item>
      </van-swipe>
      <div class="line"></div>
      <div class="college-course">
        <div class="box-title">
          <span>专题课程</span>
          <a v-hover:hover-active-user>全部</a>
        </div>
        <van-skeleton :key="item" :loading="loading" :row="4" avatar avatar-shape="square" v-for="item of 5" />
        <ul class="course-ul" v-if="!loading">
          <li :key="item" v-for="item of 2" v-hover:hover-active-user>
            <div class="course-img">
              <img alt src="https://img.yzcdn.cn/vant/cat.jpeg" />
              <i class="zbicon-zbicon-play"></i>
            </div>
            <div class="course-detail">
              <h3>比特币钱包方案</h3>
              <p class="u-text-overflow2 gray-color">教你如何使用各种钱包方案以及如何使教你如何使用各种钱包方案以及如何使</p>
              <span class="gray-color">主讲人: 老牛</span>
            </div>
          </li>
        </ul>
      </div>
    </native-scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Swipe as vanSwipe, SwipeItem as vanSwipeItem } from 'vant';
@Component({
  components: {
    vanSwipe,
    vanSwipeItem
  }
})
export default class College extends Vue {
  loading: boolean = true;
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
}
</script>
<style lang='scss'>
.college-box {
  width: 100%;
  overflow: auto;
  flex: 1;
  .college-item-title {
    padding: var(--padding-lr) 0;
    display: flex;
    border-top: 1px solid var(--border-color);
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      height: 100%;
      width: 1px;
      background: var(--border-color);
      top: 0;
      left: 50%;
    }
    > div.title-items {
      color: var(--theme-color);
      display: flex;
      justify-content: center;
      width: 50%;
      img {
        display: block;
        margin-right: 5px;
        width: 50px;
      }
      > div {
        line-height: 22px;
        b {
          font-size: 16px;
          letter-spacing: -0.28px;
          display: block;
        }
      }
    }
  }
  .box-title {
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    color: var(--theme-color);
    border-bottom: 1px solid var(--border-color);
    > span {
      font-size: 16px;
      font-weight: bold;
      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 12px;
        background: var(--primary-color);
        margin-right: 6px;
        border-radius: 3px;
      }
    }
    > a {
      display: block;
      color: #fff;
      background: var(--primary-color);
      padding: 0 16px;
      border-radius: 10px;
      line-height: 20px;
      height: 20px;
      margin-top: 4px;
    }
  }
  .college-help {
    padding: 0 var(--padding-lr);
    color: var(--theme-color);
    .help-item {
      padding-bottom: 20px;
      .help-item-title {
        display: flex;
        justify-content: space-between;
        line-height: 28px;
        padding: 10px 0;
        > i {
          display: block;
          transform: rotate(180deg);
          font-weight: bold;
          font-size: 12px;
        }
      }
      .help-item-list {
        margin-left: 20px;
        line-height: 28px;
        > li {
          > i {
            margin-right: 10px;
          }
          > span {
            font-size: 14px;
          }
        }
      }
    }
  }
  .help-item-titleleft {
    display: flex;
    > img {
      margin-right: 10px;
    }
    font-size: 16px;
  }
  .van-swipe {
    padding: 16px 10px;
    overflow: hidden;
    .van-swipe-item {
      box-sizing: border-box;
      position: relative;
      color: #fff;
      overflow: hidden;
      border-radius: 3px;
      padding: 0 5px;
      > img {
        width: 100%;
        // height: 100%;
        filter: brightness(80%);
        border-radius: 5px;
      }
      > i {
        position: absolute;
        left: 50%;
        top: 50%;
        color: #fff;
        opacity: 0.8;
        transform: translate(-50%, -50%);
        font-size: 24px;
      }
      > span {
        position: absolute;
        bottom: 10px;
        left: 10px;
        font-size: 16px;
      }
    }
  }
  .swipe-skeleton {
    display: flex;
    .van-skeleton {
      width: 80% !important;
      .van-skeleton__avatar {
        width: 255px !important;
        height: 80px !important;
      }
    }
  }
  .college-course {
    color: var(--theme-color);
    .van-skeleton {
      .van-skeleton__avatar {
        width: 120px !important;
        height: 80px !important;
      }
      .van-skeleton__content {
        padding-top: 0;
        .van-skeleton__row {
          margin-top: 4px;
        }
      }
    }
    .box-title {
      padding: 8px var(--padding-lr);
    }
    .course-ul {
      > li {
        padding: 10px var(--padding-lr);
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f7f8fe;
        @include dark {
          border-color: #0f0d14;
        }
        &:last-child {
          border: 0;
        }
        .course-img {
          width: 122px;
          height: 80px;
          margin-right: 10px;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          i {
            position: absolute;
            left: 50%;
            top: 50%;
            color: #fff;
            opacity: 0.8;
            transform: translate(-50%, -50%);
          }
          img {
            width: 100%;
            filter: brightness(80%);
          }
        }
        .course-detail {
          flex: 1;
          line-height: 18px;
          > h3 {
            font-size: 16px;
            margin-bottom: 5px;
          }
          > p {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
