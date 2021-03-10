<template>
  <div class="set-phone-email-warp setting-panel" style="z-index:201;">
    <div class="setting-wrap">
      <div class="setting-head">
        <span class="head-return" @click="updateType(['info'])"></span>
        <h1 class="head-title">{{ title }}</h1>
      </div>
      <div class="setting-body">
        <native-scroll>
          <div class="setting-edit">
            <div class="edit-title">绑定邮箱</div>
            <div class="edit-item">
              <van-field v-model="email" direction="left" placeholder="邮箱地址" />
            </div>
            <div class="edit-item">
              <van-field v-model="emailCode" direction="left" placeholder="邮箱验证码">
                <template #append>
                  <send-code
                    :before-send="validateEmail"
                    :captcha-params="{}"
                    :send-params="{ codeType: 1005, email: email }"
                    text="__('获取验证码')"
                  /> </template
              ></van-field>
            </div>
            <div class="edit-item">
              <van-field v-model="mobileCode" direction="left" type="number" placeholder="手机验证码">
                <template #append>
                  <send-code
                    :captcha-params="{}"
                    :send-params="{ codeType: 1006 }"
                    text="__('获取验证码')"
                  />
                </template>
              </van-field>
            </div>
            <div class="edit-title" v-if="hasSafePwd || hasGoogle">安全验证</div>
            <div class="edit-item" v-if="hasSafePwd"><van-field v-model="safePwd" direction="left" placeholder="资金密码" /></div>
            <div class="edit-item" v-if="hasGoogle">
              <van-field v-model="googleCode" direction="left" type="number" placeholder="谷歌验证码" />
            </div>
            <div class="edit-button">
              <button @click="submit">确定</button>
            </div>
            <div class="setting-large-space"></div>
          </div>
        </native-scroll>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./set-email.ts" />

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
