<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.ptName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow" v-if="hasPermission('sellgood:ptMeal:add')" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="ptId"
      default-expand-all>
      <!-- <el-table-column prop="ptId" label="编号" /> -->
      <el-table-column prop="ptName" label="套餐名称" />
      <el-table-column prop="ptPrice" label="价格" />
      <el-table-column prop="ptTime" label="套餐时长" />
      <el-table-column prop="ptDate" label="生效时间" />
      <el-table-column prop="ptIs" label="状态" />
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('sellgood:ptMeal:edit')">编辑
          </el-button>
          <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('sellgood:ptMeal:delete')">删除
          </el-button>
          <el-button icon="el-icon-plus" type="success" size="small" @click="assignPt(scope.row)" v-if="hasPermission('sellgood:ptMeal:xuanze')">选择项目
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
    <system-dialog :title="ptDialog.title" :visible="ptDialog.visible" :width="ptDialog.width" :height="ptDialog.height"
      @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="ptMeal" ref="ptForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item label="套餐名称" prop="ptName">
            <el-input v-model="ptMeal.ptName"></el-input>
          </el-form-item>
          <el-form-item label="套餐时长" prop="ptTime">
            <el-select v-model="ptMeal.ptTime" placeholder="请选择时长">
            <el-option v-for="time in times" :label="time.name" :value="time.name" :key="time.name"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="套餐价格" prop="ptPrice">
            <el-input v-model="ptMeal.ptPrice"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="ptIs">
            <el-radio-group v-model="ptMeal.ptIs">
              <el-radio-button label="启用" />
              <el-radio-button label="禁用" />
            </el-radio-group>

          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 分配私教项目窗口 -->
    <system-dialog :title="assignPtDialog.title" :height="assignPtDialog.height" :width="assignPtDialog.width"
      :visible="assignPtDialog.visible" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
      <div slot="content">
        <!-- 分配私教项目数据列表 -->
        <el-table ref="assignPtTable"  :row-key="getRowKeys" :data="assignPtList" border stripe :height="assignHeight"
          style="width: 100%; margin-bottom: 10px"   @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"  
              :reserve-selection="true"></el-table-column>
          <el-table-column prop="ptpId" label="项目编号" />
          <el-table-column prop="ptpName" label="项目名称" />
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination @size-change="assignSizeChange" @current-change="assignCurrentChange"
          :current-page.sync="PtVo.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="PtVo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="PtVo.total" background>
        </el-pagination>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入pt.js脚本文件
import ptApi from "@/api/pt";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "pt",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        pageNo: 1,
        pageSize: 10,
        ptName: "", //套餐名字
      },
      sta: [],
      tableData: [], //表格数据
      ptDialog: {
        title: "普通套餐信息", //窗口标题
        visible: false, //是否显示窗口
        width: 570, //窗口宽度
        height: 170, //窗口高度
      },
      ptMeal: {
        ptId: "", //套餐编号
        ptTime: "", //套餐时长(月卡,周卡)
        ptPrice: "", //套餐价格'
        ptIs: "", //是否禁用(0-禁用,1-使用)
        ptName: "", //套餐名称

      },

      pageNo: 1,
      pageSize: 10,
      total: 0,
      rules: {
        ptName: [{ required: true, trigger: 'blur', message: '请输入套餐名' }],
        ptTime: [{ required: true, trigger: 'blur', message: '请输入时长' }],
        ptPrice: [{
          required: true,
          message: '请输入数字',
          pattern: /[1-9]\d*/,
          trigger: 'blur'
        }],
        ptIs: [{ required: true, trigger: 'change', message: '请选择状态' }]
      },
      //分配权限窗口属性
      assignPtDialog: {
        title: '',
        visible: false,
        height: 450,
        width: 600
      },
      //角色对象
      PtVo: {
        pageNo: 1,
        pageSize: 10,
        PtId: "",
        total: 0,
      },
      assignPtList: [], //角色列表
      assignHeight: 500, //分配角色表格高度
      selectedIds: [], //被选中的角色id
      selectedPtId: "", //被分配角色的用户ID
      ptid:"",
      //添加套餐时长
      times: [
        {
          name: "一天"
        },
        {
          name: "两天"
        },
        {
          name: "三天"
        },
        {
          name: "四天"
        },
        {
          name: "五天"
        },
        {
          name: "六天"
        },
        {
          name: "一周"
        },
        {
          name: "两周"
        },
        {
          name: "三周"
        },
        {
          name: "一个月"
        },
        {
          name: "两个月"
        },
        {
          name: "三个月"
        },
        {
          name: "四个月"
        },
        {
          name: "五个月"
        },
        {
          name: "六个月"
        },
        {
          name: "七个月"
        },
        {
          name: "八个月"
        },
        {
          name: "九个月"
        },
        {
          name: "十个月"
        },
        {
          name: "十一个月"
        },
        {
          name: "一年"
        },
      ]
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
      this.searchModel.ptName = "";
      //调用查询方法
      this.search(this.pageNo, this.pageSize);
    },
    /**
     * 查询部门列表
     */
    async search(pageNo, pageSize) {
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      //发送查询请求
      let res = await ptApi.getptMeallist(this.searchModel);
      // let resCoach=await.ptApi.getCoachList(this.searchModel);
      //判断是否成功
      if (res.success) {
        console.log(res.data);
        console.log(res.data);
        this.tableData = res.data.records
        this.total = res.data.total;
        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].ptIs = res.data.records[i].ptIs == 0 ? "启用" : "禁用";
        }
      }
    },

    //打开添加窗口
    openAddwindow() {
      //
      this.$restForm("ptForm", this.ptMeal);
      //设置属性
      (this.ptDialog.title = "新增套餐"), (this.ptDialog.visible = true);
    },
    //窗口关闭事件
    onClose() {
      this.ptDialog.visible = false;
    },
    //窗口确认事件
    onConfirm() {
      //进行表单验证
      this.$refs.ptForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          let res = null;
          this.ptMeal.ptIs = this.ptMeal.ptIs == "启用" ? 0 : 1;
          //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
          if (this.ptMeal.ptId === "") {
            //发送添加请求
            res = await ptApi.addpt(this.ptMeal);
          } else {
            //发送修改请求
            res = await ptApi.updatept(this.ptMeal);
          }

          //判断是否成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message);
            //刷新数据
            this.search(this.pageNo, this.pageSize);
            //关闭窗口事件
            this.ptDialog.visible = false;
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
      this.$objCopy(row, this.ptMeal);
      //设置窗口标题
      this.ptDialog.title = "编辑套餐";
      //显示窗口
      this.ptDialog.visible = true;
    },
    //删除操作
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {
        //发送删除请求
        let res = await ptApi.deleteById({ ptId: row.ptId });
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
      this.search(this.pageNo, this.pageSize);
    },
    //改变当前显示条数
    handleSizeChange(size) {
      this.pageSize = size;
      this.search(this.pageNo, size);
    },
    //改变当前页码
    handleCurrentChange(page) {
      this.pageNo = page;
      this.search(page, this.pageSize);
    },
    /**
       * 分配角色取消事件
       */
    onAssignClose() {
      //隐藏窗口
      this.assignPtDialog.visible = false;
    },


    /**
     * 当每页数量发生变化时触发该事件
     * @param  size 
     */
    assignSizeChange(size) {
      this.PtVo.pageSize = size; //将每页显示的数量交给成员变量
      this.getAssignPtList(this.PtVo.pageNo, size);

    },
    /**
     *  当页码发生变化时触发该事件
     * @param page 
     */
    assignCurrentChange(page) {
      this.PtVo.pageNo = page;
      //调用查询方法
      this.getAssignPtList(page, this.PtVo.pageSize);

    },

    //分配角色
    async assignPt(row) {
      //防止回显出现问题
      this.selectedIds = [];
      this.selectedPtId="", //被分配角色的用户ID
      this.ptId=row.ptId
      //被分配用户的id
      this.selectedPtId = row.ptId;
      this.PtVo.PtId = row.ptId;
      //显示窗口
      this.assignPtDialog.visible = true;
      //设置标题
      this.assignPtDialog.title = `给【${row.ptName}】分配角色`;
      //调用查询角色列表
      // await this.getAssignRoleList();
      await this.getAssignPtList();
     
    },
    getRowKeys(row){
      return row.ptpId;
    },
     /**
       * @selectable 设置不可点击的状态
       * @param row.pay_status === 0 是未支付的状态，这样的状态是可以选择的。未支付的是可以被选中的，已支付的是不可以被选中的
       */
      //  selectable(row,index){
      //   console.log("row=",row)
      //   if(row.ptpId === 0){
      //      return true;
      //   }else{
      //      return false;
      //   }},
    /**
    * 查询当前用户所拥有的所有角色信息
    * @param {*} pageNo 
    * @param {*} pageSize 
    */
    async getAssignPtList(pageNo = 1, pageSize = 10) {
      //封装查询条件
      // this.ptVo.PtId = this.$store.getters.userId;
      this.PtVo.pageNo = pageNo;
      this.PtVo.pageSize = pageSize;
      //发送查询请求
      let ress = await ptApi.getAssignPtList(this.PtVo);
      if (ress.success) {
        //赋值
        this.assignPtList = ress.data.records;
        this.PtVo.total = ress.data.total;
        console.log("=", ress.data.records);
         //封装查询条件
      let params = { PtId: this.ptId }
      //发送根据私教套餐ID查询套餐项目列表的请求
      let res = await ptApi.getPtpIdByPtId(params);
      console.log("角色列表=", res.data);
      // /如果存在相关的角色数据
      if (res.success) {
        //将查询道德角色Id列表赋值给选中的角色数组
        this.selectedIds = res.data;
        //循环遍历
        //查询数据库中已存在的角色id
        this.selectedIds.forEach((key) => {
          //查询表格显示的角色id
          this.assignPtList.forEach((item) => {
            
            if (key === item.ptpId) {
              //如果相等则复选框选中
              this.$refs.assignPtTable.toggleRowSelection(item, true)
            }
          })
        })
      }
      }
    },
    /**
    * 分配项目确认事件
    */
    async onAssignConfirm() {
      //判断当前是否有选中项目
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择要分配的私教项目!")
        return
      }

      let params = {
        ptId: this.selectedPtId,
        ptpId: this.selectedIds
      }
      console.log(params)
      //发送保存分配项目数据的请求
      let res = await ptApi.assignPtProjectSave(params)
      //判断是否成功
      if (res.success) {
        this.$message.success(res.message);
        //隐藏窗口
        this.assignPtDialog.visible = false;
      } else {
        this.$message.error(res.message);
      }

    },
    /**
     * 复选框选中事件
     * @param  rows 
     */
    handleSelectionChange(rows) {
      //拿到选中的ID 值
      this.selectedIds = rows.map(item => item.ptpId);
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
