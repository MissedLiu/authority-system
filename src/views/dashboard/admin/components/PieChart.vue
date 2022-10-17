<template>
  <div ref="main" style="height:300px;" class="dashboard2-container" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: ["mealNum"],
  data() {
    return {
      chart: null
    }
  },
  created() {
    console.log(this.mealNum)
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          // title: {//标题
          //   text: '人数'
          // },
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} (次)'
        },
        title: {
           text: '套餐销量',
          x: 15,
          y: 15,
          textStyle: {  //标题文字设置
           
            color: '#070707'
          }
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.mealNum.map(d => d.name)
        },
        series: [
          {
            name: '销量',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 75],
            center: ['50%', '38%'],
            data: this.mealNum,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard2 {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>