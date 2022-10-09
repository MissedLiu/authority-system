<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.memberName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>

            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="userList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
            <el-table-column prop="memberId" label="会员编号" width="100" align="center"></el-table-column>
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberType" label="会员类型"></el-table-column>
            <el-table-column prop="createTime" label="访谈日期"></el-table-column>
            <el-table-column prop="interview" label="访谈内容"></el-table-column>
            <el-table-column label="操作" align="center" width="290">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-main>
</template>

<script>
import interviewApi from "@/api/interview"
export default {
    data() {
        return {
            searchModel: {
                memberName: "",
                empId: "",
                pageNo: 1,
                pageSize: 10,
            },
            pageNo: 1,
            pageSize: 10,
            total: 0,
            userList: [],
        }
    },
    created() {
        this.search()
    },
    mounted() {
        this.$nextTick(() => {
            this.tableHeight = window.innerHeight - 220
        })
    },
    methods: {
        async search(pageNo,pageSize) {
            this.searchModel.pageNo=pageNo
            this.searchModel.pageSize=pageSize
            this.searchModel.empId = this.$store.getters.userId;
            let res = await interviewApi.listInterview(this.searchModel);
            if (res.success) {
                this.userList = res.data.records
                this.total = res.data.total
                console.log(res.data);
                for (let i = 0; i < res.data.records.length; i++) {
                    res.data.records[i].memberType = res.data.records[i].memberType == 0 ? "体验会员" : "正式会员";
                }

            }
        },
        resetValue() {
            this.searchModel.memberName=""
            this.search()
        },

        /**
  * 当每页数量发生变化时触发该事件
  */
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
        //删除功能
       async handleDelete(row){
          console.log(row)
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res=await interviewApi.delete({id:row.interviewId})
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search(this.pageNo,this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }

            }
        },
    }
}
</script>

<style>

</style>