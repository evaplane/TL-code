import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
Vue.prototype.$toapp = "https://www.baidu.com/";
import { get, post } from "./utls/http";
Vue.prototype.$post = post;
Vue.prototype.$get = get;

// import 'amfe-flexible/index.js'
Vue.config.productionTip = false;
Vue.config.productionTip = false;

import { Tab, Tabs } from "vant";
Vue.use(Tab).use(Tabs);
import { Row, Col } from "vant";
Vue.use(Row).use(Col);
import { Image } from "vant";
Vue.use(Image);
import { List } from "vant";
Vue.use(List);
import { Cell, CellGroup } from "vant";
Vue.use(Cell).use(CellGroup);
import { Icon } from "vant";
Vue.use(Icon);
import { Grid, GridItem } from "vant";
Vue.use(Grid).use(GridItem);
import { Switch } from "vant";
Vue.use(Switch);
import { NavBar } from "vant";
Vue.use(NavBar);
import { Divider } from "vant";
Vue.use(Divider);
import { Popup } from "vant";
Vue.use(Popup);
import { Button } from "vant";
Vue.use(Button);
import { Swipe, SwipeItem } from "vant";
Vue.use(Swipe).use(SwipeItem);
import { Toast } from "vant";
Vue.use(Toast);
import { Lazyload } from "vant";
// options 为可选参数，无则不传
Vue.use(Lazyload);
import { Field } from "vant";
Vue.use(Field);
import { ActionSheet } from "vant";
Vue.use(ActionSheet);
import { Notify } from 'vant';
Vue.use(Notify);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
