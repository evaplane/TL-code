import { Component, Vue, Watch } from 'vue-property-decorator';
import { ICurrencyConfig, ICurrencyConfigWithdrawCoinsItem, ICurrencyConfigLinkCoinItem } from '@/store/modules/coins';
import { isNotEmpty } from '@/utils/is';
import { Catch } from '@/utils/decorators';
import { Action, State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
interface ICurrencyConfigByName {
  (name: string): Promise<ICurrencyConfig>;
}

@Component
export default class CurrencyConfig extends Vue {
  @Action('getCurrencyConfigByName', { namespace: 'coins' }) private getCurrencyConfigByName!: ICurrencyConfigByName;
  @State('userInfo', { namespace: 'user' }) public mixinsUserInfo!: IUser;
  public mixinsWithdrawCoinName: string = '';
  public mixinsLinkCoinName: string = '';
  // eslint-disable-next-line
  public mixinsCurrencyConfig = {} as ICurrencyConfig;
  private get coinName(): string {
    return this.$route.query.coin + '' || '';
  }
  /* 小写币种名称 */
  public get mixinsCoinName(): string {
    return (this.coinName || '').toLowerCase();
  }
  /* 大写币种名称 */
  public get mixinsCoinNameUp(): string {
    return this.mixinsCoinName.toUpperCase();
  }
  public get mixinsIsLegalCurrency(): boolean {
    return ['rmb', 'usd', 'hkd'].indexOf(this.mixinsCoinName) > -1;
  }
  public get mixinsWithdrawCoins(): ICurrencyConfigWithdrawCoinsItem[] {
    if (isNotEmpty(this.mixinsCurrencyConfig) === true) {
      let list = this.mixinsCurrencyConfig.withdrawCoins || [];
      if (list.length > 0) {
        list = list.filter((item): boolean => !!item.isOpen);
        if (list.length) {
          this.mixinsWithdrawCoinName = list[0].name;
        }
        return list;
      }
    }
    return [];
  }
  public get mixinsLinkCoins(): ICurrencyConfigLinkCoinItem[] {
    if (isNotEmpty(this.mixinsCurrencyConfig) === true) {
      let list = this.mixinsCurrencyConfig.linkCoin || [];
      if (list.length > 0) {
        list = list.filter((item): boolean => !!item.isPayIn);
        if (list.length) {
          this.mixinsLinkCoinName = list[0].coinName;
        }
      }
      return list;
    }
    return [];
  }
  public get mixinsIsGoogleCode(): boolean {
    return [0, 2, 3].indexOf(this.mixinsUserInfo.payoutAuth) > -1 && this.mixinsUserInfo.googleAuth !== 0;
  }
  public get mixinsIsPhoneEmail(): boolean {
    return (
      (!!this.mixinsUserInfo.email || !!this.mixinsUserInfo.mobile) && [0, 1, 3].indexOf(this.mixinsUserInfo.payoutAuth) > -1
    );
  }
  @Watch('mixinsCoinName', { immediate: true })
  private mixinsCoinNameChange(): void {
    this.mixinsGetCurrencyConfig();
  }
  @Catch()
  public async mixinsGetCurrencyConfig(): Promise<void> {
    // 法币不处理
    if (this.mixinsIsLegalCurrency === true) {
      return;
    }
    let res = await this.getCurrencyConfigByName(this.mixinsCoinName);
    this.mixinsCurrencyConfig = res || {};
  }
}
