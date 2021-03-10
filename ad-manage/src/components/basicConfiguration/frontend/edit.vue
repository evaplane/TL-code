<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content" style='color:#606266'>修改</div></el-col>
          </el-row>
        <el-form :model="form" :rules="addDeptRules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="参数编码："  prop="paramCode" label-width="150px">
              <el-input  type="text" v-model="form.paramCode" autocomplete="off" placeholder="参数编码"></el-input>
            </el-form-item>
            <el-form-item label="参数名称："  prop="paramName" label-width="150px">
              <el-input  type="text" v-model="form.paramName" autocomplete="off" placeholder="参数名称"></el-input>
            </el-form-item>
            <el-form-item label="参数值："  prop="paramValue" label-width="150px">
              <el-input  type="text" v-model="form.paramValue" autocomplete="off" placeholder="参数值"></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop="description" label-width="150px">
              <el-input  type="textarea" v-model="form.description" autocomplete="off" placeholder="描述"></el-input>
            </el-form-item>
          </el-form>
          <el-row class='inner-button'>
            <el-col :span="2"><div class="grid-content">
                <el-button plain @click="backToFrontend">取消</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                <el-button type="primary" @click="deptAddSubmit('form')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
  </div>
</template>

<script>
import {tree,delSelectTag} from '../../../js/util'
import { setTimeout } from 'timers';
export default {
    name:'frontendEdit',
    data(){
        var validatorEncoded = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入参数编码'));
            } else {
              var reg = /^[A-Z_]{1,64}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-64位大写字母及下划线'));
              }
              callback();
            }
        };
        var validatorName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入参数名称'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-16位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorCode = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入参数值'));
            } else {
              var reg = /^[\s\S]{1,255}$/;
              if (!reg.test(value)) {
                callback(new Error('只能输入1-255位请参数值'));
              }else{
                if(value.match(/^\s+$/)){
                  callback(new Error('禁止只输入空格'));
                }
              }
              callback();
            };
        };
        var validatorDesc = (rule, value, callback) => {
            if (value === '') {
              callback();
            } else {
              var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]{1,200}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-200位中英文及标点符号'));
              }else{
                if(value.match(/^\s+$/)){
                  callback(new Error('禁止只输入空格'));
                }
              }
              callback();
            }
        };
        return {
            // 新增校验规则
            addDeptRules:{
                paramCode: [
                    {required: true,trigger: "change",validator:validatorEncoded}
                ],
                paramName: [
                    {required: true,trigger: "change",validator:validatorName}
                ],
                paramValue: [
                    {required: true,trigger: "change",validator:validatorCode}
                ],
                description: [
                    {trigger: "blur",validator:validatorDesc}
                ]
            },
            // 新增数据
            form:{
                description:'',
                paramCode:'',
                paramName:'',
                paramValue:'',

            },
        }
    },
    created(){
      this.form = Object.assign(this.form,this.$route.query);
      console.log(this.form)
    },
    methods:{
        // 返回
        backToFrontend(){
            delSelectTag(this.$route)
            this.$router.history.go(-1);
        },
        // 菜单新增保存
        deptAddSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                const data = {
                  paramName:this.form.paramName,
                  paramCode:this.form.paramCode,
                  paramValue:this.form.paramValue,
                  id:this.form.id,
                  description:this.form.description,
                };
                this.$post("common-web/frontConfig/updateConfig",data).then(res=>{
                    console.log(res);
                    if(res.code=='000000'){
                      this.$message({
                        message: '修改成功',
                        type: 'success'
                      });
                      this.backToFrontend()
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
