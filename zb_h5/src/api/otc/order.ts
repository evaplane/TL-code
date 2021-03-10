import { post, get } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';
import { IOtcAccountResponse } from './account';
import { TAdType } from './ad';

export const __postOrder = (config: AxiosRequestConfig, isFormData: boolean = false): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/OrderController' + config.url;
  return post(config, isFormData);
};
export const __getOrder = (config: AxiosRequestConfig): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/OrderController' + config.url;
  return get(config);
};

export type TOrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 订单状态（0未接单，1接单超时，2拒绝接单，3未支付，4已付款，5申诉中，6已完成，7已取消,8处理失败）
export type TOrderBuyerStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 买家状态（0未支付，1确认支付，2取消支付，4申诉中，5申诉成功：交易成功，6申诉失败：交易失败，7交易成功） ,
export type TOrderSellerStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 卖家状态（0未确认，1已确认，3申诉中，4申诉成功：交易失败，5申诉失败：交易成功，6易成功） ,
export type TOrderOwner = 0 | 1;
export type TOrderType = 1 | 2 | null;
export type TOrderSort = 1 | 2 | null;

export interface IOtcAddOrderParams {
  amount: number | string; // (number, optional): 下单数量,
  adId: string; // (long, optional): 广告id,
  money: number | string; // (number, optional): 订单总额,
  price: number | string; // (number, optional): 下单单价,
  payAccountId: string; // string 收款人账户 id
  payForInfo?: string; // (string, optional): 付款人账户信息,
  payInfo?: IOtcAccountResponse; // (com.zb.otc.entity.Account, optional): 收款人账户信息
}

export interface IOtcOrderLog {
  title: string; // 标题,
  operationTime: string; // 操作时间,
  status: 0 | 1; // 订单状态 0失败 1成功,
  type: number; // 订单操作具体类型
}

export interface IOtcOrderResponse {
  buyerStatus: TOrderBuyerStatus; // (integer, optional): 买家状态（0未支付，1确认支付，2取消支付，4申诉中，5申诉成功：交易成功，6申诉失败：交易失败，7交易成功,
  appealTime: string | null; // (date, optional): 申诉时间 ,
  emoneyUnit: string; // (string, optional): 数字货币单位 ,
  cancelUserId: number | null; // (long, optional): 取消方用户ID ,
  orderNickName: string | null; //  (string, optional): 下单用户昵称 ,
  payForInfo: IOtcAccountResponse | null; // (com.zb.otc.entity.Account, optional): 支付时选择的付款方信息 ,
  preStatus: number | null; // (integer, optional): 申诉前状态 ,
  timeout: string | null; // (date, optional): 记录超时时间 ,
  processTime: string | null; // (date, optional): 拒单/接单时间 ,
  marketId: string; // (string, optional): 市场id ,
  adType: TAdType; // (integer, optional): 广告类型（1买，2卖） ,
  orderTime: string | null; // (date, optional): 下单时间 ,
  merchantId: string; // (string, optional): 商家用户id ,
  price: string | number; // (number, optional): 单价 ,
  acceptOrderTimeOuts: number; // (integer, optional): 接单超时 ,
  confirmReceiveTime: string | null; // (date, optional): 确认收款时间 ,
  payTimeOuts: number; // (integer, optional): 付款超时 ,
  id: string; // (string, optional): 非自增 ,
  orderSourceUserId: string | null; // (string, optional): 下单用户sourceUserIdID ,
  owner: 0 | 1 | null; // (integer, optional): 是否我发布的 0 否 1 是 , // 1自己发布广告就是商家
  amount: number | string; // (number, optional): 数量 ,
  sellerStatus: TOrderSellerStatus; // (integer, optional): 卖家状态（0未确认，1已确认，3申诉中，4申诉成功：交易失败，5申诉失败：交易成功，6易成功） ,
  timeoutHasRemind: boolean | null; // (boolean, optional): 接单超时是否已提醒 ,
  afterPayAppealWaitTimeOuts: number; // (integer, optional): 买家付款后可申诉等待时长 ,
  adTradeType: TAdType; // (integer, optional): 广告交易类型1 otc 2 c2c ,
  marketName: string; // (string, optional): 市场 ,
  orderUserId: string; // (string, optional): 下单用户ID ,
  adId: string; // (string, optional): 广告id ,
  merchantNickName: string; // (string, optional): 商家昵称 ,
  money: number | string; // (number, optional): 成交金额 ,
  payNote: string | null; // (string, optional): 备注 ,
  cancelTime: string | null; // (date, optional): 取消时间 ,
  merchantSourceUserId: string | null; // (string, optional): 商家用户sourceUserId ,
  waitMerchantPayTime: number; // (integer, optional): 等待商家打款提示时间 ,
  moneyUnit: string; // (string, optional): 法币单位 ,
  payInfo: IOtcAccountResponse; // (com.zb.otc.entity.Account, optional): 支付时选择的收款方信息 ,
  confirmPayTime: string | null; // (date, optional): 确认付款时间 ,
  status: TOrderStatus; // (integer, optional): 订单状态（0未接单，1接单超时，2拒绝接单，3未支付，4已付款，5申诉中，6已完成，7已取消,8处理失败）
  orderLog: IOtcOrderLog[]; // 订单日志
  paymentAttach: null;
  receiveAttach: null;
}
/**
 * 下单
 */
export const addOrder = (data: IOtcAddOrderParams): Promise<IOtcOrderResponse> => {
  return __postOrder({
    url: '/addOrder',
    data
  });
};

export interface IOtcOrderListParams {
  amountSort?: TOrderSort;
  priceSort?: TOrderSort;
  totalMoneySort?: TOrderSort;
  orderType?: TOrderType; // (integer, optional): 订单类型(1: 买 2 卖),
  pageIndex: number; // (integer, optional),
  orderStatus?: TOrderStatus; // (integer, optional): 订单状态(0：未接单，1：接单超时 2：拒绝接单 3：未支付 4：已付款 5：申诉中 6：已完成 7：已取消 8：处理失败),
  pageSize: number; // (integer, optional),
  type?: TOrderType; // (integer, optional): 订单归属类型(1 本人发布，2 本人下单)
}

export interface IOtcOrderListResponse {
  totalRow: number; // (integer, optional),
  pageIndex: number; // (integer, optional),
  totalPage: number; // (integer, optional),
  pageSize: number; // (integer, optional),
  results: IOtcOrderResponse[]; // (object, optional)
}
/**
 * 订单列表
 */
export const getOrderList = (params: IOtcOrderListParams): Promise<IOtcOrderListResponse> => {
  return __postOrder({
    url: '/list',
    data: params
  });
};

export const reqGetOrderById = (id: string | number): Promise<IOtcOrderResponse> => {
  return __getOrder({
    url: '/getById', // 根据id查询otc订单申诉表
    params: { id }
  });
};

export const reqSetOrder = (id: string | number): Promise<IOtcOrderListResponse> => {
  return __getOrder({
    url: '/setOrder', // 接单
    params: { id }
  });
};

export const reqRejectOrder = (id: string | number): Promise<IOtcOrderListResponse> => {
  return __getOrder({
    url: '/rejectOrder', // 拒单
    params: { id }
  });
};

export const reqPayByBuyer = (accountId: string | number, orderId: string | number): Promise<IOtcOrderListResponse> => {
  return __getOrder({
    url: '/payByBuyer', // 买方确认支付
    params: {
      accountId,
      orderId
    }
  });
};

export const reqCancelByBuyer = (id: string | number): Promise<IOtcOrderListResponse> => {
  return __getOrder({
    url: '/cancelByBuyer', // 买方取消订单
    params: { id }
  });
};

export const reqConfirmPaidCoin = (id: string | number): Promise<IOtcOrderListResponse> => {
  return __getOrder({
    url: '/confirmPaidCoin', // 确认放币
    params: { id }
  });
};
