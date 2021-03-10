import { Component, Prop, Emit, Mixins, Watch } from 'vue-property-decorator';
import virtualInput from '@/components/common/virtual-input/index.vue';
import { mSelect, mOption } from '@/components/common/select/index';
import mixinsC2CCommon, { IActions } from '@/mixins/c2c/common-data';

export interface IFilterObj {
  payWays: string;
  amount: string;
  marketId: string;
}

@Component({
  components: {
    virtualInput,
    mSelect,
    mOption
  }
})
export default class ListFilter extends Mixins(mixinsC2CCommon) {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: String, default: '' }) payWays!: string;
  @Prop({ type: String, default: '' }) amount!: string;
  @Prop({ type: Array, default: [] }) moneyActions!: IActions[];
  @Prop({ type: String, default: '' }) marketId!: string;

  filterPayWays: string = '';
  filterAmount: string = '';
  filterMarketId: string = '';

  @Watch('visible', { immediate: true })
  visibleWatcher(visible: boolean) {
    if (visible) {
      this.reset();
    }
  }

  reset() {
    this.filterPayWays = this.payWays;
    this.filterAmount = this.amount;
    this.filterMarketId = this.marketId;
    this.blurHandle();
  }

  @Emit('filter')
  filter(): IFilterObj {
    this.closeHandle();
    this.blurHandle();
    return {
      payWays: this.filterPayWays,
      amount: this.filterAmount,
      marketId: this.filterMarketId
    };
  }

  blurHandle() {
    (this.$parent as any).keyboardVisible = false;
  }
  focusHandle() {
    (this.$parent as any).keyboardVisible = true;
  }
  noop() {}
  @Emit('update:visible')
  closeHandle() {
    return false;
  }
}
