<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.mealName" placeholder="请输入套餐名称" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchModel.memberName" placeholder="请输入购买人姓名" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchModel.type" placeholder="请输入套餐类型" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(salesPage.pageNo,salesPage.pageSize)">查询
                </el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" @click="openPt(typeAll.Pt)">购买私教</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openTeamPt(typeAll.TeamPt)">购买团操</el-button>
                <el-button type="warning" plain icon="el-icon-plus" @click="openCommon(typeAll.Common)">购买普通会员
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 40px" row-key="salesId"
            default-expand-all>
            <el-table-column prop="mealName" label="套餐名称" />
            <el-table-column prop="memberName" label="会员姓名" />
            <el-table-column prop="memberPhone" label="会员电话" />
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="mealTime" label="时长" />
            <el-table-column prop="salesPrice" label="金额" />
            <el-table-column prop="state" label="状态" />
            <el-table-column prop="salesTime" label="购买时间" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="saleshandleSizeChange" @current-change="saleshandleCurrentChange"
            :current-page="salesPage.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="salesPage.total">
        </el-pagination>
        <!-- 购买普通会员窗口-->
        <system-dialog :title="commonDialog.title" :visible="commonDialog.visible" :width="commonDialog.width"
            :height="commonDialog.height" @onClose="CommonClose" @onConfirm="CommonConfirm">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModelcommon.cmName" placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search"
                            @click="openCommon(commonPage.pageNo,commonPage.pageSize)">查询</el-button>
                        <el-button icon="el-icon-refresh-right " @click="resetValuecommon()">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 普通会员数据列表 -->
                <el-table ref="commonTable" :data="commonList" border stripe :height="commonHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="cmId" label="项目编号" />
                    <el-table-column prop="cmName" label="项目名称" />
                    <el-table-column prop="cmPrice" label="套餐价格" />
                    <el-table-column prop="cmTime" label="套餐时长" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="commonbuy(scope.row)"> 购买
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination @size-change="commonSizeChange" @current-change="commonCurrentChange"
                    :current-page.sync="commonPage.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="commonPage.total" background>
                </el-pagination>
            </div>
        </system-dialog>
        <!-- 普通购买弹窗 -->
        <system-dialog :title="buyCommonDialog.title" :visible="buyCommonDialog.visible" :width="buyCommonDialog.width"
            :height="buyCommonDialog.height" @onClose="BuyCommonClose" @onConfirm="BuyCommonConfirm">
            <div slot="content">
                <el-form :model="buyCommonList" ref="buyCommonForm" :rules="CommonRules" label-width="80px"
                    :inline="true" size="small">
                    <el-form-item label="购买人" prop="memberName">
                        <el-input v-model="buyCommonList.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="buyCommonList.memberPhone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
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
                    <el-table-column prop="ptName" label="套餐名称" />
                    <el-table-column prop="ptPrice" label="价格" />
                    <el-table-column prop="ptTime" label="套餐时长" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="ptbuy(scope.row)"> 购买
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
                            <el-button type="success" icon="el-icon-plus" size="small" @click="ptbuyTow(scope.row)"> 购买
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </system-dialog>
        <!-- 私教购买弹窗 -->
        <system-dialog :title="buyptTowDialog.title" :visible="buyptTowDialog.visible" :width="buyptTowDialog.width"
            :height="buyptTowDialog.height" @onClose="BuyptTowClose" @onConfirm="BuyptTowConfirm">
            <div slot="content">
                <el-form :model="buyPtTowList" ref="buyptTowForm" :rules="CommonRules" label-width="80px" :inline="true"
                    size="small">
                    <el-form-item label="购买人" prop="memberName">
                        <el-input v-model="buyPtTowList.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="buyPtTowList.memberPhone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <!-- 购买团操套餐会员窗口-->
        <system-dialog :title="TeamDialog.title" :visible="TeamDialog.visible" :width="TeamDialog.width"
            :height="TeamDialog.height" @onClose="TeamClose" @onConfirm="TeamConfirm">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModelTeam.teamName" placeholder="请输入私教套餐名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search"
                            @click="openTeamPt(TeamPage.pageNo,TeamPage.pageSize)">
                            查询</el-button>
                        <el-button icon="el-icon-refresh-right " @click="resetValueTeam">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 团操项目数据列表 -->
                <el-table ref="TeamTable" :data="TeamList" border stripe :height="TeamHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="teamId" label="编号" />
                    <el-table-column prop="teamName" label="套餐名称" />
                    <el-table-column prop="teamPrice" label="价格" />
                    <el-table-column prop="teamTime" label="套餐时长" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="Teambuy(scope.row)"> 购买
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination @size-change="TeamSizeChange" @current-change="TeamCurrentChange"
                    :current-page.sync="TeamPage.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="TeamPage.total" background>
                </el-pagination>
            </div>
        </system-dialog>
        <!-- 团操项目购买窗口 -->
        <system-dialog :title="buyTeamTowDialog.title" :height="buyTeamTowDialog.height" :width="buyTeamTowDialog.width"
            :visible="buyTeamTowDialog.visible" @onClose="buyTeamTowClose" @onConfirm="buyTeamTowConfirm">
            <div slot="content">
                <!-- 分配团操项目数据列表 -->
                <el-table ref="buyTeamTowTable" :data="buyTeamTowList" border stripe :height="buyTeamTowHeight"
                    style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="tpId" label="项目编号" />
                    <el-table-column prop="tpName" label="项目名称" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="buyTeamTow(scope.row)">
                                购买
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>
        <!-- 团操项目购买弹窗 -->
        <system-dialog :title="buyTeamTreeDialog.title" :visible="buyTeamTreeDialog.visible"
            :width="buyTeamTreeDialog.width" :height="buyTeamTreeDialog.height" @onClose="buyTeamTreeClose"
            @onConfirm="buyTeamTreeConfirm">
            <div slot="content">
                <el-form :model="buyTeamTreeList" ref="buyTeamTreeForm" :rules="CommonRules" label-width="80px"
                    :inline="true" size="small">
                    <el-form-item label="购买人" prop="memberName">
                        <el-input v-model="buyTeamTreeList.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="buyTeamTreeList.memberPhone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
    </el-main>
</template>
<script>
//导入salesApi.js脚本文件
import salesApi from "@/api/salesApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "class",
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            //条件查询
            searchModel: {
                mealName: "",//课程销售套餐名
                memberName: "",//课程销售会员名
                type: "",//课程销售类型
                pageNo: 1,
                pageSize: 10,
                salesmanId:"",//当前人的id
            },
            searchModelcommon: {
                cmName: "",//普通套餐名
                pageNo: 1,
                pageSize: 10,
            },
            //定义类型
            typeAll: {
                Pt: "私教",
                TeamPt: "团操",
                Common: "普通",
            },
            //表格分页
            salesPage: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            //普通套餐分页
            commonPage: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            //表格数据
            tableData: [],
            //普通套餐表格数据
            commonList: [],
            //购买普通会员弹窗
            commonDialog: {
                title: "普通套餐信息", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 470, //窗口高度
            },
            buyCommonDialog: {
                title: "购买信息", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 100, //窗口高度
            },
            buyCommonList: {
                memberName: "",//购买人
                memberPhone: ""//电话
            },
            CommonRules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberPhone: [{
                    required: true,
                    message: '请输入数字',
                    pattern: /[1-9]\d*/,
                    trigger: 'blur'
                }]
            },
            //存储数据返回到后台
            CommonShuju: {
                cmId: "",
                mealId:"",
                mealName: "",
                salesPrice: "",
                mealTime: "",
                memberName: "",
                memberPhone: "",
                type: "",
                salesmanId: "",
            },
            //私教套餐条件查询区
            searchModelpt: {
                pageNo: 1,
                pageSize: 10,
                ptName: "",

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
            buyptTowDialog: {
                title: "购买信息", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 100, //窗口高度
            },
            buyPtTowList: {
                memberName: "",//购买人
                memberPhone: ""//电话
            },
            //存储数据返回到后台
            ptShuju: {
                mealId: "",//套餐id
                mealName: "",//套餐名称
                projectId: "",//项目id
                projectName: "",//项目名称
                salesPrice: "",//价格
                mealTime: "",//时长
                memberName: "",//姓名
                memberPhone: "",//电话
                type: "",//类型
                salesmanId: "",//当前销售id
            },
            //购买团操套餐会员弹窗
            TeamDialog: {
                title: "团操套餐信息", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 470, //窗口高度
            },
            TeamList: [],//团操数据列表
            TeamHeight: 500, //表格高度
            //团操套餐条件查询区
            searchModelTeam: {
                pageNo: 1,
                pageSize: 10,
                teamName: "",
            },
            //团操套餐分页
            TeamPage: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            //团操项目
            buyTeamTowDialog: {
                title: "团操项目信息", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 470, //窗口高度
            },
            buyTeamTowList: [],//团操项目数据显示列表
            buyTeamTreeDialog: {
                title: "购买信息", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 100, //窗口高度
            },
            buyTeamTreeList: [],//购买信息
            //存储数据返回到后台
            TeamShuju: {
                mealId: "",//套餐id
                mealName: "",//套餐名称
                projectId: "",//项目id
                projectName: "",//项目名称
                salesPrice: "",//价格
                mealTime: "",//时长
                memberName: "",//姓名
                memberPhone: "",//电话
                type: "",//类型
                salesmanId: "",//当前销售id
            },
        }
    },
    //初始化时调用
    created() {
        this.search();
    },
    methods: {
        //查询列表
        async search(pageNo, pageSize) {
            this.searchModel.pageNo = pageNo;
            this.searchModel.pageSize = pageSize;
            this.searchModel.salesmanId = this.$store.getters.userId;
            //发送查询请求
            let res = await salesApi.findAllSales(this.searchModel);
            //判断是否成功

            if (res.success) {
                console.log(res.data);
                this.tableData = res.data.records;
                this.salesPage.total = res.data.total;
                for (let i = 0; i < res.data.records.length; i++) {
                    if(res.data.records[i].state==0){
                        res.data.records[i].state="待购中"
                    }else if(res.data.records[i].state==1){
                        res.data.records[i].state="已购买"
                    }else {
                        res.data.records[i].state="已统计"
                    }
                }
            }

        },
        //重置查询条件
        resetValue() {
            this.searchModel.mealName = "";//课程销售套餐名
            this.searchModel.memberName = "";//课程销售会员名
            this.searchModel.type = "";//课程销售类型
            this.search(this.salesPage.pageSize)
        },
        //打开购买普通会员窗口事件
        async openCommon(row) {
            this.searchModelcommon.pageNo = this.commonPage.pageNo;
            this.searchModelcommon.pageSize = this.commonPage.pageSize;
            let res = await salesApi.getCommonMeallist(this.searchModelcommon)
            if (res.success) {
                this.commonList = res.data.records;
                this.commonPage.total = res.data.total;
            }
            this.commonDialog.visible = true;
        },
        //窗口关闭事件
        CommonClose() {
            this.commonDialog.visible = false;
        },
        //条件查询重置
        resetValuecommon() {
            this.searchModelcommon.cmName = "";
            this.openCommon(this.commonPage.pageSize);
        },
        //窗口确认事件
        CommonConfirm() {
            this.commonDialog.visible = false;
        },
        //当分页每页显示条数改变时触发
        commonSizeChange(size) {
            this.commonPage.pageSize = size;
            this.openCommon(this.commonPage.pageNo, size);
        },
        //当当前页码改变时
        commonCurrentChange(page) {
            this.commonPage.pageNo = page;
            this.openCommon(page, this.commonPage.pageSize)
        },
        //普通套餐购买取消事件
        BuyCommonClose() {
            this.buyCommonDialog.visible = false;
        },
        //普通套餐购买确认事件
        BuyCommonConfirm() {
            console.log(this.buyCommonList);
            this.CommonShuju.memberName = this.buyCommonList.memberName
            this.CommonShuju.memberPhone = this.buyCommonList.memberPhone
            this.CommonShuju.type = this.typeAll.Common;

            this.CommonShuju.salesmanId = this.$store.getters.userId;
            //进行表单验证
            this.$refs.buyCommonForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = await salesApi.addSales(this.CommonShuju);
                    console.log("1", this.CommonShuju);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据
                        this.search(this.salesPage.pageNo, this.salesPage.pageSize);
                        //关闭窗口事件
                        this.commonDialog.visible = false;
                        this.buyCommonDialog.visible = false;


                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }
                }
            });

        },
        //普通套餐购买窗口打开事件
        commonbuy(row) {
                console.log("11",row)
            this.CommonShuju = row
            this.CommonShuju.mealId=row.cmId;
            this.CommonShuju.salesPrice = row.cmPrice;
            this.CommonShuju.mealTime = row.cmTime;
            this.CommonShuju.mealName = row.cmName;
            console.log(this.CommonShuju);
            this.$restForm("buyCommonForm", this.buyCommonList);
            this.buyCommonDialog.visible = true;
        },

        //打开购买私教窗口事件
        async openPt(row) {
            this.searchModelpt.pageNo = this.ptPage.pageNo;
            this.searchModelpt.pageSize = this.ptPage.pageSize;
            let res = await salesApi.listState(this.searchModelpt)
            if (res.success) {
                this.ptList = res.data.records;

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
            console.log("111", row)
            this.ptShuju.mealTime = row.ptTime;
            this.ptShuju.mealId = row.ptId;
            this.ptShuju.mealName = row.ptName;
            this.ptShuju.salesPrice = row.ptPrice;
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
            this.ptShuju.projectId = row.ptpId;
            this.ptShuju.projectName = row.ptpName;
            this.$restForm("buyptTowForm", this.buyPtTowList);
            this.buyptTowDialog.visible = true;
        },
        //购买私教项目窗口取消购买事件
        BuyptTowClose() {
            this.buyptTowDialog.visible = false;
        },
        //购买私教项目窗口确认购买事件
        async BuyptTowConfirm(row) {
            this.ptShuju.type = this.typeAll.Pt;
            this.ptShuju.salesmanId = this.$store.getters.userId;
            this.ptShuju.memberName = this.buyPtTowList.memberName;
            this.ptShuju.memberPhone = this.buyPtTowList.memberPhone;
            //进行表单验证
            console.log(this.ptShuju)
            this.$refs.buyptTowForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = await salesApi.addSales(this.ptShuju);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据
                        this.search(this.salesPage.pageNo, this.salesPage.pageSize);
                        //关闭窗口事件
                        this.buyPtDialog.visible = false;
                        this.buyptTowDialog.visible = false;
                        this.ptDialog.visible = false;


                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }
                }
            });

        },
        //购买私教项目窗口确认事件
        buyPtConfirm() {
            this.buyPtDialog.visible = false;
        },
        //购买团操套餐窗口取消事件
        TeamClose() {
            this.TeamDialog.visible = false;
        },
        //购买团操套餐窗口确认事件
        TeamConfirm() {

        },
        //打开购买团操套餐窗口事件
        async openTeamPt(row) {


            this.searchModelTeam.pageNo = this.TeamPage.pageNo
            this.searchModelTeam.pageSize = this.TeamPage.pageSize
            let res = await salesApi.listTeamState(this.searchModelTeam);
            if (res.success) {
                console.log(res.data)
                this.TeamList = res.data.records;
                this.TeamPage.total = res.data.total;
            }
            this.TeamDialog.visible = true;
        },
        //团操套餐当每页数量发生变化时触发该事件
        TeamSizeChange(size) {
            this.TeamPage.pageSize = size
            this.openTeamPt(this.TeamPage.pageNo, size)
        },
        //团操套餐当页码发生变化时触发该事件
        TeamCurrentChange(page) {
            this.TeamPage.pageNo = page
            this.openTeamPt(page, this.TeamPage.pageSize)
        },
        //购买团操项目
        async Teambuy(row) {
            console.log("11", row)
            this.TeamShuju.mealId = row.teamId;
            this.TeamShuju.mealName = row.teamName;
            this.TeamShuju.salesPrice = row.teamPrice;
            this.TeamShuju.mealTime = row.teamTime;
            let res = await salesApi.findTeamName({ teamId: row.teamId });
            if (res.success) {
                this.buyTeamTowList = res.data;
                console.log(this.buyTeamTowList)

            }
            this.buyTeamTowDialog.visible = true;

        },
        //购买团操项目取消事件2
        buyTeamTowClose() {
            this.buyTeamTowDialog.visible = false;
        },
        //团操购买取消事件3
        buyTeamTreeClose() {
            this.buyTeamTreeDialog.visible = false;
        },
        //购买团操项目确认事件3
        buyTeamTreeConfirm() {
            this.TeamShuju.memberName = this.buyTeamTreeList.memberName;
            this.TeamShuju.memberPhone = this.buyTeamTreeList.memberPhone;
            this.TeamShuju.type = this.typeAll.TeamPt;
            this.TeamShuju.salesmanId = this.$store.getters.userId;
            //进行表单验证
            this.$refs.buyTeamTreeForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = await salesApi.addSales(this.TeamShuju);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据
                        this.search(this.salesPage.pageNo, this.salesPage.pageSize);
                        //关闭窗口事件
                        this.TeamDialog.visible = false;
                        this.buyTeamTowDialog.visible = false;
                        this.buyTeamTreeDialog.visible = false;
                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }
                }
            });
        },
        //购买团操项目确认事件2
        buyTeamTowConfirm() {
            this.buyTeamTowDialog.visible = false;
        },

        //团操项目中购买事件
        buyTeamTow(row) {
            console.log("2222", row)
            this.TeamShuju.projectId = row.tpId;
            this.TeamShuju.projectName = row.tpName;

            this.buyTeamTreeDialog.visible = true;
        },

        //删除
       async handleDelete(row) {
            console.log(row)
            let confirm = await this.$myconfirm("确定要删除该数据嘛?");
            if (confirm) {
                let res = await salesApi.delete({ id: row.salesId })
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    //刷新数据
                   
                    this.search(this.salesPage.pageNo, this.salesPage.pageSize);
                } else {
                    this.$message.error(res.message);
                }
            }

        },
        //重置团操套餐
        resetValueTeam() {
            this.searchModelTeam.teamName = "";
            this.openTeamPt(this.TeamPage.pageSize)
        },
        /**
   * 当每页数量发生变化时触发该事件
   */
        saleshandleSizeChange(size) {
            //修改每页显示数量
            this.salesPage.pageSize = size;
            //调用查询方法
            this.search(this.salesPage.pageNo, size);
        },
        /**
         * 当页码发生变化时触发该事件
         */
        saleshandleCurrentChange(page) {
            //修改当前页码
            this.salesPage.pageNo = page;
            //调用查询方法
            this.search(page, this.salesPage.pageSize);
        },
    }
}
</script>

<style scoped>

</style>