import axios from 'axios';
import router from '../router'
var baseUrl = "api/"
axios.defaults.withCredentials=true;

// axios的 拦截器
// 请求拦截器 请求发送之前 执行
axios.interceptors.request.use(
    config => { 
      config.baseURL = baseUrl;
      if (config.method == 'post') {
        if(config.url.indexOf("api/") == -1){
          config.headers["Content-Type"] = 'application/json';
          if(Object.prototype.toString.call(config.data) !== '[object String]'){
            for(let i in config.data){
              if(typeof config.data[i] == 'string'){
                config.data[i] = config.data[i].trim()
              }
            }
            config.data = JSON.stringify(
              config.data
            );
          };
        }else{
          config.url = config.url.slice(config.url.indexOf("/"));
        }
      } else if (config.method == 'get') {
        if(config.url.indexOf("api/") == -1){
          config.params = {
            ...config.params
          }
        }else{
          config.url = config.url.slice(config.url.indexOf("/"));
        }
        
      }
      if(window.sessionStorage.getItem('token')){
        config.headers['X-Auth-Token'] = window.sessionStorage.getItem('token');
        config.headers['X-Identify'] = window.sessionStorage.getItem('userid');
      }
      
      // loading = Loading.service();
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )


// response拦截器==>对响应做处理
axios.interceptors.response.use(
    response => {  //成功请求到数据
      if(response.data.code == 100011){
        if(sessionStorage.getItem("userid")){
          return resetToken().then(()=>{
            return axios.request(response.config);
          });
        }else{
          router.replace({
              path: 'login'
          })
          return Promise.reject(response.data);
        }
      }else if(response.data.code == 100010||response.data.code == 100012||response.data.code == 100013||response.data.code == 100014){
        router.replace({
            path: 'login'
        });
        return Promise.reject();
      };
      return response.data;
    },
    error => { //响应错误处理
      // Message.error(error.message);
      return Promise.reject(error)
    }
  )
function resetToken () {
  var tokenLock,tokenTime=0;
  var p = new Promise(function(resolve, reject){
          if(resolve == void(0)) return;
              //正在请求更新token时，其他接口等待
              if(tokenLock&&tokenTime<30){
                setTimeout(function(){
                    tokenTime++;
                },500);
              }else if(tokenTime>30){ //500*30是15S，15s没有响应就直接跳登录页
                  window.location.reload();
              }else{
                  tokenLock = true;
                  post('external-web/user/refreshUserToken',{
                    userId:sessionStorage.getItem("userid")
                  }).then(function(res) {
                    tokenLock = false;
                    tokenTime = 0;
                    if(res.code == "000000"){
                      window.sessionStorage.setItem("token",res.data);
                    }
                    resolve();
                }).catch(function() {
                    reject();
                });
              }
          });
  return p;
}
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

