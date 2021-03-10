<template>
  <div class="authentication-oversea">
    <div v-show="!secondStepVisible" class="oversea-container">
      <back title="__('海外用户认证')"></back>
      <native-scroll>
        <div class="oversea-form">
          <div class="oversea-item">
            <p class="label">__('证件地区')</p>
            <div class="select-wrap" :class="{ placeholder: !params.countryName }" @click="showPicker = true">
              <span>{{ params.conuntryCode ? `${params.conuntryCode} ${params.countryName}` : '__("请选择证件地区")' }}</span>
              <icon-arrow />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('名字')</p>
            <div class="input-wrap">
              <input v-model="params.firstName" type="text" placeholder="__('请输入你的名字')" />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('姓氏')</p>
            <div class="input-wrap">
              <input v-model="params.lastName" type="text" placeholder="__('请输入你的姓氏')" />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('证件号码')</p>
            <div class="input-wrap">
              <input v-model="params.doucumentNumber" type="text" placeholder="__('请输入你的证件号码')" />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('城市')</p>
            <div class="input-wrap">
              <input v-model="params.city" type="text" placeholder="__('请输入你的城市')" />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('详细地址')</p>
            <div class="input-wrap">
              <input v-model="params.streetAddress" type="text" placeholder="__('请输入你的详细地址')" />
            </div>
          </div>
          <div class="oversea-item">
            <p class="label">__('邮政编码')</p>
            <div class="input-wrap">
              <input v-model="params.postalCode" type="text" placeholder="邮政编码" />
            </div>
          </div>
        </div>

        <div class="oversea-btn">
          <button @click="nextStepClickHandle">__('下一步')</button>
        </div>
      </native-scroll>
    </div>

    <div v-show="secondStepVisible" class="oversea-container">
      <back title="__('上传身份信息')" close @close="secondStepVisible = false"></back>
      <native-scroll>
        <div class="upload-container">
          <div class="upload-item">
            <kyc-uploader v-model="params.loadImg" :default-bg="require('@img/user/zb-kyc-hand.svg')" />
            <p class="explain">__('手持本人护照个人信息页和个人签字')</p>
          </div>
          <div class="upload-certificate">
            <div class="upload-item">
              <kyc-uploader v-model="params.frontalImg" :default-bg="require('@img/user/zb-kyc-passport.svg')" />
              <p class="explain">__('护照个人信息页')</p>
            </div>

            <div class="upload-item">
              <kyc-uploader v-model="params.addressImg" :default-bg="require('@img/user/zb-kyc-address.svg')" />
              <p class="explain">__('住址证明')</p>
            </div>
          </div>
        </div>

        <div class="authentication-prompt">
          <div class="title">
            <i class="icon-prompt"></i>
            __('提示')
          </div>
          <div class="rules">
            <p>__('1.请提供有效的文件，假文件将导致您的账户冻结；')</p>
            <p>__('2.请确保上传的照片清晰可见；')</p>
            <p>__('3.它还要求你上传一张持有身份证件的照片和一张你的姓名、ZB.com和当前日期的手写便条；')</p>
            <p>
              __('4.地址文件的证明应报货您的姓名和地址。有效文件包括但不限于水、电、煤气账单、信用卡账单和政府机构在3个月内等级的证书。')
            </p>
          </div>
        </div>

        <div class="oversea-btn">
          <button @click="submitClickHanle">__('提交')</button>
        </div>
      </native-scroll>
    </div>

    <van-popup get-container="body" position="bottom" v-model="showPicker">
      <van-picker :columns="countryCodeList" @cancel="showPicker = false" @confirm="pickerConfirmHandle" show-toolbar />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import naviteScroll from '@/components/common/native-scroll/index.vue';
import kycUploader from '@/components/user/kyc-uploader.vue';
import { IOverseasAuthParams, doOverseasAuth } from '@/api/user';
import { getCountries } from '@/api/common';
import { Catch } from '@/utils/decorators';
import { Picker as vanPicker } from 'vant';
import { isEmpty } from '@/utils/is';

@Component({
  components: {
    back,
    naviteScroll,
    kycUploader,
    vanPicker
  }
})
export default class Oversea extends Vue {
  secondStepVisible: boolean = false;
  showPicker: boolean = false;

  countryCodeList: string[] = [];

  params: IOverseasAuthParams = {
    conuntryCode: '',
    countryName: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    doucumentNumber: '',
    loadImg: '',
    frontalImg: '',
    addressImg: '',
    postalCode: ''
  };

  @Catch()
  async getCountries(): Promise<void> {
    let { country } = await getCountries();
    if (country) {
      this.countryCodeList = country.map((item): string => {
        return item.code + ' ' + item.name;
      });
    }
  }

  async submitClickHanle(): Promise<void> {
    try {
      if (this.validateForm() && this.validateImg()) {
        await doOverseasAuth(this.params);
        this.$message.success('__("提交成功")');
        this.$router.replace({
          name: 'user-authentication-list'
        });
      }
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  pickerConfirmHandle(country: string) {
    let [conuntryCode, countryName] = country.split(' ');
    this.params.conuntryCode = conuntryCode;
    this.params.countryName = countryName;
    this.showPicker = false;
  }

  showWarn(msg: string) {
    this.$message.warn(msg);
    return false;
  }

  validateForm() {
    let { conuntryCode, firstName, lastName, streetAddress, city, doucumentNumber, postalCode } = this.params;
    if (isEmpty(conuntryCode)) {
      return this.showWarn('__("请选择证件地区")');
    }
    if (isEmpty(firstName)) {
      return this.showWarn('__("请输入名字")');
    }
    if (isEmpty(lastName)) {
      return this.showWarn('__("请输入姓氏")');
    }
    if (isEmpty(streetAddress)) {
      return this.showWarn('__("请输入证件号码")');
    }
    if (isEmpty(city)) {
      return this.showWarn('__("请输入城市")');
    }
    if (isEmpty(doucumentNumber)) {
      return this.showWarn('__("请输入详细地址")');
    }
    if (isEmpty(postalCode)) {
      return this.showWarn('__(""请输入邮政编码)');
    }
    return true;
  }

  validateImg() {
    let { loadImg, frontalImg } = this.params;
    if (isEmpty(loadImg)) {
      return this.showWarn('__("请上传手持本人护照个人信息页和个人签名")');
    }
    if (isEmpty(frontalImg)) {
      return this.showWarn('__("请上传护照个人信息页")');
    }
    return true;
  }

  nextStepClickHandle() {
    this.secondStepVisible = this.validateForm();
  }

  mounted() {
    this.getCountries();
  }
}
</script>

<style lang="scss">
.authentication-oversea {
  height: 100%;
  .oversea-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .oversea-form {
    padding: 6px 15px 0;
    margin-bottom: 72px;
  }
  .oversea-item {
    border-bottom: 1px solid var(--border-color); /* no */
    .label {
      padding: 7px 0;
      font-size: 13px;
      color: var(--new-theme-color-3);
    }
    .input-wrap {
      padding: 9px 0;
    }
    input,
    .select-wrap span {
      width: 100%;
      font-size: 16px;
      border: none;
      color: var(--heavy-color);
      line-height: normal;
      background: transparent;
      @include bold;
      &::-webkit-input-placeholder {
        color: var(--new-theme-color-c);
      }
    }

    .select-wrap {
      display: flex;
      justify-content: space-between;
      padding: 9px 0;
      color: var(--new-theme-color-c);
    }

    .select-wrap.placeholder span {
      color: var(--new-theme-color-c);
    }
  }

  .oversea-btn {
    padding: 10px 15px;
    button {
      width: 100%;
      height: 44px;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      color: #fff;
      background-color: var(--primary-color);
      @include bold;
    }
  }

  .upload-container {
    padding: 18px 15px;
    border-bottom: 8px solid var(--border-color);
    .upload-certificate {
      display: flex;
      justify-content: space-between;
      .upload-item {
        flex: 1;
        & + .upload-item {
          margin-left: 25px;
        }
      }
    }
    .explain {
      padding: 16px 0;
      text-align: center;
      color: var(--new-theme-color-3);
      font-size: 16px;
      @include bold;
    }
  }

  .authentication-prompt {
    padding: 0 15px;
    .icon-prompt {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      background: url('~@img/user/zbicon-prompt.svg') center no-repeat / contain;
    }
    .title {
      display: flex;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 13px;
      font-size: 16px;
      color: var(--new-theme-color-3);
      border-bottom: 1px solid var(--border-color); /* no */
      @include bold;
    }
    .rules {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 20px;
      color: var(--new-theme-color);
    }
  }
}
</style>
