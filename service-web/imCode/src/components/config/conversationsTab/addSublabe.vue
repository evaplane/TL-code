<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-08 17:14:48
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-28 18:21:01
 -->
<template>
  <el-dialog
      :title="typeLv=='1'?'添加二级标签':'添加三级标签'"
      width="30%"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible="true"
      :before-close="close"
      center>
      <span>
        <section class="modal-body">
          <el-form :model="editSublabeData" :rules="rules" ref="ruleForm" label-width="100px" >
            <el-form-item label="标签名称" prop="lableName">
              <el-input maxlength="20" placeholder="最多二十个字符"  v-model="editSublabeData.lableName"></el-input>
            </el-form-item>
            <el-form-item label="父级标签" prop="parentName">
              <el-select v-model="editSublabeData.parentName" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>  
          <!-- <input type="text" maxlength="20" v-model="editSublabeData.lableName" class="form-control tag-content" :class="{prompting:prompting}" placeholder="最多二十个字符"> -->
          
        </section>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitAdd('editSublabeData')">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
export default {
  data(){
    return{
      prompting: false,
      options: [],
      rules:{
        lableName: [
            { required: true, message: '请输入标签名称', trigger: 'blur' }
          ],
        parentName: [
            { required: true, message: '请选择父级标签', trigger: 'change' }
        ]
      },
    }
  },
  props:{
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
    editSublabeData:{
       required: true,
        type: Object,
        default: {
          lableName: '', //标签名称
          parentName: '', //父级名称
        }
    },
    typeLv:{
      required: true,
      type: String,
      default: '1'
    }
  },
  mounted(){
    this.loadData();
  },
  methods:{
    /**
     * 加载父节点数据
     */

    loadData(){
     this.$axios.get(this.$httpServer.getTab+"?labelExp="+parseInt(this.typeLv)).then((res)=>{
       this.options = [];
       res.data.data.map((v,i)=>{
         let opt = {
           label:v.labelName,
           value:v.id
         };
         this.options.push(opt);
       })
     })
    },
    submitAdd(){
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
          let opt = {
            "labelName":this.editSublabeData.lableName.trim(),
            "labelExp": parseInt(this.typeLv)+1,
            "parentId": this.editSublabeData.parentName,
          };
          let url = "";
          if(this.labelData.type == "upd"){
            opt.id = this.labelData.id;
            url = this.$httpServer.updateTab;
          }else{
            url = this.$httpServer.saveTab;
          }
          this.$axios.post(url,opt).then((res)=>{
            if(res){
              this.$message1({
                message: '操作成功',
                type: 'success'
              });
              this.$parent.closeAddSublabe();
              this.$parent.getLabele();
            }
          })
        }
      })
      
      
    },
    close(){
      this.$parent.closeAddSublabe();
    }
  }

}
</script>
<style scoped>
  .modal-body{
    max-height: 348px;
    padding: 0 30px;
    overflow-y: auto;
    min-height: 100px;
    background-color: #fff;
  }
  .modal-body .form-control{
    display: block;
    width: 100%;
    height: 36px;
    padding: 4px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .modal-body .el-select{
    width: 100%;
  }

</style>
