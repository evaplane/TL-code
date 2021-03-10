<template>
  <div class="expression-box">
    <native-scroll>
      <ul class="expression-ul">
        <li :key="item + index" @click="select(index)" v-for="(item, index) in expression">
          <img :src="item" />
        </li>
      </ul>
    </native-scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
import expression from '@/config/chat-expression';
@Component
export default class Expression extends Vue {
  expression: IObj<string> = {};
  mounted() {
    this.expression = expression;
  }
  @Emit()
  select(index: string) {
    return index;
  }
}
</script>
<style lang='scss'>
.expression-box {
  box-sizing: border-box;
  height: 100px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .expression-ul {
    padding: var(--padding-lr);
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    > li {
      padding: 5px 0;
      width: 30px;
      height: 40px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
