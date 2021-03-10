import { Module } from 'vuex';
import { getSpotAssets, ISpotAssets, ICoinAddressItem } from '@/api/assets';
import { ILeverTypes, getLeverList, ILeverDataTypes } from '@/api/lever';
import { setLocal, getLocal } from '@/utils/storage';
import { IMortgageList, getMortgageAssetsList } from '@/api/mortgage';
import { getFundList, IFundAsset } from '@/api/activity';
import { fetchCache } from '@/js/fetch-cache';

export interface ICoinItemInfo {
  key: string;
  coinUnitName: string;
  freeze: string;
  available: string;
  availableConverted: string;
  fundsType?: string | number;
  isCanWithdraw?: boolean;
  isCanRecharge?: boolean;
  isCanTransfer?: boolean;
}

interface IAssetsState {
  spotAssets: ISpotAssets;
  leverAssets: ILeverTypes;
  mortgageAssets: IMortgageList;
  fundAssets: IFundAsset;
  assetsVisible: boolean;
  addressItem: ICoinAddressItem | null;
  searchList: ICoinItemInfo[];
  leverList: ILeverDataTypes[];
}

export interface IUpdateAddressItem {
  (item: ICoinAddressItem | null): void;
}

export interface IGetAssetsFunction {
  /** isForcedRefresh 是否强制重新请求数据 */
  (isForcedRefresh?: boolean): Promise<any>;
}
const getSpotAssetsCache = fetchCache(getSpotAssets),
  getFundListCache = fetchCache(getFundList),
  getMortgageAssetsListCache = fetchCache(getMortgageAssetsList),
  getLeverListCache = fetchCache(getLeverList);
const assets: Module<IAssetsState, any> = {
  namespaced: true,
  state: {
    leverAssets: {
      netAsset: '--',
      totalAsset: '--',
      totalLoanOut: '--',
      levers: []
    },
    spotAssets: {
      totalAsset: '--',
      useZBPayTransFee: 0,
      balances: []
    },
    mortgageAssets: {
      totalInRmb: '--',
      totalInUsd: '--',
      assets: []
    },
    fundAssets: {
      totalAsset: '--',
      balances: []
    },
    assetsVisible: getLocal('__assets-visible') || true,
    addressItem: null,
    searchList: [],
    leverList: []
  },
  getters: {},
  mutations: {
    resetAssets(state): void {
      state.leverAssets = {
        netAsset: '--',
        totalAsset: '--',
        totalLoanOut: '--',
        levers: []
      };
      state.spotAssets = {
        totalAsset: '--',
        useZBPayTransFee: 0,
        balances: []
      };
      state.mortgageAssets = {
        totalInRmb: '--',
        totalInUsd: '--',
        assets: []
      };
      state.fundAssets = {
        totalAsset: '--',
        balances: []
      };
    },
    resetUserAddress(state): void {
      state.addressItem = null;
    },
    spotAssets(state, info: ISpotAssets): void {
      state.spotAssets = info;
    },
    leverAssets(state, obj: ILeverTypes): void {
      state.leverAssets = obj;
    },
    mortgageAssets(state, obj: IMortgageList): void {
      state.mortgageAssets = obj;
    },
    fundAssets(state, obj: IFundAsset): void {
      state.fundAssets = obj;
    },
    updateAssetsVisible(state, visible: boolean): void {
      setLocal('__assets-visible', visible);
      state.assetsVisible = visible;
    },
    updateAddressItem(state, item: ICoinAddressItem | null): void {
      state.addressItem = item;
    },
    updateSearchList(state, searchList: ICoinItemInfo[]): void {
      state.searchList = searchList;
    },
    updateLeverList(state, leverList: ILeverDataTypes[]): void {
      state.leverList = leverList;
    }
  },
  actions: {
    resetAssets({ commit }): void {
      commit('resetAssets');
      commit('resetUserAddress');
    },
    async getLeverAssets({ commit }, isForcedRefresh: boolean = false): Promise<void> {
      try {
        let leverAssets = await getLeverListCache<ILeverTypes>(isForcedRefresh);
        commit('leverAssets', leverAssets);
      } catch (e) {}
    },
    async getSpotAssets({ commit }, isForcedRefresh: boolean = false): Promise<void> {
      try {
        let result = await getSpotAssetsCache<ISpotAssets>(isForcedRefresh);
        if (result) commit('spotAssets', result);
      } catch (e) {}
    },

    async getMortgageAssets({ commit }, isForcedRefresh: boolean = false): Promise<void> {
      try {
        let res = await getMortgageAssetsListCache<IMortgageList>(isForcedRefresh);
        if (res) commit('mortgageAssets', res);
      } catch (e) {}
    },
    async getFundAsset({ commit }, isForcedRefresh: boolean = false): Promise<void> {
      try {
        let res = await getFundListCache<IFundAsset>(isForcedRefresh);
        if (res) commit('fundAssets', res);
      } catch (e) {}
    },

    updateAssetsVisible({ commit }, visible: boolean): void {
      commit('updateAssetsVisible', visible);
    },
    updateAddressItem({ commit }, item: ICoinAddressItem | null): void {
      commit('updateAddressItem', item);
    },
    updateSearchList({ commit }, searchList: ICoinItemInfo[]): void {
      commit('updateSearchList', searchList);
    },
    updateLeverList({ commit }, leverList: ILeverDataTypes[]): void {
      commit('updateLeverList', leverList);
    }
  }
};

export default assets;
