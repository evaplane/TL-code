import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';
import conf from '@/config/index';

export const __postAccount = (config: AxiosRequestConfig): Promise<any> => {
  config.url = conf.otcPath + '/otc/apis/AccountController' + config.url;
  return post(config);
};

export interface IOtcAccountResponse {
  note: string | null; // (string, optional): 备注信息 ,
  receive: 0 | 1; // (integer, optional): 用于收款 1-是 0-否 ,
  swftCode: string | null; // (string, optional): swft码 ,
  address: string | null; // (string, optional): 地址 ,
  payQrUrl: string | null; // (string, optional): 支付二维码地址 ,
  provinceCode: number | null; // (integer, optional): 省份编码 ,
  cityCode: number | null; // (integer, optional): 城市编码 ,
  bankName: string; // (string, optional): 银行名称 ,
  updateTime: string | null; // (date, optional): 更新时间 ,
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7; // (integer, optional): 类型（1银联卡，2微信，3支付宝，4Paypal，5USD银行卡，6EUR银行卡 7Epay） ,
  userId: string; // (long, optional): 用户id ,
  signleAddress: string | null; // (string, optional): ,
  accountId: string; // (long, optional): 主键ID ,
  realName: string; // (string, optional): 真实名称 ,
  bankId: number; // (integer, optional): 银行id ,
  serialVersionUID?: string; // (long, optional),
  deleted: boolean; // (boolean, optional): 是否已删除 ,
  createTime: string; // (date, optional): ,
  currency: 'CNY' | 'USD' | 'EUR' | 'THB' | null; // (string, optional): 币种(CNY, USD, EUR, THB) ,
  payment: 0 | 1 ; // (integer, optional): 用于付款 1-是 0-否 ,
  subBranch: string; // (string, optional): 支行 ,
  account: string; // (string, optional): 银行卡号/账号/账户
}

export interface IOtcListParams {
  receive?: 0 | 1; // (integer, optional): 用于收款 1-是 0-否 ,
  accountId?: string; // (long, optional): 账户id ,
  typeStr?: string; // (string, optional): 账户类型，逗号分割 ,
  deleted: boolean; // (boolean, optional): 是否删除 ,
  pageIndex: number; // (integer, optional): pageIndex页数 ,
  pageSize: number; // (integer, optional): pageIndex条数 ,
  payment?: 0 | 1; // (integer, optional): 用于付款 1-是 0-否 ,
  type?: 1 | 2 | 3 | 4 | 5 | 6 | 7; // (integer, optional): 类型（1银联卡，2微信，3支付宝，4Paypal，5USD银行卡，6EUR银行卡 7Epay） ,
  userId: string; // (long, optional): 用户id
}

export interface IOtcListResponse {
  totalRow: number; // (integer, optional),
  pageIndex: number; // (integer, optional),
  totalPage: number; // (integer, optional),
  pageSize: number; // (integer, optional),
  results: IOtcAccountResponse[]; // (object, optional)
}
/**
 * 搜索用户的账户信息
 */
export const accountList = (params: IOtcListParams): Promise<IOtcListResponse> => {
  return __postAccount({
    url: '/list',
    data: params
  });
};
