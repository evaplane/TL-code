import { Vue, Component } from 'vue-property-decorator';
import { IUser } from '@/store/modules/user';
import { State, Action } from 'vuex-class';
import { login, IChatUserInfo, createGroup, offlineMessagePersonalApi, IOffline } from '@/api/chat';
import { socketInstance } from '@/utils/chat-socket';
import config from '@/config/index';
import { IChatMessageInfo, IMessage } from '@/store/modules/chat';

interface ICreateGroup {
  counterpartyToken: string | null;
  orderId: string | null;
  orderAmount: string | number;
  orderStatus: string | number;
  orderMoney: string | number;
  orderUnitPrice: string | number;
  counterpartyNickname: string | null;
}

@Component
export default class MixinsChat extends Vue {
  @Action('chatInit', { namespace: 'chat' }) public chatInit!: Function;
  @State('chatUserInfo', { namespace: 'user' }) public chatUserInfo!: IChatUserInfo;
  @State('userInfo', { namespace: 'user' }) public userInfo!: IUser;
  @Action('chatLogin', { namespace: 'user' }) public chatLogin!: Function;
  @Action('setChatList', { namespace: 'chat' }) public setChatList!: Function;
  @Action('setMessageList', { namespace: 'chat' }) public setMessageList!: Function;

  public async mixinsLogin(): Promise<void> {
    try {
      return new Promise(
        async (resolve): Promise<void> => {
          let res: IChatUserInfo = await login(
            JSON.stringify({
              osType: '2',
              nickName: this.userInfo.userName,
              mobile: this.userInfo.mobile
            })
          );
          this.chatLogin(res);
          socketInstance.init();
          this.chatInit(`{'user_uid':'${this.chatUserInfo.authed_info.user_uid}'}`);
          resolve();
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async mixinsCreateGroup(params: ICreateGroup): Promise<any> {
    try {
      return new Promise(
        async (resolve): Promise<void> => {
          let result = await createGroup(JSON.stringify(params));
          let { counterpartyNickname, otherUserUid, orderId } = JSON.parse(result.orderInfo);
          let chatObj = {
            historyType: '7',
            chatType: '2',
            historyTime: new Date().getTime() + '',
            lastOfflineContent: '',
            showCount: true,
            groupId: result.g_id,
            name: counterpartyNickname,
            headUrl: `${config.chatImg}&user_uid=${otherUserUid}`,
            orderId,
            userUid: otherUserUid
          };
          this.setChatList(chatObj);
          resolve(chatObj);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async mixinsItemClick(items: IChatMessageInfo | any, whence: string = ''): Promise<void> {
    let { groupId, name, orderId, userUid, chatType } = items;
    if (whence === 'c2c') {
      this.$router.replace({ query: { ...this.$route.query, n: name, g: groupId, u: userUid, t: chatType + '' } });
    } else if (whence === 'customerServer') {
      this.$router.push({ name: 'chat', query: { g: groupId, n: name, t: '3' } });
    } else {
      this.$router.push({ name: 'serve-chat', query: { g: groupId, n: name, o: orderId, u: userUid, t: chatType + '' } });
    }
    let offlineMessage: IOffline[] = await offlineMessagePersonalApi(
      `{"device":"2","user_uid":${this.chatUserInfo.authed_info.user_uid},"group_id":${groupId}}`
    );
    if (offlineMessage && offlineMessage.length) {
      let arr = offlineMessage.map(
        (item): IMessage => {
          return {
            'msg_content': item.msg_type === 7 ? JSON.parse(item.msg_content).msg + '' : item.msg_content + '',
            'user_uid': item.user_uid,
            'group_id': item.group_id,
            'history_time2': +item.history_time2,
            'msg_type': item.chat_type,
            'nickName': item.nickName,
            'fp': item.fingerP,
            'state': 'loading',
            'at': item.msg_type === 7 ? JSON.parse(item.msg_content).at : null
          };
        }
      );
      this.setMessageList(arr);
    }
  }
}
