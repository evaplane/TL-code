import { Module } from 'vuex';
import { reqGetBusinessUser, IOtcBusinessUser } from '@/api/otc/business-user';

const merchant: Module<any, any> = {
  namespaced: true,
  state: {
    merchant: {}
  },
  getters: {
    judgeUserIdentity(state): string {
      if (!state.merchant) return '0';
      if (state.merchant.userType === 1 && state.merchant.businessType === 0) return '1';
      if (state.merchant.userType === 1 && state.merchant.businessType === 1) return '2';
      return '0'; // 0用户 1普通商家 2认证商家
    },
    jumpMerchantUrl(state): string {
      if ((state.merchant.checkStatus === 6 || state.merchant.checkStatus === 2 || state.merchant.checkStatus === 0) && state.merchant.userType === 1 && state.merchant.businessType === 0) {
        return 'ordinary-business';
      }

      if ((state.merchant.checkStatus === 5 || state.merchant.checkStatus === 3) && state.merchant.userType === 1 && state.merchant.businessType === 1) {
        return 'apply-authentication-business';
      }

      if (state.merchant.checkStatus === 4 || state.merchant.checkStatus === 1) {
        return 'business-await';
      }
      return 'apply-ordinary-business';
    }
  },
  mutations: {
    merchantInfo(state, merchantInfo: IOtcBusinessUser): void {
      state.merchant = merchantInfo;
    }
  },
  actions: {
    async getMerchantInfo({ commit }): Promise<void> {
      try {
        let merchantInfo = await reqGetBusinessUser(true);
        commit('merchantInfo', merchantInfo);
      } catch (e) {
      }
    }
  }
};

export default merchant;
