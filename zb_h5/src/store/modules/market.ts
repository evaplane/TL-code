import { Module } from 'vuex';
import { getExchangeRate, IRate } from '@/api/market';
import { isNotEmpty } from '@/utils/is';
import { getMarketConfig, IMarketInfo } from '@/api/trade';
import { fetchCache } from '@/js/fetch-cache';

export const defaultMarketInfo: IMarketInfo = {
  cShowName: '',
  canGoingLong: false,
  canGoingShort: false,
  coinDecimal: 0,
  depth: [],
  display: false,
  exchangeBi: '',
  fShowName: '',
  forceRepayRate: 0,
  fundsType: 0,
  group: 0,
  isLever: false,
  isOpenLoan: false,
  leverMultiple: 0,
  maxBorrowCoin: 0,
  maxBorrowMoney: 0,
  maxEntrustCoin: 0,
  maxPlanCoin: 0,
  maxPlanMoney: 0,
  maxPrice: 0,
  moneyDecimal: 0,
  noticeRate: 0,
  numberBi: '',
  openTime: 0,
  priceProtect: 0,
  showName: ''
};
let rateTask: Function[] = [];

interface IMarketState {
  rate: IRate;
  marketConfigList: IObj<IMarketInfo>;
}
interface IProfileMarketInfo {
  [key: string]: IMarketInfo;
}
const getMarketConfigCache = fetchCache(getMarketConfig);
const Market: Module<IMarketState, any> = {
  namespaced: true,
  state: {
    rate: {
      btccny: '',
      usdtcny: '',
      qccny: '',
      tickers: []
    },
    marketConfigList: {
      'btc_usdt': defaultMarketInfo
    }
  },
  mutations: {
    updateMarket(state, value: IObj<IMarketInfo>): void {
      if (isNotEmpty(value) === true) {
        state.marketConfigList = value;
      }
    },
    updateRate(state, value: IRate): void {
      value.usdtcny = Number(value.usdtcny) > 0 ? value.usdtcny : '7';
      state.rate = value;
    }
  },
  actions: {
    async getMarketInfo({ commit }, isRefresh: boolean = false): Promise<IProfileMarketInfo | null> {
      try {
        let marketInfo: IProfileMarketInfo = await getMarketConfigCache<IProfileMarketInfo>(isRefresh);
        commit('updateMarket', marketInfo);
        return marketInfo;
      } catch (err) {
        return null;
      }
    },
    async getMarketInfoByName ({ dispatch }, opts: { name: string; isLever?: boolean }): Promise<IMarketInfo | null> {
      const { name, isLever } = opts;
      const marketConfig: IProfileMarketInfo = await dispatch('getMarketInfo');
      if (marketConfig === null) {
        // Vue.prototype.$message.fail('__("获取数据异常")');
        return null;
      }
      if (name in marketConfig) {
        let info = marketConfig[name];
        if (isLever === true && info.isLever !== true) {
          // Vue.prototype.$message.fail('__("市场不存在")');
          return defaultMarketInfo;
        }
        return info;
      } else {
        // Vue.prototype.$message.fail('__("市场不存在")');
      }
      return defaultMarketInfo;
    },
    async getRate({ commit, state }, isRefresh: boolean = false): Promise<IRate> {
      return new Promise(async (resolve, reject): Promise<any> => {
        if (isNotEmpty(state.rate.usdtcny) === true) {
          if (isRefresh === false) {
            resolve(state.rate);
            return;
          }
        }
        if (rateTask.length === 0) {
          getExchangeRate({ group: 'all' }).then((res: IRate): void => {
            commit('updateRate', res);
            let task = null;
            while ((task = rateTask.shift())) {
              task(res);
            }
          }).catch((err): void => {
            rateTask = [];
            reject(err);
          });
        }
        rateTask.push(resolve);
      });
    }
  }
};
export default Market;
