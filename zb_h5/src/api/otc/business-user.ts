import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';
import store from '@/store/store';

export const __postBusiness = (config: AxiosRequestConfig, isFormData?: boolean): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/BusinessUserController' + config.url;
  return post(config, isFormData);
};

export interface IOtcBusinessUser {
  /** 站点id */
  webId: string;
  /** 源站点用户id */
  sourceUserId: string;
  /** 创建人id */
  webcreateUidId: string;
  /** 修改人id */
  modifyUid: string;
  /** 首次交易时间 */
  firstTradeTime: number;
  /** 用户id */
  userId: number;
  /** 商户 */
  businessUserId: number;
  /** 头像 */
  headImg: string;
  /** 等级 */
  level: number;
  /** 昵称 */
  nickName: string;
  /** 用户类型 0:普通用户,1:商家 */
  userType: number;
  /** 被关注数量 */
  attentionedCount: number;
  /** 关注数量 */
  attentionCount: number;
  /** 评价数量 */
  commentCount: number;
  /** 被评价数量 */
  commentedCount: number;
  /** 平均评分 */
  avgScore: string;
  /** 得分 */
  score: number;
  /** 平均放行时间 */
  avgTradeSpendTime: number;
  /** 近30天成交次数 */
  last30dTradeTimes: number;
  /** 总成交次数 */
  totalTradeTimes: number;
  /** 近30天申诉次数 */
  last30dAppealTimes: number;
  /** 总申诉次数 */
  totalAppealTimes: number;
  /** 近30天胜诉次数 */
  last30dWinOverTimes: number;
  /** 总胜诉次数 */
  totalWinOverTimes: number;
  /**  商家类型(0:普通商家 1:认证商家) */
  businessType: number;
  /** 审核状态(0:未提交 1:认证待审核 2:认证审核未通过 3:认证审核通过 4:解除认证待审核 5:解除认证审核未通过 6:解除认证审核通过) */
  checkStatus: number;
}

export const reqGetBusinessUser = (isFormData?: boolean): Promise<IOtcBusinessUser[]> => {
  const userId = store && store.getters['otc/user'].otcUserId;
  return __postBusiness({
    url: '/getBusinessUserResponseByUserId', // 根据用户id查询商家(含普通用户信息)
    data: { userId }
  }, isFormData);
};

export interface IOtcCheckReleaseParams {
  userId: string;
  checkType: number;
  reason: string;
}

export const reqBecomeBusiness = (): Promise<any> => {
  const userId = store && store.getters['otc/user'].otcUserId;
  return __postBusiness({
    url: '/becomeBusiness', // 成为普通商家
    data: { userId }
  }, true);
};

export const reqApplyAuthBusiness = (): Promise<any> => {
  const Userid = store && store.getters['otc/user'].otcUserId;
  return __postBusiness({
    url: '/applyAuthBusiness', // 申请认证商家
    data: { Userid }
  }, true);
};

export const reqUpdateOnlineStatus = (): Promise<any> => {
  return __postBusiness({
    url: '/updateOnlineStatus' // 修改在线状态
  });
};

export const reqCheckReleaseAuth = (params: IOtcCheckReleaseParams): Promise<any> => {
  return __postBusiness({
    url: '/checkReleaseAuthBusiness', // 审核解除认证
    data: params
  });
};

export const reqCheckAuthBusiness = (params: IOtcCheckReleaseParams): Promise<any> => {
  return __postBusiness({
    url: '/checkAuthBusiness', // 审核商家认证
    data: params
  });
};

export const reqReleaseAuth = (): Promise<any> => {
  return __postBusiness({
    url: '/releaseAuthBusiness' // 解除认证
  });
};

export const reqUpdateAutoOrders = (): Promise<any> => {
  return __postBusiness({
    url: '/updateAutoOrders' // 修改自动接单
  });
};
