<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="emp.empPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入姓名" v-model="emp.empName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="empName" label="教练姓名" align="center"></el-table-column>
            <el-table-column prop="empAge" label="年龄" align="center"></el-table-column>
            <el-table-column prop="empSex" label="性别" align="center"></el-table-column>
            <el-table-column prop="empPhone" label="电话" align="center"></el-table-column>
            <el-table-column prop="empAddress" label="住址" align="center"></el-table-column>
            <el-table-column prop="emil" label="邮箱" align="center"></el-table-column>
            <el-table-column prop="qq" label="qq" align="center"></el-table-column>
            <el-table-column prop="weix" label="微信" align="center"></el-table-column>
            <el-table-column label="操作" width="420" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline"  plain  type="primary" @click="openupdwindow(scope.row)"
                    v-if="hasPermission('coachs:coach:edit')">修改
                    </el-button>
                    <el-button type="success" plain icon="el-icon-edit-outline"  @click="openPtMealWindow(scope.row)"
                    v-if="hasPermission('coachs:coach:sjmeal')">分配私教套餐
                    </el-button>
                    <el-button icon="el-icon-edit-outline" type="warning" plain @click="openTeamMealWindow(scope.row)"
                    v-if="hasPermission('coachs:coach:tcmeal')">分配团操套餐
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!--  修改窗口 -->
        <system-dialog :title="coachDialog.title" :visible="coachDialog.visible" :width="coachDialog.width"
            :height="coachDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="updEmp" ref="coachForm" :rules="rules" label-width="80px" size="small">
                    <el-form-item label="姓名" prop="empName">
                        <el-input v-model="updEmp.empName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="empSex">
                        <el-select v-model="updEmp.empSex" placeholder="请选择性别">
                            <el-option :value="'男'" label="男">男</el-option>
                            <el-option :value="'女'" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话" prop="empPhone">
                        <el-input v-model="updEmp.empPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="empAge">
                        <el-input v-model="updEmp.empAge"></el-input>
                    </el-form-item>
                    <el-form-item label="住址" prop="empAddress">
                        <el-input v-model="updEmp.empAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="updEmp.emil" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="qq">
                        <el-input v-model="updEmp.qq" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input v-model="updEmp.weix" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="synopsis">
                        <el-input v-model="updEmp.synopsis" :rows="10" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 分配私教套餐框 -->
        <system-dialog :title="ptMealDialog.title" :visible=" ptMealDialog.visible" :width=" ptMealDialog.width"
            :height="ptMealDialog.height" @onClose="ptMealClose" @onConfirm="ptMealConfirm">
            <div slot="content">
                <el-table border  ref="ptMealTable" :data="ptMealData" stripe
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="套餐编号" align="center" prop="ptId">
                    </el-table-column>
                    <el-table-column label="套餐名称" align="center" prop="ptName">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="ptPrice">
                    </el-table-column>
                    <el-table-column label="套餐时长" align="center" prop="ptTime">
                    </el-table-column>
                </el-table>
            </div>

        </system-dialog>

        <!-- 分配团操套餐框 -->
        <system-dialog :title="teamMealDialog.title" :visible=" teamMealDialog.visible" :width=" teamMealDialog.width"
            :height="teamMealDialog.height" @onClose="teamMealClose" @onConfirm="teamMealConfirm">
            <div slot="content">
                <el-table border  ref="teamMealTable" :data="teamMealData" stripe
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="套餐编号" align="center" prop="teamId">
                    </el-table-column>
                    <el-table-column label="套餐名称" align="center" prop="teamName">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="teamPrice">
                    </el-table-column>
                    <el-table-column label="套餐时长" align="center" prop="teamTime">
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import CoachApi from '@/api/coachList'
import ptMemberApi from '@/api/ptMember'
import teamMemberApi from '@/api/teamMember'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'coach',
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
            tableData: [],//表格数据列表
            emp: {
                empPhone: "",//教练电话
                empName:"",
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            rules: {
                synopsis: [{ required: true, trigger: 'blur', message: '简介不能为空' }],
                empName: [{ required: true, trigger: 'blur', message: '请填写教练姓名' }],
                empAge: [{ required: true, trigger: 'blur', message: '请输入年龄' }, { pattern: new RegExp(/^(?:[1-9][0-9]?|1[01][0-9]|100)$/), message: '请正确输入年龄' }],
                empPhone: [{ required: true, trigger: 'blur', message: '请输入电话' }, { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
                empSex: [{ required: true, trigger: 'change', message: '请选择性别' }],
                empAddress: [{ required: true, trigger: 'blur', message: '请输入住址' }, { pattern: new RegExp(/^[\u4e00-\u9fa5]{0,20}$/), message: '请正确输入地址' }]
            },
            coachDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 500,//窗口宽度
                height: 400//窗口高度
            },
            // 修改窗口绑定数据
            updEmp: {
                empId: "",//员工编号
                empName: "",//员工姓名
                empAge: "",//员工年龄
                empSex: "",//员工性别
                empAddress: "",//员工住址
                departmentId: "",//员工所属部门id
                departmentName: "",//员工所属部门编号
                empPhone: "",//员工电话号码
                emil: "",//员工邮箱
                qq: "",//员工qq
                weix: "",//员工微信
                station: "",//员工岗位
                synopsis: "",//员工简介
                avatar: "",//员工头像
            },

            //私教套餐窗口
            ptMealDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 700,//窗口宽度
                height: 500//窗口高度
            },
            //私教套餐数据
            ptMealData: [],
            //教练私教数据
            ptAndEmpDate: [],
            //私教传入入参数
            ptAndEmp: {
                empId: "",
                ptMealId: [],
            },
            empId: "",

            //团操套餐窗口
            teamMealDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 700,//窗口宽度
                height: 500//窗口高度
            },
            //团操套餐数据
            teamMealData: [],
            //教练团操数据
            teamAndEmpDate: [],
            //团操传入入参数
            teamAndEmp: {
                empId: "",
                teamMealId: [],
            },

        }
    },
    created() {
        this.search();
    },
    methods: {
        //查询员工列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.emp.pageNo = pageNo
            //修改每页显示条数
            this.emp.pageSize = pageSize
            //发送查询请求
            let res = await CoachApi.findCoachList(this.emp);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        /**
            * 复选框选中事件
            * @param  rows 
            */
        handleSelectionChange(rows) {
            //拿到选中的ID 值
            this.ptAndEmp.ptMealId = rows.map(item => item.ptId);
            console.log(this.ptAndEmp.ptMealId);
            console.log(this.ptAndEmp.empId);
        },
        /**
    * 复选框选中事件
    * @param  rows 
    */
        handleSelectionChange2(rows) {
            //拿到选中的ID 值
            this.teamAndEmp.teamMealId = rows.map(item => item.teamId);
        },


        //打开修改窗口
        openupdwindow(row) {
            //数据回显
            this.$objCopy(row, this.updEmp); //将当前编辑的数据复制到user对象中
            //设置属性
            this.coachDialog.title = '修改教练基本信息',
                this.coachDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.coachDialog.visible = false
        },
        // //窗口确认事件
        async onConfirm() {
            //进行表单验证
            this.$refs.coachForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    //添加事件
                    let res = await CoachApi.updateEmp(this.updEmp)
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.coachDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })

        },

        //打开分配私教套餐窗口
        async openPtMealWindow(row) {
            this.ptMealDialog.title = "私教套餐分配"

            this.ptMealDialog.visible = true
            //给新增时参数赋值            
            this.ptAndEmp.empId = row.empId
            console.log("empid=", row.empId);
            //查询时新增参数
            this.empId = row.empId
            //查询私教套餐
            let rew = await ptMemberApi.getPtMealList();
            console.log("ptMeal=", rew.data);
            if (rew.success) {
                this.ptMealData = rew.data
            }
            //通过empid查询私教教练关联表数据
            let emps = await CoachApi.findPtAndEmp({ empId: this.empId });
            console.log("emps=", emps.data);
            if (emps.success) {
                this.ptAndEmpDate = emps.data
                this.ptAndEmpDate.forEach((key) => {
                    //套餐
                    this.ptMealData.forEach((item) => {
                        console.log(key)
                        console.log(item)
                        console.log(item.ptId)
                        if (key.ptId === item.ptId) {
                            //如果相等则复选框选中
                            this.$refs.ptMealTable.toggleRowSelection(item, true)
                        }
                    })
                })
            }
        },
        //取消分配私教套餐窗口
        ptMealClose() {
            this.ptMealDialog.visible = false
        },
        //确定分配私教套餐窗口
        async ptMealConfirm() {
            //发送请求
            let res = await CoachApi.addEmpAndPtMeal(this.ptAndEmp);
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //关闭窗口事件
                this.ptMealDialog.visible = false
            } else {
                //提示失败
                this.$message.error(res.message)
            }
        },





        //打开分配团操套餐窗口
        async openTeamMealWindow(row) {
            this.teamMealDialog.title = "团操套餐分配"

            this.teamMealDialog.visible = true
            //给新增时参数赋值            
            this.teamAndEmp.empId = row.empId
            console.log("empid=", row.empId);
            //查询时新增参数
            this.empId = row.empId
            //查询团操套餐
            let rew = await teamMemberApi.getTeamMealList();
            console.log("teamMeal=", rew.data);
            if (rew.success) {
                this.teamMealData = rew.data
            }
            //通过empid查询团操教练关联表数据
            let emps = await CoachApi.findTeamAndEmp({ empId: this.empId });
            console.log("emps=", emps.data);
            if (emps.success) {
                this.teamAndEmpDate = emps.data
                this.teamAndEmpDate.forEach((key) => {
                    //套餐
                    this.teamMealData.forEach((item) => {
                        console.log(key)
                        console.log(item)
                        console.log(item.teamId)
                        if (key.teamId === item.teamId) {
                            //如果相等则复选框选中
                            this.$refs.teamMealTable.toggleRowSelection(item, true)
                        }
                    })
                })
            }
        },
        //取消分配团操套餐窗口
        teamMealClose() {
            this.teamMealDialog.visible = false
        },
        //确定分配团操套餐窗口
        async teamMealConfirm() {
            //发送请求
            let res = await CoachApi.addEmpAndTeamMeal(this.teamAndEmp);
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //关闭窗口事件
                this.teamMealDialog.visible = false
            } else {
                //提示失败
                this.$message.error(res.message)
            }
        },

        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.emp.empPhone = "";
            this.emp.empName="";
            //调用查询方法
            this.search()
        },
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
    },
}

</script>

<style lang="scss" scoped>

</style>
