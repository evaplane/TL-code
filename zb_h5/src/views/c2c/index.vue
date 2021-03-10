<template>
  <div class="c2c-index-box">
    <m-header ref="header">
      <m-tabs @change="changeHandle" class="c2c-tabs" v-model="squareType">
        <m-tab title="__('买入')" :value="0" />
        <m-tab title="__('卖出')" :value="1" />
        <m-tab title="__('管理')" :value="2" />
      </m-tabs>
      <m-menu @change="menuChangeHandle" slot="right" overlay>
        <div class="header-btn more-btn" slot="reference">
          <icon-more />
        </div>
        <m-menu-item icon-class="zbicon-icon-btc-code" @click="publishAd" label="__('发布订单')" value="key" />
        <m-menu-item icon-class="zbicon-icon-shift" label="__('内部转入')" value="key" />
        <m-menu-item icon-class="zbicon-icon-shift" @click="paymentMode" label="__('收款方式管理')" value="key" />
        <m-menu-item icon-class="zbicon-icon-shift" @click="applyMerchant" label="__('申请商家')" value="key" />
        <m-menu-item icon-class="zbicon-icon-shift" @click="mineAd" label="__('我的广告')" value="key" />
        <m-menu-item icon-class="zbicon-icon-recharge" label="__('KYC助手')" value="key" />
        <m-menu-item icon-class="zbicon-icon-recharge" @click="setBusiness" label="__('商家设置')" value="key" />
      </m-menu>
    </m-header>
    <router-view class="c2c-router-view" :header-offset-height="headerOffsetHeight"/>
    <tab-bar :fixed="false" />
  </div>
</template>
<!--business-application-->
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import tabBar from '@/components/layout/tab-bar.vue';
import mHeader from '@/components/index/head.vue';
import { mMenu, mMenuItem } from '@/components/common/menu/index';
import { OtcCheckAuth } from '@/utils/otc-auth-check';

@Component({
  components: {
    tabBar,
    mHeader,
    mMenu,
    mMenuItem
  }
})
export default class C2CIndex extends Vue {
  routeArr: string[] = ['buy', 'sell'];
  squareType: number = 0;
  headerOffsetHeight: number = 0;
  '$refs': {
    header: mHeader;
  };
  @Watch('$route', { immediate: true })
  _() {
    let index = this.routeArr.indexOf(this.$route.params.type + '');
    this.squareType = index === -1 ? 2 : index;
  }
  menuChangeHandle() {}
  @OtcCheckAuth()
  applyMerchant() {
    this.$router.push({ name: 'business-application' });
  }
  @OtcCheckAuth()
  paymentMode() {
    this.$router.push({ name: 'c2c-payment-mode' });
  }
  @OtcCheckAuth({ checkMerchant: true })
  setBusiness() {
    this.$router.push({ name: 'business-set' });
  }
  @OtcCheckAuth({ checkMerchant: true })
  publishAd() {
    this.$router.push({ name: 'c2c-ad-release' });
  }
  @OtcCheckAuth({ checkMerchant: true })
  mineAd() {
    this.$router.push({ name: 'c2c-ad-mine' });
  }
  changeHandle(index: number) {
    let { query } = this.$route;
    if (index === 2) {
      this.$router.push({ name: 'c2c-management', query });
      return;
    }
    this.$router.push({ name: 'c2c-square', params: { type: this.routeArr[index] }, query });
  }
  jump() {}

  mounted() {
    this.$nextTick(() => {
      this.headerOffsetHeight = this.$refs.header ? (this.$refs.header.$el as HTMLDivElement).offsetHeight : 0;
    });
  }
}
</script>

<style lang='scss'>
.c2c-index-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  .c2c-router-view {
    flex: 1;
    overflow: hidden;
  }
}
</style>
