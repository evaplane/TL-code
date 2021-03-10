<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-20 11:45:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-28 18:21:53
 -->
<template>
  <div>
    <!-- :before-close="close" -->
    <el-dialog
      :title="type=='customer'?'添加新标签':'添加一级标签'"
      width="30%"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible="true"
      :before-close="close"
      center>
      <span>
        <div class="modal-body">
          <div class="tag-tagColors">
            <div class="tag-colorBox" v-for="(v,index) in color" :key="index">
              <div :style="{backgroundColor:v}" class="tag-goldenrod" :class="{active:labelData.active==index}" @click="choLabel(index)"></div>
            </div>
          </div>
          <div class="tagForm">
            <input type="text" maxlength="20" v-model="labelData.lableText" @focus="closeCrompting" :class="{prompting:prompting}" class="form-control tag-content" placeholder="最多20个字符标签内容">
          </div>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      prompting:false,
      color:["#ffb652","#b59177","#6fd048","#9264cd","#fc7cb3","#ff8947","#00ce7d","#4ca0ff","#ff5c5e","#707070"], //标签颜色
    }
  },
  props: {
    labelData: {
        required: true,
        type: Object,
        default: {
            id: -1,
            active: -1,
            lableText: '',
            type:''
        }
    },
    type:{
      required: true,
      type: String,
      default: ''
    }
  },
  methods:{
    /**
     * 选择标签样式
     */
    choLabel(index){
      this.labelData.active = index;
    },
    /**
     * 关闭
     */
    close(){
      this.$parent.addOrAddLabel();
    },
    closeCrompting(){
      this.prompting = false;
    },
    /**
     * 提交
     */
    submitAdd(){
      if(this.labelData.lableText.trim() == ''){
        this.prompting = true;
        return;
      }
      let url = '';
      let opt = {};
      // 顾客标签
      if(this.type=='customer'){
        opt ={
          "labelName": this.labelData.lableText,
          "labelStype": this.labelData.active.toString(),
        }
        if(this.labelData.type == 'upd'){
          opt.id = this.labelData.id;
          url = this.$httpServer.updateLabel
        }else{
          url = this.$httpServer.addSaveLabel
        }
      }else{
        opt ={
          "labelName":this.labelData.lableText,
          "dialogueLabelType": this.labelData.active.toString(),
          "labelExp": 1,
          "parentId": 0,
        }
        if(this.labelData.type == 'upd'){
          opt.id = this.labelData.id;
          url = this.$httpServer.updateTab
        }else{
          url = this.$httpServer.saveTab
        }
      }
      this.$axios.post(url,opt).then((res)=>{
        if(res){
          this.$message1({
            message: '操作成功',
            type: 'success'
          });
          this.$parent.addOrAddLabel();
          this.$parent.getLabele();
        }

          

      })
    }
  }
}
</script>
<style scoped>
  .modal-body{
    max-height: 338px;
    overflow:hidden;
    background-color: #fff;
  }
  .modal-body .tag-tagColors{
    overflow: hidden;
    zoom: 1;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }
  .modal-body .tag-tagColors .tag-colorBox{
      float: left;
      width: 50px;
      height: 50px;
      padding-top: 10px;
      cursor: pointer;
      display: flex;
  }
  .modal-body .tag-tagColors .tag-colorBox .tag-goldenrod{
    height: 30px;
    width: 30px;
    margin: auto;
    border-radius: 5px;
  }
  .modal-body .tag-tagColors .tag-colorBox .tag-goldenrod.active{
    height: 40px;
    width: 40px;
  }
  .modal-body .tagForm{
    display: flex;
    justify-content: center;
  }
  .modal-body .tagForm .form-control{
    display: block;
    width: 90%;
    height: 30px;
    padding: 4px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    /* outline-style: none; */
  }
  .modal-body .tagForm .form-control.prompting{
      border-color: red;
      box-shadow: none;
  }
</style>
