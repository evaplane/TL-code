<template>
  <div class="assets-page" v-loading="loading">
    <div class="assets-index">
      <native-scroll @scroll="scrollHandle">
        <div class="assets-head" ref="assetsHead">
          <transition name="assets-fixed">
            <div class="assets-total fixed" v-if="assetsTotalVisible">
              <div class="menu-btn" v-setting>
                <icon-menu />
              </div>
              <div class="total-info" v-if="mixinsIsLogin">
                <p class="label" @click="testClick">总资产折合</p>
                <p class="number u-text-overflow1" v-if="hiding">¥{{ total }}</p>
                <p class="number" v-else>******</p>
              </div>
              <div class="entrance" v-else>
                <span v-login>登录</span>
                <span v-register>注册</span>
              </div>
              <div class="oper">
                <div @click="hiding = !hiding" class="hiding-btn">
                  <svg
                    class="zb-icon icon-eye-hide"
                    height="24"
                    v-if="hiding"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.396 6.982a15.014 15.014 0 0 1 3.205 3.627 2.63 2.63 0 0 1 .003 2.781c-2.157 3.493-5.552 6.29-10.357 6.402h-.229c-2.862 0-5.375-1.06-7.513-2.843A14.867 14.867 0 0 1 1.4 13.395a2.633 2.633 0 0 1 .002-2.79c2.197-3.517 5.55-6.28 10.3-6.392 2.913-.082 5.491.96 7.695 2.769zm1.648 4.594c-.587-.944-3.812-5.684-9.292-5.53-5.067.119-7.999 4.254-8.796 5.53a.799.799 0 0 0 0 .851c.577.928 3.665 5.531 9.062 5.531h.23c5.066-.119 8.008-4.254 8.796-5.53a.799.799 0 0 0 0-.852zM12 16.586a4.583 4.583 0 1 1 0-9.167 4.583 4.583 0 0 1 0 9.167zm0-1.834a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5z"
                    />
                  </svg>
                  <svg
                    class="zb-icon icon-eye-show"
                    height="24"
                    v-else
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.492 4.286L4.718 20.004a.85.85 0 0 1-1.188 0 .842.842 0 0 1 0-1.183L19.305 3.102a.85.85 0 0 1 1.187 0 .842.842 0 0 1 0 1.184zm-.498 3.225a14.883 14.883 0 0 1 2.607 3.11 2.63 2.63 0 0 1 .003 2.781c-2.157 3.493-5.552 6.289-10.357 6.401h-.229c-1.303 0-2.533-.22-3.689-.627l1.475-1.474c.688.17 1.426.268 2.214.268h.23c5.066-.12 8.008-4.255 8.796-5.531a.799.799 0 0 0 0-.851 13.59 13.59 0 0 0-2.348-2.778l1.298-1.299zM4 16.519a14.789 14.789 0 0 1-2.6-3.112 2.633 2.633 0 0 1 .002-2.79c2.197-3.518 5.55-6.281 10.3-6.393 1.402-.039 2.726.182 3.969.624L14.196 6.32a9.021 9.021 0 0 0-2.444-.264c-5.067.12-7.999 4.255-8.796 5.531a.799.799 0 0 0 0 .85c.263.424 1.05 1.614 2.341 2.782L4 16.519zm7.015-.028l1.875-1.875a2.75 2.75 0 0 0 1.713-1.713l1.875-1.875a4.583 4.583 0 0 1-5.463 5.463zm-3.492-3.495a4.583 4.583 0 0 1 5.46-5.46l-1.878 1.877A2.757 2.757 0 0 0 9.4 11.119l-1.877 1.877z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </transition>
          <div class="assets-total">
            <div class="menu-btn" v-setting>
              <icon-menu />
            </div>
            <div class="total-info" v-if="mixinsIsLogin">
              <p class="label">总资产折合</p>
              <p class="number u-text-overflow1" v-if="hiding">¥{{ total }}</p>
              <p class="number" v-else>******</p>
            </div>
            <div class="entrance" v-else>
              <span v-login>登录</span>
              <span v-register>注册</span>
            </div>
            <div class="oper">
              <div @click="hiding = !hiding" class="hiding-btn">
                <svg
                  class="zb-icon icon-eye-hide"
                  height="24"
                  v-if="hiding"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.396 6.982a15.014 15.014 0 0 1 3.205 3.627 2.63 2.63 0 0 1 .003 2.781c-2.157 3.493-5.552 6.29-10.357 6.402h-.229c-2.862 0-5.375-1.06-7.513-2.843A14.867 14.867 0 0 1 1.4 13.395a2.633 2.633 0 0 1 .002-2.79c2.197-3.517 5.55-6.28 10.3-6.392 2.913-.082 5.491.96 7.695 2.769zm1.648 4.594c-.587-.944-3.812-5.684-9.292-5.53-5.067.119-7.999 4.254-8.796 5.53a.799.799 0 0 0 0 .851c.577.928 3.665 5.531 9.062 5.531h.23c5.066-.119 8.008-4.254 8.796-5.53a.799.799 0 0 0 0-.852zM12 16.586a4.583 4.583 0 1 1 0-9.167 4.583 4.583 0 0 1 0 9.167zm0-1.834a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5z"
                  />
                </svg>
                <svg
                  class="zb-icon icon-eye-show"
                  height="24"
                  v-else
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.492 4.286L4.718 20.004a.85.85 0 0 1-1.188 0 .842.842 0 0 1 0-1.183L19.305 3.102a.85.85 0 0 1 1.187 0 .842.842 0 0 1 0 1.184zm-.498 3.225a14.883 14.883 0 0 1 2.607 3.11 2.63 2.63 0 0 1 .003 2.781c-2.157 3.493-5.552 6.289-10.357 6.401h-.229c-1.303 0-2.533-.22-3.689-.627l1.475-1.474c.688.17 1.426.268 2.214.268h.23c5.066-.12 8.008-4.255 8.796-5.531a.799.799 0 0 0 0-.851 13.59 13.59 0 0 0-2.348-2.778l1.298-1.299zM4 16.519a14.789 14.789 0 0 1-2.6-3.112 2.633 2.633 0 0 1 .002-2.79c2.197-3.518 5.55-6.281 10.3-6.393 1.402-.039 2.726.182 3.969.624L14.196 6.32a9.021 9.021 0 0 0-2.444-.264c-5.067.12-7.999 4.255-8.796 5.531a.799.799 0 0 0 0 .85c.263.424 1.05 1.614 2.341 2.782L4 16.519zm7.015-.028l1.875-1.875a2.75 2.75 0 0 0 1.713-1.713l1.875-1.875a4.583 4.583 0 0 1-5.463 5.463zm-3.492-3.495a4.583 4.583 0 0 1 5.46-5.46l-1.878 1.877A2.757 2.757 0 0 0 9.4 11.119l-1.877 1.877z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="assets-distribute">
            <ul>
              <li @click="clickHandle('payin')">
                <span class="icon"> <img src="@img/assets/recharge.svg" /> </span>充值
              </li>
              <li @click="clickHandle('withdraw')">
                <span class="icon"> <img src="@img/assets/withdrawal.svg" /> </span>提现
              </li>
              <li @click="clickHandle('transfer')">
                <span class="icon"> <img src="@img/assets/transfer.svg" /> </span>划转
              </li>
            </ul>
          </div>
        </div>
        <div class="assets-bill">
          <div @click="complexBillClick" class="bill-head">
            <h3>综合账单</h3>
            <span class="arrow"></span>
          </div>
          <div class="bill-list">
            <div class="x-scroll">
              <ul v-if="spotBills.length > 0">
                <li :key="item.id" v-for="item in spotBills">
                  <div class="icon icon1">
                    <coin-img :coin-name="item.showCoin.split(' ')[1]" />
                  </div>
                  <div class="info">
                    <p class="tit">{{ item.billTypeValue }}</p>
                    <p class="date">{{ formatDate(item.date) }}</p>
                  </div>
                  <div class="num">
                    <div class="u-text-overflow1">{{ fiatFilters(item.showCoin, '0') }}</div>
                  </div>
                </li>
              </ul>
              <ul class="default" v-else>
                <li>
                  <div class="icon">
                    <img alt="zb" v-icon="`./img/coins/zb.svg`" />
                  </div>
                  <div class="info">
                    <p class="tit">暂无账单记录</p>
                    <p class="date">{{ formatDate(new Date()) }}</p>
                  </div>
                  <div class="num">
                    <div class="u-text-overflow1">-</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="assets-account">
          <ul class="account-list">
            <li @click="accountClickHandle('present')" class="account-item">
              <div class="label">现货账户</div>
              <div class="right">
                <p class="balance">{{ hiding ? usdtSpotAssetsAmount : '******' }}</p>
                <p class="unit">{{ hiding ? fixNumber2Text(spotAssets.totalAsset) : '******' }}</p>
              </div>
            </li>
            <li @click="accountClickHandle('lever')" class="account-item">
              <div class="label">杠杆账户</div>
              <div class="right">
                <p class="balance">{{ hiding ? usdtLeverAssetsAmount : '******' }}</p>
                <p class="unit">{{ hiding ? fixNumber2Text(leverAssets.netAsset) : '******' }}</p>
              </div>
            </li>
            <li @click="accountClickHandle('mortgage')" class="account-item">
              <div class="label">抵押账户</div>
              <div class="right">
                <p class="balance">{{ hiding ? usdtMortgageAssetsAmount : '******' }}</p>
                <p class="unit">{{ hiding ? fixNumber2Text(mortgageAssets.totalInRmb) : '******' }}</p>
              </div>
            </li>
            <li @click="accountClickHandle('activity')" class="account-item">
              <div class="label">活动账户</div>
              <div class="right">
                <p class="balance">{{ hiding ? usdtfundAssetsAmount : '******' }}</p>
                <p class="unit">{{ hiding ? fixNumber2Text(fundAssets.totalAsset) : '******' }}</p>
              </div>
            </li>
          </ul>
          <!-- <div class="distribution">
            <h3>资产分布图</h3>
            <div class="ring-chart">
              <chart-ring
                :colors="['#ff453b', '#ff823a', '#E91C41', '#00cc88', '#00cab1', '#31D19E']"
                :data="ringChartData"
                :extend="ringExtend"
                :legend-visible="false"
                :settings="ringSetting"
                height="200px"
              />
            </div>
          </div>-->
        </div>
        <div class="assets-discount">
          使用ZB支付交易手续费(5折)
          <m-switch @change="useZBPayChangeHandle" :active-value="1" :inactive-value="0" v-model="isUseZBPay" />
        </div>
        <div class="assets-map">
          <ul class="map-list">
            <li class="map-item" v-hover @click="checkLoginStatus() && $router.push({ name: 'finance' })">
              <div class="icon">
                <img src="@img/assets/index/icon-map1.svg" />
              </div>
              <p class="label">理财</p>
            </li>
            <li class="map-item" v-hover @click="routerClickHandle({ name: 'loan' })">
              <div class="icon">
                <img src="@img/assets/index/icon-map2.svg" />
              </div>
              <p class="label">借款</p>
            </li>
            <li class="map-item" v-hover @click="routerClickHandle({ name: 'c2c-payment-mode' })">
              <div class="icon">
                <img src="@img/assets/index/icon-map3.svg" />
              </div>
              <p class="label">银行卡管理</p>
            </li>
          </ul>
          <ul class="map-list">
            <li class="map-item" v-hover>
              <div class="icon">
                <img src="@img/assets/index/icon-map4.svg" style="width: 30px;" />
              </div>
              <p class="label">提币地址</p>
            </li>
            <li class="map-item" v-hover>
              <div class="icon">
                <img src="@img/assets/index/icon-map5.svg" style="width: 30px;" />
              </div>
              <p class="label">投票上币</p>
            </li>
            <li class="map-item" v-hover>
              <div class="icon">
                <img src="@img/assets/index/icon-map6.svg" style="width: 36px;" />
              </div>
              <p class="label">VIP会员</p>
            </li>
          </ul>
          <ul class="map-list">
            <li class="map-item" v-hover>
              <div class="icon">
                <img src="@img/assets/index/icon-map7.svg" />
              </div>
              <p class="label">UP</p>
            </li>
          </ul>
        </div>
      </native-scroll>
    </div>
    <tab-bar />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
// components
import tabBar from '@/components/layout/tab-bar.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
import loading from '@/components/common/loading/index.vue';
import coinImg from '@/components/assets/coin-img.vue';
import { login } from '@/components/popup/index';
import { fixDecimal, divide } from '@/utils/math';
import 'echarts/lib/component/title';
import chartRing from 'v-charts/lib/ring.common';
import { IMortgageList } from '@/api/mortgage';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { getSpotBills, ISpotAssets, ISpotAssetBillItem, doUseZBPayTransFee } from '@/api/assets';
import { ILeverTypes } from '@/api/lever';
import { Catch } from '@/utils/decorators';
import { formatDate } from '@/utils/date';
import { isNotEmpty } from '@/utils/is';
import { IGetAssetsFunction } from '@/store/modules/assets';
import { IFundAsset } from '@/api/activity';
import { getExchangeRate } from '@/api/market';
import { setSession, getSession } from '@/utils/storage';
import mSwitch from '@/components/common/switch/index.vue';
import { IUser } from '@/store/modules/user';
import { env } from '@/config/index';
import { Location } from 'vue-router';

@Component({
  components: {
    tabBar,
    nativeScroll,
    loading,
    coinImg,
    chartRing,
    mSwitch
  }
})
export default class AssetsIndex extends Mixins(mixinsSignHooks) implements ISignHooks {
  ringChartData: any = {
    columns: ['label', 'value'],
    rows: []
  };
  hiding: boolean = true;
  asyncRingComp: any = null;
  isUseZBPay: number = 0;
  ringExtend: any = {
    title: {
      show: true,
      text: `¥-`,
      x: 'center',
      y: 74, // 由于设置了"间距"，因此无法使用 center，需要手动计算出垂直居中的数值
      textStyle: {
        color: '#9094A4',
        fontSize: 14
      },
      padding: 28,
      borderWidth: 0,
      borderRadius: 60
    },
    series: {
      label: {
        normal: {
          show: true
        }
      }
    }
  };
  ringSetting: any = {
    radius: [54, 60],
    offsetY: 110,
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderRadius: 20
      }
    }
  };
  '$refs': {
    assetsHead: HTMLDivElement;
  };
  loading: boolean = false;
  assetsTotalVisible: boolean = false;
  assetsHeadOffsetHeight: number = 0;
  usdtQc: number = 0;
  spotBills: ISpotAssetBillItem[] = [];
  get usdtSpotAssetsAmount() {
    if (Number(this.spotAssets.totalAsset) > 0) {
      return this.fixNumber2(divide(this.spotAssets.totalAsset, this.usdtQc));
    }
    return this.mixinsIsLogin ? '0' : '-';
  }
  get usdtMortgageAssetsAmount() {
    if (Number(this.mortgageAssets.totalInUsd) > 0) {
      return this.fixNumber2(this.mortgageAssets.totalInUsd);
    }
    return this.mixinsIsLogin ? '0' : '-';
  }
  get usdtLeverAssetsAmount() {
    if (Number(this.leverAssets.totalAsset) > 0) {
      return this.fixNumber2(divide(this.leverAssets.totalAsset, this.usdtQc));
    }
    return this.mixinsIsLogin ? '0' : '-';
  }
  get usdtfundAssetsAmount() {
    if (Number(this.fundAssets.totalAsset) > 0) {
      return this.fixNumber2(divide(this.fundAssets.totalAsset, this.usdtQc));
    }
    return this.mixinsIsLogin ? '0' : '-';
  }
  get total() {
    let total = 0;
    let totalString = '-';
    if (Number(this.spotAssets.totalAsset) > 0) {
      total += +this.spotAssets.totalAsset;
    }
    if (Number(this.mortgageAssets.totalInRmb) > 0) {
      total += +this.mortgageAssets.totalInRmb;
    }
    if (Number(this.leverAssets.totalAsset) > 0) {
      total += +this.leverAssets.totalAsset;
    }
    if (Number(this.fundAssets.totalAsset) > 0) {
      total += +this.fundAssets.totalAsset;
    }
    totalString = Number(total.toString()) >= 0 ? this.fixNumber2(total.toString()) : '-';
    this.ringExtend.title.text = `¥${totalString}`;
    return totalString;
  }
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  @State('spotAssets', { namespace: 'assets' }) spotAssets!: ISpotAssets;
  @State('mortgageAssets', { namespace: 'assets' }) mortgageAssets!: IMortgageList;
  @State('fundAssets', { namespace: 'assets' }) fundAssets!: IFundAsset;
  @State('lang', { namespace: 'lang' }) lang!: string;
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;

  @Action('getMortgageAssets', { namespace: 'assets' }) getMortgageAssets!: IGetAssetsFunction;
  @Action('getFundAsset', { namespace: 'assets' }) getFundAsset!: IGetAssetsFunction;
  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: IGetAssetsFunction;
  @Action('getSpotAssets', { namespace: 'assets' }) getSpotAssets!: IGetAssetsFunction;
  @Watch('spotAssets.useZBPayTransFee')
  _() {
    this.isUseZBPay = this.spotAssets.useZBPayTransFee;
  }
  checkLoginStatus() {
    if (this.mixinsIsLogin === false) {
      login.open();
      return false;
    }
    return true;
  }
  async useZBPayChangeHandle() {
    if (this.checkLoginStatus() === false) {
      this.isUseZBPay = 0;
      return;
    }
    try {
      this.loading = true;
      let res = await doUseZBPayTransFee(this.isUseZBPay);
      if (res.resMsg.code === 1000) {
        if (this.isUseZBPay) {
          this.$message.success('已开启使用ZB支付交易手续费');
        } else {
          this.$message.success('已关闭使用ZB支付交易手续费');
        }
      } else {
        this.isUseZBPay = this.isUseZBPay === 0 ? 1 : 0;
        this.$message.fail(res.resMsg.message);
      }
    } catch (_) {}
    this.loading = false;
  }
  fixNumber2Text(num: string | number) {
    let number = this.fixNumber2(num);
    if (number === '-') {
      return this.mixinsIsLogin ? '≈0 CNY' : '-';
    }
    return '≈' + number + ' CNY';
  }
  fixNumber2(num: string | number) {
    if (isNaN(Number(num))) {
      return '-';
    }
    return fixDecimal(num, 2);
  }
  @Catch()
  async getExchangeRate() {
    let res = await getExchangeRate({
      market: 'usdt_qc'
    });
    if (isNotEmpty(res.tickers) === true) {
      this.usdtQc = Number(res.tickers[0][2]);
      if (this.usdtQc === 0) {
        this.usdtQc = 7;
      }
    }
  }
  clickHandle(type: string) {
    if (this.checkLoginStatus() === false) {
      return;
    }
    // 现货
    this.$router.push({ name: 'assets-account', params: { type: 'present', action: type } });
  }
  routerClickHandle(location: Location) {
    if (this.checkLoginStatus() === false) {
      return;
    }
    this.$router.push(location);
  }
  formatDate(date: any): string {
    return formatDate(date, 'MM-DD hh:mm:ss') as string;
  }
  fiatFilters(value: string, type: string) {
    if (!value) return '';
    let valueSplit = value.split('=');
    if (type === '0') {
      return valueSplit[0];
    } else {
      return valueSplit[1];
    }
  }
  complexBillClick() {
    if (this.checkLoginStatus() === false) {
      return;
    }
    this.$router.push({ name: 'complex-bill' });
  }
  accountClickHandle(type: string) {
    if (this.checkLoginStatus() === false) {
      return;
    }
    this.$router.push({ name: 'account', params: { type } });
  }
  async getRingData(): Promise<void> {
    const rows = [
      // // 基本账户 杠杆账户
      Number(this.leverAssets.totalAsset) > 0 ? { label: '杠杆账户', value: this.leverAssets.totalAsset } : {},
      Number(this.spotAssets.totalAsset) > 0 ? { label: '基本账户', value: this.spotAssets.totalAsset } : {},
      Number(this.mortgageAssets.totalInUsd) > 0 ? { label: '理财账户', value: this.mortgageAssets.totalInUsd } : {},
      Number(this.fundAssets.totalAsset) > 0 ? { label: '活动账户', value: this.fundAssets.totalAsset } : {}
    ];
    this.$set(this.ringChartData, 'rows', rows);
  }
  scrollHandle(pos: INativeScrollPos) {
    this.assetsTotalVisible = pos.y >= this.assetsHeadOffsetHeight - 100;
  }
  async requestSpotBills() {
    let result = await getSpotBills({
      dataType: 0,
      currency: 'all',
      pageIndex: 1,
      pageSize: 5
    });
    if (result) {
      this.spotBills = result.dataList;
      setSession('__user_spot_bills', this.spotBills);
    }
  }
  testClick() {
    if (env === 'development') {
      if (['359839'].indexOf(this.userInfo.userId + '') === -1) return;
    } else {
      if (['1326149'].indexOf(this.userInfo.userId + '') === -1) return;
    }
    import(/* webpackChunkName: 'eruda' */ 'eruda')
      .then(modules => {
        modules.default.init();
      })
      .catch(() => {});
  }
  signIn() {
    this.$nextTick(async () => {
      this.spotBills = getSession('__user_spot_bills') || [];
      this.getExchangeRate();
      this.requestSpotBills();
      await this.getSpotAssets(true);
      await this.getLeverAssets(true);
      await this.getFundAsset(true);
      await this.getMortgageAssets(true);
      this.getRingData();
    });
  }
  signOut() {
    this.spotBills = [];
    this.isUseZBPay = 0;
  }
  async mounted() {
    this.assetsHeadOffsetHeight = this.$refs.assetsHead.offsetHeight;
  }
}
</script>

<style lang="scss">
.assets-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  @include light {
    background-color: #f3f4f9;
  }
  @include dark {
    background-color: #10121b;
  }
}
.assets-index {
  flex: 1;
  color: var(--default-color);
  overflow: hidden;
  .arrow {
    width: 8px;
    height: 8px;
    margin-right: 2px;
    border-right: 2px solid; /* no */
    border-top: 2px solid; /* no */
    transform: rotate(45deg);
  }
}
.assets-head {
  position: relative;
  z-index: 2;
  &::after {
    content: '';
    position: absolute;
    left: -20px;
    right: -20px;
    top: 0;
    height: 180px;
    background-image: linear-gradient(-34deg, #f5515f 0%, #9f041b 100%);
    border-radius: 0 0 50px 50px;
    z-index: -1;
  }
  .entrance {
    margin-left: 15px;
    display: flex;
    span {
      padding: 10px 24px;
      border-radius: 2px; /* no */
      font-size: 16px;
      color: #fff;
      border: 1px solid rgba(#fff, 0.6); /* no */
      &:nth-child(1) {
        background-color: var(--primary-color);
        color: #fff;
        margin-right: 15px;
        border-color: var(--primary-color);
      }
    }
  }
}
.assets-fixed-enter-active,
.assets-fixed-leave-active {
  transition: transform 0.3s;
}
.assets-fixed-enter,
.assets-fixed-leave-to {
  transform: translateY(-100%);
}
.assets-total {
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 85px;
  color: #fff;
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #fff; /* no */
    overflow: hidden;
    img {
      width: 44px;
      height: 44px;
    }
  }
  .total-info {
    margin-left: 15px;
    color: #fff;
    width: 200px;
    overflow: hidden;
    .label {
      opacity: 0.8;
      margin-bottom: 8px;
    }
    .number {
      font-size: 24px;
      font-weight: 500;
    }
  }
  .oper {
    margin-left: auto;
    display: flex;
    align-items: center;
    .more-btn {
      margin-left: 15px;
    }
  }

  &.fixed {
    position: fixed;
    background-image: linear-gradient(-34deg, #f5515f 0%, #9f041b 100%);
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    z-index: 2;
    @include dark {
      background: #1b1924;
      border-bottom: 4px solid #0f0d14; /* no */
    }
    .oper {
      top: 23px;
    }
  }
}
.assets-distribute {
  padding: 0 15px;
  ul {
    border-radius: 4px; /* no */
    display: flex;
    background-color: var(--default-bg);
    li {
      flex: 1;
      text-align: center;
      font-size: 14px;
      padding: 18px 0;
      font-weight: bold;
      color: var(--heavy-color);
      span {
        margin: 0 auto;
        width: 68px;
        height: 68px;
        background-color: #faf9fc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        img {
          width: 34px;
        }
        @include dark {
          background-color: #2a2835;
        }
      }
    }
  }
}
.assets-bill {
  .bill-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 15px 12px 15px;
    position: relative;
    z-index: 1;
    h3 {
      font-size: 14px;
      color: var(--heavy-color);
    }
  }
  .bill-list {
    position: relative;
    overflow: hidden;
    height: 65px;
    .x-scroll {
      overflow-x: auto;
      overflow-y: hidden;
      height: 90px;
      padding-left: 15px;
      -webkit-overflow-scrolling: touch;
    }
    ul {
      display: inline-flex;
      align-items: center;
      li {
        flex: none;
        width: calc(100vw - 62px);
        margin-right: 15px;
        display: flex;
        align-items: center;
        border-radius: 4px; /* no */
        padding: 15px;
        background-color: var(--default-bg);
        .icon {
          flex: none;
          width: 26px;
          height: 26px;
          line-height: 26px;
          border-radius: 50%;
          text-align: center;
          img {
            width: 100%;
            vertical-align: middle;
          }
        }
        .info {
          margin-left: 10px;
          .tit {
            font-size: 13px;
            @include bold;
          }
          .date {
            margin-top: 5px;
            font-size: 10px;
          }
        }
        .num {
          width: 80px;
          color: #ff3131;
          font-size: 16px;
          margin-left: auto;
          text-align: right;
        }
      }
      &.default {
        display: block;
        li {
          width: auto;
        }
      }
    }
  }
}
.assets-account {
  padding: 15px 15px 0 15px;
  .account-list {
    border-radius: 4px; /* no */
    background-color: var(--default-bg);
    padding: 0 15px;
    .account-item {
      padding: 15px 0;
      display: flex;
      align-items: center;
      &:not(:first-of-type) {
        border-top: 1px solid rgba(0,0,0,0.04); /* no */
        @include dark {
          border-color: rgba(255,255,255,0.04);
        }
      }
    }
    .label {
      font-size: 14px;
      color: var(--heavy-color);
      @include bold;
    }
    .right {
      margin-left: auto;
      text-align: right;
    }
    .balance {
      font-size: 18px;
      color: var(--heavy-color);
      font-weight: 500;
    }
    .unit {
      font-size: 10px;
      color: var(--thin-color);
      margin-top: 5px;
    }
  }
}
.assets-discount {
  padding: 15px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include bold;
}
.assets-map {
  padding: 0 15px 15px 15px;
  .map-list {
    display: flex;
    background-color: var(--default-bg);
    border-radius: 4px; /* no */
  }
  .map-item {
    flex: none;
    width: 33.33%;
    padding: 20px 0;
    text-align: center;
    .icon {
      height: 40px;
      display: inline-flex;
      align-items: center;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
    .label {
      color: var(--heavy-color);
      font-size: 14px;
      margin-top: 8px;
      @include bold;
    }
  }
}
</style>
