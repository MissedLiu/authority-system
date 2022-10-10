<template>

  <div>
    <div class="dashboard-container">
      <el-row :gutter="20">
        <el-col :span="16">
          <!-- <div><RaddarChart></RaddarChart></div> -->
          <bin-zhuang v-if="flag" :emp="this.empNUm"></bin-zhuang>

        </el-col>
        <el-col :span="8">
          <div>
            <PieChart></PieChart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div>
            <BarChart></BarChart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
        </el-col>
        <el-col :span="16">
          <div class="grid-content ep-bg-purple" />
        </el-col>
        <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
        </el-col>
      </el-row>
    </div>
  </div>




</template>

<script>
require('echarts/theme/macarons') // echarts theme
import BarChart from './admin/components/BarChart'
import BoxCard from './admin/components/BoxCard.vue'
import LineChart from './admin/components/LineChart.vue'
import PanelGroup from './admin/components/PanelGroup.vue'
import PieChart from './admin/components/PieChart.vue'
import RaddarChart from './admin/components/RaddarChart.vue'
import TransactionTable from './admin/components/TransactionTable.vue'
import BinZhuang from './admin/components/BinZhuang.vue'
import empApi from '@/api/empApi'

export default {
  components: { BarChart, LineChart, PanelGroup, BoxCard, PieChart, RaddarChart, TransactionTable, BinZhuang },

  data() {
    return {
      empNUm: {},
      flag:false,
    }
  },
  mounted() {
    
  },
  created() {
    this.find();
  },

  methods: {
    async find() {
      let res = await empApi.CountEmpNum();
     
      if (res.success) {
        console.log(res.data)
        this.empNUm = res.data;     
      }
      this.flag=true;
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
