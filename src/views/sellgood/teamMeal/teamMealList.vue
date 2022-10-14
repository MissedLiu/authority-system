<template>
  <el-main>
    <!-- 条件查询区 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.teamName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddwindow" v-if="hasPermission('sellgood:teamMeal:add')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="teamId"
      default-expand-all>
      <!-- <el-table-column prop="teamId" label="编号" /> -->
      <el-table-column prop="teamName" label="套餐名称" />
      <el-table-column prop="teamPrice" label="价格" />
      <el-table-column prop="teamTime" label="套餐时长" />
      <el-table-column prop="teamDate" label="生效时间" />
      <el-table-column prop="teamIs" label="状态" />
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('sellgood:teamMeal:edit')">编辑
          </el-button>
          <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('sellgood:teamMeal:delete')">删除
          </el-button>
          <el-button icon="el-icon-plus" type="success" size="small" @click="assigntp(scope.row)" v-if="hasPermission('sellgood:teamMeal:xuanze')">选择项目
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
    <system-dialog :title="teamDialog.title" :visible="teamDialog.visible" :width="teamDialog.width"
      :height="teamDialog.height" @onClose="onClose" @onConfirm="onConfirm">
      <div slot="content">
        <el-form :model="teamMeal" ref="teamForm" :rules="rules" label-width="80px" :inline="true" size="small">
          <el-form-item label="套餐名称" prop="teamName">
            <el-input v-model="teamMeal.teamName"></el-input>
          </el-form-item>
          <el-form-item label="套餐时长" prop="teamTime">
            <el-select v-model="teamMeal.teamTime" placeholder="请选择时长">
              <el-option v-for="time in times" :label="time.name" :value="time.name" :key="time.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐价格" prop="teamPrice">
            <el-input v-model="teamMeal.teamPrice"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="teamIs">
            <el-radio-group v-model="teamMeal.teamIs">
                <el-radio-button label="启用" />
                <el-radio-button label="禁用" />
              </el-radio-group>
           
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
     <!-- 分配私教项目窗口 -->
     <system-dialog :title="assigntpDialog.title" :height="assigntpDialog.height" :width="assigntpDialog.width"
      :visible="assigntpDialog.visible" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
      <div slot="content">
        <!-- 分配私教项目数据列表 -->
        <el-table ref="assigntpTable" :data="assigntpList" border stripe :height="assignHeight"
          style="width: 100%; margin-bottom: 10px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="tpId" label="项目编号" />
          <el-table-column prop="tpName" label="项目名称" />
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination @size-change="assignSizeChange" @current-change="assignCurrentChange"
          :current-page.sync="tpVo.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="tpVo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="tpVo.total" background>
        </el-pagination>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入team.js脚本文件
import teamApi from "@/api/team";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "team",
  //注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        teamName: "", //套餐名字
        pageNo: 1,//当前页码
      
        pageSize: 10,//每页显示数量
      },
      pageNo: 1,//当前页码
      total: 0,//数据总数量
      pageSize: 10,//每页显示数量
      sta: [],
      tableData: [], //表格数据
      teamDialog: {
        title: "团操套餐信息", //窗口标题
        visible: false, //是否显示窗口
        width: 570, //窗口宽度
        height: 170, //窗口高度
      },
      teamMeal: {
        teamId: "", //套餐编号
        teamTime: "", //套餐时长(月卡,周卡)
        teamPrice: "", //套餐价格'
        teamIs: "", //是否禁用(0-禁用,1-使用)
        teamName: "", //套餐名称
      },
      rules: {
        teamName: [{ required: true, trigger: 'blur', message: '请输入套餐名' }],
        teamTime: [{ required: true, trigger: 'blur', message: '请输入时长' }],
        teamPrice: [{
          required: true,
          message: '请输入数字',
          pattern: /[1-9]\d*/,
          trigger: 'blur'
        }],
        teamIs: [{ required: true, trigger: 'change', message: '请选择状态' }]
      },
      //分配权限窗口属性
      assigntpDialog: {
                title: '',
                visible: false,
                height: 450,
                width: 600
            },
             //角色对象
             tpVo: {
                pageNo: 1,
                pageSize: 10,
                teamId: "",
                total: 0,
            },
            assigntpList: [], //角色列表
            assignHeight: 500, //分配角色表格高度
            selectedIds: [], //被选中的团操项目id
            selectedteamId: "", //被分配团操套餐ID
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
      this.searchModel.teamName = "";
      //调用查询方法
      this.search();
    },
    /**
     * 查询列表
     */
    async search(pageNo,pageSize) {
       //修改当前页码
       this.searchModel.pageNo=pageNo
        //修改每页显示条数
        this.searchModel.pageSize=pageSize
      //发送查询请求
      let res = await teamApi.getTeamlist(this.searchModel);
      //判断是否成功
      if (res.success) {
        console.log(res.data);
        console.log(res.data);
        this.tableData = res.data.records;
        this.total=res.data.total
        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].teamIs = res.data.records[i].teamIs == 0 ? "启用" : "禁用";
        }
      }
    },
     /**
        * 当每页数量发生变化时触发该事件
        */
        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize=size
            //调用查询方法
            this.search(this.pageNo,size)
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange(page) {
            //修改当前页码
            this.pageNo=page
            //调用查询方法
            this.search(page,this.pageSize)
        },
    //打开添加窗口
    openAddwindow() {
      //
      this.$restForm("teamForm", this.teamMeal);
      //设置属性
      (this.teamDialog.title = "新增套餐"), (this.teamDialog.visible = true);
    },
    //窗口关闭事件
    onClose() {
      this.teamDialog.visible = false;
    },
    //窗口确认事件
    onConfirm() {
      //进行表单验证
      this.$refs.teamForm.validate(async (valid) => {

        //如果验证通过
        if (valid) {
          let res = null;
        this.teamMeal.teamIs =   this.teamMeal.teamIs =="启用" ? 0 : 1;
          //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
          if (this.teamMeal.teamId === "") {
            console.log("ssss", this.teamMeal.teamId)
            //发送添加请求
            res = await teamApi.addteam(this.teamMeal);
          } else {
            //发送修改请求
            res = await teamApi.updateTeam(this.teamMeal);
          }

          //判断是否成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message);
            //刷新数据
            this.search(this.pageNo,this.pageSize);
            //关闭窗口事件
            this.teamDialog.visible = false;
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
      this.$objCopy(row, this.teamMeal);
      //设置窗口标题
      this.teamDialog.title = "编辑套餐";
      //显示窗口
      this.teamDialog.visible = true;
    },
    //删除操作
    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {
        //发送删除请求
        let res = await teamApi.deleteById({ teamId: row.teamId });
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

     /**
        * 分配角色取消事件
        */
        onAssignClose() {
            //隐藏窗口
            this.assigntpDialog.visible = false;
        },
        
       
        /**
         * 当每页数量发生变化时触发该事件
         * @param  size 
         */
        assignSizeChange(size) {
            this.tpVo.pageSize = size; //将每页显示的数量交给成员变量
            this.getAssigntpList(this.tpVo.pageNo, size);

        },
        /**
         *  当页码发生变化时触发该事件
         * @param page 
         */
        assignCurrentChange(page) {
            this.tpVo.pageNo = page;
            //调用查询方法
            this.getAssigntpList(page, this.tpVo.pageSize);

        },
        
        //分配角色
      async  assigntp(row) {
             console.log("row=", row)
            //防止回显出现问题
            this.selectedIds = [];
            //被分配用户的id
            this.selectedteamId = row.teamId;
              this.tpVo.teamId =row.teamId;           
                //显示窗口
                this.assigntpDialog.visible = true;
                //设置标题
                this.assigntpDialog.title = `给【${row.teamName}】分配角色`;
                //调用查询角色列表
                // await this.getAssignRoleList();
                await this.getAssigntpList();
                //封装查询条件
                let params = { teamId: row.teamId }
                //发送根据团操套餐ID查询套餐项目列表的请求
                let res = await teamApi.gettpIdByTeamId(params);
                console.log("角色列表=", res.data);
                // /如果存在相关的角色数据
                if (res.success) {
                    //将查询道德角色Id列表赋值给选中的角色数组
                    this.selectedIds = res.data;
                    console.log("12=",this.selectedIds)
                    //循环遍历
                    //查询数据库中已存在的团操套餐id
                    this.selectedIds.forEach((key) => {
                        //查询表格显示的角色id
                        this.assigntpList.forEach((item) => {
                          console.log("13",item)
                            if (key === item.tpId) {
                                //如果相等则复选框选中
                                this.$refs.assigntpTable.toggleRowSelection(item, true)
                            }
                        })
                    })
                }
            },
        
         /**
         * 查询当前用户所拥有的角色信息
         * @param {*} pageNo 
         * @param {*} pageSize 
         */
         async getAssigntpList(pageNo = 1, pageSize = 10) {
            //封装查询条件
            // this.ptVo.PtId = this.$store.getters.userId;
            this.tpVo.pageNo = pageNo;
            this.tpVo.pageSize = pageSize;
            //发送查询请求
            let res = await teamApi.getAssigntpList(this.tpVo);
            if (res.success) {
                //赋值
                this.assigntpList = res.data.records;
                this.tpVo.total = res.data.total;
                console.log("11=");
            }
        },
            /**
            * 分配项目确认事件
            */
           async  onAssignConfirm() {
                //判断当前是否有选中项目
                if(this.selectedIds.length=== 0){
                    this.$message.warning("请选择要分配的团操项目!")
                    return
                }

                let params={
                    teamId:this.selectedteamId,
                    tpId:this.selectedIds
                }
                console.log(params)
               // 发送保存分配项目数据的请求
                let res=await teamApi.assigntpProjectSave(params)
                //判断是否成功
                if(res.success){
                    this.$message.success(res.message);
                     //隐藏窗口
                this.assigntpDialog.visible = false;
                }else{
                     this.$message.error(res.message);
                }
               
            },
            /**
             * 复选框选中事件
             * @param  rows 
             */
            handleSelectionChange(rows){
               //拿到选中的ID 值
               this.selectedIds=rows.map(item=>item.tpId);     
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
