import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';

export const __postMarket = (config: AxiosRequestConfig): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/MarketController' + config.url;
  return post(config);
};

export interface IOtcMarketResponseMarket {
  buyerAppealAfterConfirmPayHrs: number;// (integer, optional): 确认支付后买家可申诉（小时），若不设置为-1，则采用OtcSetting中的配置 ,
  isOpenFloatPrice: 1 | 0;// (integer, optional): 1-可浮动 0-不可浮动 ,
  basicCoinName: string;// (string, optional): 法币名称 ,
  basicCoinPrecision: number;// (integer, optional): 法币精度 ,
  generalMaxMoney: number;// (number, optional): 普通商家最大额 ,
  canCancelTimesEveryDay: number;// (integer, optional): 每次可取消次数 ,
  sort: number;// (integer, optional): 排序值 ,
  tradeCoin: number;// (integer, optional): 交易币种 ,
  authMinMoney: number;// (number, optional): 认证上架最小额 ,
  marketId: number;// (integer, optional): 市场id ,
  generalMinMoney: number;// (number, optional): 普通商家最小额 ,
  serialVersionUID: string;// (long, optional),
  authMaxMoney: number;// (number, optional): 认证商家最大额 ,
  tradeCoinName: string;// (string, optional): 交易币种名称 ,
  name: string;// (string, optional): 市场名称, 如QC/CNY ,
  totalMoneyPrecision: number;// (integer, optional): 成交额精度 ,
  tradeCoinPrecision: number;// (integer, optional): 交易币种精度 ,
  sellerAppealAfterOrderMins: number;// (integer, optional): 发起订单后卖家可申诉（分钟），若不设置为-1，则采用OtcSetting中的配置 ,
  sellerAppealAfterConfirmPayHrs: number;// (integer, optional): 确认支付后卖家可申诉（分钟），若不设置为-1，则采用OtcSetting中的配置 ,
  isSupportCtc: 1 | 2;// (integer, optional): 是否支持c2c 1-是 2-否 ,
  status: 1 | 0;// (integer, optional): 状态（1开启，0关闭）
}

export interface IOtcMarketResponse {
  markets: IOtcMarketResponseMarket[]; // (Array[com.zb.otc.entity.Market], optional): 支持的市场列表,
  tradeCoinName: string; // (string, optional): 交易币种名称,
  tradeCoin: number; // (integer, optional): 交易币种ID
}
/**
 * 获取所有市场信息
 */
export const getOtcMarket = (): Promise<IOtcMarketResponse[]> => {
  return __postMarket({
    url: '/getOtcMarket'
  });
};
