import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import user from './modules/user';
import lang from './modules/lang';
import market from './modules/market';
import theme from './modules/theme';
import assets from './modules/assets';
import chat from './modules/chat';
import otc from './modules/otc';
import coins from './modules/coins';
import merchant from './modules/merchant';
import { getLocal } from '@/utils/storage';

interface IRootState {
  settingVisible: boolean;
}
Vue.use(Vuex);
const store: StoreOptions<IRootState> = {
  strict: true,
  state: {
    settingVisible: false
  },
  modules: {
    user,
    lang,
    market,
    theme,
    assets,
    chat,
    otc,
    coins,
    merchant
  },
  mutations: {
    updateSettingVisible(state, settingVisible: boolean): void {
      state.settingVisible = settingVisible;
    }
  },
  actions: {
    updateSettingVisible({ commit }, settingVisible: boolean): void {
      commit('updateSettingVisible', settingVisible);
    }
  }
};
const storeInstance = new Vuex.Store<IRootState>(store);
export default storeInstance;
storeInstance.dispatch('user/updateUser', getLocal('__user_info'));
