import axios from 'axios';
import Qs from 'qs'
import router from '../router/router'
import Vue from 'vue'
import store from '@/store/store.js'
import { log } from 'util';

var baseUrl = "api/"
var baseUrl2 = "http://192.168.1.200:8181/"
axios.defaults.withCredentials=true;

// axios的 拦截器
// 请求拦截器 请求发送之前 执行
axios.interceptors.request.use(
    config => { 
      config.headers['Cache-Control'] = 'no-cache'
      if(window.localStorage.getItem('token')){
        config.headers.Authorization = window.localStorage.getItem('token')
      }
      if(config.url.indexOf('storage-web/storageObj/upload')!=-1 || config.url.indexOf('/storage-web/storageObj/multipartUpload')!=-1||config.url.indexOf('/common-web/upgrade/appUpload')!=-1){
        config.baseURL = baseUrl;
        config.headers["Content-Type"] = 'multipart/form-data'
        return config
      }else if(config.url.indexOf('storage-web/storageObj/getUploadId')!=-1){
        config.baseURL = baseUrl;
        config.headers["Content-Type"] = 'application/json'
        return config
      }else{
        config.baseURL = baseUrl;
      }
      if (config.method == 'post') {
          for(let i in config.data){
            if(typeof config.data[i] == 'string'){
              config.data[i] = config.data[i].trim()
            }
          }
          // 权限
          if(config.url.indexOf('auth-web')!=-1){
            if(config.url=="auth-web/sys/login" || config.url.indexOf('menu/delete')!=-1 || config.url.indexOf('dept/delete')!=-1 || 
            config.url=="auth-webuser/password" || config.url=="auth-web/sys/user/updateStatus" || config.url.indexOf("auth-web/sys/user/password")!=-1 || config.url.indexOf("sys/user/resetPassword")!=-1){
              config.data = Qs.stringify({
                ...config.data
              })
            }else if(config.url.indexOf('role/delete')!=-1 || config.url.indexOf('user/delete')!=-1){
              config.headers["Content-Type"] = 'application/json'
              // 只适用于 POST,PUT,PATCH，transformRequest` 允许在向服务器发送前，修改请求数据。后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
              config.transformRequest= function (data) {
                  return JSON.stringify(data)
              }
            }else{
              config.headers["Content-Type"] = 'application/json'
              config.data = JSON.stringify({
                ...config.data
              })
            }
          // 基础配置
          }else{
            // 人工审核提交需要
            if(config.url.indexOf('manualAudit/audit')!=-1){
              config.headers["Content-Type"] = 'application/json'
              // 只适用于 POST,PUT,PATCH，transformRequest` 允许在向服务器发送前，修改请求数据。后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
              config.transformRequest= function (data) {
                  return JSON.stringify(data)
              }
            }else{
              config.data = Qs.stringify({
                ...config.data
              })
            }
            
          }
      } else if (config.method == 'get') {
        config.baseURL = baseUrl;
        // 封装的参数要在拦截器里面传,获取验证码
        if(config.url.indexOf('sys/captcha?timestamp=')!=-1 || config.url.indexOf('user-web/user/downNickNameTemp')!=-1|| config.url.indexOf('common-web/illegal/downIllegalNameTemp')!=-1){
          config.responseType = 'arraybuffer'
        }
        config.params = {
          ...config.params,
          timestamp:(new Date()).valueOf()
        }
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )


// response拦截器==>对响应做处理
axios.interceptors.response.use(
    response => {  //成功请求到数据
      //这里根据后端提供的数据进行对应的处理
      if (response.data.code == '200001' || response.data.code == '100012') {
        if(location.pathname != '/login'){
          window.localStorage.removeItem('store')
          store.commit('closeAllViews')
          router.push('/login')
          return response.data;
        }
      }else if(response.config.url.indexOf('api/auth-web/sys/captcha?timestamp=')!=-1){
          window.localStorage.setItem("token", response.headers.authorization);
          return response
      }else {
        return response.data;
      }     
    },
    error => { //响应错误处理
      return error
    }
  )

  // get请求
  export function get(url, params){    
    return new Promise((resolve, reject) =>{ 
        axios.get(url, {            
            params: params        
        })        
        .then(res => {            
            resolve(res);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
  }

  // post请求
  export function post(url, params) {    
    return new Promise((resolve, reject) => {         
        axios.post(url, params)        
        .then(res => {            
            resolve(res);        
        })        
        .catch(err => {            
            reject(err)        
        })    
    });
  }

