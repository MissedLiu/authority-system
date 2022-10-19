<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-date-picker v-model="searchModel.changeTime" type="month" placeholder="请选择要查询的月份" value-format="yyyy-MM"
          @change="changeTimeb(pageNo, pageSize)" />
        <el-button type="success" plain @click="toFile" style="margin-left: 10px">归档</el-button>
        <el-button type="success" plain @click="handleDownload">导出当页数据到Excel表格</el-button>
        <el-button type="primary" plain @click="handleGetForms">查看报表</el-button>
        <el-button type="primary" plain @click="handleGetOnFile(pageNo, pageSize)">查看归档记录</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="eeId"
      default-expand-all>
      <el-table-column prop="disburseType" label="支出类型" />
      <el-table-column prop="disburseTime" label="支出时间" />
      <el-table-column prop="disbursePrice" label="支出金额" />
      <el-table-column prop="beizhu" label="备注" />
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-close" type="danger" size="small" plain @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具栏 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>


    <system-dialog :title="DialogConfig.title" :visible="DialogConfig.visible" :width="DialogConfig.width"
      :height="DialogConfig.height" @onClose="onClose" @onConfirm="onClose">
      <div slot="content">
        <el-row>
          <el-col :span="12">
            今年每月支出情况
            <BarChart v-if="flag" :TbData="this.TbData"></BarChart>
          </el-col>
          <el-col :span="12">
            历年支出情况
            <BarChartA v-if="flag" :TbDataA="this.TbDataA"></BarChartA>
          </el-col>
        </el-row>
      </div>
    </system-dialog>

    <system-dialog :title="DialogConfig3.title" :visible="DialogConfig3.visible" :width="DialogConfig3.width"
      :height="DialogConfig3.height" @onClose="onClose" @onConfirm="onClose">
      <div slot="content">
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
          <el-form-item>
            <el-date-picker v-model="searchModel.changeTime" type="year" placeholder="请选择要查询的年份"
              @change="handleGetOnFile(pageNo, pageSize)" value-format="yyyy" />
          </el-form-item>

        </el-form>

        <el-table :data="OnFileDate" border stripe style="width: 100%; margin-bottom: 10px">
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="money" label="金额"></el-table-column>
          <el-table-column prop="date" label="时间"></el-table-column>
        </el-table>

        <!-- 分页工具栏 -->
        <el-pagination @size-change="SizeChange" @current-change="CurrentChange" :current-pag="tablePage.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total">
        </el-pagination>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入department.js脚本文件
import disburseApi from "@/api/disburseApi";
import onFileApi from "@/api/onFileApi";
import BarChart from "./BarChart.vue";
import BarChartA from "./BarChartA.vue";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "disburse",
  //注册组件
  components: {
    SystemDialog,
    BarChart,
    BarChartA,
  },
  data() {
    return {
      TbData: {},
      TbDataA: {},
      flag: false,

      downloadLoading: false,
      filename: "支出报表",
      autoWidth: true,
      bookType: "xlsx",

      searchModel: {
        onFileType: "",
        changeTime: "",
        type: "",
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [], //表格数据
      OnFileDate: [],
      tablePage: {
        pageNo: 1,
        pageSize: 10,
        totle: ""
      },
      pageNo: 1, //当前页码
      total: 0, //数据总数量
      pageSize: 10, //每页显示数量
      DialogConfig: {
        title: "", //窗口标题
        visible: false, //是否显示窗口
        width: 1500, //窗口宽度
        height: 600, //窗口高度
      },

      DialogConfig3: {
        title: "", //窗口标题
        visible: false, //是否显示窗口
        width: 1500, //窗口宽度
        height: 600, //窗口高度
      },

      disburse: {
        disburseId: "", //编号
        disburseType: "", //支出类型
        disburseTime: "", //支出时间
        disbursePrice: "", //支出金额
        beizhu: "", //备注
        changeDisburseTime: "", //时间查询
      },
    };
  },
  //初始化时调用
  created() {
    this.search();
    this.findSum();
    this.findSumA();
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

    SizeChange(size) {
      //修改每页显示数量
      this.tablePage.pageSize = size;
      //调用查询方法
      this.handleGetOnFile(this.tablePage.pageNo, size);
    },

    CurrentChange(page) {
      //修改当前页码
      this.tablePage.pageNo = page;
      //调用查询方法
      this.handleGetOnFile(page, this.tablePage.pageSize);

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
        }
      });
    },

    async handleGetOnFile(pageNo, pageSize) {
      this.DialogConfig3.title = "归档记录";
      this.DialogConfig3.visible = true;
      //修改当前页码
      this.searchModel.pageNo = pageNo;
      //修改每页显示条数
      this.searchModel.pageSize = pageSize;
      this.searchModel.type = "支出"

      await onFileApi.getOnFile(this.searchModel).then(res => {
        if (res.success) {
          this.OnFileDate = res.data.records;
          this.tablePage.total = res.data.total;

        }
      })
    },

    async findSum() {
      await disburseApi.getCountPrice().then((res) => {
        console.log(res.data);
        this.TbData = res.data;
        this.flag = true;
      });
    },

    async findSumA() {
      await disburseApi.getCountPriceYear().then((res) => {
        console.log(res.data);
        this.TbDataA = res.data;
        this.flag = true;
      });
    },

    changeTimeb(pageNo, pageSize) {
      this.searchModel.pageNo = pageNo;
      //修改每页显示条数
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      disburseApi.getDisburseList(this.searchModel).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.total = res.data.total;
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

    async toFile() {
      let confirm = await this.$myconfirm("确定要将该月支出归档吗");
      if (confirm) {
        this.searchModel.onFileType = "支出";
        await onFileApi.toFile(this.searchModel).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },

    onClose() {
      this.DialogConfig.visible = false;
      this.DialogConfig3.visible = false;
      this.searchModel.changeTime = "";

    },
    handleGetForms() {
      this.DialogConfig.title = "报表";
      this.DialogConfig.visible = true;
    },



    async handleDownload() {
      let confirm = await this.$myconfirm("确定要导出吗?");
      if (confirm) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["支出类型", "支出时间", "支出金额", "备注"];
          const filterVal = [
            "disburseType",
            "disburseTime",
            "disbursePrice",
            "beizhu",
          ];
          const list = this.tableData;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType,
          });
          this.downloadLoading = false;
        });
        this.$message.success("导出成功");
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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

  .el-tree>.el-tree-node:before {
    border-left: none;
  }

  .el-tree>.el-tree-node:after {
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

  .el-tree-node__content>.el-tree-node__expand-icon {
    display: none;
  }

  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

::v-deep .el-tree>div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>