<template>

    <div>
        <div ref="main" style="width: 600px;height:420px;" class="dashboard-container"></div>
    </div>
</template>
    
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
    props: ["num"],
    data() {
        return {
            num2: [],

        }
    },
    created() {
        this.num2 = this.num
        console.log(this.num2)
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
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}:{c}(人数)"      //当鼠标移动到图形 显示数据(格式): 佛山（1111） 10%
                },
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: '教练下的学员数',
                        type: 'pie',
                        radius: [80, 200],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: this.num2,
                        
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
    