<template>
    <!-- 根节点 -->
    <router-view></router-view>
</template>

<script>

export default {
  name: 'app',
  created(){
    if (localStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(localStorage.getItem("store"))))
    }
    window.addEventListener("beforeunload",()=>{
      localStorage.setItem("store",JSON.stringify(this.$store.state))
    });
  }
}
</script>

<style>

</style>
