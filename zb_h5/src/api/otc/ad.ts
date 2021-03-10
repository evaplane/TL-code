import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';
import { IOtcAccountResponse } from './account';

export const __postAd = (config: AxiosRequestConfig, isFormData: boolean = false): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/adcontroller' + config.url;
  return post(config, isFormData);
};

export type TAdSort = 1 | 2 | null;
export type TAd0or1 = 0 | 1;
export type TAdType = 1 | 2;
export type TAdStatus = 0 | 1 | 2 | 3;
type TStringOrNumber = string | number;

export interface IAdListParams {
  amountType?: TAdType; // (integer, optional): 数额类型 1-数量 2-金额 ,
  amount?: number | null; // (number, optional): 数额 ,
  baseCoinName?: string; // (string, optional): 法币名称 ,
  pageSize: number; // (integer, optional): pageIndex条数 ,
  creditSort?: TAdSort; // (integer, optional): 信用 1-ASC 2-DESC ,
  type?: TAdType; // (integer, optional): 交易类型（1 买，2 卖） ,
  priceSort?: TAdSort; // (integer, optional): 单价 1-ASC 2-DESC ,
  userId?: string; // (long, optional): 用户id ,
  marketId: string; // (string, optional): 市场Id ,
  adType?: TAdType; // (integer, optional): 1-otc 2-ct2 ,
  webId?: number; // (integer, optional): 站点id ,
  pageIndex: number; // (integer, optional): pageIndex页数 ,
  kycSort?: TAdSort; // (integer, optional): kyc认证 1-ASC 2-DESC ,
  serviceSort?: TAdSort; // (integer, optional): 服务速度 1-ASC 2-DESC ,
  tradeType?: TAdType; // (integer, optional): 1我要买币，2我要卖币 ,
  payWays?: string; // (string, optional): 支付方式 ,
  status?: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
}

export interface IAdListResponseResult {
  adId: string; // (long, optional): 广告id ,
  adType: TAdType; // (integer, optional): 1-OTC 2-CTC ,
  amount: number; // (number, optional): 数量 ,
  basicCoinPrecision: number; // (integer, optional): 法币精度 ,
  businessType: TAdType; // (integer, optional): 0:普通商家,1:认证商家 ,
  createTime: string; // "2019-08-15 20:27:10",
  dealMaxMoney: string; // (number, optional): 最大成交额 ,
  dealMinMoney: string; // (number, optional): 最小成交额 ,
  headImg: string | null; // (string, optional): 头像 ,
  lessKycAuth: number; // (integer, optional): 最低kyc认证 ,
  lessTradeCount: number; // (integer, optional): 最少交易笔数 ,
  lessUserScore: number; // (number, optional): 最低客户评分 ,
  marketId: number; // (integer, optional): 市场id ,
  marketName: string; // (string, optional): 市场 ,
  nickName: string; // (string, optional): 昵称 ,
  basicCoinName: string; // (string, optional): 法币名称 ,
  remainAmount: number; // (number, optional): 剩余数量 ,
  remainMoney: number; // (number, optional): 剩余金额 ,
  status: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
  totalTradeTimes: number; // (integer, optional): 总成交次数 ,
  tradeCoinName: string; // 交易币名称
  tradeCoin: number; // (integer, optional): 交易币种 ,
  tradeCoinPrecision: number; // (integer, optional): 交易币种精度 ,
  type: TAdType; // (integer, optional): 交易类型（1买，2卖） ,
  onlineStatus: TAd0or1; // (integer, optional): 是否在线 0:否,1:是 ,
  payWay: string; // (string, optional): 支付方式（多个逗号分割） ,
  price: number; // (number, optional): 单价 ,
  userId: string; // (long, optional): 用户id ,
}

export interface IAdListResponse {
  pageIndex: number;
  totalPage: number | null;
  totalRow: number;
  results: IAdListResponseResult[];
}
/**
 * 查询广告列表
 */
export const list = (params: IAdListParams): Promise<IAdListResponse> => {
  return __postAd({
    url: '/list',
    data: params
  });
};

export interface IAdC2cParams {
  amountType?: TAdType; // (integer, optional): 数额类型 1-数量 2-金额 ,
  amount?: number; // (number, optional): 数额 ,
  baseCoinName?: string; // (string, optional): 法币名称 ,
  pageSize?: number; // (integer, optional): pageIndex条数 ,
  creditSort?: TAdSort; // (integer, optional): 信用 1-ASC 2-DESC ,
  type?: TAdType; // (integer, optional): 交易类型（1 买，2 卖） ,
  priceSort?: TAdSort; // (integer, optional): 单价 1-ASC 2-DESC ,
  userId?: string; // (long, optional): 用户id ,
  marketId: string; // (string, optional): 市场Id ,
  adType?: TAdType; // (integer, optional): 1-otc 2-ct2 ,
  webId?: number; // (integer, optional): 站点id ,
  pageIndex?: number; // (integer, optional): pageIndex页数 ,
  kycSort?: TAdSort; // (integer, optional): kyc认证 1-ASC 2-DESC ,
  serviceSort?: TAdSort; // (integer, optional): 服务速度 1-ASC 2-DESC ,
  tradeType: TAdType; // (integer, optional): 1我要买币，2我要卖币 ,
  payWays?: string; // (string, optional): 支付方式 ,
  status?: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
}

export interface IAdC2cResponse {
  adId: string; // (long, optional): 广告id ,
  adType: TAdType; // (integer, optional): 1-OTC 2-CTC ,
  amount: number; // (number, optional): 数量 ,
  basicCoinPrecision: number; // (integer, optional): 法币精度 ,
  businessType: TAd0or1; // (integer, optional): 0:普通商家,1:认证商家 ,
  createTime: string; // (date, optional): 创建时间 ,
  dealMaxMoney: string; // (number, optional): 最大成交额 ,
  dealMinMoney: string; // (number, optional): 最小成交额 ,
  headImg: string | null; // (string, optional): 头像 ,
  lessKycAuth: number; // (integer, optional): 最低kyc认证 ,
  lessTradeCount: number; // (integer, optional): 最少交易笔数 ,
  lessUserScore: number; // (number, optional): 最低客户评分 ,
  marketId: number; // (integer, optional): 市场id ,
  marketName: string; // (string, optional): 市场 ,
  nickName: string; // (string, optional): 昵称 ,
  remainAmount: number; // (number, optional): 剩余数量 ,
  remainMoney: number; // (number, optional): 剩余金额 ,
  status: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
  totalTradeTimes: number; // (integer, optional): 总成交次数 ,
  tradeCoin: number; // (integer, optional): 交易币种 ,
  tradeCoinPrecision: number; // (integer, optional): 交易币种精度 ,
  type: TAdType; // (integer, optional): 交易类型（1买，2卖） ,
  onlineStatus: TAd0or1; // (integer, optional): 是否在线 0:否,1:是 ,
  payWay: string; // (string, optional): 支付方式（多个逗号分割） ,
  price: number; // (number, optional): 单价 ,
  userId: string; // (long, optional): 用户id ,
  isBusiness: TAd0or1; // 是否为商家用户 0不是，1 是
}
/**
 * CTC 广告列表
 */
export const ctcList = (params: IAdC2cParams): Promise<IAdC2cResponse> => {
  return __postAd({
    url: '/ctclist',
    data: params
  });
};

export interface IAdResponse {
  completeMoney: number; // (number, optional): 已完成交易额 ,
  basicCoinPrecision: number; // (integer, optional): 法币精度 ,
  hasOrderAmount: number; // (number, optional): 已下单的数量 ,
  payWay: string; // (string, optional): 支付方式（多个逗号分割） ,
  remark: string; // (string, optional): 备注 ,
  type: TAdType; // (integer, optional): 交易类型（1买，2卖） ,
  tradeCoin: number; // (integer, optional): 交易币种 ,
  marketId: number; // (integer, optional): 市场id ,
  completeAmount: number; // (number, optional): 已完成数量 ,
  adType: TAdType; // (integer, optional): 1-OTC 2-CTC ,
  serialVersionUID: string; // (long, optional),
  remainAmount: number; // (number, optional): 剩余数量 ,
  price: number; // (number, optional): 单价 ,
  accountIds: string; // (string, optional): 账户 ,
  lessTradeCount: number; // (integer, optional): 最少交易笔数 ,
  amount: number; // (number, optional): 数量 ,
  hasOrderMoney: number; // (number, optional): 已下单的金额 ,
  nickName: string; // (string, optional): 昵称 ,
  basicCoinName: string; // (string, optional): 法币名称 ,
  isFloat: TAd0or1; // (integer, optional): 是否浮动(0-否 1-是) ,
  updateTime: string; // (date, optional): 更新时间 ,
  userId: string; // (long, optional): 用户id ,
  floatPer: string; // (string, optional): 浮动比例 ,
  remainMoney: number; // (number, optional): 剩余金额 ,
  marketName: string; // (string, optional): 市场 ,
  acceptMaxPrice: number; // (number, optional): 可接受最高价格 ,
  adId: string; // (long, optional): 广告id ,
  tradeCoinName: string; // (string, optional): 交易币名称 ,
  createTime: string; // (date, optional): 创建时间 ,
  dealMaxMoney: number; // (number, optional): 最大成交额 ,
  accountList: IOtcAccountResponse[]; // (Array[com.zb.otc.entity.Account], optional): 账户list ,
  dealMinMoney: number; // (number, optional): 最小成交额 ,
  tradeCoinPrecision: number; // (integer, optional): 交易币种精度 ,
  lessUserScore: number; // (number, optional): 最低客户评分 ,
  lessKycAuth: number; // (integer, optional): 最低kyc认证 ,
  acceptMinPrice: number; // (number, optional): 可接受最低价格 ,
  status: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
}
/**
 * 查询广告详情
 */
export const getByAdId = (adId: number | string): Promise<IAdResponse> => {
  return __postAd({
    url: '/getByAdId',
    params: {
      adId: adId
    }
  });
};

export interface IOtcPublishAdParams {
  completeMoney?: number; // (number, optional): 已完成交易额 ,
  marketPrice?: number; // (number, optional): 市场价 ,
  hasOrderAmount?: number; // (number, optional): 已下单的数量 ,
  webIds?: string; // (string, optional): 站点ID（多个逗号分割） ,
  payWay: string; // (string, optional): 支付方式（多个逗号分割） ,
  remark: string; // (string, optional): 备注 ,
  type: TAdType; // (integer, optional): 交易类型（1买，2卖） ,
  marketId: number; // (integer, optional): 市场id ,
  completeAmount?: number; // (number, optional): 已完成数量 ,
  takeOrderPer?: number; // (number, optional): 接单率 ,
  adType: TAdType; // (integer, optional): 1-OTC 2-CTC ,
  serialVersionUID?: string; // (long, optional),
  remainAmount?: number; // (number, optional): 剩余数量 ,
  price: TStringOrNumber | null; // (number, optional): 单价 ,
  accountIds: string; // (string, optional): 账户 ,
  lessTradeCount: number; // (integer, optional): 最少交易笔数 ,
  amount: TStringOrNumber; // (number, optional): 数量 ,
  hasOrderMoney?: number; // (number, optional): 已下单的金额 ,
  totalMoney?: number; // (number, optional): 交易额 ,
  isFloat: TAd0or1; // (integer, optional): 是否浮动(0-否 1-是) ,
  updateTime?: string; // (date, optional): 更新时间 ,
  userId?: string; // (string, optional): 用户id ,
  floatPer?: string | null; // (string, optional): 浮动比例 ,
  remainMoney?: number; // (number, optional): 剩余金额 ,
  marketName?: string; // (string, optional): 市场 ,
  acceptMaxPrice?: TStringOrNumber | null; // (number, optional): 可接受最高价格 ,
  adId?: string; // (string, optional): 广告id ,
  registerDays?: number; // (integer, optional): 注册天数 ,
  createTime?: string; // (date, optional): 创建时间 ,
  dealMaxMoney: TStringOrNumber; // (number, optional): 最大成交额 ,
  dealMinMoney: TStringOrNumber; // (number, optional): 最小成交额 ,
  lessUserScore?: number; // (number, optional): 最低客户评分 ,
  authLevel: number; // (integer, optional): 认证等级 ,
  lessKycAuth: number; // (integer, optional): 最低kyc认证 ,
  acceptMinPrice?: TStringOrNumber | null; // (number, optional): 可接受最低价格 ,
  status?: TAdStatus; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
}
/**
 * 发布广告
 */
export const publishAd = (params: IOtcPublishAdParams): Promise<void> => {
  return __postAd({
    url: '/publishAd',
    data: params
  });
};

export interface IOtcUserAdListParams {
  amountType?: TAdType; // (integer, optional): 数额类型 1-数量 2-金额 ,
  amount?: number; // (number, optional): 数额 ,
  baseCoinName: string | null; // (string, optional): 法币名称 ,
  pageSize: number; // (integer, optional): pageIndex条数 ,
  creditSort?: TAdSort; // (integer, optional): 信用 1-ASC 2-DESC ,
  type: TAdType | null; // (integer, optional): 交易类型（1 买，2 卖） ,
  priceSort?: TAdSort; // (integer, optional): 单价 1-ASC 2-DESC ,
  userId: string; // (long, optional): 用户id ,
  marketId?: string; // (string, optional): 市场Id ,
  adType?: TAdType; // (integer, optional): 1-otc 2-ct2 ,
  webId?: number; // (integer, optional): 站点id ,
  pageIndex: number; // (integer, optional): pageIndex页数 ,
  kycSort?: TAdSort; // (integer, optional): kyc认证 1-ASC 2-DESC ,
  serviceSort?: TAdSort; // (integer, optional): 服务速度 1-ASC 2-DESC ,
  tradeType?: TAdType; // (integer, optional): 1我要买币，2我要卖币 ,
  payWays?: string; // (string, optional): 支付方式 ,
  status: TAdStatus | null; // (integer, optional): 状态（0发布失败 1上架，2下架，3完成）
}

export interface IOtcUserAdListResponse {
  totalRow: number; // (integer, optional),
  pageIndex: number; // (integer, optional),
  totalPage: number; // (integer, optional),
  pageSize: number; // (integer, optional),
  results: IAdListResponseResult[]; // (object, optional)
}
/**
 * 我的广告列表
 */
export const userAdList = (params: IOtcUserAdListParams): Promise<IOtcUserAdListResponse> => {
  return __postAd({
    url: '/userAdList',
    data: params
  });
};
/**
 * 下架广告
 */
export const offSaleAd = (adId: string): Promise<{}> => {
  return __postAd(
    {
      url: '/offSaleAd',
      data: { adId }
    },
    true
  );
};
