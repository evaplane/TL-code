<template>
    <div class='homePage'>
        <el-row class='opera'>
            <el-col :span="spanLength" @click.native="toUser(1)" :style="{marginBottom:spanLength==24?'20px':''}">
                <el-card class="box-card" style="margin:0 10px">
                    <div style="padding:10px 0 0 15px;">
                        <p>实时|新增用户</p>
                        <p v-if="newUsers.NewUserOptions.xAxis">{{newUsers.data.time}} 00:00 ~ {{newUsers.data.time}} 23:00 | 今日</p>
                    </div>
                    <div  style="padding:0 0 0 15px;">
                        <div style="display:inline-block;width:64%;border-right:1px solid #cccccc;">
                            <p>{{newUsers.data.nowtime}}</p>
                            <p><span style="font-size:36px;">{{newUsers.data.versionTotal}}</span>人</p>
                        </div>
                        <div style="display:inline-block;width:31%;padding-left:4%;">
                            <p>总用户数<span>{{newUsers.data.total}}</span>人</p>
                            <p>今日新增用户数<span>{{newUsers.data.todayTotal}}</span>人</p>
                        </div>
                    </div>
                    <div ref="newUsers" :style="{height: '300px',padding:'10px 0 10px 5px'}"></div>
                </el-card>
            </el-col>
            <el-col :span="spanLength" @click.native="toUser(2)">
                <el-card class="box-card" style="margin:0 10px">
                    <div style="padding:10px 0 0 15px;">
                        <p>实时|活跃用户</p>
                        <p v-if="aliveUser.aliveUserOptions.xAxis">{{aliveUser.data.time}} 00:00 ~ {{aliveUser.data.time}} 23:00 | 今日</p>
                    </div>
                    <div style="padding:0 0 0 15px;">
                        <div style="display:inline-block;width:64%;border-right:1px solid #cccccc;">
                            <p>{{aliveUser.data.nowtime}}</p>
                            <p><span style="font-size:36px;">{{aliveUser.data.versionTotal}}</span>人</p>
                        </div>
                        <div style="display:inline-block;width:31%;padding-left:4%;">
                            <p>总用户数<span>{{aliveUser.data.total}}</span>人</p>
                            <p>今日活跃用户数<span>{{aliveUser.data.todayTotal}}</span>人</p>
                        </div>
                    </div>
                    <div ref="activeUsers" :style="{height: '300px',padding:'10px 0 10px 5px'}"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row class='opera'>
            <el-card class="box-card" @click.native="toContent(3)" style="margin:0 10px;">
                <el-col :span="6">
                    <div style="margin:0 10px;padding:10px 0 0 5px;height:300px;">
                        <p>实时|新增内容数</p>
                        <p v-if="newContent.newContentOptions.xAxis">{{newContent.data.time}} 00:00 ~ {{newContent.data.time}} 23:00 | 今日</p>
                        <div>
                            <div style="border-bottom:1px solid #cccccc;width:80%;">
                                <p>{{newContent.data.nowtime}}</p>
                                <p><span style="font-size:36px;">{{newContent.data.versionTotal}}</span>条</p>
                            </div>
                            <div style="padding-left:4%;">
                                <p>总作品数<span>{{newContent.data.total}}</span>条</p>
                                <p>今日新增作品数<span>{{newContent.data.todayTotal}}</span>条</p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div ref="newContent" :style="{height: '300px',margin: '0px 10px',padding:'10px 0 0 5px'}"></div>
                </el-col>
            </el-card>
        </el-row>
        <el-row class='opera'>
            <el-col :span="spanLength" :style="{marginBottom:spanLength==24?'20px':''}">
                <el-card class="box-card" @click.native="toContent(1)" style="margin:0 10px">
                    <div style="padding:10px 0 0 15px;">
                        <p>实时|观看内容数</p>
                        <p v-if="wacthCount.wacthCountOptions.xAxis">{{wacthCount.data.time}} 00:00 ~ {{wacthCount.data.time}} 23:00 | 今日</p>
                    </div>
                    <div  style="padding:0 0 0 15px;">
                        <div style="display:inline-block;width:64%;border-right:1px solid #cccccc;">
                            <p>{{wacthCount.data.nowtime}}</p>
                            <p><span style="font-size:36px;">{{wacthCount.data.versionTotal}}</span>条</p>
                        </div>
                        <div style="display:inline-block;width:31%;padding-left:4%;">
                            <p>总观看内容数<span>{{wacthCount.data.total}}</span>条</p>
                            <p>今日观看内容数<span>{{wacthCount.data.todayTotal}}</span>条</p>
                        </div>
                    </div>
                    <div ref="numberViews" :style="{height: '300px',padding:'10px 0 10px 5px'}"></div>
                </el-card>
            </el-col>
            <el-col :span="spanLength">
                <el-card class="box-card" @click.native="toContent(2)" style="margin:0 10px;">
                    <div style="padding:10px 0 0 15px;">
                        <p>实时|观看内容时长</p>
                        <p v-if="wacthTime.wacthTimeOptions.xAxis">{{wacthTime.data.time}} 00:00 ~ {{wacthTime.data.time}} 23:00 | 今日</p>
                    </div>
                    <div  style="padding:0 0 0 15px;">
                        <div style="display:inline-block;width:64%;border-right:1px solid #cccccc;">
                            <p>{{wacthTime.data.nowtime}}</p>
                            <p><span style="font-size:36px;" v-html="formatSeconds(wacthTime.data.versionTotal)"></span></p>
                        </div>
                        <div style="display:inline-block;width:31%;padding-left:4%;">
                            <p>观看内容总时长<span v-html="formatSeconds(wacthTime.data.total)"></span></p>
                            <p>今日观看视频时长<span v-html="formatSeconds(wacthTime.data.todayTotal)"></span></p>
                        </div>
                    </div>
                    <div ref="lengthViewing" :style="{height: '300px',padding:'10px 0 10px 5px'}"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row class='opera'>
            <el-card class="box-card"  @click.native="toAdv(1)" style="margin:0 10px;">
                <el-col :span="6">
                    <div style="margin:0 10px;padding:10px 0 0 5px;height:300px;">
                        <p>实时|广告点击数</p>
                        <p v-if="advertCount.advertCountOptions.xAxis">{{advertCount.data.time}} 00:00 ~ {{advertCount.data.time}} 23:00 | 今日</p>
                        <div>
                            <div style="border-bottom:1px solid #cccccc;width:80%;">
                                <p>{{advertCount.data.nowtime}}</p>
                                <p><span style="font-size:36px;">{{advertCount.data.versionTotal}}</span>次</p>
                            </div>
                            <div style="padding-left:4%;">
                                <p>广告总点击数<span>{{advertCount.data.total}}</span>次</p>
                                <p>今日广告点击数<span>{{advertCount.data.todayTotal}}</span>次</p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div ref="advClicks" :style="{height: '300px',margin: '0px 10px',padding:'10px 0 0 5px'}"></div>
                </el-col>
            </el-card>
        </el-row>
    </div>
</template>
<script>
import { sys_formatDate } from '../../js/util';
import { Agent } from 'https';

export default {
    data: function () {
        return {
            initOptions:{
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: []
                },
                grid: {
                    left: '2%',
                    right: '3%',
                    top: '2%',
                    containLabel: true
                },
                yAxis: {
                    minInterval: 1,
                },
                series: []
            },
            newUsers:{
                data:{},
                NewUserOptions:{},
            },
            aliveUser:{
                data:{},
                aliveUserOptions:{},
            },
            newContent:{
                data:{},
                newContentOptions:{},
            },
            wacthCount:{
                data:{},
                wacthCountOptions:{},
            },
            wacthTime:{
                data:{},
                wacthTimeOptions:{},
            },
            advertCount:{
                data:{},
                advertCountOptions:{},
            },
            newUsersEcharts:null,
            aliveUserEcharts:null,
            newContentEcharts:null,
            wacthCountEcharts:null,
            wacthTimeEcharts:null,
            advertCountEcharts:null,
            timeId:null,
            spanLength:24,
        }
    },
    created(){
        if((document.body.clientWidth - 200) < 1300){
            this.spanLength = 24;
        }else{
            this.spanLength = 12;
        };
    },
    mounted(){
        if(document.querySelector('.homePage')&&document.querySelector('.homePage').clientWidth < 1300){
            this.spanLength = 24;
        }else{
            this.spanLength = 12;
        };
        this.newUsersEcharts = this.$echarts.init(this.$refs['newUsers']);
        this.aliveUserEcharts = this.$echarts.init(this.$refs['activeUsers']);
        this.newContentEcharts = this.$echarts.init(this.$refs['newContent']);
        this.wacthCountEcharts = this.$echarts.init(this.$refs['numberViews']);
        this.wacthTimeEcharts = this.$echarts.init(this.$refs['lengthViewing']);
        this.advertCountEcharts = this.$echarts.init(this.$refs['advClicks']);
        window.addEventListener("resize", () => {
            if(document.querySelector('.homePage')&&document.querySelector('.homePage').clientWidth < 1300){
                this.spanLength = 24;
            }else{
                this.spanLength = 12;
            };
            setTimeout(() => {
                this.newUsersEcharts.resize();  
                this.aliveUserEcharts.resize();  
                this.newContentEcharts.resize();  
                this.wacthCountEcharts.resize();
                this.wacthTimeEcharts.resize();
                this.advertCountEcharts.resize();
            }, 100);
        });
        this.reloadData();
        this.timeId = setInterval(this.reloadData, 60000);
        setTimeout(() => {
            this.newUsersEcharts.resize();  
            this.aliveUserEcharts.resize();  
            this.newContentEcharts.resize();  
            this.wacthCountEcharts.resize();
            this.wacthTimeEcharts.resize();
            this.advertCountEcharts.resize();
        }, 100);
    },
    destroyed () {
        clearInterval(this.timeId)
    },
    methods: {
        reloadData(){
            this.$get('common-web/point/allTotalList').then(res => {
                if (res.code == '000000') {
                    this.newUsers = this.handleOptions(res.data.allTotalNewUser,"NewUserOptions");
                    this.newUsersEcharts.setOption(this.newUsers.NewUserOptions);
                    
                    this.aliveUser = this.handleOptions(res.data.allTotalAliveUser,"aliveUserOptions");
                    this.aliveUserEcharts.setOption(this.aliveUser.aliveUserOptions);

                    this.newContent = this.handleOptions(res.data.allTotalNewContent,"newContentOptions");
                    this.newContentEcharts.setOption(this.newContent.newContentOptions);


                    this.wacthCount = this.handleOptions(res.data.allTotalWacthCount,"wacthCountOptions");
                    this.wacthCountEcharts.setOption(this.wacthCount.wacthCountOptions);

                    this.wacthTime = this.handleOptions(res.data.allTotalWacthTime,"wacthTimeOptions");
                    this.wacthTimeEcharts.setOption(this.wacthTime.wacthTimeOptions);

                    this.advertCount = this.handleOptions(res.data.allTotalAdvertCount,'advertCountOptions');
                    this.advertCountEcharts.setOption(this.advertCount.advertCountOptions);
                }else{
                    this.$message.warning(res.message);
                }
            });
        },
        // 处理echarts数据
        handleOptions(allData,options){
            let returnData = {
                data:{
                    todayTotal: allData.todayTotal,
                    total: allData.total,
                    versionTotal: allData.versionTotal,
                    time:sys_formatDate(new Date(),"yyyy-MM-dd"),
                    nowtime:sys_formatDate(new Date(),"MM-dd HH:mm"),
                }
            };
            returnData[options] = Object.assign({},this.initOptions);
            let xAxisDate = [];
            let seriesData = [];
            let name = '';
            if(options == 'NewUserOptions'){
                name = '新增用户数'
                returnData[options].tooltip.formatter = this.mainFormatter;
            }else if(options == 'aliveUserOptions'){
                name = '活跃用户数'
                returnData[options].tooltip.formatter = this.mainFormatter;
            }else if(options == 'newContentOptions'){
                name = '新增内容数'
                returnData[options].tooltip.formatter = this.mainFormatter;
            }else if(options == 'wacthCountOptions'){
                name = '观看内容数'
                returnData[options].tooltip.formatter = this.mainFormatter;
            }else if(options == 'wacthTimeOptions'){
                name = '观看时长'
                returnData[options].tooltip.formatter = this.wacthTimeFormatter;
            }else if(options == 'advertCountOptions'){
                name = '广告点击数'
                returnData[options].tooltip.formatter = this.mainFormatter;
            };
            for (let i = 0; i < allData.list.length; i++) {
                const list = allData.list[i];
                let obj = {
                    type:'line',
                    data:[]
                };
                if(list.version){
                    obj['name'] = list.version + ' ' + name;
                }else{
                    obj['name'] = name;
                }
                for (let index = 0; index < list.totalList.length; index++) {
                    const listItem = list.totalList[index];
                    if(i == 0){
                        xAxisDate.push(sys_formatDate(listItem.pointTime,"HH:mm"));
                    };
                    obj.data.push(listItem.total);
                };
                seriesData.push(obj);
            };
            returnData[options].xAxis.data = xAxisDate;
            returnData[options].series = seriesData;
            return returnData;
        },
        wacthTimeFormatter(params){
            // let time = params[0].name.split(" ")[1].split(':')[0];
            let time = params[0].name.split(':')[0];
            let str = '';
            str += time + '~' + ((Number(time)+1) < 10 ? "0" + (Number(time)+1) : (Number(time)+1)) + '点' +'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName'] + ' '+this.formatSeconds(element['value']);
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        mainFormatter: function(params){
            // let time = params[0].name.split(" ")[1].split(':')[0];
            let time = params[0].name.split(':')[0];
            let str = '';
            str += time + '~' + ((Number(time)+1) < 10 ? "0" + (Number(time)+1) : (Number(time)+1)) + '点' +'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName'] + ' '+element['value'];
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        // 秒数转为时分秒
        formatSeconds(value) {
            var theTime = parseInt(value);// 秒
            var middle= 0;// 分
            var hour= 0;// 小时
            if(theTime > 60) {
                middle= parseInt(theTime/60);
                theTime = parseInt(theTime%60);
                if(middle> 60) {
                    hour= parseInt(middle/60);
                    middle= parseInt(middle%60);
                }
            }
            var result = ""+parseInt(theTime)+"<span class='little'>秒</span>";
            if(middle > 0) {
                result = ""+parseInt(middle)+"<span class='little'>分</span>"+result;
            }
            if(hour> 0) {
                result = ""+parseInt(hour)+"<span class='little'>小时</span>"+result;
            }
            return result;
        },
      dataFilter(val) {
        this.value = val;
        if (val) { //val存在
          this.options = this.optionsCopy.filter((item) => {
            if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
              return true
            }
          })
        } else { //val为空时，还原数组
          this.options = this.optionsCopy;
        }
      },
      toUser(id){
          this.$router.push({
              path:'/modules/userlist.html',
              query:{
                  slice:id
              }
          });
      },
      toContent(id){
          this.$router.push({
              path:'/modules/contentlist.html',
              query:{
                  slice:id
              }
          });
      },
      toAdv(id){
          this.$router.push({
              path:'/modules/advlist.html',
              query:{
                  slice:id
              }
          });
      },
    }
}
</script>
<style lang="scss">
.homePage .opera,.el-row {
    padding-bottom:0;
}
.homePage .operation .el-col{
    padding-top:0;
}
.homePage .el-card__body{
    padding: 0;
}
.homePage .el-col-6{
    min-width: unset;
}
.little{
    font-size: 14px;
}
</style>