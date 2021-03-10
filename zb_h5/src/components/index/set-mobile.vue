<template>
  <div class="set-phone-email-warp setting-panel" style="z-index:201;">
    <div class="setting-wrap">
      <div class="setting-head">
        <span class="head-return" @click="updateType(['info'])"></span>
        <h1 class="head-title">{{ title }}</h1>
      </div>
      <div class="setting-body">
        <native-scroll>
          <div class="setting-edit" v-if="showVerifyInfo">
            <div class="credentials-wrap">
              <div class="credentials-tips">
                <p v-if="verifyInfo.status === 0">
                  {{ '您于$1提交了修改/遗失手机认证申请，我们会尽快为您审核。'.replace('$1', verifyInfo.addTimeShow) }}
                </p>
                <p v-else-if="[1, 3].indexOf(verifyInfo.status) > -1">
                  您提交的修改/遗失手机请求未通过审核，原因是: <b>{{ verifyInfo.memo }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="setting-edit" v-else>
            <template v-if="hasMobileAuth === true">
              <div class="current-info">
                <h3>已绑定手机号码</h3>
                <p>{{ userInfo.mobile }}</p>
              </div>
              <div class="edit-item">
                <van-field direction="left" v-model="oldMobileCode" type="phone" placeholder="旧手机验证码">
                  <template #append>
                    <send-code
                      :captcha-params="noCaptchaParams"
                      :send-params="{ codeType: 1010, countryCode: '' }"
                      text="__('获取验证码')"
                    />
                  </template>
                </van-field>
              </div>
            </template>
            <div class="edit-title">
              {{ hasMobileAuth ? '绑定新手机号码' : '绑定手机号码' }}
            </div>
            <div class="edit-item">
              <van-field v-model="newMobile" direction="left" type="phone" placeholder="新手机号码">
                <template #prepend>
                  <span @click="showPicker = true" class="country">
                    {{ mixinsDefaultCountryCode }}
                    <icon-arrow />
                  </span>
                </template>
              </van-field>
            </div>
            <div class="edit-item">
              <van-field v-model="newMobileCode" direction="left" type="number" :placeholder="hasMobileAuth ? '新手机验证码' : '手机号码'">
                <template #append>
                  <send-code
                    :before-send="beforeSend"
                    :captcha-params="noCaptchaParams"
                    :send-params="sendParams"
                    text="__('获取验证码')"
                  />
                </template>
              </van-field>
            </div>
            <div class="edit-item" v-if="hasEmailAuth">
              <van-field v-model="emailCode" direction="left" placeholder="邮箱验证码">
                <template #append>
                  <send-code
                    :before-send="beforeSend"
                    :captcha-params="noCaptchaParams"
                    :send-params="{ codeType: hasMobileAuth ? 1009 : 1008 }"
                    text="__('获取验证码')"
                  /> </template
              ></van-field>
            </div>
            <div class="edit-title" v-if="hasSafePwd || hasGoogle">安全验证</div>
            <div class="edit-item" v-if="hasSafePwd"><van-field v-model="safePwd" direction="left" placeholder="资金密码" /></div>
            <div class="edit-item" v-if="hasGoogle">
              <van-field v-model="googleCode" direction="left" type="number" placeholder="谷歌验证码" />
            </div>
            <template v-if="hasMobileAuth">
              <div class="edit-title">上传证件照</div>
              <div class="credentials-wrap">
                <upload v-model="filePath">
                  <div class="credentials-img" v-if="!filePath"><img src="@img/credentials.svg" /></div>
                </upload>
                <div class="credentials-tips">
                  <div class="tips-label"><span class="icon-tips"></span>提示</div>
                  <p>发起修改手机申请后，我们的客服人员会尽快审核。</p>
                  <p>照片要求：右手持身份证件，左手持带有zb.com、认证人签名、认证当天时间的证明文件；</p>
                  <p>图片格式：以.jpg.png格式结尾的图片，容量大小限制在2MB以内。</p>
                </div>
              </div>
            </template>
            <div class="edit-button">
              <button @click="submit">确定</button>
            </div>
            <div class="setting-large-space"></div>
          </div>
        </native-scroll>
      </div>
    </div>
    <van-popup get-container="body" position="bottom" v-model="showPicker">
      <van-picker
        :columns="mixinsCountryCodeList"
        :default-index="mixinsDefaultIndex"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script lang="ts" src="./set-mobile.ts" />

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
