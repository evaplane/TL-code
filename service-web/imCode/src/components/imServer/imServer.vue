<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-17 16:08:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-19 12:27:29
 -->
<!-- im服务端入口 -->
<template>
    <div class="imServer-wrapper" @click="handleSubmit()">
        <im-record class="item im-record" @selectedChat="selectedChat"></im-record>
        <div v-if="storeSelectedChatEn==null" class="chat-new">
            <div class="tabpage">
                <div class="empty-status">
                    <img src="../../../static/image/tabpage.png" />
                    <div class="text">从左侧列表打开对话</div>
                </div>
            </div>
        </div>
        <im-chat
            v-if="storeSelectedChatEn!=null"
            ref="im_chat"
            :serverValues="serverValues"
            class="item im-chat"
        ></im-chat>
    </div>
</template>

<script scoped>
import imRecord from "./imRecord.vue";
import imChat from "./imChat.vue";
export default {
  components: {
    imRecord: imRecord,
    imChat: imChat
  },
  data() {
    return {
      socket: null,
      serverValues: {}, //会话ID,接收人
      show: true,
    };
  },
  computed: {
    storeSelectedChatEn() {
      return this.$store.imServerStore.getters.selectedChatEn;
    }
  },
  watch: {},
  methods: {
    /**
     * 选中了会话
     */
    selectedChat: function(values) {
      // this.trackid = values.trackid;
      this.serverValues = values;
    },
    handleSubmit: function() {
      if(this.$refs.im_chat){
        this.$refs.im_chat.$refs.common_chat.$refs.qqemoji.faceHidden = true
      }
    }
  },
  mounted() {
    // this.$store.imServerStore.dispatch('SERVER_ON');
    // 无用接口，误删；用于检测在线
    this.$axios.get(this.$httpServer.getTab).then(res => {});
  },
  destroyed() {
    // this.$store.imServerStore.dispatch('SERVER_OFF');
  }
};
</script>

<style lang="less">
@import "../../common/css/base.less";

.imServer-wrapper {
  #common-wrapper();
}
.imServer-wrapper {
    position: absolute;
    width: calc(~'100% - 70px' );
    height: 100%;
    margin-left: 70px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    .im-record {
        // flex: 1;
        height: 100%;
        width: 300px;
        overflow: hidden;
        border-right: 1px solid #EBEEF5;
    }
    .chat-new {
        flex: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;
        .tabpage .empty-status  {
            text-align: center;
            .text{
                font-size: 12px;
                color: #989ea6;
            }
        }
    }
    .im-chat {
        flex: 1;
    }
}
// .imServer-wrapper {
//     height: 100%;
//     width: calc(~'100% - 70px' );
//     margin-left: 70px;
//     position: absolute;
//     overflow: hidden;
//     .imServer-main {
//         height: 100%;
//         max-width: 100%;
//         position: relative;
//         & > .item {
//             float: left;
//             border-right: 1px solid #e6e6e6;
//             height: 100%;
//         }
//         & > .im-record {
//             width: 280px;
//         }
//         & > .im-chat {
//             width: calc(~'100% - 282px');
//         }
//     }
// }
// .chat-new{
//     flex-direction: row;
//     // margin-left: 300px;
//     display: flex;
//     height: 100%;
//     background-color: #fff;
// }
// .chat-new .tabpage{
//     flex: 1;
//     display: -ms-flexbox;
//     display: flex;
//     -ms-flex-direction: column;
//     flex-direction: column;
//     position: relative;
//     height: 100%;
//     background-color: #fff;
//     box-shadow: 1px 0 0 0 rgba(0,0,0,.06);
// }
// .chat-new .tabpage .empty-status{
//     position: absolute;
//     left: 49%;
//     bottom: 60%;
//     margin-left: -60px;
//     text-align: center;
//     padding-top: 60px;
// }
// .chat-new .tabpage .empty-status img{
//     width: 80px;
// }
</style>
