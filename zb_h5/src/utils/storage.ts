import { getBaseDomain } from './url-helper';
import { env } from '@/config/index';

/* eslint @typescript-eslint/no-explicit-any: off */
type StorageType = 'localStorage' | 'sessionStorage';
const _local: StorageType = 'localStorage',
  _session: StorageType = 'sessionStorage';
// 本地存储操作
function _setStorage(type: StorageType, key: string, val: any): void {
  let value: any = val;
  if (typeof val === 'object') {
    value = JSON.stringify(val);
  }
  if (window !== null) {
    window[type].setItem(key, value);
  }
}

// 存储获取
function _getStorage(type: StorageType, key: string): any {
  if (window !== null) {
    let str = window[type].getItem(key) || '',
      data = '';
    try {
      data = JSON.parse(str);
    } catch (error) {
      data = str;
    }
    return data;
  } else {
    return '';
  }
}

// 删除本地存储
function _remove(type: StorageType, key: string): void {
  if (window !== null) {
    window[type].removeItem(key);
  }
}
// 设置session本地存储
export const setSession = (key: string, val: any): void => {
  if (env === 'development') {
    console.warn(
      `Session更新key:${key} > 值: `,
      val
    );
  }
  return _setStorage(_session, key, val);
};
/**
 * 设置local本地存储
 * @param key key
 * @param val 值
 */
export const setLocal = (key: string, val: any): void => (_setStorage(_local, key, val));

/**
 * 获取session本地存储
 * @param key key
 */
export const getSession = <T = any>(key: string): T => _getStorage(_session, key);

/** 获取local本地存储 */
export const getLocal = <T = any>(key: string): T => _getStorage(_local, key);

/** 删除session本地存储 */
export const removeSession = (key: string): void => _remove(_session, key);

/** 删除local本地存储 */
export const removeLocal = (key: string): void => _remove(_local, key);
/**
 * 通过key获取cookie
*/
export const getCookie = (key: string): any => {
  let reg = new RegExp('(^|;\\s*)' + key + '=([^;]*)(;|$)'),
    matchedArr = document.cookie.match(reg);
  if (matchedArr && matchedArr[2]) {
    let data = '', val = decodeURIComponent(matchedArr[2]);
    try {
      data = val.indexOf('{') === 0 ? JSON.parse(val) : val;
    } catch (error) {
      console.error(new Error(error));
    }
    return data;
  }
  return '';
};

const baseDomain: string = getBaseDomain();
/**
 * 设置cookie days: 有效期默认关闭浏览器清空
 * @param key key
 * @param value value
 * @param days 时间
 */
export const setCookie = (key: string, value: any, days: number = 0): void => {
  let expires = '';
  if (days) {
    let date: Date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  document.cookie = `${key}=${(value || '') + expires}; domain=.${baseDomain}; path=/`;
};
// 删除cookie
export const delCookie = (key: string, domain: string): void => {
  let exp: Date = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(key);
  if (cval != null) {
    let cookie = key + '=' + cval + ';expires=' + exp.toUTCString() + '; path=/';
    if (domain) {
      cookie += '; domain=.' + domain;
    }
    document.cookie = cookie;
  }
};
/** 判断是否存在指定key的cookie */
export const hasCookie = (key: string): boolean => !!getCookie(key);
