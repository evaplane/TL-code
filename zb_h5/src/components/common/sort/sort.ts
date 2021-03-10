import { Component, Vue, Watch, Emit, Provide } from 'vue-property-decorator';
export interface ISortOptions {
  type: string;
  name: string;
}
type OrderTypes = 'default' | 'desc' | 'asc';
@Component
export default class Sort extends Vue {
  itype: number = 0;
  sortName: string = '';
  sortType: string[] = ['default', 'desc', 'asc'];
  @Provide()
  rootSort = this.rootSortComp();
  @Watch('sortName')
  sortNameChanged(n: string, o: string) {
    if (o) {
      if (n !== o) {
        this.itype = 1;
      }
    }
  }
  sortByName(name: string) {
    if (this.sortName !== name) {
      this.itype = 0;
    }
    this.sortName = name;
    if (this.itype < 2) {
      this.itype++;
    } else {
      this.itype = 0;
    }
    this.sortChange();
  }
  sort(prop: string, order: OrderTypes) {
    this.itype = this.sortType.indexOf(order);
    this.sortName = prop;
    this.sortChange();
  }

  rootSortComp() {
    return this;
  }

  @Emit()
  sortChange(): ISortOptions {
    // eslint-disable-next-line
    return {
      type: this.sortType[this.itype],
      name: this.sortName
    } as ISortOptions;
  }
}
