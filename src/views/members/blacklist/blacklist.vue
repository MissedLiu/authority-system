<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input
          placeholder="请输入电话"
          v-model="phone.memberPhone"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search(pageNo, pageSize)"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right" @click="resetValue()"
          >返回</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="memberName" label="会员姓名"></el-table-column>
      <el-table-column prop="memberSex" label="会员性别"></el-table-column>
      <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
      <el-table-column prop="memberDate" label="出生日期"></el-table-column>
      <el-table-column prop="memberAge" label="年龄"></el-table-column>
      <el-table-column prop="memberAddress" label="地址"></el-table-column>
      <el-table-column prop="memberType" label="状态"></el-table-column>
      <el-table-column prop="createTime" label="拉黑时间"></el-table-column>
      <el-table-column
        prop="why"
        label="拉黑原因"
        width="200"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-close"
            type="danger"
            size="small"
            @click="del(scope.row)"
          >
            移出黑名单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

            <!-- 分页组件 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
  </el-main>
</template>


<script>
import BlackApi from "@/api/black";
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
      //表格数据列表1
      tableData: [],
      //查询会员属性
      memberData: "",
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
    //查询黑名单列表
    async search(pageNo, pageSize) {
      //修改当前页码
      this.phone.pageNo = pageNo;
      //修改每页显示条数
      this.phone.pageSize = pageSize;
      //发送查询请求
      let res = await BlackApi.blackMemberList(this.phone);
      console.log(res);
      //判断是否存在数据
      if (res.success) {
        //获取数据
        this.tableData = res.data.records;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].memberSex =
            this.tableData[i].memberSex == 0 ? "女" : "男";
          this.tableData[i].memberType =
            this.tableData[i].memberType == 0 ? "体验会员" : "正式会员";
        }
        //当前数据数量
        this.total = res.data.total;
      }
    },

    //移出黑名单
    async del(row) {
      //提示是否确认删除
      let confirm = await this.$myconfirm("确定要移出黑名单吗?"); //await代表同步
      if (confirm) {
        //发送修改请求
        row.memberSex = row.memberSex == "男" ? 1 : 0;
        row.memberType = row.memberType == "体验会员" ? 0 : 1;
        let res = await BlackApi.outUpdMemberState(row);
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          //刷新数据
          this.resetValue()
        } else {
          //提示失败
          this.$message.error(res.message);
        }
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
  },
};
</script>

<style lang="scss" scoped></style>
