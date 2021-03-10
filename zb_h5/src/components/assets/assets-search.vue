<template>
  <div class="assets-search-warp">
    <div class="assets-coin-list" v-if="selectCoinList.length > 0 && loading === false">
      <slot name="legal-currency"></slot>
      <div class="head" v-if="searchMode === false">
        <h2 v-if="['payin', 'withdraw'].indexOf(action) > -1">数字资产</h2>
        <m-checkbox @change="lowAssetsChange" class="filter-checkbox" label="隐藏小额币种" v-model="isHideLowAssets" />
      </div>
      <div class="list" :class="{ 'only-coin-name': !showBody }">
        <div :class="getDisableClass(item)" :key="item.key" @click="itemClick(item)" class="item" v-for="item in list" v-hover>
          <img :src="`./img/coins/${item.key.toLowerCase()}.svg`" class="icon-coins" />
          <dl class="item-left">
            <dt>{{ item.key }}</dt>
            <dd v-if="showBody">{{ item.coinUnitName }} 冻结:{{ item.freeze }}</dd>
          </dl>
          <dl class="item-right" v-if="showBody">
            <dt>{{ item.available }}</dt>
            <dd>{{ Number(item.availableConverted) > 0 ? '≈' + item.availableConverted + ' CNY' : '≈0 CNY' }}</dd>
          </dl>
        </div>
      </div>
    </div>
    <no-data :visible="list.length === 0 && loading === false" />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Emit, Prop, Watch } from 'vue-property-decorator';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { fixDecimal, fixNumber } from '@/utils/math';
import { ISpotAssets } from '@/api/assets';
import { IMortgageList } from '@/api/mortgage';
import { Catch } from '@/utils/decorators';
import { getUnitName } from '@/js/coin-name';
import { setLocal, getLocal } from '@/utils/storage';
import { IFundAsset } from '@/api/activity';
import { isNotEmpty } from '@/utils/is';
import mixinsCoinRate from '@/mixins/assets/coin-rate';
import mCheckbox from '@/components/common/checkbox/index.vue';
import { State, Action } from 'vuex-class';
import { ILeverTypes } from '@/api/lever';
import { IGetAssetsFunction, ICoinItemInfo } from '@/store/modules/assets';

@Component({
  components: {
    mCheckbox
  }
})
export default class AssetsSearch extends Mixins(mixinsSignHooks, mixinsCoinRate) implements ISignHooks {
  @Prop({ type: String, default: '' }) searchCoinName!: string;
  @Prop({ type: Boolean, default: false }) searchMode!: boolean;
  @Prop({ type: Boolean, default: true }) showBody!: boolean;
  @Prop({ type: String, default: '' }) propAccountType!: string;
  @Prop({ type: Function, default: null }) itemClickFun!: Function | null;
  loading: boolean = false;
  isHideLowAssets: boolean = (this.searchMode ? false : getLocal('__low-assets-visible')) || false;
  @State('mortgageAssets', { namespace: 'assets' }) mortgageAssets!: IMortgageList;
  @State('fundAssets', { namespace: 'assets' }) fundAssets!: IFundAsset;
  @State('spotAssets', { namespace: 'assets' }) spotAssets!: ISpotAssets;
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  @Action('getRateByCoinName', { namespace: 'market' }) getRateByCoinName!: Function;
  @Action('getMortgageAssets', { namespace: 'assets' }) getMortgageAssets!: IGetAssetsFunction;
  @Action('getFundAsset', { namespace: 'assets' }) getFundAsset!: IGetAssetsFunction;
  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: IGetAssetsFunction;
  @Action('getSpotAssets', { namespace: 'assets' }) getSpotAssets!: IGetAssetsFunction;
  @Action('updateSearchList', { namespace: 'assets' }) updateSearchList!: Function;
  get accountType(): string {
    return this.propAccountType || this.$route.params.type || '';
  }
  get list() {
    return this.selectCoinList.filter(item => {
      if (this.isHideLowAssets === true) {
        return Number(item.available) > 0;
      }
      if (item.key.indexOf(this.searchCoinName.toUpperCase()) > -1) {
        return true;
      }
    });
  }
  get action(): string {
    let { meta, params } = this.$route;
    return meta.action || params.action || '';
  }
  get canTransferCoinList(): string[] {
    const mortgageCoins = this.mortgageAssets.assets.map(item => {
      return item.coinName.toUpperCase();
    });
    const fundCoins = this.fundAssets.balances.map(item => {
      return item.key.toUpperCase();
    });
    return mortgageCoins.concat(fundCoins);
  }
  get selectCoinList(): ICoinItemInfo[] {
    if (this.mixinsIsLogin === false) {
      return [];
    }
    if (this.accountType === 'present') {
      let { balances } = this.spotAssets;
      if (balances && balances.length) {
        return balances.map(item => {
          return {
            key: item.key,
            available: fixDecimal(item.available, Number(item.unitDecimal)),
            coinUnitName: getUnitName(item.key),
            freeze: fixDecimal(item.freeze, Number(item.unitDecimal)),
            isCanWithdraw: item.isCanWithdraw === 'true',
            isCanRecharge: item.isCanRecharge === 'true',
            availableConverted: this.mixinsGetAmount(item.key, item.available, item.unitDecimal)
          };
        });
      }
    }
    if (this.accountType === 'lever') {
      return [];
    }
    if (this.accountType === 'mortgage') {
      let { assets } = this.mortgageAssets;
      if (assets && assets.length) {
        return assets.map(item => {
          return {
            key: item.coinName,
            available: fixNumber(item.available, 5),
            coinUnitName: getUnitName(item.coinName),
            availableConverted: this.mixinsGetAmount(item.coinName, item.available, 2),
            fundsType: item.fundsType,
            freeze: '--',
            isCanTransfer: true
          };
        });
      }
    }
    if (this.accountType === 'activity') {
      let { balances } = this.fundAssets;
      if (isNotEmpty(balances) === true) {
        return balances.map(item => {
          return {
            key: item.key,
            available: fixDecimal(item.available, Number(item.unitDecimal)),
            coinUnitName: getUnitName(item.key),
            freeze: fixDecimal(item.freeze, Number(item.unitDecimal)),
            isCanWithdraw: true,
            isCanRecharge: true,
            isCanTransfer: true,
            availableConverted: this.mixinsGetAmount(item.key, item.available, item.unitDecimal)
          };
        });
      }
    }
    return [];
  }

  @Watch('list', { deep: true })
  listWatcher(list: ICoinItemInfo[]) {
    this.updateSearchList(list);
  }

  @Watch('accountType')
  _() {
    if (this.accountType) {
      this.getList();
    }
  }
  lowAssetsChange() {
    this.isHideLowAssets = !this.isHideLowAssets;
    setLocal('__low-assets-visible', this.isHideLowAssets);
  }
  getDisableClass(item: ICoinItemInfo) {
    if (this.accountType === 'present') {
      if (this.action === 'payin' && item.isCanRecharge === false) {
        return 'disabled-payin';
      }
      if (this.action === 'withdraw' && item.isCanWithdraw === false) {
        return 'disabled-withdraw';
      }
    }
    return '';
  }
  isCanTransfer(coin: ICoinItemInfo) {
    return coin.isCanTransfer || this.canTransferCoinList.indexOf(coin.key.toUpperCase()) > -1;
  }
  @Emit()
  itemClick(item: ICoinItemInfo) {
    if (this.itemClickFun) {
      this.itemClickFun(item);
    } else {
      if (this.accountType === 'present') {
        if (this.action === 'payin' && item.isCanRecharge === false) {
          return this.$message.warn('该币种尚不支持充值');
        }
        if (this.action === 'withdraw' && item.isCanWithdraw === false) {
          return this.$message.warn('该币种尚不支持提现');
        }
        if (this.action === 'transfer' && this.isCanTransfer(item) === false) {
          return this.$message.warn('该币种尚不支持划转');
        }
      }
      let params = Object.assign({}, this.$route.params);
      let routeName = '';
      // 账号概览模式:指定跳账单
      if (!this.action) {
        routeName = 'assets-operating-bill';
      } else {
        routeName = 'assets-operating-' + this.action;
      }
      this.$nextTick(() => {
        if (this.searchMode === true) {
          this.$router.replace({ name: routeName, params, query: { coin: item.key } });
          return;
        }
        this.$router.push({ name: routeName, params, query: { coin: item.key } });
      });
    }
  }
  @Catch()
  async getList() {
    this.mixinsGetRate();
    if (this.accountType === 'present') {
      await this.getSpotAssets();
      await this.getMortgageAssets();
      await this.getFundAsset();
    } else if (this.accountType === 'lever') {
    } else if (this.accountType === 'mortgage') {
      await this.getMortgageAssets();
    } else if (this.accountType === 'activity') {
      await this.getFundAsset();
    }
    this.loading = false;
  }
  signIn() {
    this.loading = true;
    this.getList();
  }
  signOut() {}
}
</script>

<style lang='scss'>
.assets-search-warp {
  .nodata-box {
    flex: 1;
    overflow: hidden;
  }

  .assets-coin-list {

    .head {
      background-color: var(--default-bg);
      padding: 0 15px;
      height: 40px;
      display: flex;
      align-items: center;
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      z-index: 1;
      border-bottom: 1px solid var(--line-color);/* no */
      @include dark {
        border-color: #24222d;
      }

      h2 {
        font-size: 14px;
        color: var(--default-color);
        font-weight: normal;
      }

      .filter-checkbox {
        margin-left: auto;
      }
    }

    .list:not(:last-of-type) {
      border-bottom: 4px solid var(--line-color);/* no */
    }

    .item {
      padding: 15px 15px 15px 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      &:not(:first-of-type)::after {
        content: '';
        position: absolute;
        left: 15px;
        right: 15px;
        top: 0;
        height: 1px;/* no */
        border-top: 1px solid var(--line-color);/* no */
        @include dark {
          border-color: #24222d;
        }
      }

      .icon-coins {
        width: 26px;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
      }

      .item-right {
        text-align: right;
      }

      dt {
        font-size: 16px;
        margin-bottom: 6px;
        font-weight: 500;
        color: var(--heavy-color);
      }

      dd {
        color: var(--thin-color);
      }
    }
    .only-coin-name{
      dt{
        margin-bottom: 0;
      }
    }
  }
}
</style>
