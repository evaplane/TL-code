<template>
  <div class="user-page">
    <router-view/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  }
})

export default class UserIndex extends Vue {
}
</script>

<style lang="scss">
.user-page {
  background-color: var(--default-bg);
  height: 100%;
  position: relative;
  padding: 0 30px;
}
</style>
