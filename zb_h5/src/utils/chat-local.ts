import localForage from 'localforage';
import store from '@/store/store';
// 获取本地存储
export const getChatListSession = (type: string = 'chat'): any => {
  let useUid = store.getters['user/chatUserInfo'].authed_info.user_uid;
  return localForage.getItem(`${type}-${useUid}`);
};
// 删除本地存储
export const delChatListSession = async (type: string = 'chat'): Promise<void> => {
  let useUid = store.getters['user/chatUserInfo'].authed_info.user_uid;
  await localForage.removeItem(`${type}-${useUid}`);
};
// 设置本地存储-对话列表
export const setChatListSession = async (chatList: any): Promise<void> => {
  let useUid = store.getters['user/chatUserInfo'].authed_info.user_uid;
  localForage.setItem(`chat-${useUid}`, {
    chatList
  });
};
// 设置本地存储-对话详情
export const setMessageSession = async (message: any): Promise<void> => {
  let useUid = store.getters['user/chatUserInfo'].authed_info.user_uid;
  localForage.setItem(`message-${useUid}`, {
    message
  });
};
