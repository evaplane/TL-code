<template>
  <div :class="`bg-img-${typeMap[isCheckbox]}`" @click="clickHandle" class="checkbox-wrap" />
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import iconPortrait from '@/components/c2c/icon-portrait.vue';

@Component({
  components: {
    iconPortrait
  }
})
export default class Checkbox extends Vue {
  @Prop({ type: Boolean, default: true }) checked!: boolean;
  @Prop({ type: String, default: '' }) leftText!: string;

  isCheckbox: boolean = false;
  typeMap: object = {
    true: 'onSelect',
    false: 'unSelect'
  };

  @Emit('checkbox-click')
  clickHandle() {
    this.isCheckbox = !this.isCheckbox;
    return this.isCheckbox;
  }
}
</script>

<style lang='scss'>
.checkbox-wrap {
  width: 22px;
  height: 22px;
}

.bg-img-unSelect {
  background-image: url('~@img/c2c/unSelect-checkbox.png');
  background-size: cover;
}

.bg-img-onSelect {
  background-image: url('~@img/c2c/onSelect-checkbox.png');
  background-size: cover;
}
</style>
