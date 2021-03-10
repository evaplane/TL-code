<template>
    <elePicker
      clearable
      v-model="time"
      type="datetimerange"
      range-separator="至"
      :start-placeholder="placeholderStart"
      :end-placeholder="placeholderEnd"
      :default-time="['00:00:00', '23:59:59']"
      :editable="false"
      :picker-options="pickerOptions"
      @change="change">
    </elePicker>
</template>

<script>
import {sys_formatDate } from '@/js/util.js'
export default {
  name:'dateRange',
  props: {
    rangeType: String,
    defaultTime: String
  },
  data() {
    return {
      type: 'currentMonth',
      time:[],
      placeholderStart:'开始时间',
      placeholderEnd:'结束时间',
      days: 30,
      pickerOptions:{},
      choiceDate:''
    }
  },
  created(){
    this.type = this.rangeType ? this.rangeType : 'days';
    this.defaultTime = this.defaultTime ? this.defaultTime : 'today';
    let today = new Date();
    let date = sys_formatDate(today.getTime(),'yyyy-MM-dd');

    if(this.defaultTime === 'today'){
      this.placeholderStart= date+' 00:00:00';
      this.placeholderEnd = date+' 23:59:59';
    }

    let year = today.getFullYear();
    let month = today.getMonth();
    this.days = (new Date(new Date(year,month+1))-new Date(new Date(year,month))) / (24*3600*1000);
    if(this.days !== 31){
      this.days = 30
    }

    let that = this;
    this.pickerOptions = {
      shortcuts: [{
        text: '今天',
        onClick(picker) {
          let start = new Date(date+' 00:00:00');
          let end = new Date(date+' 23:59:59');
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '昨天',
        onClick(picker) {
          let yestoday = sys_formatDate(new Date(today.getTime()-86400000),'yyyy-MM-dd');
          let start = new Date(yestoday+' 00:00:00');
          let end = new Date(yestoday+' 23:59:59');
          picker.$emit('pick', [start, end]);
        }
      }]
    }
    if(this.type == 'weeks' || this.type == 'months'){
      let obj = {
        text: '最近一周',
        onClick(picker) {
          let end = new Date();
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      }
      this.pickerOptions.shortcuts.push(obj)
    }
    if(this.type == 'months'){
      let obj = {
        text: '最近一月',
        onClick(picker) {
          let end = new Date();
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * that.days);
          picker.$emit('pick', [start, end]);
        }
      }
      this.pickerOptions.shortcuts.push(obj)
    }
    // if(this.type=='currentMonth'){
    //     onPick:({ maxDate, minDate })=>{
    //       this.choiceDate = minDate.getTime()
    //     }
    //     disabledDate:(time)=>{
    //       const self = this;
    //       if (!!self.choiceDate) {
    //         const startDay = (new Date(self.choiceDate).getDate() - 1) * 24 * 3600 * 1000;
    //         const endDay = (new Date(
    //         new Date(self.choiceDate).getFullYear(),
    //         new Date(self.choiceDate).getMonth() + 1,
    //         0
    //         ).getDate() - new Date(self.choiceDate).getDate()) * 24 * 3600 * 1000;
    //         let minTime = self.choiceDate - startDay;
    //         let maxTime = self.choiceDate + endDay;
    //         return time.getTime() < minTime || time.getTime() > maxTime
    //       }
    //     }
    //   }
  },
  methods:{
    change(){
      if(this.time != null){
        let start = sys_formatDate(this.time[0],'yyyy-MM-dd HH:mm:ss');
        let end = sys_formatDate(this.time[1],'yyyy-MM-dd HH:mm:ss');
        let startTime = new Date(start).getTime();
        let endTime = new Date(end).getTime();

        if(this.type == 'days'){
          if(start.substring(0,10) !== end.substring(0,10)){
            this.$alert('只能选择同一天', '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: ()=>{
                this.time = [];
              }
            });
          }
        }else if(this.type == 'weeks'){
          if( (endTime - startTime) > 1000*60*60*24*7){
            this.$alert('选择范围不能超过7天', '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: ()=>{
                this.time = [];
              }
            });
          }
        }else if(this.type == 'months'){
          if( (endTime - startTime) > 1000*60*60*24*this.days){
            this.$alert('选择范围不能超过一个月', '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: ()=>{
                this.time = [];
              }
            });
          }
        }else if(this.type=='currentMonth'){
          if(new Date(start).getMonth() != new Date(end).getMonth()){
            this.$alert('只能选择同一个月', '温馨提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: ()=>{
                this.time = [];
              }
            });
          }
        }
        this.$emit('func',this.time)
      }else{
        this.time=[]
        this.$emit('func',this.time)
      }
    }
  }
}
</script>

