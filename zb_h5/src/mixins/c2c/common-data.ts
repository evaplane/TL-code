import { Component, Vue } from 'vue-property-decorator';

export interface IActions {
  name: string;
  value: string;
}
export interface IBankCard {
  name: string;
  urlName: string;
  value: string;
  key: number;
}

@Component
export default class MixinsC2CCommonData extends Vue {
  public mixinsMoneyActions: IActions[] = [
    {
      name: '人民币(CNY)',
      value: 'cny'
    },
    {
      name: '港币(HKD)',
      value: 'hkd'
    },
    {
      name: '美元(USD)',
      value: 'usd'
    }
  ];
  public mixinsPayActions: IActions[] = [
    {
      name: '__("银行卡")',
      value: '1'
    },
    {
      name: '__("微信")',
      value: '2'
    },
    {
      name: '__("支付宝")',
      value: '3'
    },
    {
      name: 'Paypal',
      value: '4'
    },
    {
      name: '__("西联汇款")',
      value: '5'
    },
    {
      name: '__("国际Swift转账")',
      value: '6'
      // }, {
      //   name: 'Visa',
      //   value: '7'
    }
  ];
  public mixinsCoinListActions: IActions[] = [
    {
      name: 'QC',
      value: 'qc'
    },
    {
      name: 'USDT',
      value: 'usdt'
    },
    {
      name: 'BTC',
      value: 'btc'
    },
    {
      name: 'ETH',
      value: 'eth'
    }
  ];
  public mixinsKYCListActions: IActions[] = [
    {
      name: 'KYC(无)',
      value: '0'
    },
    {
      name: 'KYC(初级)',
      value: '3'
    },
    {
      name: 'KYC(高级)',
      value: '6'
    },
    {
      name: 'KYC(视频)',
      value: '9'
    }
  ];
  public mixinsScoreListActions: IActions[] = [
    {
      name: '不限',
      value: ''
    },
    {
      name: '2分',
      value: '2'
    },
    {
      name: '2.5分',
      value: '2.5'
    },
    {
      name: '3分',
      value: '3'
    },
    {
      name: '3.5分',
      value: '3.5'
    },
    {
      name: '4分',
      value: '4'
    },
    {
      name: '4.5分',
      value: '4.5'
    }
  ];
  public mixinsDealQuantityListActions: IActions[] = [
    {
      name: '不限',
      value: '0'
    },
    {
      name: '1笔',
      value: '1'
    },
    {
      name: '3笔',
      value: '3'
    },
    {
      name: '5笔',
      value: '5'
    },
    {
      name: '10笔',
      value: '10'
    },
    {
      name: '50笔',
      value: '50'
    },
    {
      name: '100笔',
      value: '100'
    }
  ];
  public mixinsAdTypeActions: IActions[] = [
    {
      name: '全部',
      value: ''
    },
    {
      name: '上架中',
      value: '1'
    },
    {
      name: '已下架',
      value: '2'
    },
    {
      name: '已完成',
      value: '3'
    }
  ];
  public mixinsBankCard: IBankCard[] = [
    {
      name: '银行卡',
      urlName: 'bank',
      value: 'c2c-bank-card',
      key: 1
    },
    {
      name: '微信支付',
      urlName: 'wechat',
      value: 'c2c-app-card',
      key: 2
    },
    {
      name: '支付宝',
      urlName: 'alipay',
      value: 'c2c-app-card',
      key: 3
    },
    {
      name: 'Paypal',
      urlName: 'Paypal',
      value: 'add-paypal-card',
      key: 4
    },
    {
      name: '西联汇款',
      urlName: 'west',
      value: 'add-other-card',
      key: 5
    },
    {
      name: '国际Swift转账',
      urlName: 'swift',
      value: 'add-other-card',
      key: 6
    }
  ];
}
