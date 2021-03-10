<template>
  <div class="security-box">
    <back title="__('安全中心')"/>
    <scroll>
      <div class="security-box-container">
        <safety/>
        <div class="line"></div>
        <ul>
          <li @click="toPath('password', 'login')">
            <span>
              <i class="zbicon-logpw"></i>__('登录密码')
            </span>
            <span>
              {{ pwdLever(userInfo.loginPwdLevel) }}
              <i class="zbicon-right"></i>
            </span>
          </li>
          <li @click="safePwdJudge">
            <span>
              <i class="zbicon-assetspw"></i>__('资金密码')
            </span>
            <i class="zbicon-right"></i>
          </li>
          <li @click="google = true">
            <span>
              <i class="zbicon-google"></i>__('Google认证码')
            </span>
            <i class="zbicon-right"></i>
          </li>
        </ul>
        <div class="line"></div>
        <ul>
          <li @click="toPath('set-login','login')">
            <span>
              <i class="zbicon-logintactics"></i>__('登录验证策略设置')
            </span>
            <i class="zbicon-right"></i>
          </li>
          <li @click="toPath('set-trade','trade')">
            <span>
              <i class="zbicon-tradetactics"></i>__('交易验证策略设置')
            </span>
            <i class="zbicon-right"></i>
          </li>
          <li @click="toPath('set-pay', 'pay')">
            <span>
              <i class="zbicon-paytactics"></i>__('提现/支付策略设置')
            </span>
            <i class="zbicon-right"></i>
          </li>
        </ul>
        <div class="line"></div>
        <ul class="log">
          <li>
            <span>__('安全日志')</span>
          </li>
          <template v-if="log.length">
            <li :key="item.id" v-for="item in log">
              <div>
                <p>{{item.describe}}</p>
                <span>{{item.date | date}}</span>
              </div>
              <span>{{item.city|| '--'}}</span>
            </li>
          </template>
          <empty-data :visible="!log.length"/>
        </ul>
      </div>
    </scroll>
    <van-action-sheet
      :actions="googleMenuStatus"
      :title="googleTitle"
      @cancel="onCancel('google')"
      @select="googleChange"
      cancel-text="__('取消')"
      v-model="google"
    />
    <component :google-type="googleType" :is="checkComp" @close="close" @handle="handel"></component>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import safety from '@/components/index/safety.vue';
import { State, Action } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { getSafeLog, ILog, doSetGoogleAuth, IDoSetGoogleAuthParams } from '@/api/user';
import emptyData from '@/components/common/no-data.vue';

interface IParams {
  dynamicCode: string;
  googleCode: string;
}

interface IMenuInfo {
  name: string;
  type: string;
}

@Component({
  components: {
    back,
    safety,
    emptyData
  }
})
export default class Security extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  @Action('getUserInfo', { namespace: 'user' }) getUserInfo!: Function
  log: ILog[] = []
  checked: boolean = false
  google: boolean = false
  checkComp: any = null
  checkName: string = ''
  googleType: string = ''
  googleMenu: IMenuInfo[] = [
    { name: '__("添加")', type: 'add' },
    { name: '__("修改")', type: 'edit' },
    { name: '__("关闭")', type: 'close' }
  ]
  mounted() {
    this.getSafeLog();
  }

  toPath(name: string, params: string = '') {
    if (params) {
      this.$router.push({ name, params: { type: params } });
    } else {
      this.$router.push({ name });
    }
  }
  safePwdJudge() {
    if (this.userInfo.safePwd === 1) {
      return this.toPath('password', 'safe');
    }
    this.toPath('safepwd');
  }

  pwdLever(num: number) {
    if (num <= 33) {
      return '__("弱")';
    }
    if (num > 33 && num <= 66) {
      return '__("中")';
    }
    if (num > 66) {
      return '__("强")';
    }
  }
  async getSafeLog() {
    let { safeLogs } = await getSafeLog({
      type: 1,
      pageIndex: '1',
      pageSize: '5'
    });
    this.log = safeLogs;
  }
  get googleMenuStatus() {
    let type = this.userInfo.googleAuth;
    return this.googleMenu.filter((item) => {
      if (type === 0) {
        return item.type === 'add';
      }
      if (type === 1) {
        return ['edit', 'close'].includes(item.type);
      }
      return item;
    });
  }
  get googleTitle() {
    let titles: IObj<string> = {
      '0': '__("请先添加谷歌验证")',
      '1': '__("您已设置谷歌认证")',
      '2': '__("修改失败")',
      '-1': '__("修改审核中")'
    };
    return titles[this.userInfo.googleAuth + ''] || '';
  }
  close() {
    this.checkComp = null;
  }
  async googleChange(name: IMenuInfo) {
    this.googleType = name.type;
    this.google = false;
    switch (name.type) {
      case 'add':
        const WebpackModuleAdd = await import(/* webpackChunkName: 'check-component' */ '@/components/index/google-code.vue');
        this.checkComp = WebpackModuleAdd.default;
        break;
      case 'edit':
        const WebpackModuleEdit = await import(/* webpackChunkName: 'check-component' */ '@/components/index/google-code.vue');
        this.checkComp = WebpackModuleEdit.default;
        break;
      case 'close':
        this.checkName = 'googleClose';
        const WebpackModuleClose = await import(/* webpackChunkName: 'check-component' */ '@/components/index/check.vue');
        this.checkComp = WebpackModuleClose.default;
        break;
    }
  }
  async googleClose(params: IDoSetGoogleAuthParams) {
    try {
      await doSetGoogleAuth(params);
      this.init();
    } catch (err) {
      console.error(err);
    }
  }
  handel(params: IParams) {
    switch (this.checkName) {
      case 'googleClose':
        this.googleClose({
          ...params,
          type: 0
        });
        break;
      default:
        this.init();
        break;
    }
  }
  async init() {
    this.checkComp = null;
    this.google = false;
    this.getUserInfo();
    this.$message.success('__("成功")');
  }
  onCancel(name: string): void {
    (this as any)[name] = false;
  }
}
</script>
<style lang='scss'>
.security-box {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--default-bg);
  color: var(--theme-color);
  height: 100%;
  display: flex;
  flex-direction: column;
  %color {
    background: var(--default-bg);
    color: var(--theme-color);
  }
  ul {
    > li {
      display: flex;
      justify-content: space-between;
      padding: var(--padding-lr);
      margin: 0 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;

      span {
        line-height: 30px;
      }
      > span:first-child {
        i {
          margin-right: 10px;
          font-size: 18px;
        }
      }
      > span:last-child {
        i {
          display: inline-block;
        }
      }
      > i:last-child {
        margin-top:6px;
      }
      .van-dropdown-menu {
        @extend %color;
        height: 30px;
        margin-right: var(--padding-lr);
        .van-icon-success {
          color: var(--primary-color) !important;
        }
      }
      .van-dropdown-menu__title {
        font-size: 14px;
      }
      .van-cell:not(:last-child)::after {
        border-color: var(--border-color);
      }
      border-bottom: 1px solid var(--border-color);
      [class*='van-hairline']::after {
        border-color: var(--border-color);
      }
      .van-cell__title[style*='color'] {
        color: var(--primary-color) !important;
      }
      .van-dropdown-menu__title--down {
        color: var(--primary-color) !important;
      }
    }
  }
  .log {
    li:first-child {
      span {
        font-size: 18px;
      }
    }
    li {
      div {
        line-height: 18px;
        width: 50%;
        p {
          text-indent: 15px;
        }
      }
    }
  }
  .van-action-sheet__header {
    font-size: 14px;
  }
}
</style>
