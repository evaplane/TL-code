import Vue from 'vue';
import {
  Popup as Popover,
  Tabs,
  Switch,
  Button,
  Cell,
  CellGroup,
  NavBar,
  ActionSheet,
  Tabbar,
  TabbarItem,
  Collapse,
  CollapseItem,
  Skeleton,
  DropdownMenu,
  DropdownItem,
  Radio,
  Image,
  IndexBar
} from 'vant';
import { tabs, tab } from '@/components/common/nav-tab/index';
import noData from '@/components/common/no-data.vue';
import { IMessage } from '@/components/common/message/index';
import VanField from '@/components/common/input/index.js';

// styles
import '@/assets/css/vant-ui/index.css';

// types
// 声明全局方法
declare module 'vue/types/vue' {
  // eslint-disable-next-line
  interface Vue {
    $bus: Vue;
    $message: IMessage;
  }
}
[
  Popover,
  Tabs,
  Switch,
  Button,
  Option,
  Tabbar,
  TabbarItem,
  Cell,
  CellGroup,
  ActionSheet,
  NavBar,
  Collapse,
  CollapseItem,
  Skeleton,
  DropdownItem,
  DropdownMenu,
  Radio,
  Image,
  IndexBar
].map((component): void => { Vue.component(component.name, component); });
Vue.component('VanField', VanField);
Vue.component('MTabs', tabs);
Vue.component('MTab', tab);
Vue.component('noData', noData);
