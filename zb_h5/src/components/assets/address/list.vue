<template>
  <transition name="popup-bottom">
    <div @click="blurHandle" class="popup-bottom popup-selectAddress" v-if="visible" v-loading="loading">
      <div class="popup-head">
        <span @click="close" class="return-btn"></span>
        <h2>选择地址</h2>
        <span @click="addAddress" class="add-address">添加地址</span>
      </div>
      <div class="selectAddress-list">
        <div
          :class="{
            'selectAddress-item--left': index === modifyIndex,
            'selectAddress-item--active': index === selectIndex
          }"
          :key="item.id"
          @click="itemClickHandle(index, item)"
          class="selectAddress-item"
          v-for="(item, index) in list"
        >
          <div class="address">
            <p class="name">
              {{ item.memo }}
              <span :class="{ 'is-auth': item.isAuth }" class="auth-status">{{ item.isAuth ? '已认证' : '未认证' }}</span>
            </p>
            <p class="text">{{ item.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getCoinAddress, ICoinAddressItem, doDelBlock } from '@/api/assets';
import { IUpdateAddressItem } from '@/store/modules/assets';
import { Action } from 'vuex-class';
import { Dialog } from 'vant';
@Component
export default class AddressList extends Vue {
  @Prop({ type: String, default: '' }) private coinName!: string;
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: Function, default: null }) back!: Function;
  list: ICoinAddressItem[] = [];
  selectIndex: number = 0;
  modifyIndex: number = -1;
  loading: boolean = false;

  @Action('updateAddressItem', { namespace: 'assets' })
  updateAddressItem!: IUpdateAddressItem;

  get coinNameLower() {
    return (this.coinName || '').toLowerCase();
  }
  @Watch('visible', { immediate: true })
  _() {
    if (this.visible === true) {
      this.getList();
    }
  }

  itemClickHandle(index: number, item: ICoinAddressItem) {
    if (item.isAuth === false) {
      Dialog.confirm({
        message: '该地址尚未认证, 请查收邮件并在邮箱确认提币地址',
        confirmButtonText: '发送认证邮件'
      }).then(() => {});
      return;
    }
    this.selectIndex = index;
    this.updateAddressItem(item);
    this.close();
  }
  deleteHandle(item: ICoinAddressItem) {
    Dialog.confirm({ message: '是否删除该地址?' })
      .then(async () => {
        if (!this.coinNameLower || !item.id) {
          return this.$message.fail('数据异常, 删除失败');
        }
        this.loading = true;
        try {
          await doDelBlock(this.coinNameLower, item.id);
          this.$message.success('删除成功');
          this.getList();
        } catch (err) {
          console.log(err);
        }
        this.loading = false;
      })
      .catch(() => {});
  }
  blurHandle() {
    this.modifyIndex = -1;
  }
  async getList() {
    try {
      let { list } = await getCoinAddress(this.coinNameLower, false);
      if (list && list.length > 0) {
        list.map((item, index) => {
          // 找到列表中已经认证地址的第一个
          if (this.selectIndex < 0 && item.isAuth === true) {
            this.selectIndex = index;
          }
        });
      }
      this.list = list || [];
    } catch (err) {
      console.log(err);
    }
  }
  addAddress() {
    this.back('AddressForm');
  }
  close() {
    return this.back(-1);
  }
}
</script>

<style lang="scss">
.popup-selectAddress {
  .add-address {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--primary-color);
  }
  .selectAddress-item {
    border-radius: 4px; /* no */
    border: 1px solid rgba(0, 0, 0, 0.05); /* no */
    background-color: #fff;
    padding: 12px 15px;
    &:not(:first-of-type) {
      margin-top: 15px;
    }
  }
  .selectAddress-item--active {
    border-color: var(--primary-color);
  }
  .address {
    position: relative;
  }

  .name {
    @include bold;
    color: #313038;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .text {
    font-size: 12px;
    color: #73767b;
    margin-top: 5px;
  }
  .auth-status {
    color: #8e96a7;
    font-size: 10px;
    margin-left: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 3px;
    border-radius: 2px; /* no */
    &.is-auth {
      color: #fff;
      background-color: var(--primary-color);
    }
  }
}
</style>
