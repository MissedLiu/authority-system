<template>
 
    <div>  
    <div ref="main" style="width: 600px;height:400px;" class="dashboard-container"></div>
   </div>
  
  
    
   
  </template>
  
  <script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  export default {
  
    data() {
      return {
  
      }
    },
    mounted() {
      this.showMain()
    },
  
  
    methods: {
      showMain() {
  
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.main);
        // 绘制图表
        myChart.setOption({
          title: {//标题
            text: 'ECharts 入门示例'
          },
          tooltip: {//提示内容
  
          },
          legend: {//图例组件,点击后会显示或隐藏柱状
            data: [{
              name: '销量',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: 'red'
              }
            }],
           
          },
          xAxis: {//x轴的配置
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {//y轴的配置
  
          },
          series: [//序列
            {
              name: '销量',//用于提示框中显示的内容
              type: 'pie',//用于使用哪个图表
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        });
      }
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
  