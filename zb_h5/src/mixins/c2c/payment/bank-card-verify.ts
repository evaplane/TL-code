import { Component, Vue } from 'vue-property-decorator';
import { Toast } from 'vant';

Vue.use(Toast);

export interface IBankCard {
  realName: string; // 用户名
  type: string; // 选择银行
  bankId: string; // 银行卡号
  bankName: string;// 再次输入银行卡号
  subBranch: string;// 开户地址
  account: string;// 开户支行
  receive: boolean; // 是否收款
  payment: boolean; // 是否付款
  address: string; // 地址
  provinceCode: number | string;
  cityCode: number | string;
}

@Component
export default class MixinsBankCardVerify extends Vue {
  public mixinsBankCard: IBankCard = {
    realName: '',
    type: '',
    bankId: '',
    bankName: '',
    subBranch: '',
    account: '',
    address: '',
    receive: false,
    payment: false,
    provinceCode: '',
    cityCode: ''
  };
}
