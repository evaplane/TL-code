<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-12 09:53:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 18:09:40
 -->
<template>
    <div class="report">
        <div class="header">
            <div class="title" v-if="!$route.meta.title">
                报表
            </div>
            <router-link :to="$route.meta.back" v-else>
                <span class="el-icon-arrow-left"></span>
                <span>{{$route.meta.title}}</span>
            </router-link>
            <!-- 是否展示服务量筛选 -->
            <checkTime v-if="$route.name == 'dialogStatistics' || $route.name == 'volume' || $route.name == 'evaluation' || $route.name == 'visitConversation' || $route.name == 'agentStatus'" @checkData="checkData"></checkTime>
            <volumeTimeSearch v-if="$route.name == 'volume'"></volumeTimeSearch>
        </div>
        <div class="body">
            <router-view :searchData="searchData" ></router-view>
        </div>
    </div>
</template>

<script>
import volumeTimeSearch from './volume/volumeTimeSearch'
import checkTime from './common/checkTime'
export default {
    components: {
        volumeTimeSearch,
        checkTime
    },
    data(){
        return{
            searchData:[],
        }
    },
    methods:{
        // 选择时间
        checkData(t){
            this.searchData = t;
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../common/css/base.less";

.report {
  width: 100%;
  height: 100%;
  margin-left: 70px;
  background-color: #f2f3f5;
  overflow-y: auto;
  overflow-x: hidden;
  .header {
    line-height: 60px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #e0e1e3;
    font-size: 16px;
    color: #323c42;
    padding-left: 30px;
  }
  .body {
    padding: 30px 90px 30px 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    overflow-y: auto;
  }
}
a span {
    font-size: 18px;
    vertical-align: middle;
}

</style>

