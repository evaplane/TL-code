import io from 'socket.io-client';
import config from '@/config/index';
import store from '@/store/store';
import { getGroupInfo } from '@/api/chat';
import { IChatMessageInfo } from '@/store/modules/chat';
interface ISocketMsg {
  avatar: string;
  cy: number; // 0 普通聊天
  f: string;
  m: string;
  nickName: string;
  nickname: string;
  t: string;
  ty: number;
}

export interface IMessageTypes {
  at: any;
  fp: string;
  groupId: string;
  history_time2: number;
  msg_content: string;
  msg_type: string;
  nickName: string;
  user_uid: string;
  handle?: string;
  bgColor?: string;
  desc?: string;
  iconUrl?: string;
  title?: string;
}
export interface IMessageObj {
  t: string;
  m: string;
  ty: number;
  cy: string;
  nickName: string;
  typeu: string;
  to: string;
  fp: string;
}
let userUid = store.getters['user/chatUserInfo'] && store.getters['user/chatUserInfo'].authed_info.user_uid;
let token = store.getters['user/chatUserInfo'] && store.getters['user/chatUserInfo'].authed_info.token;
let url = config.chatWs;
let setInt: any = null;
let lastMsgTime = 0;
const options = {
  path: '/socket.io',
  transports: ['websocket'],
  timeout: 5000,
  reconnectionDelayMax: 5000
};
const socket = io(url, options);
class SocketIo {
  public socketReconnect = 1;
  public async heatBeat(): Promise<void> {
    userUid = store.getters['user/chatUserInfo'] && store.getters['user/chatUserInfo'].authed_info.user_uid;
    socket.emit('HEART_EVENT', JSON.stringify({
      'bridge': false,
      'dataContent': {
        t: '',
        m: '',
        ty: '',
        cy: '',
        'f': userUid,
        nickName: ''
      },
      'fp': config.baseFp + new Date().getTime(),
      'from': userUid,
      'qoS': true,
      to: '',
      'type': 1, // 心跳 1 //51正常 //52错误
      typeu: ''
    }), (res: string): void => {
      let resParse = JSON.parse(res);
      if (resParse.dataContent !== '200') {
        let data = JSON.parse(resParse.dataContent);
        if (resParse.type === 52 && data.errorCode === 301) {
          console.log(this.socketReconnect);
          this.socketReconnect++;
          if (this.socketReconnect === 3) {
            this.init();
          }
        }
      }
    });
  }
  public async addChat(socketMsg: ISocketMsg, message: IMessageTypes): Promise<void> {
    let chatObj: IChatMessageInfo = {
      historyType: socketMsg.ty,
      chatType: socketMsg.cy,
      historyTime: new Date().getTime(),
      lastOfflineContent: socketMsg.m,
      showCount: true,
      groupId: socketMsg.f,
      headUrl: `${config.chatImg}&user_uid=${socketMsg.f}`,
      name: socketMsg.nickName
    };
    if (+socketMsg.cy === 2) {
      let { orderInfo } = await getGroupInfo(JSON.stringify({ gid: socketMsg.t }));
      if (orderInfo) {
        let { otherUserUid, orderId } = JSON.parse(orderInfo);
        chatObj = {
          ...chatObj,
          orderId,
          userUid: otherUserUid
        };
      }
    }
    store.dispatch('chat/setChatList', chatObj);
    store.dispatch('chat/setMessageList', message);
  }
  public init(): void {
    userUid = store.getters['user/chatUserInfo'] && store.getters['user/chatUserInfo'].authed_info.user_uid;
    token = store.getters['user/chatUserInfo'] && store.getters['user/chatUserInfo'].authed_info.token;
    let loginInfo = {
      'QoS': false,
      'bridge': false,
      'dataContent': {
        'loginToken': token,
        'loginUserId': userUid
      },
      'from': userUid,
      'to': '0',
      'type': 0,
      'typeu': -1
    };
    this.socketReconnect = 1;
    socket.emit('wowchat-event', JSON.stringify(loginInfo), async (): Promise<void> => {
      window.clearInterval(setInt);
      setInt = null;
      setInt = setInterval((): Promise<void> => this.heatBeat(), 5000);
    });
  }
  public sendMessage(obj: IMessageObj): void {
    let { t, m, ty, cy, typeu, to, fp, nickName } = obj;
    let params: IObj<any> = {
      'bridge': false,
      'dataContent': {
        t,
        m,
        ty,
        cy,
        'f': userUid
      },
      fp,
      'from': userUid,
      'QoS': true,
      to,
      'type': 2,
      typeu,
      time: new Date().getTime(),
      'isSelfMsg': false,
      'retryCount': 0
    };
    if (cy === '2') {
      params.dataContent = { ...params.dataContent, nickName };
    }
    socket.emit('wowchat-event', JSON.stringify(params));
  }
}

export let socketInstance = new SocketIo();
socket.on('wowchat-event', async (res: string): Promise<void> => {
  let socket = JSON.parse(res);
  let socketMsg: ISocketMsg = JSON.parse(socket.dataContent);
  if (socket.time === lastMsgTime) return;
  let message: IMessageTypes = {
    'msg_content': +socketMsg.ty === 7 ? JSON.parse(socketMsg.m).msg : socketMsg.m,
    'user_uid': socketMsg.f,
    groupId: socketMsg.t,
    'history_time2': socket.time,
    'msg_type': `${socketMsg.ty}`,
    fp: socket.fp,
    nickName: socketMsg.nickName,
    at: `${socketMsg.ty}` === '7' ? JSON.parse(socketMsg.m).at : null
  };
  /*
    插件模板信息
  */
  if (+socketMsg.ty === 9) {
    let { bgColor, desc, iconUrl, title } = JSON.parse(JSON.parse(socketMsg.m).data);
    message = {
      ...message,
      handle: 'service',
      bgColor,
      desc,
      iconUrl,
      title
    };
  }

  console.log('socket======', socket);
  console.log('socketMsg===', socketMsg);
  // 普通聊天
  if (+socketMsg.cy === 2 || +socketMsg.cy === 0) {
    socketInstance.addChat(socketMsg, message);
    lastMsgTime = socket.time;
  }
});
socket.on('disconnect', (): void => {
  console.log('disconnect');
  socket.open();
});
