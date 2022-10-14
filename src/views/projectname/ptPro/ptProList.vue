<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.ptpName" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow"
          v-if="hasPermission('projectname:ptPro:add')">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="ptpId"
      default-expand-all>
      <!-- <el-table-column prop="ptpId" label="编号" /> -->
      <el-table-column prop="ptpName" label="项目名称名称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column prop="ptpIs" label="状态" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('projectname:ptPro:edit')">编辑
          </el-button>
          <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('projectname:ptPro:delete')">删除
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
    <system-dialog :title="ptpDialog.title" :visible="ptpDialog.visible" :width="ptpDialog.width"
      :height="ptpDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="ptProject" ref="ptProForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item label="项目名称" prop="ptpName">
            <el-input v-model="ptProject.ptpName"></el-input>
          </el-form-item>


          <el-form-item label="状态" prop="ptpIs">

            <el-radio-group v-model="ptProject.ptpIs">
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
//导入ptPro.js脚本文件
import ptProApi from "@/api/ptPro";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "ptPro",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        ptpName: "", //项目名字
        pageNo: 0,//当前页码
        pageSize: 10,//每页显示条数

      },
      pageNo: 1,//初始值当前页码
      pageSize: 10,//初始值当前条数
      total: 0,
      sta: [],
      tableData: [], //表格数据
      ptpDialog: {
        title: "团操项目信息", //窗口标题
        visible: false, //是否显示窗口
        width: 560, //窗口宽度
        height: 170, //窗口高度
      },
      ptProject: {
        ptpId: "", //套餐编号
        ptpName: "", //套餐名称
        createTime: "", //创建时间
        updatePrice: "", //修改时间
        ptpIs: "", //是否禁用(0-禁用,1-使用)
      },
      rules: {
        ptpName: [{ required: true, message: '请输入项目名称', trigger: 'blur', }],
        ptpIs: [{ required: true, message: '请选择该项目状态', trigger: 'change', }],
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
      this.searchModel.ptpName = "";
      //调用查询方法
      this.search();
    },
    /**
     * 查询部门列表
     */
    async search(pageNo, pageSize) {
      //发送查询请求
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      let res = await ptProApi.getptProlist(this.searchModel);
      //判断是否成功
      if (res.success) {
        this.total = res.data.total;
        this.tableData = res.data.records;
        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].ptpIs = res.data.records[i].ptpIs == 0 ? "启用" : "禁用";
        }
      }
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
    //打开添加窗口
    openAddwindow() {
      //
      this.$restForm("ptProForm", this.ptProject);
      //设置属性
      (this.ptpDialog.title = "新增套餐"), (this.ptpDialog.visible = true);
    },
    //窗口关闭事件
    onClose() {
      this.ptpDialog.visible = false;
    },
    //窗口确认事件
    onConfirm() {
      //进行表单验证
      this.$refs.ptProForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          let res = null;
          this.ptProject.ptpIs = this.ptProject.ptpIs == "启用" ? 0 : 1;
          console.log(this.ptProject.ptpIs)
          //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
          if (this.ptProject.ptpId === "") {
            //发送添加请求
            res = await ptProApi.addptPro(this.ptProject);
          } else {
            //发送修改请求

            res = await ptProApi.updateptPro(this.ptProject);
          }

          //判断是否成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message);
            //刷新数据
            this.search(this.pageNo, this.pageSize);
            //关闭窗口事件
            this.ptpDialog.visible = false;
          } else {
            //提示失败
            this.$message.error(res.message);
          }
        }
      });
    },
    //修改按钮实现
    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.ptProject);
      //设置窗口标题
      this.ptpDialog.title = "编辑套餐";
      //显示窗口
      this.ptpDialog.visible = true;
    },
    //删除操作
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {
        // if(!.eauqls()"qiyong"){

        // }else{
        //   alert("启用状态不可删除")
        // }


        //发送删除请求
        let res = await ptProApi.deleteById({ ptpId: row.ptpId });
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          //刷新数据
          this.search(this.pageNo, this.pageSize);
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
