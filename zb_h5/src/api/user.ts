import { jsonp, IJsonpParams, IJsonpResponse, post } from '@/utils/http';
import configPath from '@/config/index';
import { _jsonpSafe, _jsonpUserAccount, _postUserKyc } from './common';

export interface IUserMarketList {
  createTime: number;
  id: number;
  lever: boolean;
  marketName: string;
  status: number;
  third: boolean;
  userId: number;
}

export interface IDoSetUserPwd {
  type: 1 | 2;
  oldPassword: string;
  newPassword: string;
  dynamicCode: string;
  googleCode?: string;
}

export interface IGetSafeLog {
  type: 1 | 2;
  pageIndex: string;
  pageSize: string;
}
export interface ILog {
  checked: number;
  city: string;
  date: number;
  describe: string;
  id: number;
  ip: string;
  myId: number;
  terminal: number;
  terminalName: string;
  userId: string;
}
interface ILogResult {
  pageIndex: number;
  totalCount: number;
  safeLogs: ILog[];
}

export interface IDoSetSafeStrategyParams {
  type: 1 | 2 | 3;
  key: string;
  dynamicCode?: string;
  googleCode?: string;
  safePwd?: string;
}
export interface IDoSetGoogleAuthParams {
  type: 0 | 1 | 2 | 3;
  googleSecret?: string;
  googleCode: string;
  dynamicCode: string;
  oldgCode?: string;
  realImg?: string;
}
export interface IDoSetSafePwd {
  safePwd: string;
}

export interface IGetGoogleSecretRes {
  secret: string;
}

export interface IDoLoginParams {
  userName: string;
  passWord: string;
  platform?: string;
  wsclientid?: string;
  countryCode: string;
  zbgUid?: string;
  loginType?: string;
  afsSessionId?: string;
  afsSig?: string;
  afsToken?: string;
  afsScene?: string;
  afsAppKey?: string;
  pubTag: string;
}

interface IDoLoginRes {
  needJump: boolean;
  loginStatus: 1 | 2 | 3 | 4 | 5;
  status: number;
  jumpUrl?: string;
}

export const actUserSignOut = (): Promise<any> => {
  return jsonp({
    url: configPath.vipApiPath + '/user/logout'
  });
};

interface IEditUserMarket {
  marketName: string;
  status: number;
}

export interface IDoLoginAuthParams {
  dynamicCode?: string;
  googleCode?: string;
}

const _jsonpUser = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.vipApiPath}/api/web/user/V1_0_0${config.url}`;
  return jsonp(config);
};

const _jsonpAccountUser = (config: IJsonpParams): Promise<any> => {
  config.url = `${configPath.vipApiPath}/api/web/user/account/V1_0_0${config.url}`;
  return jsonp(config);
};

// 获取用户收藏市场
export const getMarketList = (): Promise<{ list: IUserMarketList[] }> => {
  return _jsonpUser({
    url: '/getMarketList'
  });
};
// 修改用户收藏市场
export const doEditUserMarket = (params: IEditUserMarket): Promise<void> => {
  return _jsonpUser({
    url: '/doEditUserMarket',
    params
  });
};
// 修改用户登录/安全密码
export const doSetUserPwd = (params: IDoSetUserPwd): Promise<void> => {
  return _jsonpSafe({
    url: '/doSetUserPwd',
    params
  });
};
// 设置资金密码
export const doSetSafePwd = (params: IDoSetSafePwd): Promise<void> => {
  return _jsonpUser({
    url: '/doSetSafePwd',
    params
  });
};
// 获取安全日志
export const getSafeLog = (params: IGetSafeLog): Promise<ILogResult> => {
  return _jsonpSafe({
    url: '/getSafeLog',
    params
  });
};
// 获取用户信息
export const getUserInfo = (): Promise<any> => {
  return _jsonpUserAccount({
    url: '/getUserInfo',
    isAll: true
  });
};
// 设置安全策略
export const doSetSafeStrategy = (params: IDoSetSafeStrategyParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doSetSafeStrategy',
    params
  });
};
export interface IVerifyInfo {
  /** 时间 */
  addTimeShow: string;
  /** 审核备注 */
  memo: string;
  /** -1接口未请求默认状态,  0、待审核，1、不通过，2、已通过，3、被撤回 */
  status: -1 | 0 | 1 | 2 | 3;
}
/**
 * 获取状态
 * @param type 1、手机，2、GOOGLE，3、挂失手机
 */
export const getVerifyUserInfo = (type: number): Promise<IVerifyInfo> => {
  return _jsonpSafe({
    url: '/getVerifyUserInfo',
    params: { type }
  });
};
// google验证
export const doSetGoogleAuth = (params: IDoSetGoogleAuthParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doSetGoogleAuth',
    params
  });
};

// 获取google秘钥
export const getGoogleSecret = (): Promise<IGetGoogleSecretRes> => {
  return _jsonpSafe({
    url: '/getGoogleSecret'
  });
};
export interface IDoAuthMobileParams {
  countryCode: string;
  mobile: string;
  mobileCode: string;
  emailCode: string;
  googleCode: string;
  safePwd?: string;
}
export const doAuthMobile = (params: IDoAuthMobileParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doAuthMobile',
    params
  });
};
export interface IDoAuthEmailParams {
  email: string;
  emailCode: string;
  mobileCode: string;
  safePwd: string;
  googleCode: string;
}
export const doAuthEmail = (params: IDoAuthEmailParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doAuthEmail',
    params
  });
};
export interface IDoModifyMobileParams {
  countryCode: string;
  newMobileNumber: string;
  newMobileCode: string;
  oldMobileCode: string;
  emailCode: string;
  googleCode: string;
  realImg: string;
  safePwd?: string;
}

export const doModifyMobile = (params: IDoModifyMobileParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doModifyMobile',
    params
  });
};

export interface IDoRegisterParams {
  userType: 1 | 2;// LAN== 'en' ? 2 : 1,
  userName: string;
  loginPwd: string;
  countryCode: string;
  msgCode: string;
  recommendCode: string;
  agentCode: string;
  platform: string;
  wsclientid: string;
  zbgUid: string;
  loginType: string;
  afsSessionId: string;
  afsSig: string;
  afsToken: string;
  afsScene: string;
  afsAppKey: string;
}
// 用户登录
export const doRegister = (params: IDoRegisterParams): Promise<IJsonpResponse<any>> => {
  return _jsonpUser({
    url: '/doRegister',
    params,
    isAll: true
  });
};

// 用户注册
export const doUserLogin = (params: IDoLoginParams): Promise<IJsonpResponse<IDoLoginRes>> => {
  return _jsonpUser({
    url: '/doLogin',
    params,
    isAll: true
  });
};

// 异地登录验证+Google登录验证
export const doLoginAuth = (params: IDoLoginAuthParams): Promise<any> => {
  return _jsonpAccountUser({
    url: '/doLoginAuth',
    params
  });
};
interface ICheckUserNameParams {
  /* 用户名类型 1：手机号码，2：邮箱 */
  userType: number; //	int	是
  userName: string; // 是	手机号 / 邮箱
  countryCode?: string; //	否	区号
}
// 检查手机/邮箱是否可用
export const doCheckUserName = (params: ICheckUserNameParams): Promise<any> => {
  return _jsonpAccountUser({
    url: '/doCheckUserName',
    params
  });
};

// 获取大陆用户实名认证链接
export const getFaceIdToken = (): Promise<{ url: string }> => {
  return _jsonpUser({
    url: '/getFaceIdToken'
  });
};

export interface IOverseasAuthParams {
  conuntryCode: string; // 国家区号代码
  countryName: string; // 国家区号名称
  firstName: string; // 名字
  lastName: string; // 姓氏
  streetAddress: string; // 街道地址
  city: string; // 所在城市
  doucumentNumber: string; // 证件号码
  loadImg: string; // 手持证件照 url
  frontalImg: string; // 证件照正面 url
  addressImg?: string; // 地址证明图片 url
  postalCode: string; // 邮政编码
}
// 海外用户实名认证
export const doOverseasAuth = (params: IOverseasAuthParams): Promise<void> => {
  return _jsonpSafe({
    url: '/doOverseasAuth',
    params
  });
};

export interface IUploadKycImageParams {
  type: number;
  file: string;
}

export interface IUploadKycImageResponse {
  url: string; // 访问文件路径
  filePath: string; // 文件名
}

// 上传KYC图片
export const uploadKycImageJson = (params: { type: number }, data: FormData): Promise<IJsonpResponse<IUploadKycImageResponse>> => {
  return _postUserKyc({
    url: '/uploadKycImageJson',
    params,
    withCredentials: true,
    data
  });
};

// 上传图片
export const uploadImage = (params: { type: number; payWay: string }, data: FormData): Promise<IUploadKycImageResponse> => {
  return post({
    url: '/api/web/common/V1_0_0/uploadImage',
    data,
    params
  }, true);
};

// 未读
export const notifyEntry = (): Promise<any> => {
  return _jsonpUser({
    url: '/notifyEntry'
  });
};
interface ISetSystemNotifyIsReadParams {
  id: string;
}
// 设置已读
export const setSystemNotifyIsRead = (params: ISetSystemNotifyIsReadParams): Promise<void> => {
  return _jsonpUser({
    url: '/setSystemNotifyIsRead',
    params
  });
};
