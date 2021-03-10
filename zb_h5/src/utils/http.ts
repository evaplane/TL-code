/* eslint prefer-promise-reject-errors: off */
import Jsonp from './jsonp.js';
import axios from 'axios';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios/index.d';
import { toUrl } from './url-helper';
// import config from '@/config/index';
import store from '@/store/store';
import message from '@/components/common/message/index';

// import Vue from 'vue';

let scriptCache: string[],
  timeout = 200000;
axios.defaults.timeout = timeout;

interface IJsonpConfig {
  prefix: string;
  param?: string;
  timeout?: number;
}
export interface IJsonpParams {
  url: string;
  params?: any;
  config?: IJsonpConfig;
  isAll?: boolean;
}
export interface IJsonpResponse<T> {
  datas: T;
  des: string;
  isSuc: boolean;
  resMsg: {
    code: number;
    message: string;
    method: string;
  };
}
export interface IChatResponse {
  code: string;
  returnValue: string;
  message: string;
}

// eslint-disable-next-line
export const jsonp = (obj: IJsonpParams): Promise<any> => {
  return new Promise((resolve, reject): void => {
    let url: string = obj.url;
    if (obj.url && ['http', '//'].every((c): boolean => obj.url.indexOf(c) !== 0)) {
      url = obj.url;
    }
    url += (~obj.url.indexOf('?') ? '&' : '?') + toUrl(obj.params || {});
    if (!obj.config) {
      obj.config = {
        prefix: 'jsonp'
      };
    }
    obj.config.timeout = timeout;
    Jsonp(url, obj.config, (err: Error | null, res: IJsonpResponse<any>): void => {
      if (err !== null) {
        if (err.message === 'Timeout') {
          // message.warn(`__('请求超时,请检查网络或刷新页面')`);
          return;
        }
      }
      if (obj.isAll === true) {
        resolve(res);
        return;
      }
      if (res) {
        if (res.isSuc === true || res.resMsg.code === 1000) {
          // eslint-disable-next-line
          resolve(res.datas);
          return;
        }
        if (res.resMsg && res.resMsg.code > -1) {
          // disable-message-fail-list;
          let disableFailCode = [1002];
          !disableFailCode.includes(res.resMsg.code) && message.fail(res.resMsg.message);
          // 登出清除
          if (res.resMsg.code === 1003 && res.datas.isLogin === false) {
            store.dispatch('user/doUserSignOut');
            store.dispatch('otc/logout');
          }
        }
      }
      reject(res);
    });
  });
};

export const ajax = <T>(config: AxiosRequestConfig, isChat?: string | boolean): Promise<T> => {
  if (isChat) {
    if (!config.headers) {
      config.headers = {};
    }
    if (isChat === 'login') {
      let userid = store && store.getters['user/userInfo'].userId;
      config.headers.token = userid;
    }
    if (isChat === 'token') {
      let token = store && store.getters['user/chatUserInfo'].authed_info.token;
      config.headers.token = token;
    }
  }
  return new Promise((resolve, reject): void => {
    axios(config).then((res: AxiosResponse<IJsonpResponse<any>> | AxiosResponse<IChatResponse>): void => {
      if ((res as AxiosResponse<IJsonpResponse<any>>).data.isSuc === true) {
        resolve((res as AxiosResponse<IJsonpResponse<any>>).data.datas);
        return;
      }
      if ((res as AxiosResponse<IChatResponse>).data.code === '000000') {
        resolve(JSON.parse((res as AxiosResponse<IChatResponse>).data.returnValue));
      }
      resolve(res.data as any);
    }).catch((err: AxiosError): void => {
      if (err.toString().indexOf('timeout') > -1) {
        message.warn(`__('请求超时,请检查网络或刷新页面')`);
      }
      reject(err);
    });
  });
};

/**
 * get请求方式 { url: '', params: {} } 详情可参阅axios文档
 * @param params url参数
 */
export const get = <T>(params: AxiosRequestConfig): Promise<T> => {
  return ajax<T>(Object.assign({ method: 'get' }, params));
};
/**
 * post请求方式 { url: '', data: {} } 详情可参阅axios文档
 * @param params body数据
 * @param isFormData 是否是formData
 * @param isChat
 */
export const post = <T>(params: AxiosRequestConfig, isFormData?: boolean, isChat?: string | boolean): Promise<T> => {
  if (isFormData === true && params.data) {
    params.data = toUrl(params.data);
  }
  return ajax<T>(Object.assign({ method: 'post' }, params), isChat);
};
/* 加载js文件
  opts.url: js路径
  opts.params 路径携带参数
  opts.loadRemove 自动移除创建的script
*/
interface IScriptOptions {
  url: string;
  params?: IObj<any>;
  attr?: IObj<any>;
  loadRemove?: boolean;
  isCache?: boolean;
}
/**
 * 异步加载js
 * @param opts { url: 链接, loadRemove: 是否加载完成之后移除(default: true), attr: script属性, params: 链接参数 }
 */
export const script = (opts: IScriptOptions = { url: '' }): Promise<any> => {
  let options: IScriptOptions = {
    url: '',
    params: {},
    attr: {},
    loadRemove: true
  };
  options = Object.assign(options, opts);
  // 请求参数
  let queryStr = '',
    script = document.createElement('script') as HTMLScriptElementExtend;
  script.async = true;
  Object.assign(script, options.attr);
  let queryObj = options.params as IObj<number | string | boolean>;
  for (let query in queryObj) {
    queryStr += `${query}=${queryObj[query]}&`;
  }
  let url: string = options.url as string;
  if (queryStr) {
    queryStr = queryStr.slice(0, -1);
    if (url.lastIndexOf('&') === url.length - 1) {
      url += queryStr;
    } else {
      url += '&' + queryStr;
    }
  }
  // pricescale: Math.pow(10, _this.curMarket.priceDecimal || 1),
  script.src = url;
  if (options.isCache === true) {
    if (scriptCache.indexOf(script.src) > -1) {
      return Promise.resolve();
    }
    scriptCache.push(script.src);
  }
  return new Promise((resolve, reject): void => {
    let headEl = document.getElementsByTagName('head')[0];
    // eslint-disable-next-line
    script.onload = script.onreadystatechange = function (this: any, event: any): void {
      if ([undefined, 'loaded', 'complete'].indexOf(this.readyState) > -1) {
        if (options.loadRemove) {
          script.onload = null;
          headEl.removeChild(script);
        }
        script.onreadystatechange = null;
        resolve();
        return;
      }
      reject(new Error(event));
    };
    script.onerror = reject;
    headEl.appendChild(script);
  });
};

/** 判断是否是https */
export const isHttps = location.protocol.toLowerCase().indexOf('https') > -1;
