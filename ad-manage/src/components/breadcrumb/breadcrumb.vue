<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{firstLevelPageMenu}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{secondLevelPageMenu}}</el-breadcrumb-item>
   </el-breadcrumb>
  </div>
</template>

<script>

export default {
  name: 'breadcrumb',
  props: ['firstLevelPageMenu', 'secondLevelPageMenu'],
  data() {
    return {
    }
  },
  methods: {
   
  }
}
</script>

<style>
</style>
