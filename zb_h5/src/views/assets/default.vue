<template>
  <slider-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import sliderView from '@/components/common/slider-view/index.vue';
@Component({
  components: {
    sliderView
  }
})
export default class AssetsDefault1 extends Vue {}
</script>
<style lang="scss">
@import '@scss/assets.scss';
</style>
