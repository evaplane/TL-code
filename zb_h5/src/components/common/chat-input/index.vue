<template>
  <div class="contenteditable-input">
    <textarea class="input" ref="input" rows="1" v-model="returnValue" v-on="listeners" warp="hard" @keydown="keydown"></textarea>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
@Component
export default class ContenteditableInput extends Vue {
  @Prop({ default: '', type: String }) value!: string;
  textareaHeight: number = 0;
  '$refs': {
    input: HTMLTextAreaElement;
  };
  get listeners() {
    return Object.assign(this.$listeners, {
      input() {}
    });
  }
  @Watch('returnValue')
  returnValueChanged(val: string) {
    if (val.length) {
      this.resize();
    } else {
      this.$refs.input.style.height = '32px';
    }
  }
  mounted() {
    this.resize();
    this.textareaHeight = this.$refs.input.scrollHeight;
  }
  keydown(e: IObj<any>) {
    if (e.key !== '@') return;
    this.at();
  }
  get returnValue() {
    return this.value;
  }
  set returnValue(val: string) {
    this.input(val);
  }
  @Emit()
  at() {}
  @Emit()
  input(val: string) {
    return val;
  }
  resize() {
    if (this.$refs.input) {
      this.$refs.input.style.height = '32px';
      if (this.$refs.input.scrollHeight <= 74) {
        this.$refs.input.style.height = this.$refs.input.scrollHeight + 'px';
      } else {
        this.$refs.input.style.height = '74px';
      }
    }
  }
}
</script>

<style lang='scss'>
.contenteditable-input {
  position: relative;
  // max-width: 70vw;
  .input {
    border-radius: 3px;
    color: var(--theme-color);
    padding: 7px 3px;
    font-size: 16px;
    overflow-y: auto;
    border: 1px solid #e5e5e8; /* no */
    width: 100%;
    resize: none;
    &::-webkit-scrollbar {
      display: none;
    }
    &:focus {
      outline: none;
    }
    @include dark {
      border-color: #464646;
    }
  }
}
</style>
