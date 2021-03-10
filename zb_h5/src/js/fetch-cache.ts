import { isNotEmpty } from '@/utils/is';

interface IGenericFn {
  <T>(isRefresh: boolean, arg?: any): Promise<T>;
}

export function fetchCache(pro: Function): IGenericFn {
  let hasData = false, funArr: Function[] = [], tempData: any;
  return function <T>(isRefresh: boolean, ...args: any): Promise<T> {
    return new Promise(async (resolve, reject): Promise<any> => {
      if (hasData === true && isRefresh === false) {
        resolve(tempData);
        return;
      }
      if (funArr.length === 0) {
        pro(args).then((res: T): void => {
          let promiseResolve: Function | undefined;
          if (isNotEmpty(res) === true) {
            hasData = true;
            tempData = res;
          }
          while ((promiseResolve = funArr.pop())) {
            promiseResolve && promiseResolve(res);
            promiseResolve = undefined;
          }
        }).catch((err: any): void => {
          reject(err);
        });
      }
      funArr.push(resolve);
    });
  };
}
