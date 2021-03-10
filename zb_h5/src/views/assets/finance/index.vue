<template>
  <div class="finance-panel assets-panel">
    <div class="finance-header">
      <div class="header-wrap">
        <div @click="$router.push({ name: 'assets' })" class="header-left"><icon-return /></div>
        <h1 class="header-title">__('理财')</h1>
        <div class="header-right">
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

      <div class="header-content">
        <dl class="total">
          <dt class="label">__('理财总金额')({{ currency }})</dt>
          <dd class="number"><span class="price" v-price="{ enable: hiding, value: fixDecimal(+loanInfo.inLoan) }" /></dd>
        </dl>
        <div class="cumulative">
          <dl>
            <dt class="label">__('累计理财')({{ currency }})</dt>
            <dd class="number"><span class="price" v-price="{ enable: hiding, value: fixDecimal(+loanInfo.totalLoan) }" /></dd>
          </dl>
          <dl>
            <dt class="label">__('累计收益')({{ currency }})</dt>
            <dd class="number"><span class="price" v-price="{ enable: hiding, value: fixDecimal(+loanInfo.totalLiXi) }" /></dd>
          </dl>
        </div>
      </div>
    </div>
    <tab @change="tabChange" class="finance-tabs" v-model="tabType">
      <tab-item :key="key" :name="key" v-for="(item, key) in tabList">{{ item }}</tab-item>
    </tab>
    <div class="finance-content">
      <router-view
        :hiding="hiding"
        :lever-coins="leverCoins"
        @change-currency="changeCurrency"
        :currency="currency"
        :assets="info"
        @refresh="refresh()"
      />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { tab, tabItem } from '@/components/common/tab/index';
import { Action, State } from 'vuex-class';
import { IGetAssetsFunction } from '@/store/modules/assets';
import { getLoanStats, IGetLoanStatsRes, getLeverCoins, IGetLeverCoinsResList } from '@/api/lever';
import { ISpotAssets } from '@/api/assets';
import { fixDecimal } from '@/utils/math';

interface ITabList {
  fund: string;
  record: string;
}
@Component({
  components: {
    tab,
    tabItem
  }
})
export default class Finance extends Vue {
  @Action('getSpotAssets', { namespace: 'assets' }) getSpotAssets!: IGetAssetsFunction;
  @State('spotAssets', { namespace: 'assets' }) spotAssets!: ISpotAssets;
  hiding: boolean = true;
  tabType: string = 'fund';
  tabList: ITabList = {
    fund: '__("我要理财")',
    record: '__("理财列表")'
  };
  currency: string = 'USDT';
  loanInfo: IGetLoanStatsRes = {
    inLoan: '0',
    totalLoan: '0',
    totalLiXi: '0'
  };
  leverCoins: IGetLeverCoinsResList[] = [];
  @Watch('$route.name', { immediate: true })
  _(val: string) {
    this.tabType = val.split('-')[1];
  }
  get info() {
    let { balances } = this.spotAssets;
    return balances.find(item => {
      return item.key === this.currency;
    });
  }
  tabChange(val: string) {
    this.$router.push({ name: `finance-${val}` });
  }
  async getLoanStats() {
    this.loanInfo = await getLoanStats({ loanCoin: this.currency });
  }
  async getLeverCoins() {
    let { leverCoins } = await getLeverCoins();
    this.leverCoins = leverCoins;
  }
  async mounted() {
    await this.getLeverCoins();
    this.currency = this.leverCoins[0].tag;
    await this.getSpotAssets();
    await this.getLoanStats();
  }
  changeCurrency(val: string) {
    this.currency = val;
    this.getLoanStats();
  }
  async refresh() {
    this.getSpotAssets(true);
    this.getLoanStats();
  }
  fixDecimal(val: number) {
    return fixDecimal(val, this.info ? +this.info.unitDecimal : 4);
  }
}
</script>
<style lang='scss'>
.finance-panel {
  z-index: 4;
  color: var(--default-color) !important;
  background-color: #f3f4f9 !important;
  @include dark {
    background-color: #000 !important;
  }
  .finance-header {
    flex: none;
    background: var(--primary-color);
    .header-wrap {
      height: 60px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      position: relative;
      .header-title {
        font-size: 20px;
        @include bold;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .header-content {
      color: #fff;
      padding: 0 15px;
      .total {
        .label {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .number {
          font-weight: 500;
          .price {
            font-size: 26px;
          }
        }
      }
      .cumulative {
        display: flex;
        margin-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1); /* no */
        dl {
          flex: 1;
          padding: 15px 0;
          & + dl {
            border-left: 1px solid rgba(255, 255, 255, 0.1); /* no */
            padding-left: 20px;
          }
        }
        .label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .number {
          font-weight: 500;
          .price {
            font-size: 20px;
          }
        }
      }
    }
  }
  .finance-tabs {
    background-color: var(--default-bg);
    padding: 0;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08); /* no */
    @include dark {
      border-color: rgba(255, 255, 255, 0.06);
    }
    .tab-item {
      padding: 12px 50px;
    }
  }
  .finance-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
