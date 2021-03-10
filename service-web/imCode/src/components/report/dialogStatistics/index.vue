<template>
  <div class="dialogStatistics">
    <div class="title">
      <h3>总计</h3>
      <div class="buttonBox">
        <span class="btn">访问</span>
        <span class="btn">对话</span>
        <span class="btn">评价</span>
      </div>
    </div>
    <div class="main">
      <el-row>
        <el-col :span="4">
          <div class="grid-content">访客数</div>
          <div class="count">-</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">访问次数</div>
          <div class="count">200</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">浏览量</div>
          <div class="count">100</div>
        </el-col>
      </el-row>
    </div>
    <div class="typeBox">
		<el-button-group>
			<el-button :class="{active: num == 0}" @click="toDayData('0')">小时</el-button>
			<el-button :class="{active: num == 1}" @click="toDayData('1')">天</el-button>
		</el-button-group>
		<div id="myChart" :style="{width: '100%', height: '400px'}"></div>
	</div>
    <div class="tableBox">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label=" " width="150">
			<el-table-column type="index" label=" " width="50"></el-table-column>
			<el-table-column prop="name" label="来源" width="120"></el-table-column>
		</el-table-column>
		<el-table-column prop="date" label="访问" width="150" align="center">
			<el-table-column prop="name" label="访客数" width="120"></el-table-column>
			<el-table-column prop="name" label="访客次数" width="120"></el-table-column>
			<el-table-column prop="name" label="浏览量" width="120"></el-table-column>
		</el-table-column>
		<el-table-column prop="date" label="对话" width="150" align="center">
			<el-table-column prop="name" label="总对话数" width="120"></el-table-column>
			<el-table-column prop="name" label="有效对话数" width="120"></el-table-column>
			<el-table-column prop="name" label="总对话率" width="120"></el-table-column>
			<el-table-column prop="name" label="总消息数" width="120"></el-table-column>
		</el-table-column>
		<el-table-column prop="date" label="评价" width="150" align="center">
			<el-table-column prop="name" label="评价数" width="120"></el-table-column>
			<el-table-column prop="name" label="参评率" width="120"></el-table-column>
			<el-table-column prop="name" label="好评数" width="120"></el-table-column>
			<el-table-column prop="name" label="中评数" width="120"></el-table-column>
			<el-table-column prop="name" label="差评数" width="120"></el-table-column>
		</el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
		tableData: [],
		num: 0
	};
  },
  methods: {
	  drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(
                document.getElementById("myChart")
            );
            myChart.setOption({
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["好评数", "中评", "差评数", "参评率"],
                    bottom: "5%"
                },
                grid: {
                    left: "2%",
                    right: "4%",
                    bottom: "15%",
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        // 去掉图片下载
                        // saveAsImage: {}
                    }
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [
                        "00点",
						"02点",
						"04点",
						"06点",
						"08点",
						"10点",
						"12点",
						"14点",
						"16点",
						"18点",
						"20点",
						"22点",
                    ]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        name: "好评数",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : {
                                color:'rgb(107, 222, 60)', //改变折线点的颜色
                                lineStyle:{
                                    color:'rgb(107, 222, 60)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color: 'rgb(107, 222, 60)'}}, // 添加颜色区域
                        data: [0, 0, 0, 134, 0, 0, 0, 0, 0, 0, 134, 0, 0, 0]
                    },
                    {
                        name: "中评",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : {
                                color:'rgb(255, 158, 71)', //改变折线点的颜色
                                lineStyle:{
                                    color:'rgb(255, 158, 71)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color:'rgb(255, 158, 71)'} },
                        data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: "差评数",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : {
                                color:'rgb(255, 82, 84)', //改变折线点的颜色
                                lineStyle:{
                                    color:'rgb(255, 82, 84)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color:'rgb(255, 82, 84)'} },
                        data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410]
                    }
                ]
            });
        }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
	this.drawLine();
  }
};
</script>

<style lang="less" scoped>
.dialogStatistics {
  .title {
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    padding: 10px 20px;
    min-height: 50px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    h3 {
      font-weight: 400;
      font-size: 14px;
      line-height: 30px;
      color: #323c42;
    }
    .buttonBox {
      padding-left: 20px;
      text-align: right;
      display: inline-block;
      font-size: 0;
      .btn {
        display: inline-block;
        vertical-align: middle;
        padding: 5px 15px;
        background-color: #f2f3f5;
        border: none;
        border-radius: 3px 0 0 3px;
        margin-left: 0;
        color: #939da8;
        white-space: nowrap;
        cursor: pointer;
        font-size: 13px;
        line-height: 20px;
        &:focus,
        &:active {
          padding: 4px 14px;
        }
      }
    }
  }
  .main {
    background: #ffffff;
    color: #969faa;
    padding: 10px 20px;
    box-sizing: border-box;
    height: 120px;
    .el-col {
      padding: 15px 0;
      .grid-content {
        font-size: 13px;
        height: 20px;
      }
      .count {
        font-size: 24px;
        line-height: 34px;
        color: #5a6978;
      }
    }
    .bg-purple-dark {
      color: #000;
    }
  }
  .typeBox{
	padding: 20px;
	background: #ffffff;
	.el-button-group{
		.el-button:hover,
		.el-button.active{
			background-color: #009de7;
			color: #fff;
		}
	}
  }
}
</style>
