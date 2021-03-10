import { _jsonpUser, _jsonpInformation } from './common';
import conf from '@/config/index';
import { post } from '@/utils/otc-http';
import { AxiosRequestConfig } from 'axios/index.d';

interface IGetNotify {
  type: number;
  pageNo: number;
  pageSize?: number;
}
export interface IGetNotifyRes<T> {
  activiryCenterNum: number;
  notifyMap: INotifyMap<T>;
  publicNoticeNum: number;
  systemNotfyNnm: number;
}
interface INotifyMap<T> {
  notifyList: T[];
  pageIndex: number;
  pageSize: number;
  totalAmount: number;
}
export interface INotifyList extends INotifyPublicNotice {
  dalete: boolean;
  id: number;
  publicNotice: INotifyPublicNotice;
  publicNoticeId: number;
  read: boolean;
  userId: number;
  userName: string;
  defaultTitle: string;
  defaultContent: string;
  defaultTag: string;
  index: number;
}
export interface INotifyPublicNotice {
  content: string;
  createTime?: number;
  delete?: boolean;
  englishContent: string;
  englishTitle: string;
  id?: number;
  modifier?: string;
  publishTime: number;
  publisher?: string;
  title: string;
  updateTime?: number;
  defaultContent?: string;
  defaultTitle?: string;
  cnTag: string;
  enTag: string;
  fullScreenPic?: string;
  forwardCount: number;
  read: boolean;
}

export interface IActivity extends IActivityActiveCenter {
  activityCenter: IActivityActiveCenter;
  activityCenterId: number;
  delete: boolean;
  id: number;
  read: boolean;
  userId: number;
  userName: string;
}
export interface IActivityActiveCenter {
  clickRate?: number;
  createTime?: number;
  delete?: boolean;
  detailPageContent?: string;
  detailPageUrl?: string;
  endTime?: number;
  fullScreenPic?: string;
  hasDetailPage?: boolean;
  id?: number;
  inset?: string;
  modifier?: string;
  offTime?: number;
  openType?: number;
  popupPic?: string;
  poster?: string;
  publishTime: number;
  publisher?: string;
  showInFullScreen?: boolean;
  showInMail?: boolean;
  showInPopup?: boolean;
  showTime?: number;
  startTime?: number;
  title: string;
  updateTime?: number;
  forwardCount: number;
  content: string;
  introduction: string;
}

export interface INoticy {
  content: string;
  createTime: number;
  delete: boolean;
  id: number | string;
  read: boolean;
  userId: number | string;
  userName: string;
  newWebParam: string;
  title: string;
  publishTime: string;
  lastOfflineContent?: string;
  historyTime?: string;
  name?: string;
  headUrl?: string;
  type: number | string;
  isUnRead?: boolean;
  index: number;
}

export interface INewsList {
  contentSub: string;
  createTime: number;
  id: number;
  myId: number;
  newsId: string;
  publishDate: number;
  source: string;
  title: string;
  titlePic: string;
  summary: string;
  content: string;
}
interface INewsListWrap{
  newses: INewsList[];
}
interface INewsDetailWrap{
  news: INewsList;
}

export interface IParams {
  direction: string;
  time?: number;
}
export interface IQuickNewsParams {
  page: number;
  pageSize: number;
  lan: number;
}

export interface INewsDetail {
  newsId: string;
}
export interface INewsFlashReq {
  newsFlashId: string;
}

export interface IQuicknews {
  content: string;
  createTime: number;
  id: number;
  myId: number;
  newsFlashId: string;
  publishDate: number;
  rank: number;
  source: string;
  title: string;
}
interface IQuicknewsWrap{
  newsFlashs: IQuicknews[];
}

export interface IResponse<T> {
  datas: T[];
  totalAmount: number;
}

export interface IAnnouncementParams {
  type: number;
  detailId: string;
  notifyId: string;
  isRead?: string;
}
export interface IAnnouncementReq {
  next: string;
  notifyDetail: INoticy;
  pre: string;
}
export interface IAddCommentParams {
  orderId: string;
  commentUserId: string;
  commentedUserId: string;
  score: number;
  content: string;
}

export const __postComment = (config: AxiosRequestConfig): Promise<any> => {
  config.url = conf.otcPath + '/otc/Apis/CommentController' + config.url;
  return post(config);
};
// 公告/通知/活动
export const getNotify = <T>(params: IGetNotify): Promise<IGetNotifyRes<T>> => {
  return _jsonpUser({
    url: '/getNotify',
    params
  });
};
// 公告详情
export const getNotifyDetail = (params: IAnnouncementParams): Promise<IAnnouncementReq> => {
  return _jsonpUser({
    url: '/getNotifyDetail',
    params
  });
};
// 新闻列表
export const newsList = (params: IParams): Promise<INewsListWrap> => {
  return _jsonpInformation({
    url: '/getNewsListByTime',
    params
  });
};
// 新闻详情
export const newDetail = (params: INewsDetail): Promise<INewsDetailWrap> => {
  return _jsonpInformation({
    url: '/getNewsContent',
    params
  });
};

// 快讯
export const quickNewsList = (params: IParams): Promise<IQuicknewsWrap> => {
  return _jsonpInformation({
    url: '/getNewsFlashByTime',
    params
  });
};
/*
  新增评价 (星)
*/
export const addComment = (params: IAddCommentParams): Promise<void> => {
  return __postComment({
    url: '/add',
    data: params
  });
};
