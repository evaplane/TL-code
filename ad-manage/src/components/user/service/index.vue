<template>
  <div class='user'>
    <!-- 聊天室布局 -->
    <div class='content chatroom'>
      <el-container>
        <el-aside style='height:750px;width:23%;min-width:310px;'>
            <div class='heart'>
                当前等待人数 : {{waitNum}}
                <div class='pullUserBox' @click='pullUser'>
                  <el-tooltip class="item pullUser" effect="light" content="拉取用户" placement="bottom-end" :visible-arrow='false'>
                    <i class="fa fa-user-plus"></i>
                  </el-tooltip>
                </div>
            </div>
            <div class='userList' style='position:relative;height:690px;'>
              <div class='clients' v-for="(item,index) in userList" :key="index" @click="getContentList(item)">
                  <img :src='item.avatar' alt="" class='avatar'>
                  <span class='clientName'>{{ item.username }}</span>
                  <!-- <span class='lastContent'>{{item.content}}</span> -->
                  <span class='unread' :id="'client'+item.userId"></span>
                  <span class='close fa fa-close' @click.stop="closeChat(item)"></span>
                  <span class='time'>{{item.updateTime}}</span>                                                                                                          
              </div>
               <el-pagination small layout="prev, next" @current-change="handleCurrentChange" :total="list.total"></el-pagination>
            </div>
           
        </el-aside>
        <el-container style='height:750px;min-width:640px;'>
          <el-header style='background-color:#fff;border-bottom:1px solid #eaeaea;line-height:60px;font-size:20px;width:100%;box-sizing:border-box;min-width:620px;'>
              <span>{{clientName}}</span>
          </el-header>
          <el-main style='background-color:#fff; border-bottom:1px solid #eaeaea;padding:10px;height:90%;width:100%;min-width:640px;' class='dialogBox' id="mainBox">
            <!-- 用户对话 -->
            <component  :is='item.component' :message="item.text" v-for="(item,index) in dialogs" :avatar="item.avatar" :key="index" v-show="contentShow"></component>
          </el-main>
          <el-footer style='background-color:#fff;height:200px;padding-top:10px;width:100%;box-sizing:border-box;min-width:620px;'>
              <div class='tool'>
                  <i class='fa fa-smile-o' @click="qqfaceShow=!qqfaceShow" ref='qqface'></i>
                  <!-- <div class='faceContent'> -->
                  <emotion @emotion="handleEmotion" :height="200" v-show="qqfaceShow" v-on:qqShow="qqShow" class='faceContent'></emotion>
                  <!-- </div> -->
                  <label for="fileInput">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                  </label>
                  <input v-show="false" type="file" id="fileInput" @change="upload($event)"> 
                  <el-popover placement="top" width="400" trigger="manual" v-model="contentListVisible">
                    <i class='el-icon-close' style="color:#C0C4CC;float:right;margin-bottom:10px;cursor:pointer;" @click="contentListVisible=false"></i>
                    <el-input prefix-icon="el-icon-search" v-model="contentListSearch" placeholder="搜索"></el-input>
                    <el-row style="line-height:50px;font-size:16px;margin-bottom:0" class="chatPopover">
                      <el-col :span="6"><div class="grid-content"></div></el-col>
                      <el-col :span="6"><div class="grid-content">全部</div></el-col>
                      <el-col :span="6"><div class="grid-content"></div></el-col>
                    </el-row> 
                    <div class='chatContentItem' v-for="(item,index) in contentList" :key="index">
                        <span class='clientName'>{{ item.username }}</span>
                        <span class='sendTime'>{{ item.sendTime }}</span>
                        <span class='leftHeader'><img :src="item.avatar" class='dialogAvatar' alt=""></span>
                        <span class='leftBodyContent' v-html="item.content"></span>
                    </div>
                    <el-pagination small layout="prev, next" @current-change="handleCurrentChangeContent" :total="content.total" class='contentPagination'></el-pagination>
                    <i class='fa fa-commenting-o' slot="reference" @click="showContentList"></i>
                  </el-popover>
              </div>
              <p contenteditable=true class="inputBox" id='inputBox' :name="attr" v-html="inputContent" @input="handleInput" @keydown.enter="sendMessage" ref="input"></p>
              <el-button type="primary" class='send' @click='sendMessage'>发送</el-button>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import customer from './customer'
import user from './user'
import Emotion from './Emotion/index'
import {formatterDateTime,} from '../../../js/util'
import { log } from 'util';
import BMF from 'browser-md5-file';
export default {
  name: 'service',
  data() {
    return {
      showFileList:false,
      // 等待客户人数
      waitNum:0,
      // 用户名
      clientName:'',
      time:'16:50',
      lastContent:'你好',
      // 输入内容
      inputContent:'',
      // 客服id
      customerid:0,
      // 大家说的话
      dialogs:[],
      // 图片地址
      imgDataUrl:'',
      // 展示qqface
      qqfaceShow:false,
      // qq表情内容
      qqcontent:'',
      // 图片内容
      imgContent:'',
      // 发送内容
      sendContent:'',
      // 用户列表
      userList:[],
      // 聊天内容的显示
      contentShow:false,
      // 当前用户的id
      userId:-1,
      // 聊天记录搜索
      contentListSearch:'',
      // 聊天记录列表
      contentList:null,
      // 总页数
      list:{
        total:0,
        pageNo:1,
        pageSize:8
      },
      // 聊天内容
      content:{
        total:0,
        pageNo:1,
        pageSize:6
      },
      // qqface
      qqfaceList:[],
      isLock:false,
      attr:'',
      contentListVisible:false,
      websock:null,
      customerAvatar:'http://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=%E6%AF%94%E5%8D%A1%E4%B8%98&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=1666575324,2007144278&os=1366130870,3368027788&simid=0,0&pn=14&rn=1&di=201740&ln=1205&fr=&fmq=1565603746299_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201309%2F21%2F20130921010012_yMUdX.thumb.700_0.jpeg&rpstart=0&rpnum=0&adpicid=0&force=undefined',
      // 点击发送次数
      sendIndex:0,
      // 查看聊天记录次数
      contentIndex:0,
    }
  },
  components: {
    customer,
    user,
    Emotion
  },
  created(){
    this.getCustomerid();
    setTimeout(()=>{
      this.websock = this.initWebSocket(this.customerid,window.localStorage.getItem('token'))
      this.connectReady()
    },300)
    setTimeout(()=>{
      clearInterval(window.timer);
      this.heartbeat();
      window.timer = setInterval(this.heartbeat, 10000);
    },800)  
  },
  mounted(){
    // 监听中文输入
    const el = this.$refs.input
    el.addEventListener('compositionstart', this.onCompositionstart, false)
    el.addEventListener('compositionend', this.onCompositionend, false)
    this.scrollToBottom();
  },
  methods: {
      onCompositionstart (e) {
       this.isLock = true
      },
      onCompositionend (e) {
         this.isLock = false
      },
      handleCurrentChange(page){
        this.list.pageNo = page
        this.getChatList()
      },  
      handleCurrentChangeContent(page){
        this.content.pageNo = page
        this.getContentList1()
      },  
      qqShow(){
        this.qqfaceShow=false
      },
      // 获取客服id
      getCustomerid(){
        this.$get('auth-web/sys/user/info').then(res=>{
          if(res.code=='000000'){
            this.customerid = res.data.userId
            this.getChatList()
          }
        })
      },
      // 获取聊天列表
      getChatList(){
       this.$get('user-web/im/relation/list',{customerid:this.customerid,pageSize:this.list.pageSize,pageNo:this.list.pageNo}).then(res=>{
         if(res.code=='000000'){
          res.data.row.forEach(v => {
            v.updateTime = formatterDateTime(v.updateTime)
          });
          this.userList = res.data.row
          this.list.total = res.data.total
         }
       })
      },
      // 发送信息
      sendMessage(){
       this.sendIndex++
       if(this.userId==-1){
         if(this.sendIndex<3){
           this.$message({
           message: '请选择聊天的用户',
           type: 'warning'
          });
         }
         return
       }else{
        this.sendIndex=0
        // 获取input框的内容
        let inputBox = document.getElementById('inputBox').innerHTML
        if(inputBox==''){
          this.$message({
            message: '不能发送空信息',
            type: 'warning'
          });
        }
        this.add("customer",inputBox,this.customerAvatar)  
        if(inputBox.match(/qqface\d{1,3}/)){
          let r = inputBox.match(/<img[^>]*?(src="[^"]*?")[^>]*?>/g)
          for(let i = 0; i<r.length;i++){
           inputBox = inputBox.replace(r[i],"#"+this.qqfaceList[r[i].match(/\d{1,3}/)[0]]+";")
          }
        }  
        this.sendSock(
           {
	            "code": "2",
	            "message": {
	            	toid: this.userId,             //接收者的id
	            	fromid: this.customerid,       //发送者的id
	            	type: "1",                     //0 接收人是客服  1 发送人是客服
                content: inputBox,
                token:window.localStorage.getItem('token') 
	            }
            },
            // this.getData
         )
         setTimeout(()=>{
           document.getElementById('inputBox').innerHTML=''
         },100)
       }
        
      },
      // 心跳
      heartbeat() {
        console.log("心跳");
        this.sendSock(
          {
	            "code": "0",
	            "message": {
                fromid: this.customerid,       //发送者的id
                type: "1", 
                token:window.localStorage.getItem('token') 
              }

          } ,
          this.getData        
        );
      },
      // 连接就绪
      connectReady(){
        console.log('连接就绪');
         this.sendSock(
          {
	            "code": "1",
	            "message": {
                fromid: this.customerid,       //发送者的id
                type: "1", 
                token:window.localStorage.getItem('token')  
	            }
          },
          this.getData       
        );
      },
      // 除拉取用户以外获取的数据
      getData(data){
        if(data.code=="0"){
          this.waitNum = data.message.content
        }else if(data.code=="2"){
          if(data.message.fromid==this.userId){
            // 显示在页面上
            var r=data.message.content.match(/\#[\u4E00-\u9FA5]{1,3}\;/g);
            if(r) {
              for (var index = 0; index < r.length; index++) {
                data.message.content=data.message.content.replace(r[index],this.emotion(r[index]));
              }
            } 
            this.add("user",data.message.content,data.message.avatar)
          }else{
            document.getElementById('client'+data.message.fromid).style.display="block"
            this.$message.info(data.message.username+"发来一条消息")
          }
        }
      },
      // 拉取用户获取的数据
      getDataPull(data){
        if(data.code=="2"){
          console.log(data);
          data.message.timestamp = formatterDateTime(new Date(data.message.timestamp))
          data.message.updateTime = data.message.timestamp
          data.message.userId = data.message.fromid
          this.userList.unshift(data.message)
          setTimeout(()=>{
            document.getElementById('client'+data.message.fromid).style.display="block"
          },100)
        }
      },
    // 拉取用户
    pullUser(){
      // console.log('拉取');
      this.sendSock(
        {
	          "code": "3",
	          "message": {
              fromid:this.customerid,
              type: "1", 
              token:window.localStorage.getItem('token')  
	          }
        },this.getDataPull
      )
    },
    // 动态添加组件
    add(component, text,avatar) {
      this.dialogs.push({
        'component': component,
        'text': text,
        "avatar":avatar
      })
    },
    // 光标移至最后
    keepLastIndex(obj) {
      if (window.getSelection) { //ie11 10 9 safari
        obj.focus(); 
        var range = window.getSelection();
        range.selectAllChildren(obj);
        range.collapseToEnd(); 
      } else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange();
        range.moveToElementText(obj); 
        range.collapse(false);
        range.select();
      }
    },
    // 实现inputBox的双向数据绑定
    handleInput($event){
      if (this.isLock) return
      setTimeout(() => {
        this.inputContent = $event.target.innerHTML
        // 去除换行符
        this.inputContent = this.inputContent.replace(/(\<\/?\w*\>)/g, '').replace(/(\r\n)|(\n)/g, '')
        this.$emit('input', {
          attr: this.attr,
          value: this.inputContent
        })
      }, 0)
      setTimeout(()=>{
        this.keepLastIndex($event.target)
      },5)
    },
    // 上传图片并发送
    upload(e){
      if(this.userId==-1){
         this.$message({
           message: '请选择聊天的用户',
           type: 'warning'
         });
         return
       }
      let files = e.target.files[0]
      this.imgDataUrl =URL.createObjectURL(files)
      // 上传
      var formData = new FormData();
      // 获取md5
      const bmf = new BMF();
      bmf.md5(
        files,
        (err, md5) => {
          formData.append("fileMd5",md5)
          formData.append("file",files)
          formData.append("objKeyName",files.name)
          this.$post('storage-web/storageObj/upload',formData).then(res=>{
            if(res.code=='000000'){
              let img = "<img src='"+res.data+"' alt='' class='chatImg' style='height:50px;'>"
              this.add("customer",img,this.customerAvatar)  
              this.sendSock(
                {
	                 "code": "2",
	                 "message": {
	                 	toid: this.userId,             //接收者的id
	                 	fromid: this.customerid,       //发送者的id
	                 	type: "1",                     //0 接收人是客服  1 发送人是客服
                     content: res.data,
                     token:window.localStorage.getItem('token') 
	                 }
                 }
              )
            }
          })
        }
      );   
    },
    // 将匹配结果替换表情图片
    emotion (res) {
      let word = res.replace(/\#|\;/gi,'')
      this.qqfaceList = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', '不', '好', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
      let index = this.qqfaceList.indexOf(word)
      // 要用img标签,不能用a
      return `<img src="/src/assets/images/spacer.gif" alt="" class="qqface qqface${index}">`
    },
    handleEmotion (i) {
      this.qqcontent += i
      document.getElementById('inputBox').innerHTML += i.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, this.emotion)
    },
    // main的滚动位置一直在最下面
    scrollToBottom: function () {
      this.$nextTick(() => {
        var mainBox = document.getElementById('mainBox');
        mainBox.scrollTop = mainBox.scrollHeight;
      })
    },
    // 获取聊天内容
    getContentList(item){
      document.getElementById('client'+item.userId).style.display="none"
      this.inputContent=''
      this.userId = item.userId
      const data = {
        customerid:this.customerid,
        pageNo:this.content.pageNo,
        pageSize:this.content.pageSize,
        userid:item.userId
      }
      this.dialogs = []
      this.contentList=[]
      this.clientName=''
      this.$get('user-web/im/message/list',data).then(res=>{
          this.content.total = res.data.total
          this.contentList = res.data.row
          this.contentShow = true
          this.clientName = item.username
          res.data.row.forEach(v=>{
            v.sendTime = formatterDateTime(v.sendTime)
          })
          let list = res.data.row.filter(v=>{
            if(v.type=="0"){
              return v
            }
          })
          list.reverse().forEach(v=>{
             var r=v.content.match(/\#[\u4E00-\u9FA5]{1,3}\;/g);
             if(r) {
                for (var index = 0; index < r.length; index++) {
                  v.content=v.content.replace(r[index],this.emotion(r[index]));
                }
             }
             this.add("user",v.content,v.avatar) 
          })
      })
    },
    // 获取聊天记录
    getContentList1(){
      const data = {
        customerid:this.customerid,
        pageNo:this.content.pageNo,
        pageSize:this.content.pageSize,
        userid:this.userId
      }
      this.contentList=[]
      this.$get('user-web/im/message/list',data).then(res=>{
          this.content.total = res.data.total
          res.data.row.forEach(v=>{
            v.sendTime = formatterDateTime(v.sendTime)
             var r=v.content.match(/\#[\u4E00-\u9FA5]{1,3}\;/g);
             if(r) {
                for (var index = 0; index < r.length; index++) {
                  v.content=v.content.replace(r[index],this.emotion(r[index]));
                }
             } 
          })
          this.contentList = res.data.row
          this.contentShow = true
      })
    },
    // 关闭聊天
    closeChat(item){
      this.userList.forEach((v,i)=>{
        if(v.userId==item.userId){
          this.userList.splice(i,1)
        } 
      })
      this.dialogs = []
      this.contentList=[]
      this.clientName=''
      this.sendSock(
          {
	            "code": "4",
	            "message": {
                  toid: item.userId,
                  fromid: this.customerid,       //发送者的id
                  type: "1", 
                  token:window.localStorage.getItem('token')   
	            }
          },
      )
    },
    // 显示聊天列表
    showContentList(){
       this.contentIndex++
       if(this.userId==-1){
         if(this.contentIndex<3){
          this.$message({
           message: '请选择用户',
           type: 'warning'
          });
         }
         return
       }else{
         this.contentIndex = 0
         this.contentListVisible=!this.contentListVisible
       }
    }
  },
  updated:function(){
    this.$nextTick(() => {
      var mainBox = document.getElementById('mainBox');
      mainBox.scrollTop = mainBox.scrollHeight;
    })
  },
  beforeDestroy () {
    // 清除监听中文输入
    const el = this.$refs.input
    el.removeEventListener('compositionstart', this.onCompositionstart, false)
    el.removeEventListener('compositionend', this.onCompositionend, false)
  },
  distroyed: function() {
    //  this.websock.close()
    clearInterval(window.timer);
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    clearInterval(window.timer);
    next();
  }
}
</script>

<style style="scss">
  .chatroom{
    height: 90%;
    padding: 0;
    margin: 0 30px;
  }
  .chatroom .el-container{
    height: 100%;
  }
  .chatroom .el-aside{
    background-color: #fafafa;
    position: relative;
  }
  .chatroom .el-pagination,.contentPagination{
    position: absolute;
    bottom: 0;
    right: 0px; 
  }
  .chatroom .el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev{
    background: transparent;
  }
  .chatroom .fa-smile-o,.chatroom .fa-commenting-o,.chatroom .fa-picture-o{
    font-size: 26px;
    color: #ccc;
  } 
  .tool{
    position: relative;
    height: 26px;
  }
  .tool .upload-demo{
    position: absolute;
    top: 0px;
    left:50px;
  }
  .tool .fa-commenting-o{
    position: absolute;
    top: 0px;
    left:105px;
  }
  .tool .fa-picture-o{
    position: absolute;
    top: 0px;
    left:50px;
  }
  .el-footer{
    position: relative;
  }
  .send{
    position: absolute;
    right: 15px;
    bottom: 15px;
  }
  .heart{
    height: 60px;
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
  }
  .clients{
    padding: 10px;
    position: relative;
  }
   .chatroom .avatar{
     width: 60px;
     height: 60px;
  }
  .clients .clientName{
    position: absolute;
    top: 10px;
    left: 80px;
  }
  .clients .time{
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
    color: #c5c5c6;
  }
  .clients .lastContent{
    position: absolute;
    bottom: 20px;
    left: 80px;
    font-size: 14px;
    color: #c5c5c6;
  }
  .clients:hover{
    background-color: #ebebec;
  }
   .clients:hover .close{display:block;}
  .pullUser{
    font-size: 20px;
    color: #409EFF;
  }
  .el-tooltip__popper{
    padding: 5px;
    left: 0;
  }
  .chatroom .inputBox{
    border: 1px solid transparent;
    margin-top:10px;
    width: 100%;
    height: 140px;
    padding: 0;
    outline: 0;
  }
  .chatroom .left{
    width: 50%;
    height: 50px;
    margin: 30px;
    margin-left: 0;
  }
  .leftBody{
    line-height: 30px;
    position: absolute;
    margin-left: 10px;
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 5px;
  }
  .dialogAvatar{
    width: 40px;
    height: 40px;
  }
  .dialogBox{
    position: relative;
  }
  .chatPopover {
    min-width: 400px;
  }
  .chatPopover .el-col-6{
    min-width: 30%;
  }
  .chatroom .right{
    width: 50%;
    height: 50px;
    margin: 30px;
  }
  .rightBody{
    line-height: 30px;
    margin-right: 10px;
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 5px;
    right: 50px;
    position: absolute;
  }
  .rightHeader{
    position: absolute;
    right: 10px;
  }
  .pullUserBox{
    width: 25px;
    height: 25px;
    position: absolute;
    right: 10px;
    font-size: 20px;
    color: #409EFF;
  }
  .faceContent{
    width: 380px;
    margin-top: -250px;
    margin-left:-40px ;  
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 5px #888888;
    border-radius: 10px;
  }
  .leftBodyContent{
    line-height: 30px;
    position: absolute;
    margin-left: 10px;
    border-radius: 10px;
    padding: 5px;
  }
  .el-icon-search{
    line-height: 35px;
  }
  .chatContentItem{
    height: 70px;
    border-top:1px solid #ccc;
    padding-top: 25px;
    box-sizing: border-box;
    position: relative;
  }
  .chatContentItem .clientName{
    position: absolute;
    top: 13px;
    left: 50px;
    font-size: 12px;
  }
  .chatContentItem .dialogAvatar{
    position: absolute;
    bottom: 15px;
  }
  .chatContentItem .leftBodyContent{
    position: absolute;
    left: 35px;
  }
  .chatContentItem .leftBodyContent .chatImg{
    position: absolute;
    top: -10px;
  }
  .el-popper .popper__arrow, .el-popper .popper__arrow::after{
    display: none;
  }
  .unread{
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    left: 10px;
    top: 5px;
    display: none;
  }
  .fa-close.close{
    position: absolute;
    right: 5px;
    top: 50%;
    color: #ccc;
    cursor: pointer;
    display: none;
  }
  .el-popover{
    height: 600px;
  }
  .sendTime{
    position: absolute;
    top: 13px;
    right: 10px;
  }
</style>

