<template>
  <div>
    <!-- 内容 -->
    <div class="content" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>新增</div></el-col>
        </el-row>
        <el-form :model="form" :rules="addDeptRules" ref="form" label-width="100px" style="padding:30px" class="demo-ruleForm">
            <el-form-item label="公告标题："  prop="noticeTitle" label-width="150px">
              <el-input  type="text" v-model="form.noticeTitle" autocomplete="off" style='width:300px;' placeholder="公告标题"></el-input>
            </el-form-item>
            <el-form-item label="公告类型：" prop="noticeType" label-width="150px">
              <el-select v-model="form.noticeType" placeholder="请选择" style='width:300px;'>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公告简介："  prop="noticeIntro" label-width="150px">
              <el-input  type="text" v-model="form.noticeIntro" autocomplete="off" style='width:300px;' placeholder="公告简介"></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" prop="noticeContent" label-width="150px">
              <el-input  type="textarea" v-model="form.noticeContent" autocomplete="off" style='width:300px;' placeholder="公告内容"></el-input>
            </el-form-item>
            <el-form-item label="公告链接：" prop="noticeImageUrl" label-width="150px">
              <el-input  type="text" v-model="form.noticeImageUrl" autocomplete="off" style='width:300px;' placeholder="公告链接"></el-input>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="2"><div class="grid-content"></div></el-col>
            <el-col :span="2"><div class="grid-content">
                <el-button type="primary" @click="deptAddSubmit('form')">保存</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                <el-button plain @click="backToDept">取消</el-button>
            </div></el-col>
          </el-row>
    </div>
  </div>
</template>

<script>
import {tree} from '../../../js/util'
import { setTimeout } from 'timers';
export default {
    name:'noticeAdd',
    data(){
        var validatorTitle = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入公告标题'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-16位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorDesc = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入公告简介'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-16位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorImgURL = (rule, value, callback) => {
            if (value === '') {
              callback();
            } else {
             const strRegex = '((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
              const reg = new RegExp(strRegex, 'i'); // 大小写不敏感
              if (!reg.test(value)) {
                callback(new Error('请输入以http://或https://开头的网址'));
              }
              callback();
            }
        };
        var validatorContent = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入公告内容'));
            } else {
              let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]{1,200}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-200位中英文及标点符号'));
              }
              callback();
            }
        };
        return {
            // 新增校验规则
            addDeptRules:{
                noticeTitle: [
                  {required: true,trigger: "change",validator:validatorTitle}
                ],
                noticeType: [
                  { required: true, message: '请选择公告类型', trigger: 'change' }
                ],
                noticeIntro: [
                    {required: true,trigger: "change",validator:validatorDesc}
                ],
                noticeImageUrl: [
                    {trigger: "change",validator:validatorImgURL}
                ],
                noticeContent: [
                    {required: true,trigger: "change",validator:validatorContent}
                ]
            },
            // 新增数据
            form:{
              noticeTitle:'',
              noticeType:'',
              noticeIntro:'',
              noticeImageUrl:'',
              noticeContent:''
            },
            options: [{
              value: '1',
              label: '网页内容'
            }, {
              value: '2',
              label: '网页地址'
            }],
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false
        }
    },
    created(){

    },
    methods:{
        // 返回
        backToDept(){
            this.$router.push('/modules/basicConfiguration/notice.html')
        },
        // 菜单新增保存
        deptAddSubmit(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.form)
              const data = {
                noticeTitle:this.form.noticeTitle,
                noticeIntro:this.form.noticeIntro,
                noticeImageUrl:this.form.noticeImageUrl,
                noticeContent:this.form.noticeContent,
                noticeType:Number(this.form.noticeType)
              };
              this.$post("common-web/notice/saveNotice",data).then(res=>{
                if(res.code=='000000'){
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                  this.$router.push('/modules/basicConfiguration/notice.html')
                }else{
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  });
                }
              })
            } else {
              this.$message.error('输入格式不正确');
              return false;
            }
          });
        },
        handleRemove(file) {
          console.log(file);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        handleDownload(file) {
          console.log(file);
        }
    }
}
</script>

<style style='scss'>
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
    .el-input-number{
        width: 300px;
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
        bottom: 2px;
        height: 18px;
    }
    .el-input-number.is-controls-right .el-input-number__increase{
        top: 3px;
        height: 18px;
    }
</style>
