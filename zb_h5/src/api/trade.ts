import { jsonp, IJsonpParams, post, IJsonpResponse } from '@/utils/http';
import configPath, { env } from '@/config/index';

export interface IMarketInfo {
  /** 币显示名称 */
  cShowName: string;
  /** 是否允许做多 */
  canGoingLong: boolean;
  /** 是否允许做空 */
  canGoingShort: boolean;
  /** 币的有效交易小数位 */
  coinDecimal: number;
  /** 支持的合并深度参数[0.0001, 0.0005, 0.001, 0.005] */
  depth: number[];
  /** 是否显示市场 */
  display: boolean;
  /** 币 */
  exchangeBi: string;
  /** 法币显示名称 */
  fShowName: string;
  /** 强制平仓比例 */
  forceRepayRate: number;
  /** funds类型 */
  fundsType: number;
  /** 分区: 1 = 主流区，2 = 创新区 */
  group: number;
  /** 是否杠杆市场 */
  isLever: boolean;
  /**  */
  isOpenLoan: boolean;
  /** 杠杆倍数 */
  leverMultiple: number;
  /**  */
  maxBorrowCoin: number;
  /**  */
  maxBorrowMoney: number;
  /**  */
  maxEntrustCoin: number;
  /** 最高计划委托价格 */
  maxPlanCoin: number;
  /** 最高计划委托金额 */
  maxPlanMoney: number;
  /**  */
  maxPrice: number;
  /** 最高价格 */
  moneyDecimal: number;
  /** 平仓通知比例 */
  noticeRate: number;
  /** 法币 */
  numberBi: string;
  /** 开盘时间(时间戳) */
  openTime: number;
  /** 价格保护比列(买入价 / 买一价，卖一价 / 卖出价) */
  priceProtect: number;
  /** 交易对显示名称 */
  showName: string;
}
interface IGetKlineDataParams {
  /** 交易对: btcusdt */
  symbol: string;
  /** 时间类型: 1min, 5min,15min,30min,1hour,1day,1week */
  type: string;
  nextTickers: number;
  /** 筛选开始时间 */
  since: number | string;
}
interface IKline {
  /** 美元兑人民币汇率 */
  USDCNY: string;
  contractUnit: string;
  /** k线数据: [13位时间戳, 开, 高, 低, 停, 成交量] */
  data: number[][];
  /** 市场名称 */
  marketName: string;
  moneyType: string;
  symbol: string;
}
interface IGetAlsBigRecordList {
  /** 市场名 */
  marketName: string;
  /** 开始页码 */
  pageNo: number;
  /** 每页数量 */
  pageSize: number;
  /** 过滤时间 */
  lastTime?: number | string;
}

interface IDistribute {
  /** 买数量 */
  buyAmount: string;
  /** 买单成交额 */
  buyVolume: string;
  /** 大买单 */
  largeTransBuyCount: number;
  /** 大成交额 */
  largeTransBuyVolume: string;
  /** 大卖单 */
  largeTransSellCount: number;
  /** 大成交额 */
  largeTransSellVolume: string;
  /** 中买单 */
  middleTransBuyCount: number;
  /** 中成交额 */
  middleTransBuyVolume: string;
  /** 中卖单 */
  middleTransSellCount: number;
  /** 中成交额 */
  middleTransSellVolume: string;
  /** 计价币 */
  priceCoin: string;
  /** 卖数量 */
  sellAmount: string;
  /** 卖单成交额 */
  sellVolume: string;
  /** 小买单 */
  smallTransBuyCount: number;
  /** 小成交额 */
  smallTransBuyVolume: string;
  /** 小卖单 */
  smallTransSellCount: number;
  /** 小成交额 */
  smallTransSellVolume: string;
}
interface ICancelEntrustParams {
  /** 市场 ps: btc_usdt */
  market: string;
  /** 订单Id */
  entrustId: string;
  /** 是否是计划委托 */
  planType: boolean;
}
interface IGetDealDetailParams {
  /** 市场名称，btc_qc */
  market: string;
  /** 委托ID */
  entrustId: string;
}
interface IDoBatchCancelEntrustParams {
  /** 交易市场: btc_qc */
  market: string;
  /** 限定单价高于 */
  minPrice: string;
  /** 限定单价低于 */
  maxPrice: string;
  /** 交易类型: 0不限: 2: 卖单: 1: 买单 */
  type: string;
}
export interface IPriceWarnParams {
  /** 0关闭: 1开启 */
  status: number;
  /** 0只提醒一次: //24小时内一次: 1: //10分钟内一次: 2 */
  type: number;
  /** 低 */
  low: string;
  /** 高 */
  high: string;
}
export interface ITicker {
  buy: string;
  buyRmb: string;
  buydollar: string;
  dollar: string;
  high: string;
  highRmb: string;
  highdollar: string;
  last: string;
  lastRmb: string;
  low: string;
  lowRmb: string;
  lowdollar: string;
  riseRate: string;
  sell: string;
  sellRmb: string;
  selldollar: string;
  vol: string;
}
export interface ITickers {
  cName: string;
  coin: string;
  coinName: string;
  date: string;
  exeByRate: number;
  moneyType: number;
  name: string;
  symbol: string;
  ticker: ITicker;
  type: number;
}
export interface IDoIcebergEntrustParams {
  depth: string;
  market: string;
  type: 0 | 1;
  number: string;
  avgNumber: string;
  limitPrice: string;
  safePwd?: string;
}
export interface IDoTimeEntrustParams {
  market: string; // 市场名称
  priceInterval: string; // 扫单范围
  numberInterval: string; // 扫单比例
  number: string; // 挂单数量
  limitNumber: string; // 单笔最高数量
  limitPrice: string; // 单笔限价（最高买入，最低卖出）
  timeInterval: string; // 间隔委托
  type: 0 | 1;// 买卖类型  1买入  0卖出
  safePwd?: string;
}
export interface IDoLimitEntrustParams {
  /** 交易市场: btc_qc */
  market: string;
  /** 交易类型: 0: 卖单: 1: 买单 */
  type: 0 | 1;
  /** 委托数量 */
  number: string;
  /** 委托价格 */
  price: string;
  /** 资金密码 */
  safePwd?: string;
  /** 资金账户类型: 0: 默认账户: 1: 杠杆账户 */
  acctype: number;
}
export interface IDoPlanEntrustParams {
  /** 交易市场: btc_qc */
  market: string;
  /** 计划类型：0: 卖单: 1: 买单 */
  type: 0 | 1;
  /** 计划委托总金额或数量 */
  planAmount: string;
  /** 高位触发价或止盈触发价 */
  triggerHighPrice: string;
  /** 低位触发价或止损触发价 */
  triggerLowPrice: string;
  /** 高位委托价或止盈委托价 */
  planHighPrice: string;
  /** 低位委托价或止损委托价格 */
  planLowPrice: string;
  /** 资金密码 */
  safePwd?: string;
}
const _jsonpCommon = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.transApiPath}/api/web/common/V1_0_0${config.url}`;
  return jsonp(config);
};

const _jsonpAls = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.alsAPiPath}/api/web/ticker/V1_0_0${config.url}`;
  return jsonp(config);
};
const _jsonpTrade = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.transApiPath}/api/web/trade/V1_0_0${config.url}`;
  return jsonp(config);
};
const _jsonpCoinmarketcap = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.transApiPath}/api/web/coinmarketcap/V1_0_0${config.url}`;
  return jsonp(config);
};

// 获取市场信息
export const getMarketConfig = (): Promise<IObj<IMarketInfo>> => {
  return _jsonpCommon({
    url: '/getMarketConfig'
  });
};

export const getKlineData = (data: IGetKlineDataParams): Promise<IKline> => {
  let url = env === 'production' ? configPath.transApiPath : '/trans';
  return post({
    url: `${url}/markets/klineLastData`, data
  }, true);
};

export const getAlsKlineData = (params: { marketName: string; timeRange: number }): Promise<number[][]> => {
  return _jsonpAls({
    url: '/getKline',
    params
  });
};

export const getAlsNetfundsData = (marketName: string): Promise<{ array: number[][] }> => {
  return _jsonpAls({
    url: '/getNetfunds',
    params: {
      marketName
    }
  });
};

export const getAlsHistoryFundsData = (marketName: string): Promise<number[][]> => {
  return _jsonpAls({
    url: '/getHistoryFunds',
    params: {
      marketName
    }
  });
};

export const getAlsBigRecordList = (params: IGetAlsBigRecordList): Promise<number[][]> => {
  return _jsonpAls({
    url: '/getBigRecord',
    params
  });
};

export const setPriceWarn = (params: IPriceWarnParams): Promise<void> => {
  return _jsonpAls({
    url: '/setPriceWarn',
    params
  });
};

export const getSmsConfig = (): Promise<{ smsAmount: string }> => {
  return _jsonpAls({
    url: '/getSmsConfig'
  });
};

export const getPriceWarn = (marketName: string): Promise<IPriceWarnParams> => {
  return _jsonpAls({
    url: '/getPriceWarn',
    params: {
      marketName
    }
  });
};

export const getTickers = (coin: string): Promise<ITickers[]> => {
  return jsonp({
    url: configPath.tickerApiPath + '/getTickers',
    params: {
      coin
    }
  });
};

export const getAlsFundDistribute = (params: { marketName: string }): Promise<IDistribute> => {
  return _jsonpAls({
    url: '/getFundDistribute',
    params
  });
};
// 取消委托
export const doCancelEntrust = (params: ICancelEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doCancelEntrust',
    params,
    isAll: true
  });
};
// 计划委托详情
export const getDealDetail = (params: IGetDealDetailParams): Promise<IObj<IMarketInfo>> => {
  return _jsonpTrade({
    url: '/getDealDetail',
    params
  });
};
// 批量取消委托
export const doBatchCancelEntrust = (params: IDoBatchCancelEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doBatchCancelEntrust',
    params,
    isAll: true
  });
};
// 计划委托全部撤单
export const doCancelAllPlanEntrust = (market: string): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doCancelAllPlanEntrust',
    params: { market },
    isAll: true
  });
};
// 冰山委托
export const doIcebergEntrust = (params: IDoIcebergEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doIcebergEntrust',
    params
  });
};
// 时间加权委托
export const doTimeIntervalEntrust = (params: IDoTimeEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doTimeIntervalEntrust',
    params
  });
};
// 限价委托
export const doLimitEntrust = (params: IDoLimitEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doLimitEntrust',
    params
  });
};
// 计划委托
export const doPlanEntrust = (params: IDoPlanEntrustParams): Promise<IJsonpResponse<any>> => {
  return _jsonpTrade({
    url: '/doPlanEntrust',
    params
  });
};
interface IEntrustRecordResponse {
  // [委托ID,委托单价,委托数量,成交数量,成交总金额,委托买卖类型,委托时间,委托成交状态]
  hrecord: string[];
  // [委托ID,委托单价,委托数量,成交数量,成交总金额,委托买卖类型,委托时间,委托成交状态]
  record: string[];
}
interface IEntrustRecordParams {
  /** 市场名称，btc_qc */
  market: string;
  /** 委托类型: 1: 限价委托(默认): 2: 计划委托 */
  entrustType: number;
  /** 交易类型: -1: 不限(默认): 0: 卖单: 1: 买单 */
  tradeType: number;
  /** 委托状态: -1: 计划中: 0起始: 1取消: 2交易成功: 3挂单或部分成交 */
  tradeStatus: number;
  /** 时间范围: 0：最近委托(默认): 1：归档委托 */
  dateRange: number;
  /**  */
  timeFrom?: string;
  /**  */
  timeTo?: string;
  /** 页码: 从1开始 */
  pageIndex: number;
  /** 每页显示数量: 默认10: 最大200 */
  pageSize: number;
}
// 计划委托
export const getEntrustRecord = (params: IEntrustRecordParams): Promise<IEntrustRecordResponse> => {
  return _jsonpTrade({
    url: '/getEntrustRecord',
    params
  });
};

export interface ICoinDetail {
  /** 名称 */
  name: string;
  /** 简称 */
  symbol: string;
  /** logo */
  logo: string;
  /** 市值 */
  marketCap: number;
  /** 价格 */
  price: number;
  /** 交易量（24h） */
  volume24h: number;
  /** 流通供给量 */
  circulatingSupply: number;
  /** 总量 */
  totalSupply: number;
  /** 最大供给量 */
  maxSupply: number;
  /** 变化量（24h） */
  percentChange24h: number;
  /** 项目详情 */
  intro: string;
  /** 详细参数 */
  detail: string;
  /** 发行价 */
  issuePrice: number;
  /** 发行日期 */
  issueTime: number;
  /** 排名 */
  rank: number;
  /** 共识机制 */
  consensus: string;
  /** 浏览器 */
  browser: string;
  /** 加密算法 */
  arithmetic: string;
  /** 源代码 */
  sourceCode: string;
  /** 白皮书 */
  whiteBook: string;
  /** 官网 */
  officialWebsite: string;
  /** 类型 */
  coinType: string;
  /** 创建时间 */
  createTime: number;
}

/**
 * 获取币种详情
 * @param params ICoinDetail
 */
export const getCoinDetail = (params: { type: '1' | '2'; id: number }): Promise<{ newCoin: ICoinDetail }> => {
  return _jsonpCoinmarketcap({
    url: '/getCoinDetail',
    params
  });
};
