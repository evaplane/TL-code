import { Module } from 'vuex';
import { getCurrencyConfig } from '@/api/common';
import { fetchCache } from '@/js/fetch-cache';
import { isNotEmpty } from '@/utils/is';

export interface ICurrencyConfigLinkCoinItem {
  showName: string; // "QC(QTUM 区块)"
  isPayIn: boolean;
  fundsType: number;
  coinName: string; // "qc"
}

export interface ICurrencyConfigWithdrawCoinsItem {
  fatherFundsType: number;
  isDefault: boolean;
  isOpen: boolean;
  name: string; // "qc"
  showName: string; // "QTUM链"
}
export interface ICurrencyConfig {
  blockUrl: string; // "https://explorer.qtum.org/address/"
  cnName: string; // "QC"
  enName: string; // "QC"
  fundesType: number; // 15
  isInnerTransfer: boolean;
  isPayIn: boolean;
  isPayOut: boolean;
  isSelectTag: boolean;
  isUseMemo: boolean;
  linkCoin: ICurrencyConfigLinkCoinItem[];
  minCash: string; // "0.10"
  showName: string; // "QC"
  tradeUrl: string; // "https://explorer.qtum.org/tx/"
  unitDecimal: number;
  withdrawCoins: ICurrencyConfigWithdrawCoinsItem[];
}

interface ICoinState {
  currencyConfig: ICurrencyConfig;
}
const getCurrencyConfigCache = fetchCache(getCurrencyConfig);
const currencyConfig: Module<ICoinState, any> = {
  namespaced: true,
  state: {
    // eslint-disable-next-line
    currencyConfig: {} as ICurrencyConfig
  },
  mutations: {
    updateCurrencyConfig(state, value: ICurrencyConfig): void {
      state.currencyConfig = value;
    }
  },
  actions: {
    async getCurrencyConfigByName({ dispatch }, name: string): Promise<ICurrencyConfig> {
      if (!name) {
        console.warn('name为空, 不能获取到指定配置');
        // eslint-disable-next-line
        return {} as ICurrencyConfig;
      }
      name = name.toString().toLowerCase();
      let res = await dispatch('updateCurrencyConfig');
      if (isNotEmpty(res) === true) {
        return res[name];
      }
      // eslint-disable-next-line
      return {} as ICurrencyConfig;
    },
    async updateCurrencyConfig({ commit }, isRefresh: boolean = false): Promise<IObj<ICurrencyConfig>> {
      let res = await getCurrencyConfigCache<IObj<ICurrencyConfig>>(isRefresh);
      commit('updateCurrencyConfig', res);
      return res;
    }
  }
};

export default currencyConfig;
