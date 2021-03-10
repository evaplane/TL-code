<template>
  <div class="appeal-detail-wrap">
    <div class="appeal-detail-nav">
      <app-bar title="订单申诉详情" />
      <div class="sponsor">
        <div class="order-num">
          <span>订单号</span>
          <span>{{ $route.params.orderId }}</span>
        </div>
        <div @click="appealTypeVisible = true" class="order-type">
          <span>申诉类型</span>
          <div class="select-type">
            <span>{{ appealType }}</span>
          </div>
        </div>
      </div>
    </div>
    <native-scroll class="appeal-detail">
      <ul>
        <li :key="item.addTime" v-for="item in appealDeatilList">
          <appeal-list
            :avatar="item.avatar"
            :content="item.content"
            :img-url="item.imgs"
            :time="item.addTime"
            :user-identity="item.userType"
            :user-name="item.userNickName"
          />
        </li>
      </ul>
    </native-scroll>
    <div class="sub-button-wrap">
      <div class="sub-button-content-white"></div>
      <div class="sub-button-content">
        <otc-button
          button-type="bigConfirm"
          @click.native="submitButton"
          text="上传凭证"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
// component
import { Uploader } from 'vant';
import appBar from '@/components/c2c/app-bar.vue';
import orderLog from '@/components/c2c/order-log.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import appealList from '@/components/c2c/appeal/appeal-list.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqAppealGetById, IAppealResponse, IAppealDetailsResponse } from '@/api/otc/appeal';
// mixins
import mixinsOtcAppeal from '@/mixins/otc/appeal';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

Vue.use(Uploader);
@Component({
  components: {
    helpDialog,
    orderLog,
    appBar,
    appealList,
    otcButton
  }
})
export default class AppealDetail extends Mixins(mixinsOtcAppeal, mixinsOtcGetUserToken) {
  appealTypeString: string = '请选择';
  appealDeatilList: IAppealDetailsResponse[] = [{
    addTime: '',
    avatar: null,
    content: '',
    imgs: '',
    userId: 0,
    userNickName: '',
    userType: '1'
  }];
  appealType: string = '';
  appealId: string = '';

  async created() {
    const reqAppealDetail: IAppealResponse = await reqAppealGetById(this.$route.params.orderId);
    this.appealDeatilList = reqAppealDetail.details;
    this.appealType = this.appealMap[reqAppealDetail.appealType];
    this.appealId = reqAppealDetail.appealId;
  }

  submitButton() {
    this.$router.push({ name: 'c2c-sponsor', params: { orderId: this.$route.params.orderId, appealId: this.appealId } });
  }
}
</script>

<style lang='scss'>
.appeal-detail-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .appeal-detail-nav {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .appeal-detail {
    padding-left: 15px;
    padding-right: 15px;
    flex: 1;
  }
  .text-area {
    border: none;
  }
  textarea::-webkit-input-placeholder {
    font-size: 13px;
    font-weight: 500;
    color: rgba(195, 206, 217, 1);
  }
  .sponsor {
    border-bottom: 6px solid var(--border-color); /* no */
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .order-num {
    width: 100%;
    padding: 27px 15px;
    display: flex;
    justify-content: space-between;
    span:first-child {
      font-size: 15px;
      font-weight: 400;
      color: #8d959f;
    }
    span:last-child {
      font-size: 15px;
      font-weight: 400;
      color: #27364a;
    }
  }
  .order-type {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color); /* no */
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 15px;
      font-weight: 400;
      color: #8d959f;
    }
    .select-type {
      display: flex;
      align-items: center;
      span {
        font-size: 15px;
        color: #27364a;
      }
    }
  }
  .sub-button-wrap {
    height: 87px;
    width: 100%;
    background: white;
    .sub-button-content-white {
      height: 87px;
      width: 100%;
      background: white;
    }
    .sub-button-content {
      padding-top: 8px;
      width: 100%;
      height: 87px;
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
