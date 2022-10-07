<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.cmName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="cmId"
      default-expand-all>
      <el-table-column prop="cmId" label="编号" />
      <el-table-column prop="cmName" label="套餐名称" />
      <el-table-column prop="cmPrice" label="价格" />
      <el-table-column prop="cmTime" label="套餐时长" />
      <el-table-column prop="cmDate" label="生效时间" />
      <el-table-column prop="cmIs" label="状态" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加和修改窗口-->
    <system-dialog :title="commonDialog.title" :visible="commonDialog.visible" :width="commonDialog.width"
      :height="commonDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="commonMeal" ref="commonForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item label="套餐名称" prop="cmName">
            <el-input v-model="commonMeal.cmName"></el-input>
          </el-form-item>
          <el-form-item label="套餐时长" prop="cmTime">
            <el-input v-model="commonMeal.cmTime"></el-input>
          </el-form-item>
          <el-form-item label="套餐价格" prop="cmPrice">
            <el-input v-model="commonMeal.cmPrice"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="cmIs">
            <el-radio-group v-model="commonMeal.cmIs">
                <el-radio-button label="启用" />
                <el-radio-button label="禁用" />
              </el-radio-group>
            
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    
  </el-main>
</template>

<script>
//导入common.js脚本文件
import commonApi from "@/api/common";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "common",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        cmName: "", //套餐名字
        pageNo: 1,//初始值当前页码
        pageSize: 10,//初始值当前条数

      },
      pageNo: 1,//初始值当前页码
      pageSize: 10,//初始值当前条数
      total: 0,
      sta: [],
      tableData: [], //表格数据
      commonDialog: {
        title: "普通套餐信息", //窗口标题
        visible: false, //是否显示窗口
        width: 560, //窗口宽度
        height: 170, //窗口高度
      },
      commonMeal: {
        cmId: "", //套餐编号
        cmTime: "", //套餐时长(月卡,周卡)
        cmPrice: "", //套餐价格'
        cmIs: "", //是否禁用(0-禁用,1-使用)
        cmName: "", //套餐名称
      },
      rules: {
        cmName: [{ required: true,message: '请输入套餐名称',trigger: 'blur',}],
        cmIs: [{ required: true,message: '请选择状态',trigger: 'change',}],
        cmPrice: [{ required: true,message: '请输入套餐价格',trigger: 'blur',}],
        cmTime: [{ required: true,message: '请输入套餐时长',trigger: 'blur',}]
      },
    };
  },
  //初始化时调用
  created() {
    this.search();
  },
  methods: {
    /**
     * 重置查询条件
     */
    resetValue() {
      //清空数据
      this.searchModel.cmName = "";
      //调用查询方法
      this.search();
    },
    /**
     * 查询部门列表
     */
    async search(pageNo,pageSize) {
      this.searchModel.pageNo=pageNo;
      this,this.searchModel.pageSize=pageSize;
      //发送查询请求
      let res = await commonApi.getCommonMeallist(this.searchModel);
      //判断是否成功
      if (res.success) {
        console.log(res.data);
        console.log(res.data);
        this.tableData = res.data.records;
        this.total=res.data.total;

        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].cmIs = res.data.records[i].cmIs == 1 ? "启用" : "禁用";
        }
      }
    },

    //打开添加窗口
    openAddwindow() {
      //
      this.$restForm("commonForm", this.commonMeal);
      //设置属性
      (this.commonDialog.title = "新增套餐"),
        (this.commonDialog.visible = true);
    },
    //窗口关闭事件
    onClose() {
      this.commonDialog.visible = false;
    },
    //窗口确认事件
    onConfirm() {
      //进行表单验证
      this.$refs.commonForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          let res = null;
          this.commonMeal.cmIs= this.commonMeal.cmIs=="启用" ? 1:0
          console.log( this.commonMeal)
          //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
          if (this.commonMeal.cmId === "") {
            //发送添加请求
            res = await commonApi.addcommon(this.commonMeal);
          } else {
            //发送修改请求
            res = await commonApi.updatecommon(this.commonMeal);
          }

          //判断是否成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message);
            //刷新数据
            this.search(this.pageNo,this.pageSize);
            //关闭窗口事件
            this.commonDialog.visible = false;
          } else {
            //提示失败
            this.$message.error(res.message);
          }
        }
      });
    },
    //当分页每页显示条数改变时触发
    handleSizeChange(size) {
      this.pageSize = size;
      this.search(this.pageNo, size);
    },
    //当当前页码改变时
    handleCurrentChange(page) {
      this.pageNo = page;
      this.search(page, this.size)
    },
    //修改按钮实现
    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.commonMeal);
      //设置窗口标题
      this.commonDialog.title = "编辑套餐";
      //显示窗口
      this.commonDialog.visible = true;
    },
    //删除操作
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {
        //发送删除请求
        let res = await commonApi.deleteById({ cmId: row.cmId });
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          //刷新数据
          this.search(this.pageNo,this.pageSize);
        } else {
          //提示失败
          this.$message.error(res.message);
        }
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
