<template>
  <div class="home">
    <top></top>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import top from '@/components/main/top.vue'

export default {
  name: 'home',
  data(){
    return {
      isLogin:false
    }
  },
  components: {
    top
  },
}
</script>
<style>

</style>

