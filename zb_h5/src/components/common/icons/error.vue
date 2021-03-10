<template>
  <svg class="zb-icon icon-error" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-2.4a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2zm1.697-9.6l3.606 3.606a1.2 1.2 0 0 1-1.697 1.697L12 13.697l-3.606 3.606a1.2 1.2 0 0 1-1.697-1.697L10.303 12 6.697 8.394a1.2 1.2 0 0 1 1.697-1.697L12 10.303l3.606-3.606a1.2 1.2 0 0 1 1.697 1.697L13.697 12z"
    />
  </svg>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Error extends Vue {}
</script>
