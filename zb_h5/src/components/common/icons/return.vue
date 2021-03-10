<template>
  <svg v-on="$listeners" class="zb-icon icon-return" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M11.707 2.808a1 1 0 0 1 0 1.414L4.93 11H21a1 1 0 0 1 0 2H4.929l6.778 6.778a1 1 0 0 1-1.414 1.414l-8.485-8.485a1 1 0 0 1 0-1.414l8.485-8.485a1 1 0 0 1 1.414 0z"/></svg>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Return extends Vue {}
</script>
