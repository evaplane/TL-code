import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';

export const __postBank = (config: AxiosRequestConfig, isFormData?: boolean): Promise<any> => {
  config.url = conf.otcPath + '/otc/apis/AccountController' + config.url;

  return post(config, isFormData);
};

export interface IBankListResponse {
  /** 银卡id */
  bankId: number;
  /** 银行名称 */
  bankName: string;
  /** 银行图片 */
  image: string;
  /** 银行英文简称 */
  name: string;
  /** 银行卡依次顺序 */
  ordinal: number;
  /** 银行简称 */
  simpleBankName: string;
}

export const reqGetAllBank = (): Promise<IBankListResponse[]> => {
  return __postBank({
    url: '/getAllBank' // 获取所有的银行信息 ,
  });
};

export interface IAccountResponse {
  /** 银行卡号/账号/账户 */
  account: string;
  /** 主键ID */
  accountId: string;
  /** 地址 */
  address: string;
  /** 银行id */
  bankId: number;
  /** 银行名称 */
  bankName: string;
  /** 城市编码 */
  cityCode: number;
  /** 创建时间 */
  createTime: number | string;
  /** 币种(CNY, USD, EUR, THB) */
  currency: string;
  /** 是否已删除 */
  deleted: boolean;
  /** 备注信息 */
  note: string;
  /** 支付二维码地址 */
  payQrUrl: string;
  /** 用于付款 1-是 0-否 */
  payment: 1 | 0;
  /** 省份编码 */
  provinceCode: number;
  /** 真实名称 */
  realName: string;
  /** 用于收款 1-是 0-否 */
  receive: 1 | 0;
  /** 地址 */
  signleAddress: string;
  /** 支行 */
  subBranch: string;
  /** swft码 */
  swftCode: string;
  /** 类型（1银联卡，2微信，3支付宝，4Paypal，5USD银行卡，6EUR银行卡 7Epay） */
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** 更新时间 */
  updateTime: number | string;
  /** 用户id */
  userId: string;
}

export type TBankStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 银行卡类型

export interface IAddAccountParams {
  /** 真实姓名 */
  realName: string;
  /** 类型（1银联卡，2微信，3支付宝，4Paypal，5USD银行卡，6EUR银行卡 7Epay） */
  type?: TBankStatus;
  /** 银行名称 */
  bankName?: string;
  /** 支行 */
  subBranch?: string;
  /** 银行卡号/账号/账户 */
  account?: string;
  /** 地址 */
  address?: string;
  /** swft码 */
  swftCode?: string;
  /** 备注信息 */
  note?: string;
  /** 地址 */
  signleAddress?: string;
  /** 用于收款 1-是 0-否 */
  receive: 1 | 0;
  /** 用于付款 1-是 0-否 */
  payment?: 1 | 0;
  /** 省份编码 */
  provinceCode?: number;
  /** 城市编码 */
  cityCode?: number;
}

export const reqAddAccount = (params: any, isFormData?: boolean): Promise<IAccountResponse> => {
  return __postBank({
    url: '/addAccount', // 新增账户 ,
    data: params
  }, isFormData);
};

export interface IAccountListParams {
  /** 用于收款 1-是 0-否 */
  receive?: 1 | 0;
  /** 账户类型，逗号分割 */
  typeStr?: string;
  /** 是否删除 */
  deleted?: boolean;
  /** 页数 */
  pageIndex: number;
  /** 条数 */
  pageSize: number;
  /** 用于付款 1-是 0-否 */
  payment?: 1 | 0;
  /** 类型（1银联卡，2微信，3支付宝，4Paypal，5USD银行卡，6EUR银行卡 7Epay） */
  type?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface IGetByAccountParams {
  results: IAccountResponse[];
  pageIndex: number;
  totalPage: number;
}

export const reqGetByAccount = (params: IAccountListParams): Promise<IGetByAccountParams> => {
  return __postBank({
    url: '/list', // 查询用户的账户信息 ,
    data: params
  });
};

export const reqGetByAccountId = (accountId: string | number, isFormData?: boolean): Promise<IAccountResponse> => {
  return __postBank({
    url: '/getByAccountId', // 根据id查询用户的账户信息 ,
    data: { accountId }
  }, isFormData);
};

export const reqDeleteBank = (accountId: string | number, isFormData?: boolean): Promise<null> => {
  return __postBank({
    url: '/delete', // 删除用户的账户信息 ,
    data: { accountId }
  }, isFormData);
};

export type TPayStatus = 0 | 1; // 收付款状态

export interface IAccountUpdateParams {
  /** 主键ID */
  accountId: string;
  /** 是否删除 */
  deleted: boolean;
  /** 用于付款 1-是 0-否 */
  payment: TPayStatus;
  /** 用于收款 1-是 0-否 */
  receive: TPayStatus; //
}

export const reqUpdateBank = (params: IAccountUpdateParams, isFormData?: boolean): Promise<null> => {
  return __postBank({
    url: '/update', // 修改用户的账户信息--只能修改是否用于收付款 ,
    data: params
  }, isFormData);
};
