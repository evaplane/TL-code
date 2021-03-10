/** eslint @typescript-eslint/explicit-member-accessibility: "off" */
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Getter, State } from 'vuex-class';
import { getMarketList, IUserMarketList } from '@/api/user';
import mixinsMarketList, { ISocketMarketInfo } from '@/mixins/market/market-list';
import emptyData from '@/components/common/no-data.vue';
import defaultMarket, { IDefaultMarket } from '@/config/default-market';
import { getUnitName } from '@/js/coin-name';
import { isArray } from '@/utils/is';

@Component({
  components: {
    emptyData
  }
})
export default class Market extends Mixins(mixinsMarketList) {
  // 是否是首页搜索
  @Prop({ type: Boolean, default: false }) isSearch!: boolean;
  @Prop({ type: String, default: '' }) searchCoin!: string;
  @Prop({ type: String, default: 'default' }) sortType!: string;
  @Prop({ type: String, default: '' }) sortName!: string;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @State('lang', { namespace: 'lang' }) lang!: string;
  userMarketList: string[] = [];
  get tabActive() {
    return this.$route.query.area || 'mainboard';
  }
  // 市场交易对
  get list() {
    let list = this.mixinsList.concat([]);
    // 数据为空 取根据配置币种显示占位图
    if (this.mixinsList.length === 0) {
      return this.getDefaultMarket();
    }
    if (this.isSearch === false) {
      // 非首页搜索
      if (this.sortName && this.sortType !== 'default') {
        list = this.sortParams(list);
      }
      if (this.tabActive === 'lever') {
        list = list.filter(item => item.isLever === true);
      } else if (this.tabActive === 'innovate') {
        list = list.filter(item => item.area === 2 && item.isLever === false);
      }
      if (this.isLogin && this.tabActive === 'user') {
        list = list.filter(item => this.userMarketList.includes(item.market));
      }
    }
    return list.filter(item => item.showName.toLowerCase().indexOf(this.searchCoin.toLowerCase()) > -1);
  }
  // 根据配置的币种名称生成列表
  getDefaultMarket() {
    if (this.mixinsMarket) {
      let marketTypeList = defaultMarket[this.tabActive as keyof IDefaultMarket];
      let names = marketTypeList[this.mixinsMarket];
      if (isArray(names) === true) {
        return names.map(name => {
          let item: ISocketMarketInfo = {
            showName: name,
            extendCoinVolStr: '-',
            isLever: false,
            riseRate: '0',
            lastPriceConvert: '-',
            lastPrice: '-',
            leverMultiple: 0,
            area: 0,
            currrency: '',
            hightPrice: '',
            market: '',
            vol: '',
            lowPrice: '',
            marketShowName: '',
            extendMoneyNameUp: '',
            extendCoinAlias: getUnitName(name)
          };
          return item;
        });
      }
      return [];
    }
    return [];
  }
  setColorClass(item: ISocketMarketInfo) {
    if (item.extendCoinVolStr === '-') {
      return '';
    }
    return Number(item.riseRate) > 0 ? 'buy-color' : 'sell-color';
  }
  setBgClass(item: ISocketMarketInfo) {
    if (item.extendCoinVolStr === '-') {
      return '';
    }
    return Number(item.riseRate) > 0 ? 'buy-bg' : 'sell-bg';
  }
  clickHandle(item: ISocketMarketInfo) {
    // 虚拟数据不能点击跳转
    if (item.extendCoinVolStr === '-') {
      return;
    }
    let query: any = {},
      routerName = 'trade-handicap';
    if (this.$route.name === 'index') {
      query.f = 'index';
    }
    if (this.$route.query.area === 'lever') {
      query.isLever = true;
      routerName = 'lever-handicap';
    }
    this.$router.push({
      name: routerName,
      params: {
        type: item.marketShowName.toLowerCase().replace('/', '_')
      },
      query: query
    });
  }
  getMarketList(market: string) {
    this.mixinsList = [];
    if (market === 'user') {
      this.getUserMarketList();
    }
    this.mixinsGetMarketList(market);
  }
  sortParams(list: ISocketMarketInfo[]) {
    list.sort((v1, v2) => {
      let key = this.sortName as keyof ISocketMarketInfo;
      return Number(v1[key]) - Number(v2[key]);
    });
    if (this.sortType === 'asc') {
      list = list.reverse();
    }
    return list;
  }
  // 获取用户收藏
  async getUserMarketList() {
    let obj = await getMarketList();
    if (obj.list.length) {
      this.userMarketList = obj.list.map((item: IUserMarketList) => item.marketName);
    } else {
      this.userMarketList = [];
    }
  }
  destroyed() {
    window.clearTimeout(this.timer);
  }
}
