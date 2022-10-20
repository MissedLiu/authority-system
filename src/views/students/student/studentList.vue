<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.memberName" placeholder="请输入私教会员姓名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel2.memberName" placeholder="请输入团操会员姓名" />
      </el-form-item>
      <el-form-item>

        <el-button type="success" icon="el-icon-plus" plain @click="pt()">私教</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
        <el-button type="success" icon="el-icon-plus" plain @click="tm()">团操</el-button>

      </el-form-item>
    </el-form>
    <div v-show="falg1">
      <!-- 数据表格 -->
      <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
        default-expand-all>
        <el-table-column prop="memberName" label="会员姓名"></el-table-column>
        <el-table-column prop="memberSex" label="会员性别"></el-table-column>
        <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
        <el-table-column prop="memberType" label="状态"></el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="ptxiangqing(scope.row)">
              详情
            </el-button>
            <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="selectPtMeal(scope.row)">
              添加体检单
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <div v-show="falg2">
      <!-- 数据表格 -->
      <el-table :data="tableData2" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
        default-expand-all>
        <el-table-column prop="memberName" label="会员姓名"></el-table-column>
        <el-table-column prop="memberSex" label="会员性别"></el-table-column>
        <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
        <el-table-column prop="memberType" label="状态"></el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="selectPtMeal(scope.row)">
              添加体检单
            </el-button>
            <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="tmxiangqing(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
        :current-page="pageNo2" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total, sizes, prev, pager, next, jumper" :total="total2">
      </el-pagination>
    </div>

    <!-- 添加体检单窗口 -->
    <system-dialog :title="TiDialog.title" :visible="TiDialog.visible" :width="TiDialog.width" :height="TiDialog.height"
      @onClose="onClose" @onConfirm="onConfirm()">
      <div slot="content">
        <el-form :model="Ti" ref="TiForm" :rules="rules" label-width="100px" :inline="true" size="small">
          <el-form-item label="体重" prop="weight">
            <el-input v-model="Ti.weight"></el-input>
          </el-form-item>
          <el-form-item label="身高" prop="height">
            <el-input v-model="Ti.height"></el-input>
          </el-form-item>
          <el-form-item label="臀围" prop="hipline">
            <el-input v-model="Ti.hipline"></el-input>
          </el-form-item>
          <el-form-item label="肩围" prop="shoulderWai">
            <el-input v-model="Ti.shoulderWai"></el-input>
          </el-form-item>
          <el-form-item label="腹围" prop="belly">
            <el-input v-model="Ti.belly"></el-input>
          </el-form-item>
          <el-form-item label="胸围" prop="bw">
            <el-input v-model="Ti.bw"></el-input>
          </el-form-item>
          <el-form-item label="上臂围" prop="upbicepLeft">
            <el-input v-model="Ti.upbicepLeft"></el-input>
          </el-form-item>
          <el-form-item label="前臂围" prop="beforebicepRight">
            <el-input v-model="Ti.beforebicepRight"></el-input>
          </el-form-item>
          <el-form-item label="大腿围" prop="bigtrousersLeft">
            <el-input v-model="Ti.bigtrousersLeft"></el-input>
          </el-form-item>
          <el-form-item label="小腿围" prop="littletrousersRight">
            <el-input v-model="Ti.littletrousersRight"></el-input>
          </el-form-item>
          <el-form-item label="腰围" prop="waistline">
            <el-input v-model="Ti.waistline"></el-input>
          </el-form-item>
          <el-form-item label="脂肪" prop="fat">
            <el-input v-model="Ti.fat"></el-input>
          </el-form-item>
          <el-form-item label="体重指数BIM" prop="weightnbim">
            <el-input v-model="Ti.weightnbim"></el-input>
          </el-form-item>
          <el-form-item label="基础代谢" prop="uimsatz">
            <el-input v-model="Ti.uimsatz"></el-input>
          </el-form-item>
          <el-form-item label="腹肌耐力" prop="endurance">
            <el-input v-model="Ti.endurance "></el-input>
          </el-form-item>
          <el-form-item label="柔韧度测试" prop="flexibility">
            <el-input v-model="Ti.flexibility"></el-input>
          </el-form-item>
          <el-form-item label="俯卧撑测试" prop="pushup">
            <el-input v-model="Ti.pushup"></el-input>
          </el-form-item>
          <el-form-item label="血压测量" prop="obpm">
            <el-input v-model="Ti.obpm"></el-input>
          </el-form-item>
          <el-form-item label="心率" prop="hrrest">
            <el-input v-model="Ti.hrrest"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 添加访谈记录窗口 -->
    <system-dialog :title="tanDialog.title" :visible="tanDialog.visible" :width="tanDialog.width"
      :height="tanDialog.height" @onClose="ontanClose" @onConfirm="ontanConfirm()">
      <div slot="content">
        <el-form :model="tan" ref="tanForm" :rules="tanrules" label-width="100px" :inline="true" size="small">
          <el-form-item label="访谈内容" prop="interview">
            <el-input v-model="tan.interview" type="textarea" clearable placeholder="请输入描述" maxlength="200" :rows="10">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 私教套餐详情窗口 -->
    <system-dialog :title="ptxxDialog.title" :height="ptxxDialog.height" :width="ptxxDialog.width"
      :visible="ptxxDialog.visible" @onClose="ptxxClose" @onConfirm="ptxxConfirm">
      <div slot="content">
        <!-- 分配角色数据列表 -->
        <el-table ref="ptxxTable" :data="ptxxList" border stripe :height="ptxxHeight"
          style="width: 100%; margin-bottom: 10px">
          <el-table-column prop="ptName" label="套餐名称"></el-table-column>
          <el-table-column prop="ptpName" label="项目名称"></el-table-column>
          <el-table-column prop="mealType" label="套餐类型"></el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">

              <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="fantan(scope.row)">
                添加访谈
              </el-button>

            </template>
          </el-table-column>
        </el-table>

      </div>
    </system-dialog>
    <!-- 团操套餐详情窗口 -->
    <system-dialog :title="tmxxDialog.title" :height="tmxxDialog.height" :width="tmxxDialog.width"
      :visible="tmxxDialog.visible" @onClose="tmxxClose" @onConfirm="tmxxConfirm">
      <div slot="content">
        <!-- 分配角色数据列表 -->
        <el-table ref="tmxxTable" :data="tmxxList" border stripe :height="tmxxHeight"
          style="width: 100%; margin-bottom: 10px">
          <el-table-column prop="teamName" label="套餐名称"></el-table-column>
          <el-table-column prop="tpName" label="项目名称"></el-table-column>
          <el-table-column prop="mealType" label="套餐类型"></el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">

              <el-button plain icon="el-icon-edit-outline" type="primary" size="small" @click="fantan(scope.row)">
                添加访谈
              </el-button>

            </template>
          </el-table-column>
        </el-table>

      </div>
    </system-dialog>
  </el-main>
</template>

<script>
import xueyuanApi from '@/api/xueyuanApi';
import userApi from '@/api/userApi';
import interviewApi from '@/api/interview';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
  //注册组件
  components: {
    SystemDialog
  },
  data() {
    return {
      searchModel: {
        memberName: "",
        pageNo: 1,
        pageSize: 10,
        empId: "",
        mealType: "",
      },
      tan: {
        interview: "",//文本内容
      },
      searchModel2: {
        memberName: "",
        pageNo: 1,
        pageSize: 10,
        empId: "",
        mealType: "",
      },
      mealType: "私教",
      mealType2: "",
      //表格显示数据
      tableData: [],
      //表格显示数据
      tableData2: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      pageNo2: 1,
      pageSize2: 10,
      total2: 0,
      falg1: true,
      falg2: false,
      //添加体检表单窗口属性
      TiDialog: {
        title: '',
        visible: false,
        height: 530,
        width: 500
      },
      //添加访谈窗口属性
      tanDialog: {
        title: '',
        visible: false,
        height: 300,
        width: 500
      },
      rules: {
        weight: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        height: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        hipline: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        shoulderWai: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        belly: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        bw: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        upbicepLeft: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        beforebicepRight: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        bigtrousersLeft: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        littletrousersRight: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        waistline: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        fat: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        weightnbim: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        uimsatz: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        endurance: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        flexibility: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        pushup: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        obpm: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
        hrrest: [{ required: true, message: '请输入数字', pattern: /[1-9]\d*/, trigger: 'blur' }],
      },
      tanrules: {
        interview: [{ required: true, trigger: 'blur', message: '请输入内容' }]
      },
      //角色对象
      Ti: {
        memberId: "",
        memberName: "",
        empId: "",
        weight: "",
        height: "",
        hipline: "",
        shoulderWai: "",
        belly: "",
        bw: "",
        upbicepLeft: "",
        beforebicepRight: "",
        bigtrousersLeft: "",
        littletrousersRight: "",
        waistline: "",
        fat: "",
        weightnbim: "",
        uimsatz: "",
        endurance: "",
        flexibility: "",
        pushup: "",
        obpm: "",
        hrrest: "",
      },
      fanTan: {
        empId: "",
        memberId: "",
        memberName: "",
        memberType: "",
        interview: "",
      },
      //私教详情窗口属性
      ptxxDialog: {
        title: '详情',
        visible: false,
        height: 400,
        width: 800
      },
      //详细私教查询条件
      ptSearchModel: {
        memberIds: "",//会员id,
        empId: "",//教练id
      },
      //团操详情窗口属性
      tmxxDialog: {
        title: '详情',
        visible: false,
        height: 400,
        width: 800
      },
      //团操私教查询条件
      tmSearchModel: {
        memberIds: "",//会员id,
        empId: "",//教练id
      },
      station:"",//岗位
    }
  },
  created() {

    this.search();
  },
  methods: {
    //查询当前登录的人的员工姓名

    //查询
    async search(pageNo, pageSize) {
      let userId = this.$store.getters.userId;
      let res2 = await userApi.empByUserId({ id: userId });
      this.station=res2.data.emp.station
      this.searchModel.empId = res2.data.empId
      this.ptSearchModel.empId = res2.data.empId
      this.tmSearchModel.empId = res2.data.empId
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;

      console.log("cc=", this.searchModel.empId)//账号id
      this.searchModel.mealType = "私教";
      console.log(this.searchModel)
      
      let res =null;
      if(this.station=="教练部经理"){
        //查询所有
        res=await xueyuanApi.findAllByStation(this.searchModel);
      }else{
         res = await xueyuanApi.findAll(this.searchModel);
      }
      if (res.success) {
        this.tableData = res.data.records
        this.total = res.data.total
        console.log(res.data);
        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].memberSex = res.data.records[i].memberSex == 0 ? "女" : "男";
          res.data.records[i].memberType = res.data.records[i].memberType == 1 ? "体验会员" : "正式会员";
        }
      }
    },
    resetValue() {
      this.searchModel.memberName = "";
      this.searchModel2.memberName = "";
      this.search();
      this.tm();
    },
    //私教
    pt() {
      this.falg1 = true;
      this.falg2 = false;
      this.mealType2 = "私教"
      this.search()
    },
    //团操
    async tm(pageNo2, pageSize2) {
      this.falg1 = false;
      this.falg2 = true;
      let userId = this.$store.getters.userId;
      let res2 = await userApi.empByUserId({ id: userId });
      this.searchModel2.empId = res2.data.empId
      this.searchModel2.pageNo = pageNo2;
      this.searchModel2.pageSize = pageSize2;
      this.mealType2 = "团操"
      this.searchModel2.mealType = "团操";
      console.log(this.searchModel2)
      let res =null;
      if(this.station=="教练部经理"){
        //查询所有
        res=await xueyuanApi.findAllByStation(this.searchModel2);
      }else{
         res = await xueyuanApi.findAll(this.searchModel2);
      }
      
      if (res.success) {
        this.tableData2 = res.data.records
        this.total2 = res.data.total
        for (let i = 0; i < res.data.records.length; i++) {
          res.data.records[i].memberSex = res.data.records[i].memberSex == 0 ? "女" : "男";
          res.data.records[i].memberType = res.data.records[i].memberType == 1 ? "体验会员" : "正式会员";
        }
        console.log(res.data);
      }
    },
    //添加体检单
    selectPtMeal(row) {
      console.log(row)
      this.$restForm("TiForm", this.Ti);
      this.Ti.memberId = row.memberId;
      this.Ti.memberName = row.memberName;
      this.TiDialog.title = "体检单"
     
      this.TiDialog.visible = true;
    },
    //体检单确认按钮
    async onConfirm(row) {
      this.$refs.TiForm.validate(async (valid) => {
        if (valid) {
          this.Ti.empId = this.$store.getters.userId;
          let res = await xueyuanApi.addTiJian(this.Ti)
          if (res.success) {
            //提示成功
            this.$message.success(res.message)
            if (this.mealType2 == "团操") {
              //刷新数据
              this.tm(this.pageNo2, this.pageSize2)
            }else if(this.mealType2 == "私教"){
              this.pt(this.pageNo1, this.pageSize1)
            }
            //关闭窗口事件
            this.TiDialog.visible = false
          } else {
            //提示失败
            this.$message.error(res.message)

          }
        }
      });

    },
    //体检单取消事件
    onClose() {
      this.TiDialog.visible = false;
    },
    /**
       * 当每页数量发生变化时触发该事件
       */
    handleSizeChange(size) {
      //修改每页显示数量
      this.pageSize = size
      //调用查询方法
      this.search(this.pageNo, size)
    },
    /**
    * 当页码发生变化时触发该事件
    */
    handleCurrentChange(page) {
      //修改当前页码
      this.pageNo = page
      //调用查询方法
      this.search(page, this.pageSize)
    },
    /**
   * 当每页数量发生变化时触发该事件
   */
    handleSizeChange2(size) {
      //修改每页显示数量
      this.pageSize2 = size
      //调用查询方法
      this.tm(this.pageNo2, size)
    },
    /**
    * 当页码发生变化时触发该事件
    */
    handleCurrentChange2(page) {
      //修改当前页码
      this.pageNo2 = page
      //调用查询方法
      this.tm(page, this.pageSize2)
    },
    //访谈
    fantan(row) {
      console.log(row)
      this.$restForm("tanForm", this.tan);
      this.fanTan.empId = this.$store.getters.userId;
      this.fanTan.memberId = row.memberId;
      this.fanTan.memberName = row.memberName;
      this.fanTan.memberType = row.memberState = "正式会员" ? 1 : 0;
      this.tanDialog.title = "添加访谈记录"

      this.tanDialog.visible = true;

    },
    //关闭访谈窗口
    ontanClose() {
      this.tanDialog.visible = false;
    },
    //提交访谈窗口
    async ontanConfirm(row) {
      this.$refs.tanForm.validate(async (valid) => {
        if (valid) {
          this.fanTan.interview = this.tan.interview
          let res = await interviewApi.addInterview(this.fanTan);
          if (res.success) {
            //提示成功
            this.$message.success(res.message)
            if (this.mealType2 == "团操") {
              //刷新数据
              this.tm(this.pageNo2, this.pageSize2)
            }else if(this.mealType2 == "私教"){
              this.pt(this.pageNo1, this.pageSize1)
            }
           
            //关闭窗口事件
            this.tanDialog.visible = false
          } else {
            //提示失败
            this.$message.error(res.message)

          }
        }
      });


    },
    //私教详情弹框
    async ptxiangqing(row) {
      this.ptSearchModel.memberIds = row.memberId;
      let res = await xueyuanApi.findMealPt(this.ptSearchModel)
      if (res.success) {
        this.ptxxList = res.data
        console.log(res.data);
      }

      this.ptxxDialog.visible = true
    },
    //私教详情窗口关闭事件
    ptxxClose() {
      this.ptxxDialog.visible = false
    },
    //私教详情窗口确认事件
    ptxxConfirm() {
      this.ptxxDialog.visible = false
    },
    //团操详情弹框
    async tmxiangqing(row) {
      this.tmSearchModel.memberIds = row.memberId;
      console.log(this.tmSearchModel)
      let res = await xueyuanApi.findMealTm(this.tmSearchModel)
      if (res.success) {
        this.tmxxList = res.data
        console.log(res.data);
      }

      this.tmxxDialog.visible = true
    },
    //团操详情窗口关闭事件
    tmxxClose() {
      this.tmxxDialog.visible = false
    },
    //团操详情窗口确认事件
    tmxxConfirm() {
      this.tmxxDialog.visible = false
    }
  }

}
</script>

<style>

</style>