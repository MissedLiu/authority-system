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
        <el-col :span="12">
          <jiao-xue v-if="flag" :num="this.CountNum"></jiao-xue>
         
        </el-col>
        <el-col :span="8">
          <div>
            <BarChart v-if="flag"  :xiaoshou="this.xiaoshou"></BarChart>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="16">
        </el-col>
        <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
        </el-col>
      </el-row>
    </div>
  </div>




</template>

<script>
import BarChart from './admin/components/BarChart'
import BoxCard from './admin/components/BoxCard.vue'
import LineChart from './admin/components/LineChart.vue'
import PanelGroup from './admin/components/PanelGroup.vue'
import PieChart from './admin/components/PieChart.vue'
import RaddarChart from './admin/components/RaddarChart.vue'
import TransactionTable from './admin/components/TransactionTable.vue'
import BinZhuang from './admin/components/BinZhuang.vue'
import JiaoXue from './admin/components/JiaoXue.vue'
import XiaoShou from './admin/components/XiaoShou.vue'
import empApi from '@/api/empApi'
import memberApi from '@/api/member'
import xueyuanApi from '@/api/xueyuanApi'
import teamApi from '@/api/team'
import ptApi from '@/api/pt'
import salesApi from '@/api/salesApi'
export default {
  components: { BarChart,XiaoShou,LineChart,JiaoXue, PanelGroup, BoxCard, PieChart, RaddarChart, TransactionTable, BinZhuang },

  data() {
    return {
      empNUm: {},
      TeamlNum: {},
      JiaoXue:{},
      countTeamNum:{},
      countPtNum:{},
      CountNum: {},
      xiaoshou :{},
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
      //??????????????????
      let res = await empApi.CountEmpNum();
      this.empNUm = res.data;
      //?????????????????????
      let mealNum = await memberApi.findNum();
      this.TeamlNum = mealNum.data;
   //?????????????????????????????????
   let num=await xueyuanApi.findJiaoXueCount()
     this.CountNum=num.data
     //???????????????
     let xiaoshou2=await salesApi.findSalesCount();
     this.xiaoshou=xiaoshou2.data;
     console.log("==", this.xiaoshou)
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
