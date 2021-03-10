  <!--
  * @Descripttion: 
  * @version: 
  * @Author: sueRimn
  * @Date: 2019-08-14 11:19:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-03 20:01:33
  -->
  <template>
    <div class="queueingTips">
      <div class="queue-title" v-if="isShowHeader">排队等待中</div>
      <div class="queue-header">
        <slot name="header"></slot>
      </div>
      <div class="queue-body">
        <div class="queue-position-title">当前等待人数</div>
        <span class="queueingPosition">{{count}}</span>
      </div>
      <div class="queue-footer">
        <p>如果等不及，可以选择</p>
        <el-button  type="primary" class="btn-go-ticket" @click="showLeaveFun">给我们留言</el-button>
      </div>
      <div class="footer">
        <span>客服软件</span>
      </div>
    </div>
  </template>
  <script>
  import { getQueueRule, updateQueueRule } from "@/common/api";
  export default {
    props: {
      count: {
        type: String | Number,
        required: true,
        default: 1
      },
      isShowHeader: {
        type: Boolean,
        required: true,
        default: true
      }
    },
    methods: {
      showLeaveFun() {
        this.$emit("showLeaveFun",'');
        // this.$parent.showLeaveFun();
      }
    }
  };
  </script>
  <style scoped>
  .queueingTips {
    background-color: #fff;
    font-size: .75rem;
    overflow-x: hidden;
    overflow-y: auto;
    /* position: absolute;
    left: 0;
    right: 0;
    z-index: 3; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  .queueingTips .queue-header {
    flex: 1;
    width: 100%;
    padding: 15px 10px;
    box-sizing: border-box;
    /* margin: 15px auto 0; */
    /* line-height: 22px; */
    color: #666;
    font-size: 16px;
  }
  .queueingTips .queue-title {
    /* height: 80px; */
    width: 100%;
    color: #fff;
    background: #007aff;
    line-height: 80px;
    padding: 0 20px;
  }
  .queueingTips .queue-body {
    position: relative;
    flex: 2;
    /* position: relative; */
    width: 100%;
    /* height: 160px; */
    /* margin-top: 30px; */
    background-color: #fefefe;
    box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.04),
      inset 0 1px 0 0 rgba(0, 0, 0, 0.04);
    text-align: center;
    padding: 1.875rem 0 0;
    box-sizing: border-box;
  }
  .queue-body .queue-position-title {
    /* padding-top: 32px; */
    color: #007aff;
  }
  .queueingPosition {
    position: absolute;
    top: 5.625rem;
    left: 0;
    right: 0;
    /* width: 40px; */
    /* margin-left: -20px; */
    font-size: 3rem;
    text-shadow: 0 1.875rem 2.25rem;
    -webkit-animation: jump 0.3s ease-in-out infinite alternate;
    animation: jump 0.3s ease-in-out infinite alternate;
    color: #007aff;
  }
  @keyframes jump {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      text-shadow: 0 30px 36px;
    }
    100% {
      -webkit-transform: translateY(-6px);
      transform: translateY(-6px);
      text-shadow: 0 40px 40px;
    }
  }
  @-webkit-keyframes jump {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      text-shadow: 0 30px 36px;
    }
    100% {
      -webkit-transform: translateY(-6px);
      transform: translateY(-6px);
      text-shadow: 0 40px 40px;
    }
  }
  .queue-footer {
    flex: 2;
    /* margin-top: 50px; */
    text-align: center;
    display: flex;
    flex-flow:column nowrap;
    justify-content: center;
  }
  .queue-footer p {
    /* margin: 0; */
    color: #666;
  }
  .queue-footer .btn-go-ticket {
    margin: 2rem auto;
    box-sizing: border-box;
    /* display: block; */
    /* width: 268px;
    height: 36px;
    margin: 12px auto; */
    /* line-height: 36px; */
    /* border-radius: .1875rem; */
    font-size: .8125rem;
    /* background-color: #007aff; */
    /* color: #fff; */
  }
  .footer {
    height: 1.875rem;
    background-color: #f4f4f4;
    border-top: 1px solid #ededed;
    line-height: 1.875rem;
    /* position: absolute;
    width: 100%;
    bottom: 60px; */
  }
  .footer span {
    display: block;
    /* height: 30px; */
    text-align: center;
    /* line-height: 30px; */
    font-size: .75rem;
    color: #b7bac2;
  }
  </style>