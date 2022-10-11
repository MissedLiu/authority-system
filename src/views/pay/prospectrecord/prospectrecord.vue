<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="prospect.prospectPhone"></el-input>
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
            <el-table-column prop="columnTime" label="回访时间"></el-table-column>
            <el-table-column prop="callbackContent" label="回访内容" width="500"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" plain size="small" @click="del(scope.row)"
                        v-if="hasPermission('pay:prospectrecord:delete')">
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

    </el-main>
</template>

<script>
import prospectcordApi from '@/api/prospectcord';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'prospectcord',
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
            prospect: {
                prospectPhone: "",//会员电话
                empId: this.$store.getters.userId,//账户id
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
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
            this.prospect.pageNo = pageNo
            //修改每页显示条数
            this.prospect.pageSize = pageSize
            //发送查询请求
            let res = await prospectcordApi.findProspectByEmpId(this.prospect);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
         //删除
         async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该记录吗?")//await代表同步
            if (confirm) {
                //发送删除请求
                console.log("ssssssssssssss",row);
                let res = await prospectcordApi.deleteProspectCord({callbackId : row.callbackId})
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


        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.prospect.prospectPhone = "";
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
