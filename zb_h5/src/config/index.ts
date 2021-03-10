import { getBaseDomain } from '@/utils/url-helper';
interface IConfig {
  readonly apiWebsocketPath: string;
  readonly klineWebsocketPath: string;
  readonly vipApiPath: string;
  readonly wwwApiPath: string;
  readonly transApiPath: string;
  readonly tradeApiPath: string;
  readonly tickerApiPath: string;
  /** w: dev, t: test, z: prod */
  readonly environmentStr: 'w' | 't' | 'z';
  readonly domainWeb: string;
  readonly domainWww: string;
  readonly domainMain: string;
  readonly domainFile: string;
  readonly alsAPiPath: string;
  readonly chatUrl: string;
  readonly chatWs: string;
  readonly chatImg: string;
  readonly baseFp: string;
  readonly chatMsgImg: string;
  readonly otcPath: string;
  readonly newsApiPath: string;
  /** 阿里人机验证app key */
  readonly captchaAppKey: string;
  readonly chatGroupImg: string;
}
const domain: string = getBaseDomain();

// 域名后都不要带 /
const config: IObj<IConfig> = {
  dev: {
    apiWebsocketPath: 'ws://api2.192-168-6-19.net',
    klineWebsocketPath: 'wss://kline.zb.plus',
    // klineWebsocketPath: 'ws://tkline2.192-168-6-19.net',
    vipApiPath: '//ttvip2.192-168-6-19.net',
    // vipApiPath: 'https://vip.zbq.com',
    wwwApiPath: '//ttwww2.192-168-6-19.net',
    transApiPath: '//tttrans2.192-168-6-19.net',
    tradeApiPath: '//tttrade2.192-168-6-19.net',
    tickerApiPath: 'https://ticker.zb.plus',
    alsAPiPath: 'https://als.zb.plus',
    newsApiPath: '//ttn2.192-168-6-19.net',
    domainWeb: '//tweb2.net',
    domainWww: '//tw2.net',
    domainMain: '//ttvip2.192-168-6-19.net',
    domainFile: '//tts2.192-168-6-19.net',
    environmentStr: 'w',
    chatUrl: '/chattest',
    chatWs: 'ws://128.1.145.143:9906',
    // chatWs: 'wss://www.yowoworld.cc',
    chatImg: 'https://css.yowoworld.cc/wowchat/UserAvatarDownloader?action=ad',
    chatGroupImg: 'https://css.yowoworld.cc/wowchat/BinaryDownloader?action=g_avatar_d',
    chatMsgImg: 'https://css.yowoworld.cc/wowchat/BinaryDownloader?action=image_d',
    baseFp: '45A71AF',
    otcPath: '/otc',
    captchaAppKey: 'FFFF0N00000000006470'
    // captchaAppKey: 'CF_APP_1'
  },
  test: {
    apiWebsocketPath: 'ws://api2.' + domain,
    klineWebsocketPath: 'ws://tkline2.' + domain,
    // klineWebsocketPath: 'wss://kline.bitkk.com',
    vipApiPath: '//ttvip2.' + domain,
    wwwApiPath: '//ttwww2.' + domain,
    transApiPath: '//tttrans2.' + domain,
    tradeApiPath: '//tttrade2.' + domain,
    tickerApiPath: 'https://ticker.zb.plus',
    // alsAPiPath: '//ttanalysis2.' + domain,
    newsApiPath: '//news.' + domain,
    alsAPiPath: 'https://ticker.zb.plus',
    domainWeb: '//ttw2.' + domain,
    domainWww: '//ttweb2.' + domain,
    domainMain: '//ttvip2.' + domain,
    domainFile: '//tts2.' + domain,
    environmentStr: 't',
    chatUrl: 'https://www.yowoworld.cc',
    chatWs: 'wss://www.yowoworld.cc',
    chatImg: 'https://api.yowoworld.cc',
    chatMsgImg: 'https://www.yowoworld.cc/wowchat/BinaryDownloader?action=image_d',
    chatGroupImg: 'https://www.yowoworld.cc/wowchat/UserAvatarDownloader?action=g_avatar_d',
    baseFp: '45A71AF',
    otcPath: '',
    captchaAppKey: 'FFFF0N00000000006470'
  },
  prod: {
    apiWebsocketPath: 'wss://api2.' + domain,
    klineWebsocketPath: 'wss://kline.' + domain,
    vipApiPath: '//vip.' + domain,
    wwwApiPath: '//www.' + domain,
    transApiPath: '//trans.' + domain,
    tradeApiPath: '//trade.' + domain,
    tickerApiPath: '//ticker.' + domain,
    newsApiPath: '//news.' + domain,
    alsAPiPath: '//als.' + domain,
    domainWeb: '//web2.' + domain,
    domainWww: '//www.' + domain,
    domainMain: '//vip.' + domain,
    domainFile: '//s.' + domain,
    environmentStr: 'z',
    chatUrl: 'https://www.yowoworld.cc',
    chatWs: 'wss://www.yowoworld.cc',
    chatImg: 'https://api.yowoworld.cc',
    chatMsgImg: 'https://www.yowoworld.cc/wowchat/BinaryDownloader?action=image_d',
    chatGroupImg: 'https://www.yowoworld.cc/wowchat/UserAvatarDownloader?action=g_avatar_d',
    baseFp: '45A71AF',
    otcPath: '//otcapi.' + domain,
    captchaAppKey: 'FFFF0N00000000006470'
  }
};
let type: string = process.env.TYPE || 'dev';
export default config[type];

type TEnv = 'development' | 'production';
/** 区分开发模式或者生产模式 */
export const env = process.env.NODE_ENV as TEnv;
