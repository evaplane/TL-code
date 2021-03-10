<template>
  <div class="business-advertising-wrap">
    <appBar />
    <div class="business-advertising">
      <div class="nav-top">
        <div class="index-ad-head-img">{{ userInfo.nickName ? userInfo.nickName.substring(0,1) : ''}}</div>
        <div class="name-wrap">
          <span>{{ userInfo.nickName }}</span>
          <div class="name-bottom">
            <div class="certification-img">
              <img alt src="@img/c2c/certification-icon.png" />
            </div>
            <span>认证商家</span>
          </div>
        </div>
      </div>
      <div class="nav-middle-wrap">
        <div class="nav-middle-left">
          <span class="nav-middle-top-span">成交数量</span>
          <span class="nav-middle-bottom-span">{{ userInfo.totalTradeTimes }}</span>
        </div>
        <div class="nav-middle">
          <span class="nav-middle-top-span">成交率</span>
          <span class="nav-middle-bottom-span">{{ `${userInfo.dealFee * 100}%` }}</span>
        </div>
        <div class="nav-middle-right">
          <span class="nav-middle-top-span">放币均时(分钟)</span>
          <span class="nav-middle-bottom-span">{{ `${userInfo.avgTradeSpendTime}` }}</span>
        </div>
      </div>
      <div class="nav-bottom-wrap">
        <div class="nav-bottom-icon">
          <span>实名认证</span>
          <icon-portrait :img-url="require('@img/c2c/has-authentication-icon.png')" size="12" />
        </div>
        <div class="nav-bottom-icon">
          <span>手机认证</span>
          <icon-portrait :img-url="require('@img/c2c/has-authentication-icon.png')" size="12" />
        </div>
        <div class="nav-bottom-icon">
          <span>邮箱认证</span>
          <icon-portrait :img-url="require('@img/c2c/has-authentication-icon.png')" size="12" />
        </div>
        <div class="nav-bottom-icon">
          <span>高级认证</span>
          <icon-portrait :img-url="require('@img/c2c/has-authentication-icon.png')" size="12" />
        </div>
      </div>
    </div>
    <router-view class="advert-content" :nick-name="userInfo.nickName"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import advertList from '@/components/c2c/advert-list.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
// api
import { getUserInfoById } from '@/api/otc/user';

@Component({
  components: {
    iconPortrait,
    nativeScroll,
    advertList,
    appBar
  }
})
export default class AdvertIndex extends Vue {
  userInfo: any = {};
  async mounted() {
    this.userInfo = await getUserInfoById(this.$route.params.userId);
  }
}
</script>

<style lang='scss'>
.business-advertising-wrap {
  background: var(--default-bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  .business-advertising {
    padding-left: 15px;
    padding-right: 15px;
    .nav-top {
      display: flex;
    }
    .name-bottom {
      display: flex;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #c0c3d1;
      }
    }
  }
  .index-ad-head-img {
    width: 42px;
    height: 42px;
    background: rgba(109, 134, 193, 1);
    border-radius: 50%;
    line-height: 42px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
  .certification-img {
    margin-right: 10px;
    width: 15px;
    height: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name-wrap {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    span {
      font-size: 18px;
      font-weight: 500;
      @include light{
        color: #4B5E6D;
      }
      @include dark{
        color: #AFB7C2;
      }
    }
  }
  .nav-middle-wrap {
    padding-top: 39px;
    padding-bottom: 13px;
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--border-color);
    .nav-middle-left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .nav-middle {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .nav-middle-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    span {
      display: block;
    }
    .nav-middle-top-span {
      padding-bottom: 12px;
      font-size: 12px;
      font-weight: 500;
      color: #c0c3d1;
    }
    .nav-middle-bottom-span {
      font-size: 15px;
      font-weight: 500;
      color: #27364a;
      @include light{
        color: #4B5E6D;
      }
      @include dark{
        color: #AFB7C2;
      }
    }
  }
  .nav-bottom-wrap {
    padding: 20px 0 18px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .nav-bottom-icon {
      display: flex;
      span {
        display: inline-block;
        padding-right: 6px;
        color: #c0c3d1;
      }
    }
  }
  .advert-content {
    flex: 1;
  }
}
</style>
