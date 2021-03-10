import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import store from '@/store/store';
import { getUserInfoById } from '@/api/otc/user';
import { login } from '@/components/popup/index.ts';

@Component
export default class MixinsOtcGetUserToken extends Vue {
  @Getter('otcIsLogin', { namespace: 'otc' }) public mixinsOtcIsLogin!: boolean;
  @Getter('otcUserId', { namespace: 'otc' }) public mixinsOtcUserId!: string;
  @Getter('isLogin', { namespace: 'user' }) public mixinsZbIsLogin!: boolean;

  @Watch('mixinsZbIsLogin', { immediate: true })
  private isLoginWatch(isLogin: boolean): void {
    if (!isLogin && this.$route.meta.needLogin !== false) {
      // 当 zb 系统未登陆时，打开登录弹窗。未登录允许访问，需要在路由添加 meta { needLogin = false }
      login.open((): void => {
        // 关闭登录弹窗时，回到首页
        this.$router.push('/');
      });
      return;
    }

    if (isLogin && !this.mixinsOtcIsLogin) {
      store.dispatch('otc/getOtcUserToken');
    }
  }

  @Watch('mixinsOtcUserId', { immediate: true })
  private async getOtcUserInfo(mixinsOtcUserId: string): Promise<void> {
    if (this.mixinsOtcIsLogin) {
      try {
        let res = await getUserInfoById(mixinsOtcUserId);
        store.commit('otc/updateUserInfo', res);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
