<template>
  <svg class="zb-icon icon-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      d="M12 10.586l7.071-7.071a1 1 0 0 1 1.414 1.414L13.415 12l7.07 7.071a1 1 0 0 1-1.414 1.414L12 13.415l-7.071 7.07a1 1 0 1 1-1.414-1.414L10.585 12l-7.07-7.071a1 1 0 1 1 1.414-1.414L12 10.585z"
    />
  </svg>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Close extends Vue {}
</script>
