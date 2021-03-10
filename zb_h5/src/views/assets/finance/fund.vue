<template>
  <native-scroll>
    <div class="finance-list">
      <div class="finance-item" @click="showPickerList('coins')">
        <span class="label">__('理财币种')</span>
        <div class="value">{{ currency }}</div>
      </div>
      <div class="finance-item">
        <!-- <span class="label">__('理财金额')</span>
        <div class="fill-input">
          <m-input
            itype="number"
            v-model="params.amount"
            placeholder="__('请输入理财金额')"
            v-if="!isEmpty(assets)"
            class="input"
            :max="assets.available"
          />
          <span class="placeholder" v-show="!params.amount">__('请输入理财金额')</span>
        </div> -->
        <m-input
          label="__('理财金额')"
          itype="number"
          v-model="params.amount"
          placeholder="__('请输入理财金额')"
          v-if="!isEmpty(assets)"
          :max="assets.available"
        />
      </div>
      <div class="finance-tips">
        __('可用') <span v-price="{ enable: hiding, value: fixDecimal(assets.available) }" v-if="!isEmpty(assets)" />
        {{ currency }}
      </div>
      <div class="finance-item">
        <m-input unit="%" itype="number" v-model="params.rate" label="__('收取利率')" placeholder="__('请输入收取利率')" :min="0.05" :max="0.2" />
      </div>
      <div class="finance-tips">__('利率范围'): 0.05% - 0.2%</div>
      <div class="finance-item" @click="showPickerList('time')">
        <span class="label">__('放款期限')</span>
        <div class="value">{{ time }}</div>
      </div>
      <div class="finance-item" style="margin-top: 20px;" v-if="userInfo.safePwd === 1 && showSafePwd">
        <span class="label">__('资金密码')</span>
        <div class="fill-input">
          <m-input type="password" v-model="params.oriSafePwd" placeholder="__('请输入资金密码')" class="input" />
          <span class="placeholder" v-show="!params.oriSafePwd">__('请输入资金密码')</span>
        </div>
      </div>
      <div class="finance-item" style="margin-top: 20px;">
        <span class="label">__('自动放贷')</span>
        <m-switch v-model="isLoop" />
      </div>
      <div class="finance-tips">
        <p>__('开启自动放贷，已收回贷款将自动挂单至杠杆资金池')</p>
        <p>__('您发布的理财单将自动挂单至杠杆资金池，成功借出后即可计算收益；')</p>
        <p>__('理财属于自担风险类型，平台将会收取每笔20%的理财收益作为手续费。')</p>
      </div>
      <div class="finance-btn">
        <button @click="submit">__('提交')</button>
      </div>
      <van-popup get-container="body" position="bottom" v-model="showPicker">
        <van-picker :columns="columns" :loading="!columns.length" @cancel="onCancel" @confirm="onConfirm" show-toolbar />
      </van-popup>
    </div>
  </native-scroll>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import mInput from '@/components/common/input/index';
import { Picker as vanPicker } from 'vant';
import { IGetLeverCoinsResList, IDoOutParams, doOut } from '@/api/lever';
import { IBalance } from '@/api/assets';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { encryptPwd } from '@/js/encode-pwd';
import { fixDecimal } from '@/utils/math';
import { isEmpty } from '@/utils/is';
import mSwitch from '@/components/common/switch/index.vue';

@Component({
  components: {
    mInput,
    vanPicker,
    mSwitch
  }
})
export default class Fund extends Vue {
  @Prop({ default: false, type: Boolean }) hiding!: boolean;
  @Prop({ default: () => [], type: Array }) leverCoins!: IGetLeverCoinsResList[];
  @Prop({ default: '', type: String }) currency!: string;
  @Prop({ default: () => ({}), type: Object }) assets!: IBalance;
  @State('userInfo', { namespace: 'user' }) public userInfo!: IUser;
  showPicker: boolean = false;
  columns: string[] = [];
  pickerType: string = '';
  time: string = '10' + '__("天")';
  showSafePwd: boolean = false;
  isEmpty = isEmpty;
  params: IDoOutParams = {
    amount: '',
    isLoop: 0,
    day: '',
    rate: '',
    loanCoin: ''
  };
  isLoop: boolean = false;
  onCancel() {
    this.showPicker = false;
  }
  onConfirm(val: string) {
    switch (this.pickerType) {
      case 'coins':
        this.changeCurrency(val);
        break;
      case 'time':
        this.time = val;
        break;
    }
    this.showPicker = false;
  }
  showPickerList(val: string) {
    this.showPicker = true;
    this.pickerType = val;
    switch (val) {
      case 'coins':
        this.columns = this.leverCoins.map(item => item.tag);
        break;
      case 'time':
        this.columns = ['10' + '__("天")', '20' + '__("天")', '30' + '__("天")'];
        break;
    }
  }
  @Emit()
  changeCurrency(val: string) {
    return val;
  }
  async submit() {
    try {
      let duration = {
        duration: 700
      };
      if (!Number(this.params.amount)) return this.$message.warn({ message: '__("请输入理财金额")', ...duration });
      if (!Number(this.params.rate)) return this.$message.warn({ message: '__("请输入利率")', ...duration });
      this.params.day = this.time.substr(0, 2);
      this.params.loanCoin = this.currency;
      this.params.isLoop = this.isLoop ? 1 : 0;
      if (this.userInfo.safePwd === 1) {
        this.showSafePwd = true;
        if (!Number(this.params.oriSafePwd)) return this.$message.warn({ message: '__("请输入资金密码")', ...duration });
        if (this.params.oriSafePwd) {
          this.params.safePwd = await encryptPwd(this.params.oriSafePwd);
        }
      }
      await doOut(this.params);
      this.$message.success('__("发布成功")');
      this.params.amount = '';
      this.params.rate = '';
      this.params.oriSafePwd = '';
      this.refresh();
    } catch (error) {}
  }
  @Emit()
  refresh() {}
  fixDecimal(val: number) {
    return fixDecimal(val, this.assets ? +this.assets.unitDecimal : 4);
  }
}
</script>
<style lang='scss'>
.finance-list {
  padding: 20px 15px;
  .finance-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 50px;
    background-color: var(--default-bg);
    @include dark {
      background-color: #25232d;
    }
    font-size: 14px;
    margin-bottom: 20px;
    border-radius: 4px;
    .label {
      color: var(--heavy-color);
      pointer-events: none;
      padding-left: 15px;
    }
    .value {
      display: flex;
      align-items: center;
      padding-right: 15px;
      color: var(--heavy-color);
      &::after {
        content: '';
        width: 8px; /* no */
        height: 8px; /* no */
        border-right: 2px solid var(--thin-color); /* no */
        border-top: 2px solid var(--thin-color); /* no */
        transform: rotate(45deg);
        margin-left: 5px;
      }
    }
    .switch {
      margin-right: 15px;
    }
    .fill-input {
      flex: 1;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      input {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        background-color: transparent;
        color: var(--heavy-color);
        font-size: 14px;
        text-align: right;
        font-weight: 500;
        -webkit-appearance: none;
      }
      .placeholder {
        color: var(--thin-color);
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }
      input:placeholder-shown::placeholder {
        color: transparent;
      }
      input:not(:placeholder-shown) + .placeholder {
        display: none;
      }
    }
  }
  .finance-tips {
    margin-top: -10px;
    padding: 0 15px 20px 15px;
    color: var(--thin-color);
    &.finance-tips-other {
      padding-left: 0;
      padding-right: 0;
    }
    p {
      line-height: 1.5;
      margin-top: 5px;
    }
  }
  .finance-btn {
    padding: 20px 0;
    button {
      width: 100%;
      height: 44px;
      font-size: 16px;
      color: #fff;
      background-color: var(--primary-color);
      border-radius: 2px; /* no */
      @include bold;
      border: none;
      outline: none;
    }
  }
}
</style>
