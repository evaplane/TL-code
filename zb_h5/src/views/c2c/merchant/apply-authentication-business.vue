<template>
  <native-scroll>
    <div class="apply-authentication-business-wrap">
      <app-bar title="申请认证商家" />
      <div class="apply-authentication-business">
        <div class="agreement-wrap">
          <div class="agreement-content">
            <h1>OTC认证商家协议</h1>
            <h2>步骤一：准备资料</h2>
            <p>1.请下载《商家申请资料模板》，按照要求填写申请资料。</p>
            <p>2.录制视频资料，要求如下：</p>
            <p>手持本人身份证正面进行录制，保持录制过程中声音和影像都清晰。</p>
            <p>录制时要求诵读：本人（姓名），身份证号（身份证号码），我的资金来源合法可靠，自愿交易比特币等数字资产，本人充分了解数字货币及潜在风险，本人具有抗风险的能力并愿意承担一切风险。</p>

            <h2>步骤二：发送申请邮件</h2>
            <p>请将以上申请资料和视频资料发送邮件至otc@zb.cn，邮件主题为“申请成为OTC商家”。</p>

            <h2>步骤三：提交申请</h2>
            <p>发送邮件后，请在页面点击“确认申请”按钮，提交申请并同意冻结50.000 ZB 作为商家保证金</p>

            <h2>步骤四：资料审核</h2>
            <p>我们将在3个工作日内对您的商家申请资料进行审核。我们会主动与您取得联系，请保持通讯畅通。请您务必仔细阅读并透彻理解《OTC服务协议》。</p>
          </div>
        </div>
        <div class="bottom-wrap">
          <checkbox-agreement @checkbox-click="clickCheckBox" />
          <otc-button
            button-type="bigConfirm"
            @click.native="submitButton"
            text="提交申请"
          />
        </div>
      </div>
    </div>
  </native-scroll>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import checkbox from '@/components/c2c/check-box.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import buttonList from '@/components/c2c/merchant/button-list.vue';
import checkboxAgreement from '@/components/c2c/merchant/checkbox-agreement.vue';
// api
import { reqApplyAuthBusiness } from '@/api/otc/business-user';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    iconPortrait,
    buttonList,
    checkbox,
    checkboxAgreement,
    appBar,
    otcButton
  }
})
export default class ApplyAuthenticationBusiness extends Mixins(mixinsOtcGetUserToken) {
  checkboxAgree: boolean = false; // otc服务协议

  clickCheckBox(value: boolean) {
    this.checkboxAgree = value;
    console.log(value);
  }

  async submitButton() {
    try {
      if (this.checkboxAgree) {
        await reqApplyAuthBusiness();
        return this.$router.push({ name: 'authentication-business' });
      }
      this.$message.warn('请同意《OTC服务协议》');
    } catch (err) {
      this.$message.fail(err.resMsg.message);
    }
  }
}
</script>

<style lang='scss'>
.apply-authentication-business-wrap {
  height: 100%;
  @include light {
    background-color: #f7f8fe;
  }
  @include dark {
    background-color: #1b1924;
  }
  .apply-authentication-business {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 15px;
    @include light {
      background-color: #f7f8fe;
    }
    @include dark {
      background-color: #1b1924;
    }

    .agreement-wrap {
      width: 345px;
      padding-top: 23px;
      padding-bottom: 27px;
      margin-left: 15px;
      margin-right: 15px;
      @include light {
        background-color: #ffffff;
      }
      @include dark {
        background-color: #2c2e32;
      }
      .agreement-content {
        margin-left: 15px;
        margin-right: 15px;
        text-align: left;
        h1 {
          margin: 0;
          text-align: center;
          font-size: 20px;
          font-weight: 500;
          color: #455264;
          @include dark {
            color: #ffffff;
          }
        }
        h2 {
          padding-top: 16px;
          padding-bottom: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #455264;
          @include dark {
            color: #ffffff;
          }
        }
        p {
          font-size: 12px;
          font-weight: 400;
          color: #27364a;
          line-height: 17px;
          @include dark {
            color: #ffffff;
          }
        }
      }
    }
    .bottom-wrap {
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
