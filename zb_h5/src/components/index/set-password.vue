<template>
  <div class="set-phone-email-warp setting-panel" style="z-index:201;">
    <div class="setting-wrap">
      <div class="setting-head">
        <span class="head-return" @click="updateType(['safe'])"></span>
        <h1 class="head-title">修改登录密码</h1>
      </div>
      <div class="setting-body">
        <native-scroll>
          <div class="setting-edit">
            <div class="edit-title">当前密码</div>
            <div class="edit-item">
              <van-field direction="left" placeholder="输入当前密码" />
            </div>
            <div class="edit-title">新的密码</div>
            <div class="edit-item">
              <van-field direction="left" placeholder="输入新的密码" />
            </div>
            <div class="edit-item">
              <van-field direction="left" placeholder="动态验证码">
                <template #append>
                  <send-code text="__('获取验证码')" /> </template
              ></van-field>
            </div>
            <div class="edit-item">
              <van-field direction="left" placeholder="谷歌验证码">
                <template #append>
                  <send-code text="__('获取验证码')" /> </template
              ></van-field>
            </div>
            <div class="edit-button">
              <button>确定</button>
            </div>
            <div class="setting-large-space"></div>
          </div>
        </native-scroll>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import sendCode from '@/components/common/send-code/index.vue';
@Component({
  components: {
    sendCode
  }
})
export default class SetPhoneEmail extends Vue { }

</script>

<style lang='scss'>
.set-phone-email-warp {
  .country {
    padding-left: 10px;
  }
  .get-code {
    padding-right: 10px;
  }
}
</style>
