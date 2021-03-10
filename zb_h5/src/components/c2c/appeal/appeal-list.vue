<template>
  <div class="appeal-list-wrap">
    <div class="appeal-list-top">
      <div
        class="head-img"
      >{{ userName !== null ? userName.substring(0,1) : userIdentity === '1' ? '买' : '卖'}}</div>
      <div class="appeal-list-right">
        <div class="deal-name">
          <span>{{ userName }}</span>
          <div
            :class="userIdentity === '1' ? 'buy' : 'sell'"
            class="appeal-type"
          >{{ userIdentity === '1' ? '买家' : '卖家'}}</div>
        </div>
        <span class="time">{{ time }}</span>
      </div>
    </div>
    <div class="appeal-list-middle">{{ content }}</div>
    <div class="appeal-list-bottom">
      <div
        :key="index"
        @click="browseImg(imgUrl)"
        class="add-img-wrap"
        v-for="(imgUrl,index) in appealUrlArr"
      >
        <img :src="imgUrl" />
      </div>
      <div class="white-square" v-if="appealUrlArr.length !== 3"></div>
    </div>
    <van-popup type="primary" v-model="showBrowseImg">
      <img :src="bigImgUrl" class="open-img" />
    </van-popup>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})

export default class AppealList extends Vue {
  @Prop({ default: '', type: String }) avatar!: string;
  @Prop({ default: '', type: String }) userName!: string;
  @Prop({ default: '', type: String }) time!: string;
  @Prop({ default: '', type: String }) content!: string;
  @Prop({ default: '', type: String }) imgUrl!: string;
  @Prop({ default: '', type: String }) userIdentity !: string;

  appealType: string = '';
  showBrowseImg: boolean = false;
  bigImgUrl: string = '';

  get appealUrlArr(): any {
    let imgArr: any = this.imgUrl;
    imgArr = imgArr.split(',');
    return imgArr.slice(0, imgArr.length - 1);
  }

  browseImg(imgUrl: string) {
    this.showBrowseImg = true;
    this.bigImgUrl = imgUrl;
  }
}
</script>

<style lang='scss'>
.appeal-list-wrap {
  padding-bottom: 19px;
  padding-top: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  .appeal-list-top {
    display: flex;
  }
  .head-img {
    width: 42px;
    height: 42px;
    background: rgba(109, 134, 193, 1);
    border-radius: 50%;
    line-height: 42px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
  .appeal-list-right {
    padding-top: 3px;
    padding-bottom: 3px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .time {
      font-size: 12px;
      font-weight: 400;
      color: #c0c3d1;
    }
  }
  .deal-name {
    display: flex;
    span {
      font-size: 16px;
      font-weight: 500;
    }
    div {
      margin-left: 5px;
      line-height: 16px;
      text-align: center;
    }
  }
  .appeal-list-middle {
    padding-top: 21px;
    font-size: 13px;
    font-weight: 400;
    color: #27364a;
  }
  .appeal-list-bottom {
    width: 100%;
    padding-top: 15px;
    justify-content: space-between;
    display: flex;
  }
  .appeal-type {
    width: 34px;
    height: 16px;
  }
  .white-square {
    width: 108px;
    height: 108px;
  }
  .add-img-wrap {
    width: 108px;
    height: 108px;
    overflow: hidden;
    border-radius: 8px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .open-img {
    width: 256px;
  }
  .buy {
    width: 34px;
    height: 16px;
    background: rgba(252, 221, 227, 1);
    border-radius: 2px;
    font-size: 10px;
    font-weight: 400;
    color: rgba(233, 28, 65, 1);
  }
  .sell {
    width: 34px;
    height: 16px;
    background: rgba(229, 243, 229, 1);
    border-radius: 2px;
    font-size: 10px;
    font-weight: 400;
    color: rgba(76, 175, 80, 1);
  }
}
</style>
