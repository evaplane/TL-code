/* eslint @typescript-eslint/no-explicit-any: off */
import { jsonp, IJsonpParams } from '@/utils/http';
import conf from '@/config/index';

export interface IMortgageItem {
  fundsType: number; // 币种类型
  coinName: string; // 币种名称
  available: string; // 可用资产
  deposit: string; // 抵押保证金
  loanIn: string; // 借入资产
  arreaseLx: string; // 欠息
  totalLoanOut: string; // 借出资产
  totalDeposit: string; // 合计抵押资产
}
export interface IMortgageList {
  assets: IMortgageItem[];
  totalInRmb: string;
  totalInUsd: string;
}
const _jsonpAsset = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/mortgage/V1_0_0' + config.url;
  return jsonp(config);
};
export const getMortgageAssetsList = (): Promise<IMortgageList> => {
  return _jsonpAsset({
    url: '/getAssets'
  });
};
export interface IGetMortgageBillsParams {
  fundsType?: number | string; //	否	币种类型
  billType?: number | string; //	否	账单类型 1: 划入, 2: 划出, 3: 抵押币借入法币, 4: 抵押法币借入币, 5: 赎回法币保证金, 6: 赎回币保证金, 7: 增加法币保证金, 8: 增加币保证金
  dataType: number; //	是	0：3天内数据 1：3天前数据
  startTime?: number | string; //	否	开始时间
  endTime?: number | string; //	否	结束时间
  pageIndex: number; //	是	页码 从1开始
  pageSize: number; //	是	每页显示数量 默认10 最多200
}
interface IMortgageBillItem {
  id: number; //			流水号
  billType: number; //	int			账单类型
  billTypeName: string; //			账单类型对应中文名
  billDate: number; //				账单生成时间
  coinChange: string; //			币变化数量
  coinBalance: string; //			币余额
  fiatChange: string; //			法币变化数量
  fiatBalance: string; //			法币余额
  showCoin: string; //			币变化内容
  showFiat: string; //			法币变化内容
}
interface IMortgageBillType {
  key: number; //	是		查询类型值
  value: string; //	是		查询类型
}
export interface IMortgageBillResponse {
  billList: IMortgageBillItem[]; // 抵押借款账单列表
  coins: IMortgageBillType[];
  billTypes: IMortgageBillType[];
}
export const getMortgageBills = (params: IGetMortgageBillsParams): Promise<IMortgageBillResponse> => {
  return _jsonpAsset({
    url: '/getBills',
    params
  });
};

export interface IMortgageTransferParams {
  fundsType: number; // 币种类型
  amount: string; // 数量
}

/** 抵押账户划入资金 */
export const doMortgageTransferIn = (params: IMortgageTransferParams): Promise<void> => {
  return _jsonpAsset({
    url: '/doTransferIn',
    params
  });
};

/** 抵押账户划出资金 */
export const doMortgageTransferOut = (params: IMortgageTransferParams): Promise<void> => {
  return _jsonpAsset({
    url: '/doTransferOut',
    params
  });
};

export type TFundsType = 0 | 1; // 是否是数字货币 0:否；1:是
export interface IMortgageCoin {
  fundsType: number; // 币种类型
  name: string; // 币种名称
}

interface IMortgageCoinResponse {
  coins: IMortgageCoin[];
}

/** 获取抵押借款币种 */
export const getMortgageCoins = (isDigtalCoin: TFundsType): Promise<IMortgageCoinResponse> => {
  return _jsonpAsset({
    url: '/getMortgageCoins',
    params: {
      isDigtalCoin
    }
  });
};

export interface IBorrowCycles {
  id: number; // 借款周期编号
  name: string; // 借款周期名称
}

interface IBorrowCyclesResponse {
  borrowCycles: IBorrowCycles[];
}

/** 获取借款周期 */
export const getBorrowCycles = (): Promise<IBorrowCyclesResponse> => {
  return _jsonpAsset({
    url: '/getBorrowCycles'
  });
};

export interface IBorrowRate {
  id: number; // 借款利率编号
  type: number; // 利率类型 1: 日利率 2：固定区间利率
  interestRate: string; // 年化利率
  interestRateShow: string; // 年利率
}

interface IBorrowRatesResponse {
  borrowRate: IBorrowRate;
}

// 获取借款利率
export const getBorrowRates = (cycleId: number): Promise<IBorrowRatesResponse> => {
  return _jsonpAsset({
    url: '/getBorrowRates',
    params: {
      cycleId
    }
  });
};

export interface ILoanFundMortgageCoin {
  borrowRatio: string; // 借款比例
  delete: boolean;
  digtalCoin: boolean; // 是否为数字货币
  explosionRatio: string; // 爆仓比例
  isGeneral: 0 | 1;
  coinName: string;
  coinShowName: string;
  fundsType: number;
  id: number;
  userAccount: string; // 用户可用资产
  marketPrice?: string; // 市场价 (getToLoanFund 接口没有返回该字段，通过调用行情接口获取价格后赋值)
}

/** 借款利率类型 1-日利率 2-固定区间利率 */
type TBorrowRateType = 1 | 2;
export interface ILoanFundBorrowRate {
  cycleId: number; // 借款周期 id
  cycleName: string; // 借款周期名称
  id: number; // 借款利率 id
  interestRate: string; // 借款利率
  type: TBorrowRateType; // 类型,
  interestRateShow: string; // 年利率
  interestOneDayRateShow: string; // 日利率
}

export interface ILoanFundResponse {
  mortgageCoinList: ILoanFundMortgageCoin[]; // 抵押借款币种列表
  borrowRateList: ILoanFundBorrowRate[]; // 借款利率列表
}

/** 抵押借款页面展示数据 */
export const getToLoanFund = (): Promise<ILoanFundResponse> => {
  return _jsonpAsset({
    url: '/toLoanFund'
  });
};

export interface IMaxBorrowResponse {
  maxBorrow: string; // 最大可借入量
  price: string;
}

// 抵押贷款类型 1-借币 2-借钱
export type TMortgageBorrowType = 1 | 2;
export interface IMaxBorrowParams {
  type: TMortgageBorrowType;
  mortgageCoin: number; // 抵押币种类型
  mortgageAmount: string; // 抵押数量
  borrowCoin: number; // 借入币种类型
}

/** 获取最大可借入量 */
export const getMaxBorrow = (params: IMaxBorrowParams): Promise<IMaxBorrowResponse> => {
  return _jsonpAsset({
    url: '/getMaxBorrow',
    params
  });
};

export interface IDoMortgageBorrowParams {
  type: TMortgageBorrowType; // 类型
  borrowCycleId: number; // 借款周期编号
  borrowRateId: number; // 借款利率编号
  mortgageCoin: number; // 抵押币种类型
  mortgageAmount: string; // 抵押数量
  borrowCoin: number; // 借入币种类型
  borrowAmount: string; // 借入数量
}
/** 抵押贷款 */
export const doMortgageBorrow = (params: IDoMortgageBorrowParams): Promise<void> => {
  return _jsonpAsset({
    url: '/doMortgageBorrow',
    params
  });
};
