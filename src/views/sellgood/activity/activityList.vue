<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.flyerName" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.flyerAddress" placeholder="请输入大概地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow" v-if="hasPermission('sellgood:activity:add')">新增</el-button>
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
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 40px" row-key="flyerId"
      default-expand-all>
      <!-- <el-table-column prop="flyerId" label="编号" /> -->
      <el-table-column prop="flyerName" label="活动名称" />
      <el-table-column prop="flyerAddress" label="地址" />
      <el-table-column prop="flyerNum" label="发放数量" />
      <el-table-column prop="flyerStaff" label="参与员工" />
      <el-table-column prop="num" label="收获潜在客户数量" />
      <el-table-column prop="createTime" label="活动时间" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('sellgood:activity:edit')">编辑
          </el-button>
          <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('sellgood:activity:delete')">删除
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
    <system-dialog :title="flyerDialog.title" :visible="flyerDialog.visible" :width="flyerDialog.width"
      :height="flyerDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="flyer" ref="flyerForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item label="负责人" prop="flyerName">
            <el-input v-model="flyer.flyerName"></el-input>
          </el-form-item>

          <el-form-item label="活动地址" prop="flyerAddress">
            <el-input v-model="flyer.flyerAddress"></el-input>
          </el-form-item>

          <el-form-item label="传单数量" prop="flyerNum">
            <el-input v-model="flyer.flyerNum"></el-input>
          </el-form-item>

          <el-form-item label="工作员" prop="flyerStaff">
            <el-input v-model="flyer.flyerStaff"></el-input>
          </el-form-item>

          <el-form-item label="客户数量" prop="num">
            <el-input v-model="flyer.num"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入flyer.js脚本文件
import flyerApi from "@/api/flyer";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "flyer",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {

    return {
      searchModel: {
        flyerAddress: "", //负责地址
        flyerName: "", //负责人名字
        pageNo: 1, //当前页码
        total: 0, //数据总数量
      },
      pageNo: 1, //当前页码
      total: 0, //数据总数量
      pageSize: 10, //每页显示数量
      sta: [],
      tableData: [], //表格数据
      flyerDialog: {
        title: "活动信息", //窗口标题
        visible: false, //是否显示窗口
        width: 600, //窗口宽度
        height: 300, //窗口高度
      },
      flyer: {
        flyerId: "", //活动编号
        flyerName: "", //负责人名字
        flyerAddress: "", //活动地址'
        flyerNum: "", //发放数量
        flyerStaff: "", //参与人员
        num: "", //潜在客户数量
        createTime: "", //活动时间
      },
      rules: {
        flyerName: [{ required: true, trigger: 'blur', message: '请输入负责人名字' }],
        flyerAddress: [{ required: true, trigger: 'blur', message: '请输入正确的地址',  pattern: /[\u4e00-\u9fa5]/, }],
        flyerNum: [{
          required: true,
          message: '请输入数字',
          pattern: /[1-9]\d*/,
          trigger: 'blur'
        }],
        flyerStaff: [{ required: true, trigger: 'blur', message: '员工姓名' }],
        num: [{ required: true, trigger: 'blur', message: '请输入客户数量' }]
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
      this.searchModel.flyerName = "";
      this.searchModel.flyerAddress = "";
      //调用查询方法
      this.search(this.pageNo, this.pageSize);
    },
    /**
     * 查询列表
     */
    async search(pageNo, pageSize) {
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      let res = await flyerApi.getFlyerlist(this.searchModel);
      //判断是否成功
      if (res.success) {
        console.log(res.data);
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
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
    //打开添加窗口
    openAddwindow() {
      //
      this.$restForm("flyerForm", this.flyer);
      //设置属性
      (this.flyerDialog.title = "新增活动"), (this.flyerDialog.visible = true);
    },
    //窗口关闭事件
    onClose() {
      this.flyerDialog.visible = false;
    },
    //窗口确认事件
    onConfirm() {
      //进行表单验证
      this.$refs.flyerForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          let res = null;

          //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
          if (this.flyer.flyerId === "") {
            console.log("qq=",this.flyer.flyerId)
            //发送添加请求
            res = await flyerApi.addFlyer(this.flyer);
          } else {
            //发送修改请求
            res = await flyerApi.updateFlyer(this.flyer);
          }

          //判断是否成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message);
            //刷新数据
            this.search();
            //关闭窗口事件
            this.flyerDialog.visible = false;
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
      this.$objCopy(row, this.flyer);
      console.log("=======================", this.flyer);
      //设置窗口标题
      this.flyerDialog.title = "编辑套餐";
      //显示窗口
      this.flyerDialog.visible = true;
    },
    //删除操作
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {
        //发送删除请求
        let res = await flyerApi.deleteById({ flyerId: row.flyerId });
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          //刷新数据
          this.search();
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
