<template>

    <div>
        <div ref="main" style="width: 600px;height:400px;" class="dashboard-container"></div>
    </div>
</template>
    
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
    props: ["emp"],
    data() {
        return {
            emp2: [],
            data: [],
            timer:'',
        }
    },
    created() {
        this.emp2 = this.emp
        this.showMain();
        this.run() 
        
    },
    mounted() {
        this.showMain()
    },


    methods: {

        showMain() {
            
            for (let i = 0; i < 5; ++i) {
                this.data.push(Math.round(Math.random() * 200));
            }
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(this.$refs.main);
            // 绘制图表
            myChart.setOption({
                xAxis: {
                    max: 'dataMax'
                },
                yAxis: {
                    type: 'category',
                    data: ['A', 'B', 'C', 'D', 'E'],
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                    max: 2 // only the largest 3 bars will be displayed
                },
                series: [
                    {
                        realtimeSort: true,
                        name: 'X',
                        type: 'bar',
                        data: this.data,
                        label: {
                            show: true,
                            position: 'right',
                            valueAnimation: true
                        }
                    }
                ],
                legend: {
                    show: true
                },
                animationDuration: 0,
                animationDurationUpdate: 3000,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear'
            });

        },
        run() {
            for (var i = 0; i < this.data.length; ++i) {
                console.log("00=",this.data)
                if (Math.random() > 0.9) {
                    this.data[i] += Math.round(Math.random() * 2000);
                } else {
                    this.data[i] += Math.round(Math.random() * 200);
                }
            }

        },
        mounted() {
      this.timer = setInterval(this.run, 3000);
      this.timer = setTimeout(this.run, 0);
    },
    beforeDestroy() {
     
      clearTimeout(this.timer);
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
    