<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-13 19:40:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-20 14:27:40
 -->
<template>
  <!-- 专用于设置页面菜单的组件，只需要配置data即可马上形成需要的菜单 -->
  <div class="configMenu">
      <div v-for="(tmp, i) in userMenus" :key="i">
        <ConfigParts :data="tmp"></ConfigParts>
      </div>
  </div>
</template>

<script>
import ConfigParts from "./configParts";

export default {
  components: {
    ConfigParts
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    userMenus() {
      let data = this.$store.imServerStore.state.userMenus, arr = []
      if (data.length) {
        data.forEach(element => {
          if(element.id == 8000) {
            arr = element.children
          }
        })
        arr = arr.filter(item => item.icon)
      }
      return arr
    }
  }
};
</script>

<style lang="less" scoped>
.configMenu {
  width: 924px;
  height: 100%;
  background-color: #f2f3f5;
  >div:nth-child(odd) {
    background: #fff;
  }
  >div:nth-child(even) {
    background: #fbfbfc;
  }
}
</style>
