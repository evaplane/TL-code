/* eslint prefer-promise-reject-errors:off */
import { getLocal, setLocal } from '@/utils/storage';
import { get } from '@/utils/http';
import { isPwaMode, isIOS } from '@/utils/is';
import { onVisibilityChange } from '@/utils/event';
import { env } from '@/config/index';
import message from '@/components/common/message/index';

let installTaskList: Function[] = [];
export interface IVersion {
  /** 版本 */
  version: string;
  /** 是否强制更新 */
  isEnforceUpdate: boolean;
  /** 更新内容 */
  description: string[];
  /** 更新标题 */
  title: string;
}
// eslint-disable-next-line
let updateControl: IVersion = {} as IVersion;

(window as any).VERSION = process.env.VERSION;
let timer = 0, installedVersionKey = '__sw_version_installed';
const unregister = async (): Promise<boolean> => {
  return new Promise((resolve): void => {
    navigator.serviceWorker.getRegistration()
      .then((registration): void => {
        if (registration) {
          registration.unregister().then((): void => {
            console.log('卸载成功');
            resolve(true);
          });
          return;
        }
        resolve(false);
      });
  });
};
const installed = (): void => {
  if (installTaskList.length > 0) {
    installTaskList.map((fun): void => { fun(updateControl); });
  }
};
const registerWorker = (newVersion: string): Promise<string> => {
  return new Promise((resolve, reject): void => {
    navigator.serviceWorker.register('./sw.js?t=' + Date.now())
      .then((registration): void => {
        console.log('SW registered: ', registration);
        setLocal(installedVersionKey, newVersion);
        registration.onupdatefound = function (): void {
          var installingWorker = registration.installing;
          if (installingWorker !== null) {
            installingWorker.onstatechange = function (): void {
              if (installingWorker && installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  installed();
                }
              }
            };
          }
        };
        resolve('ok');
        // registration.onupdatefound
      }).catch((registrationError): void => {
        console.log('SW registration failed: ', registrationError);
        reject('fail');
      });
  });
};

const getVersion = async (): Promise<IVersion> => {
  updateControl = await get<IVersion>({ url: '../version.json?t=' + Date.now() });
  return updateControl;
};
const checkVersion = async (): Promise<void> => {
  let ver = await getVersion();
  if (getLocal(installedVersionKey) !== ver.version) {
    if (ver.isEnforceUpdate === true) {
      await unregister();
    }
    try {
      await registerWorker(ver.version);
    } catch (err) {
      message.fail('更新失败');
      await unregister();
    }
  }
  window.clearTimeout(timer);
  timer = window.setTimeout(checkVersion, 10000);
};
// 检查用户手动关闭更新弹窗, 如果有则在进入时继续提示用户升级
const checkTipsVisible = (): void => {
  window.setTimeout((): void => {
    // 版本对比
    if (process.env.VERSION !== getLocal(installedVersionKey)) {
      installed();
    }
  }, 1200);
};
if (env !== 'development') {
  if ('serviceWorker' in navigator === true) {
    if (isIOS === true && isPwaMode() === true) {
      onVisibilityChange((isHide: boolean): void => {
        if (isHide === true) return;
        checkVersion().then(checkTipsVisible);
      });
    } else {
      checkVersion().then(checkTipsVisible);
    }
  }
}
/**
 * 订阅service worker安装完毕事件
 * @param callback 回调函数
 */
export const subscribeInstalled = (callback: Function): void => {
  installTaskList.push(callback);
};
