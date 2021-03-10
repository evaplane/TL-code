import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class ServiceSearch extends Vue {
  @Prop({ default: '', type: String }) public search!: string;

  public searchKey: string = '';
  public list: any[] = [];
  public mounted(): void {
    let obj: IObj<string> = {
      'message-list': 'name',
      notice: 'name',
      announcement: 'defaultTitle',
      news: 'title',
      activity: 'activityCenter.title'
    };
    let name = this.$route.name && this.$route.name.replace('community-', '');
    if (name) {
      this.searchKey = obj[name];
    }
  }
  public get returnList(): any[] {
    // if (!this.searchKey) return [];
    // return this.list.filter((item): any => {
    //   if (this.searchKey.includes('.')) {
    //     let keys = this.searchKey.split('.');
    //     return item[keys[0]][keys[1]].indexOf(this.search) > -1;
    //   }
    //   return item[this.searchKey].indexOf(this.search) > -1;
    // });
    return this.list;
  }
}
