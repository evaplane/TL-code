<template>
    <div class='homeContent'>
        <!-- 栅格 -->
        <el-row class='operation'>
        <!-- 输入框 -->
        <el-col :span="8">
            <el-form :inline="true" class="demo-form-inline publishTime">
            <el-form-item label="  ">
                <el-date-picker
                    @change="dateChange"
                    v-model="dateRange"
                    :picker-options="pickerOptions"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="6">
            <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
                <el-select v-model="dayData.platform" placeholder="全部渠道" @change="getVersion">
                    <el-option v-for="item in channelTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="6">
            <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
                <el-select v-model="editionType" placeholder="全部版本" @change="selectEdition">
                    <el-option v-for="item in editionTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            </el-form>
        </el-col>
        </el-row>
        <!-- 内容 -->
        <div class='content' ref="content">
            <el-row class='operation'>
                <el-col :span="24" style="position:relative">
                    <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;margin-left:30px;" @change="handleRadioChange">
                        <el-radio-button label="新增内容数">新增内容数</el-radio-button>
                        <el-radio-button label="观看内容数">观看内容数</el-radio-button>
                        <el-radio-button label="观看内容时长">观看内容时长</el-radio-button>
                    </el-radio-group>
                    <div v-show="showData" id="age" ref="usersDay" :style="{height: '540px',margin: '0px 10px',padding:'10px 0 0 5px'}"></div>
                    <div  v-show="!showData" :style="{height: '500px',lineHeight:'300px',textAlign:'center'}">暂无数据</div>
                </el-col>
            </el-row>
            <div v-show="showData">
                <p v-if='showmore' style="cursor:pointer;margin:10px;" @click="moreOrnot">展开明细数据<i class="el-icon-arrow-down"></i></p>
                <p v-else style="cursor:pointer;margin:10px 0 30px;" @click="moreOrnot">收起明细数据<i class="el-icon-arrow-up"></i></p>
            </div>
            <el-table
                :data="tableData"
                v-if="!showmore"
                border
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column
                    prop="platform"
                    label="渠道名称"
                    v-if="tabPosition == '观看内容数'||tabPosition == '观看内容时长'"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.platform == 1">Android</span>
                        <span v-if="scope.row.platform == 2">IOS</span>
                        <span v-if="scope.row.platform == 3">Web</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="classify"
                    label="分类名称"
                    v-if="tabPosition == '新增内容数'"
                    show-overflow-tooltip></el-table-column>
                <el-table-column
                    :label="tabPosition == '观看内容数'?'今日观看内容数':(tabPosition == '新增内容数'?'今日新增内容数':'今日观看内容时长')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="tabPosition == '观看内容时长'" v-html="formatSeconds(scope.row.todayTotal)"></div>
                        <span v-else>{{scope.row.todayTotal}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="total"
                    :label="tabPosition == '观看内容数'?'观看内容总数':(tabPosition == '新增内容数'?'总内容数':'观看内容总时长')"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="tabPosition == '观看内容时长'" v-html="formatSeconds(scope.row.total)"></div>
                        <span v-else>{{scope.row.total}}</span>
                    </template>
                </el-table-column>

            </el-table>
            <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="80%"
                @opened="handleOpen"
                :before-close="handleClose">
                </el-dialog>
        </div>
        <div class="showHoursPop" v-show="diaVisible" @click="diaVisible = false">
            <div class="popcontent" :style="{left:diaLeft,top:diaTop}">
                <div ref="usersHours" :style="{height: '300px',width:'800px',margin: '0px 10px',padding:'10px 0 0 5px'}"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { sys_formatDate } from '../../js/util';
export default {
    name:'contentlist',
    data: function () {
        return {
            pickerMinDate: '',
            dateRange: [],
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.pickerMinDate = minDate.getTime()
                    if (maxDate) {
                    this.pickerMinDate = ''
                    }
                },
                disabledDate: (time) => {
                    if (this.pickerMinDate !== '') {
                    const day30 = (30 - 1) * 24 * 3600 * 1000
                    let maxTime = this.pickerMinDate + day30
                    if (maxTime > new Date()) {
                        maxTime = new Date()
                    }
                    return time.getTime() > maxTime
                    }
                    return time.getTime() > Date.now()
                }
            },
            channelTypeData:[{
                value: '',
                label: '全部渠道'
                },{
                value: '1',
                label: 'Android'
                }, {
                value: '2',
                label: 'IOS'
                }, {
                value: '3',
                label: 'web'
                }
            ],
            showData:true,
            showDialogData:true,
            tabPosition: '新增数',
            editionType:'',
            editionTypeData:[{
                value: '',
                label: '全部版本'
                }, {
                value: '1',
                label: '1.1.0'
            }, {
                value: '2',
                label: '1.1.1'
            }, {
                value: '3',
                label: '1.1.2'
            }],
            dayData:{
                startTime:'',
                endTime:'',
                platform:'',
                classify:'',
                version:'',
            },
            usersDayEcharts:null,
            initOptions:{
                tooltip: {
                    trigger: 'axis',
                    // formatter
                },
                legend: {
                    // 更新此处数据
                    data:[],
                    // 更新此处数据
                    selected:{
                        // '邮件营销':false
                    },
                    // type: 'scroll',
                    bottom: 0,
                },
                grid: {
                    left: '2%',
                    right: '3%',
                    top: '2%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    // 更新此处数据
                    data: []
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value'
                },
                // 更新此处数据
                series: []
            },


            chartOptions:{
            },
            chartOptionsHours:{
            },
            showmore:true,
            tableData:[],
            dialogVisible:false,
            dialogTitle:'',
            diaLeft:0,
            diaTop:0,
            diaVisible:false,
            setDate:false,
        }
    },
    created(){
        let slice = this.$route.query.slice;
        if(!slice){
            this.$router.replace({query:{
                slice:3
            }});
            slice = 3;
            this.tabPosition = "新增内容数";
        }else if(slice == 3){
            this.tabPosition = "新增内容数";
        }else if (slice == 1){
            this.tabPosition = '观看内容数';
        }else if(slice == 2){
            this.tabPosition = '观看内容时长';
        };
        this.allList(slice);
        this.getVersion();
    },
    mounted(){
        this.usersDayEcharts = this.$echarts.init(this.$refs['usersDay']);
        window.addEventListener("resize", () => { 
            this.usersDayEcharts.resize();  
        });
        this.reloadData();
    },
    methods: {
        allList(slice){
            this.$get('common-web/point/contentTotalList',{
                type:slice
            }).then((res)=>{
                if(res.code == '000000'){
                    this.tableData = res.data;
                }else{
                    this.$message.warning(res.message);
                };
            });
        },
        reloadData(){
            let url;
            if(this.tabPosition == '新增内容数'){
                url = 'common-web/point/newContentDayList';
            }else if(this.tabPosition == '观看内容数'){
                url = 'common-web/point/wacthCountDayList';
            }else if(this.tabPosition == '观看内容时长'){
                url = 'common-web/point/wacthTimeDayList';
            };
            let data = {};
            for(let item in this.dayData){
                if(this.dayData[item]){
                    data[item] = this.dayData[item]
                }
            };
            this.usersDayEcharts.showLoading();
            // 绘制图表
            this.$get(url,data).then(res => {
                if (res.code == '000000') {
                    if(res.data.length > 0){
                        this.showData = true;
                        this.chartOptions = this.handleOptions(res.data);
                        this.usersDayEcharts.clear();
                        this.onClickbind();
                        this.usersDayEcharts.hideLoading();
                        this.usersDayEcharts.setOption(this.chartOptions);
                        if(!this.setDate){
                            this.setDate = true;
                            this.dateRange.push(this.chartOptions.xAxis.data[0])
                            this.dateRange.push(this.chartOptions.xAxis.data[this.chartOptions.xAxis.data.length-1])
                        };
                    }else{
                        this.showData = false;
                    };
                    
                    
                }else{
                    this.$message.warning(res.message);
                }
            });
        },
        newFormatter(params){
            var str = '';
            str += params[0].name+'<br/>';
            let pWidth;
            let dWidth;
            if(params <= 15){
                pWidth = 'unset';
                dWidth = 'unset';
            }else if(params.length <= 40){
                pWidth = '50%';
                dWidth = '400px';
            }else if(params.length <= 60){
                pWidth = '33%';
                dWidth = '600px';
            }else{
                pWidth = '25%';
                dWidth = '800px';
            };
            if(params.length > 1){
                for (let index = 0; index < params.length; index++) {
                    const element = params[index];
                    str += "<p style='width:"+pWidth+";margin:0;padding:0;float:left;white-space:pre-line;'>"+element['marker']+element['seriesName']+ ' ' + this.tabPosition +':'+element['value']+"</p>";
                };
            }else{
                str += "<p style='width:100%;margin:0;padding:0;float:left;white-space:pre-line;'>"+params[0]['marker']+params[0]['seriesName']+ ' ' + this.tabPosition +':'+params[0]['value']+"</p>";
            }
            
            return `<div style="max-width:${dWidth};">${str}</div>`
        },
        watchFormatter(params){
            var str = '';
            str += params[0].name+'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName']+ ' ' + this.tabPosition +':'+element['value'];
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        watchTimeFormatter(params){
            var str = '';
            str += params[0].name+'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName']+ ' ' + this.tabPosition +':'+this.formatSeconds(element['value']);
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        // 处理图表数据 - 同时返回选择列表
        handleOptions(allData){
            let options = JSON.parse(JSON.stringify(this.initOptions));
            let xAxisDate = [];
            let seriesData = [];
            // let editionTypeData = [{
            //     value: '0',
            //     label: '全部版本'
            // }];
            let legendData = [];
            let arr = [];
            let length = allData.length;
            for (let i = 0; i < allData.length; i++) {
                const list = allData[i];
                let name = '';
                if(this.tabPosition == '新增内容数'){
                    name = list.classify
                }else{
                    if(list.platform == 1){
                        name = 'android'
                    }else if(list.platform == 2){
                        name = 'ios'
                    }else{
                        name = 'web'
                    };
                }
                let obj = {
                    type:'line',
                    name:name,
                    data:[]
                };
                
                legendData.push(name);
                for (let index = 0; index < list.totalList.length; index++) {
                    const listItem = list.totalList[index];
                    if(i == 0){
                        xAxisDate.push(sys_formatDate(listItem.pointTime,'yyyy-MM-dd'));
                    };
                    obj.data.push(listItem.total);
                    arr.push(listItem.total)
                };
                seriesData.push(obj);
                // editionTypeData.push({
                //     value: String(i+1),
                //     label: list.classify
                // })
            };
            if(this.tabPosition == '新增内容数'){
                options.tooltip.formatter = this.newFormatter;
            }else if(this.tabPosition == '观看内容数'){
                options.tooltip.formatter = this.watchFormatter;
            }else if(this.tabPosition == '观看内容时长'){
                options.tooltip.formatter = this.watchTimeFormatter;
            };
            if(length > 40){
                options.grid.bottom = '20%';
            }else{
                options.grid.bottom = '10%';
            };
            options.xAxis.data = xAxisDate;
            options.series = seriesData;
            options.legend.data = legendData;
            return options;
        },
        timeFormatter(params){
            let time = params[0].name.split(" ")[1].split(':')[0];
            let str = '';
            str += time + '~' + ((Number(time)+1) < 10 ? "0" + (Number(time)+1) : (Number(time)+1)) + '点' +'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName']+ ' ' + this.tabPosition +':'+element['value'];
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        timeTimeFormatter(params){
            let time = params[0].name.split(" ")[1].split(':')[0];
            let str = '';
            str += time + '~' + ((Number(time)+1) < 10 ? "0" + (Number(time)+1) : (Number(time)+1)) + '点' +'<br/>';
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                str += element['marker']+element['seriesName']+ ' ' + this.tabPosition +':'+this.formatSeconds(element['value']);
                if(str != params.length - 1){
                    str += '<br/>';
                }
            };
            return str;
        },
        handleOptionsHours(allData,color){
            let options = JSON.parse(JSON.stringify(this.initOptions));
            if(this.tabPosition == '观看内容时长'){
                options.tooltip.formatter = this.timeTimeFormatter;
            }else{
                options.tooltip.formatter = this.timeFormatter;
            };
            let legendData = [];
            let xAxisDate = [];
            let seriesData = [];
            let obj1 = {
                type:'line',
                name:"android",
                data:[],
                itemStyle:{
                    normal: {
                        color: color,//折线点的颜色
                        lineStyle: {
                            color: color//折线的颜色
                        }
                    }
                }
            };
            let obj2 = {
                type:'line',
                name:'ios',
                data:[],
                itemStyle:{
                    normal: {
                        color: color,//折线点的颜色
                        lineStyle: {
                            color: color//折线的颜色
                        }
                    }
                }
            };
            let obj3 = {
                type:'line',
                name:'web',
                data:[],
                itemStyle:{
                    normal: {
                        color: color,//折线点的颜色
                        lineStyle: {
                            color: color//折线的颜色
                        }
                    }
                }
            };
            let obj4 = {
                type:'line',
                name:'',
                data:[],
                itemStyle:{
                    normal: {
                        color: color,//折线点的颜色
                        lineStyle: {
                            color: color//折线的颜色
                        }
                    }
                }
            };
            for (let i = 0; i < allData.length; i++) {
                const list = allData[i];
                switch(list.platform){
                    case 1:
                        obj1.data.push(list.count);
                        if(legendData.indexOf("android") == -1){
                            legendData.push("android");
                        };
                        break;
                    case 2:
                        obj2.data.push(list.count);
                        if(legendData.indexOf("ios") == -1){
                            legendData.push("ios");
                        };
                        break;
                    case 3:
                        obj3.data.push(list.count);
                        if(legendData.indexOf("web") == -1){
                            legendData.push("web");
                        };
                        break;
                    default:
                        obj4.name = list.classify;
                        legendData = [list.classify];
                        obj4.data.push(list.count);
                };
                let time = sys_formatDate(list.pointTime,'yyyy-MM-dd HH:mm:ss');
                if(xAxisDate.indexOf(time) == -1){
                    xAxisDate.push(time);
                };
            };
            obj1.data.length>0 && seriesData.push(obj1);
            obj2.data.length>0 && seriesData.push(obj2);
            obj3.data.length>0 && seriesData.push(obj3);
            obj4.data.length>0 && seriesData.push(obj4);
            options.grid.left = "6%";
            options.xAxis.data = xAxisDate;
            options.series = seriesData;
            options.legend.data = legendData;
            return options;
        },
        loadHoursData(classify,dayTime,offsetX,offsetY,color){
            let url;
            let data = {};
            dayTime = dayTime.replace(/-/g,'/');
            dayTime += ' 00:00:00';
            data.dayTime = dayTime;
            data.classify = '';
            data.platform = '';
            data.version = '';
            if(this.tabPosition == '新增内容数'){
                url = 'common-web/point/newContentHourList';
                data.classify = classify;
            }else if(this.tabPosition == '观看内容数'){
                if(classify == 'android'){
                    data.platform = 1;
                }else if(classify == 'ios'){
                    data.platform = 2;
                }else{
                    data.platform = 3;
                };
                url = 'common-web/point/wacthCountHourList';
            }else if(this.tabPosition == '观看内容时长'){
                if(classify == 'android'){
                    data.platform = 1;
                }else if(classify == 'ios'){
                    data.platform = 2;
                }else{
                    data.platform = 3;
                };
                url = 'common-web/point/wacthTimeHourList';
            };
            dayTime = dayTime.replace(/-/g,'/');
            dayTime += ' 00:00:00';
            // classify
            // 绘制图表
            this.$get(url,data).then(res => {
                if (res.code == '000000') {
                    this.diaVisible = true;
                    if(this.$refs['content'].offsetWidth > (offsetX+50 + 810)){
                        this.diaLeft = offsetX+50 + 'px';
                    }else{
                        this.diaLeft = offsetX - 810 + 'px';
                    }
                    this.diaTop ='240px';
                    this.chartOptionsHours = this.handleOptionsHours(res.data,color);
                    if(this.usersHoursEcharts){
                        this.usersHoursEcharts.clear();
                        this.usersHoursEcharts.setOption(this.chartOptionsHours);
                    }else{
                        this.usersHoursEcharts = this.$echarts.init(this.$refs['usersHours']);
                        this.usersHoursEcharts.setOption(this.chartOptionsHours);
                    };  
                }else{
                    this.$message.warning(res.message);
                };
            });
        },
        onClickbind(){
            this.usersDayEcharts.off('click');
            this.usersDayEcharts.on('click', (handler) => {
                console.log(handler)
                if(new Date(handler.name).getTime() < new Date().getTime()){
                    this.dialogTitle = handler.name + ' ' + handler.seriesName +' ' + this.tabPosition;
                    this.loadHoursData(handler.seriesName,handler.name,handler.event.offsetX,handler.event.offsetY,handler.color);
                }else{
                    return;
                };
            });
        },
        handleRadioChange(val){
            this.showmore = true;
            this.reloadData();
            if(this.tabPosition == '新增内容数'){
                // this.$router.replace()
                this.allList(3);
                this.$router.replace({query:{
                    slice:3
                }});
            }else if(this.tabPosition == '观看内容数'){
                this.allList(1);
                this.$router.replace({query:{
                    slice:1
                }});
            }else if(this.tabPosition == '观看内容时长'){
                this.allList(2);
                this.$router.replace({query:{
                    slice:2
                }});
            };
        },
        getVersion(val){
            var data = {};
            if(val){
                data.type = val;
            };
            this.$get('common-web/upgrade/allList',data).then((res)=>{
                if(res.code == '000000'){
                    var arr = [{value: '',label: '全部版本'}];
                    for (let index = 0; index < res.data.length; index++) {
                        const element = res.data[index];
                        arr.push({
                            value:String(index + 1),
                            label:element
                        });
                    }
                this.editionTypeData = [...arr];
                }else{
                    this.$message.warning(res.message);
                };
            });
            this.editionType = '';
            this.dayData.version = '';
            if(this.usersDayEcharts){
                this.reloadData();
            };
        },
        setVersion(){
            let obj = this.editionTypeData.find((data)=>{
                return data.value === this.editionType;
            });
            if(obj.value){
                return this.dayData.version = obj.label;
            }else{
                return this.dayData.version = null;
            };
        },
        selectEdition(item){
            this.setVersion();
            this.reloadData();
            return;
            let flag;
            if(item == '0'){
                flag = true; 
            };
            var newShow = {};
            for (let index = 0; index < this.editionTypeData.length; index++) {
                const element = this.editionTypeData[index];
                if(element.label != this.editionTypeData[item].label){
                    newShow[element.label] = false;
                }else{
                    newShow[element.label] = true;
                };
                if(flag){
                    newShow[element.label] = true;
                }
            }
            this.chartOptions.legend.selected = newShow;
            this.usersDayEcharts.setOption(this.chartOptions);
        },
        moreOrnot(){
            this.showmore = !this.showmore;
        },
        dateChange(data){
            if(!this.setDate)return;
            if(data){
                this.dayData.startTime = sys_formatDate(data[0],'yyyy/MM/dd HH:ss:mm');
                this.dayData.endTime = sys_formatDate(data[1],'yyyy/MM/dd HH:ss:mm');
                this.reloadData();
                return;
            }else{
                this.dayData.startTime = '';
                this.dayData.endTime = '';
                this.reloadData();
                return;
            }
        },
        handleOpen(){
            this.usersHoursEcharts = this.$echarts.init(this.$refs['usersHours']);
            this.usersHoursEcharts.setOption(this.chartOptionsHours);
        },
        handleClose(done){
            console.log(1);
            done();
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
    }
}
</script>
<style lang="scss">
.homeContent{
    position: relative;
}
.homeContent .operation {
    padding-left:0;
}
.homeContent .publishTime .el-range-input{
    min-width: 135px;
}
.showHoursPop{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(50, 50, 50, 0.7);
    .popcontent{
        position: absolute;
        border-style: solid;
        min-width:800px;
        white-space: nowrap;
        z-index: 9999999;
        transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
        background-color: #fff;
        border-width: 0px;
        border-color: rgb(51, 51, 51);
        border-radius: 4px;
        color: rgb(255, 255, 255);
        font: 14px/21px "Microsoft YaHei";
        padding: 5px;
    }
}
</style>