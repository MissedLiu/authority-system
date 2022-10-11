<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="emp.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="prospectName" label="潜在用户姓名"></el-table-column>
            <el-table-column prop="prospectAge" label="年龄"></el-table-column>
            <el-table-column prop="prospectSex" label="性别"></el-table-column>
            <el-table-column prop="prospectPhone" label="电话"></el-table-column>
            <el-table-column prop="type" label="状态"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-plus" type="success" plain size="small" @click="addCallBack(scope.row)"
                        v-if="hasPermission('pay:prospect:payprospect')">
                        回访
                    </el-button>
                    <el-button icon="el-icon-edit-outline" type="primary" plain size="small"
                        @click="openProspectType(scope.row)"
                        v-if="hasPermission('prospects:prospects:editById')">
                        修改状态
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 回访窗口 -->
        <system-dialog :title="callBackDialog.title" :visible="callBackDialog.visible" :width="callBackDialog.width"
            :height="callBackDialog.height" @onClose="callBackClose()" @onConfirm="callBackConfirm()">
            <div slot="content">
                <el-form :model="callBack" ref="prospectFormXQ" label-width="80px" size="small" :inline="true"
                    :rules="rules">
                    <el-form-item label="回访内容" prop="callbackContent">
                        <el-input v-model="callBack.callbackContent" :rows="10" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <!-- 修改状态窗口 -->
        <system-dialog :title="callBackTypeDialog.title" :visible="callBackTypeDialog.visible"
            :width="callBackTypeDialog.width" :height="callBackTypeDialog.height" @onClose="callBackTypeClose()"
            @onConfirm="callBackTypeConfirm()">
            <div slot="content">
                <el-form :model="prospect" ref="prospectType" label-width="80px" size="small" :inline="true"
                    :rules="rules">
                    <el-form-item label="状态" prop="type">
                        <el-select v-model="prospect.type" placeholder="请选择状态">
                            <el-option :value="'普通意向'" label="普通意向客户"></el-option>
                            <el-option :value="'重点意向'" label="重点意向客户"></el-option>
                            <el-option :value="'无意向'" label="无意向客户"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import prospectListApi from '@/api/prospectlist';
import prospectApi from '@/api/prospect';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'prospectList',
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
                memberPhone: "",
                empId: this.$store.getters.userId,//账户id
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //验证
            rules: {
                callbackContent: [{ required: true, message: '回访内容不能未空', trigger: 'blur' }]
            },
            //回访框参数
            callBackDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 400,//窗口宽度
                height: 250//窗口高度
            },
            //回访数据参数
            callBack: {
                prospectId: "",
                callbackContent: ""
            },
            //修改框参数
            callBackTypeDialog: {
                title: "状态修改",//窗口标题
                visible: false,//是否显示窗口
                width: 200,//窗口宽度
                height: 100//窗口高度
            },
            //修改状态
            prospect: {
                type: "",
                prospectId: "",
            }
        }
    },
    created() {
        this.search();
    },
    methods: {

        //查询会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.emp.pageNo = pageNo
            //修改每页显示条数
            this.emp.pageSize = pageSize
            //发送查询请求
            let res = await prospectListApi.findProspectByEmpId(this.emp);
            console.log("res:", res);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //打开回访窗口
        addCallBack(row) {
            this.callBackDialog.title = "回访记录"
            this.callBack.prospectId = row.prospectId
            this.callBackDialog.visible = true
        },
        //关闭事件
        callBackClose() {
            this.callBackDialog.visible = false
        },
        //确认事件
        callBackConfirm() {
            //进行表单验证
            this.$refs.prospectFormXQ.validate(async (valid) => {
                if (valid) {
                    //发送请求
                    let res = await prospectListApi.addCallbackProspect(this.callBack);
                    //判断是否存在数据
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //清空输入框
                        this.callBack.callbackContent = ""
                        //关闭窗口事件
                        this.callBackDialog.visible = false
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })
        },
        //打开修改状态窗口
        openProspectType(row) {
            this.callBackTypeDialog.visible = true
            this.prospect.type = row.type
            this.prospect.prospectId = row.prospectId
        },
        //修改框关闭事件
        callBackTypeClose() {
            this.callBackTypeDialog.visible = false
        },
        //修改框确定事件
        async callBackTypeConfirm() {
            let res = await prospectApi.updProspectById(this.prospect);
            //判断是否存在数据
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //刷新数据
                this.search(this.pageNo, this.pageSize)
                //关闭窗口事件
                this.callBackTypeDialog.visible = false
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
            this.emp.memberPhone = "";
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
