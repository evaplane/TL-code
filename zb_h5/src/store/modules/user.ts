import { Module } from 'vuex';
import { send, IWebsocketObserve } from '@/utils/websocket';
import { getUserInfo, actUserSignOut, notifyEntry } from '@/api/user';
import { IChatUserInfo, IAuthedInfo, IGroupInfo } from '@/api/chat';
import { setLocal, removeLocal } from '@/utils/storage';
import store from '../store';
let websocketObserve: IWebsocketObserve | null;
export interface IAssetsMarket {
  forEach: Function;
  available: string;
  canLoan: boolean;
  cnName: string;
  enName: string;
  freez: string;
  fundstype: number;
  isCanRecharge: boolean;
  isCanWithdraw: boolean;
  key: string;
  showName: string;
  unitDecimal: number;
  unitTag: string;
}
export interface IUser {
  headUrl?: string;
  nickName?: string;
  newVipLevel: number;
  apiStatus: number;
  appLoginTip: number;
  appPayTip: number;
  areaInfo: number;
  cardId: string;
  countryCode: string;
  email: string;
  emailAuth: number;
  googleAuth: number;
  isDepthPass: boolean;
  isManualCheck: number;
  isSimplePass: boolean;
  isSubUser: boolean;
  isVideoPass: boolean;
  lastTime: number;
  loginAuth: number;
  loginPwd: number;
  loginPwdLevel: number;
  mailing: number;
  mobile: string;
  mobileAuth: number;
  overseasAutoSave: boolean;
  payoutAuth: number;
  realAuth: number;
  realAuthFailReason: string;
  realAuthType: number;
  realName: string;
  registerTime: number;
  safePwd: number;
  safePwdLevel: number;
  snsPayTip: number;
  totalScore: string;
  tradeAuth: number;
  userId: string;
  userName: string;
  userType: number;
  vipLevel: number;
}

interface IUserState {
  userInfo: IUser;
  userAsset: IObj<IAssetsMarket>;
  chatUserInfo: IChatUserInfo;
  publicNoticeNum: number;
  systemNotfyNnm: number;
  first: boolean;
  activiryCenterNum: number;
}
export interface IUserAsset {
  [key: string]: IAssetsMarket;
}
interface IAssetsMarketList {
  channel: string;
  coins: IAssetsMarket[];
  dataType: string;
  usdtcny: string;
}
const user: Module<IUserState, any> = {
  namespaced: true,
  state: {
    userInfo: {
      newVipLevel: 0,
      apiStatus: 0,
      appLoginTip: 1,
      appPayTip: 1,
      areaInfo: 1,
      cardId: '',
      countryCode: '',
      email: '',
      emailAuth: 0,
      googleAuth: 0,
      isDepthPass: true,
      isManualCheck: 0,
      isSimplePass: true,
      isSubUser: false,
      isVideoPass: false,
      lastTime: 0,
      loginAuth: 0,
      loginPwd: 0,
      loginPwdLevel: 60,
      mailing: 0,
      mobile: '',
      mobileAuth: 0,
      overseasAutoSave: false,
      payoutAuth: 0,
      realAuth: 0,
      realAuthFailReason: '',
      realAuthType: 1,
      realName: '',
      registerTime: 0,
      safePwd: 0,
      safePwdLevel: 0,
      snsPayTip: 1,
      totalScore: '0.00',
      tradeAuth: 0,
      userId: '',
      userName: '',
      userType: 0,
      vipLevel: 0
    },
    userAsset: {},
    chatUserInfo: {
      // eslint-disable-next-line
      'authed_info': {} as IAuthedInfo,
      // eslint-disable-next-line
      groupInfo: {} as IGroupInfo
    },
    publicNoticeNum: 0,
    systemNotfyNnm: 0,
    activiryCenterNum: 0,
    first: true
  },
  getters: {
    isLogin(state): boolean {
      return !!state.userInfo.userId;
    },
    userInfo(state): any {
      return state.userInfo;
    },
    chatUserInfo(state): IChatUserInfo {
      return state.chatUserInfo;
    },
    chatIsLogin(state): boolean {
      return !!state.chatUserInfo.authed_info.user_uid;
    },
    unread(state): boolean {
      return !!state.publicNoticeNum || !!state.systemNotfyNnm || !!state.activiryCenterNum;
    }
  },
  mutations: {
    updateUser(state, info: IUser): void {
      Object.assign(state.userInfo, info);
      setLocal('__user_info', state.userInfo);
    },
    setAsset(state, obj: IUserAsset): void {
      state.userAsset = obj;
    },
    destroyedWebsocket(): void {
      websocketObserve && websocketObserve.unsubscribe(true);
      websocketObserve = null;
    },
    updateChatUser(state, info: IChatUserInfo): void {
      state.chatUserInfo = info;
    },
    getNewMsgSatus(state, obj): void {
      state.first = false;
      let { publicNoticeNum, systemNotfyNnm, activiryCenterNum } = obj;
      state.publicNoticeNum = publicNoticeNum;
      state.systemNotfyNnm = systemNotfyNnm;
      state.activiryCenterNum = activiryCenterNum;
    }
  },
  actions: {
    updateUser({ commit }, info: IUser): void {
      commit('updateUser', info);
    },
    userSignOut({ commit }): void {
      removeLocal('__user_info');
      commit('updateUser', {
        userName: '',
        userId: ''
      });
      // 重置资金
      store.dispatch('assets/resetAssets');
      // 退出 OTC 系统
      store.dispatch('otc/logout');
    },
    async doUserSignOut({ dispatch }): Promise<void> {
      dispatch('userSignOut');
      try {
        await actUserSignOut();
      } catch (err) {
        console.log(new Error(err));
      }
    },
    resetAssets({ commit }): void {
      commit('setAsset', {});
    },
    async getSocketUserAsset({ commit, state }): Promise<void> {
      websocketObserve = await send({
        binary: true,
        channel: `push_user_asset`,
        event: 'addChannel',
        isZip: true,
        userId: state.userInfo.userId || ''
      }, (instance): void => {
        instance.subscribe((res: IAssetsMarketList): void => {
          if (res) {
            let obj: IUserAsset = {};
            let ArrCoins = res.coins;
            ArrCoins.map((item): void => {
              obj[item.key] = item;
            });
            commit('setAsset', obj);
          }
        });
      });
    },
    userAssetUnsubscribe({ commit }): void {
      commit('destroyedWebsocket');
    },
    async getUserInfo({ commit, dispatch }): Promise<void> {
      try {
        let res = await getUserInfo();
        if (res.datas && res.datas.isLogin === false) {
          dispatch('doUserSignOut');
          return;
        }
        let { userInfo } = res.datas;
        commit('updateUser', userInfo);
      } catch (err) {
        console.log(err);
      }
    },
    chatLogin({ commit }, info: IChatUserInfo): void {
      commit('updateChatUser', info);
    },
    updateNewMsgSatus({ commit }, obj): void {
      commit('getNewMsgSatus', obj);
    },
    async getNewMsgSatus({ commit }): Promise<void> {
      let obj = await notifyEntry();
      commit('getNewMsgSatus', obj);
    }
  }
};

export default user;
