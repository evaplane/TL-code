/**
 * @file entry
 * @author liuguangsen0409(liuguangsen@renrenche.com)
 * 创建整个项目的vue实例，引用其他vue相关的内容（路由规则，vue组件，vuex store等），被entry-server.js和entry-client.js使用（类似vue项目的main.js）
 */

import Vue from "vue";
import Meta from "vue-meta";

import "../plugins/vant.js";
import { createRouter } from "@/.lavas/router";
import { createStore } from "@/.lavas/store";
import AppComponent from "./App.vue";
import "@/assets/myIcon/iconfont.css";
import "@/assets/styles/index.scss";
import utils from "../common/util";

Vue.use(Meta);

Vue.config.productionTip = false;
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);
Vue.prototype.$utils = utils; // 一些公共方法，以供全局调用

// 引入复制到剪贴板插件
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

export function createApp() {
  let router = createRouter();
  let store = createStore();
  let App = Vue.extend({
    router,
    store,
    ...AppComponent
  });
  return { App, router, store };
}

if (module.hot) {
  module.hot.accept();
}
