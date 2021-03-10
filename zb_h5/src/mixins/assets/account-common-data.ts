import { Component, Vue } from 'vue-property-decorator';
import { IBalance, ISpotAssets } from '@/api/assets';
import { IFundAsset, IFundAssetBalancesItem } from '@/api/activity';
import { IMortgageItem, IMortgageList } from '@/api/mortgage';
import { IGetAssetsFunction } from '@/store/modules/assets';
import { State, Action } from 'vuex-class';
import { ILeverTypes, ILeverDataTypes } from '@/api/lever';

export interface IActions {
  name: string;
  value: string;
}

@Component
export default class MixinsAccountCommonData extends Vue {
  @State('spotAssets', { namespace: 'assets' }) private mixinsSpotAssets!: ISpotAssets;
  @State('mortgageAssets', { namespace: 'assets' }) private mixinsMortgageAssets!: IMortgageList;
  @State('fundAssets', { namespace: 'assets' }) private mixinsFundAssets!: IFundAsset;
  @State('leverAssets', { namespace: 'assets' }) private leverAssets!: ILeverTypes;

  @Action('getSpotAssets', { namespace: 'assets' }) private getSpotAssets!: IGetAssetsFunction;
  @Action('getMortgageAssets', { namespace: 'assets' }) private getMortgageAssets!: IGetAssetsFunction;
  @Action('getFundAsset', { namespace: 'assets' }) private getFundAsset!: IGetAssetsFunction;
  @Action('getLeverAssets', { namespace: 'assets' }) private getLeverAssets!: IGetAssetsFunction;
  public mixinsAccountActions: IActions[] = [
    {
      name: '__("理财账户")',
      value: 'mortgage'
    },
    {
      name: '__("杠杆账户")',
      value: 'lever'
    },
    {
      name: '__("活动账户")',
      value: 'activity'
    }
  ];

  public mixinsBasicAccountActions: IActions[] = [
    {
      name: '__("基本账户")',
      value: 'basic'
    }
  ];

  public mixinsAccountLabelMap: IObj<string> = {
    basic: '__("基本")',
    mortgage: '__("理财")',
    lever: '__("杠杆")',
    activity: '__("活动")'
  };

  /** 当前币种名称 */
  public get mixinsCoinName(): string {
    const mixinsCoinName = this.$route.query.coin + '' || '';
    return mixinsCoinName.toUpperCase();
  }

  public get mixinsAccountType(): string {
    return this.$route.params.type || '';
  }

  public get mixinsIsLever(): boolean {
    return this.mixinsAccountType === 'lever';
  }

  public get mixinsLeverMarket(): string {
    return this.$route.query.market + '' || '';
  }

  /** 当前币种可划转的账户 */
  public get mixinsSupportTransferAccountActions(): IActions[] {
    return this.mixinsAccountActions.reduce((supportTransferAccountActions: IActions[], accountActions: IActions): IActions[] => {
      const temp: IActions[] = [];
      if (this.mixinsIsLever && accountActions.value === 'lever') {
        temp.push(accountActions);
      } else if (!this.mixinsIsLever) {
        if (accountActions.value === 'mortgage' && this.mixinsMortgageCoin) {
          // 理财账户不为空时，将理财账户加入支持划转的账户列表提供选择
          temp.push(accountActions);
        } else if (accountActions.value === 'activity' && this.mixinsActivityCoin) {
          // 活动账户
          temp.push(accountActions);
        }
      }
      return supportTransferAccountActions.concat(temp);
    }, []);
  }

  /** 现货账户币种信息 */
  public get mixinsSpotCoin(): IBalance | null {
    if (this.mixinsSpotAssetsBalance.length && this.mixinsCoinName) {
      return (
        this.mixinsSpotAssetsBalance.find(
          (item: IBalance): boolean => {
            return item.key === this.mixinsCoinName;
          }
        ) || null
      );
    }
    return null;
  }

  /** 理财账户币种信息 */
  public get mixinsMortgageCoin(): IMortgageItem | null {
    if (this.mixinsMortgageAssetsBalance.length && this.mixinsCoinName) {
      return (
        this.mixinsMortgageAssetsBalance.find(
          (item: IMortgageItem): boolean => {
            return item.coinName === this.mixinsCoinName;
          }
        ) || null
      );
    }
    return null;
  }

  /** 活动区账户币种信息 */
  public get mixinsActivityCoin(): IFundAssetBalancesItem | null {
    if (this.mixinsFundAssetsBalance.length && this.mixinsCoinName) {
      return (
        this.mixinsFundAssetsBalance.find(
          (item: IFundAssetBalancesItem): boolean => {
            return item.key === this.mixinsCoinName;
          }
        ) || null
      );
    }
    return null;
  }

  /** 杠杆账户币种信息 */
  public get mixinsLeverCoin(): ILeverDataTypes | null {
    if (this.mixinsIsLever && this.mixinsLeverMarket) {
      return (this.mixinsLeverAssetsBalance.find(item => {
        return item.key === this.mixinsLeverMarket.replace('_', '');
      }) || null);
    }
    return null;
  }

  public get mixinsSpotAssetsBalance(): IBalance[] {
    // 现货账户
    return this.mixinsSpotAssets.balances;
  }
  public get mixinsMortgageAssetsBalance(): IMortgageItem[] {
    // 理财账户
    return this.mixinsMortgageAssets.assets;
  }
  public get mixinsFundAssetsBalance(): IFundAssetBalancesItem[] {
    // 活动账户
    return this.mixinsFundAssets.balances;
  }
  public get mixinsLeverAssetsBalance(): ILeverDataTypes[] {
    return this.leverAssets.levers;
  }

  public mixinsRefreshAssets(): void {
    this.getSpotAssets(true);
    this.getMortgageAssets(true);
    this.getFundAsset(true);
    this.getLeverAssets(true);
  }

  public mixinsInitAssets(): void {
    // 对应账户为空时，从接口获取数据
    if (this.mixinsSpotAssetsBalance.length === 0) {
      this.getSpotAssets(true);
    }
    if (this.mixinsMortgageAssetsBalance.length === 0) {
      this.getMortgageAssets(true);
    }
    if (this.mixinsFundAssetsBalance.length === 0) {
      this.getFundAsset(true);
    }
    if (this.mixinsLeverAssetsBalance.length === 0) {
      this.getLeverAssets(true);
    }
  }
}
