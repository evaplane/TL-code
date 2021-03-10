import axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index.d';
import { toUrl } from './url-helper';
import store from '@/store/store';
import message from '@/components/common/message/index.ts';
import md5 from 'md5';
import { sortObj, sortString } from '@/utils/sort';
import { dealFormData } from '@/utils/deal-form-data';

const isMatch = function (url: string, apiNames: string[]): boolean {
  return apiNames.some((api): boolean => {
    return url.indexOf(api) > -1;
  });
};

type TStrOrNum = string | number;
export interface IJsonResponse<T> {
  datas: T;
  resMsg: {
    code: TStrOrNum;
    message: string;
    method: string;
  };
}

/**
 * OTC 请求设置请求头
 */
const setSign = (params: AxiosRequestConfig): void => {
  if (store.getters['otc/otcIsLogin']) {
    const userId = store.getters['otc/otcUserId'];
    const token = store.getters['otc/otcUserToken'];
    const timestamp = Date.now();
    const paramsStr = params.params ? toUrl(sortObj(params.params)).replace(/=|&/gi, '') : '';
    let dataStr = '';

    if (params.data) {
      if (params.data instanceof FormData) {
        dataStr = toUrl(sortObj(dealFormData(params.data))).replace(/=|&/gi, '');
      } else {
        dataStr = typeof params.data === 'object' ? JSON.stringify(params.data) : sortString(params.data).replace(/=|&/gi, '');
      }
    }

    const signStr = `${userId}${timestamp}${paramsStr}${dataStr}${token}`;

    if (!params.headers) params.headers = {};
    params.headers['sign'] = md5(signStr);
    params.headers['timestamp'] = timestamp;
  }
};

export const ajax = <T>(config: AxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject): void => {
    if (!config.headers) {
      config.headers = {};
    }
    const isGetToken: boolean = isMatch(config.url + '', ['getOtcUserToken']);
    if (!isGetToken) {
      config.headers['Clienttype'] = config.headers['clienttype'] || '6';
      if (store.getters['otc/otcIsLogin']) {
        config.headers['Userid'] = store.getters['otc/user'].otcUserId;
      }
    }

    axios(config).then((res: AxiosResponse<IJsonResponse<T>>): void => {
      if (isGetToken && res.data.resMsg.code === 1000) {
        resolve(res.data.datas);
        return;
      }

      if (res.data.resMsg.code === '1') {
        resolve(res.data.datas);
        return;
      }
      // http://128.1.145.132:12020 '1001'
      // vip 1001 请求失败 1003 授权失败，需要重新登录;
      const reGetTokenCodeList: TStrOrNum[] = ['1001', 1001];

      /**
       * 999 签名失效
       * 开发环境不加入 999 是为了避免一个账号多个地方登陆时陷入获取 token 的循环中
       */
      if (process.env.NODE_ENV === 'production') {
        reGetTokenCodeList.push('999');
      }

      if (reGetTokenCodeList.indexOf(res.data.resMsg.code) > -1) {
        store.dispatch('otc/clearUserToken');
        const noNeedGetToken: boolean = isMatch(config.url + '', ['getOtcUserToken']);
        if (!noNeedGetToken) {
          store.dispatch('otc/getOtcUserToken');
        }
        return;
      } else if (res.data.resMsg.code === 1003) {
        message.fail(res.data.resMsg.message);
        store.dispatch('otc/clearUserToken');
        return;
      }
      message.fail(res.data.resMsg.message);
      reject(res.data);
    }).catch((err: AxiosError): void => {
      reject(err);
    });
  });
};

/**
 * OTC Get 请求
 * @param params { url: '', params: {}, headers: { key: 'value' } }
 */
export const get = <T>(params: AxiosRequestConfig): Promise<T> => {
  setSign(params);
  return ajax<T>(Object.assign({ method: 'get' }, params));
};

/**
 * OTC POST 请求
 * @param params { url: '', data: {}, headers: { key: 'value' } }
 * @param isFormData 是否以表单的方式提交
 */
export const post = <T>(params: AxiosRequestConfig, isFormData?: boolean): Promise<T> => {
  if (isFormData === true && params.data) {
    params.data = toUrl(params.data);
  }
  setSign(params);
  return ajax<T>(Object.assign({ method: 'post' }, params));
};
