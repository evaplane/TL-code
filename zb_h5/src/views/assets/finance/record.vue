<template>
  <div class="finance-record" v-loading="loading">
    <div class="record-filter">
      <span @click="showPickerList('coins')">{{ currency }}</span>
      <span @click="showPickerList('type')">{{ filterType }}</span>
    </div>
    <div class="record-list">
      <no-data :visible="!list.length && !loading" />
      <native-scroll
        virtual-scroll
        :data="list"
        @scroll-end="pullup"
        pulldown
        @refresh="pulldown"
        pullup
        v-if="list.length && !loading"
      >
        <template #virtual="{ data }">
          <div class="record-item" @click="$router.push({ name: 'finance-record-list', query: { id: data.id, coin: currency } })">
            <div class="record-item-title">
              <div class="record-item-title_left">
                <img :alt="currency.substr(0, 1)" v-icon="`./img/coins/${currency.toLowerCase()}.svg`" />
                <span v-price="{ enable: hiding, value: data.amount }" /> {{ currency }}
              </div>
              <div class="record-item-title_right">{{ data.createTime | date('YYYY-MM-DD hh:mm') }}</div>
            </div>
            <div class="record-item-content">
              <dl class="record-item-content_column">
                <dt>__('借出')</dt>
                <dd v-price="{ enable: hiding, value: data.hasAmount }" />
              </dl>
              <dl class="record-item-content_column">
                <dt>__('利率')</dt>
                <dd>{{ multiply(data.interestRateOfDay, 100) }}%</dd>
              </dl>
              <dl class="record-item-content_column">
                <dt>__('期限')</dt>
                <dd>{{ data.repaymentDay }}__('天')</dd>
              </dl>
              <dl class="record-item-content_column">
                <dt>__('累计收益')</dt>
                <dd v-price="{ enable: hiding, value: data.totalIncome }" />
              </dl>
            </div>
            <div class="record-item-handle">
              <a
                class="cancel-btn"
                href="javascript:;"
                v-if="data.status === 0 || data.status === 1"
                @click.stop="cancelOut(data)"
                >__('取消放贷')</a
              >
              <span v-if="data.status === 2" class="state cancel">__('已取消')</span>
              <span v-if="data.status == 3 && data.hasAmount == data.amount" class="state success">__('已成功')</span>
              <span v-if="data.status == 3 && data.amount > data.hasAmount" class="state part-success">__('部分成功')</span>
              <div class="record-item-handle_right" @click.stop="noop" v-if="data.canChangeLoop">
                <span>__('自动放贷')</span>
                <m-switch v-model="data.isLoop" @change="changeLoop(data)" :disable="!data.canChangeLoop" />
              </div>
            </div>
          </div>
        </template>
      </native-scroll>
    </div>
    <van-popup get-container="body" position="bottom" v-model="showPicker">
      <van-picker :columns="columns" :loading="!columns.length" @cancel="onCancel" @confirm="onConfirm" show-toolbar />
    </van-popup>
    <help-dialog
      :visible.sync="cancelLoanVisible"
      @confirm="cancelLoan"
      cancel-button-text="__('返回')"
      confirm-button-text="__('确认')"
      message="__('确定取消这笔理财')"
      v-if="cancelLoanVisible"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { Picker as vanPicker } from 'vant';
import { getLoanLists, IGetLeverCoinsResList, IGetLoanListParams, IGetLoanListResList, cancelOut, changeLoop } from '@/api/lever';
import { multiply } from '@/utils/math';
import helpDialog from '@/components/common/help-dialog/index.vue';
import mSwitch from '@/components/common/switch/index.vue';

interface IColumns {
  text: string;
  value: string;
}

@Component({
  components: {
    vanPicker,
    helpDialog,
    mSwitch
  }
})
export default class Record extends Vue {
  @Prop({ default: () => [], type: Array }) leverCoins!: IGetLeverCoinsResList[];
  @Prop({ default: '', type: String }) currency!: string;
  @Prop({ default: false, type: Boolean }) hiding!: boolean;
  showPicker: boolean = false;
  columns: IColumns[] | string[] = [];
  pickerType: string = '';
  multiply = multiply;
  params: IGetLoanListParams = {
    loanCoin: '',
    status: '',
    pageIndex: 1,
    pageSize: 10
  };
  list: IGetLoanListResList[] = [];
  cancelLoanVisible: boolean = false;
  cancelLoanId: number = 0;
  filterType: string = '__("全部")';
  loading: boolean = true;
  @Watch('currency', { immediate: true })
  _(val: string) {
    if (val) {
      this.getLoanList();
    }
  }
  pullup() {
    this.params.pageIndex++;
    this.getLoanList();
  }
  pulldown() {
    this.params.pageIndex = 1;
    this.getLoanList();
  }
  showPickerList(type: string) {
    this.showPicker = true;
    this.pickerType = type;
    switch (type) {
      case 'type':
        this.columns = [
          {
            text: '__("全部")',
            value: ''
          },
          {
            text: '__("未有借入")',
            value: '0'
          },
          {
            text: '__("部分借入")',
            value: '1'
          },
          {
            text: '__("已取消")',
            value: '2'
          },
          {
            text: '__("已成功")',
            value: '3'
          }
        ];
        break;
      case 'coins':
        this.columns = this.leverCoins.map(item => item.tag);
        break;
    }
  }
  onCancel() {
    this.pickerType = '';
    this.showPicker = false;
  }
  onConfirm(val: string | IColumns) {
    if (this.pickerType === 'type') {
      this.filterType = (val as IColumns).text;
      this.params.status = (val as IColumns).value;
    }
    if (this.pickerType === 'coins') {
      this.changeCurrency(val as string);
    }
    this.params.pageIndex = 1;
    this.list = [];
    this.getLoanList();
    this.showPicker = false;
  }
  @Emit()
  changeCurrency(val: string) {
    return val;
  }
  async getLoanList() {
    try {
      this.params.loanCoin = this.currency;
      let { loanList } = await getLoanLists(this.params);
      this.list = this.params.pageIndex === 1 ? loanList : this.list.concat(loanList);
    } catch (error) {}
    this.loading = false;
  }
  async cancelLoan() {
    try {
      await cancelOut({ id: this.cancelLoanId });
      this.getLoanList();
    } catch (error) {}
  }
  cancelOut(obj: IGetLoanListResList) {
    this.cancelLoanVisible = true;
    this.cancelLoanId = obj.id;
  }
  async changeLoop(obj: IGetLoanListResList) {
    try {
      await changeLoop({
        loanId: obj.id,
        isLoop: obj.isLoop
      });
      this.getLoanList();
      this.$message.success(`__('自动放贷')${obj.isLoop ? '__("开启")' : '__("关闭")'}`);
    } catch (error) {}
  }
  noop() {}
}
</script>
<style lang='scss'>
.finance-record {
  height: 100%;
  display: flex;
  flex-direction: column;
  .record-filter {
    flex: none;
    display: flex;
    justify-content: space-between;
    span {
      display: flex;
      align-items: center;
      @include bold;
      padding: 8px 15px;
      &::after {
        content: '';
        margin-left: 5px;
        width: 5px; /* no */
        height: 5px; /* no */
        border-right: 1px solid; /* no */
        border-bottom: 1px solid; /* no */
        transform: rotate(45deg);
      }
    }
  }
  .record-list {
    flex: 1;
    overflow: hidden;
    background-color: var(--default-bg);
    border-top: 1px solid rgba(0, 0, 0, 0.08); /* no */
    @include dark {
      border-color: rgba(255, 255, 255, 0.06);
    }
    .nodata-box {
      height: 100%;
    }
  }
  .virtual-item:not(:first-of-type) {
    border-top: 1px solid rgba(0, 0, 0, 0.08); /* no */
    @include dark {
      border-color: rgba(255, 255, 255, 0.06);
    }
  }
  .record-item {
    padding: 15px;
    .record-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .record-item-title_left {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: var(--heavy-color);
        font-weight: 500;
        img {
          width: 22px;
          height: 22px;
          margin-right: 5px;
        }
        span {
          margin-right: 3px;
        }
      }
      .record-item-title_right {
        display: flex;
        align-items: center;
        &::after {
          content: '';
          margin-left: 5px;
          width: 7px; /* no */
          height: 7px; /* no */
          border-right: 1px solid; /* no */
          border-top: 1px solid; /* no */
          transform: rotate(45deg);
        }
      }
    }
    .record-item-content {
      display: flex;
      padding: 10px 0;
      .record-item-content_column {
        flex: 1;
        &:last-of-type {
          text-align: right;
        }
        dt {
          color: var(--thin-color);
          margin-bottom: 5px;
        }
        dd {
          color: var(--heavy-color);
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
    .record-item-handle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cancel-btn {
        background-color: var(--primary-color);
        color: #fff;
        padding: 5px 10px;
        border-radius: 20px;
      }
      .success,
      .part-success {
        color: #54c773;
      }
      .cancel {
        color: var(--thin-color);
      }
      .record-item-handle_right {
        display: flex;
        align-items: center;
        span {
          color: var(--thin-color);
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
