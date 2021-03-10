import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui';
import {get,post} from '../lib/http'
Vue.use(Vuex)
const VERSION = '1.0.0_web';
function getConcat(arr1,arr2){
    let arr3 = arr1.concat(arr2);
    let result = [];
    var obj = [];
    result = arr3.reduce(function(prev, cur) {
    obj[cur.id] ? '' : obj[cur.id] = true && prev.push(cur);
    return prev;
    }, []);
    return result;
}
let userId = sessionStorage.getItem("userid")||'';
let userData = sessionStorage.getItem("userInfo")||'';
userData&&(userData = JSON.parse(userData));
// 实例化仓库
const store = new Vuex.Store({
    state: {
        userId:userId,
        userData:userData,
        onrel:false,
        // 初始化状态
        indexMsgData: {
            userInfo:{
            "id": null,
            "userId": null,
            "nickName": "",
            "userPic": null,
            "userBackground": null,
            "userSign": "",
            "userPoint": null,
            "userLevel": "",
            "inviteUserCount": null,
            "status": null,
            "ext": null,
            "createTime": null,
            "updateTime": null,
            payload:null,
            },
            praiseCount:'',
            commentCount:'',
            visitCount:'',
            contentTitle:'',
            content:'',
            mainImageUrl:'',
        },
        swiperData:[""],
        contentList:{
            hasNextPage:null,
            allList:[]
        },
    },
    mutations: {
        // 处理状态
        mainMsgData(state, payload) {
            let setData = {};
            setData.userInfo = payload.userInfo;
            setData.praiseCount = payload.praiseCount;
            setData.commentCount = payload.commentCount;
            setData.visitCount = payload.visitCount;
            setData.contentId = payload.id;
            setData.contentTitle = payload.contentTitle;
            setData.auditTime = payload.auditTime;
            setData.content = payload.content;
            setData.mainImageUrl = payload.mainImageUrl;
            setData.uploadWay = payload.uploadWay;
            setData.categoryCode = payload.categoryCode;
            state.swiperData.splice(0);
            if(payload.uploadWay == 1){
                let imgUrls = payload.contentVideoUrl.split(',');
                state.swiperData.push(...imgUrls);
            }else if(payload.uploadWay == 2){
                state.swiperData.push(payload.contentVideoUrl);
            }
            return state.indexMsgData = setData;
        },
        // 保存用户信息
        saveUser(state, user) {
            sessionStorage.setItem("userid",user.id);
            sessionStorage.setItem("token",user.token);
            state.userData = user.userData;
            return state.userId = user.id;
        },
        // 移除用户信息
        removeUser(state) {
            sessionStorage.removeItem("userid");
            sessionStorage.removeItem("token");
            return state.userId = null;
        },
        updateUserInfo(state,data){
            return state.userData = data;
            
        },
        // 添加列表
        addContentList(state,data) {
            // 判断是否是二级，如果是二级添加到children变量上
            if(data.replyId == 0){
                if(data.rows.length == 10){
                    state.contentList.hasNextPage = true;
                }else{
                    state.contentList.hasNextPage = false;
                }
                if(state.contentList.allList.length > 0){
                    state.contentList.allList = getConcat(state.contentList.allList,data.rows);
                }else{
                    state.contentList.allList.splice(0);
                    state.contentList.allList.push(...data.rows);
                }
                return state.contentList;
            }else{
                var res = state.contentList.allList.map(function ( item ) {
                    if(item.id == data.replyId){
                        item.children = data.rows;
                        if(data.rows.length == 10){
                            item.hasNextPage = true;
                        }else{
                            item.hasNextPage = false;
                        };
                    }
                    return item; 
                });
                state.contentList.allList.splice(0);
                state.contentList.allList.push(...res);
                return state.contentList;
            }
        },
        // 添加列表
        checkRel(state,bool) {
            state.onrel = bool;
            return state.onrel;
        },
        cleanData(state){
            state.contentList = {
                hasNextPage:null,
                allList:[]
            };
            state.indexMsgData = {};
        },

    },
    actions: {
        // 提交改变后的状态
        updateIndexMsgData(context, param) {
            return new Promise(function(resolve, reject) {
                post('external-web/content/view',param).then((response) => {
                    if(response.code != "000000"){
                        reject(response) 
                    }else{
                        resolve(response);
                    }
                }, (response) => {
                    reject(response)
                });
            }).then((res)=>{
                context.commit('mainMsgData',res.data);
                return res;
            }).catch(err=>{
                if(err){
                    Message.error('当前网络异常，请稍后再试');
                };
            });;
        },
        addContentList(context, param) {
            return new Promise(function(resolve, reject) {
                post('external-web/comment/pageList',param).then((response) => {
                    if(response.code != "000000"){
                        reject(response) 
                    }else{
                        resolve(response);
                    }
                }, (response) => {
                    reject(response)
                });
            }).then((res)=>{
                res.data.replyId = param.replyId;
                context.commit('addContentList',res.data);
                return res;
            }).catch(err=>{
                if(err){
                    Message.error('当前网络异常，请稍后再试');
                };
            });
        },
        checkRel(context, param) {
            return new Promise(function(resolve, reject) {
                get('external-web/social/findAttRelation',param).then((response) => {
                    if(response.code != "000000"){
                        reject(response) 
                    }else{
                        resolve(response);
                    };
                }, (response) => {
                    reject(response)
                });
            }).then((res)=>{
                context.commit('checkRel',res.message);
                return res;
            }).catch(err=>{
                if(err){
                    Message.error('当前网络异常，请稍后再试');
                };
            });
        },
        saveUser(context, param) {
            context.commit('saveUser', param);//提交保存用户信息
        },
        removeUser(context, param) {
            context.commit('removeUser', param);//提交删除用户信息
        },
        cleanData(context){
            context.commit('cleanData');
        },
        updateUserInfo(context) {
            return new Promise(function(resolve, reject) {
                get('/external-web/basic/findUserBasicInfo',{userId:context.state.userId}).then((response) => {
                    if(response.code != "000000"){
                        reject(response) 
                    }else{
                        resolve(response);
                    };
                }, (response) => {
                    reject(response)
                });
            }).then((res)=>{
                context.commit('updateUserInfo',res.data);
                return res;
            }).catch(err=>{
                if(err){
                    Message.error('当前网络异常，请稍后再试');
                };
            });
        },
        contentPointVideo(context,params){
            return new Promise(function(resolve, reject) {
                post('/external-web/commonPoint/contentPoint',JSON.stringify([{
                    classify:context.state.indexMsgData.categoryCode,
                     count:params.count,
                     platform:3,
                     pointTime:Math.round(new Date()),
                     type:params.type,
                     version:VERSION,
                }])).then((response) => {
                    resolve(response);
                }, (response) => {
                    reject(response)
                });
            }).then((res)=>{
                return res;
            });
        }
    }
})
sessionStorage.removeItem("userInfo");
export default store