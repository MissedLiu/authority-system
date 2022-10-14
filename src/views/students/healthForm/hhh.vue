<template>
    <el-main>
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
  
      <el-table :data="userList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
        <el-table-column prop="healthformId" label="体检编号" width="100" align="center"></el-table-column>
        <el-table-column prop="memberName" label="会员姓名"></el-table-column>
        <el-table-column prop="weight" label="体重"></el-table-column>
        <el-table-column prop="height" label="身高" width="100" align="center"></el-table-column>
        <el-table-column prop="hipline" label="臀围"></el-table-column>
        <el-table-column prop="shoulderWai" label="肩围"></el-table-column>
        <el-table-column prop="belly" label="腹围"></el-table-column>
        <el-table-column prop="bw" label="胸围" width="100" align="center"></el-table-column>
        <el-table-column prop="upbicepLeft" label="上臂围"></el-table-column>
        <el-table-column prop="beforebicepRight" label="前臂围"></el-table-column>
        <el-table-column prop="bigtrousersLeft" label="大腿围"></el-table-column>
        <el-table-column prop="littletrousersRight" label="小腿围" width="100" align="center"></el-table-column>
        <el-table-column prop="waistline" label="腰围"></el-table-column>
        <el-table-column prop="fat" label="脂肪"></el-table-column>
        <el-table-column prop="weightnbim" label="体重指数BIM" align="center" width="130"></el-table-column>
        <el-table-column prop="uimsatz" label="基础代谢" width="100" align="center"></el-table-column>
        <el-table-column prop="endurance" label="腹肌耐力"></el-table-column>
        <el-table-column prop="flexibility" label="柔韧度测试" align="center" width="130"></el-table-column>
        <el-table-column prop="pushup" label="俯卧撑测试" align="center" width="130"></el-table-column>
        <el-table-column prop="obpm" label="血压测量"></el-table-column>
        <el-table-column prop="hrrest" label="心率"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button  icon="el-icon-delete" type="danger"  size="small" @click="handleEdit(scope.row)" v-if="hasPermission('healthForm:healthForm:delete')">删除
            </el-button>
  
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页工具栏 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-main>
  </template>
  
  <script>
  import healthform from '@/api/healthform'
  export default {
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
      async search(pageNo,pageSize) {
        this.searchModel.pageNo = pageNo;
        this.searchModel.pageSize = pageSize;
        this.searchModel.empId = this.$store.getters.userId;
        let res = await healthform.listByEmpId(this.searchModel);
        if (res.success) {
          this.userList = res.data.records
          this.total = res.data.total
          console.log(res.data);
  
        }
      },
      //重置
      resetValue(){
        this.searchModel.memberName="",
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
     async handleEdit(row){
      console.log(row.healthformId  )
      let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
              if (confirm) {
                  //发送删除请求
                  let res=await healthform.delete({id:row.healthformId});
                  //判断是否发送成功
                  if (res.success) {
                      //提示成功
                      this.$message.success(res.message)
                      //刷新数据
                      this.search(this.pageNo,this.pageSize);
                  } else {
                      //提示失败
                      this.$message.error(res.message)
                  }
  
              }
       
      }
    }
  }
  </script>
  
  <style>
  
  </style>