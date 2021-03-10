/* eslint @typescript-eslint/no-explicit-any: off */
export const getType = (value: any): string => {
  let result = /\s(.*)\]$/.exec(toString.call(value));
  if (result) return result[1];
  return '';
};
/** 对象是否是方法 */
export const isFunction = (value: any): boolean => getType(value) === 'Function';
/** 对象是否是数组 */
export const isArray = (value: any): boolean => getType(value) === 'Array';
/** 对象是否是数字 */
export const isNumber = (value: any): boolean => {
  return getType(value) === 'Number' || !isNaN(Number(value));
};
/** 对象是否是纯数字字符串 */
export const isNumberStr = (value: any, decimal = 10): boolean => {
  return [''].includes(value) === false && new RegExp('^(([\-|1-9]{1}\\d*)|([0]{1}))(\\.{0,1}(\\d){0,' + decimal + '})?$').test(value);
};
/** 对象是否是Boolean值 */
export const isBoolean = (value: any): boolean => getType(value) === 'Boolean';
/** 对象是否是字符串 */
export const isString = (value: any): boolean => getType(value) === 'String';
/** 对象是否是对象 */
export const isObject = (value: any): boolean => getType(value) === 'Object';
/** 对象是否是时间 */
export const isDate = (value: any): boolean => getType(value) === 'Date';
/** 对象是否是Promise */
export const isPromise = (obj: any): boolean => !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
/** 是否为空 */
export const isEmpty = (value: any): boolean => {
  if (['Object', 'Array'].indexOf(getType(value)) > -1) {
    return Object.keys(value).length === 0;
  }
  if (!value) return true;
  return false;
};
/** 是否不为空 */
export const isNotEmpty = (value: any): boolean => !isEmpty(value);
/** 是否是windows系统 */
export const isWindows = (function(): boolean {
  return /windows|win32/i.test(navigator.userAgent);
})();

const _isSupportedBrowser = (): boolean => {
  let supportCounter = 0;
  if (window.Object) {
    // 是否支持 Object.keys
    if ('keys' in window.Object === false) {
      supportCounter++;
      console.warn('Not support Object.keys');
    } else if ('assign' in window.Object === false) {
      // 是否支持 Object.assign
      supportCounter++;
      console.warn('Not support Object.assign');
    } else if ('values' in window.Object === false) {
      // 是否支持 Object.values
      supportCounter++;
      console.warn('Not support Object.values');
    }
  }
  if ('includes' in [] === false) {
    // 是否支持 includes
    supportCounter++;
    console.warn('Not support [].includes');
  } else if (!window.Promise) {
    // 是否支持 Promise
    supportCounter++;
    console.warn('Not support Promise');
  } else if (!(window.CSS && window.CSS.supports && window.CSS.supports('flex', 1))) {
    // 是否支持css var
    supportCounter++;
    console.warn('Not support css var');
  }
  return supportCounter === 0;
};
const UA = window.navigator.userAgent.toLowerCase();
/** 是否IE浏览器 */
export const isIE = /msie|trident/.test(UA);
/** 是否IE9 */
export const isIE9 = UA.indexOf('msie 9.0') > -1;
/** 是否Edge浏览器 */
export const isEdge = UA.indexOf('edge/') > -1;
/** 是否安卓系统 */
export const isAndroid = UA.indexOf('android') > -1;
/** 是否微信自带浏览器 */
export const isWeixin = UA.indexOf('micromessenger') > -1;
/** 是否是IOS系统 */
export const isIOS = /iphone|ipad|ipod|ios/.test(UA);
/** 是否是Safari浏览器 */
export const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
/** 是否是Chrome浏览器 */
export const isChrome = /chrome\/\d+/.test(UA) && !isEdge;
/** 是否是移动端 */
export const isMobile = isIOS || isAndroid;
/** 是否安装到了桌面 */
export const isPwaMode = (): boolean => {
  let [type] = ['standalone', 'minimal-ui', 'fullscreen'].filter((item): boolean => window.matchMedia(`(display-mode: ${item})`).matches);
  return !!type || !!(window.navigator as any).standalone;
};
/** 判断浏览器是否支持css js html5特性 */
export const isSupportedBrowser = _isSupportedBrowser() || isMobile;
