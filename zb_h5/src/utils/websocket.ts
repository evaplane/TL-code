import config from '@/config/index';
import { isEmpty } from './is';
import { pageHidden, onVisibilityChange } from './event';
// import { atob } from './atob';
import atob from 'atob';
/** websocket返回数据结构 */
export interface ISocketResponse {
  channel: string;
  datas: { data: any };
  des: string;
  isSuc: boolean;
}
interface ISocketCallBack {
  (res: ISocketResponse | any): void;
}
interface IErrorCallBack {
  (err: Error): void;
}
interface IReadyCallBack {
  (websocketObserveInstance: IWebsocketObserve): void;
}
/**
 * websocket请求参数
 */
export interface IWebsocketQueryParams {
  binary?: boolean;
  channel: string;
  event: 'addChannel' | 'removeChannel';
  isZip?: boolean;
  lastTime?: number;
  [key: string]: any;
}
/**
 * 订阅管理器对象
 */
export interface IWebsocketObserve {
  subscriberId: number | string;
  channel: string;
  event: string;
  requestParams: IWebsocketQueryParams;
  callback: ISocketCallBack | null;
  errorCallBack: IErrorCallBack;
  timeouter: number | null;
  status: TFetchStatusType;
  setTimeout: Function;
  clearTimeout: Function;
  subscribe(cb?: ISocketCallBack | null): IWebsocketObserve;
  catch(cb: IErrorCallBack): IWebsocketObserve;
  unsubscribe(isUnsubscribe?: boolean): void;
}
type TFetchStatusType = 'pending' | 'completed';

let websocketInstance: WebSocket | null = null,
  notifyList: IObj<IWebsocketObserve> = {},
  tempQuery: IWebsocketQueryParams[] = [],
  idCounter = 1,
  timer: number,
  timeout = 5 * 1000, // 10秒超时
  isGzip = true;
let arr: Function[] = [], eventType = '';
/** websocket url */
export const webSocketUrl = config.klineWebsocketPath + '/websocket';
function _closeWebsocket(): Promise<void> {
  return new Promise((resolve): void => {
    eventType = 'socketClose';
    if (websocketInstance) {
      arr.push(resolve);
      websocketInstance.onclose = (): void => {
        let re = null;
        while ((re = arr.shift())) {
          re();
          re = null;
        }
        websocketInstance = null;
      };
      websocketInstance.close();
      return;
    }
    resolve();
  });
}
async function _getNewSocket(): Promise<WebSocket | null> {
  let path = webSocketUrl;
  if (websocketInstance && path !== websocketInstance.url) {
    await _closeWebsocket();
  }
  // websocket正在连接或者已经open直接返回单例对象
  if (websocketInstance && [0, 1].indexOf(websocketInstance.readyState) > -1) {
    return websocketInstance;
  }
  if ('WebSocket' in window) {
    websocketInstance = new WebSocket(path);
  } else {
    console.error(new Error('Your browser does not support websocket.'));
  }
  return websocketInstance;
}
// eslint-disable-next-line
async function _ungzip(data: any): Promise<any> {
  try {
    let pako = await import(/* webpackChunkName: 'pako' */'pako/dist/pako_inflate');
    if (data.indexOf('channel') >= 0) {
      return data; // 数据未压缩
    }
    try {
      var strData = atob(data);
      var charData = strData.split('').map(function (x: string): number { return x.charCodeAt(0); });
      var binData = new Uint8Array(charData);
      return String.fromCharCode.apply(null, new Uint16Array(pako.inflate(binData)) as never);
    } catch (e) {
      return data;
    }
  } catch (_) {
    return data;
  }
}
// eslint-disable-next-line
function _dispatchData(result: any): void {
  let channel: string = result.channel; // 推送返回频道处理
  if (!channel) {
    channel = result[0] ? result[0].channel : '';
  }
  Object.values(notifyList).map((item): void => {
    if (item.channel === channel) {
      // 标记已经请求
      item.status = 'completed';
      // 清除超时定时
      item.clearTimeout();
      item.callback && item.callback(result);
    }
  });
}
// websocket消息订阅
class Observe implements IWebsocketObserve {
  public constructor(requestParams: IWebsocketQueryParams) {
    this.subscriberId = idCounter++ + '';
    this.channel = requestParams.channel;
    this.event = requestParams.event;
    this.requestParams = requestParams;
    notifyList[this.subscriberId] = this;
    this.setTimeout();
    return this;
  }
  public subscriberId: string | number = 0;
  public channel: string = '';
  public event: string = '';
  public requestParams: IWebsocketQueryParams;
  public callback: ISocketCallBack | null = null;
  public errorCallBack!: IErrorCallBack;
  public status: TFetchStatusType = 'pending';
  public timeouter: number | null = null;
  /**
   * 设置超时定时器
   */
  public setTimeout(): void {
    this.timeouter && window.clearTimeout(this.timeouter);
    this.timeouter = window.setTimeout((): void => {
      if (this.status === 'pending') {
        if (typeof this.errorCallBack === 'function') {
          this.errorCallBack(new Error(`timeout of ${timeout} ms exceeded`));
        } else {
          console.error(new Error(`timeout of ${timeout} ms exceeded`));
        }
      }
    }, timeout);
  }
  /**
   * 清除超时定时器
   */
  public clearTimeout(): void {
    this.timeouter && window.clearTimeout(this.timeouter);
  }
  // 订阅消息
  public subscribe(cb: ISocketCallBack | null = null): IWebsocketObserve {
    this.callback = cb;
    return this;
  }
  /**
   * 异常捕抓
   * @param cb Error
   */
  public catch(cb: IErrorCallBack): IWebsocketObserve {
    this.errorCallBack = cb;
    return this;
  }
  /**
   * 取消订阅
   */
  public unsubscribe(isUnsubscribe?: boolean): void {
    if (isUnsubscribe === true) {
      if (websocketInstance && websocketInstance.readyState === websocketInstance.OPEN) {
        this.clearTimeout();
        let has = Object.keys(notifyList).filter((id: string): boolean => {
          return notifyList[id].channel === this.channel;
        });
        // 如果只有1个或者0个订阅则发送取消订阅请求
        if (has.length <= 1) {
          websocketInstance.send(
            JSON.stringify({
              event: 'removeChannel',
              channel: this.channel,
              isZip: true,
              binary: true
            })
          );
        }
      }
    }
    // 删除订阅者
    delete notifyList[this.subscriberId];
    timer && window.clearTimeout(timer);
    timer = window.setTimeout((): void => {
      // 删除订阅参数
      if (isEmpty(notifyList) === true) {
        _closeWebsocket();
      }
    }, 3000);
  }
}
/**
 * 订阅websocket
 * @param params 订阅参数
 * @param callback 消息回调函数或者不传, 不传时通过subscribe函数注册回调函数
 * @param subscriberId 固定id, 用于多个不同组件同时订阅同一个频道
 */
export const send = async (params: IWebsocketQueryParams, ready?: IReadyCallBack | null, subscriberId?: number | string): Promise<IWebsocketObserve | null> => {
  let newParams = Object.assign({}, params);
  newParams.isZip = newParams.isZip || isGzip;
  try {
    await _getNewSocket();
    if (websocketInstance === null) return null;
    let has = Object.keys(notifyList).filter((id: string): boolean => {
      return notifyList[id].channel === params.channel;
    });
    // 判断是否有相关频道, 有则不发送订阅消息
    if (has.length === 0 || eventType === 'socketClose') {
      // 初始化完毕直接发送请求
      if (websocketInstance.readyState === 1) {
        websocketInstance.send(JSON.stringify(newParams));
      } else {
        // websocket未初始化完毕, 暂存消息队列
        tempQuery.push(newParams);
      }
    }
    let notify: IWebsocketObserve;
    if (subscriberId) {
      if (notifyList[subscriberId]) {
        notify = notifyList[subscriberId];
      } else {
        notify = new Observe(newParams);
        notify.subscriberId = subscriberId;
      }
    } else {
      notify = new Observe(newParams);
    }
    websocketInstance.onopen = (): void => {
      let query = null;
      // 执行消息队列查询
      while ((query = tempQuery.shift())) {
        websocketInstance && websocketInstance.send(JSON.stringify(query));
      }
      eventType = '';
    };
    websocketInstance.onerror = (e): void => {
      console.log(e);
    };
    window.onbeforeunload = (): void => {
      _closeWebsocket();
    };
    // [ 市场ID, 当前成交价, 最高价，最低价, 24小时成交量，24小时涨跌幅, 分时量（按小时统计）]
    websocketInstance.onmessage = ({ data }): void => {
      if (pageHidden() === true) {
        return;
      }
      if (data instanceof Blob) {
        var reader = new FileReader();
        reader.readAsText(data);
        // 当读取操作成功完成时调用.
        // eslint-disable-next-line
        reader.onload = async function (evt: any): Promise<void> {
          if (evt.target.readyState === FileReader.DONE) {
            let result = await _ungzip(evt.target.result);
            // 直接处理为json对象
            if (result.indexOf('(') !== 0) {
              // eslint-disable-next-line
              result = eval('(' + result + ')');
            } else {
              // eslint-disable-next-line
              result = eval(result);
            }
            _dispatchData(result);
          }
        };
      } else {
        try {
          let result = JSON.parse(data);
          _dispatchData(result);
        } catch (err) {
          if (typeof notify.errorCallBack === 'function') {
            notify.errorCallBack(err);
          } else {
            console.error(err);
          }
          _dispatchData([]);
        }
      }
    };
    if (typeof ready === 'function') {
      ready(notify);
    }
    return notify;
  } catch (err) {
  }
  return null;
};
// 页面处于隐藏状态时关闭连接 显示页面时重新发起请求
onVisibilityChange((isHidden: boolean): void => {
  if (isHidden === true) {
    _closeWebsocket();
  } else {
    Object.keys(notifyList).map((subscriberId: string): void => {
      let item = notifyList[subscriberId];
      send(item.requestParams, (instance): void => {
        instance.subscribe(item.callback).catch(item.errorCallBack);
      }, subscriberId);
    });
  }
});
