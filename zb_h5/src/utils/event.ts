// 检测页面是否进入后台运行模式
// eslint-disable-next-line
export const pageHidden = (): boolean => ['hidden', 'webkitHidden', 'mozHidden'].some((item: string): boolean => !!(window.document as IObj<any>)[item]);

/**
 * 向指定dom绑定事件
 * @param element 指定dom元素
 * @param event dom事件
 * @param handler 回调函数
 */
export const on = function (element: any, event: string, handler: Function): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};
/**
 * 向指定dom解除绑定事件
 * @param element 指定dom元素
 * @param event dom事件
 * @param handler 回调函数
 */
export const off = function (element: any, event: string, handler: Function): void {
  if (element && event) {
    element.removeEventListener(event, handler, false);
  }
};

/**
 * 向指定dom绑定一次性事件
 * @param element 指定dom元素
 * @param event dom事件
 * @param handler 回调函数
 */
export const once = function (element: any, event: string, handler: Function): void {
  // eslint-disable-next-line
  var listener = function (this: any, ...args: any[]) {
    if (handler) {
      (handler as Function).apply(this, args);
    }
    off(element, event, listener);
  };
  on(element, event, listener);
};

/*
let i = 0;
let offEvent = onVisibilityChange((isHidden) => {
  console.log(isHidden);
  // removeEvent
  if (i++ > 2) offEvent();
});
*/
/* istanbul ignore next */
interface IVisibleChnageCallBack {
  (isHide: boolean): void;
}
/**
 * 页面后台切换
 */
export const onVisibilityChange = (function (): Function {
  let events: IObj<string> = {
    'hidden': 'visibilitychange',
    'mozHidden': 'mozvisibilitychange',
    'webkitHidden': 'webkitvisibilitychange',
    'msHidden': 'msvisibilitychange'
  };
  let ableEventKey: string = Object.keys(events).find((eventName): boolean => eventName in document) || '';
  return function (handler: IVisibleChnageCallBack): Function {
    const callback = (): void => {
      handler(pageHidden());
    };
    on(document, events[ableEventKey], callback);
    return function(): void {
      off(document, events[ableEventKey], callback);
    };
  };
})();
/**
 * 禁止双击页面放大
 */
export const disableDblclickEnlarge = (): void => {
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function (event): void {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  document.addEventListener('touchstart', function (event): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener('gesturestart', function (event): void {
    event.preventDefault();
  });
};
