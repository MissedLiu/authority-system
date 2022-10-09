<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别" :formatter="playbackFormat"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
            <el-table-column prop="memberDate" label="出生日期"></el-table-column>
            <el-table-column prop="memberAge" label="年龄"></el-table-column>
            <el-table-column prop="memberAddress" label="地址"></el-table-column>
            <el-table-column prop="memberType" label="状态" :formatter="playbackFormat2"></el-table-column>
            <el-table-column prop="createTime" label="注册时间"></el-table-column>
            <el-table-column label="操作" width="350" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" plain type="primary" size="small"
                        @click="selectCommonMeal(scope.row)">
                        修改
                    </el-button>
                    <el-button icon="el-icon-plus" plain type="warning" size="small" @click="upd(scope.row)">
                        加入黑名单
                    </el-button>
                    <el-button icon="el-icon-close" plain type="danger" size="small" @click="del(scope.row)">
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

        <!-- 添加和修改窗口 -->
        <system-dialog :title="ptmbDialog.title" :visible="ptmbDialog.visible" :width="ptmbDialog.width"
            :height="ptmbDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="member" ref="memberForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="会员姓名" prop="memberName">
                        <el-input v-model="member.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="会员性别" prop="memberSex">
                        <el-select v-model="member.memberSex" placeholder="请选择性别">
                            <el-option :value="1" label="男">男</el-option>
                            <el-option :value="0" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="memberDate">
                        <el-date-picker v-model="member.memberDate" type="datetime" style="width:180px"
                            placeholder="选择出生日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="member.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="memberAge">
                        <el-input v-model="member.memberAge"></el-input>
                    </el-form-item>
                    <el-form-item label="住址" prop="memberAddress">
                        <el-input v-model="member.memberAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="会员状态" prop="memberType">
                        <el-select v-model="member.memberType" placeholder="请选择会员状态">
                            <el-option :value="1" label="正式会员">正式会员</el-option>
                            <el-option :value="0" label="体验会员">体验会员</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 黑名单窗口 -->
        <system-dialog :title="blackDialog.title" :visible="blackDialog.visible" :width="blackDialog.width"
            :height="blackDialog.height" @onClose="Closeblack()" @onConfirm="Confirmblack()">
            <div slot="content">
                <el-form :model="black" ref="blackForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="拉黑原因" prop="why">
                        <el-input v-model="black.why"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import MemberApi from '@/api/member'
import BlackApi from '@/api/black'

//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'refinance',
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
            ptmbDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 400,//窗口宽度
                height: 400//窗口高度
            },
            //添加窗口绑定数据
            member: {
                memberId: "",//会员id
                memberName: "",//会员姓名
                memberSex: "",//会员性别
                memberDate: "",//出生日期
                memberPhone: "",//电话号码
                memberAge: "",//年龄
                memberAddress: "",//住址 
                memberType: "",//会员状态
            },
            //查询传递数据
            phone: {
                memberPhone: "",//电话号码
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //验证
            mbrules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                memberDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
                memberPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },{ pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
                memberAge: [{ required: true, message: '请输入年龄', trigger: 'blur' },{ pattern: new RegExp(/^(?:[1-9][0-9]?|1[01][0-9]|100)$/), message: '请正确输入年龄' }],
                memberAddress: [{ required: true, message: '请输入地址', trigger: 'blur' },{ pattern: new RegExp(/^[\u4e00-\u9fa5]{0,20}$/), message: '请正确输入地址' }],
                memberType: [{ required: true, message: '请选择会员状态', trigger: 'change' }],
                why: [{ required: true, message: '请输入原因', trigger: 'blur' }],
            },
            //黑名单的属性
            blackDialog: {
                title: "黑名单",//窗口标题
                visible: false,//是否显示窗口
                width: 500,//窗口宽度
                height: 100,//窗口高度

            },
            //黑名单传递参数
            black: {
                memberId: "",//会员id
                why: ""//原因
            },
        }
    },
    created() {
        this.search();
    },
    methods: {
        //查询会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.phone.pageNo = pageNo
            //修改每页显示条数
            this.phone.pageSize = pageSize
            //发送查询请求
            let res = await MemberApi.getMemberList(this.phone);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
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
        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.phone.memberPhone = "";
            //调用查询方法
            this.search()
        },
        //打开添加窗口
        openAddwindow() {
            //清空表单数据
            this.$restForm("memberForm", this.member);
            //设置属性
            this.ptmbDialog.title = '新增会员'
            this.ptmbDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.ptmbDialog.visible = false
        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            this.$refs.memberForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //判断添加和修改事件
                    if (this.member.memberId == "") {
                        //添加事件
                        res = await MemberApi.getAddMember(this.member)
                    } else {
                        //修改事件
                        res = await MemberApi.updataMemberByMemberPhone(this.member)
                    }

                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.ptmbDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })
        },

        //黑名单确认事件
         Confirmblack() {
            //进行表单验证
            this.$refs.blackForm.validate(async (valids) => {
                //提示是否确认
                if (valids) {
                    let confirm = await this.$myconfirm("确定加入黑名单?")//await代表同步
                    if (confirm) {
                        //发送请求
                        console.log("黑名单参数:", this.black);
                        let res = await BlackApi.updMemberState(this.black)
                        //判断是否发送成功
                        if (res.success) {
                            //提示成功
                            this.$message.success(res.message)
                            this.blackDialog.visible = false
                            //刷新数据
                            this.search(this.pageNo, this.pageSize)
                        } else {
                            //提示失败
                            this.$message.error(res.message)
                        }
                    }
                }
            })
        },

        //黑名单关闭
        Closeblack() {
            this.blackDialog.visible = false
        },

        //打开黑名单
        upd(row) {
            this.$restForm("blackForm", this.black);
            this.black.memberId = row.memberId
            this.blackDialog.visible = true
        },

        //根据会员id删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await MemberApi.delMemberByMemberId({ memberId: row.memberId })
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
        //打开修改窗口
        async selectCommonMeal(row) {
            //数据回显
            this.$objCopy(row, this.member);
            this.ptmbDialog.title = "修改"
            this.ptmbDialog.visible = true
            //this.member = row
        },
        //修改窗口关闭事件 
        pageClose() {
            this.ptmbDialog.visible = false
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
