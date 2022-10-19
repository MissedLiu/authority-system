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
                <el-select v-model="phone.mealId" placeholder="请选择套餐">
                    <el-option v-for="item in ptMeal" :key="item.cmId" :label="item.cmName" :value="item.cmId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow()"
                    v-if="hasPermission('members:ptmember:add')">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名" align="center"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别" :formatter="playbackFormat" align="center"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话" align="center"></el-table-column>
            <el-table-column prop="memberAddress" label="地址" align="center"></el-table-column>
            <el-table-column prop="memberType" label="状态" :formatter="playbackFormat2" align="center"></el-table-column>
            <el-table-column label="套餐操作" width="280" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" plain type="primary" size="small"
                        @click="selectCommonMeal(scope.row)" v-if="hasPermission('members:ptmember:xiangqing')">
                        详情
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
                    <el-form-item label="套餐选择" prop="mealId" :readonly="true" @click.native="openCommonMealWindow()">
                        <el-input v-model="member.mealName"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 选择套餐的窗口 -->
        <system-dialog :title="parentDialog.title" :visible="parentDialog.visible" :width="parentDialog.width"
            :height="parentDialog.height" @onClose="onParentClose()" @onConfirm="onParentConfirm()">
            <div slot="content">
                <el-table border :data="mealList">
                    <el-table-column label="编号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column label="套餐名称" align="center" prop="cmName">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="cmPrice">
                    </el-table-column>
                    <el-table-column label="持续时间" align="center" prop="cmTime">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" plain icon="el-icon-plus" @click="addMmId(scope.row)">选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

        <!-- 查看详情窗口 -->
        <system-dialog :title="mealDialog.title" :visible="mealDialog.visible" :width="mealDialog.width"
            :height="mealDialog.height" @onClose="pageClose()" @onConfirm="pageConfirm()">
            <div slot="content">
                <el-table border :data="mealSJ">
                    <el-table-column label="套餐名称" align="center" prop="mealName">
                    </el-table-column>
                    <el-table-column label="套餐类型" align="center" prop="mealType">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="mealPrice">
                    </el-table-column>
                    <el-table-column label="套餐时长" align="center" prop="mealTime">
                    </el-table-column>
                    <el-table-column label="办理时间" align="center" prop="mmTime">
                    </el-table-column>
                    <el-table-column label="到期时间" align="center" prop="mmDate">
                    </el-table-column>
                    <el-table-column label="到期状态" align="center" :formatter="time">
                    </el-table-column>
                    <el-table-column label="套餐操作" width="280" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" plain icon="el-icon-plus" size="small" @click="renew(scope.row)">
                                续费
                            </el-button>
                            <el-button icon="el-icon-close" plain type="danger" size="small" @click="del(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import CommonMember from '@/api/commonMember'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'ptmember',
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
            ptMeal: [],//套餐查询数据
            mealList: [],//套餐数据
            mealSJ: [],//详情数据
            memberId: {},
            //查询参数
            phone: {
                memberPhone: "",
                memberName: "",
                mealId: "",
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //新增窗口绑定数据（传给后端的数据），
            member: {
                memberName: "",//会员姓名
                memberPhone: "",//电话号码
                mealId: "",//套餐编号
                mealName: "",//套餐名称
            },
            //验证
            mbrules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },
                { pattern: new RegExp(/^((1[3456789]\d{9}))$/), message: '请正确输入电话号码' }],
                mealId: [{ required: true, message: '请选择套餐', trigger: 'change' }],
            },
            //新增窗口属性
            ptmbDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 350,//窗口宽度
                height: 250//窗口高度
            },
            //选择套餐的窗口属性
            parentDialog: {
                title: "选择套餐",//窗口标题
                visible: false,//是否显示窗口
                width: 600,//窗口宽度
                height: 500//窗口高度
            },
            //套餐详情的属性
            mealDialog: {
                title: "套餐详情",//窗口标题
                visible: false,//是否显示窗口
                width: 1000,//窗口宽度
                height: 800//窗口高度
            },
        }
    },
    created() {
        this.search();
        this.selctMeal();
    },
    methods: {
        //查询普通会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.phone.pageNo = pageNo
            //修改每页显示条数
            this.phone.pageSize = pageSize
            //发送查询请求
            let res = await CommonMember.getFindCommentMemberList(this.phone);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //查询套餐列表
        async selctMeal() {
            let res = await CommonMember.getCommenMealList();
            if (res.success) {
                this.ptMeal = res.data
            }
        },
        //打开添加窗口
        openAddwindow() {
            this.$restForm("memberForm", this.member);
            //设置属性
            this.ptmbDialog.title = '新增普通会员',
                this.ptmbDialog.visible = true
        },
        //添加窗口关闭事件
        onClose() {
            this.ptmbDialog.visible = false
        },
        //添加窗口确认事件
        onConfirm() {
            //进行表单验证
            this.$refs.memberForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //发送添加请求
                    res = await CommonMember.getAddCommonMember(this.member)
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
        async openCommonMealWindow() {
            this.parentDialog.visible = true
            let res = await CommonMember.getCommenMealList();
            //判断是否成功
            if (res.success) {
                this.mealList = res.data
            }
        },
        //套餐选择取消关闭事件 
        onParentClose() {
            this.parentDialog.visible = false
        },
        //套餐选择确认事件
        onParentConfirm() {
            this.parentDialog.visible = false
        },
        //选择套餐
        addMmId(row) {
            this.member.mealId = row.cmId
            this.member.mealName = row.cmName
            this.parentDialog.visible = false
        },
        //查看套餐详情窗口
        async selectCommonMeal(row) {
            //通过会员id查询办理的私教套餐
            let res = await CommonMember.findCommonByMemberId({ memberId: row.memberId })
            this.mealSJ = res.data
            //储存memberId
            this.memberId = row.memberId
            this.mealDialog.visible = true
        },
        //查看套餐详情窗口关闭事件 
        pageClose() {
            this.mealDialog.visible = false
        },
        //查看套餐详情窗口确认事件
        pageConfirm() {
            this.mealDialog.visible = false
        },
        //根据会员办理套餐id删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await CommonMember.delCommonMemberById({ mmId: row.mmId })
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search(this.pageNo, this.size)
                    //关闭窗口
                    this.mealDialog.visible = false
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        },
        //续费
        async renew(row) {
            row.memberId = this.memberId;
            let confirm = await this.$myconfirm("确定续费吗?")//await代表同步
            if (confirm) {
                //发送续费请求
                let res = await CommonMember.renewCommonMember(row)
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search(this.pageNo, this.size)
                    //关闭窗口
                    this.mealDialog.visible = false
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        },
        //转换
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
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.phone.memberPhone = ""
            this.phone.memberName = ""
            this.phone.mealId = ""
            //调用查询方法
            this.search()
        },
    }
}


</script>

<style lang="scss" scoped>

</style>
