import { jsonp, IJsonpParams, IJsonpResponse } from '@/utils/http';
import configPath from '@/config/index';

/** codeType:
1001	注册	短信/邮箱验证码	否	手机注册：countryCode + afs + imgCode 邮箱注册：email + afs
1002	找回登陆密码	短信/邮箱验证码	否	手机找回：countryCode + mobile + afs + [cardId] 邮箱找回：email + afs + [cardId]
1003	找回安全密码	短信/邮箱验证码	是	手机找回：countryCode + mobile 邮箱找回：email
1099	异地登录验证	短信/邮箱验证码	是	-
1005	认证邮箱	邮箱验证码	是	safePwd
1006	认证邮箱	短信验证码	是	safePwd
1007	认证手机	短信验证码	是	countryCode + mobile
1008	认证手机	邮箱验证码	是	-
1009	修改手机	邮箱验证码	是	-
1010	修改手机	原短信验证码	是	-
1011	修改手机	新短信验证码	是	countryCode + mobile
1099	绑定/修改/关闭 google验证	短信/邮箱验证码	是	-
1099	修改登录密码	短信/邮箱验证码	是	-
1099	修改资金安全密码	短信/邮箱验证码	是	-
1099	API开通/关闭/绑定IP	短信/邮箱验证码	是	-
1099	API生成密钥	短信/邮箱验证码	是	-
1099	修改登录策略	短信/邮箱验证码	是	-
1099	修改提现策略	短信/邮箱验证码	是	-
1018	认证提现地址	短信/邮箱验证码	是	safePwd + coin+coinKey
1019	人民币提现	短信/邮箱验证码	是	safePwd
1020	虚拟币提现	短信/邮箱验证码	是	safePwd + coin +coinKey
1021	添加提现地址	短信/邮箱验证码	是	safePwd + coin+coinKey
 */
export type TMsgType =
  | 1001
  | 1002
  | 1003
  | 1099
  | 1005
  | 1006
  | 1007
  | 1008
  | 1009
  | 1010
  | 1011
  | 1099
  | 1099
  | 1099
  | 1099
  | 1099
  | 1099
  | 1099
  | 1018
  | 1019
  | 1020
  | 1021;
export interface ISendCodeParams {
  codeType: TMsgType;
  countryCode: string;
  imgCode?: string;
  safePwd?: string;
  mobile: string;
  email: string;
  cardId: string;
  afsSessionId: string;
  afsSig: string;
  afsToken: string;
  afsScene: string;
  afsAppKey: string;
}
const _jsonpCommon = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.vipApiPath}/api/web/common/V1_0_0${config.url}`;
  return jsonp(config);
};
// 获取下载地址
export const getDownLoadInfo = (): Promise<void> => {
  return _jsonpCommon({
    url: '/getDownLoadInfo'
  });
};

// 发送验证码
export const doSendCode = (params: ISendCodeParams): Promise<IJsonpResponse<any>> => {
  return _jsonpCommon({
    url: '/doSendCode',
    params,
    isAll: true
  });
};
