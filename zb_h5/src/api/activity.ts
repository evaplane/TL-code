import { jsonp, IJsonpParams } from '@/utils/http';
import conf from '@/config/index';

const _jsonpFund = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/V1_0_0' + config.url;
  return jsonp(config);
};
const _jsonpFundBill = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/asset/bill/V1_0_0' + config.url;
  return jsonp(config);
};

export interface IFundAssetBalancesItem {
  /** 可用数量 */
  available: string;
  /** 冻结数量 */
  freeze: string;
  fundsType: string;
  /** 币种名称(大写) */
  key: string;
  /** 总资产 */
  total: string;
  /** 保留小数位数 */
  unitDecimal: string;
}
export interface IFundAsset {
  totalAsset: string;
  balances: IFundAssetBalancesItem[];
}
// 获取活动区资产
export const getFundList = (): Promise<IFundAsset> => {
  return _jsonpFund({
    url: '/getFundAsset'
  });
};

export interface IFundGetBillParams {
  /** 开始时间 */
  startDate?: string;
  /** 结束时间 */
  endDate?: string;
  /** 筛选时间: 0: 3天内, 1: 3天前 */
  dataType: string | number;
  /** 币种 */
  currency: string;
  /** 当前页码 */
  pageIndex: number;
  /** 每页数量 */
  pageSize: number;
  /** 账单类型 */
  operType?: string | number;
}
export interface IFundAssetBillItem {
  id: string;
  date: string;
  billTypeValue: string;
  showCoin: string;
  showFiat: string;
  remark: string;
}
export interface IFundGetBillResponse {
  /** 币种 */
  currency: string;
  /** 列表 */
  dataList: IFundAssetBillItem[];
  /** 筛选时间: 0: 3天内, 1: 3天前 */
  datatype: number;
  /** 账单类型 */
  operType: string;
}

export const getFundGetBill = (params: IFundGetBillParams): Promise<IFundGetBillResponse> => {
  return _jsonpFundBill({
    url: '/fundGetBill',
    params
  });
};

const _jsonpSuperFund = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/superFund/V1_0_0' + config.url;
  return jsonp(config);
};

export interface IFundTransferParams {
  /** 币种名称(小写) */
  coinName: string;
  /** 划转数量 */
  amount: string;
}

/**
 * 活动区资金转入
 * @param params IFundTransferParams
 */
export const fundTransferOuter = (params: IFundTransferParams): Promise<void> => {
  return _jsonpSuperFund({
    url: '/transferOuter',
    params
  });
};
/** 活动区资金转转出 */
export const fundTransferInFromOuter = (params: IFundTransferParams): Promise<void> => {
  return _jsonpSuperFund({
    url: '/transferInFromOuter',
    params
  });
};
