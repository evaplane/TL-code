<template>
  <div class="content-default">
    <main class="content">
      <router-view />
    </main>
    <tab-bar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TabBar from '@/components/layout/tab-bar.vue';
@Component({
  components: {
    TabBar
  }
})
export default class Default extends Vue {
  sliderMenu: string = '';
}
</script>

<style lang="scss">
.content-default {
  height: 100%;
  background-color: var(--default-bg);
  .content {
    height: calc(100% - 60px);
  }
}
</style>
