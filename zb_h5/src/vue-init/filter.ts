import { formatDate } from '@/utils/date';
import { isNumber } from '@/utils/is';
import { toPrecision, fixNumber, fixDecimal } from '@/utils/math';
import Vue from 'vue';
const filters: IObj<Function> = {
  // 日期格式化
  // 传入 date 对象，和 格式化字符串，如 'YYYY-MM-dd'
  date(dt: any, fmt: string): string | number | Date {
    return formatDate(dt, fmt);
  },
  toFixed(value: string | number, num: number): string {
    return isNumber(Number(value)) ? Number(value).toFixed(num) : '0';
  },
  fixedLen(value: string | number, len: number): string | number {
    if (!value) return value;
    value = value.toString();

    if (value.length > len) {
      return value.slice(0, len) + '...';
    }
    return value.slice(0, len);
  },
  toPrecision(val: string | number): string {
    return toPrecision(val);
  },
  fixNumber(num: string | number, dec: number): string {
    return fixNumber(num, dec);
  },
  fixDecimal(num: string | number, dec: number): string {
    return fixDecimal(num, dec);
  }
};

Object.keys(filters).map((item): void => {
  Vue.filter(item, filters[item]);
});
