import { Module } from 'vuex';
import { IOtcVipUserTokenResponse, getOtcUserToken, clearUserToken, IOtcUser } from '@/api/otc/user';
import { getSession, setSession, removeSession } from '@/utils/storage';
import { IOtcMarketResponse, getOtcMarket } from '@/api/otc/market';
import message from '@/components/common/message/index.ts';

const OTC_USER_SESSION_KEY = 'otc_user';
const OTC_MARKETS_SESSION_KEY = 'otc_markets';
const OTC_RELEASE_MARKET_SESSION_KEY = 'otc_release_market';
const otcUser: IOtcVipUserTokenResponse = getSession(OTC_USER_SESSION_KEY);
const otcMarkets: IOtcMarketResponse[] = getSession(OTC_MARKETS_SESSION_KEY);
const releaseAdMarket: IOtcMarketResponse | null = getSession(OTC_RELEASE_MARKET_SESSION_KEY) || null;

interface IOtcState {
  user: IOtcVipUserTokenResponse;
  userInfo: IOtcUser | null;
  otcMarkets: IOtcMarketResponse[];
  releaseAdMarket: IOtcMarketResponse | null;
}

const Otc: Module<IOtcState, any> = {
  namespaced: true,
  state: {
    user: otcUser || {
      otcUserId: '',
      otcUserToken: ''
    },
    userInfo: null,
    otcMarkets: otcMarkets || [],
    releaseAdMarket: releaseAdMarket
  },
  getters: {
    otcIsLogin(state): boolean {
      return !!(state.user.otcUserId && state.user.otcUserToken);
    },
    user(state): IOtcVipUserTokenResponse {
      return state.user;
    },
    otcUserId(state): string {
      return state.user.otcUserId;
    },
    otcUserToken(state): string {
      return state.user.otcUserToken;
    },
    otcUserInfo (state): IOtcUser | null {
      return state.userInfo;
    },
    otcMarkets (state): IOtcMarketResponse[] {
      return state.otcMarkets;
    },
    releaseAdMarket(state): IOtcMarketResponse | null {
      return state.releaseAdMarket;
    }
  },
  mutations: {
    updateUser(state, user: IOtcVipUserTokenResponse): void {
      state.user = Object.assign(state.user, user);
      setSession(OTC_USER_SESSION_KEY, state.user);
    },
    updateUserInfo(state, userInfo: IOtcUser): void {
      state.userInfo = state.userInfo ? Object.assign(state.userInfo, userInfo) : userInfo;
    },
    clearUserToken(state): void {
      state.user = {
        otcUserId: '',
        otcUserToken: ''
      };
      removeSession(OTC_USER_SESSION_KEY);
    },
    updateOtcMarkets(state, otcMarkets: IOtcMarketResponse[]): void {
      state.otcMarkets = otcMarkets;
      setSession(OTC_MARKETS_SESSION_KEY, state.otcMarkets);
    },
    updateReleaseAdMarket(state, market: IOtcMarketResponse | null): void {
      state.releaseAdMarket = market;
      market ? setSession(OTC_RELEASE_MARKET_SESSION_KEY, market) : removeSession(OTC_RELEASE_MARKET_SESSION_KEY);
    }
  },
  actions: {
    async getOtcUserToken({ rootGetters, commit }): Promise<void> {
      if (rootGetters['user/isLogin']) {
        try {
          let res = await getOtcUserToken();
          commit('updateUser', res);
        } catch (error) {
        }
      }
    },
    clearUserToken({ commit }): void {
      commit('clearUserToken');
    },

    async logout({ dispatch }): Promise<void> {
      try {
        await clearUserToken();
      } catch (error) {
      }
      dispatch('clearUserToken');
    },

    releaseAdSuccess({ commit }): void {
      commit('updateOtcMarkets', []);
      commit('updateReleaseAdMarket', null);
    },

    async getOtcMarkets({ commit }): Promise<void> {
      try {
        const markets = await getOtcMarket();
        commit('updateOtcMarkets', markets);
      } catch (err) {
        if (err.resMsg) {
          message.fail(err.resMsg.message);
        }
      }
    }
  }
};

export default Otc;
