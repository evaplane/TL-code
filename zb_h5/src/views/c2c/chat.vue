<template>
  <div :class="{ keyborard: keyborard }" class="chat-wrap">
    <native-scroll @click.native="toolsVisible = ''" class="chat-msg">
      <template v-if="list.length">
        <div class="chat-wrap-item" v-for="(data, index) in list" :key="data.historyTime">
          <span class="history-time">{{ historyTime(data, list[index - 1]) }}</span>
          <span class="system" v-if="data.type === 0">{{ data.msg_content }}</span>
          <div class="self" v-if="data.type === 1 && !data.handle">
            <p @click.stop="detail(data)" v-html="data.msg_content" />
            <img class="van-image" v-img="{ src: `${selfAvatar}`, err: require('@/assets/img/chat/defaultHead.jpg') }" />
          </div>
          <div class="other" v-if="data.type === 2 && !data.handle">
            <img
              class="van-image"
              v-img="{ src: `${chatImg}&user_uid=${data.user_uid}`, err: require('@/assets/img/chat/defaultHead.jpg') }"
            />
            <p @click.stop="detail(data)" v-html="data.msg_content" />
          </div>
          <div :class="data.type === 1 ? 'self handle-self' : 'other'" class="service" v-if="data.handle">
            <img
              class="van-image"
              v-img="{
                src: `${data.type === 1 ? selfAvatar : `${chatImg}&user_uid=${data.user_uid}`}`,
                err: require('@/assets/img/chat/defaultHead.jpg')
              }"
            />
            <div :style="{ backgroundColor: data.bgColor }" class="handle-right">
              <span
                :style="{
                  borderLeft: data.type == 1 ? `4px solid ${data.bgColor}` : '0',
                  borderRight: data.type == 1 ? '0' : `4px solid ${data.bgColor}`
                }"
                class="arrow"
              />
              <img :src="data.iconUrl" />
              <div class="handle-text">
                <p>{{ data.title }}</p>
                <p>
                  {{ data.desc }}
                  <a @click="handleJump(data.handle)">{{ handleText(data.handle) }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </native-scroll>
    <div class="chat-form">
      <div class="chat-bar">
        <chat-input @at="at" @blur="blur" @focus="focus" class="chat-inp" ref="chatInput" v-model="enterText" />
        <div class="chat-handel">
          <van-button @click="toolsClickHandle('expression')" class="input-btn input-expression">
            <i class="zbicon-zbicon-emoji" />
          </van-button>
          <transition name="handle">
            <van-button
              @click="keydownHandle"
              class="input-submit"
              key="1"
              size="small"
              type="primary"
              v-if="enterText.length || !this.$route.query.o"
              >__('发送')</van-button
            >
          </transition>
          <transition mode="in-out" name="handle-add">
            <van-button
              @click="toolsClickHandle('other')"
              class="input-btn add-btn"
              key="other"
              v-if="!enterText.length && this.$route.query.o"
            >
              <i class="zbicon-zbicon-gather" />
            </van-button>
          </transition>
        </div>
      </div>
      <transition name="tools">
        <expression @select="expressionSelect" v-if="toolsVisible === 'expression'" />
        <div class="chat-tools" v-if="toolsVisible === 'other'">
          <span class="gray-color empty" v-if="toolsVisible === 'other' && !pluginList.length">__('暂无数据')</span>
          <div :key="item.pluginId" @click="handle(item)" class="tools-item" v-for="item in pluginList">
            <img :src="item.iconUrl" />
            <p>{{ item.pluginName }}</p>
          </div>
        </div>
      </transition>
    </div>
    <van-image-preview :images="images" :showIndex="false" v-model="imageShow"></van-image-preview>
    <van-popup get-container="body" position="bottom" v-model="showPicker">
      <van-picker
        :columns="memberColumns"
        :default-index="1"
        :loading="!memberColumns.length"
        @cancel="onCancel"
        @confirm="onConfirm"
        show-toolbar
      />
    </van-popup>
    <van-popup :style="{ height: '100%', width: '100%' }" get-container="body" position="right" v-model="rateVisit">
      <rate @close="rateVisit = false" v-if="rateVisit" />
    </van-popup>
    <transition name="handle-add">
      <div class="chat-customer-server" v-if="showCustomerServer" @click="customerServer">
        <i class="zbicon-zbicon-request" />
        __('转人工服务')
      </div>
    </transition>
  </div>
</template>
<script lang='ts'>
/* eslint @typescript-eslint/camelcase: 'off' */
import { Component, Vue, Watch } from 'vue-property-decorator';
import chatInput from '@/components/common/chat-input/index.vue';
import config from '@/config/index';
import { socketInstance, IMessageTypes } from '@/utils/chat-socket';
import { State, Action, Getter } from 'vuex-class';
import { IChatMessageInfo, IMessage } from '@/store/modules/chat';
import expression from '@/components/user/expression.vue';
import expressionList from '@/config/chat-expression';
import { groupMembersApi, IMemberRes, IChatUserInfo, customerService, getPluginList, sendChatPluginMsg, customerServer } from '@/api/chat';
import rate from '@/components/user/rate.vue';
import { ImagePreview as imagePreview, Picker as vanPicker } from 'vant';
Vue.use(imagePreview);
interface IMember {
  text: string;
  id: string;
}

interface IPluginList {
  pluginId: string;
  pluginName: string;
  iconUrl: string;
  name: string;
}

@Component({
  components: {
    chatInput,
    expression,
    vanPicker,
    rate
  }
})
export default class Chat extends Vue {
  @State('chatList', { namespace: 'chat' }) chatList!: IChatMessageInfo[];
  @State('messageList', { namespace: 'chat' }) messageList!: IObj<IMessageTypes[]>;
  @Action('setMessageList', { namespace: 'chat' }) setMessageList!: Function;
  @State('chatUserInfo', { namespace: 'user' }) chatUserInfo!: IChatUserInfo;
  @Action('setChatList', { namespace: 'chat' }) setChatList!: Function;
  @Getter('chatIsLogin', { namespace: 'user' }) chatIsLogin!: boolean;
  enterText: string = '';
  keyborard: boolean = false;
  offsetHeight: number = 0;
  toolsVisible: string = '';
  toolsAnimation: boolean = false;
  '$refs': {
    chatInput: any;
  };
  '$el': HTMLElement;
  images: string[] = [];
  imageShow: boolean = false;
  atList: IMember[] = [];
  showPicker: boolean = false;
  memberColumns: IMember[] = [];
  pluginList: any[] = [];
  rateVisit: boolean = false;
  groupMembers: IMemberRes[] = [];
  @Watch('list', { immediate: true, deep: true })
  listChanged(list: IChatMessageInfo[]) {
    if (list && list.length) {
      this.scrollBottom();
    }
  }
  @Watch('toolsVisible')
  _(val: string, oldVal: string) {
    if (oldVal && val) {
    }
    if (val === 'other' && !this.pluginList.length) {
      this.getPluginList();
    }
  }
  @Watch('chatIsLogin', { immediate: true })
  __(val: boolean) {
    val && this.groupMembersApi();
  }
  mounted() {
    this.offsetHeight = window.innerHeight;
  }
  /* chat list */
  get list(): IMessage[] {
    let groupId = this.$route.query.g;
    if (this.messageList[groupId as string]) {
      let list: any[] = this.messageList[groupId as string];
      let defaultList = list.map(item => {
        let obj = {
          ...item,
          type: this.messageType(item.msg_type, item.user_uid),
          handle: item.handle
        };
        return this.checkType(obj);
      });
      return this.unique(defaultList);
    }
    return [];
  }
  get selfAvatar() {
    return `${config.chatImg}&user_uid=${this.chatUserInfo.authed_info.user_uid}`;
  }
  get showCustomerServer() {
    return this.groupMembers.length === 2 && this.$route.query.t === '3';
  }
  handleText(name: string) {
    switch (name) {
      case 'credit':
        return '__("查看")';
      case 'kyc':
        return '__("进入")';
      default:
        return '';
    }
  }
  handleJump(name: string) {
    switch (name) {
      case 'credit':
        this.rateVisit = true;
        break;
      case 'kyc':
        break;
      default:
        break;
    }
  }
  messageType(ty: string, id: string): number {
    if (ty === '90') return 0;
    return id === this.chatUserInfo.authed_info.user_uid ? 1 : 2;
  }
  historyTime(item: IMessage, preItem: IMessage) {
    const oldData = item.history_time2,
      preDate = preItem && preItem.history_time2,
      newDate = new Date(+oldData),
      data = newDate.toLocaleString('chinese', { hour12: false }),
      handleTimeDate = newDate.toLocaleString(),
      YMD = handleTimeDate.split(' ')[0].split('/'),
      nowDateYMD = new Date()
        .toLocaleString()
        .split(' ')[0]
        .split('/'),
      TM = data.split(' ')[1].split(':'),
      hourSystem = `${TM[0]}:${TM[1]}`;
    if (oldData - preDate < 60 * 1000) return '';
    if (nowDateYMD[0] === YMD[0] && nowDateYMD[1] === YMD[1] && +nowDateYMD[2] - +YMD[2] < 1) {
      return hourSystem;
    } else if (nowDateYMD[0] === YMD[0] && nowDateYMD[1] === YMD[1] && +nowDateYMD[2] - +YMD[2] === 1) {
      return `__('昨天') ${hourSystem}`;
    } else if (nowDateYMD[0] === YMD[0] && nowDateYMD[1] === YMD[1] && +nowDateYMD[2] - +YMD[2] === 2) {
      return `__('前天') ${hourSystem}`;
    } else {
      let nowDate = newDate
        .toLocaleString()
        .split(' ')[0]
        .split('/');
      return `${nowDate[0]}__('年')${nowDate[1]}__('月')${nowDate[2]}__('日') ${hourSystem}`;
    }
  }
  async customerServer() {
    await customerServer(JSON.stringify({
      userUid: this.chatUserInfo.authed_info.user_uid
    }));
    this.groupMembersApi();
  }
  /* send message */
  async keydownHandle() {
    let newFp = config.baseFp + new Date().getTime();
    let atIds = this.filterAt(this.enterText);
    socketInstance.sendMessage({
      t: this.$route.query.g + '',
      m: atIds ? JSON.stringify({ at: atIds, msg: this.enterText }) : this.enterText,
      ty: atIds ? 7 : 0,
      cy: this.$route.query.t === '0' ? '0' : '2',
      nickName: this.chatUserInfo.authed_info.nickname,
      typeu: this.$route.query.t === '0' ? '3' : '44',
      to: +this.$route.query.t === 0 ? this.$route.query.g + '' : '0',
      fp: newFp
    });
    this.setMessageList({
      msg_content: this.enterText,
      user_uid: this.chatUserInfo.authed_info.user_uid,
      groupId: this.$route.query.g,
      history_time2: new Date().getTime(),
      msg_type: '0',
      nickName: this.chatUserInfo.authed_info.nickname,
      fp: newFp,
      state: 'loading',
      at: null
    });
    +this.$route.query.t !== 3 &&
      this.setChatList({
        groupId: this.$route.query.g,
        name: this.$route.query.n,
        historyTime: new Date().getTime()
      });
    this.enterText = '';
    this.toolsVisible = '';
    this.enterFocus();
  }
  toolsClickHandle(val: string) {
    this.toolsVisible = this.toolsVisible !== val ? val : '';
  }
  get chatImg() {
    return config.chatImg;
  }
  unique(arr: IMessage[]) {
    let tempObj: IObj<boolean> = {};
    return arr.reduce(function(item, next) {
      if (!tempObj[next.fp]) {
        tempObj[next.fp] = true;
        (item as any).push(next);
      }
      return item;
    }, []);
  }
  scrollBottom() {
    this.$nextTick(() => {
      let h: HTMLDivElement | null = this.$el.querySelector('.chat-msg');
      h && h.scrollTo(0, h.scrollHeight);
    });
  }
  inputPosition() {
    setTimeout(() => {
      if (window.innerHeight < this.offsetHeight && this.offsetHeight - window.innerHeight > 300) {
        this.keyborard = true;
      } else {
        this.keyborard = false;
      }
    }, 50);
  }
  /* @ */
  async at() {
    try {
      if (+this.$route.query.t !== 2) return;
      let list = this.groupMembers.filter(item => {
        return item.user_uid !== this.chatUserInfo.authed_info.user_uid;
      });
      this.memberColumns = list.map(item => {
        return {
          text: item.nickname,
          id: item.user_uid
        };
      });
      this.showPicker = true;
    } catch (error) {}
  }
  async groupMembersApi() {
    try {
      this.groupMembers = await groupMembersApi(this.$route.query.g as string);
    } catch (error) {}
  }
  onConfirm(value: IMember) {
    this.showPicker = false;
    this.enterText += value.text + ' ';
    this.atList.push(value);
    this.enterFocus();
  }
  onCancel() {
    this.showPicker = false;
    this.enterFocus();
  }
  enterFocus() {
    this.$refs.chatInput.$vnode.elm.children[0].focus();
  }
  filterAt(value: string) {
    let atList = value.match(/(?<=@)([^@]+?)(?=\s)/g);
    if (atList && atList.length) {
      let result = atList.map(item => {
        return this.atList.find(cItem => {
          return cItem.text === item;
        });
      });
      return result.map(item => item && item.id).join(',');
    }
    return '';
  }
  focus() {
    this.inputPosition();
  }
  blur() {
    this.inputPosition();
  }
  expressionSelect(val: string) {
    this.enterText = this.enterText + val;
  }
  convertExpression(obj: IMessage) {
    const reg = /\[.+?\]/g;
    if (!reg.test(obj.msg_content)) return obj;
    obj['msg_content'] = obj.msg_content.replace(reg, (item): any => {
      if (!item) return;
      let index = Object.keys(expressionList).indexOf(item);
      if (index !== -1) {
        return `<img class="expression-message" src=${(expressionList as IObj<string>)[item]} alt="expression"/>`;
      }
    });
    return obj;
  }
  convertImg(obj: IMessage) {
    let msgContent = obj.msg_content,
      smallPic = '',
      baseUrl = `${this.chatUserInfo.authed_info.user_uid}&file_name=`;
    if (msgContent.startsWith('blob')) {
      smallPic = msgContent;
    } else {
      smallPic = `${config.chatMsgImg}&user_uid=${baseUrl}th_${msgContent}`;
    }
    obj['msg_content'] = `<img class="image-message" src=${smallPic} />`;
    return obj;
  }
  checkType(obj: IMessage) {
    // 0文本  1: 图片
    let type = obj.msg_type || 0;
    switch (type) {
      case '0':
        this.convertExpression(obj);
        break;
      case '1':
        this.convertImg(obj);
        break;
    }
    return obj;
  }
  detail(item: IMessage) {
    if (item.msg_type !== '1') return;
    this.imageShow = true;
    let str = item.msg_content.match(/src=([^]*?)\/>/);
    if (str) {
      this.images[0] = str[1];
    }
  }
  /* plugin click */
  async handle(item: IPluginList) {
    try {
      let { m } = await sendChatPluginMsg(
        JSON.stringify({
          pluginId: item.pluginId,
          toGroupId: this.$route.query.g,
          osType: 2
        })
      );
      let { bgColor, desc, iconUrl, title } = JSON.parse(JSON.parse(m).data);
      this.setMessageList({
        msg_content: '',
        user_uid: this.chatUserInfo.authed_info.user_uid,
        groupId: this.$route.query.g,
        history_time2: new Date().getTime(),
        msg_type: '9',
        nickName: this.chatUserInfo.authed_info.nickname,
        handle: item.name,
        fp: config.baseFp + new Date().getTime(),
        bgColor,
        desc,
        iconUrl,
        title
      });
      this.toolsVisible = '';
      switch (item.name) {
        case 'service':
          customerService(JSON.stringify({ orderId: this.$route.query.o }));
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
  /* Get plugin list */
  async getPluginList() {
    try {
      let { orderPluginList } = await getPluginList();
      let nameType: IObj<string> = {
        KYC助手: 'kyc',
        信用管理: 'credit',
        订单管理: 'order',
        客服管理: 'service'
      };
      let list = orderPluginList.map(item => {
        return {
          ...item,
          name: nameType[item.pluginName]
        };
      });
      this.pluginList = list || [];
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
<style lang='scss'>
.keyborard {
  padding-bottom: 50px;
}
.scroll-bottom {
  height: 1px; /* no */
  visibility: hidden;
}
.chat-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  $selfColor: #63d376;
  .van-image-preview__image {
    width: 100%;
  }
  .van-image-preview__overlay {
    background-color: rgba(0, 0, 0, 0.9);
  }
  .chat-wrap-item {
    padding: 10px var(--padding-lr);
    font-size: 15px;
    line-height: 1.3;
  }
  .history-time {
    color: var(--theme-color);
    font-size: 12px;
    display: block;
    text-align: center;
    padding: 6px 0;
  }
  .system {
    font-size: 12px;
    color: #c8ced7;
    text-align: center;
    line-height: 17px;
    display: inline-block;
    width: 100%;
    padding: 0 42px;
    margin-bottom: 20px;
    a {
      color: #739af1;
    }
  }
  .self,
  .other {
    display: flex;
    margin: 20px 0;
    .van-image {
      flex-basis: 30px;
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }
    .handle-right,
    > p {
      position: relative;
      padding: 10px;
      margin: 0 14px;
      border-radius: 4px;
      max-width: 77%;
      word-break: break-all;
      line-height: 18px;
      .expression-message {
        width: 18px;
        height: 18px;
        display: inline-block;
        line-height: 18px;
        vertical-align: middle;
        margin: 0 2px;
      }
      .image-message {
        max-width: 70vw;
      }
    }
  }
  .self {
    justify-content: flex-end;
    .handle-right,
    > p {
      background: $selfColor;
      color: #040a05;
      .arrow {
        position: absolute;
        right: -4px;
        top: 4px;
        width: 0;
        height: 0;
        border-width: 4px;
        border-style: solid;
        border-color: transparent;
      }
    }
    > p:after {
      content: '';
      position: absolute;
      left: 100%;
      top: 3px;
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent;
      border-left-width: 4px;
      border-left-color: currentColor;
      color: $selfColor;
    }
  }
  .other {
    > .handle-right,
    > p {
      color: #152206;
      position: relative;
      @include dark {
        color: #ccc;
      }
      @include light {
        background: #f7f8fd;
        &:after {
          color: #fff;
        }
      }
      @include dark {
        background: #2c2e33;
        &:after {
          color: #2c2e33;
        }
      }
      .arrow {
        position: absolute;
        left: -4px;
        top: 4px;
        width: 0;
        height: 0;
        border-width: 4px;
        border-style: solid;
        border-color: transparent;
      }
    }
    > p:after {
      content: '';
      position: absolute;
      right: 100%;
      top: 4px;
      width: 0;
      height: 0;
      border-width: 4px;
      border-style: solid;
      border-color: transparent;
      border-right-width: 4px;
      border-right-color: currentColor;
    }
  }
  .service,
  .credit,
  .kyc {
    display: flex;
    margin: 20px 0;
    .van-image {
      flex-basis: 29px;
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }
    .handle-right {
      color: #fff !important;
      position: relative;
      padding: 10px;
      margin: 0 14px;
      border-radius: 4px;
      width: 76%;
      word-break: break-all;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding: 20px;
      justify-content: space-between;
      min-height: 106px;
      > img {
        box-sizing: border-box;
        width: 56px;
        height: 56px;
        border-radius: 30px;
        border: 2px solid #fff;
      }
      > div {
        width: 70%;
        > p:first-child {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        > p:last-child {
          font-weight: 400;
          line-height: 1.6;
          font-size: 14px;
          > a {
            color: #6e79e8;
          }
        }
      }
    }
  }
  .handle-self {
    > p {
      order: 1;
    }
    .van-image {
      order: 2;
    }
  }
  .order-detail-box {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .handle-box {
    position: fixed;
    bottom: 0;
  }
  .chat-form {
    background: var(--default-bg);
    padding: 10px 0;
    .empty {
      display: block;
      text-align: center;
      margin-top: 20px;
    }
  }
  .chat-bar {
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 0 var(--padding-lr);
    .chat-inp {
      flex: 1;
    }
    .chat-handel {
      width: 100px;
      display: flex;
      align-items: center;
      position: relative;
      .input-submit {
        padding: 0 2px;
        position: absolute;
        right: 0;
      }
      > .van-button--small {
        min-width: 50px;
      }
      .input-expression {
        margin-left: 10px;
      }
    }
    .input-btn {
      border: none;
      background: transparent;
      color: var(--theme-color);
      height: 40px;
      line-height: 40px;
      padding: 0 6px;
      font-size: 25px;
    }
    .add-btn {
      padding-left: 0;
      position: absolute;
      right: 0;
      z-index: 9;
    }
    i {
      font-size: 26px;
      font-weight: 500;
    }
  }
  .chat-tools {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    overflow: hidden;
    .tools-item {
      padding: 10px 15px 0;
      text-align: center;
      color: var(--theme-color);
    }
    img {
      width: 40px;
      height: 40px;
      border: 3px solid #f2f4fc;
      border-radius: 50%;
      @include dark {
        border: 3px solid rgba(242, 244, 252, 0.2); /* no */
      }
    }
    p {
      padding-top: 8px;
    }
  }
  .tools-enter-active,
  .tools-leave-avtive {
    transition: 0.14s ease-out;
  }
  .tools-enter,
  .tools-leave-active {
    opacity: 0;
    height: 0;
    transform: scale(0.8);
  }
  .handle-enter-active,
  .handle-leave-active {
    transition: 0.15s ease-out;
  }

  .handle-add-enter-active,
  .handle-add-leave-avtive {
    transition: 0.15s ease-out;
  }
  .handle-enter,
  .handle-leave-to {
    transform: translate(30px);
    opacity: 0;
    z-index: 10;
  }
  .handle-add-enter,
  .handle-add-leave-to {
    opacity: 0;
    transform: translate(-30px);
    z-index: 10;
  }
  .van-picker-column__item {
    color: #27364a;
  }

  .van-picker__cancel {
    padding-left: 24px;
    color: #5e6c80;
  }

  .van-picker__confirm {
    padding-left: 24px;
    color: #27364a;
  }
  .chat-customer-server {
    position: fixed;
    right: 0;
    top: 150px;
    background: var(--default-bg);
    color: var(--color);
    padding: 8px;
    border-radius: 12px 0 0 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  }
}
</style>
