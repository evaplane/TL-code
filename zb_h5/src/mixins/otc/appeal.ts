import { Component, Vue } from 'vue-property-decorator';
import { EOtcAppeal as EAppealType } from '@/config/enums';

@Component
export default class MixinsOtcAppeal extends Vue {
  // 买卖状态
  public buyType: number = 1; // 买
  public sellType: number = 2; // 卖
  public otcType: number = 1; // otc订单
  public ctcType: number = 2; // ctc订单

  public get appealMap(): any {
    return {
      [EAppealType.NoResponse]: '对方无应答',
      [EAppealType.Cheat]: '对方有欺诈行为',
      [EAppealType.PutCoin]: '对方未放币',
      [EAppealType.PayFor]: '对方未付款',
      [EAppealType.Other]: '其他'
    };
  }
}
