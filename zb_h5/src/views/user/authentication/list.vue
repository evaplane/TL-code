<template>
  <div class="authentication-list-page">
    <back title="__('实名认证')" />

    <ul class="authentication-list">
      <li v-if="!showUserInfo || userInfo.areaInfo === 1" v-hover:hover-active-list @click="goMainland">
        <label> <i class="icon icon-mainland" />__('大陆用户') </label>
        <div v-if="showUserInfo" class="val">
          __('已认证')
        </div>
        <div v-else class="val">
          __('去认证')
          <i class="icon icon-right" />
        </div>
      </li>
      <li v-if="!showUserInfo || userInfo.areaInfo === 5" v-hover:hover-active-list @click="go('user-authentication-oversea')">
        <label> <i class="icon icon-overseas" />__('海外用户（含港澳台）') </label>
        <div v-if="showUserInfo" class="val">
          __('已认证')
        </div>
        <div v-else class="val">
          __('去认证')
          <i class="icon icon-right" />
        </div>
      </li>

      <template v-if="showUserInfo">
        <li>
          <label>
            __('真实姓名')
          </label>
          <div class="val">
            {{ userInfo.realName }}
          </div>
        </li>
        <li class="mb-5">
          <label>
            __('证件号码')
          </label>
          <div class="val">
            {{ cardNumber }}
          </div>
        </li>
      </template>

      <li v-hover:hover-active-list @click="goVideoAuth">
        <label> <i class="icon icon-video" />__('视频认证') </label>
        <div class="val">
          <span v-if="!showUserInfo">__('请先进行以上认证')</span>
          <span v-if="isVideoPass">__('已认证')</span>
          <span v-if="showGoVideoAuth">__('去认证')</span>
          <i class="icon icon-right" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { Getter, Action } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { onVisibilityChange } from '@/utils/event';
import { ERealAuth } from '@/config/enums';

let offPageVisibleChange: Function | null = null;

@Component({
  components: {
    back
  }
})
export default class Authentication extends Vue {
  @Getter('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Action('getOtcUserToken', { namespace: 'otc' }) getOtcUserToken!: Function;
  @Action('getUserInfo', { namespace: 'user' }) getUserInfo!: Function;

  /**
   * 显示用户信息
   * 高级认证通过、视频认证审核中、视频认证通过、视频认证未通过
   */
  get showUserInfo() {
    return this.userInfo && (this.userInfo.realAuth === ERealAuth.HighAuthPass || this.userInfo.realAuth >= ERealAuth.VideoApply);
  }

  /**
   * 显示去认证
   * 高级认证通过、视频认证不通过
   */
  get showGoVideoAuth() {
    return this.userInfo && (this.userInfo.realAuth === ERealAuth.HighAuthPass || this.userInfo.realAuth === ERealAuth.VideoNotPass);
  }

  get isVideoPass() {
    return this.userInfo && this.userInfo.realAuth === ERealAuth.VideoPass;
  }

  /** 证件号码加敏 */
  get cardNumber() {
    const carId = this.userInfo.cardId;
    return carId.replace(/^(.{2})(?:\d+)(.{2})$/, '$1************$2');
  }

  /** 大陆用户认证 */
  goMainland() {
    if (this.showUserInfo) {
      return;
    }
    const router = this.$router.resolve({
      name: 'user-authentication-mainland'
    });
    window.open(router.href);
  }

  go(routerName: string) {
    if (this.showUserInfo) {
      return;
    }
    this.$router.push({
      name: routerName
    });
  }

  goVideoAuth() {
    if (this.showGoVideoAuth) {
      this.$message.warn('请您登录ZB App完成视频认证');
    }
  }

  updateUserInfo() {
    /** 同步用户信息 */
    this.getOtcUserToken();
    /** 更新本地用户信息 */
    this.getUserInfo();
  }

  mounted() {
    this.updateUserInfo();
    offPageVisibleChange && offPageVisibleChange();
    offPageVisibleChange = onVisibilityChange((isHide: boolean): void => {
      if (isHide === true) return;
      this.updateUserInfo();
    });
  }

  beforeDestroy() {
    offPageVisibleChange && offPageVisibleChange();
  }
}
</script>

<style lang="scss">
.authentication-list {
  padding: 0 var(--padding-lr);
  .mb-5 {
    margin-bottom: 5px;
  }
  li,
  label,
  .val {
    display: flex;
    align-items: center;
  }
  li {
    justify-content: space-between;
    padding: 14px 0;
    height: 60px;
    border-bottom: 1px solid var(--border-color);
  }
  label {
    font-size: 16px;
    color: var(--new-theme-color-3);
  }
  .icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    background: center no-repeat / contain;
    &.icon-mainland {
      background-image: url('~@img/user/zbicon-mainland.svg');
    }
    &.icon-overseas {
      background-image: url('~@img/user/zbicon-overseas.svg');
    }
    &.icon-video {
      background-image: url('~@img/user/zbicon-video.svg');
    }
    &.icon-right {
      width: 12px;
      margin-right: 0;
      background-image: url('~@img/user/zbicon-right.svg');
    }
  }
  .val {
    flex: 1;
    justify-content: flex-end;
    font-size: 14px;
    color: var(--new-theme-color);
  }
}
</style>
