<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.inName" placeholder="请输入物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" plain @click="handleDownload">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="inId"
            default-expand-all>
            <el-table-column prop="inName" label="物品名称" />
            <el-table-column prop="inNum" label="已购数量" />
            <el-table-column prop="inTime" label="入库时间" />
            <el-table-column prop="inType" label="物品类型" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="inIs" label="状态" />
            <el-table-column prop="changeLose" label="报损" />
            <el-table-column prop="changeMore" label="报溢" />

            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('stores:outStore:delete')">删除
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
//导入department.js脚本文件
import inStockApi from "@/api/inStockApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "po",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            searchModel: {
                inName: "", //库存物品名
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示条数
            },
            tableData: [], //表格数据

            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量


            downloadLoading: false,
            filename: "入库记录表",
            autoWidth: true,
            bookType: "xlsx",

            //新增或编辑的表单属性
            inStockDialog: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 65, //窗口高度
            },
            inStock: {
                inId: "", //入库记录id
                inName: "", //物品名称
                inNum: "", //入库数量
                inTime: "", //入库时间
                inType: "", //物品类型
                brand: "", //品牌
                inIs: "", //是否成功入库
                changeLose: "", //报损数
                changeMore: "", //报溢数
            },
        };
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
            this.searchModel.inName = "";
            //调用查询方法
            this.search();
        },

        /**
         * 查询采购计划列表
         */
        async search(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            //发送查询请求
            await inStockApi.getInStockList(this.searchModel).then((res) => {
                if (res.success) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].inIs == 1) {
                            this.tableData[i].inIs = "入库成功";
                        } else {
                            this.tableData[i].inIs = "入库失败";
                        }
                    }
                }
            });
            //判断是否成功
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

        //窗口关闭事件
        onClose() {
            this.inStockDialog.visible = false;
        },

        //删除按钮实现
        async handleDelete(row) {
            let confirm = await this.$myconfirm("确定要删除该数据嘛?");
            if (confirm) {
                //发送删除请求
                let res = await inStockApi.deleteInStock({ inId: row.inId });
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    //刷新数据
                    this.search(this.pageNo, this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message);
                }
                this.search(this.pageNo, this.pageSize);
            }
        },
        async handleDownload() {
        let confirm = await this.$myconfirm("确定要导出吗?")
        if (confirm) {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['物品名称', '已购数量', '入库时间', '物品类型', '品牌', '状态', '报损','报溢']
                const filterVal = ['inName', 'inNum', 'inTime', 'inType', 'brand', 'inIs', 'changeLose','changeMore']
                const list = this.tableData
                const data = this.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: this.autoWidth,
                    bookType: this.bookType
                })
                this.downloadLoading = false
            })
            this.$message.success("导出成功")
        }

    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
                return parseTime(v[j])
            } else {
                return v[j]
            }
        }))

    },
    },
     
};
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