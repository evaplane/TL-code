<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-19 09:11:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 18:06:38
 -->
<template>
    <div class="lineUp">
      <div class="lineUpSearch">

      </div>
        <el-table :data="tableData"
            width="100%">
          <el-table-column
              label="客服"
              min-width="24%">
              <el-table-column
                  label="工号"
                  prop="num"
                  min-width="24%">
              </el-table-column>
              <el-table-column
                  label="客服"
                  prop="num"
                  min-width="24%">
              </el-table-column>
              <el-table-column
                  label="所在分组"
                  prop="num"
                  min-width="24%">
              </el-table-column>
        </el-table-column>
        <el-table-column
            label="对话"
            min-width="24%">
            <el-table-column
                class="headClass"
                prop="num"
                label="总对话数"
                min-width="24%">
            </el-table-column>
            <el-table-column
                label="有效对话数"
                prop="num"
                min-width="24%">
            </el-table-column>
            <el-table-column
                label="总消息数"
                prop="num"
                min-width="24%">
            </el-table-column>
        </el-table-column>
        <el-table-column
            label="转接"
            min-width="24%">
            <el-table-column
                label="主动转接数"
                prop="num"
                min-width="24%">
            </el-table-column>
            <el-table-column
                label="被动转接次数"
                prop="num"
                min-width="24%">
            </el-table-column>
        </el-table-column>
        <el-table-column
            label="评价"
            min-width="24%">
            <el-table-column
                label="评价数/率"
                prop="num"
                min-width="24%">
            </el-table-column>
            <el-table-column
                label="好评数/率"
                prop="num"
                min-width="24%">
            </el-table-column>
             <el-table-column
                label="中评数/率"
                prop="num"
                min-width="24%">
            </el-table-column>
            <el-table-column
                label="差评/率"
                prop="num"
                min-width="24%">
            </el-table-column>
        </el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData:[],
            colorLable:["#ffb652","#b59177","#6fd048","#9264cd","#fc7cb3","#ff8947","#00ce7d","#4ca0ff","#ff5c5e","#707070"], //标签颜色
        };
    },
    props:["searchData"],
    methods: {
        /**
        * 查询所以顾客标签
        */
        getLabele(){
            let that = this;
            this.$axios.get(this.$httpServer.getLabele).then((res)=>{
                that.tableData = [];
                res.data.data.map((v,i)=>{
                let newData = {
                    index:parseInt(i)+1,
                    name:v.labelName, //标签名
                    id:v.id,  // 标签ID
                    num:v.labelUseCount == null?0:v.labelUseCount, // 标签使用次数
                    bgColor:that.colorLable[parseInt(v.labelStype)], //标签颜色
                    bgColorIndex:v.labelStype, // 标签颜色下标
                }
                this.tableData.push(newData)
                })
            })
        },
    },
    created() {
        this.getLabele();
    }
};
</script>

<style lang="less" scoped>
.lineUpSearch{
  line-height: 50px;
  background-color: #FFF;
  
}
</style>