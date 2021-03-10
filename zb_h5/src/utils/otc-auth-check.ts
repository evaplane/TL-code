import store from '@/store/store';
import { IUser } from '@/store/modules/user';
import { login } from '@/components/popup/index.ts';
import { getOtcUserToken, getUserInfoById, IOtcUser } from '@/api/otc/user';
import message from '@/components/common/message';
import { Dialog } from 'vant';
import router from '@/router/index.ts';
import loadingComponent from '@/components/common/loading/index.vue';
import Vue from 'vue';

interface IPopupLoading {
  open(): void;
  close(): void;
}
const loading: IPopupLoading = {
  open(): void {
    let Loading = Vue.extend(loadingComponent),
      loadingInstance = new Loading({
        el: document.createElement('div')
      });

    document.body.appendChild(loadingInstance.$el);
    (document.body as any)._loadingInstance = loadingInstance;
    Vue.nextTick((): void => {
      (loadingInstance as any).visible = true;
    });
  },
  close(): void {
    let loading = (document.body as any)._loadingInstance;
    if (loading) {
      (loading as any).visible = false;
      (document.body as any).visible = null;
    }
  }
};

const getOtcUserInfo = async (): Promise<IOtcUser> => {
  const otcIsLogin: boolean = store.getters['otc/otcIsLogin'];
  let otcUserId: string = store.getters['otc/otcUserId'];
  if (!otcIsLogin) {
    try {
      let otcUserToken = await getOtcUserToken();
      otcUserId = otcUserToken.otcUserId;
      store.commit('otc/updateUser', otcUserToken);
      return getUserInfoById(otcUserId);
    } catch (err) {
      if (err.resMsg) {
        message.fail(err.resMsg.message);
      }
      return Promise.reject(err);
    }
  } else {
    return getUserInfoById(otcUserId);
  }
};

interface IOtcCheckAuthOption {
  checkLogin?: boolean;
  checkRealName?: boolean;
  checkPhone?: boolean;
  checkCancelTimes?: boolean;
  checkMerchant?: boolean;
}

/**
 * OTC 权限检查装饰器
 * 检查 ZB 用户是否登陆
 * 检查 实名认证
 * 检查 手机号绑定
 * 检查 今日取消订单次数
 *
 * 【注意】特定广告 评分、视频认证 要求 需要在函数内判断
 */
export function OtcCheckAuth(option?: IOtcCheckAuthOption): any {
  const options: IOtcCheckAuthOption = Object.assign(
    {
      checkLogin: true,
      checkRealName: true,
      checkPhone: true,
      checkCancelTimes: false,
      checkMerchant: false
    },
    option
  );
  return function(
    target: any,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]): Promise<any> {
      const isLogin: boolean = store.getters['user/isLogin'],
        userInfo: IUser = store.getters['user/userInfo'];
      if (options.checkLogin && !isLogin) {
        return login.open();
      } else if (options.checkRealName && !userInfo.realName) {
        // 未实名认证
        return Dialog.confirm({
          title: '__("提示")',
          confirmButtonText: '__("去认证")',
          message: '__("为了您资金安全，进行法币交易前请先完成实名认证")',
          messageAlign: 'left',
          className: 'authentication-dialog'
        }).then(
          (): void => {
            router.push({ name: 'user-authentication-list' });
          }
        ).catch((): void => {});
      } else if (options.checkPhone && !userInfo.mobile) {
        // 未绑定手机号
        return Dialog.confirm({
          title: '__("提示")',
          confirmButtonText: '__("去绑定")',
          message: '__("为了便于您和交易商家沟通，请您先绑定手机号")',
          messageAlign: 'left',
          className: 'authentication-dialog'
        }).then(
          (): void => {
            console.log('__("去绑定")');
          }
        ).catch((): void => {});
      }

      let needToCheck = false;
      for (const val of Object.values(options)) {
        if (typeof val === 'boolean' && val === true) {
          needToCheck = true;
          break;
        }
      }

      if (needToCheck) {
        try {
          loading.open();
          let res = await getOtcUserInfo();
          loading.close();
          store.commit('otc/updateUserInfo', res);
          if (options.checkCancelTimes && res.dayCancelTimes >= 3) {
            return Dialog.alert({
              title: '__("提示")',
              confirmButtonText: '__("我知道了")',
              message: '__("由于您今日多次取消订单，现已被限制法币交易，请明天再试")',
              messageAlign: 'left'
            });
          } else if (options.checkMerchant && res.userType === 0) {
            /** 商家认证 */
            return Dialog.confirm({
              title: '__("提示")',
              confirmButtonText: '__("申请商家")',
              message: '__("发广告功能仅面向普通商家和认证商家，如您需交易也可以直接选择广告下单")',
              messageAlign: 'left',
              className: 'authentication-dialog'
            }).then((): void => {
              router.push({ name: 'business-application' });
            }).catch((): void => {});
          } else {
            // 调用原始函数并获取其返回值
            const result = method.apply(this, args);
            // 返回调用函数的结果
            return result;
          }
        } catch (err) {
          loading.close();
          if (err.resMsg) {
            message.fail(err.resMsg.message);
          }
        }
      } else {
        // 调用原始函数并获取其返回值
        const result = method.apply(this, args);
        // 返回调用函数的结果
        return result;
      }
    };
    return propertyDescriptor;
  };
}
