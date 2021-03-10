<template>
  <div class="icon-portrait-wrap">
    <img :src="`${imgUrl}`" :class="`f${size}`"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})

export default class IconPortrait extends Vue {
  @Prop({ type: String, default: '' }) imgUrl!: string;
  @Prop({ type: String, default: '' }) size!: string;
}
</script>

<style lang='scss'>
.icon-portrait-wrap {
  .f256{
    width: 256px;
    height: 256px;
  }

  .f108 {
    width: 108px;
    height: 108px;
  }

  .f98 {
    width: 98px;
    height: 98px;
  }

  .f96 {
    width: 96px;
    height: 96px;
  }

  .f80 {
    width: 80px;
    height: 80px;
  }
  .f66 {
    width: 66px;
    height: 66px;
  }

  .f50 {
    width: 50px;
    height: 50px;
  }
  .f42 {
    width: 42px;
    height: 42px;
  }

  .f38 {
    width: 38px;
    height: 38px;
  }
  .f37 {
    width: 37px;
    height: 37px;
  }
  .f34 {
    width: 34px;
    height: 34px;
  }
  .f28 {
    width: 28px;
    height: 28px;
  }

  .f22 {
    width: 22px;
    height: 22px;
  }
  .f16 {
    width: 16px;
    height: 16px;
  }
  .f12 {
    width: 12px;
    height: 12px;
  }
}
</style>
