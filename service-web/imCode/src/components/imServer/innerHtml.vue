<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-10 18:46:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-05 20:24:42
 -->
<template>
    <div class="edit-div"
         v-html="innerText"
         ref="innerHtml"
         :contenteditable="canEdit"
         @focus="isLocked = true"
         @blur="changeText"
         @keydown="div_keydown"
         >
    </div>
</template>
<script>
export default{
  name:'oldDiv',
        props: {
          // 旧数据
          valueData:{
            type: String,
            default: ''
          },
          // 旧key
          valueDataString:{
            type: String,
            default: ''
          },
          value:{
            type: String,
            default: ''
          },
          // 旧数据对象
          visitorInformationData:{
            required: true,
            type: Object,
            default: ()=>{
              return {};
            }
          },
          userBlack:{
            type:Boolean,
            default:false
          },
          canEdit: {
              type: Boolean,
              default: true
          }
        },
        data(){
            return {
                innerText: this.valueData,
                isLocked: false,
            }
        },
        watch: {
            'value'(){
                // if (!this.isLocked || !this.innerText) {
                    this.innerText = this.value;
                // }
            },
        },
        methods: {
            div_keydown: function(e){
                if (e.keyCode == 13) {
                    e.returnValue = false;
                    return;
                }
            },
            changeText(){
              // 判断修改的值是否与旧数据一样
              let that = this;
              let reg = /[\ud800-\udbff][\udc00-\udfff]/g;
              let str = this.$el.innerHTML.replace(/&nbsp;/g,"");  //  去掉 nbsp;
              let str1 = str.replace(/\s+/g,"");  //  去掉空格;
              let newStr = str1.replace(/<[^>]+>/g, "");  //  去掉所有标签
            //   let arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
            //   newStr = newStr.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});  // 转义符 换成普通字符
              let sumLength = 0; //最大长度
              if(newStr != this.valueData){
                if(this.valueDataString == "clientName" || this.valueDataString == "customerAge" || this.valueDataString == "customerGender" ){
                  sumLength = 10;
                }else if(this.valueDataString == "customerPhone" || this.valueDataString == "customerWx" || this.valueDataString == "customerQq" || this.valueDataString == "customerEmail"){
                  sumLength = 20;
                }else if(this.valueDataString == "customerAddress" || this.valueDataString == "customerRemark"){
                  sumLength = 150;
                }else{
                  sumLength = 50;
                }
                if(newStr.length > sumLength){
                  this.$message1({
                      message: '最大长度不应超过'+sumLength,
                      type: 'error'
                  });
                  return;
                }
                if(str1 && reg.test(str1)){
                    this.$message1({
                        message: '格式不正确',
                        type: 'warning'
                    })
                    return false;
                }
                // this.$el.innerHTML = typeof(this.$el.innerHTML) == ''
                newStr = this.$ak.Utils.utf16toEntities(newStr);
                this.visitorInformationData[this.valueDataString] = newStr;

               this.$axios.post(this.$httpServer.saveOrUpdateClientInfo,this.visitorInformationData).then((res)=>{
                 console.log(this.userBlack)
                 console.log(this.visitorInformationData)
                //  this.$parent.loadingVisitorInformation(); //加载访客数据
                 this.$message1({
                    message: '修改成功',
                    type: 'success'
                });
                if(res && res.data.code == "0" && this.userBlack == true){
                  let params = {
                    visitorId:this.visitorInformationData.clientId,
                    ipAddress:this.visitorInformationData.clientIp,
                    attribution:this.visitorInformationData.clientProvince+' '+this.visitorInformationData.clientCity + ' ' + this.visitorInformationData.clientName
                  }
                  // console.log(params);
                   that.$axios.post(that.$httpServer.updateVisitor,params).then((res)=>{
                     console.log(res)
                   });
                 }
               })
              }
            }
        }
    }
</script>
