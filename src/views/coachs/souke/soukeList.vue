<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.departmentName" placeholder="请输入部门名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow(jiaolianVo.pageNo,jiaolianVo.pageSize)">安排授课</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="soukeList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
            <el-table-column prop="empName" label="教练姓名" width="100" align="center"></el-table-column>
            <el-table-column prop="mealName" label="套餐名称"></el-table-column>
            <el-table-column prop="mealType" label="套餐类型"></el-table-column>
            <el-table-column prop="projectName" label="项目名称"></el-table-column>
            <el-table-column label="操作" align="center" width="290">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small">编辑
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>
                    <el-button icon="el-icon-setting" type="primary" size="small">分配权限
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 安排授课窗口 -->
        <system-dialog :title="soukeDialog.title" :height="soukeDialog.height" :width="soukeDialog.width"
            :visible="soukeDialog.visible" @onClose="onAsoukeClose" @onConfirm="onAsoukeConfirm">
            <div slot="content">
                <!-- 教练列表 -->
                <el-table ref="jiaolianTable" :data="jiaolianList" border stripe :height="assignHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="empName" label="教练姓名" />
                    <el-table-column prop="empAge" label="年龄"></el-table-column>
                    <el-table-column prop="empSex" label="性别"></el-table-column>
                    <el-table-column label="操作" align="center" width="190">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-edit" type="primary" size="small" @click="openPt(typeAll.Pt,scope.row)">私教
                            </el-button>
                            <el-button icon="el-icon-delete" type="danger" size="small"
                                @click="handleDelete(scope.row)">团操
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination @size-change="jiaolianChange" @current-change="jiaolianCurrentChange"
                    :current-page.sync="jiaolianVo.pageNo" :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="jiaolianVo.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="jiaolianVo.total" background>
                </el-pagination>
            </div>
        </system-dialog>
        <!-- 打开私教弹框 -->
         <!-- 购买私教会员窗口-->
         <system-dialog :title="ptDialog.title" :visible="ptDialog.visible" :width="ptDialog.width"
            :height="ptDialog.height" @onClose="ptClose" @onConfirm="ptConfirm">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModelpt.ptName" placeholder="请输入私教套餐名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="openPt(ptPage.pageNo,ptPage.pageSize)">
                            查询</el-button>
                        <el-button icon="el-icon-refresh-right " @click="resetValuept">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 私教项目数据列表 -->
                <el-table ref="ptTable" :data="ptList" border stripe :height="ptHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="ptId" label="编号" />
                    <el-table-column prop="ptMeals.ptName" label="套餐名称" />
                    <el-table-column prop="ptPrice" label="价格" />
                    <el-table-column prop="ptTime" label="套餐时长" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="ptbuy(scope.row)"> 选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination @size-change="ptSizeChange" @current-change="ptCurrentChange"
                    :current-page.sync="ptPage.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="ptPage.total" background>
                </el-pagination>
            </div>
        </system-dialog>
        <!-- 私教项目购买窗口 -->
        <system-dialog :title="buyPtDialog.title" :height="buyPtDialog.height" :width="buyPtDialog.width"
            :visible="buyPtDialog.visible" @onClose="buyPtClose" @onConfirm="buyPtConfirm">
            <div slot="content">
                <!-- 分配私教项目数据列表 -->
                <el-table ref="buyPtTable" :data="buyPtList" border stripe :height="buyPtHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="ptpId" label="项目编号" />
                    <el-table-column prop="ptpName" label="项目名称" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="ptbuyTow(scope.row)"> 选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </system-dialog>
    </el-main>
</template>

<script>
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue'
import CoachApi from '@/api/coachList'
//导入salesApi.js脚本文件
import salesApi from "@/api/salesApi";
//导入soukeApi.js脚本文件
import soukeApi from "@/api/soukeApi";
export default {
    //注册组件
    components: {
        SystemDialog
    },

    data() {
        return {
            //条件查询
            searchModel: {
                empName: "",
                pageNo: 1,
                pageSize: 10,
            },
            emp: {
                empPhone: "",//教练电话
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //表格数据
            soukeList: [],
            jiaolianList: [],//教练数据列表
            pageNo: 1,
            pageSize: 10,
            total: 0,
            jiaolianVo: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            //分配权限窗口属性
            soukeDialog: {
                title: '选择教练',
                visible: false,
                height: 450,
                width: 600
            },
             //定义类型
             typeAll: {
                Pt: "私教",
                TeamPt: "团操",
                Common: "普通",
            },
            //私教套餐条件查询区
            searchModelpt: {
                pageNo: 1,
                pageSize: 10,
                ptName: "",
                empId:"",

            },
            //私教套餐分页
            ptPage: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },

            //私教套餐套餐表格数据
            ptList: [],
            //购买私教套餐会员弹窗
            ptDialog: {
                title: "私教套餐信息", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 470, //窗口高度
            },
            //购买私教项目弹窗
            buyPtDialog: {
                title: "私教项目信息", //窗口标题
                visible: false, //是否显示窗口
                width: 600, //窗口宽度
                height: 400, //窗口高度
            },
            //购买私教项目数据回显
            buyPtList: [],
            buyPtHeight: 500, //表格高度
            buyTeamTowHeight: 500,//表格高度
        }
    },
    methods: {
        //查询方法
        search() {

        },
        //重置方法
        resetValue() {

        },
        //安排授课打开窗口
        async openAddwindow(pageNo ,pageSize) {
            this.emp.pageNo=pageNo
            this.emp.pageSize=pageSize
            //发送查询请求
            let res = await CoachApi.findCoachList(this.emp);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.jiaolianList = res.data.records;
                //当前数据数量
                this.jiaolianVo.total = res.data.total;
            }
            this.soukeDialog.visible = true;
        },
        //当每页数量发生变化时触发该事件
        jiaolianChange(size) {
            //修改每页显示数量
            this.jiaolianVo.pageSize=size
            //调用查询方法
            this.openAddwindow(this.jiaolianVo.pageNo,size)
        },
        /**
      * 当页码发生变化时触发该事件
      */
        jiaolianCurrentChange(page) {
            //修改当前页码
            this.jiaolianVo.pageNo=page
            //调用查询方法
            this.openAddwindow(page,this.jiaolianVo.pageSize)
        },
        //安排授课关闭窗口
        onAsoukeClose() {
            this.soukeDialog.visible = false;
        },
        //安排授课确认提交窗口
        onAsoukeConfirm() {
            this.soukeDialog.visible = false;
        },
        /**
       * 当每页数量发生变化时触发该事件
       */
        handleSizeChange(size) {
            // //修改每页显示数量
            // this.pageSize=size
            // //调用查询方法
            // this.search(this.pageNo,size)
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange(page) {
            // //修改当前页码
            // this.pageNo=page
            // //调用查询方法
            // this.search(page,this.pageSize)
        },
         //打开购买私教窗口事件
         async openPt(row1,row2) {
           console.log(row1)
           console.log(row2)
           this.searchModelpt.empId=this.$store.getters.userId;
            this.searchModelpt.pageNo = this.ptPage.pageNo;
            this.searchModelpt.pageSize = this.ptPage.pageSize;
            let res = await soukeApi.findTeamIdByCoachId(this.searchModelpt)
     

            if (res.success) {
                console.log(res.data)
               
                // console.log(this.ptList.ptMeals[0])
                this.ptPage.total = res.data.total;
            }
            this.ptDialog.visible = true;

        },
        //重置
        resetValuept() {
            this.searchModelpt.ptName = ""
            this.openPt(this.ptPage.pageSize)
        },
        //当分页每页显示条数改变时触发
        ptSizeChange(size) {
            this.ptPage.pageSize = size;
            this.openPt(this.ptPage.pageNo, size);
        },
        //当当前页码改变时
        ptCurrentChange(page) {
            this.ptPage.pageNo = page;
            this.openPt(page, this.ptPage.pageSize)
        },
        //购买私教套餐窗口取消事件
        ptClose() {
            this.ptDialog.visible = false;
        },
        //购买私教套餐窗口确认事件
        ptConfirm() {

        },
        //打开购买私教项目的窗口
        async ptbuy(row) {
            // console.log("111", row)
            // this.ptShuju.mealTime = row.ptTime;
            // this.ptShuju.mealId = row.ptId;
            // this.ptShuju.mealName = row.ptName;
            // this.ptShuju.salesPrice = row.ptPrice;
            this.buyPtDialog.visible = true;
            let res = await salesApi.findPtpName({ ptId: row.ptId })
            if (res.success) {
                this.buyPtList = res.data;

            }
        },
        //购买私教项目窗口取消事件
        buyPtClose() {
            this.buyPtDialog.visible = false;
        },
        //购买私教项目窗口购买事件
        ptbuyTow(row) {
            console.log("222", row)
           
        },
     
        //购买私教项目窗口确认事件
        buyPtConfirm() {
            this.buyPtDialog.visible = false;
        },
        //删除
        handleDelete() {

        },
    }
}
</script>

<style>

</style>