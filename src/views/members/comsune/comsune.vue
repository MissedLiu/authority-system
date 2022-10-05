<template>
    <el-main>
      <!-- 查询条件 -->
      <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
        <el-form-item>
          <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all
        :tree-props="{ children: 'children' }">
        <el-table-column prop="comsuneId" label="消费记录编号"></el-table-column>
        <el-table-column prop="memberName" label="会员名称" :formatter="playbackFormat"></el-table-column>
        <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
        <el-table-column prop="mealName" label="套餐名称"></el-table-column>
        <el-table-column prop="mealType" label="套餐类型"></el-table-column>
        <el-table-column prop="ptpName" label="项目名称"></el-table-column>
        <el-table-column prop="comsunePrice" label="消费金额"></el-table-column>
        <el-table-column prop="comsuneDate" label="消费时间"></el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

     
    </el-main>
  </template>
    
    
  <script>
  import ComsuneApi from "@/api/comsune";
  //导入对话框组件
  import SystemDialog from "@/components/system/SystemDialog.vue";
  export default {
    name: "blackmember",
    //注册组件
    components: {
      SystemDialog,
    },
    data() {
      return {
        //分页组件所需的属性
        pageNo: 1, //当前页码
        total: 0, //数据总数量
        pageSize: 10, //每页显示数量
        //表格数据列表
        tableData: [],
        //电话查询参数
        phone: {
          memberPhone: "", //电话号码
          pageNo: 1, //当前页码
          pageSize: 10, //每页显示数量
        },
  
      };
    },
    created() {
      this.search();
    },
    methods: {
      //查询消费记录列表
      async search(pageNo, pageSize) {
        //修改当前页码
        this.phone.pageNo = pageNo;
        //修改每页显示条数
        this.phone.pageSize = pageSize;
        //发送查询请求
        let res = await ComsuneApi.selectComsuneList(this.phone);
        console.log(res);
        //判断是否存在数据
        if (res.success) {
          //获取数据
          this.tableData = res.data.records;
          //当前数据数量
          this.total = res.data.total;
        }
      },

      handleSizeChange(size) {
        //修改每页显示数量
        this.pageSize = size;
        //调用查询方法
        this.search(this.pageNo, size);
      },
  
      /**
       * 当页码发生变化时触发该事件
       */
      handleCurrentChange(page) {
        //修改当前页码
        this.pageNo = page;
        //调用查询方法
        this.search(page, this.pageSize);
      },
      /**
  * 重置查询条件
  */
      resetValue() {
        //清空数据
        this.phone.memberPhone = "";
        //调用查询方法
        this.search()
      },
    
    }

  };
  </script>
    
  <style lang="scss" scoped>
  
  </style>
    