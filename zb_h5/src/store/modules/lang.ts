import { Module } from 'vuex';
import { getCookie, setCookie } from '@/utils/storage';
import config from '@/config/index';
export type LangCode = 'cn' | 'en';
interface ILangState {
  lang: LangCode;
}
let env = config.environmentStr;
const Lang: Module<ILangState, any> = {
  namespaced: true,
  state: {
    lang: getCookie(env + 'lan').toString() || 'cn'
  },
  getters: {
    curLang (state): string {
      return state.lang;
    }
  },
  mutations: {
    updateLang (state, value: LangCode): void {
      setCookie(env + 'lan', value);
      state.lang = value;
    }
  },
  actions: {
    updateLang({ commit }, value: string): void {
      commit('updateLang', value);
    }
  }
};

export default Lang;
