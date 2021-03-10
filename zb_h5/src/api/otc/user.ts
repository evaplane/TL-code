import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import store from '@/store/store';
import conf from '@/config/index';
import { jsonp, IJsonpParams } from '@/utils/http';

export const __postUser = (config: AxiosRequestConfig, isFormData: boolean = false): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/UserController' + config.url;
  return post(config, isFormData);
};

export const __postUserVip = (config: AxiosRequestConfig): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/otc/V1_0_0' + config.url;
  return post(config);
};

export const __jsonpUserVip = (config: IJsonpParams): Promise<any> => {
  config.url = conf.vipApiPath + '/api/web/otc/V1_0_0' + config.url;
  return jsonp(config);
};

export interface IOtcVipUserTokenResponse {
  otcUserId: string;
  otcUserToken: string;
}
/**
 * 获取用户 token
 */
export const getOtcUserToken = (): Promise<IOtcVipUserTokenResponse> => {
  return __jsonpUserVip({
    url: '/getOtcUserToken',
    params: {
      clientType: 6
    }
  });
};
/**
 * 清除 token
 */
export const clearUserToken = (): Promise<{}> => {
  const otcUserId = store && store.getters['otc/user'].otcUserId;
  return __postUser({
    url: '/clearUserToken',
    data: { otcUserId }
  }, true);
};

export interface IOtcUser {
  otcSellStatus: 0 | 1; // (integer, optional): otc卖出状态0:禁止,1:正常 ,
  modifyUid: string; // (string, optional): 修改人id ,
  completionRate: number; // (number, optional): 完成率 ,
  firstTradeTime: number; // (long, optional): 首次交易时间 ,
  last30dTradeTimes: number; // (integer, optional): 近30天成交次数 ,
  score: number; // (integer, optional): 得分 ,
  attentionedCount: number; // (integer, optional): 被关注数量 ,
  commentedCount: number; // (integer, optional): 被评价数量 ,
  serialVersionUID: number; // (long, optional),
  modifyTime: number; // (long, optional): 修改时间 ,
  avgScore: string; // (string, optional): 平均评分 ,
  totalTradeTimes: number; // (integer, optional): 总成交次数 ,
  id: number; // (integer, optional): 自增主键id ,
  last30dWinOverTimes: number; // (integer, optional): 近30天胜诉次数 ,
  state: -1 | 0 | 1; // (integer, optional): 状态 -1 删除 0 禁用 1启用 默认1 ,
  createUid: string; // (string, optional): 创建人id ,
  banTime: number; // (long, optional): 封禁时间 ,
  headImg: string; // (string, optional): 头像 ,
  level: number; // (integer, optional): 等级 ,
  nickName: string; // (string, optional): 昵称 ,
  authStatus: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // (integer, optional): 认证状态(以枚举类型为准UserAuthStatusEnum) 0:未申请认证,1:初级认证申请/待审核,2:初级认证未通过,3:初级认证已通过,4:高级认证申请/待审核,5:高级认证未通过,6:高级认证已通过,7:视频认证申请/待审核,8:视频认证未通过,9:视频认证已通过 ,
  c2cSellStatus: 0 | 1; // (integer, optional): c2c卖出状态0:禁止,1:正常 ,
  attentionCount: number; // (integer, optional): 关注数量 ,
  dayCancelTimes: number; // (integer, optional): 当天取消次数 ,
  dealFee: number; // (number, optional): 成交率 ,
  mobileBindingStatus: 0 | 1; // (integer, optional): 手机号码绑定状态 0:未绑定，1:已绑定 ,
  userId: number; // (long, optional): 主键用户ID ,
  commentCount: number; // (integer, optional): 评价数量 ,
  realName: string; // (string, optional),
  webId: string; // (string, optional): 站点id ,
  c2cBuyStatus: 0 | 1; // (integer, optional): c2c买入状态0:禁止,1:正常 ,
  last30dAppealTimes: number; // (integer, optional): 近30天申诉次数 ,
  createTime: number; // (long, optional): 创建时间 ,
  totalAppealTimes: number; // (integer, optional): 总申诉次数 ,
  sourceUserId: string; // (string, optional): 源站点用户id ,
  userType: 0 | 1; // (integer, optional): 用户类型 0:普通用户,1:商家 ,
  otcBuyStatus: 0 | 1; // (integer, optional): otc买入状态0:禁止,1:正常 ,
  fundPassword: string; // (string, optional): 资金密码 ,
  totalWinOverTimes: number; // (integer, optional): 总胜诉次数 ,
  avgTradeSpendTime: number; // (long, optional): 平均放币时间（分钟）
}
/**
 * 根据 id 查询用户
 */
export const getUserInfoById = (userId: string): Promise<IOtcUser> => {
  return __postUser({
    url: '/getById',
    data: {
      userId
    }
  }, true);
};

export interface IOtcFundListResponse {
  amount: string; // 数量
  cnyamount: string; // 法币金额
  currencyName: string; // 币种名称
  currencyTypeId: number; // 币种 id
  depositAddress: string | null;
  freezeAmount: string; // 冻结数量
}

/**
 * 获取资金列表
 */
export const getFundList = (): Promise<IOtcFundListResponse[]> => {
  return __postUser({
    url: '/getFundList'
  });
};
