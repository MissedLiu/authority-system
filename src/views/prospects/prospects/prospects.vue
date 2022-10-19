<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.prospectPhone"></el-input>
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
            <el-table-column prop="prospectName" label="姓名"></el-table-column>
            <el-table-column prop="prospectSex" label="性别"></el-table-column>
            <el-table-column prop="prospectPhone" label="电话"></el-table-column>
            <el-table-column prop="prospectAge" label="年龄"></el-table-column>
            <el-table-column prop="type" label="状态"></el-table-column>
            <el-table-column prop="prospectIs" label="是否分配" :formatter="playbackFormat"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button  size="small" icon="el-icon-edit-outline" plain type="success"
                        @click="selectCommonMeal(scope.row)" v-if="hasPermission('pay:counsult:add')">
                        修改
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" plain size="small" @click="del(scope.row)"
                    v-if="hasPermission('pay:counsult:add')">
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

        <!--  添加和修改窗口 -->
        <system-dialog :title="ptmbDialog.title" :visible="ptmbDialog.visible" :width="ptmbDialog.width"
            :height="ptmbDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="prospect" ref="prospectForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="姓名" prop="prospectName">
                        <el-input v-model="prospect.prospectName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="prospectSex">
                        <el-select v-model="prospect.prospectSex" placeholder="请选择性别">
                            <el-option :value="'男'" label="男">男</el-option>
                            <el-option :value="'女'" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话" prop="prospectPhone">
                        <el-input v-model="prospect.prospectPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="prospectAge">
                        <el-input v-model="prospect.prospectAge"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="prospectAddress">
                        <el-input v-model="prospect.prospectAddress"></el-input>
                    </el-form-item>
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
import prospectsApi from '@/api/prospect'


//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'prospects',
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
                height: 300//窗口高度
            },
            // 添加窗口绑定数据
            prospect: {
                prospectId: "",
                prospectName: "",
                prospectSex: "",
                prospectPhone: "",
                prospectAge: "",
                prospectAddress: "",
                type: "",
            },
            //查询传递数据
            phone: {
                prospectPhone: "",//电话号码
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //验证
            mbrules: {
                prospectName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                prospectSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                prospectPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },
                { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
                prospectAge: [{ required: true, message: '请输入年龄', trigger: 'blur' },
                { pattern: new RegExp(/^(?:[1-9][0-9]?|1[01][0-9]|100)$/), message: '请正确输入年龄' }],
                prospectAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
                type: [{ required: true, message: '请选择状态', trigger: 'blur' }],

            },
        }
    },
    created() {
        this.search();
    },
    methods: {
        playbackFormat(row, column) {
            if (row.prospectIs == 0) {
                return '未分配'
            } else if (row.prospectIs == 1) {
                return '已分配'
            }
        },
        //查询会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.phone.pageNo = pageNo
            //修改每页显示条数
            this.phone.pageSize = pageSize
            //发送查询请求
            let res = await prospectsApi.findProspect(this.phone);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.phone.prospectPhone = "";
            //调用查询方法
            this.search()
        },
        //打开添加窗口
        openAddwindow() {
            //清空表单数据
            this.$restForm("prospectForm", this.prospect);
            //设置属性
            this.ptmbDialog.title = '新增潜在用户',
                this.ptmbDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.ptmbDialog.visible = false

        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            this.$refs.prospectForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //判断添加和修改事件
                    if (this.prospect.prospectId == "") {
                        //添加事件
                        res = await prospectsApi.addProspect(this.prospect)
                    } else {
                        //修改事件
                        res = await prospectsApi.updProspect(this.prospect)
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



        //根据会员id删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await prospectsApi.deleteProspect({ prospectId: row.prospectId })
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
            this.$objCopy(row, this.prospect);
            this.ptmbDialog.title = "修改"
            this.ptmbDialog.visible = true
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
