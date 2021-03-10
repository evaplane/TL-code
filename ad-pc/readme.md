# 广告短视频PC版交接文档
## 一、项目总览
1. 项目名称：广告短视频-PC版

- 运用技术：开发中运用的技术包括[VueJs](https://cn.vuejs.org/index.html)，[Sass](https://www.sass.hk/)，[Axios](http://www.axios-js.com/)，[状态管理组件vuex](https://vuex.vuejs.org/zh/)，[路由管理组件vue-router](https://router.vuejs.org/zh/)，[Hls.js](https://github.com/video-dev/hls.js)，[加密插件jsencryptJs](https://github.com/travist/jsencrypt)以及第三方UI库[Element-ui](https://element.eleme.io/#/zh-CN/component/installation)等的使用。

2. 目录结构：

- 根目录文件

|  根目录   | 含义  |
|  ----  | ----  |
| vue.config.js | 项目启动配置文件 |
| package.json | 项目描述及依赖文件 |
| package-lock.json |  npm依赖包版本管理使用文件 |
| .gitignore | Git忽略提交配置文件 |
| babel.config.js | Babel插件配置文件 |

- src目录(核心代码目录)

|  src   | 含义  |
|  ----  | ----  |
| assets | 图片资源目录 |
| components | 页面路由组件及子组件目录 |
| lib | 公共方法目录 |
| plugins | VueJs插件目录 |
| store | vuex相关文件目录 |
| views | VueJs路由页面目录 |
| App.vue | VueJs入口组件文件 |
| element-variables.scss | elementUI自定义主题文件 |
| main.js | 核心入口 js 文件 |
| router.js | vue-router组件文件 |
- public目录

|  src   | 含义  |
|  ----  | ----  |
| index.html | 总入口文件 |
| favicon.ico | 网站头像文件 |
| hls.js | 浏览器播放m3u8视频必须依赖文件 |
- node_modules目录
项目依赖模块文件目录
- dist目录
执行npm run build后生成的项目部署代码目录(静态文件)

## 二、项目进度
目前项目为第一版本已完成状态，后续根据新增需求再进行迭代开发。因为是初期版本，所有代码有部分地方冗余程度比较高，建议重构这部分代码。

未完成工作：无

需完善工作：无

## 三、本地项目开发

- 项目工具(均为本地开发时需要使用的工具)
> **Node.js**
下载地址：[Node.js](https://nodejs.org/en/)
Node官方文档：[node docs](https://nodejs.org/en/docs/)
> **vue-cli3**
vue-cli为npm包，需先安装NodeJs才能安装
安装方法：[vue-cli 3.X 安装](https://www.jianshu.com/p/2b002854969d)
> **VsCode**
代码编辑器(类似工具有webstorm、Sublime、Hbilder等)
下载地址：[Visual Studio Code](https://code.visualstudio.com/)
VsCode官方文档：[VsCode Docs](https://code.visualstudio.com/docs)
建议安装插件：Chinese (Simplified) Language Pack for Visual Studio Code、Vetur
- 项目编译及启动
1. 安装完上述工具之后，使用VsCode将项目导入
2. 修改vue.config.js -> devServer -> proxy -> target 值，该地址为测试环境服务端地址
3. 在VsCode命令行输入npm install安装依赖包
4. 在命令行执行npm run serve启动项目(http://localhost:8085)
5. 在命令行执行npm run build构建部署代码，文件夹为dist
## 四、Linux服务端上项目部署
在执行npm run build后会生成dist文件夹，包含了项目部署的全部文件，需要放在服务器上方可运行，此处使用nginx服务器进行部署访问
1. 安装 nginx 服务
2. 在nginx 目录中找到 conf/nginx.conf，增加新的server代码
```
server {  
    listen       80;  #监听端口 根据需要可更改为其他端口
    server_name  localhost;  #监听地址默认为localhost 可更改为外网可访问域名
    location / {  #根目录 
        index  index.html index.htm; # 定义首页索引文件的名称
        alias /home/programs/; # 定义网站根目录位置 为本地开发npm run build生成的dist文件夹上传到Linux服务器上后所存放的目录
    }  
    location /api/{  #本地请求转发代理
        proxy_set_header Host $host; #允许重新定义或者添加发往后端服务器的请求头：客户端请求头中没有携带这个头部，那么传递到后端服务器的请求也不含这个头部
        proxy_set_header X-Real-Ip $remote_addr; # 用户的真实ip放在X-Real-Ip这个变量中
        proxy_set_header X-Forwarded-For $remote_addr;  用户的真实ip放在X-Forwarded-For这个变量中
        proxy_pass http://***.**.**.**/; # 代理转发:修改为后台服务端地址  在链接后面需要加 / 
    }  
    error_page   500 502 503 504  /50x.html;  
    location = /50x.html {  
        root   html;  
    }  
}
```
3. 测试服务是否正常
```
nginx -t
```
4. 重启服务
```
访问 localhost:80 查看是否可以访问
```
## 五、部分项目代码解释
1. src/main.js
```
/*
* Jsencrypt.js 为前端加密RSA必须插件，在vue页面中通过this.$jSEncrypt来使用该对象
* 代码中调用示例查看：src/views/install.vue 的 visitorLogin 函数
* 项目地址：https://www.npmjs.com/package/jsencrypt/v/3.0.0-rc.1
*/
import {JSEncrypt} from 'jsencrypt'
Vue.prototype.$jSEncrypt=JSEncrypt
/*
* 用于在浏览器上展示表情，扩展表情数据可在 src/lib/emoji-lib/emoji-list-with-image.js 内添加
* 代码中调用示例查看：src/components/main/userInfoCard.vue 的 returnEmoji 函数
* 项目地址：http://github.com/ioNull/emoji.js
*/
import {emoji} from './lib/emoji-lib/emoji.js'
Vue.prototype.$emoji = emoji
/*
* vue-lazyload 图片懒加载插件
* 代码中调用示例查看：src/components/main/userInfoCard.vue 的 template 中 <img v-lazy>
* 项目地址：https://github.com/hilongjw/vue-lazyload#readme
* 插件使用详解：https://www.cnblogs.com/zhaotq/p/10033305.html
*/
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: "https://demo.chevereto.com/images/2018/11/23/Map.md.png",
  error: require('./assets/map.png'),
  loading: require('./assets/loading.gif'),
  attempt: 2
})
```
2. src/components/main/msgDialog.vue
```
为兼容在浏览器中使用video标签播放m3u8，在此文件中的watch对象中对dialogTableVisible的值变化进行监听，在为ture时对video标签src属性进行赋值时做判断，当为m3u8时判断是否可以播放m3u8，不能时使用Hls.js进行编码处理。
```