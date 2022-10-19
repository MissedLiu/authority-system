<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
        <el-button type="primary" plain icon="el-icon-search" @click="selectNullLocker(pageNo, pageSize)">查询空储物柜
        </el-button>
        <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow()"
          v-if="hasPermission('members:locker:add')">
          新增储物柜</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all
      :tree-props="{ children: 'children' }">
      <el-table-column prop="lockerId" label="储物柜编号" align="center"></el-table-column>
      <el-table-column prop="lockerState" label="储物柜状态" :formatter="playbackFormat" align="center"></el-table-column>
      <el-table-column prop="memberName" label="会员姓名" align="center"></el-table-column>
      <el-table-column prop="memberPhone" label="会员电话" align="center"></el-table-column>
      <el-table-column prop="createTime" label="办理时间" align="center"></el-table-column>
      <el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button type="success" plain icon="el-icon-plus" :disabled="item2(scope.$index, scope.row)" size="small"
            @click="updeteOpen(scope.row)" v-if="scope.row.lockerState==2">启用</el-button>
          <el-button type="danger" plain icon="el-icon-minus" :disabled="item(scope.$index, scope.row)" size="small"
            @click="updeteClose(scope.row)" v-if="scope.row.lockerState==1">禁用</el-button>
          <el-button icon="el-icon-close" type="warning" plain size="small" @click="del(scope.row)"
            v-if="hasPermission('members:locker:delete') && scope.row.lockerState!=0">删除储物柜</el-button>
          <el-button type="success" plain icon="el-icon-plus" :disabled="item(scope.$index, scope.row)" size="small"
            @click="openMemwindow(scope.row)"
            v-if="hasPermission('members:locker:addmember') && scope.row.lockerState==1">添加会员</el-button>
          <el-button type="danger" plain icon="el-icon-minus" :disabled="item(scope.$index, scope.row)" size="small"
            @click="deleteMember(scope.row)"
            v-if="hasPermission('members:locker:deletemember') && scope.row.lockerState==0">移除会员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 新增储物柜窗口 -->
    <system-dialog :title="addLockerDialog.title" :visible="addLockerDialog.visible" :width="addLockerDialog.width"
      :height="addLockerDialog.height" @onClose="Closelocker()" @onConfirm="Confirmlocker()">
      <div slot="content">
        <el-form :model="locker" ref="addLockerForm" :rules="rules" label-width="100px" size="small">
          <el-form-item label="储物柜编号" prop="lockerId">
            <el-input v-model="locker.lockerId"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 添加会员储物柜窗口 -->
    <system-dialog :title="memDialog.title" :visible="memDialog.visible" :width="memDialog.width"
      :height="memDialog.height" @onClose="CloseMemlocker()" @onConfirm="ConfirmlockerMember()">
      <div slot="content">
        <el-form :model="memberLocker" ref="memberLockeForm" :rules="rules" label-width="80px" size="small">
          <el-form-item label="会员姓名" prop="memberName">
            <el-input v-model="memberLocker.memberName"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="memberPhone">
            <el-input v-model="memberLocker.memberPhone"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
  </el-main>
</template>
  
  
<script>
import LockerApi from "@/api/locker"
//导入对话框组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "lockmember",
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
      //验证
      rules: {
        lockerId: [{ required: true, message: '请输入储物柜编号', trigger: 'blur' }, { pattern: new RegExp(/^[0-9]*$/), message: '储物柜编号为数字' }],
        memberName: [{ required: true, message: '请输入会员姓名', trigger: 'blur' }],
        memberPhone: [{ required: true, message: '请输入会员电话', trigger: 'blur' }, { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
      },
      //电话查询参数
      phone: {
        lockerState: null,//储物柜状态
        memberPhone: "", //电话号码
        pageNo: 1, //当前页码
        pageSize: 10, //每页显示数量
      },
      //新增储物柜属性
      addLockerDialog: {
        title: "新增储物柜",//窗口标题
        visible: false,//是否显示窗口
        width: 400,//窗口宽度
        height: 100,//窗口高度
      },
      //新增储物柜参数
      locker: {
        lockerId: "",
      },
      //新增储物柜会员属性
      memDialog: {
        title: "添加会员",//窗口标题
        visible: false,//是否显示窗口
        width: 400,//窗口宽度
        height: 200,//窗口高度

      },
      //添加会员储物柜参数
      memberLocker: {
        memberPhone: "",
        memberName: "",
        lockerId: ""
      },

    };
  },
  created() {
    this.search();
  },
  methods: {
    playbackFormat(row, column) {
      if (row.lockerState == 0) {
        return '已使用'
      } else if (row.lockerState == 1) {
        return '未使用'
      } else {
        return '不可用'
      }
    },
    //查询储物柜列表
    async search(pageNo, pageSize) {
      //修改当前页码
      this.phone.pageNo = pageNo;
      //修改每页显示条数
      this.phone.pageSize = pageSize;
      //发送查询请求
      let res = await LockerApi.getlockerList(this.phone);
      console.log(res);
      //判断是否存在数据
      if (res.success) {
        //获取数据
        this.tableData = res.data.records;
        //当前数据数量
        this.total = res.data.total;
      }
    },
    //按键使用
    item(index, row) {
      if (row.lockerState == 2) {
        return true;
      } else {
        return false;
      }
    },
    item2(index, row) {
      if (row.lockerState == 2) {
        return false;
      } else {
        return true;
      }
    },
    //查询空储物柜
    selectNullLocker(pageNo, pageSize) {
      this.phone.lockerState = "1";
      this.search(pageNo, pageSize)
    },
    //根据储物柜id删除
    async del(row) {
      //提示是否确认删除
      let confirm = await this.$myconfirm("确定要删除该储物柜嘛?")//await代表同步
      if (confirm) {
        //发送删除请求
        console.log("=========", row);
        let res = await LockerApi.deleteLocker({ lockerId: row.lockerId })
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message)
          //刷新数据
          this.search(this.pageNo, this.pageSize)
        } else {
          //提示失败
          this.$message.error(res.message)
        }
      }

    },
    //根据储物柜id修改(启用)
    async updeteOpen(row) {
      let res = await LockerApi.updateLocker(row)
      //判断是否发送成功
      if (res.success) {
        //提示成功
        this.$message.success(res.message)
        //刷新数据
        this.search(this.pageNo, this.pageSize)
      } else {
        //提示失败
        this.$message.error(res.message)
      }


    },
    //根据储物柜id修改(禁用)
    async updeteClose(row) {
      let res = await LockerApi.updateLocker(row)
      //判断是否发送成功
      if (res.success) {
        //提示成功
        this.$message.success(res.message)
        //刷新数据
        this.search(this.pageNo, this.pageSize)
      } else {
        //提示失败
        this.$message.error(res.message)
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
      this.phone.lockerState = null;
      //调用查询方法
      this.search()
    },
    //打开添加窗口
    openAddwindow() {
      //清空表单数据
      this.$restForm("addLockerForm", this.locker)
      //设置属性
      this.addLockerDialog.visible = true
    },
    //窗口取消事件
    Closelocker() {
      this.addLockerDialog.visible = false
    },
    //新增储物柜窗口确认事件
    Confirmlocker() {
      //进行表单验证
      this.$refs.addLockerForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          //发送请求
          let res = await LockerApi.addLocker(this.locker)
          //判断是否发送成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message)
            this.addLockerDialog.visible = false
            //刷新数据
            this.search(this.pageNo, this.pageSize)
            this.locker.lockerId = ""
          } else {
            //提示失败
            this.$message.error(res.message)
          }
        }
      })

    },


    //打开储物柜会员添加窗口
    openMemwindow(row) {
      this.memberLocker.memberName = ""
      this.memberLocker.memberPhone = ""
      this.memberLocker.lockerId = row.lockerId
      //设置属性
      this.memDialog.visible = true
    },
    //窗口取消事件
    CloseMemlocker() {
      this.memDialog.visible = false
    },

    //新增会员储物柜窗口确认事件
    async ConfirmlockerMember() {
      //进行表单验证
      this.$refs.memberLockeForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          //发送请求
          let res = await LockerApi.addLockerByMemberId(this.memberLocker)
          //判断是否发送成功
          if (res.success) {
            //提示成功
            this.$message.success(res.message)
            this.memDialog.visible = false
            //刷新数据
            this.search(this.pageNo, this.pageSize)

          } else {
            //提示失败
            this.$message.error(res.message)

          }
        }
      })

    },
    //移出会员
    async deleteMember(row) {
      let confirm = await this.$myconfirm("确定要移出该会员嘛?")//await代表同步
      if (confirm) {
        //发送请求
        let res = await LockerApi.deleteLockerByMemberId({ memberId: row.memberId, lockerId: row.lockerId });
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message)
          //刷新数据
          this.search(this.pageNo, this.pageSize)

        } else {
          //提示失败
          this.$message.error(res.message)
        }
      }
    }
  },
};
</script>
  
<style lang="scss" scoped>

</style>
  