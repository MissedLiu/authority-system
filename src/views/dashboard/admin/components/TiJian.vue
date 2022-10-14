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

        }
    },
    created() {
        this.emp2 = this.emp
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
                dataset: {
                    source: [
                        ['score', 'product'],
                        [89.3, 'Matcha Latte'],
                        [57.1, 'Milk Tea'],
                        [74.4, 'Cheese Cocoa'],
                        [50.1, 'Cheese Brownie'],
                        [89.7, 'Matcha Cocoa'],
                        [68.1, 'Tea'],
                        [19.6, 'Orange Juice'],
                        [10.6, 'Lemon Juice'],
                        [32.7, 'Walnut Brownie']
                    ]
                },
                grid: { containLabel: true },
                xAxis: { name: 'amount' },
                yAxis: { type: 'category' },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    min: 10,
                    max: 100,
                    text: ['High Score', 'Low Score'],
                    // Map the score column to color
                    dimension: 0,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            // Map the "amount" column to X axis.
                            x: 'amount',
                            // Map the "product" column to Y axis
                            y: 'product'
                        }
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
    