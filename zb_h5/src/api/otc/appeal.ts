import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';

export const __postAppeal = (config: AxiosRequestConfig, isFormData: boolean = false): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/AppealController' + config.url;
  return post(config, isFormData);
};

export interface IAppealDetailsResponse {
  /** 发起时间 */
  addTime: string;
  /** 头像 */
  avatar: null | string;
  /** 申诉内容 */
  content: string;
  /** 申诉图片 用逗号隔开 */
  imgs: string;
  /** 用户ID */
  userId: number;
  /** 用户昵称 */
  userNickName: string | null; //
  /** 1 买家 2卖家 */
  userType: '1' | '2';
}

export interface IAppealResponse {
  /** 申诉id */
  appealId: string;
  /** 申诉类型（1对方无应答，2对方有欺诈行为，3对方未放行，4对方未付款，9其他） */
  appealType: 1 | 2 | 3 | 4 | 9;
  details: IAppealDetailsResponse[];
  /** 订单id */
  orderId: string;
}

export const reqAppealGetById = (id: string | number): Promise<IAppealResponse> => {
  return __postAppeal({
    url: '/getById', // 根据id查询申诉详情
    params: { id }
  });
};

export interface IAppealAddParams {
  /** 图片路径（多个用逗号分割） */
  images: string;
  /** 角色（1买家，2卖家，3仲裁员） */
  role: number;
  /** 昵称 */
  nickName: string;
  /** 用户头像图片路径 */
  userAvatar: string;
  /** 申诉内容 */
  content: string; //
}

export const reqAddAppeal = (params: any, isFormData?: boolean): Promise<null> => {
  return __postAppeal({
    url: '/addAppeal', // 发起申诉
    data: params
  }, isFormData);
};

export interface IAppealAddCertificateParams {
  /** 订单id */
  orderId: number;
  0: any; // 上传图片 1-3
  1: any;
  2: any;
  /** 申诉id */
  appealId: number;
  /** 申诉内容 */
  content: string;
}

export const reqAddCertificate = (params: any): Promise<null> => {
  return __postAppeal({
    url: '/addCertificate', // 添加新证据
    data: params
  });
};
