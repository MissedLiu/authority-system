<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.eeName" placeholder="请输入器材/物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow()">上报</el-button>
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
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="edId"
            default-expand-all>
            <el-table-column prop="edCode" label="器材/物品编码" />
            <el-table-column prop="eeName" label="器材/物品名称" />
            <el-table-column prop="eeTime" label="上报时间" />
            <el-table-column prop="eeContent" label="故障原因" />
            <el-table-column prop="beizhu" label="备注" />
            <el-table-column prop="sname" label="上报人" />
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleToEm(scope.row)">
                        修理完成 </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 报修弹窗 -->
        <system-dialog :title="repairDialog.title" :visible="repairDialog.visible" :width="repairDialog.width"
            :height="repairDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="repair" ref="repairForm" label-width="80px" :inline="true" size="small">

                    <el-form-item label="器材名" prop="eeName">
                        <el-input v-model="repair.eeName"></el-input>
                    </el-form-item>
                    <el-form-item label="器材编码" prop="edCode">
                        <el-input v-model="repair.edCode"></el-input>
                    </el-form-item>
                    <el-form-item label="故障原因" prop="eeContent">
                        <el-input v-model="repair.eeContent"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="beizhu">
                        <el-input v-model="repair.beizhu"></el-input>
                    </el-form-item>
                    <el-form-item label="上报人" prop="sname">
                        <el-input v-model="repair.sname"></el-input>
                    </el-form-item>


                </el-form>
            </div>
        </system-dialog>

        <!-- 修理完成弹窗 -->
        <system-dialog :title="toEmDialog.title" :visible="toEmDialog.visible" :width="toEmDialog.width"
            :height="toEmDialog.height" @onClose="onClose" @onConfirm="toMaintenance">
            <div slot="content">
                <el-form :model="repair" ref="toEmForm" label-width="80px" :inline="true" size="small">

                    <el-form-item label="维修人" prop="empName">
                        <el-input v-model="repair.empName"></el-input>
                    </el-form-item>
                    <el-form-item label="维修情况" prop="resuIts">
                        <el-input v-model="repair.resuIts"></el-input>
                    </el-form-item>

                    <el-form-item label="维修方式" prop="emMethods">
                        <el-select v-model="repair.emMethods">
                            <el-option label="换件" value="1" />
                            <el-option label="外修" value="2" />
                            <el-option label="自修" value="0" />
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
        </system-dialog>

        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-main>

</template>

<script>
//导入department.js脚本文件
import repairApi from "@/api/repairApi"
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "repair",
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            searchModel: {
                eeName: "",//出库物品名
                pageNo: 1,
                pageSize: 10,
            },
            tableData: [],//表格数据

            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量

            //修理完成窗口
            toEmDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 170//窗口高度

            },
            //报修窗口
            repairDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 170//窗口高度

            },
            repair: {
                eeId: "",//上报编号
                edCode: "",//器材编码
                eeName: "",//物品名称
                eeTime: "",//登记时间
                eeContent: "",//故障原因
                beizhu: "",//备注
                sname: "",//上报人
                emMethods: "",//维修方式
                empName: "",//维修人
                resuIts: ""//维修情况
            },

        }
    },
    //初始化时调用
    created() {
        this.search();
    },
    methods: {
        /**
   * 重置查询条件
   */
        resetValue() {
            //清空数据
            this.searchModel.eeName = "";
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

        /**
         * 查询报修记录列表
         */
        async search(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo
            //修改每页显示条数
            this.searchModel.pageSize = pageSize
            //发送查询请求
            repairApi.getRepairList(this.searchModel).then(res => {
                if (res.success) {
                    this.tableData = res.data.records
                    this.total = res.data.total;
                }
            })

            //判断是否成功
        },



        openAddwindow() {
            this.$restForm("toEmForm", this.repair);
            //设置属性
            this.repairDialog.title = '上报损坏物品',
                this.repairDialog.visible = true
        },

        onConfirm() {
            this.$refs.repairForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    await repairApi.addRepair(this.repair).then(res=>{
                        if(res.success){
                          //提示成功
                          this.$message.success(res.message)
                                //刷新数据
                                this.search()
                                  //关闭窗口事件
                                this.repairDialog.visible=false
                            }else{
                                //提示失败
                                  this.$message.error(res.message)
                                 
                            }
                    })

                }
            })
        },
        //窗口关闭事件
        onClose() {
            this.repairDialog.visible = false
            this.toEmDialog.visible = false
        },

        handleToEm(row) {
            this.$objCopy(row, this.repair)
            //设置窗口标题
            this.toEmDialog.title = "请输入修理信息"
            //显示窗口
            this.toEmDialog.visible = true
        },

        async toMaintenance() {
            console.log(this.repair)
            let res = await repairApi.toEm(this.repair)
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //刷新数据
                this.search(this.pageNo, this.pageSize)
                //关闭弹窗
                this.toEmDialog.visible = false
            } else {
                //提示失败
                this.$message.error(res.message)
            }

        },
        //删除按钮实现
        async handleDelete(row) {
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")
            if (confirm) {
                //发送删除请求
                let res = await repairApi.deleteRepair({ eeId: row.eeId })
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
            this.search(this.pageNo, this.pageSize)
        },

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