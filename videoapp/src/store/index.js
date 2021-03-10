import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let userId = sessionStorage.getItem("linkuu") || "";
export default new Vuex.Store({
  state: {
    uuid: userId,
    stop: 1,
    info: {},
    verlist: [],
    fontlist: [],
    appLaguage: null,
    shareUrl: null,
    vertcount: 0,
    videoPauseAd: [],
    detailsAd: [],
    homeAd: [],
    bootAd: [],
    playList: [],
    play: {}
  },
  mutations: {
    topause: function(state) {
      state.stop = Math.round(new Date().getTime() / 1000);
    },
    userinfo: function(state, info) {
      state.info = info;
    },
    verlist: function(state, verlist) {
      for (let i = 0; i < verlist.length; i++) {
        // 暂停广告
        if (verlist[i].categoryValue == "videoPauseAd") {
          state.videoPauseAd.push(verlist[i]);
          // 详情广告
        } else if (verlist[i].categoryValue == "detailsAd") {
          state.detailsAd.push(verlist[i]);
          // 热门广告
        } else if (verlist[i].categoryValue == "homeAd") {
          state.homeAd.push(verlist[i]);
        } else if (verlist[i].categoryValue == "bootAd") {
          state.bootAd.push(verlist[i]);
        }
      }
      state.verlist = verlist;
    },
    fontlist: function(state, fontlist) {
      for (let index = 0; index < fontlist.length; index++) {
        const element = fontlist[index];
        // 广告语
        if (element.paramCode === "ADVERTISING_LANGUAGE") {
          state.appLaguage = element.paramValue;
          // 分享地址
        } else if (element.paramCode === "CONTENT_SHARE_ADDRESS") {
          state.shareUrl = element.paramValue;
        }
      }
      state.fontlist = fontlist;
    },
    playList: function(state, playList) {
      state.playList = playList;
    },
    setPlay: function(state, play) {
      state.play = play;
    }
  },
  actions: {},
  modules: {}
});
