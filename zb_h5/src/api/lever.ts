import { jsonp, IJsonpParams } from '@/utils/http';
import conf from '@/config/index';

export interface ILeverDataTypes {
  /** 市场名称，如：btcqc */
  key: string;
  /** 市场显示名称，如：BTC/QC */
  showName: string;
  /** 币可用 */
  cAvailable: number;
  /** 币冻结 */
  cFreeze: number;
  /** 币借入金额 */
  cLoanIn: number;
  /** 币借出金额 */
  cLoanOut: number;
  /** 币可借 */
  cCanLoanIn: number;
  /** 币欠息 */
  cOverdraft: number;
  /** 币tag */
  cUnitTag: string;
  /** 币英文名称 */
  cEnName: string;
  /** 币显示名称 */
  cShowName: string;
  /** 币保留位数 */
  cUnitDecimal: number;
  /** 法币可用 */
  fAvailable: number;
  /** 法币冻结 */
  fFreeze: number;
  /** 法币借入金额 */
  fLoanIn: number;
  /** 法币借出金额 */
  fLoanOut: number;
  /** 法币可借 */
  fCanLoanIn: number;
  /** 法币欠息 */
  fOverdraft: number;
  /** 法币tag */
  fUnitTag: string;
  /** 法币英文名称 */
  fEnName: string;
  /** 法币显示名称 */
  fShowName: string;
  /** 法币保留位数 */
  fUnitDecimal: number;
  /** 平仓风险级别 */
  repayLevel: number;
  /** 预估平仓价格 */
  unwindPrice: number;
  /** 资产/杠杆比 */
  repayLeverShow: string;
  /** 可转出法币 */
  couldTransferOutFiat: number;
  /** 可转出币 */
  couldTransferOutCoin: number;
  /** 总资产折算人民币 */
  totalConvertCNY: number;
  /** 总资产折算美元 */
  totalConvertUSD: number;
  /** 净资产折算人民币 */
  netConvertCNY: number;
  /** 净资产折算美元 */
  netConvertUSD: number;
  /** 借款折算人民币 */
  loanInConvertCNY: number;
  /** 借款折算美元 */
  loanInConvertUSD: number;
  /** 理财折算人民币 */
  loanOutConvertCNY: number;
  /** 理财折算美元 */
  loanOutConvertUSD: number;
  /** 杠杆状态(1正常 2强制平仓 3穿仓处理中 4穿仓已分币 5已穿仓) */
  status: number;
  /** 杠杆状态(1正常 2强制平仓 3穿仓处理中 4穿仓已分币 5已穿仓) */
  statusShow: string;
}
export interface ILeverTypes {
  netAsset: number | string;
  totalAsset: number | string;
  totalLoanOut: number | string;
  levers: ILeverDataTypes[];
}

export interface ILeverBorrowParamsTypes {
  coin: string;
  repaymentDay: number;
  interestRate: string;
  amount: string;
  safePwd: string;
  marketName: string;
}

export interface IBorrowStatsResponseTypes {
  coinBenxi: string;
  fiatBenxi: string;
  coinLoanIn: string;
  fiatLoanIn: string;
  coinArrearsLx: string;
  fiatArrearsLx: string;
  coinAvailable: string;
  coinCanLoanIn: string;
  coinHasLx: string;
  coinHasRepay: string;
  coinLoanInCount: number;
  fiatAvailable: string;
  fiatCanLoanIn: string;
  fiatHasLx: string;
  fiatHasRepay: string;
  fiatLoanInCount: number;
}

interface IGetTransferParamsTypes {
  isIn: 1 | 0;
  coinName: string;
  moneyName: string;
}
export interface IDoTransferParamsTypes {
  amount: string | number;
  marketName: string;
  coin: string;
}
export interface ITransferAssetsResponseTypes {
  fiatAvailable: string;
  coinAvailable: string;
}

export interface IGetLoanListPramsTypes {
  coin: string;
  pageIndex: number;
  pageSize: number;
}

export interface IGetLoanRecordParamsTypes {
  status: string;
  /** 市场: btcqc */
  marketName: string;
  pageIndex: number;
  pageSize: number;
  dataType: string;
}

export interface ILoanRecordItem {
  amount: string;
  arrearsLx: string;
  coinName: string;
  coinShowName: string;
  createTimeShow: string;
  fundsType: number;
  hasLx: string;
  hasRepay: string;
  id: number;
  ids: string;
  inUserId: number;
  investMark: false;
  minRepayAmount: string;
  rateShow: string;
  repayDateShow: string;
  status: number;
  statusColor: string;
  statusShow: string;
  extendAmount: string;
}

export interface ILoanItemTypes {
  amount: string;
  balance: string;
  coinName: string;
  interestRateOfDay: string;
  lowestAmount: string;
  rateOfDayShow: string;
  repaymentDay: number;
}
interface ILoanListResponseTypes {
  pageIndex: number;
  pageSize: number;
  loanList: ILoanItemTypes[];
}

interface IInvestMarkParamsTypes {
  loanRecordIds: string;
  investMark: boolean;
}

export interface IDoLoanParamsTypes {
  /** btcqc */
  marketName: string;
  // qc
  coin: string;
  // 日利率
  interestRateOfDay: string;
  // 借款期限
  repaymentDay: number;
  // 数量
  amount: string;
  // 资金密码
  safePwd: string;
  // 是否到期自动续借（1自动续借 0自动还款）
  isLoop: number;
}

export interface IDoRepayParamsTypes {
  // 借款记录ID，多个用“,”分隔
  loanRecordIds: string;
  // 还款金额
  repayAmount: string;
  // 还款方式 （0全部 1部分）
  repayType: string;
  // 币种类型，如：15( qc )
  fundsType: number;
  // 市场名称，如：btcqc
  marketName: string;
}
export interface IRepayListResponseTypes {
  actureDate: number;
  statusShow: string;
  status: number;
  id: number;
  liXi: string;
  benJin: string;
}
const _jsonpLever = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/lever/V1_0_0' + config.url;
  return jsonp(config);
};

// 获取杠杆资产
export const getLeverList = (): Promise<ILeverTypes> => {
  return _jsonpLever({
    url: '/getAsset'
  });
};

export const doAutoBorrow = (params: ILeverBorrowParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/autoBorrow',
    params
  });
};

export const getBorrowStats = (marketName: string): Promise<IBorrowStatsResponseTypes> => {
  return _jsonpLever({
    url: '/getBorrowStats',
    params: {
      marketName
    }
  });
};

export const doAllRepay = (marketName: string): Promise<void> => {
  return _jsonpLever({
    url: '/doAllRepay',
    params: {
      marketName
    }
  });
};

export const getTransfersJson = (params: IGetTransferParamsTypes): Promise<ITransferAssetsResponseTypes> => {
  return _jsonpLever({
    url: '/getTransfersJson',
    params
  });
};

export const doTransferInLever = (params: IDoTransferParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/doTransferInLever',
    params
  });
};

export const doTransferOutLever = (params: IDoTransferParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/doTransferOutLever',
    params
  });
};

export const getLoanList = (params: IGetLoanListPramsTypes): Promise<ILoanListResponseTypes> => {
  return _jsonpLever({
    url: '/loanList',
    params
  });
};
export interface ILoanRecordResponseTypes {
  recordList: ILoanRecordItem[];
  pageIndex: number;
  pageSize: number;
}
export const getLoanRecordList = (params: IGetLoanRecordParamsTypes): Promise<ILoanRecordResponseTypes> => {
  return _jsonpLever({
    url: '/loanRecordList',
    params
  });
};
export interface IGetRepayListParams {
  /** 借款记录ID，多个用“,”分隔 */
  loanRecordIds: string;
  /** 页数 */
  pageIndex: number;
  /** 条数 */
  pageSize: number;
}

export const getRepayList = (params: IGetRepayListParams): Promise<{ repayList: IRepayListResponseTypes[] }> => {
  return _jsonpLever({
    url: '/repayList',
    params
  });
};

export const changeInvestMark = (params: IInvestMarkParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/changeInvestMark',
    params
  });
};

export const doloan = (params: IDoLoanParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/doloan',
    params
  });
};

export const doRepay = (params: IDoRepayParamsTypes): Promise<void> => {
  return _jsonpLever({
    url: '/doRepay',
    params
  });
};

export interface IGetLeverBillParams {
  coint: string; //	否	币种类型
  billType?: number | string; //	否	账单类型 1: 划入, 2: 划出, 3: 抵押币借入法币, 4: 抵押法币借入币, 5: 赎回法币保证金, 6: 赎回币保证金, 7: 增加法币保证金, 8: 增加币保证金
  dataType?: number; //	是	0：3天内数据 1：3天前数据
  startTime?: number | string; //	否	开始时间
  endTime?: number | string; //	否	结束时间
  pageIndex: number; //	是	页码 从1开始
  pageSize: number; //	是	每页显示数量 默认10 最多200
}
interface ILeverBillItem {
  id: number; //			流水号
  billType: number; //			账单类型
  billTypeName: string; //			账单类型对应中文名
  billDate: number; //			账单生成时间（时间戳）
  coinChange: string; //			币变化数量
  coinBalance: string; //			币余额
  fiatChange: string; //			法币变化数量
  fiatBalance: string; //			法币余额
  showCoin: string; //			币变化内容
  showFiat: string; //			法币变化内容
  market: string; //			杠杆市场
  entrustId: string; //			挂单编号
}
export const getLeverBills = (params: IGetLeverBillParams): Promise<{ leverBillList: ILeverBillItem[] }> => {
  return _jsonpLever({
    url: '/getBill',
    params
  });
};

interface IGetLoanStatsParams {
  loanCoin: string;
}
export interface IGetLoanStatsRes {
  expectedLiXi?: string;
  inLoan: string;
  minWithdrawAmount?: string;
  totalLiXi: string;
  totalLoan: string;
}
/* 借款 */
export const getLoanStats = (params: IGetLoanStatsParams): Promise<IGetLoanStatsRes> => {
  return _jsonpLever({
    url: '/getLoanStats',
    params
  });
};
export interface IGetLeverCoinsResList {
  name: string;
  name_cn: string;
  showName: string;
  tag: string;
  unitTag: string;
}

/* 理财币种列表 */
export const getLeverCoins = (): Promise<{ leverCoins: IGetLeverCoinsResList[] }> => {
  return _jsonpLever({
    url: '/getLeverCoins'
  });
};

export interface IDoOutParams {
  amount: string;
  isLoop: number;
  day: string;
  rate: string;
  oriSafePwd?: string;
  loanCoin: string;
  safePwd?: string;
}
/* 确认挂单 */
export const doOut = (params: IDoOutParams): Promise<void> => {
  return _jsonpLever({
    url: '/doOut',
    params
  });
};

export interface IGetLoanListParams {
  loanCoin?: string;
  status?: string;
  /** 页码 从1开始 */
  pageIndex: number;
  /** 最多10条 */
  pageSize: number;
}
export interface IGetLoanListResList {
  amount: string;
  canChangeLoop: boolean;
  coinName: string;
  createTime: number;
  fundType: number;
  hasAmount: string;
  id: number;
  inTimes: number;
  interestRateOfDay: string;
  isLoop: boolean;
  principal: string;
  repaymentDay: number;
  sourceType: number;
  status: number;
  statusShow: string;
  totalIncome: string;
  userId: number;
  userName: string;
}
/** 理财列表 */
export const getLoanLists = (params: IGetLoanListParams): Promise<{ loanList: IGetLoanListResList[] }> => {
  return _jsonpLever({
    url: '/getLoanList',
    params
  });
};

export interface IGetLeverLoanListParams {
  /** 币种，如：qc */
  coin: string;
  /** 页码 从1开始 */
  pageIndex: number;
  /** 最多10条 */
  pageSize: number;
}

export interface ILeverLoanItem {
  /** 数量 */
  amount: string;
  /** 剩余可借 */
  balance: string;
  /** 日利率 */
  interestRateOfDay: string;
  /** 借款期限 */
  repaymentDay: number;
  /** 币种 */
  coinName: string;
  /** 最低借款数量 */
  lowestAmount: string;
  /** 日利率显示 */
  rateOfDayShow: string;
}
interface ILeverLoanResponse {
  loanList: ILeverLoanItem[];
  pageIndex: number;
  pageSize: number;
}
/** 可借贷列表（按日利率和借款期限合并后） */
export const getLeverLoanList = (params: IGetLeverLoanListParams): Promise<ILeverLoanResponse> => {
  return _jsonpLever({
    url: '/loanList',
    params
  });
};

interface ICanceloutParams {
  id: number;
}
/* 取消理财 */
export const cancelOut = (params: ICanceloutParams): Promise<void> => {
  return _jsonpLever({
    url: '/cancelOut',
    params
  });
};

interface IChangeLoopParams {
  loanId: number;
  isLoop: boolean;
}

/* 切换自动放贷 */
export const changeLoop = (params: IChangeLoopParams): Promise<void> => {
  return _jsonpLever({
    url: '/changeLoop',
    params
  });
};
export interface ILoanRecordListParams {
  loanId: number;
  pageIndex: number;
  pageSize: number;
}
export interface ILoanRecordListResList {
  amount: string;
  arrearsLx: string;
  coinName: string;
  coinShowName: string;
  createTimeShow: string;
  fundsType: number;
  hasLx: string;
  hasRepay: string;
  id: number;
  inUserId: number;
  investMark: number;
  minRepayAmount: string;
  rateShow: string;
  repayDateShow: string;
  status: number;
  statusColor: string;
  statusShow: string;
}
/** 理财记录 */
export const loanRecordList = (params: ILoanRecordListParams): Promise<{ recordList: ILoanRecordListResList[] }> => {
  return _jsonpLever({
    url: '/loanRecordList',
    params
  });
};
export interface IDoLoanParams {
  /** 市场名称，如：btcqc */
  marketName: string;
  /** 币种名称，如：qc */
  coin: string;
  /** 日利率 */
  interestRateOfDay: string;
  /** 借款期限 */
  repaymentDay: number;
  /** 数量 */
  amount: string;
  /** 资金密码 */
  safePwd: string;
  /** 是否到期自动续借（1自动续借 0自动还款） */
  isLoop: number;
}
/** 借款 */
export const doLoan = (params: IDoLoanParams): Promise<void> => {
  return _jsonpLever({
    url: '/doLoan',
    params
  });
};
