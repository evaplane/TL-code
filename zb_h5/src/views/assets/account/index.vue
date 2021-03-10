<template>
  <div :class="{ 'account-panel': isRenderAssets }" class="assets-panel" style="z-index: 4">
    <assets-header
      :class="headerScrollClass"
      @left-click="close"
      @search-click="coinListVisible = false"
      @search-close="coinListVisible = true"
      ref="header"
    >
      <h1>{{ isRenderAssets ? accountTypeText + '账户' : labelText }}</h1>
    </assets-header>
    <div class="assets-content">
      <native-scroll @scroll="scrollHandle">
        <!-- 总资产信息 -->
        <div :class="accountBg" class="assets-amount" v-if="isRenderAssets">
          <img class="header-bg" src="@img/assets/header-chart.svg" />
          <div class="header-total" v-if="isLogin">
            <p class="total-number" v-if="assetsVisible">¥{{ assetAmount }}</p>
            <p class="total-number" v-else>******</p>
            <p class="total-label">{{ accountTypeText }}资产折合</p>
          </div>
          <div class="entrance" v-else>
            <a class="login-btn" href="javascript:;" v-login>登录</a>
            <a class="register-btn" href="javascript:;" v-register>注册</a>
          </div>
        </div>
        <assets-search v-if="accountType !== 'lever'">
          <template slot="legal-currency" v-if="['payin', 'withdraw'].indexOf(action) > -1">
            <div class="head">
              <h2>法币</h2>
            </div>
            <div class="list">
              <div @click="legalCurrencyClick('rmb')" class="item" v-hover>
                <img :src="'./img/coins/rmb.svg'" class="icon-coins" />
                <dl class="item-left">
                  <dt>RMB</dt>
                  <dd>人民币</dd>
                </dl>
                <dl class="item-right">
                  <dt>{{ cny }}</dt>
                  <dd>≈1 CNY</dd>
                </dl>
              </div>
              <div @click="legalCurrencyClick('usd')" class="item" v-hover>
                <img :src="'./img/coins/usd.svg'" class="icon-coins" />
                <dl class="item-left">
                  <dt>USD</dt>
                  <dd>美元</dd>
                </dl>
                <dl class="item-right">
                  <dt>{{ usd }}</dt>
                  <dd>≈7 CNY</dd>
                </dl>
              </div>
              <div @click="legalCurrencyClick('hkd')" class="item" v-hover>
                <img :src="'./img/coins/hkd.svg'" class="icon-coins" />
                <dl class="item-left">
                  <dt>USDHK</dt>
                  <dd>港币</dd>
                </dl>
                <dl class="item-right">
                  <dt>0.918</dt>
                  <dd>≈1 CNY</dd>
                </dl>
              </div>
            </div>
          </template>
        </assets-search>
        <account-lever v-if="accountType === 'lever'" />
      </native-scroll>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import assetsSearch from '@/components/assets/assets-search.vue';
import { getExchangeRate } from '@/api/market';
import assetsHeader from '@/components/assets/assets-header.vue';
import { State, Action, Getter } from 'vuex-class';
import accountLever from '@/components/assets/account-lever.vue';
import { IGetAssetsFunction } from '@/store/modules/assets';
import { ISpotAssets } from '@/api/assets';
import { IFundAsset } from '@/api/activity';
import { ILeverTypes } from '@/api/lever';
import { IMortgageList } from '@/api/mortgage';
import { fixNumber } from '@/utils/math';

@Component({
  components: {
    assetsSearch,
    assetsHeader,
    accountLever
  }
})
export default class Recharge extends Vue {
  coinListVisible: boolean = true;
  coinNameUp: string = '';
  itemActive: string = '';
  tabs: IObj<string> = {
    present: '现货',
    lever: '杠杆',
    mortgage: '抵押',
    activity: '活动'
  };
  cny: string = '';
  usd: string = '';
  accountTypeText: string = '';
  accountBg: string = '';
  headerSpantHeight: number = 0;
  headerScrollClass: string = '';
  get accountType() {
    let accountType = this.$route.params.type || '';
    if (accountType === 'present') {
      this.getSpotAssets();
    } else if (accountType === 'activity') {
      this.getFundAsset();
    } else if (accountType === 'mortgage') {
      this.getMortgageAssets();
    } else if (accountType === 'lever') {
      this.getLeverAssets();
    }
    return accountType;
  }
  get isRenderAssets() {
    return !this.action;
  }
  get action() {
    let action = this.$route.params.action || '';
    if (['payin', 'withdraw'].indexOf(action) > -1) {
      this.itemActive = 'present';
    }
    return action || '';
  }
  get labelText() {
    let text: IObj<string> = {
      payin: '充值',
      withdraw: '提现',
      transfer: '划转'
    };
    return text[this.action];
  }
  get disabledOtherAccount() {
    return ['payin', 'withdraw'].indexOf(this.action) > -1;
  }
  get assetAmount() {
    let amount: string | number = '--';
    switch (this.accountType) {
      case 'present': // 现货
        this.accountTypeText = '现货';
        this.accountBg = 'present-bg';
        amount = this.spotAssets.totalAsset;
        break;
      case 'lever': // 杠杆
        this.accountTypeText = '杠杆';
        this.accountBg = 'lever-bg';
        amount = this.leverAssets.totalAsset;
        break;
      case 'mortgage': // 抵押
        this.accountTypeText = '抵押';
        this.accountBg = 'mortgage-bg';
        amount = this.mortgageTotalAsset;
        break;
      case 'activity': // 活动区
        this.accountTypeText = '活动';
        this.accountBg = 'activity-bg';
        amount = this.fundAssets.totalAsset;
        break;
      default:
        break;
    }
    return !Number(amount) ? '0' : fixNumber(amount, 2);
  }
  get mortgageTotalAsset() {
    if (this.lang === 'cn') {
      return Number(this.mortgageAssets.totalInRmb);
    }
    return Number(this.mortgageAssets.totalInUsd);
  }
  '$refs': {
    header: assetsHeader;
  };
  @Action('updateAssetsVisible', { namespace: 'assets' }) updateAssetsVisible!: Function;
  @State('assetsVisible', { namespace: 'assets' }) assetsVisible!: boolean;
  @State('lang', { namespace: 'lang' }) lang!: string;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @State('mortgageAssets', { namespace: 'assets' }) mortgageAssets!: IMortgageList;
  @State('fundAssets', { namespace: 'assets' }) fundAssets!: IFundAsset;
  @State('spotAssets', { namespace: 'assets' }) spotAssets!: ISpotAssets;
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  @Action('getMortgageAssets', { namespace: 'assets' }) getMortgageAssets!: IGetAssetsFunction;
  @Action('getFundAsset', { namespace: 'assets' }) getFundAsset!: IGetAssetsFunction;
  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: IGetAssetsFunction;
  @Action('getSpotAssets', { namespace: 'assets' }) getSpotAssets!: IGetAssetsFunction;
  accountClickHandle(type: string) {
    this.$router.replace({ name: 'account', params: { type } });
    this.itemActive = type;
  }
  scrollHandle(pos: INativeScrollPos) {
    if (pos.y > this.headerSpantHeight) {
      this.headerScrollClass = 'assets-header--active';
      return;
    }
    this.headerScrollClass = '';
  }
  async getRate() {
    try {
      let rate = await getExchangeRate({ market: 'usdt_qc' });
      this.cny = rate.qccny;
      this.usd = rate.tickers[0][2];
    } catch (err) {
      console.log(err);
    }
  }
  legalCurrencyClick(coin: string) {
    let params = Object.assign({}, this.$route.params);
    let routeName = '';
    // 账号概览模式 指定跳账单
    if (!params.action) {
      routeName = 'assets-operating-bill';
    } else {
      routeName = 'assets-operating-' + this.action;
    }
    this.$nextTick(() => {
      this.$router.push({ name: routeName, params, query: { coin } });
    });
  }
  close() {
    this.$router.back();
  }
  mounted() {
    if (this.isRenderAssets) {
      const amountEl = this.$el.querySelector('.assets-amount');
      if (amountEl) {
        let amountOffsetHeight = (amountEl as HTMLDivElement).offsetHeight;
        this.headerSpantHeight = amountOffsetHeight - (this.$refs.header.$el as HTMLDivElement).offsetHeight;
      } else {
        console.error('找不到.assets-amount');
      }
    }
    this.itemActive = this.accountType + '' || 'present';
    this.getRate();
  }
}
</script>

<style lang="scss">
.account-panel {
  .assets-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    color: #fff;
    border-color: transparent;
    transition: all 0.2s;
  }
  .assets-header--active {
    background-color: var(--default-bg);
    border-color: var(--line-color);
    color: var(--heavy-color);
  }
  .assets-amount {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;

    &.present-bg {
      background-image: linear-gradient(133deg, #ff5646 0%, #e71c42 100%);
    }

    &.lever-bg {
      background-image: linear-gradient(133deg, #579cff 0%, #525ae4 100%);
    }

    &.mortgage-bg {
      background-image: linear-gradient(135deg, #faac61 0%, #f76b1c 100%);
    }

    &.activity-bg {
      background-image: linear-gradient(133deg, #75e8af 0%, #2da36b 100%);
    }

    .header-bg {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      min-width: 100%;
      z-index: -1;
      opacity: 0.1;
    }

    .header-total {
      text-align: center;
      height: 178px;
      padding-top: 80px;
      color: #fff;

      .total-number {
        font-size: 26px;
        height: 30px;
        @include bold;
      }

      .total-label {
        font-size: 14px;
        opacity: 0.8;
        margin-top: 5px;
      }
    }
  }
  .assets-search-warp {
    background-color: var(--default-bg);
    position: relative;
    z-index: 2;
    margin-top: 178px;
  }
  .assets-coin-list .head {
    top: 60px;
  }
}
</style>
