import { Vue, Watch, Component } from 'vue-property-decorator';
import { login } from '@/components/popup/index';
import { Getter } from 'vuex-class';

@Component
export default class MixinsSignHooks extends Vue {
  @Getter('isLogin', { namespace: 'user' }) public mixinsIsLogin!: boolean;
  @Watch('mixinsIsLogin', { immediate: true })
  private isLoginWatch(isLogin: boolean): void {
    let self = (this as any);
    if (isLogin === true) {
      // 登录
      return self.signIn && self.signIn();
    }
    // 登出
    self.signOut && self.signOut();
  }
  public mixinsCheckLoginStatus(): boolean {
    if (this.mixinsIsLogin === false) {
      login.open();
      return false;
    }
    return true;
  }
}
/**
 * implements 接口
 * @export
 * @interface ISignHooks
 */
export interface ISignHooks {
  signIn(): void;
  signOut(): void;
}
