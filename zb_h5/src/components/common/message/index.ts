import Vue from 'vue';
import messageComp from './index.vue';
import { isObject } from '@/utils/is';
type IMessageText = string | number;
type TMessgaeType = 'success' | 'fail' | 'warn';
export interface IMessageOptions {
  /** 弹窗类型 success | fail | warn */
  type?: TMessgaeType;
  /** 是否显示遮罩 */
  mask?: boolean;
  /** 延迟 默认3秒 */
  duration?: number;
  /** 弹窗class */
  className?: string;
  /** todo */
  forbidClick?: boolean;
  /** 弹窗提示内容 */
  message?: IMessageText;
  /** 关闭时触发 */
  onClose?(): void;
  /** 打开时触发 */
  onOpened?(): void;
}

export interface IMessage {
  /**
   * 成功提示
   * @param options 可传入字符串和数字或者配置对象 { type, message... }
   */
  success(options: IMessageOptions | IMessageText): IMessage;
  /**
   * 错误提示
   * @param options 可传入字符串和数字或者配置对象 { type, message... }
   */
  fail(options: IMessageOptions | IMessageText): IMessage;
  /**
   * 警告提示
   * @param options 可传入字符串和数字或者配置对象 { type, message... }
   */
  warn(options: IMessageOptions | IMessageText): IMessage;
  /**
   * 无状态提示
   * @param options 传入配置对象 { type, message... }
   */
  show(options: IMessageOptions): IMessage;
  /**
   * 强制关闭所有弹窗
   */
  clear(): void;
}
let instances: any[] = [];
let seed = 1;
let MessageFun = Vue.extend(messageComp);
class Message {
  public close(id: string, userOnClose?: Function): void {
    for (let i = 0, len = instances.length; i < len; i++) {
      if (id === instances[i].id) {
        if (typeof userOnClose === 'function') {
          userOnClose(instances[i]);
        }
        instances.splice(i, 1);
        break;
      }
    }
  }
  public show(options: IMessageOptions): IMessage {
    options = options || {};
    let id = 'toast_' + seed++;
    let instance = new MessageFun({
      data: {
        id,
        visible: false,
        type: options.type || 'success',
        zIndex: 3000 + instances.length,
        duration: options.duration || 3000,
        className: options.className,
        mask: options.mask,
        message: options.message
      },
      el: document.createElement('div'),
      methods: {
        close(): void { }
      }
    });
    let _this = this;
    instance.close = function (): void {
      _this.close(this.id, options.onClose);
      this.visible = false;
    };
    document.body.appendChild(instance.$el);
    Vue.nextTick((): void => {
      instance.visible = true;
      options.onOpened && options.onOpened();
    });
    instances.push(instance);
    window.setTimeout((): void => {
      instance.close();
    }, options.duration || 2000);
    return instance as any;
  }
  public clear(): void {
    for (let i = instances.length - 1; i >= 0; i--) {
      instances[i].close();
    }
  }
  public success(options: IMessageOptions | IMessageText): void {
    let config: IMessageOptions = { type: 'success' };
    if (isObject(options) === false) {
      config.message = options as IMessageText;
    } else {
      config.message = (options as IMessageOptions).message;
    }
    this.show(config);
  }
  public warn(options: IMessageOptions | IMessageText): void {
    let config: IMessageOptions = { type: 'warn' };
    if (isObject(options) === false) {
      config.message = options as IMessageText;
    } else {
      Object.assign(config, options);
      config.message = (options as IMessageOptions).message;
    }
    this.show(config);
  }
  public fail(options: IMessageOptions | IMessageText): void {
    let config: IMessageOptions = { type: 'fail' };
    if (isObject(options) === false) {
      config.message = options as IMessageText;
    } else {
      config.message = (options as IMessageOptions).message;
    }
    this.show(config);
  }
}
export default (Vue.prototype.$message = (window as any).Message = new Message());
