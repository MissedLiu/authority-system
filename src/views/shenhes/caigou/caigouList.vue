<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">

            <el-form-item>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow(pageNo,pageSize)">待审批</el-button>
                <el-button type="primary" icon="el-icon-search" @click="getNotExecuted(pageNo,pageSize)">已审批</el-button>
            </el-form-item>
        </el-form>
        <!-- 
            data属性:表格数据
            border属性:表格边框
            stripe属性:表格斑马线
            row-key属性:行数据的key,用来优化table的渲染
            default-expand-all属性:默认展开树形表格数据
            tree-props属性:树形表格配置属性选型
         -->
        <div v-if="falg1">
            <el-table :data="tableData1" border stripe style="width: 100%; margin-bottom: 20px" row-key="planId"
                default-expand-all>
                <el-table-column prop="scheduleName" label="物品名称" />
                <el-table-column prop="scheduleType" label="物品类型" />
                <el-table-column prop="scheduleSupplier" label="供货名称" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="scheduleAddress" label="供货地址" />
                <el-table-column prop="scheduleNum" label="数量" />
                <el-table-column prop="schedulePrice" label="单价" />
                <el-table-column prop="brand" label="品牌" />
                <el-table-column prop="scheduleTime" label="创建时间" />
                <el-table-column prop="caigouShenhe.state" label="状态" />
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handle1(scope.row)" v-if="hasPermission('shenhes:caigou:cl')">
                            同意
                        </el-button>

                        <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete1(scope.row)" v-if="hasPermission('shenhes:caigou:cl')">拒绝
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页工具栏 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNo1" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="total1">
            </el-pagination>
        </div>
        <div v-if="falg2">
            <el-table :data="tableData2" border stripe style="width: 100%; margin-bottom: 20px" row-key="planId"
                default-expand-all>
                <el-table-column prop="scheduleName" label="名称" />
                <el-table-column prop="scheduleType" label="物品类型" />
                <el-table-column prop="scheduleSupplier" label="供货名称" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="scheduleAddress" label="供货地址" />
                <el-table-column prop="scheduleNum" label="数量" />
                <el-table-column prop="schedulePrice" label="单价" />
                <el-table-column prop="brand" label="品牌" />
                <el-table-column prop="scheduleTime" label="创建时间" />
                <el-table-column prop="caigouShenhe.state" label="状态" />
                <el-table-column label="操作2" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-close" type="danger" size="small"
                            @click="handle2(scope.row)" v-if="hasPermission('shenhes:caigou:delete')">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页工具栏 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNo2" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="total2">
            </el-pagination>
        </div>
    </el-main>

</template>

<script>
//导入department.js脚本文件
import caigouShenHeApi from "@/api/caigouShenHeApi"
//先导入systemDialog组件
// import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "plan",
    //注册组件
    // components: {
    //     SystemDialog
    // },
    data() {
        return {
            searchModel1: {
                shenheempId: "",//
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示条数
            },
            searchModel2: {
                shenheempId: "",//
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示条数
            },
            tableData1: [],//待审核表格数据
            tableData2: [],//已审核表格数据
            falg1: true,
            falg2: false,
            //分页组件所需的属性
            pageNo1: 1,//当前页码
            total1: 0,//数据总数量
            pageSize1: 10,//每页显示数量
            //分页组件所需的属性
            pageNo2: 1,//当前页码
            total2: 0,//数据总数量
            pageSize2: 10,//每页显示数量
            params:{
                id:"",
                scheduleId:"",
                shenheempId:"",
            
            }

        }
    },
    //初始化时调用
    created() {
        this.search1();
    },
    methods: {


        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize1 = size
            //调用查询方法
            this.search1(this.pageNo1, size)
        },

        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange(page) {
            //修改当前页码
            this.pageNo1 = page
            //调用查询方法
            this.search1(page, this.pageSize1)
        },

        /**
         * 查询采购计划列表
         */
        async search1(pageNo, pageSize) {
            //修改当前页码
            this.searchModel1.pageNo = pageNo
            //修改每页显示条数
            this.searchModel1.pageSize = pageSize
            this.searchModel1.shenheempId = this.$store.getters.userId;
            //发送查询请求
            let res = await caigouShenHeApi.findCaiGouShenHe(this.searchModel1)
            console.log("1", res.data)
            //判断是否成功
            if (res.success) {
                this.tableData1 = res.data.records
                this.total1 = res.data.total;
                for (let i = 0; i < res.data.records.length; i++) {
                    if( res.data.records[i].caigouShenhe.state==0){
                        res.data.records[i].caigouShenhe.state="待审"
                    }
                }
            }
        },
        //已审批事件
        async getNotExecuted(pageNo, pageSize) {
            this.falg2 = true
            this.falg1 = false
            //修改当前页码
            this.searchModel2.pageNo = pageNo
            //修改每页显示条数
            this.searchModel2.pageSize = pageSize
            this.searchModel2.shenheempId = this.$store.getters.userId;
            let res = await caigouShenHeApi.findCaiGouShenHetrue(this.searchModel2);
            if (res.success) {
                this.tableData2 = res.data.records
                this.total2 = res.data.total;
                for (let i = 0; i < res.data.records.length; i++) {
                    if( res.data.records[i].caigouShenhe.state==1){
                        res.data.records[i].caigouShenhe.state="已同意"
                    }else if(res.data.records[i].caigouShenhe.state==2){
                        res.data.records[i].caigouShenhe.state="已拒绝"
                    }
                }
            }
        },


        //待审批事件
        openAddwindow() {
            this.falg1 = true
            this.falg2 = false
        },
        //同意事件
       async handle1(row){
        this.params.id=row.caigouShenhe.id;
        this.params.scheduleId=row.caigouShenhe.scheduleId;
        this.params.shenheempId=row.caigouShenhe.shenheempId;
        let res=await caigouShenHeApi.agress(this.params)
        if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search1(this.pageNo1, this.pageSize1)
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            console.log(row)
        },
        //拒绝按钮实现
        async handleDelete1(row) {
            this.params.id=row.caigouShenhe.id;
             this.params.scheduleId=row.caigouShenhe.scheduleId;
             this.params.shenheempId=row.caigouShenhe.shenheempId;
        let res=await caigouShenHeApi.refuse(this.params)
        if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search1(this.pageNo1, this.pageSize1)
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
        },
        //删除事件
       async handle2(row){
        this.params.id=row.caigouShenhe.id;
             this.params.scheduleId=row.caigouShenhe.scheduleId;
             this.params.shenheempId=row.caigouShenhe.shenheempId;
             let confirm = await this.$myconfirm("确定要删除该数据嘛?"); //await代表同步
      if (confirm) {

     
        let res=await caigouShenHeApi.delete(this.params)
        if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.getNotExecuted(this.pageNo2, this.pageSize2)
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        }


    }

}


</script>
    
<style lang="scss" scoped>
::v-deep .el-tree {
    .el-tree-node {
        position: relative;
        padding-left: 10px;
    }

    .el-tree-node__children {
        padding-left: 20px;
    }

    .el-tree-node :last-child:before {
        height: 40px;
    }

    .el-tree>.el-tree-node:before {
        border-left: none;
    }

    .el-tree>.el-tree-node:after {
        border-top: none;
    }

    .el-tree-node:before,
    .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    .tree :first-child .el-tree-node:before {
        border-left: none;
    }

    .el-tree-node:before {
        border-left: 1px dotted #d9d9d9;
        bottom: 0px;
        height: 100%;
        top: -25px;
        width: 1px;
    }

    .el-tree-node:after {
        border-top: 1px dotted #d9d9d9;
        height: 20px;
        top: 14px;
        width: 24px;
    }

    .el-tree-node__expand-icon.is-leaf {
        width: 8px;
    }

    .el-tree-node__content>.el-tree-node__expand-icon {
        display: none;
    }

    .el-tree-node__content {
        line-height: 30px;
        height: 30px;
        padding-left: 10px !important;
    }
}

::v-deep .el-tree>div {
    &::before {
        display: none;
    }

    &::after {
        display: none;
    }
}
</style>