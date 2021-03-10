/* eslint @typescript-eslint/explicit-member-accessibility:off */
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
type ValueType = string | number;

@Component
export default class InputNumber extends Vue {
  model: ValueType = '';
  tempValue = '';
  @Prop([String, Number]) value!: ValueType;
  @Prop({ type: [Number, String], default: 20 }) decimal!: number;
  @Prop({ type: [Number, String], default: Number.MAX_SAFE_INTEGER }) max!: number | string;
  @Prop({ type: [Number, String], default: Number.MIN_SAFE_INTEGER }) min!: number | string;
  @Prop({ type: [String], default: '' }) itype!: string;

  @Watch('value', { immediate: true })
  valueWatch(val: ValueType): void {
    this.model = val;
  }
  @Watch('model', { immediate: true })
  __(val: string): void {
    this.input(val);
  }
  isNumberStr(value: string, decimal = 15): boolean {
    return new RegExp('^(([\-|1-9]{1}\\d*)|([0]{1}))(\\.{0,1}(\\d){0,' + decimal + '})?$').test(value);
  }
  @Emit()
  input(value: string): string {
    if (this.itype === 'number') {
      if (value === '') {
        this.tempValue = '';
      } else if (this.isNumberStr(value) === false) {
        value = this.tempValue;
      } else {
        let valArr = (value + '').split('.');
        if (this.decimal === 0) {
          value = valArr[0];
        } else if ((valArr[1] || '').length > this.decimal) {
          valArr[1] = valArr[1].substr(0, this.decimal - 1) + value.slice(-1);
          value = valArr.join('.');
        }
        if (['0', '.'].indexOf(value[value.length - 1]) > -1) {
          if (Number(value) > Number(this.max)) {
            value = this.max + '';
          }
          this.tempValue = value;
        } else {
          if (this.max !== '' && Number(value) > Number(this.max)) {
            value = this.max + '';
          } else if (this.min !== '' && Number(value) < Number(this.min)) {
            // value = this.min;
          } else {
            this.tempValue = value;
          }
        }
      }
    }
    this.model = value;
    return value;
  }
}
