<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow" v-if="hasPermission('members:sjmember:add')">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别" :formatter="playbackFormat"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话" width="110"></el-table-column>
            <el-table-column prop="memberType" label="状态" :formatter="playbackFormat2"></el-table-column>
            <el-table-column prop="mealName" label="套餐名称"></el-table-column>
            <el-table-column prop="empName" label="教练名称"></el-table-column>
            <el-table-column prop="projectName" label="项目名称"></el-table-column>
            <el-table-column prop="mealType" label="套餐类型"></el-table-column>
            <el-table-column prop="mmTime" label="办理时间"></el-table-column>
            <el-table-column prop="mmDate" label="到期时间"></el-table-column>
            <el-table-column label="套餐操作" width="280" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" plain type="primary" size="small" @click="selectPtMeal(scope.row)"
                    v-if="hasPermission('members:sjmember:xiangqing')">
                        详情
                    </el-button>
                    <el-button type="success" plain icon="el-icon-plus" size="small" @click="renew(scope.row)"
                    v-if="hasPermission('members:sjmember:xufei')">
                        续费
                    </el-button>
                    <el-button icon="el-icon-close" plain type="danger" size="small" @click="del(scope.row)"
                    v-if="hasPermission('members:sjmember:delete')">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加窗口 -->
        <system-dialog :title="ptmbDialog.title" :visible="ptmbDialog.visible" :width="ptmbDialog.width"
            :height="ptmbDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="member" ref="memberForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="会员姓名" prop="memberName">
                        <el-input v-model="member.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="member.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐选择" prop="mealId" :readonly="true" @click.native="openPtMealWindow()">
                        <el-input v-model="member.mealName"></el-input>
                    </el-form-item>
                    <el-form-item label="教练选择" prop="empId" :readonly="true" @click.native="openPtCoachWindow()">
                        <el-input v-model="member.empName"></el-input>
                    </el-form-item>
                    <el-form-item label="项目选择" prop="projectId" :readonly="true" @click.native="openPtProjectWindow()">
                        <el-input v-model="member.projectName"></el-input>
                    </el-form-item>

                </el-form>

            </div>
        </system-dialog>

        <!-- 选择私教套餐的窗口 -->
        <system-dialog :title="ptMealDialog.title" :visible=" ptMealDialog.visible" :width=" ptMealDialog.width"
            :height="ptCoachDialog.height" @onClose="ptMealClose()" @onConfirm="ptMealConfirm()">
            <div slot="content">
                <el-table border :data="ptMeal">
                    <el-table-column label="编号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column label="套餐名称" align="center" prop="ptName">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="ptPrice">
                    </el-table-column>
                    <el-table-column label="持续时间" align="center" prop="ptTime">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" @click="addMmId(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

        <!-- 选择教练的窗口 -->
        <system-dialog :title="ptCoachDialog.title" :visible="ptCoachDialog.visible" :width="ptCoachDialog.width"
            :height="ptCoachDialog.height" @onClose="ptCoachClose()" @onConfirm="ptCoachConfirm()">
            <div slot="content">
                <el-table border :data="ptCoach">
                    <el-table-column label="编号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column label="教练姓名" align="center" prop="empName">
                    </el-table-column>
                    <el-table-column label="教练年龄" align="center" prop="empAge">
                    </el-table-column>
                    <el-table-column label="性别" align="center" prop="empSex">
                    </el-table-column>
                    <el-table-column label="电话" align="center" prop="empPhone">
                    </el-table-column>
                    <el-table-column label="邮箱" align="center" prop="emil">
                    </el-table-column>
                    <el-table-column label="qq" align="center" prop="qq">
                    </el-table-column>
                    <el-table-column label="微信" align="center" prop="weix">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" @click="synopsis(scope.row)">查看简介</el-button>
                            <el-button type="success" icon="el-icon-plus" @click="addEmpId(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>
        <!-- 选择项目的窗口 -->
        <system-dialog :title="ptProjectDialog.title" :visible="ptProjectDialog.visible" :width="ptProjectDialog.width"
            :height="ptProjectDialog.height" @onClose="ptProjectClose()" @onConfirm="ptProjectConfirm()">
            <div slot="content">
                <el-table border :data="ptProject">
                    <el-table-column label="编号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column label="项目名称" align="center" prop="ptpName">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" @click="addPtpId(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>


        <!-- 查看套餐详情窗口 -->
        <system-dialog :title="mealDialog.title" :visible="mealDialog.visible" :width="mealDialog.width"
            :height="mealDialog.height" @onClose="pageClose()" @onConfirm="pageConfirm()">
            <div slot="content">
                <el-form ref="memberFormXQ" label-width="80px" size="small" :inline="true">
                    <el-form-item label="套餐编号">
                        <el-input readonly v-model="mealSJ.ptId"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐名称">
                        <el-input readonly v-model="mealSJ.ptName"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐时长">
                        <el-input readonly v-model="mealSJ.ptTime"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐价格">
                        <el-input readonly v-model="mealSJ.ptPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="教练姓名">
                        <el-input readonly v-model="mealSJ.empName"></el-input>
                    </el-form-item>
                    <el-form-item label="教练年龄">
                        <el-input readonly v-model="mealSJ.empAge"></el-input>
                    </el-form-item>
                    <el-form-item label="教练性别">
                        <el-input readonly v-model="mealSJ.empSex"></el-input>
                    </el-form-item>
                    <el-form-item label="教练电话">
                        <el-input readonly v-model="mealSJ.empPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="教练微信">
                        <el-input readonly v-model="mealSJ.weix"></el-input>
                    </el-form-item>
                    <el-form-item label="教练邮箱">
                        <el-input readonly v-model="mealSJ.emil"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import PtMemberApi from '@/api/ptMember'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'sjmember',
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            //分页组件所需的属性
            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量
            //表格数据列表
            tableData: [
            ],
            //查询参数
            phone: {
                memberPhone: "",
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //新增窗口
            ptmbDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 350,//窗口宽度
                height: 250//窗口高度
            },
            // 新增窗口绑定数据
            member: {
                memberName: "",//会员姓名
                memberPhone: "",//电话号码
                mealId: "",//套餐编号
                mealName: "",//套餐名称
                empId: "",//教练编号
                empName: "",//教练名称
                projectId: "",//项目id
                projectName: "",//项目名称
            },
            //验证
            mbrules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },
                { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
                mealId: [{ required: true, message: '请选择套餐', trigger: 'change' }],
                empId: [{ required: true, message: '请选择教练', trigger: 'change' }],
                projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
            },
            //选择套餐框的属性
            ptMealDialog: {
                title: "选择套餐",//窗口标题
                visible: false,//是否显示窗口
                width: 600,//窗口宽度
                height: 400//窗口高度

            },
            //私教套餐数据
            ptMeal: [],
            //选择教练框的属性
            ptCoachDialog: {
                title: "选择教练",//窗口标题
                visible: false,//是否显示窗口
                width: 1200,//窗口宽度
                height: 500//窗口高度
            },
            //私教教练数据
            ptCoach: [],
            //选择项目框的属性
            ptProjectDialog: {
                title: "选择项目",//窗口标题
                visible: false,//是否显示窗口
                width: 400,//窗口宽度
                height: 300//窗口高度
            },
            //私教套餐项目数据
            ptProject: [],
            //套餐详情的属性
            mealDialog: {
                title: "套餐详情",//窗口标题
                visible: false,//是否显示窗口
                width: 600,//窗口宽度
                height: 400//窗口高度
            },
            //详情数据
            mealSJ: {},
            //详情参数
            XQ: {
                mealId: "",//套餐id
                empId: ""//教练id
            }

        }
    },
    created() {
        this.search();
    },
    methods: {
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
        //查询私教会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.phone.pageNo = pageNo
            //修改每页显示条数
            this.phone.pageSize = pageSize
            //发送查询请求
            let res = await PtMemberApi.getPtMemberList(this.phone);
            console.log("----------",res);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //打开添加窗口
        openAddwindow() {
            this.$restForm("memberForm", this.member);
            //设置属性
            this.ptmbDialog.title = '新增私教会员',
                this.ptmbDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.ptmbDialog.visible = false
        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            console.log(this.member);
            this.$refs.memberForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //发送添加请求
                    console.log(this.member);
                    res = await PtMemberApi.getAddPtMember(this.member)
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.ptmbDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.size)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })

        },
        //打开套餐选择的窗口
        async openPtMealWindow() {
            this.ptMealDialog.visible = true
            //获取私教套餐
            let res = await PtMemberApi.getPtMealList();
            //判断是否成功
            if (res.success) {
                this.ptMeal = res.data
            }
        },

        //套餐选择取消事件 
        ptMealClose() {
            this.ptMealDialog.visible = false
        },
        //套餐选择确认事件
        ptMealConfirm() {
            console.log("ssss");
            this.ptMealDialog.visible = false
        },

        //选择套餐
        addMmId(row) {
            //清空教练，项目框
            this.member.empId = "";
            this.member.ptpId = "";
            this.member.mealId = row.ptId
            this.member.mealName = row.ptName
            this.ptMealDialog.visible = false
        },


        //打开私教教练窗口
        async openPtCoachWindow() {
            //判断套餐是否选择
            if (this.member.mealId == "") {
                await this.$myconfirm("请先选择套餐")
            } else {
                this.ptCoachDialog.visible = true
                console.log(this.member.mealId);
                //获取私教教练
                let res = await PtMemberApi.getPtCoachListByMealId({ ptId: this.member.mealId })
                console.log(res)
                //判断是否成功
                if (res.success) {
                    this.ptCoach = res.data
                }
            }

        },
        //教练选择取消关闭事件 
        ptCoachClose() {
            this.ptCoachDialog.visible = false
        },
        //教练选确定事件
        ptCoachConfirm() {
            this.ptCoachDialog.visible = false
        },
        //选择教练
        addEmpId(row) {
            this.member.empId = row.empId
            this.member.empName = row.empName
            this.ptCoachDialog.visible = false
        },


        //打开私教项目窗口
        async openPtProjectWindow() {
            //获取私教项目
            if (this.member.mealId == "") {
                await this.$myconfirm("请先选择套餐")
            } else {
                this.ptProjectDialog.visible = true
                console.log(this.member.mealId);
                //获取私教项目
                let res = await PtMemberApi.getPtProjectByPtId({ ptId: this.member.mealId })
                console.log(res)
                //判断是否成功
                if (res.success) {
                    this.ptProject = res.data
                }
            }
        },
        //项目选择取消关闭事件 
        ptProjectClose() {
            this.ptProjectDialog.visible = false
        },
        //项目选确定事件
        ptProjectConfirm() {
            this.ptProjectDialog.visible = false
        },
        //选择项目
        addPtpId(row) {
            this.member.projectName = row.ptpName
            this.member.projectId = row.ptpId
            this.ptProjectDialog.visible = false
        },



        //根据会员办理套餐id删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await PtMemberApi.getdelPtMealById({ mmId: row.mmId })
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search(this.pageNo, this.size)
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        },

        //查看套餐详情窗口
        async selectPtMeal(row) {
            this.mealDialog.visible = true
            this.XQ.mealId = row.mealId
            let res = await PtMemberApi.getselectPtMeal({ mmId: row.mmId });
            console.log(res.data);
            //判断是否成功
            if (res.success) {
                this.mealSJ = res.data
            }
        },
        //查看套餐详情窗口关闭事件 
        pageClose() {
            this.mealDialog.visible = false
        },
        //查看套餐详情窗口确认事件
        pageConfirm() {
            this.mealDialog.visible = false
        },
        //查看简介
        async synopsis(row) {
            await this.$myconfirm(row.synopsis)
        },
        //续费
        async renew(row) {
            let confirm = await this.$myconfirm("确定续费吗?")//await代表同步
            if (confirm) {
                //发送续费请求
                let res = await PtMemberApi.renewPtMember(row)
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search(this.pageNo, this.size)
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
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
    * 重置查询条件
    */
        resetValue() {
            //清空数据
            this.phone.memberPhone = "";
            //调用查询方法
            this.search()
        },






    },
}

</script>

<style lang="scss" scoped>

</style>
