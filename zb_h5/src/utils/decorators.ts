import store from '@/store/store';
import { createDecorator } from 'vue-class-component';
import toast from '@/components/common/message/index';
import { env } from '@/config/index';
// 一个什么都不做的装饰器，在 production 环境下启用。不使用 createDecorator
const NoopDecorator = (ctor: any): any => ctor;
const AbstractDecorator = createDecorator((options, key): void => {
  const originCreated = options.created;
  options.created = function (...args: any): void {
    if (originCreated) originCreated.apply(this, args);
    if ((this as any)[key] === null) {
      console.error(`未实现 AbstractProperty '${key}'`);
    }
  };
});
export const AbstractProperty = env !== 'development' ? NoopDecorator : AbstractDecorator;

interface IDescription {
  configurable: boolean;
  enumerable: boolean;
  value: Function;
  writable: boolean;
}
/**
 * @param targetSelector 1.传入选择器(仅支持class及id). 2.true: 全屏 loading, false 当前组件loading.
 * @param theme 'light' | 'dark'
 */
// export const Loading = (): Function => {
//   return (_: any, __: string, des: IDescription): void => {
//     let oldFun = des.value;
//     des.value = function (this: any, ...args: any[]): void {
//       Vue.nextTick(async (): Promise<void> => {
//         Toast.loading({
//           mask: true
//         });
//         await oldFun.apply(this, args);
//         Vue.nextTick((): void => {
//           Toast.clear();
//         });
//       });
//     };
//   };
// };
/** 异常捕抓装饰器 */
export const Catch = (): Function => {
  return (_: any, __: string, des: IDescription): void => {
    let oldFun = des.value;
    des.value = async function (this: any, ...args: any[]): Promise<void> {
      try {
        await oldFun.apply(this, args);
      } catch (err) {
        console.log(err);
      }
    };
  };
};
/** 登录检测装饰器 */
export const NeedLogin = (): Function => {
  return (_: any, __: string, des: IDescription): void => {
    let oldFun = des.value;
    des.value = async function (this: any, ...args: any[]): Promise<void> {
      if (!store.getters['user/isLogin']) return toast.warn({ message: '__("请先登录")' });
      await oldFun.apply(this, args);
    };
  };
};
