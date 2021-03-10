import { jsonp, IJsonpParams } from '@/utils/http';
import config from '@/config/index';
interface IGetExchangeRate {
  group?: 'all' | 'user' | 'qc' | 'usdt' | 'btc';
  market?: string;
}
export interface IRate {
  btccny: string;
  usdtcny: string;
  qccny: string;
  tickers: string[][];
}
const _jsonpMarket = (params: IJsonpParams): Promise<any> => {
  params.url = config.transApiPath + '/api/web/market/V1_0_0' + params.url;
  return jsonp(params);
};

export const getExchangeRate = (params: IGetExchangeRate): Promise<IRate> => {
  return _jsonpMarket({
    url: '/getGroupTicker',
    params
  });
};
