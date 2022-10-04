<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <div class="block">
          <el-date-picker
            v-model="searchModel.changeTime"
            type="month"
            placeholder="Pick a month"
            value-format="yyyy-MM"
            @change="changeTimeb(pageNo,pageSize)"
          />
        </div>
      </el-form-item>
    </el-form>
    <!-- 
            data属性:表格数据
            border属性:表格边框
            stripe属性:表格斑马线
            row-key属性:行数据的key,用来优化table的渲染
            default-expand-all属性:默认展开树形表格数据
            tree-props属性:树形表格配置属性选型
         -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-bottom: 20px"
      row-key="eeId"
      default-expand-all
    >
      <el-table-column prop="disburseType" label="支出类型" />
      <el-table-column prop="disburseTime" label="支出时间" />
      <el-table-column prop="disbursePrice" label="支出金额" />
      <el-table-column prop="beizhu" label="备注" />
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-close"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具栏 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-main>
</template>

<script>
//导入department.js脚本文件
import disburseApi from "@/api/disburseApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "disburse",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        changeTime: "",
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [], //表格数据

      pageNo: 1, //当前页码
      total: 0, //数据总数量
      pageSize: 10, //每页显示数量
      disburseDialog: {
        title: "", //窗口标题
        visible: false, //是否显示窗口
        width: 600, //窗口宽度
        height: 120, //窗口高度
      },

      disburse: {
        disburseId: "", //编号
        disburseType: "", //支出类型
        disburseTime: "", //支出时间
        disbursePrice: "", //支出金额
        beizhu: "", //备注
        changeDisburseTime:""//时间查询
      },
    };
  },
  //初始化时调用
  created() {
    this.search();
  },
  methods: {
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
     * 查询
     */
    async search(pageNo, pageSize) {
      //修改当前页码
      this.searchModel.pageNo = pageNo;
      //修改每页显示条数
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      disburseApi.getDisburseList(this.searchModel).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          console.log(this.changeDisburseTime);
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].methods == 0) {
              this.tableData[i].methods = "自修";
            } else if (this.tableData[i].methods == 1) {
              this.tableData[i].methods = "换件";
            } else if (this.tableData[i].methods == 2) {
              this.tableData[i].methods = "外修";
            }
          }
        }
      });
    },

    changeTimeb(pageNo,pageSize) {
    this.searchModel.pageNo = pageNo;
      //修改每页显示条数
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      disburseApi.getDisburseList(this.searchModel).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          console.log(this.changeDisburseTime);
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].methods == 0) {
              this.tableData[i].methods = "自修";
            } else if (this.tableData[i].methods == 1) {
              this.tableData[i].methods = "换件";
            } else if (this.tableData[i].methods == 2) {
              this.tableData[i].methods = "外修";
            }
          }
        }
      });
    },

    //删除按钮实现
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?");
      if (confirm) {
        await disburseApi
          .deleteDisburse({ disburseId: row.disburseId })
          .then((res) => {
            if (res.success) {
              //提示成功
              this.$message.success(res.message);
              //刷新数据
              this.search(this.pageNo, this.pageSize);
            } else {
              //提示失败
              this.$message.error(res.message);
            }
          });
      }
    },
  },
};
</script>
    
<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }

  .el-tree-node__children {
    padding-left: 20px;
  }

  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }

  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }

  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>