import { Component, Mixins, Watch } from 'vue-property-decorator';
import tabBar from '@/components/layout/tab-bar.vue';
import mixinsMarket from '@/mixins/market/market';
import { mMenu, mMenuItem } from '@/components/common/menu/index';
import marketContent from '@/components/index/market-content.vue';
import search from '@/components/index/search.vue';
import { getMarketList, doEditUserMarket } from '@/api/user';
import { Route } from 'vue-router';
import { Catch } from '@/utils/decorators';
import { tab, tabItem } from '@/components/common/tab/index';
import mHeader from '@/components/index/head.vue';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { login } from '@/components/popup/index';

@Component({
  components: {
    tabBar,
    mMenu,
    tab,
    tabItem,
    search,
    mMenuItem,
    marketContent,
    mHeader
  }
})
export default class Trade extends Mixins(mixinsMarket, mixinsSignHooks) implements ISignHooks {
  tabType: string = 'trade-handicap';
  searchCoin: string = '';
  searchVisible: boolean = false;
  fixedClass: string = '';
  isCollected: boolean = false;
  entrustLabel: string = '';
  get tabList(): IObj<string> {
    if (this.mixinsIsLever === true) {
      return {
        'lever-handicap': '__("交易")',
        'lever-entrust': '__("记录")',
        'lever-kline': '__("K线")',
        'lever-data': '__("分析")',
        'lever-all': '__("全球")',
        'lever-overview': '__("概况")'
      };
    }
    return {
      'trade-handicap': '__("交易")',
      'trade-entrust': '__("记录")',
      'trade-kline': '__("K线")',
      'trade-data': '__("分析")',
      'trade-all': '__("全球")',
      'trade-overview': '__("概况")'
    };
  }
  get curArea(): string {
    let { group } = this.mixinsMarketInfo;
    if (this.mixinsIsLever === true) {
      return '__("杠杆")';
    }
    if (!group) {
      return '__("主板")';
    }
    if (group === 1) {
      return '__("主板")';
    }
    return '__("创新")';
  }
  @Watch('searchVisible')
  __() {
    if (this.searchVisible === true) {
      window.setTimeout(() => {
        this.fixedClass = 'fixed-active';
      }, 350);
    } else {
      this.fixedClass = '';
    }
  }
  @Watch('$route', { immediate: true })
  _(nv: Route, ov: Route) {
    this.tabType = this.$route.name + '';
    if (ov) {
      if (nv.params.type !== ov.params.type || nv.name !== ov.name) {
        this.searchVisible = false;
      }
    }
  }
  menuChangeHandle(val: string) {
    if (this.mixinsIsLogin === false) {
      login.open();
      return;
    }
    if (val === 'payinC') {
      this.$router.push({ name: 'assets-operating-payin', params: { type: 'present' }, query: { coin: this.mixinsCShowNameUp } });
    } else if (val === 'payinF') {
      this.$router.push({ name: 'assets-operating-payin', params: { type: 'present' }, query: { coin: this.mixinsFShowNameUp } });
    } else if (val === 'payinMoney') {
      this.$router.push({ name: 'assets-operating-payin', params: { type: 'present' }, query: { coin: 'rmb' } });
    }
  }
  tabChangeHandle(name: string) {
    this.$router.push({ name, params: { type: this.$route.params.type } });
  }
  @Catch()
  async collectMarketHandle() {
    let marketName = this.mixinsCShowNameUp + '_' + this.mixinsFShowNameUp;
    await doEditUserMarket({ marketName, status: this.isCollected ? 2 : 1 });
    this.$message.success(this.isCollected ? '__("取消自选成功")' : '__("添加自选成功")');
    this.getUserCollectMarketList();
  }
  signIn() {
    this.getUserCollectMarketList();
  }
  signOut() {
    this.isCollected = false;
  }
  @Catch()
  async getUserCollectMarketList() {
    // 获取用户收藏
    let obj = await getMarketList();
    this.isCollected = false;
    if (obj.list.length) {
      let marketName = this.mixinsCShowNameUp + '_' + this.mixinsFShowNameUp;
      this.isCollected = obj.list.some(item => item.marketName === marketName);
    }
  }
}
