<template>

  <div>
    <div class="dashboard-container">
      <el-row :gutter="20">
        <el-col :span="14">
          <bin-zhuang v-if="flag" :emp="this.empNUm"></bin-zhuang>
        </el-col>
        <el-col :span="8">
          <div>
            <PieChart v-if="flag" :mealNum="this.TeamlNum"></PieChart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div>
            <BarChart v-if="flag" :JiaoXue="this.JiaoXue" :tuanNum="this.countTeamNum" :sijiao="this.countPtNum"></BarChart>
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
import memberApi from '@/api/member'
import xueyuanApi from '@/api/xueyuanApi'
import teamApi from '@/api/team'
import ptApi from '@/api/pt'
export default {
  components: { BarChart,LineChart, PanelGroup, BoxCard, PieChart, RaddarChart, TransactionTable, BinZhuang },

  data() {
    return {
      empNUm: {},
      TeamlNum: {},
      JiaoXue:{},
      countTeamNum:{},
      countPtNum:{},
      flag: false,
    }
  },
  mounted() {

  },
  created() {
    this.findres();
  },

  methods: {
    async findres() {
      //统计部门人数
      let res = await empApi.CountEmpNum();
      this.empNUm = res.data;
      //统计套餐办理数
      let mealNum = await memberApi.findNum();
      this.TeamlNum = mealNum.data;
      //统计教练下学员数   
      let jaioxueNum = await xueyuanApi.findNumJiaoLian();
      this.JiaoXue = jaioxueNum.data;
      //统计团操人数
      let countteamnum=await teamApi.countTeamNum();
      this.countTeamNum=countteamnum.data;
       //统计私教人数
       let countptnum=await ptApi.countPtNum();
      this.countPtNum=countptnum.data;
      this.flag = true;
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
