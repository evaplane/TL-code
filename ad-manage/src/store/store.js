import Vue from 'vue'
import Vuex from 'vuex'
import tagsview from './modules/tagView'
import getters from './getter.js'

Vue.use(Vuex)

// 实例化仓库
const store = new Vuex.Store({
    state:{
        menuList:[]
    },
    mutations:{
        changeMenuList(state,newMenuList){
            state.menuList = newMenuList;
        },
        roleList(state,roleList){
            state.roleList = roleList;
        }
    },
    modules:{
        tagsview
    },
    getters
})

export default store