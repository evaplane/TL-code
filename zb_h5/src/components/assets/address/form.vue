<template>
  <transition name="popup-bottom">
    <div class="popup-bottom address-form popup-add-address" v-if="visible">
      <div class="popup-head">
        <span @click="close" class="return-btn"></span>
        <h2>添加提币地址</h2>
      </div>
      <div @click="coinPickerVisible = true" class="select-wrap" v-if="mixinsWithdrawCoins.length">
        <span class="unchecked" v-if="!coinPickerText">请选择所属链</span>
        <span class="selection" v-else>{{ coinPickerText }}</span>
      </div>
      <div class="input-wrap">
        <div class="input-control">
          <input autocomplete="off" placeholder="_" type="text" v-model.trim="addAddressParams.address" />
          <span class="placeholder">{{
            mixinsCurrencyConfig.isUseMemo && mixinsCoinNameUp !== 'XRP' ? '账户' : '提币地址'
          }}</span>
        </div>
      </div>
      <template v-if="mixinsCurrencyConfig.isUseMemo">
        <div class="input-wrap">
          <div class="input-control">
            <input autocomplete="off" placeholder="_" type="text" v-model.trim="addressTag" />
            <span class="placeholder">{{ mixinsCoinNameUp === 'XRP' ? '标签（TAG）' : '备注（MEMO）' }}</span>
          </div>
        </div>
        <div class="use-tag" v-if="mixinsCoinNameUp === 'XRP'">
          是否使用标签（TAG）
          <div class="help">
            <i class="zb-icon icon-help"></i>
          </div>
          <m-switch :active-value="1" :inactive-value="0" v-model="addAddressParams.isMemoBoolean" />
        </div>
      </template>
      <div class="input-wrap">
        <div class="input-control">
          <input autocomplete="off" placeholder="_" type="text" v-model.trim="addAddressParams.memo" />
          <span class="placeholder">昵称</span>
        </div>
      </div>
      <div class="input-wrap" v-if="mixinsUserInfo.safePwd === 1">
        <div class="input-control">
          <input autocomplete="off" placeholder="_" type="text" v-model.trim="addAddressSafepwd" />
          <span class="placeholder">资金密码</span>
        </div>
      </div>
      <div class="input-wrap">
        <div class="input-control">
          <input autocomplete="off" placeholder="动态验证码" type="text" v-model.trim="addAddressParams.mobileCode" />
          <span class="placeholder">动态验证码</span>
        </div>
        <send-code
          :before-send="addressBeforeSendHandle"
          :captcha-params="{}"
          :send-params="addressSendCodeParams"
          ref="sendCode"
          text="点击获取"
        />
      </div>
      <div class="input-wrap">
        <div class="input-control">
          <input autocomplete="off" placeholder="Google验证码" type="text" v-model.trim="addAddressParams.googleCode" />
          <span class="placeholder">Google验证码</span>
        </div>
      </div>
      <div class="btn-wrap">
        <a @click="submit" class="btn btn-red" href="javascript:;">添加</a>
      </div>
      <van-popup get-container="body" position="bottom" safe-area-inset-bottom v-model="coinPickerVisible">
        <van-picker :columns="coinPickerData" @cancel="coinPickerVisible = false" @confirm="coinConfirmHandle" show-toolbar />
      </van-popup>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import mixinsAddressForm from '@/mixins/assets/currency-config';
import sendCode from '@/components/common/send-code/index.vue';
import { IDoAddBlockParams, doAddBlock } from '@/api/assets';
import mSwitch from '@/components/common/switch/index.vue';
import { Dialog, Picker as vanPicker } from 'vant';
import { encryptPwd } from '@/js/encode-pwd';
import { isNotEmpty } from '@/utils/is';

interface IAddressSendCodeParams {
  codeType: number;
  coin?: string;
  countryCode?: string;
  safePwd?: string;
}
@Component({
  components: {
    sendCode,
    mSwitch,
    vanPicker
  }
})
export default class AddressForm extends Mixins(mixinsAddressForm) {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: Function, default: null }) back!: Function;
  addressTag: string = '';
  addressSendCodeParams: IAddressSendCodeParams = {
    codeType: 1021,
    countryCode: ''
  };
  coinPickerVisible: boolean = false;
  coinPickerText: string = '';
  addAddressParams: IDoAddBlockParams = {
    coinName: '', // 	否	btc, eth	可获取指定币种的资产
    address: '', // 	是		接收地址(例如BTS系列address_tag) 如果没有tag isMemoBoolean为false
    isMemoBoolean: false, //	是		是否需要标签
    memo: '', // 	否		地址昵称
    safepwd: '', // 	是		资金安全密码
    mobileCode: '', // 	是		短信验证码
    googleCode: '', // 	否		Google验证码
    blockChain: ''
  };
  get coinPickerData(): string[] {
    if (isNotEmpty(this.mixinsWithdrawCoins) === true) {
      return this.mixinsWithdrawCoins.map(item => item.showName);
    }
    return [];
  }
  async addressBeforeSendHandle() {
    this.addressSendCodeParams.coin = this.mixinsCoinName;
    if (this.mixinsUserInfo.safePwd === 1) {
      if (!this.addAddressParams.safepwd) {
        this.$message.warn('请输入资金密码');
        return false;
      }
      this.addressSendCodeParams.safePwd = await encryptPwd(this.addAddressParams.safepwd);
      return true;
    }
    return true;
  }
  close() {
    this.coinPickerText = '';
    this.addAddressParams = {
      coinName: '', // 	否	btc, eth	可获取指定币种的资产
      address: '', // 	是		接收地址(例如BTS系列address_tag) 如果没有tag isMemoBoolean为false
      isMemoBoolean: false, //	是		是否需要标签
      memo: '', // 	否		地址昵称
      safepwd: '', // 	是		资金安全密码
      mobileCode: '', // 	是		短信验证码
      googleCode: '', // 	否		Google验证码
      blockChain: ''
    };
    // 返回上一层
    return this.back(-1);
  }
  coinConfirmHandle(showName: string, index: number) {
    this.coinPickerText = showName;
    this.coinPickerVisible = false;
    let item = this.mixinsWithdrawCoins[index];
    this.addAddressParams.blockChain = item.fatherFundsType + '';
  }
  validateBTS(address: string) {
    let errStr: string = '';
    let a, n, r, o;
    let length = address.length;
    if (!address || length === 0) {
      errStr = '账户不能为空';
    }
    if (length < 3 || length > 63) {
      errStr = 'BTS账号长度是3-62位';
    }
    for (/\./.test(address), o = address.split('.'), a = 0, r = o.length; a < r; a++) {
      n = o[a];
      if (!/^[~a-z]/.test(n)) {
        errStr = '账户必须以字母开头';
      }
      if (!/^[~a-zA-Z0-9-]*$/.test(n)) {
        errStr = '账户仅支持字母，数字或破折号';
      }
      if (/--/.test(n)) {
        errStr = '账户只能有一个破折号';
      }
      if (!/[a-z0-9]$/.test(n)) {
        errStr = '账户必须以字母或数字结尾';
      }
      if (!(n.length >= 1)) {
        errStr = '账户必须1位以上字符';
      }
    }
    if (errStr) {
      this.$message.fail(errStr);
      return false;
    }
    return true;
  }
  validateXRP() {
    let err: string = '';
    if (!this.addAddressParams.address) {
      err = '地址不能为空';
    } else if (!this.addAddressParams.isMemoBoolean) {
      if (!this.addressTag) {
        err = 'TAG不能为空';
      }
      if (!/^[0-9]*$/.test(this.addressTag)) {
        err = 'TAG必须是数字';
      }
      if (this.addressTag.length > 10) {
        err = 'TAG必须少于10位';
      }
    }
    if (err) {
      this.$message.fail(err);
      return false;
    }
    return true;
  }
  async submit() {
    try {
      let params = Object.assign({}, this.addAddressParams);
      if (this.mixinsWithdrawCoins.length > 0 && !this.addAddressParams.blockChain) {
        return this.$message.warn('请选择所属链');
      }
      if (this.mixinsCurrencyConfig.isUseMemo) {
        if (this.mixinsCoinNameUp === 'BTS') {
          if (this.validateBTS(params.address) === false) {
            return;
          }
        } else if (this.mixinsCoinNameUp === 'XRP') {
          if (this.validateXRP() === false) {
            return;
          }
        } else {
          if (!this.addAddressParams.address) {
            return this.$message.warn('账号不能为空');
          }
        }
      } else {
        if (!this.addAddressParams.address) {
          return this.$message.warn('地址不能为空');
        }
      }
      if (this.mixinsUserInfo.safePwd === 1 && !this.addAddressParams.safepwd) {
        return this.$message.warn('请填写资金安全密码');
      }
      if (!this.addAddressParams.mobileCode) {
        return this.$message.warn('请填写验证码');
      }
      if (this.mixinsUserInfo.googleAuth === 1 && !this.addAddressParams.googleCode) {
        return this.$message.warn('请填写Google验证码');
      }
      params.coinName = this.mixinsCoinName;
      if (this.mixinsCurrencyConfig.isUseMemo) {
        params.address += '_' + this.addressTag;
      }
      let res = await doAddBlock(params);
      if (res.resMsg.code === 1000) {
        Dialog.alert({ message: res.resMsg.message });
        // 重置
        this.addAddressParams = {
          coinName: '',
          address: '',
          isMemoBoolean: false,
          memo: '',
          safepwd: '',
          mobileCode: '',
          googleCode: '',
          blockChain: ''
        };
        this.addressTag = '';
        // 返回上层
        this.close();
      } else {
        this.$message.fail(res.resMsg.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss">
.popup-add-address {
  .select-wrap {
    font-size: 14px;
    color: #abaeb7;
    height: 48px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.05); /* no */
    border-radius: 4px; /* no */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    margin-bottom: 15px;
    position: relative;
    &::after {
      content: '';
      width: 0;
      height: 0;
      border-right: 3px solid transparent;
      border-left: 3px solid transparent;
      border-top: 3px solid #313038;
    }
    .selection {
      font-weight: 500;
      color: #313038;
    }
  }
  .use-tag {
    display: flex;
    align-items: center;
    color: #73767b;
    font-size: 14px;
    margin-bottom: 15px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.05); /* no */
    border-radius: 4px; /* no */
    height: 48px;
    padding: 0 15px;
    .icon-help {
      color: #bfc5cf;
    }
    .switch {
      margin-left: auto;
      @include dark {
        background-color: #dcdcdc !important;
      }
    }
  }
}
</style>
