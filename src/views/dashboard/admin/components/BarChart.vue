<template>

  <div>
    <div ref="main" style="width: 600px;height:300px;" class="dashboard-container"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const animationDuration = 6000
export default {
  props: ["xiaoshou"],
  data() {
    return {
      xiaoshou2: [],

    }
  },
  created() {
    this.xiaoshou2 = this.xiaoshou
    console.log("emp=", this.xiaoshou2)
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
        title: {//标题
          text: '销售业绩'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['line', 'bar'] //图表类型切换
            },
            icon: "circle"
          },
        },
        grid: {
          top: 30,
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xiaoshou2.map(d=>d.name),
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
        series: [ {
          name: '销售量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '10%',
          data:  this.xiaoshou2.map(d=>d.value),
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
