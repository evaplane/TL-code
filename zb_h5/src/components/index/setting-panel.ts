import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import entrancePopup from '@/components/popup/login.vue';
import { IUser } from '@/store/modules/user';
import mSwitch from '@/components/common/switch/index.vue';
import userInfo from './user-info.vue';
import setMobile from './set-mobile.vue';
import setEmail from './set-email.vue';
import safeSetting from './safe-setting.vue';
import setPassword from './set-password.vue';
export type TFormType = '' | 'email' | 'phone' | 'auth' | 'info' | 'safe' | 'password';
@Component({
  components: {
    mSwitch,
    safeSetting,
    setMobile,
    setEmail,
    entrancePopup,
    userInfo,
    setPassword
  }
})
export default class SettingPanel extends Vue {
  elParentNode: ParentNode | null = null;
  isOpen: boolean = false;
  isMoveToBody: boolean = false;
  themeType: boolean = false;
  conversionType: boolean = true;
  isUser: boolean = false;
  isSafe: boolean = false;
  isPhone: boolean = false;
  currencyType: string = 'rmb';
  formType: TFormType[] = [];
  @State('tradingColor', { namespace: 'theme' }) tradingColor!: string;
  @State('theme', { namespace: 'theme' }) theme!: string;
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Action('updateTheme', { namespace: 'theme' }) updateTheme!: Function;
  @Action('updateTradingColor', { namespace: 'theme' }) updateTradingColor!: Function;
  @Action('updateSettingVisible') updateSettingVisible!: Function;
  @State('settingVisible') settingVisible!: boolean;
  '$refs': {
    setting: HTMLDivElement;
  };
  @Watch('settingVisible')
  _() {
    this.$nextTick(() => {
      if (this.settingVisible === true) {
        if (this.isMoveToBody === false) {
          document.body.appendChild(this.$refs.setting);
          this.isMoveToBody = true;
        }
        window.setTimeout(() => {
          this.isOpen = true;
        }, 100);
      } else {
        this.isOpen = this.settingVisible;
      }
    });
  }
  showUserInfo() {
    this.formType = ['info'];
  }
  showSafeSetting() {
    this.formType = ['safe'];
  }
  tradeTypeChange(color: string) {
    this.updateTradingColor(color);
  }
  changeHandle() {
    this.updateTheme(this.theme === 'light' ? 'dark' : 'light');
  }
  mounted() {
    this.elParentNode = this.$el.parentNode;
    window.setTimeout(() => {
      this.themeType = this.theme === 'dark';
    }, 200);
  }
}
