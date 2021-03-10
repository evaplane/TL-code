import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { TFormType } from './setting-panel';

@Component
export default class SafeSetting extends Vue {
  @Prop({ type: Array }) type!: TFormType[];
  @Emit('update:type')
  updateType(type: TFormType[]) {
    return type;
  }
}
