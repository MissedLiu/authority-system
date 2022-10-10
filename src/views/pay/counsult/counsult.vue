<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="consult.consultPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow" v-if="hasPermission('pay:counsult:add')">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="consultName" label="用户姓名"></el-table-column>
            <el-table-column prop="consultAge" label="年龄"></el-table-column>
            <el-table-column prop="consultSex" label="性别" :formatter="playbackFormat"></el-table-column>
            <el-table-column prop="consultPhone" label="电话"></el-table-column>
            <el-table-column prop="consultTime" label="咨询时间"></el-table-column>
            <el-table-column prop="consultContent" label="咨询内容"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!--  添加和修改窗口 -->
        <system-dialog :title="consultDialog.title" :visible="consultDialog.visible" :width="consultDialog.width"
            :height="consultDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="consults" ref="consultForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="姓名" prop="consultName">
                        <el-input v-model="consults.consultName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="consultSex">
                        <el-select v-model="consults.consultSex" placeholder="请选择性别">
                            <el-option :value="1" label="男">男</el-option>
                            <el-option :value="0" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话" prop="consultPhone">
                        <el-input v-model="consults.consultPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="consultAge">
                        <el-input v-model="consults.consultAge"></el-input>
                    </el-form-item>
                    <el-form-item label="咨询内容" prop="consultContent">
                       <el-input v-model="consults.consultContent" :rows="10" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import counsultApi from '@/api/counsult';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'consultcord',
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
            consult: {
                consultPhone: "",//会员电话
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
             //验证
             mbrules: {
                consultName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                consultSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                consultPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },
                { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
                consultAge: [{ required: true, message: '请输入年龄', trigger: 'blur' },
                { pattern: new RegExp(/^(?:[1-9][0-9]?|1[01][0-9]|100)$/), message: '请正确输入年龄' }],
                consultContent: [{ required: true, message: '请输入咨询内容', trigger: 'blur' }],
    
            },
            consultDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 400,//窗口宽度
                height: 300//窗口高度
            },
                       // 添加窗口绑定数据
            consults: {
                consultId:"",
                consultName:"",
                consultSex:"",
                consultPhone:"",
                consultAge:"",
                consultContent:"",
            },

        }
    },
    created() {
        this.search();
    },
    methods: {
        playbackFormat(row, column) {
            if (row.consultSex == 0) {
                return '女'
            } else if (row.consultSex == 1) {
                return '男'
            }
        },
        //查询会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.consult.pageNo = pageNo
            //修改每页显示条数
            this.consult.pageSize = pageSize
            //发送查询请求
            let res = await counsultApi.findMemberConsultList(this.consult);
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
            //清空表单数据
            this.$restForm("consultForm", this.consult);
            //设置属性
            this.consultDialog.title = '新咨询记录',
            this.consultDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.consultDialog.visible = false
        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            this.$refs.consultForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    //添加事件
                     let res = await counsultApi.addMmeberConsult(this.consults)
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.consultDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })
        },

        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.consult.consultPhone = "";
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
