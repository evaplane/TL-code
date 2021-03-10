import coinJson from '@/config/coin';
import store from '@/store/store';

export interface IExtendUnitName {
  coinUnitName?: string;
}
export const getUnitNames = (coin: string): IObj<string> => {
  if (!coin) return {};
  coin = coin.toString().toLowerCase();
  if (coin in coinJson) {
    return coinJson[coin];
  }
  return {};
};

export const getUnitName = (coin: string): string => {
  if (!coin) return '';
  let names = getUnitNames(coin);
  coin = coin.toString().toLowerCase();
  const lang = store.getters['lang/curLang'];
  const coinConfig = names;
  if (coinConfig[lang]) {
    return coinConfig[lang];
  }
  if (coinConfig['en']) {
    return coinConfig['en'];
  }
  return coin;
};
