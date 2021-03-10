<template>
  <div class="config">
    <div class="visitor-visitor">
      <div class="header">
        <div class="title" v-if="!$route.meta.back">设置</div>
        <router-link :to="$route.meta.back" v-else>
          <span class="el-icon-arrow-left"></span>
          <span>{{$route.meta.title}}</span>
        </router-link>
      </div>
      <div class="body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="less" scoped>
@import "../../common/css/base.less";

.config {
  width: calc(~'100% - 70px' );
  height: 100%;
  margin-left: 70px;
  background-color: #f2f3f5;
  overflow-y: auto;
  overflow-x: hidden;
  .visitor-visitor {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .header {
      line-height: 60px;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e0e1e3;
      font-size: 16px;
      color: #323c42;
      padding-left: 30px;
      display: flex;
    }
    .body {
      padding: 30px 90px 30px 20px;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
    }
  }
}
a span {
  font-size: 18px;
  vertical-align: middle;
}
</style>

