import { Component, Vue } from 'vue-property-decorator';
import { reqGetOrderById, IOtcOrderResponse } from '@/api/otc/order';
import { otcOrderTimer } from '@/utils/date';
import { EOtcOrderStatus as OrderStatus } from '@/config/enums';

let timer: number | null = 0;
let orderDetailTimer: number | null = 0;

@Component
export default class MixinsOtcOrder extends Vue {
  // 订单日志
  public mixinsOrderLog: object[] = []; // 订单日志

  // 银行卡类型
  public mixinsOrderPayBankCard: number = 1; // 银行卡
  public mixinsOrderPayWeChatCard: number = 2; // 微信
  public mixinsOrderPayAlipayCard: number = 3; // 支付宝

  // 买卖状态
  public mixinsBuyType: number = 1; // 买
  public mixinsSellType: number = 2; // 卖
  public mixinsOtcType: number = 1; // otc订单
  public mixinsCtcType: number = 2; // ctc订单

  // 倒计时
  public mixinsCountdown: string = '0';// 订单倒计时
  public mixinsOtcOrderDetail: IOtcOrderResponse = {
    acceptOrderTimeOuts: 2,
    adId: '',
    adTradeType: 1,
    adType: 2,
    afterPayAppealWaitTimeOuts: 2,
    amount: '',
    appealTime: null,
    buyerStatus: 0,
    cancelTime: null,
    cancelUserId: null,
    confirmPayTime: null,
    confirmReceiveTime: null,
    emoneyUnit: '',
    id: '',
    marketId: '',
    marketName: '',
    merchantId: '',
    merchantNickName: '',
    merchantSourceUserId: '',
    money: '',
    moneyUnit: '',
    orderNickName: null,
    orderSourceUserId: '',
    orderTime: '',
    orderUserId: '',
    owner: 1,
    payNote: null,
    payTimeOuts: 2,
    paymentAttach: null,
    preStatus: 0,
    price: '',
    processTime: '',
    receiveAttach: null,
    sellerStatus: 0,
    status: 0,
    timeout: null,
    timeoutHasRemind: false,
    waitMerchantPayTime: 3,
    payInfo: {
      account: '',
      accountId: '',
      address: null,
      bankId: 0,
      bankName: '',
      cityCode: 150100,
      createTime: '',
      currency: null,
      deleted: false,
      note: null,
      payQrUrl: null,
      payment: 0,
      provinceCode: 150000,
      realName: '',
      receive: 1,
      signleAddress: null,
      subBranch: '',
      swftCode: null,
      type: 1,
      updateTime: null,
      userId: ''
    },
    payForInfo: {
      account: '',
      accountId: '',
      address: null,
      bankId: 0,
      bankName: '',
      cityCode: 150100,
      createTime: '',
      currency: null,
      deleted: false,
      note: null,
      payQrUrl: null,
      payment: 0,
      provinceCode: 150000,
      realName: '',
      receive: 1,
      signleAddress: null,
      subBranch: '',
      swftCode: null,
      type: 1,
      updateTime: null,
      userId: ''
    },
    orderLog: [{ title: '', type: 1, operationTime: '', status: 1 }]
  };

  // 路由路径
  public get mixinsRouterPath(): string {
    const status = this.mixinsOtcOrderDetail.status;
    if (status === OrderStatus.WaitPayCoin || status === OrderStatus.Complete || status === OrderStatus.Appealing) return 'c2c-order-seller';
    if (status === OrderStatus.WaitPayMoney) return 'c2c-order-buyer';
    return 'c2c-await-order';
  }

  // 商家详情
  public async mixinsGetOtcOrderDetail(orderId: string): Promise<void> {
    orderDetailTimer = window.setTimeout(async (): Promise<void> => {
      this.mixinsOtcOrderDetail = await reqGetOrderById(orderId);
      // otc 卖家 c2c交易
      if (this.$route.name !== this.mixinsRouterPath && this.$route.name !== 'serve-chat' && (this.mixinsJudgeTradeType !== this.mixinsBuyType || this.mixinsOtcOrderDetail.adTradeType === this.mixinsCtcType)) {
        this.$router.replace({ name: this.mixinsRouterPath, params: { orderId: this.$route.params.orderId } });
      }
      // otc 买家
      if (this.mixinsOtcOrderDetail.status === 3 && this.mixinsJudgeTradeType === this.mixinsBuyType && this.$route.name === 'c2c-await-order') {
        this.$router.replace({ name: this.mixinsRouterPath, params: { orderId: this.$route.params.orderId } });
      }
      this.mixinsGetOtcOrderDetail(orderId);
    }, 5000);
  }

  // 判断交易类型，对自己而言是购买还是卖出
  public get mixinsJudgeTradeType(): number {
    if (this.mixinsJudgeIsMerchant) {
      // 如果该订单是自己发布的广告，交易类型则和广告类型一致
      return this.mixinsOtcOrderDetail.adType; // adType 广告类型
    } else {
      // 如果该订单是客户下的单，买单的广告类型对客户来说是卖币
      return this.mixinsOtcOrderDetail.adType === this.mixinsBuyType ? this.mixinsSellType : this.mixinsBuyType;
    }
  }

  // 判断是否为商家
  public get mixinsJudgeIsMerchant(): boolean {
    return this.mixinsOtcOrderDetail.owner === 1;
  }

  // 判断是否为付款方
  public get mixinsJudgeIsPay(): boolean {
    return this.mixinsJudgeTradeType === this.mixinsBuyType;
  }

  // 判断订单状态
  public get mixinsJudgeTOrderStatus(): number {
    // 0 1 2 7 用户下单的时候
    // 3 商家接单的时候
    // 订单状态（0未接单，1接单超时，2拒绝接单，3未支付，4已付款，5申诉中，6已完成，7已取消）
    return this.mixinsOtcOrderDetail.status;
  }

  // 状态描述
  public get mixinsOrderStatusDesc(): string {
    switch (this.mixinsOtcOrderDetail.status) {
      case OrderStatus.WaitReceive:
        return '等待商家接单';
      case OrderStatus.ReceiveTimeout:
        return '商家接单超时，订单已取消';
      case OrderStatus.Reject:
        return '商家拒绝接单，订单已取消';
      case OrderStatus.WaitPayMoney:
        if (this.mixinsOtcOrderDetail.adType === this.mixinsBuyType) {
          return '等待商家付款并确认';
        } else {
          return '等待客户付款并确认';
        }
      case OrderStatus.WaitPayCoin:
        if (this.mixinsOtcOrderDetail.adType === this.mixinsBuyType) {
          return '商家已付款，等待客户确认';
        } else {
          return '客户已付款，等待商家确认';
        }
      case OrderStatus.Appealing:
        return '订单申诉中，客服正在处理';
      case OrderStatus.Complete:
        return '订单已完成，交易成功';
      case OrderStatus.Cancel:
        return '订单已取消，交易结束';
      default:
        return '未知状态';
    }
  }

  // 展示详情
  public get mixinsOrderProgressView(): string[] {
    const payString = this.mixinsOtcOrderDetail.adType === this.mixinsBuyType ? '商家' : '客户';
    const payeeString = this.mixinsOtcOrderDetail.adType === this.mixinsBuyType ? '客户' : '商家';

    switch (this.mixinsOtcOrderDetail.status) {
      case OrderStatus.WaitReceive:
      case OrderStatus.WaitPayMoney:
        return ['客户下订单', `${payString}付款&确认`, `${payeeString}确认收款`, '1'];
      case OrderStatus.ReceiveTimeout:
      case OrderStatus.Cancel:
      case OrderStatus.Reject:
        return ['客户下订单', '已取消订单', '2'];
      case OrderStatus.WaitPayCoin:
        return ['客户下订单', `${payString}付款&确认`, `${payeeString}确认收款`, '2'];
      case OrderStatus.Complete:
        return ['客户下订单', `${payString}付款&确认`, `${payeeString}确认收款`, '3'];
      case OrderStatus.Appealing:
        return ['客户下订单', '申诉客服处理', '仲裁订单结束', '2'];
      default:
        return ['客户下订单', '付款&确认', '确认收款', '1'];
    }
  }

  // 支付类型
  public get mixinsPayForCard(): string {
    switch (this.mixinsOtcOrderDetail.payInfo.type) {
      case this.mixinsOrderPayBankCard:
        return '银行账号';
      case this.mixinsOrderPayWeChatCard:
        return '微信账号';
      case this.mixinsOrderPayAlipayCard:
        return '支付宝账号';
      default:
        return '账号';
    }
  }

  // 提示语
  public get mixinsReminderDesc(): string[] {
    if (this.mixinsJudgeTradeType === this.mixinsBuyType && this.mixinsCountdown === '00:00') return ['你已付款超时，请尽快完成付款，否则将被对方申诉'];
    if (this.mixinsJudgeTradeType === this.mixinsBuyType && this.mixinsCountdown !== '00:00') return ['订单已确认，可直接依此付款，剩时：', this.mixinsCountdown];
    if (this.mixinsJudgeTradeType === this.mixinsSellType) return ['对方正在向您以下账户打款，剩时：', this.mixinsCountdown];
    return [];
  }

  public mixinsOtcOrderTimer(timerOut: string | number, orderTime: string | null): void {
    this.mixinsCountdown = otcOrderTimer(timerOut, orderTime);
    timer = window.setTimeout((): any => {
      if (this.mixinsCountdown !== '00:00') {
        this.mixinsOtcOrderTimer(timerOut, orderTime);
      }
    }, 100);
  }

  // 接单 打款倒计时
  public get mixinsCountdownString(): string {
    return this.mixinsCountdown;
  }

  public destroyed(): void {
    timer && window.clearTimeout(timer);
    orderDetailTimer && window.clearTimeout(orderDetailTimer);
    timer = null;
    orderDetailTimer = null;
  }
}
