<template>
  <div class="assets-panel assets-operating" style="z-index: 5">
    <!-- <img class="assets-bg" src="@img/assets/assets-bg.png" /> -->
    <assets-header
      @left-click="$router.back()"
      @search-click="coinListPopup = true"
      @search-close="coinListPopup = false"
      ref="header"
      source="assets-detail"
    >
      <div @click="titleClickHandle" class="header-title">
        <template v-if="accountType === 'lever'">
          <img :src="`./img/coins/${coinNameLowerCase}.svg`" class="coinimg" v-if="coinNameLowerCase" />
          <h2>{{ market.toUpperCase() }}</h2>
        </template>
        <template v-else>
          <img :src="`./img/coins/${coinNameLowerCase}.svg`" class="coinimg" v-if="coinNameLowerCase" />
          <h2>{{ coinNameLowerCase }}</h2>
          <template v-if="coinUnitNames.cn"
            ><span v-if="lang === 'cn'">/ {{ coinUnitNames.cn }}</span></template>
        </template>
      </div>
    </assets-header>
    <div class="assets-content">
      <native-scroll>
        <div class="assets-tabs">
          <div
            :class="{ 'tab-item--active': itemActive === key }"
            :key="key"
            @click="tabClick(key)"
            class="tab-item"
            v-for="(value, key) in tabs"
          >
            {{ value }}
          </div>
        </div>
        <router-view />
      </native-scroll>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import assetsHeader from '@/components/assets/assets-header.vue';
import { getUnitNames } from '@/js/coin-name';
import { Getter } from 'vuex-class';
import mixinsAccountCommomData from '@/mixins/assets/account-common-data';

@Component({
  components: {
    assetsHeader
  }
})
export default class AssetsOperating extends Mixins(mixinsAccountCommomData) {
  coinListPopup: boolean = false;
  tabs: IObj<string> = {
    payin: '充值',
    withdraw: '提现',
    transfer: '划转',
    bill: '账单'
  };
  @Getter('curLang', { namespace: 'lang' }) lang!: string;
  get coinName(): string {
    if (this.accountType !== 'lever') {
      return this.$route.query.coin + '' || '';
    } else {
      return this.market ? this.market.split('/')[0] : '';
    }
  }
  get itemActive(): string {
    return this.$route.meta.action || '';
  }
  get isLegalCurrency() {
    return ['rmb', 'usd', 'hkd'].indexOf(this.coinName) > -1;
  }
  // 币种多语言 { en: '', cn: '' }
  get coinUnitNames() {
    if (this.coinName) {
      if (this.isLegalCurrency === true) {
        let coins: IObj<IObj<string>> = {
          rmb: {
            en: 'RMB',
            cn: '人民币'
          },
          usd: {
            en: 'USD',
            cn: '美元'
          },
          hkd: {
            en: 'HKD',
            cn: '港币'
          }
        };
        return coins[this.coinName];
      }
      let names = getUnitNames(this.coinName);
      return names;
    }
    return {};
  }
  // 币种小写处理
  get coinNameLowerCase() {
    if (this.coinName) {
      return this.coinName.toLowerCase();
    }
    return '';
  }
  get accountType() {
    return this.$route.params.type || '';
  }
  get market() {
    let market = this.$route.query.market + '' || '';
    if (market) {
      return market.replace('_', '/');
    }
    return '';
  }

  '$refs': {
    header: assetsHeader;
  };
  titleClickHandle() {
    this.$refs.header.searchClick();
  }
  tabClick(key: string) {
    if (key === 'transfer' && this.mixinsSupportTransferAccountActions.length === 0) {
      return this.$message.warn('__("该币种尚不支持划转")');
    }
    let { query, params } = Object.assign({}, this.$route);
    this.$router.replace({ name: 'assets-operating-' + key, params, query });
  }

  mounted() {
    this.mixinsInitAssets();
  }
}
</script>
