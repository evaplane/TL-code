import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import virtualScroll, { IScrollItem } from './virtual-list';
@Component
export default class ScrollItem extends Vue {
  @Prop({ type: [Object, String, Number] }) item!: IScrollItem;
  @Prop({ type: [Number] }) id!: number;
  '$el': HTMLDivElement;
  '$parent': virtualScroll;
  @Watch('item')
  computedSize() {
    this.$parent.updateItemTop(this.id, this.$el.getBoundingClientRect().height);
  }
  mounted() {
    this.computedSize();
  }
}
