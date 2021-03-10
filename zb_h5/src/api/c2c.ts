import { jsonp, IJsonpParams } from '@/utils/http';
import conf from '@/config/index';

export const _jsonpC2c = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/c2c/V1_0_0' + config.url;
  return jsonp(config);
};
export interface IC2cInfo {
id: number;
exchangeBixDian: number;
exhangeBi: string;
maxAmount: number;
minAmount: number;
minTipsAmount: number;
name: string;
numberBi: string;
numberBixDian: number;
totalBixDian: number;
visible: boolean;
}
export interface IC2cResponse {
  buyPrice: string;
  c2cMarket: IC2cInfo;
  sellPrice: string;
}
export const getC2CMarketAndPrice = (): Promise<IC2cResponse> => {
  return _jsonpC2c({
    url: '/getC2CMarketAndPrice'
  });
};
