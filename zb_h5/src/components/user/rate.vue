<template>
  <div class="rate-wrap">
    <back :close="true" title="__('请给对方打分')" v-on="$listeners" />
    <div class="rate-wrap-content" v-loading="loading">
      <h2>__('请综合为您的服务方打分')</h2>
      <span class="gray-color">__('您的帮助可以共同提升服务质量')</span>
      <div class="rate">
        <van-rate allow-half color="#5fbe9a" size="50" v-model="params.score" void-color="#eee" void-icon="star" />
        <span>{{ params.score }}</span>
      </div>
      <span class="tips">__('附加留言')(__('可选项'))</span>
      <textarea name placeholder="__('随便写点什么')" rows="10" v-model="params.content" />
      <button @click="submit" class="submit" type="button" v-hover:hover-active-user>__('提交')</button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins, Emit } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { Rate as vanRate } from 'vant';
import { addComment, IAddCommentParams } from '@/api/community';
import { IUser } from '@/store/modules/user';
import { Getter } from 'vuex-class';
import mixinsOtcLogin from '@/mixins/otc/get-user-token';
import { login } from '@/components/popup/index';
@Component({
  components: {
    back,
    vanRate
  }
})
export default class Rate extends Mixins(mixinsOtcLogin) {
  @Getter('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  loading: boolean = false;
  params: IAddCommentParams = {
    orderId: '',
    commentUserId: '',
    commentedUserId: '',
    score: 0,
    content: ''
  };
  async submit() {
    try {
      if (!this.isLogin) {
        return login.open();
      }
      this.loading = true;
      this.params.orderId = this.$route.query.o as string;
      this.params.commentUserId = this.userInfo.userId;
      this.params.commentedUserId = this.$route.query.u as string;
      await addComment(this.params);
      this.$message.success('__("评价成功")');
      this.loading = false;
      this.close();
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }
  @Emit()
  close() {}
}
</script>
<style lang='scss'>
.rate-wrap {
  .rate-wrap-content {
    padding: var(--padding-lr);
    > h2 {
      color: #333;
      font-size: 20px;
      margin-bottom: 38px;
      @include dark {
        color: #d7dce2;
      }
    }
    > span {
      font-size: 14px;
    }
    .rate {
      margin: 38px 0;
      display: flex;
      align-items: center;
      > span {
        margin-left: 10px;
        font-size: 20px;
      }
    }
    .tips {
      display: block;
      line-height: 2;
    }
    > textarea {
      width: 100%;
      resize: none;
      border-radius: 4px;
      padding: 4px;
      border-color: var(--border-color);
    }
    .submit {
      color: #fff;
      font-size: 16px;
      margin: 10px 0;
      width: 100%;
      border: 0;
    }
  }
}
</style>
