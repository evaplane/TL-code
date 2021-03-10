import { jsonp, IJsonpParams, post } from '@/utils/http';
import conf from '@/config/index';
import { AxiosRequestConfig } from 'axios/index.d';

interface IPublicKeyResponse {
  publicKey: string;
}
interface IGetCountries {
  country: IGetCountriesItems[];
}
export interface IGetCountriesItems {
  code: string;
  des: string;
  englishName: string;
  id: string;
  myId: string;
  name: string;
  position: string;
}

export const _jsonpCommon = (config: IJsonpParams): Promise<any> => {
  config.url = conf.domainMain + '/api/web/common/V1_0_0' + config.url;
  return jsonp(config);
};

export const _jsonpSafe = (config: IJsonpParams): Promise<any> => {
  config.url = conf.domainMain + '/api/web/safe/V1_0_0' + config.url;
  return jsonp(config);
};
export const _jsonpUserAccount = (config: IJsonpParams): Promise<any> => {
  config.url = conf.domainMain + '/api/web/user/account/V1_0_0' + config.url;
  return jsonp(config);
};

export const _postUserKyc = (config: AxiosRequestConfig, isForm?: boolean): Promise<any> => {
  // TODO: 开发环境 解决上传图片跨域问题，其他环境需要后台处理
  const proxyPath = process.env.TYPE === 'dev1' ? '/kyc' : conf.domainMain;
  config.url = proxyPath + '/api/web/user/kyc/V1_0_0' + config.url;
  return post(config, isForm);
};

export const _jsonpUser = (params: IJsonpParams): Promise<any> => {
  params.url = conf.vipApiPath + '/api/web/user/V1_0_0' + params.url;
  return jsonp(params);
};

export const _jsonpInformation = (params: IJsonpParams): Promise<any> => {
  params.url = conf.newsApiPath + '/api/web/V1_0' + params.url;
  return jsonp(params);
};

// const _jsonpCommonTrade = (config: IJsonpParams): Promise<any> => {
//   config.url = conf.tradeApiPath + '/api/web/common/V1_0_0' + config.url;
//   return jsonp(config);
// };

export const getPublicKey = (): Promise<IPublicKeyResponse> => {
  return _jsonpCommon({
    url: '/getPublicKey'
  });
};
// 获取国家信息
export const getCountries = (): Promise<IGetCountries> => {
  return _jsonpCommon({
    url: '/getCountries'
  });
};

interface ILinks {
  userId: null | string;
  coinId: number;
  id: number;
  link: string;
  linkTag: null | string;
  status: number;
  linkGroup: string;
}
export interface ICoinInfo {
  teams: {
    userId: null;
    id: number;
    coinId: number;
    name: string;
    headerImg: string;
    createTime: string;
    introduction: string;
    status: number;
  }[];
  links: IObj<ILinks>;
  events: {
    userId: null | string;
    id: number;
    coinId: number;
    occurTime: string;
    occurOrder: number;
    createTime: string;
    updateTime: string;
    createUid: string;
    updateUid: string;
    event: string;
    status: number;
  }[];
  modifyUid: null | string;
  economicModel: string;
  foundation: string;
  volume24: string;
  exchangeRate: number;
  auditUid: null | string;
  id: number;
  createUid: null | string;
  introduction: string;
  periodAdd: number;
  updateTime: string;
  auditReason: null | string;
  createTime: string;
  auditTime: string;
  auditStatus: number;
  techModel: string;
  coinName: string;
  publishTotal: string;
  circlPercent: number;
  status: number;
  publishTime: string;
  circlNum: string;
  marketWorth: string;
  nameAlias: string;
  publishMaxTotal: string;
}
// 获取指定币种内容信息 0-中文 1-英文
export const getCoinInfoByName = (
  coinNameUp: string,
  lan: 0 | 1
): Promise<ICoinInfo> => {
  return jsonp({
    url: conf.vipApiPath + '/api/web/information/V1_0_0/information',
    params: {
      url: '/coin/getCoin',
      coinName: coinNameUp,
      lan
    }
  });
};

/**
 * 获取币种配置
 */
export const getCurrencyConfig = (): Promise<ICoinInfo> => {
  return _jsonpCommon({
    url: '/getCurrencyConfig'
  });
};

// // 获取指定币种多语言配置的路径
// export const getCoinsJson = async (): Promise<void> => {
//   let res = await _jsonpCommon({
//     url: '/getCoinsJson',
//     isAll: true
//   });
//   if (res.resMsg && res.resMsg.message) {
//     let res1 = await get({
//       url: res.resMsg.message
//     });
//     console.log(res1);
//   } else {
//   }
// };
