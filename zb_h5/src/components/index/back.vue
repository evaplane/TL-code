<template>
  <div class="community-header" :class="{ 'community-header--active': shadow }">
    <div class="header-left">
      <icon-return @click="back" />
    </div>
    <h2 class="header-title">{{ title }}</h2>
    <slot />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
@Component
export default class Back extends Vue {
  @Prop({ default: '', type: String }) title!: string;
  @Prop({ default: false, type: Boolean }) close!: string;
  @Prop({ default: false, type: Boolean }) arrows!: boolean;
  @Prop({ default: false, type: Boolean }) shadow!: boolean;
  back() {
    if (this.close) {
      this.closeCom();
    } else {
      this.backPath();
      this.$router.go(-1);
    }
  }

  @Emit('close')
  closeCom() {
    return '';
  }

  @Emit('back')
  backPath() {
    return '';
  }
}
</script>
<style lang='scss'>
.community-header {
  flex: none;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
  background-color: #1b1924;
  color: #e2e1ea;
  border-bottom: 1px solid var(--line-color); /* no */
  .header-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    @include bold;
  }
}
</style>
