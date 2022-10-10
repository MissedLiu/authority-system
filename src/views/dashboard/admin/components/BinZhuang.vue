<template>
 
    <div>  
    <div ref="main" style="width: 600px;height:400px;" class="dashboard-container"></div>
   </div>
  </template>
  
  <script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  export default {
    props:["emp"],
    data() {
      return {
        emp2:[],
        
      }
    },
    created(){
      this.emp2=this.emp
        this.showMain();
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
            text: '部门人数'
          },
          tooltip: {//提示内容
  
          },
          legend: {//图例组件,点击后会显示或隐藏柱状
            data: [{
              name: '人数',
              // 强制设置图形为圆。circle
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: 'red'
              }
            }],
           
          },
          xAxis: {//x轴的配置
            data: this.emp2.map(d=>d.name)
          },
          yAxis: {//y轴的配置
  
          },
          series: [//序列
            {

              name: '人数',//用于提示框中显示的内容
              type: 'bar',//用于使用哪个图表
              data:this.emp2.map(d=>d.value)
            }
          ]
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
  