<template>
  <div
    :class="{ 'line-span-border-bottom':borderBottom }"
    :data-clipboard-text="content"
    @click="pasteHandle"
    class="line-span-wrap order-copy"
    data-clipboard-action="copy"
  >
    <span>{{ title }}</span>
    <span>{{ content }}</span>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Clipboard from 'clipboard';

@Component({
  components: {
  }
})

export default class LineSpan extends Vue {
  @Prop({ default: '', type: String }) title!: string;
  @Prop({ default: '', type: String }) content!: string;
  @Prop({ default: true, type: Boolean }) borderBottom!: boolean;
  @Prop({ default: false, type: Boolean }) isCopy!: boolean;

  pasteHandle() {
    if (!this.isCopy) return;
    let clipboard = new Clipboard('.order-copy');
    clipboard.on('success', () => {
      this.$message.success('__("复制成功")');
    });
    clipboard.on('error', () => {
      this.$message.fail('__("复制失败,请手动复制")');
    });
  }
}
</script>

<style lang='scss'>
.line-span-wrap {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.line-span-border-bottom {
    border-bottom: 0.5px solid #f7f8fe;
  }
  span:first-child {
    font-size: 14px;
    color: #000;
    font-weight: normal;
  }
  span:last-child {
    font-size: 16px;
    color: #000;
    font-weight: bold;
  }
}
</style>
