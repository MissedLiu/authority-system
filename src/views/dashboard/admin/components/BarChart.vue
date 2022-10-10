<template>

  <div>
    <div ref="main" style="width: 600px;height:400px;" class="dashboard-container"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const animationDuration = 6000
export default {
  props: ["JiaoXue"],
  data() {
    return {
      JiaoXue2: [],

    }
  },
  created() {
    this.JiaoXue2 = this.JiaoXue
    console.log("emp=", this.JiaoXue)
    this.showMain();
  },

  mounted() {
    this.$nextTick(() => {
      this.showMain()
    })
  },

  methods: {

    showMain() {

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main);
      // 绘制图表
      myChart.setOption({

        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.JiaoXue2.map(d=>d.name),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '总人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data:this.JiaoXue2.map(d=>d.value),
          animationDuration
        }, {
          name: '私教套餐人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '团操套餐人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      });

    },

  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
