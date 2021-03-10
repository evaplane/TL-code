import { Vue, Component } from 'vue-property-decorator';
import { Picker as vanPicker } from 'vant';
import store from '@/store/store';
import { Catch } from '@/utils/decorators';
import { getCountries, IGetCountriesItems } from '@/api/common';

@Component({
  components: {
    vanPicker
  }
})
export default class MixinsLogin extends Vue {
  public mixinsCountryCodeList: string[] = [];
  public mixinsDefaultIndex: number = -1;
  public mixinsCountries: IGetCountriesItems[] = [];
  public mixinsDefaultCountryCode: string = '+86';
  @Catch()
  public async getCountries(): Promise<void> {
    let { country } = await getCountries();
    if (country) {
      this.mixinsCountries = country;
      this.mixinsDefaultIndex = -1;
      this.mixinsCountryCodeList = country.map((item, index): string => {
        if (store.getters['lang/curLang'] === 'cn' && item.code === '+86') {
          this.mixinsDefaultIndex = index;
        }
        return item.code + ' ' + item.name;
      });
      return;
    }
    this.mixinsCountries = [];
    this.mixinsDefaultIndex = -1;
    this.mixinsCountryCodeList = [];
  }
  public mounted(): void {
    this.getCountries();
  }
}
