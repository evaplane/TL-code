import { post } from '@/utils/http';
import conf from '@/config/index';

export const _postConfig = (config: any, isLogin: boolean = false): Promise<any> => {
  config.url = conf.chatUrl + '/wowchat/rest_post';
  return post(config, false, isLogin ? 'login' : 'token');
};

export interface IOffline {
  'chat_type': string;
  'fingerP': string;
  'friend_user_uid': string;
  'hisrotyMsgId': string;
  'historyTime2ForDefaultTimeZone': string;
  'history_time2': string;
  'msg_content': string;
  'msg_type': number;
  'nickName': string;
  'readStatus': string;
  'selfMsgFlag': string;
  'user_uid': string;
  'group_id': string;
}

export interface IContactInfo {
  address: string;
  areaCode: string;
  friend: string;
  friendType: string;
  latest_login_time: string;
  liveStatus: number;
  man: boolean;
  maxFriend: string;
  mobile: string;
  nickname: string;
  online: boolean;
  openId: string;
  qrcode: string;
  register_time: string;
  remarkName: string;
  sourceDesc: string;
  sourceExtend: string;
  sourceType: string;
  token: string;
  userAvatarFileName: string;
  userDesc: string;
  userType: string;
  user_mail: string;
  user_sex: string;
  user_uid: string;
  whatsUp: string;
  wowchat_no: string;
}
export interface IMemberRes {
  g_id: string;
  nickname: string;
  nickname_ingroup: string;
  userAvatarFileName: string;
  user_uid: string;
  memberType: string;
}
export interface IChatUserInfo {
  'authed_info': IAuthedInfo;
  groupInfo: IGroupInfo;
}
export interface IAuthedInfo {
  address: string;
  areaCode: string;
  latest_login_time: string;
  liveStatus: number;
  man: boolean;
  maxFriend: string;
  mobile: string;
  nickname: string;
  online: boolean;
  openId: string;
  qrcode: string;
  register_time: string;
  token: string;
  userAvatarFileName: string;
  userDesc: string;
  userType: string;
  user_mail: string;
  user_sex: string;
  user_uid: string;
  whatsUp: string;
  wowchat_no: string;
}

export interface IGroupInfo {
  create_time: string;
  g_id: string;
  g_member_count: string;
  g_name: string;
  g_notice: string;
  g_notice_updatenick: string;
  g_notice_updatetime: string;
  g_notice_updateuid: string;
  g_owner_name: string;
  g_owner_user_uid: string;
  g_status: string;
  groupSetting: string;
  imIsInGroup: string;
  max_member_count: string;
  memberType: string;
  nickname_ingroup: string;
  worldChat: boolean;
}
export interface ISendPluginRes {
  fingerPrint: string;
  m: string;
  toGroupId: string;
}

export interface ICreateGroupRes {
  'create_time': string;
  'g_id': string;
  'g_member_count': string;
  'g_name': string;
  'g_notice': string;
  'g_notice_updatenick': string;
  'g_notice_updatetime': string;
  'g_notice_updateuid': string;
  'g_owner_name': string;
  'g_owner_user_uid': string;
  'g_status': string;
  'groupSetting': string;
  'imIsInGroup': string;
  'max_member_count': string;
  'memberType': string;
  'nickname_ingroup': string;
  'openGroupId': string;
  'orderInfo': string;
  'worldChat': boolean;
}
interface IPluginListRes {
  orderPluginList: IPluginListResOrder[];
}
interface IPluginListResOrder {
  iconUrl: string;
  pluginId: string;
  pluginName: string;
}

// 获取联系人
export const contactListApi = (id: string): Promise<any> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '2',
      'actionId': '7',
      device: 2,
      'newData': id
    }
  });
};

// 获取联系人信息
export const contactInfoApi = (newData: string): Promise<IContactInfo> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '3',
      'actionId': '8',
      newData
    }
  });
};
/* 获取离线列表
  [
  {"gName":"å•Šå•Šå•Šå•Š",
  "offlineMsgCount":"2",
  "historyType":0,
  "nickName":"ASDFASDF",
  "groupId":"273085650197295104",
  "maxHistoryId":"929949",
  "groupMembersCount":3,
  "historyTime":"1545277370959",
  "friendUserId":"253610758175469568",
  "userId":"254226964297297920",
  "lastOfflineContent":"213213123",
  "chatType":"2"}
 ]
*/
export const offlineMessageApi = (newData: string): Promise<any> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '4',
      'actionId': '34',
      newData
    }
  });
};
// 获取个人离线消息
export const offlineMessagePersonalApi = (newData: string): Promise<IOffline[]> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '4',
      'actionId': '8',
      newData
    }
  });
};
// 查询群成员列表
export const groupMembersApi = (newData: string): Promise<IMemberRes[]> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '9',
      newData
    }
  });
};
// 获取用户群组列表
export const GroupSortListApi = (): Promise<any[]> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '7'
    }
  });
};
// 获取群信息
export const getGroupInfo = (newData: string): Promise<ICreateGroupRes> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '8',
      newData
    }
  });
};
// 用户端登录
export const login = (newData: string): Promise<IChatUserInfo> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '1',
      'actionId': '30',
      newData
    }
  }, true);
};
// 查询聊天窗口内消息插件列表
export const getPluginList = (): Promise<IPluginListRes> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '26',
      'actionId': '10'
    }
  });
};
/*
  客服
  params: orderId:xxx
*/
export const customerService = (newData: string): Promise<any[]> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '42',
      newData
    }
  });
};
/* 建立群聊
newData: {
      counterpartyToken: '1492207',
      orderId: '363370208494366720',
      orderAmount: '1',
      orderStatus: '2',
      orderMoney: '1',
      orderUnitPrice: '11'
}
*/
export const createGroup = (newData: string): Promise<ICreateGroupRes> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '41',
      newData
    }
  });
};
/* 发送模板信息
newData: {
      toUserUid: '1492207',
      toGroupId: '363370208494366720',
      pluginId: '1'
}
*/
export const sendChatPluginMsg = (newData: string): Promise<ISendPluginRes> => {
  return _postConfig({
    data: {
      'processorId': '1008',
      'jobDispatchId': '26',
      'actionId': '11',
      newData
    }
  });
};
/*
人工客服
userUid: xxx
*/
export const customerServer = (newData: string): Promise<ISendPluginRes> => {
  return _postConfig({
    data: {
      'processorId': '1016',
      'jobDispatchId': '25',
      'actionId': '40',
      newData
    }
  });
};
