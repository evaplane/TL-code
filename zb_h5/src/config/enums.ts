/**
 * OTC 订单状态
 */
export enum EOtcOrderStatus {
  /** 等待接单 */
  WaitReceive = 0,
  /** 接单超时 */
  ReceiveTimeout = 1,
  /** 拒绝接单 */
  Reject = 2,
  /** 待付款 */
  WaitPayMoney = 3,
  /** 待放币 */
  WaitPayCoin = 4,
  /** 申诉中 */
  Appealing = 5,
  /** 已完成 */
  Complete = 6,
  /** 已取消 */
  Cancel = 7,
  /** 处理失败 */
  Fail = 8
}

/**
 * OTC 广告状态
 */
export enum EOtcAdStatus {
  /** 发布失败 */
  PublishFail = 0,
  /** 上架中 */
  OnShelf = 1,
  /** 已下架 */
  OffShelf = 2,
  /** 已完成 */
  Complete = 3
}

/**
 * OTC 申述类型
 */
export enum EOtcAppeal {
  /** 对方无应答 */
  NoResponse = 1,
  /** 对方有欺诈行为 */
  Cheat = 2,
  /** 对方为放币 */
  PutCoin = 3,
  /** 对方未付款 */
  PayFor = 4,
  /** 其他 */
  Other = 9
}

/**
 * 银行卡类型
 */
export enum EOtcBankCard {
  /** 银行卡 */
  BankCard = 1,
  /** 微信 */
  Wechat = 2,
  /** 支付宝 */
  Alipay = 3,
  /** Paypal */
  Paypal = 4,
  /** 西联汇款 */
  Western = 5,
  /** 国际Swift转账 */
  international = 6
}

export enum ERealAuth {
  /** 高级认证未提交 */
  HighAuthNotApply = 0,
  /** 高级认证待审核 */
  HighAuthApply = 1,
  /** 高级认证通过 */
  HighAuthPass = 2,
  /** 高级认证未通过 */
  HighAuthNotPass = 3,
  /** 初级认证未提交 */
  PrimaryAuthNotApply = 4,
  /** 初级认证待审核 */
  PrimaryAuthApply = 5,
  /** 初级认证通过 */
  PrimaryAuthPass = 6,
  /** 初级认证未通过 */
  PrimaryAuthNotPass = 7,
  /** 视屏认证审核中 */
  VideoApply = 8,
  /** 视频认证通过 */
  VideoPass = 9,
  /** 视频认证不通过 */
  VideoNotPass = 10
}
