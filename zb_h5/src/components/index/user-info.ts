import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import { TFormType } from './setting-panel';
import { Action, State } from 'vuex-class';
import { IUser } from '@/store/modules/user';

@Component
export default class UserInfo extends Vue {
  @State('userInfo', { namespace: 'user' }) readonly userInfo!: IUser;
  @Action('doUserSignOut', { namespace: 'user' }) readonly doUserSignOut!: Function;
  errorImg: any = require('@img/user.png');
  get authStatusText() {
    const { realAuth } = this.userInfo;
    if (realAuth === 0) {
      return '未提交';
    } else if ([1, 5, 8].indexOf(realAuth) > -1) {
      return '待审核';
    } else if ([2, 6, 9].indexOf(realAuth) > -1) {
      return '已通过';
    } else if ([3, 7, 10].indexOf(realAuth) > -1) {
      return '不通过';
    }
  }
  get vipLevel() {
    let { vipLevel, newVipLevel } = this.userInfo;
    return 'VIP' + Math.max(vipLevel, newVipLevel);
  }
  @Prop({ type: Array }) type!: TFormType[];
  @Emit('update:type')
  updateType(type: TFormType[]) {
    return type;
  }
  signOutHandle() {
    this.doUserSignOut();
    this.updateType([]);
  }
}
