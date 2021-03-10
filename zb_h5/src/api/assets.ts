import { jsonp, IJsonpParams } from '@/utils/http';
import conf from '@/config/index';
import { IExtendUnitName } from '@/js/coin-name';
import { IJsonResponse } from '@/utils/otc-http';

export interface ISpotBillParamsTypes {
  /** 开始时间 如2018-09-14 23:50:50 */
  startDate?: string;
  /** 结束时间 如2018-09-14 23:50:50 */
  endDate?: string;
  /** 账单类型：withdraw：提现 charge：充值 buy：买入 sell：卖出 sxfbuy：买入手续费 sxfsell：卖出手续 zs：系统赠送 */
  operType?: string;
  /** 0：3天内数据: 1：3天前数据 */
  dataType: number;
  /** 货币类型：all、qc、btc */
  currency: string;
  /** 页码: 从1开始 */
  pageIndex: number;
  /** 每页显示数量: 默认10: 最多200 */
  pageSize: number;
}

export interface ISpotAssetBills {
  datatype: number;
  currency: string;
  operType: string;
  dataList: ISpotAssetBillItem[];
}

export interface ISpotAssetBillItem {
  id: string;
  date: string;
  billTypeValue: string;
  showCoin: string;
  showFiat: string;
  remark: string;
}

export interface ISpotAssets {
  totalAsset: string;
  balances: IBalance[];
  /** 是否使用zb抵扣手续费, 0:否, 1:是 */
  useZBPayTransFee: 0 | 1;
}

export interface IBalance extends IExtendUnitName {
  key: string; // 货币类型：btc、ltc、qc
  total: string; // 总额
  available: string; // 可用
  freeze: string; // 冻结
  fundsType: string; // 币种类型
  unitDecimal: string; // 资金保留位数
  isCanRecharge: string; // 是否可以充值
  isCanWithdraw: string; // 是否可以提币
  canLoan: string; // 是否可以理财
}

const _jsonpAsset = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/V1_0_0' + config.url;
  return jsonp(config);
};
const _jsonpAssetAccount = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/account/V1_0_0' + config.url;
  return jsonp(config);
};
const _jsonpAssetDownload = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/download/V1_0_0' + config.url;
  return jsonp(config);
};
const _jsonpBill = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/bill/V1_0_0' + config.url;
  return jsonp(config);
};
const _jsonpMortgageRecord = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/mortgage/V1_0_0' + config.url;
  return jsonp(config);
};

// 获取现货资产
export const getSpotAssets = (): Promise<ISpotAssets> => {
  return _jsonpAsset({
    url: '/getAsset'
  });
};

export interface IRechargeAddrResponse {
  /* 最小充值数量 */
  chargeMin?: string;
  /* is eth */
  isEth: boolean;
  /* 充值地址 */
  key: string;
  /** memo 标签 */
  memo: string;
  /* 网络确认时间(天) */
  rechargeConfirmTimes: number;
}
// 获取现货资产
export const getRechargeAddr = (coinName: string): Promise<IRechargeAddrResponse> => {
  return _jsonpAsset({
    url: '/getRechargeAddr',
    params: {
      coinName
    }
  });
};

// 现货账单
export const getSpotBills = (params: ISpotBillParamsTypes): Promise<ISpotAssetBills> => {
  return _jsonpBill({
    url: '/getBill',
    params
  });
};

// 获取创新区资产
export const getFundAsset = (): Promise<ISpotAssets> => {
  return _jsonpAsset({
    url: '/getFundAsset'
  });
};
interface IGetPayinCoinRecordParams {
  coinName: string;
  pageNo: number;
}

export interface IPayinCoinRecordItem {
  /** 接收地址 */
  coinTo: string;
  configTime: number;
  /** 确认次数 */
  confirmTimes: number;
  /** 是否内部转入 */
  isInnerTransfer: number;
  /** 展示地址 */
  linkKey: string;
  /** 金额 */
  number: string;
  /** 备注 */
  remark: string;
  /** 发送时间 */
  sendimeTime: number;
  /** 0 确认中 1 失败 2成功 */
  status: 0 | 1 | 2;
  txid: string;
  /** 7，40，42，44才显示备注 */
  type: 7 | 40 | 42 | 44;
}
export interface IGetPayinCoinRecordResponse {
  list: IPayinCoinRecordItem[];
  pageNo: number;
  pageSize: number;
  total: number;
  totalNo: number;
}
// 获取充值记录
export const getPayinCoinRecord = (params: IGetPayinCoinRecordParams): Promise<IGetPayinCoinRecordResponse> => {
  return _jsonpAsset({
    url: '/getPayinCoinRecord',
    params
  });
};
/**
 * 创建充值地址
 * @param coinName 币种名称, 小写
 * @param linkCoin 链区币种名称
 */
export const createAddress = (coinName: string, linkCoin?: string): Promise<IJsonResponse<any>> => {
  return _jsonpAsset({
    url: '/coinNew',
    params: {
      coinName,
      linkCoin: linkCoin || ''
    },
    isAll: true
  });
};

export interface IRechargeConfig {
  /** 最小划转金额 */
  chargeMin: string;
  /** 是否首次充值 */
  isFirstRecharge: boolean;
  /** 是否白名单 */
  isWhiteUser: boolean;
  /** 确认次数 */
  rechargeConfirmTimes: number;
  /** 配置说明 */
  config?: {
    /** 是否显示 */
    showTips: boolean;
    /** 中文提示 */
    tips: string;
    /** 英文提示 */
    tipsEn: string;
    /** 是否弹窗提示一下 */
    popup: boolean;
    /** 弹窗提示内容中文 */
    popupContent: string;
    /** 弹窗提示内容(英文) */
    popupContentEn: string;
  };
}
/**
 * 获取币种充值配置
 * @param coinName 币种名称, 小写
 */
export const getRechargeConfig = (coinName: string): Promise<IRechargeConfig> => {
  return _jsonpAsset({
    url: '/getRechargeConfig',
    params: {
      coinName
    }
  });
};

interface IDownloadCoinConfigDataItem {
  chainName: string;
  currency: number;
  fee: string;
  id: number;
  isDefault: boolean;
  myId: number;
}
export interface IDownloadCoinConfig {
  address: string;
  canWithdraw: string;
  dataList: IDownloadCoinConfigDataItem[];
  isBlackPayOutCoin: boolean;
  isCanAddAddress: boolean;
  isCanOptNewCoin: boolean;
  isCanWR: boolean;
  isFirstWithdrawRecord: boolean;
  isInOrNeedAuth: boolean;
  isInnerTransfer: boolean;
  isRepayLock: boolean;
  limitStatus: number;
  minFee: string;
  noPhoneNoGoogle: boolean;
  payEmailAuth: boolean;
  payGoogleAuth: boolean;
  payMobileAuth: boolean;
  safeAuth: boolean;
  withdrawConfirmTimes: number;
}
// 获取提现币种信息
export const getDownloadCoinConfig = (coinName: string, blockChain?: string): Promise<IDownloadCoinConfig> => {
  return _jsonpAssetDownload({
    url: '/getDownloadCoinConfig',
    params: {
      coinName,
      blockChain: blockChain || ''
    }
  });
};
export interface IDoCoinDownloadParams {
  opUnique: string; //	是	唯一码（当前时间戳）
  coinName: string;	// 是	提现类型 btc / ltc / eth / etc
  receiveAddress: string; // 是	提现地址
  fees: string; //	是	手续费
  cashAmount: string; //	是	提现金额
  safePwd: string; //	是	安全密码
  mobileCode: string; //	是	动态验证码
  googleCode: string; //	否	google验证码
  isInnerTransfer?: string; //	否	是否内部转账 0否 1是
  blockChain?: string; //	否	提币走的链，如ETH链传5，只有该币种配置了多链提币才需要传
}
// 提币下单
export const doCoinDownLoad = (params: IDoCoinDownloadParams): Promise<void> => {
  return _jsonpAssetDownload({
    url: '/doCoinDownLoad',
    params
  });
};
interface IPayoutCoinRecordItem {
  merchantOrderNo: number; //	是		编号
  submitTime: number; //	是		提交时间（时间戳）
  isInnerTransfer: string; //	是		充值类型 0：区块链转入 1：内部转入
  toAddress: string; //	是		提现地址
  linkKey: string; //	是		查询地址
  afterAmount: number; //	是		提币金额
  txid: string; //	是		txid
  status: string; //	是		状态值 1, 2, 3, 6 显示manageTime 否则显示 -
  frontStatusDescr: string; //	是		状态描述
  reason: string; //	是		原因
  fees: number; //	是		手续费
}
export interface IPayoutCoinRecordResponse {
  list: IPayoutCoinRecordItem[]; //	{ } 提现信息
  total: number; //	是		总条数
  totalNo: number; //	是		总页数
  pageNo: number; //	是		页数
  pageSize: number; //		是		条数
}
export const getPayoutCoinRecord = (coinName: string, pageNo: number): Promise<IPayoutCoinRecordResponse> => {
  return _jsonpAssetDownload({
    url: '/getPayoutCoinRecord',
    params: {
      coinName,
      pageNo
    }
  });
};
export interface ICoinAddressItem {
  account: string;
  accountMemo: string;
  address: string;
  id: number;
  isAuth: boolean;
  memo: string;
}
export interface ICoinAddress {
  list: ICoinAddressItem[];
}
export const getCoinAddress = (coinName: string, isWithdraw: boolean, blockChain?: string): Promise<ICoinAddress> => {
  return _jsonpAssetDownload({
    url: '/getCoinAddress',
    params: {
      coinName,
      isWithdraw,
      blockChain: blockChain || ''
    }
  });
};
/**
 * 设置是否使用zb抵扣手续费
 * @param useZBPayTransFee 是否使用zb抵扣手续费, 1: 是, 0:否
 */
export const doUseZBPayTransFee = (useZBPayTransFee: number): Promise<IJsonResponse<any>> => {
  return _jsonpAsset({
    url: '/isUseZBPayTransFee',
    params: {
      useZBPayTransFee
    },
    isAll: true
  });
};

export interface IDoAddBlockParams {
  coinName: string; // 	否	btc, eth	可获取指定币种的资产
  address: string; // 	是		接收地址(例如BTS系列address_tag) 如果没有tag isMemoBoolean为false
  isMemoBoolean: boolean; //	是		是否需要标签
  memo: string; // 	否		地址昵称
  safepwd: string; // 	是		资金安全密码
  mobileCode: string; // 	是		短信验证码
  googleCode: string; // 	否		Google验证码
  blockChain?: string; //	否	BTC链: 2, ETH链: 5	提币地址所属链，只有该币种配置了多链提币才需要传
}

export const doAddBlock = (params: IDoAddBlockParams): Promise<IJsonResponse<{ id: string }>> => {
  return _jsonpAssetAccount({
    url: '/doAddBlock',
    isAll: true,
    params
  });
};
/**
 * 删除地址
 * @param coinName 币种名称, 小写
 * @param id id
 */
export const doDelBlock = (coinName: string, id: number): Promise<IJsonResponse<void>> => {
  return _jsonpAssetAccount({
    url: '/doAddBlock',
    params: {
      coinName, id
    }
  });
};
export interface IDoAddMortgageResponse {
  arrearsLx: string;
  borrowAmount: string;
  borrowCoin: number;
  borrowCoinShow: string;
  borrowCycleId: number;
  borrowCycleShow: string;
  borrowOneDayRateShow: string;
  borrowRate: any;
  borrowRateId: number;
  borrowRateShow: string;
  borrowRateType: number;
  countingInterest: boolean;
  createTime: number;
  finallyRate: string;
  giveBackMortgage: string;
  giveBackTradeMoney: string;
  id: number;
  interestForEarlyRedeem: string;
  isEarlyRedeem: boolean;
  latestRedeemTime: number;
  latestRedeemTimeUnRedeem: boolean;
  mortgageAmount: string;
  mortgageCoin: number;
  mortgageCoinShow: string;
  mortgageStatus: string;
  numbers: string;
  overLoss: boolean;
  penaltyForEarlyRedeem: string;
  price: string;
  redeemTimeMsg: number;
  remindMsg: number;
  risk: string;
  riskLevel: number;
  riskShow: number;
  showBchClearing: boolean;
  status: number;
  statusShow: string;
  statusShowEn: string;
  totalLx: string;
  totalMoney: string;
  transferIn: string;
  transferOut: string;
  type: number;
  typeShow: string;
  typeShowEn: string;
  userId: number;
  userName: string;
}
export interface IAddRecordListResponse {
  records: IDoAddMortgageResponse[];
}
/**
 * `getMortgageRecordList`获取用户抵押记录列表
 */
export const getMortgageRecordList = (pageIndex: number, pageSize: number, status: number): Promise<IAddRecordListResponse> => {
  return _jsonpMortgageRecord({
    url: '/getMortgageRecordList',
    params: {
      pageIndex,
      pageSize,
      status
    }
  });
};
/**
 * `doIncreaseMortgage`增加保证金
 */

export const doIncreaseMortgage = (mortgageRecordId: string, amount: string): Promise<void> => {
  return _jsonpMortgageRecord({
    url: '/doIncreaseMortgage',
    params: {
      mortgageRecordId, amount
    }
  });
};
export interface IAddRecordDetailResponse {
  record: IDoAddMortgageResponse;
  borrowCoinAvailable: string;
}
/**
 * `getMortgageRecordDetail`获取用户抵押记录详情
 */
export const mortgageRecordDetail = (id: string): Promise<IAddRecordDetailResponse> => {
  return _jsonpMortgageRecord({
    url: '/getMortgageRecordDetail',
    params: {
      id
    }
  });
};
/**
 * `doRedeemMortgage`赎回保证金
 */
export const doRedemptiveCapital = (mortgageRecordId: string, isEarly: boolean): Promise<void> => {
  return _jsonpMortgageRecord({
    url: '/doRedeemMortgage',
    params: {
      mortgageRecordId,
      isEarly
    }
  });
};
