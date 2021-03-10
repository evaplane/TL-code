import Vue from 'vue';
import entranceComponent from './entrance.vue';
type IEntranceType = 'login' | 'register';

interface IEntranceActions {
  /** 打开弹窗 */
  open(type: IEntranceType, closeCallback?: Function): void;
  /** 关闭弹窗 */
  hide(): void;
}
interface IPopupActions {
  /** 打开弹窗 */
  open(closeCallback?: Function): void;
  /** 关闭弹窗 */
  hide(): void;
}

/** 登录弹窗操作 */
export const entranceInit: IEntranceActions = {
  open(type: IEntranceType, closeCallback?: Function): void {
    let Entrance = Vue.extend(entranceComponent),
      entranceInstance = new Entrance({
        el: document.createElement('div')
      });
    (entranceInstance as any).isLogin = type === 'login';
    document.body.appendChild(entranceInstance.$el);
    (document.body as any)._entranceInstance = entranceInstance;
    Vue.nextTick(
      (): void => {
        if (closeCallback) {
          (entranceInstance as any).closeCallback = closeCallback;
        }
        (entranceInstance as any).visible = true;
      }
    );
  },
  hide(): void {
    let entrance = (document.body as any)._entranceInstance;
    (entrance as any).visible = false;
    (document.body as any)._entranceInstance = null;
  }
};

export const login: IPopupActions = {
  open(closeCallback?: Function): void {
    entranceInit.open('login', closeCallback);
  },
  hide(): void {
    entranceInit.hide();
  }
};
export const register: IPopupActions = {
  open(): void {
    entranceInit.open('register');
  },
  hide(): void {
    entranceInit.hide();
  }
};

Vue.directive('login', {
  bind(el: HTMLElement): void {
    el.onclick = (): void => {
      entranceInit.open('login');
    };
  },
  unbind(el: HTMLElement): void {
    el.onclick = null;
  }
});

Vue.directive('register', {
  bind(el: HTMLElement): void {
    el.onclick = (): void => {
      entranceInit.open('register');
    };
  },
  unbind(el: HTMLElement): void {
    el.onclick = null;
  }
});
