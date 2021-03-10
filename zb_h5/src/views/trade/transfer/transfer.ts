import { Component, Mixins, Watch } from 'vue-property-decorator';
import Vue from '@/mixins/market/market';
import assetsHeaderRef from '@/components/assets/assets-header.ts';
import assetsHeader from '@/components/assets/assets-header.vue';
import { ILeverDataTypes, ILeverTypes, doTransferInLever, doTransferOutLever, IDoTransferParamsTypes } from '@/api/lever';
import { ISpotAssets, IBalance } from '@/api/assets';
import {
  IMortgageList,
  IMortgageItem,
  IMortgageTransferParams,
  doMortgageTransferIn,
  doMortgageTransferOut
} from '@/api/mortgage';
import {
  IFundAsset,
  IFundAssetBalancesItem,
  IFundTransferParams,
  fundTransferOuter,
  fundTransferInFromOuter
} from '@/api/activity';
import { IActions } from '@/mixins/c2c/common-data';
import { State, Action } from 'vuex-class';
import { ICoinItemInfo, IGetAssetsFunction } from '@/store/modules/assets';
import { fixNumber } from '@/utils/math';
import { isNumberStr, isEmpty } from '@/utils/is';
import { Catch } from '@/utils/decorators';

@Component({
  components: {
    assetsHeader
  }
})
export default class LeverTransfer extends Mixins(Vue) {
  @State('searchList', { namespace: 'assets' }) searchList!: ICoinItemInfo[];
  @State('leverList', { namespace: 'assets' }) leverList!: ILeverDataTypes[];
  @State('spotAssets', { namespace: 'assets' }) spotAssets!: ISpotAssets;
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  @State('mortgageAssets', { namespace: 'assets' }) mortgageAssets!: IMortgageList;
  @State('fundAssets', { namespace: 'assets' }) fundAssets!: IFundAsset;

  @Action('getSpotAssets', { namespace: 'assets' }) getSpotAssets!: IGetAssetsFunction;
  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: IGetAssetsFunction;
  @Action('getMortgageAssets', { namespace: 'assets' }) getMortgageAssets!: IGetAssetsFunction;
  @Action('getFundAsset', { namespace: 'assets' }) getFundAsset!: IGetAssetsFunction;

  /** 从现货账户划转到其他账户对应的方法 */
  transferInFunMap: IObj<Function> = {
    lever: doTransferInLever,
    mortgage: doMortgageTransferIn,
    activity: fundTransferOuter
  };
  /** 从其他账户划转到现货账户对应的方法 */
  transferOutFunMap: IObj<Function> = {
    lever: doTransferOutLever,
    mortgage: doMortgageTransferOut,
    activity: fundTransferInFromOuter
  };

  accountList: IObj<string> = {
    present: '__("现货账户")',
    lever: '__("杠杆账户")',
    mortgage: '__("抵押账户")',
    activity: '__("活动账户")'
  };

  updateAssetsFunctions: IObj<Function> = {
    present: this.getSpotAssets,
    lever: this.getLeverAssets,
    mortgage: this.getMortgageAssets,
    activity: this.getFundAsset
  };

  fromAccount: string = 'present';
  toAccount: string = 'lever';

  accountSheetVisible: boolean = false;

  /** 杠杆账户数据 */
  leverObj: ILeverDataTypes | null = null;
  /** 杠杆账户选择划转的币种 */
  leverCoinName: string = '';

  /** 理财、活动账户选择的币种信息 */
  coinObj: ICoinItemInfo | null = null;

  /** 划转金额 */
  amount: string | number = '';

  loading: boolean = false;

  '$refs': {
    header: assetsHeaderRef;
  };

  get coinName() {
    if (this.isLever) {
      return this.leverCoinName;
    } else if (this.coinObj) {
      return this.coinObj.key;
    }

    return '';
  }

  /** 划转的账户 */
  get curAccountType() {
    return this.fromAccount === 'present' ? this.toAccount : this.fromAccount;
  }

  /** 是否为杠杆账户 */
  get isLever() {
    return this.curAccountType === 'lever';
  }

  /** 可以选择的账户列表 */
  get accountActions() {
    return Object.keys(this.accountList)
      .filter(item => {
        return item !== 'present';
      })
      .map(item => {
        return {
          name: this.accountList[item],
          value: item,
          className: item === this.curAccountType ? 'van-action-sheet__item--active' : ''
        };
      });
  }

  /** 获取交易对 */
  get routerType() {
    return this.$route.params.type || '';
  }

  /** 币种对应的小数位数 */
  get coinDecimal() {
    let decimal: string = ' 4';
    if (this.fromAccount === 'lever') {
      if (this.leverObj) {
        decimal = this.coinName === this.leverObj.cShowName ? '' + this.leverObj.cUnitDecimal : '' + this.leverObj.fUnitDecimal;
      }
    } else {
      decimal = this.balanceObj ? (this.balanceObj as any).unitDecimal : '4';
    }
    return isNumberStr(decimal) ? parseInt(decimal) : 2;
  }

  /** 各个账户信息 */
  get balanceObj() {
    if (!this.coinName) return null;
    if (this.fromAccount === 'present') {
      // 现货账户
      const balanceObj: IBalance | undefined = this.spotAssets.balances.find(item => {
        return item.key === this.coinName;
      });
      return balanceObj || null;
    } else if (this.fromAccount === 'mortgage') {
      // 理财账户
      const balanceObj: IMortgageItem | undefined = this.mortgageAssets.assets.find(item => {
        return item.coinName === this.coinName;
      });
      return balanceObj || null;
    } else if (this.fromAccount === 'activity') {
      // 活动账户
      const balanceObj: IFundAssetBalancesItem | undefined = this.fundAssets.balances.find(item => {
        return item.key === this.coinName;
      });
      return balanceObj || null;
    } else if (this.fromAccount === 'lever') {
      // 杠杆账户
      if (this.leverObj === null) {
        return null;
      }

      const balanceObj: ILeverDataTypes | undefined = this.leverAssets.levers.find(item => {
        return item.key === (this.leverObj && this.leverObj.key);
      });
      return balanceObj || null;
    }
  }

  /** 获取余额 */
  get balance(): string | number {
    if (!this.coinName) return '--';
    if (this.fromAccount === 'present') {
      // 现货账户
      if (!this.balanceObj) return '--';
      return fixNumber((this.balanceObj as IBalance).available, parseInt((this.balanceObj as IBalance).unitDecimal));
    } else if (this.fromAccount === 'mortgage') {
      // 理财账户
      return this.balanceObj ? (this.balanceObj as IMortgageItem).available : '--';
    } else if (this.fromAccount === 'activity') {
      // 活动账户
      if (!this.balanceObj) return '--';
      return fixNumber(
        (this.balanceObj as IFundAssetBalancesItem).available,
        parseInt((this.balanceObj as IFundAssetBalancesItem).unitDecimal)
      );
    } else if (this.fromAccount === 'lever') {
      // 杠杆账户
      if (this.leverObj === null) {
        return '--';
      }

      if (this.balanceObj) {
        return this.coinName === (this.balanceObj as ILeverDataTypes).cShowName
          ? (this.balanceObj as ILeverDataTypes).cAvailable
          : (this.balanceObj as ILeverDataTypes).fAvailable;
      }
      return '--';
    }
    return '--';
  }

  /** 杠杆账户划转参数 */
  get leverTransferParams(): IDoTransferParamsTypes | null {
    if (this.leverObj) {
      return {
        amount: '',
        marketName: this.leverObj.key,
        coin: this.coinName.toLocaleLowerCase()
      };
    }
    return null;
  }
  /** 理财账户划转参数 */
  get mortgageTransferParams(): IMortgageTransferParams | null {
    if (this.coinObj && this.coinObj.fundsType !== undefined) {
      return {
        fundsType: +this.coinObj.fundsType,
        amount: ''
      };
    }
    return null;
  }
  /** 活动账户划转参数 */
  get activityTransferParams(): IFundTransferParams | null {
    if (this.coinObj) {
      return {
        coinName: this.coinObj.key.toLocaleLowerCase(),
        amount: ''
      };
    }
    return null;
  }

  @Watch('searchList', { deep: true })
  searchListWatcher() {
    this.setCoinObj();
  }

  @Watch('leverList', { deep: true })
  leverListWatcher() {
    this.setLeverObj();
  }

  @Watch('leverObj', { immediate: true, deep: true })
  leverObjWatcher(leverObj: ILeverDataTypes | null) {
    if (leverObj !== null) {
      this.leverCoinName = leverObj.cShowName;
    }
  }

  setLeverObj() {
    let leverObj = null;
    if (this.leverList.length > 0) {
      leverObj =
        this.leverList.find(item => {
          return item.key === this.routerType.replace('_', '');
        }) || this.leverList[0];
    }
    this.leverObj = leverObj;
  }

  setCoinObj() {
    let coinObj = null;
    if (this.searchList.length) {
      coinObj = this.searchList[0];
    }
    this.coinObj = coinObj;
  }

  /** 切换账户 */
  changeAccountClickHandle(accountValue: string) {
    if (accountValue === 'present') return;
    this.accountSheetVisible = true;
  }

  /** 选择账户 */
  accountSelectHandle(item: IActions) {
    this.accountSheetVisible = false;
    if (this.fromAccount === this.curAccountType) {
      this.fromAccount = item.value;
    } else {
      this.toAccount = item.value;
    }
    this.amount = '';
  }

  /** 显示币种列表或杠杆交易对 */
  changeCoin() {
    this.$nextTick(() => {
      this.$refs.header.searchClick();
    });
  }
  /** 选择交易对或币种 */
  itemClickHandle(coinInfoOrLeverObj: ICoinItemInfo | ILeverDataTypes) {
    if (this.isLever) {
      this.leverObj = coinInfoOrLeverObj as ILeverDataTypes;
    } else {
      this.coinObj = coinInfoOrLeverObj as ICoinItemInfo;
    }
    this.amount = '';
  }

  /** 切换杠杆账户币种 */
  changeLeverCoinClickHandle() {
    if (this.leverObj === null) return;
    this.leverCoinName = this.leverCoinName === this.leverObj.fShowName ? this.leverObj.cShowName : this.leverObj.fShowName;
    this.amount = '';
  }

  /** 对换转入转出账户 */
  swapClickHandle() {
    [this.fromAccount, this.toAccount] = [this.toAccount, this.fromAccount];
    this.amount = '';
  }

  /** 提交 */
  async submitClickHandle() {
    const transferParamsMap: IObj<IDoTransferParamsTypes | IMortgageTransferParams | IFundTransferParams | null> = {
      lever: this.leverTransferParams,
      mortgage: this.mortgageTransferParams,
      activity: this.activityTransferParams
    };
    const params = transferParamsMap[this.curAccountType];

    if (isEmpty(params) || params === null) {
      return this.$message.warn('__("请选择币种")');
    }

    if (!this.amount) {
      return this.$message.warn('__("请输入划转金额")');
    }

    const transferFunMap = this.fromAccount === 'present' ? this.transferInFunMap : this.transferOutFunMap;
    const transferFun = transferFunMap[this.curAccountType];

    params.amount = this.amount;
    this.loading = true;
    try {
      await transferFun(params);
      this.$message.success('__("划转成功")');
      this.amount = '';
      this.updateAssets();
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  @Catch()
  async updateAssets() {
    await this.updateAssetsFunctions[this.fromAccount](true);
    await this.updateAssetsFunctions[this.toAccount](true);
  }

  async mounted() {
    await this.getSpotAssets();

    if (this.isLever) {
      this.setLeverObj();
    } else {
      this.setCoinObj();
    }
  }
}
