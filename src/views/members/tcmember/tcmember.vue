<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form
            ref="searchForm"
            label-width="80px"
            :inline="true"
            size="small"
        >
            <el-form-item>
                <el-input placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search">查询</el-button>
                <el-button icon="el-icon-refresh-right">重置</el-button>
                <el-button type="success" icon="el-icon-plus">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children' }"
        >
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别"></el-table-column>
            <el-table-column prop="memberAge" label="会员年龄"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
            <el-table-column prop="memberDate" label="出生日期"></el-table-column>
            <el-table-column prop="memberAddress" label="地址"></el-table-column>
            <el-table-column prop="memberType" label="状态"></el-table-column>
           
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-edit-outline"
                        type="primary"
                        size="small"
                        @click="ss(scope.row.memberId)"
                    >
                    查看套餐
                    </el-button>
                    <el-button
                        icon="el-icon-edit-outline"
                        type="primary"
                        size="small"
                        @click=""
                    >
                    编辑
                    </el-button>
                    <el-button
                        icon="el-icon-close"
                        type="danger"
                        size="small"
                        @click=""
                    >
                    删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-main>
</template>

<script>
import MemberApi from '@/api/member'

    export default {
        name: 'department',
        data() {
            return {
                tableData: [],//表格数据列表
                searchModel:{
                    memberType:"团操",
                },
            }
        },
        created(){
            this.search();
        },
        methods: {
            async search() {
                //发送查询请求
                let res = await MemberApi.getPtMemberList(this.searchModel);
                console.log(res);
                //判断是否存在数据
                if (res.success) {
                    //获取数据
                    this.tableData = res.data;
                    for(let i=0;i<res.data.length;i++){
                        res.data[i].memberSex=res.data[i].memberSex==0 ? '女':'男'
                        res.data[i].memberType=res.data[i].memberType==0 ? '体验会员':'正式会员'
                    }
                }
            },
            async ss(id){
                console.log(id);
            }

        },
    }

</script>

<style lang="scss" scoped></style>
