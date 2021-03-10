<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-14 16:48:53
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-16 10:07:22
 -->
<template>
  <el-dialog
  title="创建工单"
    :close-on-click-moda="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="30%"
     @close="closeTickets"
  >
  <div class="ticketClass">
    <addTrick :ticketOrderData="ticketOrderData" @closeAddTickets="closeAddTickets" @getVisitorLatestTicket="getVisitorLatestTicket"></addTrick>
  </div>
</el-dialog>
</template>

<script>
import addTrick from '../../tickets/addTickets.vue'
export default {
  data(){
    return{
      dialogVisible:true,
    }
  },
  props:{
    ticketOrderData:{
      required: true,
      type: Object,
      default: {}
    }
  },
  components:{
    addTrick
  },
  methods:{
    closeAddTickets(){
      this.$parent.$data.addTicketOrderShow = false;
      // this.$parent.endSession(); //关闭当前会话
    },
    getVisitorLatestTicket(){
        this.$parent.getVisitorLatestTicket();
    },
    closeTickets(){
      this.$emit('closeTickets',false)
    }
  },
  mounted() {
    this.$nextTick(function() {
      console.log(1111)
    });
  },
}
</script>
<style scoped>
.ticketClass .sidebar-add header{
  display: none;
}
.el-dialog__wrapper >>> .el-dialog__body {
  max-height: 705px;
  overflow-y: auto;
}
</style>
