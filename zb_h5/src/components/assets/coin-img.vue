<template>
    <img :alt="coinName.substr(0,1)" v-icon="`./img/coins/${coinName.toLowerCase()}.svg`" />
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  components: {}
})
export default class AssetsCoinImg extends Vue {
    @Prop({
      type: String,
      default: 'ZB'
    }) coinName!: string;
}
</script>
