<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-19 09:11:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-26 17:39:40
 -->
<template>
    <div class="lineUp">
        <el-table :data="tableData"
            width="100%">
        <el-table-column
            label="标签"
            min-width="40%">
            <template slot-scope="scope" >
                <span class="laberClass" :title="scope.row.name" :style="{backgroundColor:scope.row.bgColor}">{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="num"
            label="使用次数"
            min-width="40%">
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
.laberClass{
    max-width: 220px;
    position: relative;
    display: inline-block;
    padding: 4px 7px;
    margin-right: 5px;
    line-height: 1;
    font-size: 12px;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>