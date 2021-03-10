/* eslint @typescript-eslint/no-explicit-any: off */
import { jsonp, IJsonpParams } from '@/utils/http';
import config from '@/config/index';

const _jsonpMessage = (params: IJsonpParams): Promise<any> => {
  params.url = config.vipApiPath + '/api/web/user/V1_0_0' + params.url;
  return jsonp(params);
};
interface IGetNotify {
  type: number;
  pageNo: number;
  pageSize: number;
}
interface INotifyStatus {
  publicNoticeNum: number;
  systemNotfyNnm: number;
  activiryCenterNum: number;
}
export interface INotifyItem {
  createTime: number;
  read: boolean;
  content: string;
  englishContent: string;
  id: number;
  detailId: number;
  newWebParam: string;
}
interface IPublicNotice {
  content: string;
  title: string;
  englishContent: string;
  englishTitle: string;
  createTime: number;
}
export interface INotifyPostItem {
  id: number;
  publicNoticeId: number;
  read: boolean;
  userId: number;
  userName: string;
  publicNotice: IPublicNotice;
}
export interface INotifyPostList extends INotifyStatus {
  notifyMap: {
    notifyList: INotifyPostItem[];
    pageIndex: number;
    pageSize: number;
    totalAmount: number;
  };
}
interface INotifyList extends INotifyStatus {
  notifyMap: {
    notifyList: INotifyItem[];
    pageIndex: number;
    pageSize: number;
    totalAmount: number;
  };
}

export const getNotify = (params: IGetNotify): Promise<INotifyList> => {
  return _jsonpMessage({
    url: '/getNotify',
    params
  });
};

export const getPostNotify = (params: IGetNotify): Promise<INotifyPostList> => {
  return _jsonpMessage({
    url: '/getNotify',
    params
  });
};

export const getNotifyStatus = (): Promise<INotifyStatus> => {
  return _jsonpMessage({
    url: '/notifyEntry'
  });
};

export const actReadNotify = (id: number): Promise<any> => {
  return _jsonpMessage({
    url: '/setSystemNotifyIsRead',
    params: { id }
  });
};
