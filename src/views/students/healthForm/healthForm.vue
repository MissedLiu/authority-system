<template>

  <el-main>

    <el-row>
      <el-col :span="12">
        <!-- 查询条件 -->
        <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
          <el-form-item>
            <el-input v-model="searchModel.memberName" placeholder="请输入会员名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>

          </el-form-item>
        </el-form>
        <!-- 数据表格 -->

        <el-table :data="userList" :height="tableHeight" stripe style="width: 100%;  margin-bottom: 10px">
          <el-table-column prop="healthformId" label="体检编号" align="center"></el-table-column>
          <el-table-column prop="memberName" label="会员姓名"></el-table-column>
          <el-table-column prop="weight" label="体重" width="50" align="center"></el-table-column>
          <el-table-column prop="height" label="身高" width="50" align="center"></el-table-column>
          <el-table-column prop="obpm" label="血压测量" align="center"></el-table-column>
          <el-table-column prop="time" label="体检时间" width="100"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete" type="danger" plain size="small" @click="handleEdit(scope.row)"
                v-if="hasPermission('healthForm:healthForm:delete')">删除
              </el-button>
              <el-button icon=" el-icon-s-unfold" type="success" plain size="small" @click="xingqing(scope.row)">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>

      <el-col :span="12">
        <div>
          <ti-jian v-if="flag" :tijian="this.xueYuan"></ti-jian>
        </div>
      </el-col>


    </el-row>
  </el-main>

</template>
<script>
import healthform from '@/api/healthform'
import TiJian from './TiJian.vue'
import userApi from '@/api/userApi';
export default {
  components: {
    TiJian
  },
  data() {
    return {
      //查询条件
      searchModel: {
        empId: "", //用户名   
        memberName: "",
        pageNo: 1,//当前页码
        pageSize: 10,//每页显示条数
      },
      userList: [],//角色列表
      tableHeight: 0,//表格高度
      pageNo: 1,//当前页码
      total: 0,//数据总数量
      pageSize: 10,//每页显示数量
      flag: false,
      xueYuan: {},
      station: "",

    }
  },
  created() {
    this.search()
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    async search(pageNo, pageSize) {
      let userId = this.$store.getters.userId;
      let res2 = await userApi.empByUserId({ id: userId });
      this.station = res2.data.emp.station
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      this.searchModel.empId = this.$store.getters.userId;
      let res =null;
      if(this.station=="教练部经理"){
          res=await healthform.listAllStation(this.searchModel);
      }else{
        res = await healthform.listByEmpId(this.searchModel);
      }
      if (res.success) {
        this.userList = res.data.records
        this.total = res.data.total
        console.log(res.data);

      }
    },
    //重置
    resetValue() {
      this.searchModel.memberName = "",
        this.search();
    },
    /**
       * 当每页数量发生变化时触发该事件
       */
    handleSizeChange(size) {
      //修改每页显示数量
      this.pageSize = size
      //调用查询方法
      this.search(this.pageNo, size)
    },
    /**
    * 当页码发生变化时触发该事件
    */
    handleCurrentChange(page) {
      //修改当前页码
      this.pageNo = page
      //调用查询方法
      this.search(page, this.pageSize)
    },
    //删除
    async handleEdit(row) {
      console.log(row.healthformId)
      let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
      if (confirm) {
        //发送删除请求
        let res = await healthform.delete({ id: row.healthformId });
        this.flag = false;
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message)
          //刷新数据
          this.search(this.pageNo, this.pageSize);
        } else {
          //提示失败
          this.$message.error(res.message)
        }

      }

    },
    //详情按钮
    //根据id查询所有会员体检
    async xingqing(row) {
      this.flag = false;
      console.log(row)
      let res = await healthform.healthform({ id: row.healthformId })
      this.xueYuan = res.data
      console.log("s=", this.xueYuan)
      this.$nextTick(() => {
        this.flag = true
      })


    }
  }
}
</script>
<style >
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>