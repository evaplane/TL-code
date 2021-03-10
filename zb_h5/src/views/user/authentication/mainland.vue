<template>
  <div v-loading="loading" class="authentication-mainland">
    <back title="__('实名认证')" :close="true" @close="closeClickHanlde"/>
    <iframe v-if="url" :src="url" sandbox="allow-forms allow-scripts allow-same-origin allow-popups"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';

import { getFaceIdToken } from '@/api/user';
@Component({
  components: {
    back
  }
})
export default class Authentication extends Vue {
  url: string = '';
  loading: boolean = false;
  async getFaceIdToken() {
    try {
      this.loading = true;
      const res = await getFaceIdToken();
      this.url = res.url;
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }
  closeClickHanlde() {
    // const router = this.$router.resolve({
    //   name: 'user-authentication-list'
    // });
    // window.location.replace(router.href);
    window.close();
  }

  mounted () {
    this.getFaceIdToken();
  }
}
</script>

<style lang="scss">
.authentication-mainland{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  iframe{
    width: 100%;
    height: 100%;
    flex: 1;
    border: none;
  }
}
</style>
