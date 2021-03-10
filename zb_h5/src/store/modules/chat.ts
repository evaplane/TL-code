import { Module } from 'vuex';
import { setChatListSession, setMessageSession, getChatListSession } from '@/utils/chat-local';
import { offlineMessageApi } from '@/api/chat';
import config from '@/config/index';
interface IChatState {
  chatList: IChatMessageInfo[];
  messageList: IObj<any>;
}
export interface IChatMessageInfo {
  chatType: string | number;
  friendUserId?: string;
  historyTime: string | number;
  historyType: string | number;
  id?: string | number;
  isAtMe?: boolean;
  isFlag?: boolean;
  lastOfflineContent: string;
  name: string;
  nickName?: string;
  userId?: string | number;
  offLineCount?: number | string;
  showCount?: boolean;
  active?: boolean;
  headUrl: string;
  groupId: string;
  orderId?: string;
  userUid?: string;
}

export interface IMessage {
  at: any;
  fp: string;
  'group_id': string;
  'history_time2': number;
  'msg_content': string;
  'msg_type': string;
  nickName: string;
  'user_uid': string;
  type?: number;
  state: string;
  iconUrl?: string;
  title?: string;
  desc?: string;
  handle?: string;
  historyTime?: string;
  index?: number;
  bgColor?: string;
}

const chat: Module<IChatState, any> = {
  namespaced: true,
  state: {
    chatList: [],
    messageList: {}
  },
  getters: {
    chatList(state): IChatMessageInfo[] {
      return state.chatList;
    },
    messageList(state): IObj<IMessage[]> {
      return state.messageList;
    }
  },
  mutations: {
    setChatList(state, value: IChatMessageInfo): void {
      if (!value.groupId || !value.name) return;
      let result = state.chatList;
      if (result.length) {
        let itemIndex = result.findIndex((item): boolean => item.groupId === value.groupId);
        if (itemIndex < 0) {
          value.historyTime && result.unshift(value);
        } else {
          let obj = { ...result[itemIndex], ...value };
          result.splice(itemIndex, 1);
          result.unshift(obj);
        }
      } else {
        result.unshift(value);
      }
      if (value.showCount && !value.active) {
        if (!result[0]) return;
        if (value.offLineCount === '' || value.offLineCount) {
          result[0].offLineCount = value.offLineCount;
        } else {
          result[0].offLineCount = result[0].offLineCount || 0;
          (result[0].offLineCount as number)++;
        }
      } else {
        result[0].offLineCount = 0;
      }
      state.chatList = [...result];
      setChatListSession(state.chatList);
    },
    setMessageList(state, value: any): void {
      let groupId = Array.isArray(value) ? value[0].group_id : value.groupId;
      // http接口返回
      if (Array.isArray(value)) {
        if (state.messageList[groupId]) {
          state.messageList[groupId] = [...state.messageList[groupId], ...value].sort((a, b): number => +a.history_time2 - +b.history_time2);
        } else {
          state.messageList[groupId] = value;
        }
      } else { // socket
        if (state.messageList[groupId]) {
          state.messageList[groupId].push(value);
        } else {
          state.messageList[groupId] = [value];
        }
      }
      if (state.chatList.length) {
        let itemIndex = state.chatList.findIndex((item): boolean => item.groupId === groupId);
        if (itemIndex >= 0) {
          let type: IObj<string> = {
            '1': '__("[收到一张图片]")',
            '2': '__("[收到一条语音,请在手机上查看]")',
            '5': '__("[收到一个文件]")',
            '6': '__("[收到语音通话,请在手机上查看]")',
            '7': '__("有人@你")',
            '9': '__("[服务请求]")'
          };
          state.chatList[itemIndex]['lastOfflineContent'] = type[value.msg_type] || value.msg_content;
        }
      }
      state.messageList = { ...state.messageList };
      setMessageSession(state.messageList);
      setChatListSession(state.chatList);
    },
    chatInit(state, arr): void {
      state.chatList = arr[0] ? arr[0].chatList : [];
      state.messageList = arr[1] ? arr[1].message : {};
    }
  },
  actions: {
    setChatList({ commit }, value: IChatMessageInfo): void {
      commit('setChatList', value);
    },
    setMessageList({ commit, rootGetters }, value: IMessage): void {
      if (value.msg_type === '7') { // @
        if (value.at.includes(',')) {
          let atList: string[] = value.at.split(',');
          atList.forEach((item): void => {
            if (rootGetters['user/chatUserInfo'].authed_info.user_uid !== item) {
              value['msg_type'] = '0';
            }
          });
        } else {
          if (rootGetters['user/chatUserInfo'].authed_info.user_uid !== value.at) {
            value['msg_type'] = '0';
          }
        }
      }
      commit('setMessageList', value);
    },
    async chatInit({ commit }, value: string): Promise<void> {
      let offList = await offlineMessageApi(value);
      let chatList = await getChatListSession('chat');
      let messageList = await getChatListSession('message');
      commit('chatInit', [chatList, messageList]);
      if (offList.length) {
        offList.forEach((offItem: any): any => {
          offItem.chatType === '7' && commit('setChatList', { ...offItem, ...{ showCount: true, offLineCount: offItem.offlineMsgCount, headUrl: `${config.chatImg}&user_uid=${offItem.userId}`, name: offItem.gName } });
        });
      }
    }
  }
};

export default chat;
