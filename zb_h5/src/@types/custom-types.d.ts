/// <reference types="echarts" />
/// <reference types="socket.io-client" />
/// <reference types="echarts/options" />
/// <reference types="@better-scroll/core/dist/types/index" />
/// <reference types="../components/common/native-scroll/native-scroll" />
/// <reference types="vant/types" />
// eslint-disable-next-line
interface Window {
  clipboardData: any;
  CSS: any;
  Promise: any;
  Object: any;
  NoCaptcha: INoCaptcha;
}
// eslint-disable-next-line
interface Document {
  selection: any;
}

interface INoCaptcha {
  init(option: any): INoCaptcha;
  setEnabled(enabled: boolean): void;
  upLang(lang: string, opts?: any): void;
  reset(): void;
}
// eslint-disable-next-line
interface HTMLScriptElementExtend extends HTMLScriptElement {
  onreadystatechange: Function | null;
}
interface IJsonpOptions {
  param: string;
  prefix: string;
  name: string;
  timeout: number;
}
declare function Jsonp(url: string, opts: IJsonpOptions, fn: Function): Function;

declare module 'pako/dist/pako_inflate';
declare module 'atob';
declare module '@better-scroll/*';

declare module 'jsencrypt';
declare module 'fastclick';
declare module 'v-charts/*';
declare module 'echarts/lib/component/*';
declare module 'echarts/lib/chart/*';
declare module 'better-scroll';
declare module 'clipboard';
declare module 'vue-carousel';
declare module 'pinyin';
declare module 'socket.io-client';
declare module 'qrcode';
declare module 'md5';

declare module 'axios' {
  import Axios from 'axios/index';
  export default Axios;
}
declare module 'eruda';
declare module 'vant' {
  export * from 'vant/types/index.d';
}
interface IQrcodeOpts {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  version?: number;
  margin?: number;
  scale?: number;
  width?: number;
}
declare module 'qrcode/*' {
  export function toCanvas(canvasElement: HTMLCanvasElement, text: string, opts?: IQrcodeOpts, cb?: Function): string;
  export function toDataURL(text: string, opts?: IQrcodeOpts, cb?: Function): string;
}

interface IObj<T> {
  [key: string]: T;
  [key: number]: T;
}
