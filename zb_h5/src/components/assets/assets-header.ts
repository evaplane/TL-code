import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import assetsSearch from '@/components/assets/assets-search.vue';
import accountLever from '@/components/assets/account-lever.vue';

@Component({
  components: {
    assetsSearch,
    accountLever
  }
})
export default class AssetsHeader extends Vue {
  @Prop({ type: [String, Number], default: '' }) leftText!: string;
  @Prop({ type: [String], default: '' }) source!: string;
  @Prop({ type: String, default: '' }) propAccountType!: string;
  @Prop({ type: Function, default: null }) itemClickFun!: Function | null;
  @Prop({ type: Boolean, default: true }) showBody!: boolean;
  isSearch: boolean = false;
  coinName: string = '';
  '$refs': {
    assetsPopup: HTMLDivElement;
  };
  get isRenderAssets() {
    // 未指定操作类型时
    return !this.$route.params.action && !this.$route.meta.action;
  }
  get accountType() {
    return this.propAccountType || this.$route.params.type || '';
  }
  @Emit()
  leftClick() {}
  @Emit()
  public searchClick() {
    this.$nextTick(() => {
      this.isSearch = true;
    });
  }
  @Emit()
  searchClose() {
    this.isSearch = false;
  }
  itemClickHandle() {
    this.isSearch = false;
    this.searchClose();
  }
  mounted() {
    document.body.appendChild(this.$refs.assetsPopup);
  }
  beforeDestroy() {
    document.body.removeChild(this.$refs.assetsPopup);
  }
}
