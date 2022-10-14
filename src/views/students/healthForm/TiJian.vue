<template>

    <div>
        <div ref="main" style="width: 600px;height:600px;" class="dashboard-container"></div>
    </div>
</template>
    
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
    props: ["tijian"],
    data() {
        return {
            tijian2: [],

        }
    },
    created() {
        this.tijian2 = this.tijian
        console.log("==", this.tijian2)
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
                        [this.tijian.hipline, '臀围'],
                        [this.tijian.shoulderWai, '肩围'],
                        [this.tijian.belly, '腹围'],
                        [this.tijian.bw, '胸围'],
                        [this.tijian.upbicepLeft, '上臂围'],
                        [this.tijian.beforebicepRight, '前臂围'],
                        [this.tijian.bigtrousersLeft, '大腿围'],
                        [this.tijian.littletrousersRight, '小腿围'],
                        [this.tijian.littletrousersRight, '腰围'],
                        [this.tijian.waistline, '脂肪'],
                        [this.tijian.weightnbim, '体重指数BIM'],
                        [this.tijian.uimsatz, '基础代谢'],
                        [this.tijian.endurance, '腹肌耐力'],
                        [this.tijian.flexibility, '柔韧度测试'],
                        [this.tijian.pushup, '俯卧撑测试'],

                        [this.tijian.hrrest, '心率'],
                    ]
                },
                tooltip: {
                    trigger: 'axis',
                    // 重写提示框内容样式
                    formatter: function (params, ticket, callback) {
                        var showHtm = '数据' + '<br>';

                        showHtm += params[0].data[1] + ':' + params[0].data[0] + '<br>'

                        return showHtm;
                    }
                },
                grid: { containLabel: true },
                xAxis: { name: '大小' },
                yAxis: { type: 'category' },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    min: 10,
                    max: 100,
                    text: ['体检数据'],
                    // Map the score column to color
                    dimension: 0,
                    inRange: {
                        color: ['#65B581', '#FFCE34', '#FD665F']
                    }
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'insideRight',
                            formatter: function (params) {
                                return params.value[0] + "";
                            }
                        },
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
    