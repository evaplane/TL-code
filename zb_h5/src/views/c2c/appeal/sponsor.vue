<template>
  <native-scroll class="sponsor-wrap">
    <div class="sponsor-content">
      <app-bar title="发起申诉" />
      <div class="sponsor">
        <div class="order-num">
          <span>订单号</span>
          <span>{{ $route.params.orderId }}</span>
        </div>
        <div @click="appealTypeVisible = true" class="order-type" v-if="appealDetail.status !== 5">
          <span>申诉类型</span>
          <div class="select-type">
            <span>{{ appealTypeString }}</span>
            <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
          </div>
        </div>
        <div class="message">
          <div class="message-title">问题描述</div>
          <textarea
            class="text-area"
            cols="30"
            placeholder="请描述您遇到的问题（必填）"
            rows="5"
            v-model="appealParams.content"
          ></textarea>
          <div class="certificate">
            <p>凭证照片</p>
            <div class="pay-img-wrap">
              <ul class="img-list-ul">
                <li :key="index" @click="delImg" v-for="item, index in imgArr">
                  <img :src="item" class="show-img" />
                </li>
              </ul>
              <van-uploader :after-read="setUserAvatar" class="add-pay-img-wrap">
                <div :class="{ none: imgArr.length === 3}" class="add-pay-img">
                  <icon-portrait :img-url="require('@img/c2c/payment/add-pay-img.png')" size="108" />
                </div>
              </van-uploader>
            </div>
          </div>
        </div>
        <otc-button
          button-type="bigConfirm"
          @click.native="submitButton"
          :text="appealDetail.status === 5 ? '上传凭证' : '发起申诉'"
        />
      </div>
    </div>
    <!-- 币种类型 -->
    <van-action-sheet
      :actions="appealTypeArr"
      :lazy-render="false"
      @select="appealTypeSelect"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="appealTypeVisible"
    />
  </native-scroll>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
// component
import { Uploader } from 'vant';
import appBar from '@/components/c2c/app-bar.vue';
import orderLog from '@/components/c2c/order-log.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqGetOrderById } from '@/api/otc/order';
import { reqAddAppeal, reqAddCertificate } from '@/api/otc/appeal';
// mixins
import mixinsOtcAppeal from '@/mixins/otc/appeal';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
// enums
import { EOtcAppeal as EAppealType } from '@/config/enums';

interface IAppealTypeItem {
  key: number;
  name: string;
}

Vue.use(Uploader);
@Component({
  components: {
    helpDialog,
    orderLog,
    appBar,
    iconPortrait,
    otcButton
  }
})
export default class Sponsor extends Mixins(mixinsOtcAppeal, mixinsOtcGetUserToken) {
  userAvatar: string = '';
  appealTypeVisible: boolean = false;
  appealTypeString: string = '请选择';
  appealParams: any = {
    orderId: '',
    appealType: '',
    content: ''
  };
  appealDetail: any = {};
  imgArr: any = [];
  saveImgFile: any = [];

  async mounted() {
    let res = await reqGetOrderById(this.$route.params.orderId);
    this.appealDetail = res;
  }

  setUserAvatar(file: any) {
    this.userAvatar = file.content;
    this.saveImgFile.push(file.file);
    this.imgArr = this.imgArr.concat(file.content);
  }

  delImg(index: number) {
    this.imgArr.splice(index, 1);
    this.saveImgFile.splice(index, 1);
  }

  async submitButton() {
    if (this.isVerification()) {
      let param = new FormData();
      param.append('orderId', this.$route.params.orderId);
      this.saveImgFile.forEach((item: any, index: number) => {
        param.append(`file${index}`, this.saveImgFile[index]);
      });
      if (this.appealDetail.status === 5) {
        param.append('appealId', this.$route.params.appealId);
        param.append('content', this.appealParams.content);
        await reqAddCertificate(param);
        this.$router.replace({ name: 'c2c-appeal-detail', params: { orderId: this.$route.params.orderId } });
      } else {
        try {
          param.append('appealType', this.appealParams.appealType);
          param.append('content', this.appealParams.content);
          await reqAddAppeal(param);
          this.$router.replace({ name: 'c2c-appeal-detail', params: { orderId: this.$route.params.orderId } });
        } catch (e) {
          if (e.resMsg && e.resMsg.code === 'AP0007') {
            this.$message.fail(e.resMsg.message);
            this.$router.replace({ name: 'c2c-order-seller', params: { orderId: this.$route.params.orderId } });
          }
        }
      }
    }
  }
  appealTypeSelect(value: IAppealTypeItem) {
    this.appealTypeVisible = false;
    this.appealTypeString = value.name;
    this.appealParams.appealType = value.key;
  }

  get appealTypeArr() {
    let appeal: IAppealTypeItem[] = [];
    Object.values(EAppealType).map(item => {
      let key = item as number;
      if (key > 0) {
        appeal.push({ name: this.appealMap[key], key });
      }
    });
    return appeal;
  }

  isVerification(): boolean {
    if (this.appealParams.appealType === '' && this.appealDetail.status !== 5) {
      this.$message.warn('申诉类型不能为空');
      return false;
    }
    if (this.appealParams.content === '') {
      this.$message.warn('申诉内容不能为空');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.sponsor-wrap {
  height: 100%;
  .sponsor-content {
    height: 100%;
    display: flex;
    flex-direction: column;
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
    padding-bottom: 33px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .order-num {
    width: 100%;
    padding: 27px 15px 0 15px;
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
    border-bottom: 1px solid var(--border-color); /* no */
    padding: 27px 15px 15px 15px;
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
    }
  }
  .message {
    width: 100%;
    padding: 15px;
    flex: 1;
    .message-title {
      padding-top: 15px;
      padding-bottom: 15px;
      font-size: 15px;
      font-weight: 400;
      color: #8d959f;
    }
    textarea {
      width: 100%;
      height: 65px;
    }
  }
  .certificate {
    border-top: 6px solid var(--border-color); /* no */
    padding: 15px 0 15px 0;
    p {
      padding-bottom: 10px;
      font-size: 15px;
      font-weight: 400;
      color: #8d959f;
    }
  }
  .pay-img-wrap {
    display: flex;
    flex: 1;
    align-items: center;
  }
  .add-pay-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      padding-top: 13px;
      font-size: 11px;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
  }

  .show-img {
    width: 108px;
    height: 108px;
    border-radius: 6px;
  }
  .none {
    display: none;
  }
  .add-pay-img-wrap {
    width: 108px;
    height: 108px;
  }
  .img-list-ul {
    li {
      margin-right: 6px;
    }
    display: flex;
  }
}
</style>
