import { isObject } from './is';
/**
 * 排序对象
 * @param obj 对象
 */
export const sortObj = <T>(obj: T): T => {
  if (!isObject(obj)) {
    console.error('params type error');
    return obj;
  }

  const temp: T = {} as any;
  const keys = Object.keys(obj).sort();
  keys.forEach((key): void => {
    temp[key as keyof T] = obj[key as keyof T];
  });
  return temp;
};

export const sortString = <T>(params: string): any => {
  if (!(params.indexOf('&') > 0)) return params;

  let dataParams = params.split('&').sort();
  return dataParams.join('&');
};
