<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.edName" placeholder="请输入器材/物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow()"
                    v-if="hasPermission('equipments:details:add')">新增</el-button>
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
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="eeId"
            default-expand-all>
            <el-table-column prop="stockinId" label="器材/物品编号" />
            <el-table-column prop="edName" label="器材/物品名称" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="edTime" label="开始使用时间" />
            <el-table-column prop="edCode" label="器材标识编码" />
            <el-table-column prop="beizhu" label="备注" />
            <el-table-column prop="edState" label="状态" />
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)"
                        v-if="hasPermission('equipments:details:edit') && scope.row.edState!='无法使用'">编辑
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)"
                        v-if="hasPermission('equipments:details:delete')">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增器材使用记录 -->
        <system-dialog :title="detailsDialog.title" :visible="detailsDialog.visible" :width="detailsDialog.width"
            :height="detailsDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="details" ref="detailsForm" :rules="rules" label-width="80px" :inline="true"
                    size="small">
                    <el-form-item label="器材名称" prop="edName">
                        <el-input v-model="details.edName"></el-input>
                    </el-form-item>

                    <el-form-item label="品牌" prop="brand">
                        <el-input v-model="details.brand"></el-input>
                    </el-form-item>

                    <el-form-item label="器材编码" prop="edCode">
                        <el-input v-model="details.edCode"></el-input>
                    </el-form-item>

                    <el-form-item label="备注" prop="beizhu">
                        <el-input v-model="details.beizhu"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 编辑器材状态、备注、标识编码 -->
        <system-dialog :title="editDetailsDialog.title" :visible="editDetailsDialog.visible"
            :width="editDetailsDialog.width" :height="editDetailsDialog.height" @onClose="onClose"
            @onConfirm="editDetails">
            <div slot="content">
                <el-form :model="details" ref="detailsForm" :rules="rules" label-width="80px" :inline="true"
                    size="small">
                    <el-form-item label="器材编码" prop="edCode">
                        <el-input v-model="details.edCode"></el-input>
                    </el-form-item>

                    <el-form-item label="备注" prop="备注">
                        <el-input v-model="details.beizhu"></el-input>
                    </el-form-item>

                    <el-form-item label="状态" prop="edState">
                        <el-radio-group v-model="details.edState">
                            <el-radio-button label="使用中" />
                            <el-radio-button label="未使用" />
                        </el-radio-group>

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
import detailsApi from "@/api/detailsApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "details",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            searchModel: {
                edName: "", //出库物品名
                pageNo: 1,
                pageSize: 10,
            },
            tableData: [], //表格数据

            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量

            detailsDialog: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 600, //窗口宽度
                height: 120, //窗口高度
            },

            editDetailsDialog: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 350, //窗口宽度
                height: 200, //窗口高度
            },
            details: {
                edId: "", //器材使用详情id
                stockinId: "", //物品编号
                edName: "", //物品名称
                brand: "", //品牌
                edTime: "", //登记时间
                edCode: "", //标识编码
                edState: "", //状态
                beizhu: "", //备注
            },
        };
    },

    computed: {
        butten() {
            return
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
            this.searchModel.edName = "";
            //调用查询方法
            this.search();
        },
        //打开添加窗口
        openAddwindow() {
            this.$restForm("detailsForm", this.details);
            //设置属性
            (this.detailsDialog.title = "新增器材使用记录"),
                (this.detailsDialog.visible = true);
        },

        //修改按钮实现
        handleEdit(row) {
            //数据回显
            this.$objCopy(row, this.details);
            //设置窗口标题
            (this.editDetailsDialog.title = '编辑器材'),
                //显示窗口
                (this.editDetailsDialog.visible = true);

        },

        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize = size;
            //调用查询方法
            this.search(this.pageNo, size);
        },

        /**
         * 当页码发生变化时触发该事件
         */
        handleCurrentChange(page) {
            //修改当前页码
            this.pageNo = page;
            //调用查询方法
            this.search(page, this.pageSize);
        },

        /**
         * 查询报修记录列表
         */
        async search(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            //发送查询请求
            detailsApi.getDetailsList(this.searchModel).then((res) => {
                if (res.success) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].edState == 1) {
                            this.tableData[i].edState = "使用中";
                        } else if (this.tableData[i].edState == 0) {
                            this.tableData[i].edState = "未使用";
                        } else if (this.tableData[i].edState == 2) {
                            this.tableData[i].edState = "无法使用";
                        }
                    }
                }
            });

            //判断是否成功
        },

        //编辑器材状态、备注、标识编码
        async editDetails(row) {
            this.$refs.detailsForm.validate(async (valid) => {
                if (valid) {
                    this.details.edState = this.details.edState == "使用中" ? 1 : 0;
                    await detailsApi.updateDetails(this.details).then(res => {
                        if (res.success) {
                            //提示成功
                            this.$message.success(res.message);
                            //刷新数据
                        this.search(this.pageNo, this.pageSize)
                            //关闭窗口事件
                            this.editDetailsDialog.visible = false;
                             this.search(this.pageNo, this.pageSize)
                        } else {
                            //提示失败
                            this.$message.error(res.message);
                        }
                    })

                }
            })
        },
        async onConfirm() {
            this.$refs.detailsForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = await detailsApi.addDetails(this.details);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        
                        //关闭窗口事件
                        this.detailsDialog.visible = false;
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }
                }
            });
        },

        //窗口关闭事件
        onClose() {
            this.detailsDialog.visible = false;
            this.editDetailsDialog.visible = false;
        },

        //删除按钮实现
        async handleDelete(row) {
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")
            if (confirm) {
                await detailsApi.deleteDetails({ edId: row.edId }).then(res => {
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.search(this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                })
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