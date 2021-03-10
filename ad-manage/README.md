# 广告短视频管理后台交接文档
## 一、项目总览
1. 项目名称：广告短视频-管理后台

- 运用技术：开发中运用的技术包括[VueJs](https://cn.vuejs.org/index.html)，[Sass](https://www.sass.hk/)，[Axios](http://www.axios-js.com/)，[状态管理组件vuex](https://vuex.vuejs.org/zh/)，[路由管理组件vue-router](https://router.vuejs.org/zh/)，[Hls.js](https://github.com/video-dev/hls.js),[vue-simple-uploader](https://github.com/saivarunk/vue-simple-upload#readme),[spark-md5](https://github.com/satazor/js-spark-md5)以及第三方UI库[Element-UI](https://element.eleme.io/#/zh-CN/component/installation),[echartsJs](https://www.echartsjs.com/zh/index.html)，[font-awesome](http://www.fontawesome.com.cn/)等的使用。

2. 目录结构：

- 根目录文件

|  根目录   | 含义  |
|  ----  | ----  |
| vue.config.js | 项目启动配置文件 |
| package.json | 项目描述及依赖文件 |
| package-lock.json |  npm依赖包版本管理使用文件 |
| .gitignore | Git忽略提交配置文件 |
| babel.config.js | Babel插件配置文件 |
| webpack.config.js | Webpack配置文件 |

- src目录(核心代码目录)

|  src   | 含义  |
|  ----  | ----  |
| assets | 图片资源目录 |
| components | 页面路由组件及子组件目录 |
| js | 公共方法目录 |
| lib | http请求封装目录 |
| store | vuex相关文件目录 |
| router | 路由配置目录 |
| App.vue | VueJs入口组件文件 |
| main.js | 核心入口 js 文件 |
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
建议安装VsCode插件：Vetur
- 项目编译及启动
1. 安装完上述工具之后，使用VsCode将项目导入
2. 修改vue.config.js -> devServer -> proxy -> target 值，该地址为测试环境服务端地址
3. 在VsCode命令行输入npm install安装依赖包
4. 在命令行执行npm run serve启动项目(http://localhost:8081)
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