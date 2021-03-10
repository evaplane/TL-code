<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-08 10:01:40
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-28 10:51:32
 -->

<template>
  <!-- 对话标签 -->
  <div class="main">
    <h4>标签管理</h4>
    <ul class="conv-tag-list">
      <li>
        <header class="conv-tag-title">一级标签</header>
        <div class="conv-tag-list-item">
          <div class="conv-add-tag" @click="addConversationsTab('0')">
            <i class="el-icon-plus"></i>添加一级标签
          </div>
          <table class="table" v-if="primarylabelData.oneLevelData.length > 0">
            <colgroup><col><col width="100"></colgroup>
            <tbody>
              <tr v-for="(v,index) in primarylabelData.oneLevelData" :key="index">
                <td>
                  <div :title="v.lable" class="tag-item" :style="{backgroundColor: v.color}">
                   {{v.lable}}
                  </div>
                </td>
                <td>
                  <a @click="editConversationsTab(v.id,v.colorIndex,v.lable,v.parentId,'0')" class="conv-tag-edit">编辑</a>
                  <a @click="delTab(v.id)">删除</a></td>
              </tr>
            </tbody>
		      </table>
        </div>
      </li>
      <li>
        <header class="conv-tag-title">二级标签</header>
        <div class="conv-tag-list-item">
          <div class="conv-add-tag"  @click="addConversationsTab('1')">
            <i class="el-icon-plus"></i>添加二级标签
          </div>
          <table class="table" v-if="primarylabelData.twoLevelData.length > 0">
            <colgroup>
              <col>
              <col width="100">
            </colgroup>
            <tbody>
              <tr v-for="(v,index) in primarylabelData.twoLevelData" :key="index">
                <td>
                  <div :title="v.lable" class="tag-item" :style="{backgroundColor: v.color}">
                   {{v.lable}}
                  </div>
                </td>
                <td>
                  <a @click="editConversationsTab(v.id,v.colorIndex,v.lable,v.parentId,'1')" class="conv-tag-edit">编辑</a>
                  <a @click="delTab(v.id)">删除</a></td>
              </tr>
            </tbody>
		      </table>
        </div>
      </li>
      <li>
        <header class="conv-tag-title">三级标签</header>
        <div class="conv-tag-list-item">
          <div class="conv-add-tag" @click="addConversationsTab('2')">
            <i class="el-icon-plus"></i>添加三级标签

          </div>
          <table class="table" v-if="primarylabelData.threeLevelData.length > 0">
            <colgroup>
              <col>
              <col width="100">
            </colgroup>
            <tbody>
              <tr v-for="(v,index) in primarylabelData.threeLevelData" :key="index">
                <td>
                  <div :title="v.lable" class="tag-item" :style="{backgroundColor: v.color}">
                   {{v.lable}}
                  </div>
                </td>
                <td>
                  <a @click="editConversationsTab(v.id,v.colorIndex,v.lable,v.parentId,'2')" class="conv-tag-edit">编辑</a>
                  <a @click="delTab(v.id)">删除</a></td>
              </tr>
            </tbody>
		    </table>
        </div>

      </li>
    </ul>

    <addLable v-if="showAdd" :labelData="labelData" :type="'conversations'"></addLable>
    <addSublabe v-if="showAddSublabe" :editSublabeData="editSublabeData" :labelData="labelData" :typeLv="typeLv" ></addSublabe>
  </div>
</template>
<script>
import addLable from '../customerLabel/add'
import addSublabe from './addSublabe'
export default {
  data(){
    return{
      showAdd: false, // 是否显示一级新增弹框
      showAddSublabe: false, // 是否显示二级、三级级新增弹框
      colorLable:["#ffb652","#b59177","#6fd048","#9264cd","#fc7cb3","#ff8947","#00ce7d","#4ca0ff","#ff5c5e","#707070"], //标签颜色
      labelData:{
        type:'',
        active: -1,
        lableText: '',
        id:-1,
      }, //修改一级数据
      editSublabeData:{
        lableName: '', //标签名称
        parentName: '', //父级名称
      },//修改二级、三级数据
      typeLv: '2', //标签等级
      primarylabelData:{
        oneLevelData:[],
        twoLevelData:[],
        threeLevelData:[],
      }, //标签数据
    }
  },
  components: {
      addLable,
      addSublabe
  },
  mounted(){
    this.getLabele();
  },
  methods:{
    /**
     * 查询所有对话标签
     */
    getLabele(){
      // {
      //   id:1,
      //   lable:'aa',
      //   coloe:'#ffb652',
      // }
      let that = this;
       this.$axios.get(this.$httpServer.getTab).then((res)=>{
         that.primarylabelData={
            oneLevelData:[],
            twoLevelData:[],
            threeLevelData:[],
          }; //标签数据
          res.data.data.map((v,i)=>{
            let data = {
              id: v.id,
              lable: v.labelName,
              color: that.colorLable[parseInt(v.dialogueLabelType)],
              colorIndex: parseInt(v.dialogueLabelType),
              parentId:v.parentId
            }
            // 一级标签
            if(v.labelExp == 1){
              that.primarylabelData.oneLevelData.push(data);
            }else if(v.labelExp == 2){
              that.primarylabelData.twoLevelData.push(data);
            }else if(v.labelExp == 3){
              that.primarylabelData.threeLevelData.push(data);
            }
          })
       })
    },
    /**
     * 新增标签
     */
    addConversationsTab(v){

      // 新增一级标签
      if(v == '0'){
        this.addOrAddLabel();
      }else{
        // 新增二级、三级 标签
        this.typeLv = v;
        this.labelData = {
          type: 'add',
          id: '',
          active:'',
          lableText:''
        };
        this.editSublabeData = {
          lableName: '', //标签名称
          parentName: '', //父级名称
        }
        this.showAddSublabe = !this.showAddSublabe;
      }
    },
    /**
     * 编辑标签
     * ID,选中的颜色下标、名字、父级ID、标签等级
     */
    editConversationsTab(id,colorIndex,label,parseID,v){
      // 编辑一级标签
      if(v == '0'){
        this.editOrAddLabel(id,colorIndex,label);
      }else{
        this.labelData = {
          type: 'upd',
          id: id,
          active:'',
          lableText:''
        };
        // 编辑二级、三级 标签
        this.editSublabeData={
          lableName: label, //标签名称
          parentName: parseID, //父级名称
        };//修改二级、三级数据
        this.typeLv = v;
        this.showAddSublabe = !this.showAddSublabe;
      }
    },
    /**
     * 编辑一级标签
     */
    editOrAddLabel(id,colorIndex,label){
      this.labelData = {
        type: 'upd',
        id: id,
        active:colorIndex,
        lableText:label
      };
      this.showAdd = !this.showAdd;
    },
    /**
     * 新增、关闭一级顾客标签
     */
    addOrAddLabel(){
      this.labelData = {
        type: 'add',
        id:-1,
        active:0,
        lableText: ''
      };
      this.showAdd = !this.showAdd;
    },
    /**
     * 关闭新增二级、三级标签
     */
    closeAddSublabe(){
      this.showAddSublabe = !this.showAddSublabe;
    },
    /**
     *  删除
     */
    delTab(id){
      let that = this;
      this.$confirm('删除当前标签及其下一级标签内容，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(this.$httpServer.deleteTab+'/'+id).then((res)=>{
            that.getLabele();
            this.$message1({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(()=>{

        })
    }
  }
}
</script>
<style scoped>
  .main{
    display: flex;
    background-color: #fff;
    max-height: 100%;
    -ms-flex-direction: column;
    flex-direction: column;
    padding: 20px;
  }
  h4{
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin-top: 0;
    font-size: 16px;
    font-family: inherit;
    font-weight: 500;
    color: inherit;
  }
  .main .conv-tag-list{
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
        font-size: 14px;
  }
  .main .conv-tag-list li{
    -ms-flex: 1;
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    max-height: 100%;
    border-left: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
  }
  .main .conv-tag-list li{
    border-right: 1px solid #d8d8d8;
  }
  .main .conv-tag-list .conv-tag-title{
    color: #333;
    background-color: #e6e6e6;
    line-height: 45px;
    text-align: center;
  }
  .main .conv-tag-list  .conv-tag-list-item{
    padding: 20px;
    overflow: auto;
  }
  .main .conv-tag-list .conv-tag-list-item .conv-add-tag{
    display: inline-block;
    margin-bottom: 10px;
    color: #00a0e9;
    cursor: pointer;
  }
  .main .conv-tag-list .conv-tag-list-item .conv-add-tag .el-icon-plus{
    margin-right: 10px;
    font-size: 16px;
  }
  .table{
    width: 100%;
  }
  .table td{
    padding: 5px 0;
  }
  .table td .tag-item{
    /* float: left; */
    max-width: 180px;
    margin: 0;
    padding: 6px 14px;
    cursor: auto;
    line-height: normal;
    position: relative;
    display: inline-block;
    font-size: 12px;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    text-overflow: ellipsis;
    word-break: keep-all;
    overflow: hidden;

  }
  .conv-tag-edit{
    margin-right: 10px;
  }
  a, a:active, a:hover{
    color: #009de7;
    text-decoration: none;
    cursor: pointer;
  }

</style>
