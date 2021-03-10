import { Module } from 'vuex';
import { setLocal, getLocal } from '@/utils/storage';
type TTradingColor = 'default' | 'reverse';
interface IThemeState {
  theme: string;
  // 交易涨跌颜色
  tradingColor: TTradingColor;
}

const Theme: Module<IThemeState, any> = {
  namespaced: true,
  state: {
    theme: 'light',
    tradingColor: 'default'
  },
  getters: {
    theme (state): string {
      return state.theme;
    }
  },
  mutations: {
    updateTheme (state, theme: string): void {
      state.theme = theme;
    },
    updateTradingColor(state, tradingColor: TTradingColor): void {
      state.tradingColor = tradingColor;
    }
  },
  actions: {
    updateTheme({ commit }, theme: string): void {
      document.body.classList.remove(theme === 'light' ? 'dark' : 'light');
      document.body.classList.add(theme);
      setLocal('__theme_v1', theme);
      commit('updateTheme', theme);
    },
    checkTradingColor({ dispatch }): void {
      dispatch('updateTradingColor', getLocal('trade-color') || 'default');
    },
    updateTradingColor({ commit }, tradingColor: TTradingColor): void {
      document.body.dataset['tradeColor'] = tradingColor;
      setLocal('trade-color', tradingColor);
      commit('updateTradingColor', tradingColor);
    }
  }
};

export default Theme;
