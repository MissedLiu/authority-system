<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入姓名" v-model="phone.memberName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all
      :tree-props="{ children: 'children' }">
      <el-table-column prop="memberName" label="会员姓名" align="center" ></el-table-column>
      <el-table-column prop="memberSex" label="会员性别" :formatter="playbackFormat" align="center" width="80"></el-table-column>
      <el-table-column prop="memberPhone" label="会员电话" width="110" align="center" ></el-table-column>
      <el-table-column prop="memberDate" label="出生日期" align="center" width="100"></el-table-column>
      <el-table-column prop="memberAge" label="年龄" align="center" width="60"></el-table-column>
      <el-table-column prop="memberAddress" label="地址" align="center"></el-table-column>
      <el-table-column prop="memberType" label="状态" :formatter="playbackFormat2" align="center"></el-table-column>
      <el-table-column prop="createTime" label="拉黑时间" align="center"></el-table-column>
      <el-table-column prop="why" label="拉黑原因" width="300" align="center"></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-close" plain type="danger" size="small" @click="openTF(scope.row)">
            退费
          </el-button>
          <el-button icon="el-icon-minus" plain type="warning" size="small" @click="del(scope.row)"
            v-if="hasPermission('members:blacklist:delete')">
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

    <!-- 退费套餐框 -->
    <system-dialog :title="TFDialog.title" :visible="TFDialog.visible" :width="TFDialog.width" :height="TFDialog.height"
      @onClose="TFClose()" @onConfirm="TFConfirm()">
      <div slot="content">
        <el-form ref="TFForm" label-width="80px" :inline="true" size="small">
          <el-form-item>
            <el-input placeholder="请人工协商退费金额" v-model="returnPremium.disbursePrice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="备注" v-model="returnPremium.beizhu"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button plain type="warning" @click="tuiFei">退费</el-button>
          </el-form-item>
        </el-form>
        <el-table border :data="mealSJ">
          <el-table-column label="套餐名称" align="center" prop="mealName">
          </el-table-column>
          <el-table-column label="套餐类型" align="center" prop="mealType">
          </el-table-column>
          <el-table-column label="套餐价格" align="center" prop="mealPrice">
          </el-table-column>
          <el-table-column label="办理时间" align="center" prop="mmTime">
          </el-table-column>
          <el-table-column label="到期时间" align="center" prop="mmDate">
          </el-table-column>
          <el-table-column label="到期状态" align="center" :formatter="time">
          </el-table-column>
        </el-table>
      </div>
    </system-dialog>
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
      tableData: [],//黑名单信息列表
      mealSJ: [],//退费套餐信息
      //查询参数
      phone: {
        memberPhone: "", //电话号码
        memberName: "", //姓名
        pageNo: 1, //当前页码
        pageSize: 10, //每页显示数量
      },
      //退费查询套餐参数
      returnPremium: {
        memberId: "",
        disbursePrice: "",
        beizhu: "",
      },
      //显示套餐窗口框属性
      TFDialog: {
        title: "",//窗口标题
        visible: false,//是否显示窗口
        width: 900,//窗口宽度
        height: 500//窗口高度
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
        let res = await BlackApi.outUpdMemberState(row);
        //判断是否发送成功
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          //刷新数据
          this.search(this.pageNo, this.pageSize)
        } else {
          //提示失败
          this.$message.error(res.message);
        }
      }
    },
    //打开退费框
    async openTF(row) {
      this.TFDialog.title = "退费"
      //清空数据
      this.returnPremium.disbursePrice = "" 
      this.returnPremium.beizhu = ""
      let res = await BlackApi.findBlackMemberMeal({ memberId: row.memberId })
      if (res.success) {
        this.returnPremium.memberId = row.memberId
        this.mealSJ = res.data
      }
      this.TFDialog.visible = true
    },
    //退费功能
    async tuiFei() {
      if (this.returnPremium.disbursePrice == "" || this.returnPremium.beizhu == "") {
        this.$myconfirm("请填全退费信息?")
      } else {
        let res = await BlackApi.delMemberAllMeal(this.returnPremium)
        if (res.success) {
          //提示成功
          this.$message.success(res.message);
          this.TFDialog.visible = false
        } else {
          //提示失败
          this.$message.error(res.message);
        }
      }
    },
    // 退费框确定
    TFConfirm() {
      this.TFDialog.visible = false
    },
    //退费框取消
    TFClose() {
      this.TFDialog.visible = false
    },


    //转换显示
    playbackFormat(row, column) {
      if (row.memberSex == 0) {
        return '女'
      } else if (row.memberSex == 1) {
        return '男'
      }
    },
    playbackFormat2(row, column) {
      if (row.memberType == 0) {
        return '体验会员'
      } else if (row.memberType == 1) {
        return '正式会员'
      }
    },
    //判断到期状态
    time(row, column) {
      let date = new Date();  // Mon Oct 11 2021 08:39:50 GMT+0800 (中国标准时间)
      let afterDate = this.formateDate(date);  // 2021-10-11 
      if (row.mmDate >= afterDate) {
        return '未过期'
      } else if (row.mmDate <= afterDate) {
        return '已过期'
      }
    },
    // 格式化日期
    formateDate(date) {
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');  // 月要+1
      let day = date.getDate().toString().padStart(2, '0');  // 获取天是getDate，而不是 getDay
      let createTime = year + '-' + month + '-' + day;
      return createTime;
    },
    //分页改变每页条数
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
      this.phone.memberName = "";
      //调用查询方法
      this.search()
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
