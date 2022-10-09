<template>
 
  <div>  
  <div class="dashboard-container">
    <el-row :gutter="20">
    <el-col :span="16">
     
      <div><RaddarChart></RaddarChart></div>
    </el-col>
    <el-col :span="8">
      <div><PieChart></PieChart></div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <div><BarChart></BarChart></div>  
    </el-col>
   
  </el-row>
  <el-row :gutter="20">
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="16"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  </div>
  
 
  
  <div><TransactionTable></TransactionTable></div>
 </div>


  
 
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import BarChart from './admin/components/BarChart'
import BoxCard from './admin/components/BoxCard.vue'
import LineChart from './admin/components/LineChart.vue'
import PanelGroup from './admin/components/PanelGroup.vue'
import PieChart from './admin/components/PieChart.vue'
import RaddarChart from './admin/components/RaddarChart.vue'
import TransactionTable from './admin/components/TransactionTable.vue'
export default {
  components:{BarChart,LineChart,PanelGroup,BoxCard,PieChart,RaddarChart,TransactionTable},

  data() {
    return {

    }
  },
  mounted() {
    
  },


  methods: {
   
    
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
