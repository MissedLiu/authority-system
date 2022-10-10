<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.poName" placeholder="请输入物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                <el-button type="primary" icon="el-icon-search" @click="getNotExecuted(pageNo, pageSize)">查看未入库的物品
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" plain @click="handleDownload">导出</el-button>
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
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="poId"
            default-expand-all>
            <el-table-column prop="poName" label="物品名称" />
            <el-table-column prop="poNum" label="已购数量" />
            <el-table-column prop="poPrice" label="单价" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="scheduleAddress" label="供货地址" />
            <el-table-column prop="scheduleSupplier" label="供货商名称" />
            <el-table-column prop="poTime" label="创建时间" />
            <el-table-column prop="poType" label="物品类型" />
            <el-table-column prop="poState" label="状态" />
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small"
                        @click="handleToStock(scope.row)" v-if="hasPermission('stores:po:toStore')" >入库
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('stores:po:delete')">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 入库窗口 -->
        <system-dialog :title="poDialog.title" :visible="poDialog.visible" :width="poDialog.width"
            :height="poDialog.height" @onClose="onClose" @onConfirm="toStock">
            <div slot="content">
                
                <el-form :model="po" ref="poForm" :rules="rules" label-width="80px" :inline="true" size="small">
                    <el-form-item label="物品报损" prop="changeLose">
                        <el-input v-model="po.changeLose"></el-input>
                    </el-form-item>

                    <el-form-item label="物品报溢" prop="changeMore">
                        <el-input v-model="po.changeMore" ></el-input>
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
import poApi from "@/api/poApi";
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
                scheduleName: "", //库存物品名
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示条数
            },
            tableData: [], //表格数据

            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量


            downloadLoading: false,
            filename: "已购物品表",
            autoWidth: true,
            bookType: "xlsx",

            //新增或编辑的表单属性
            poDialog: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 560, //窗口宽度
                height: 65, //窗口高度
            },
            po: {
                poId: "", //已购物品编号
                scheduleId: "", //采购计划编号
                poName: "", //已购物品名
                poNum: "", //已购物品数量
                poPrice: "", //已购物品价格
                scheduleAddress: "", //供货地址
                brand: "", //品牌
                scheduleSupplier: "", //供货商名称
                poTime: "", //创建时间
                poType: "", //物品类型
                poState: "", //已购物品状态
                changeLose: "", //报损数
                changeMore: "", //报溢数
            },
            rules: {
                changeLose: [
                    { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" },
                ],
                changeMore: [
                    { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "blur" },
                ],
            },
        };
    },
    //初始化时调用
    created() {
        this.search();
        let that = this;
    },
    methods: {
        /**
         * 重置查询条件
         */
        resetValue() {
            //清空数据
            this.searchModel.poName = "";
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
            let res = await poApi.getPoList(this.searchModel);
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
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
            this.poDialog.visible = false;
        },

        async getNotExecuted(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            //发送查询请求
            let res = await poApi.getNotExecuted(this.searchModel);
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },

        //删除按钮实现
        async handleDelete(row) {
            let confirm = await this.$myconfirm("确定要删除该数据嘛?");
            if (confirm) {
                //发送删除请求
                let res = await poApi.deletePo({ poId: row.poId });
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
            }
        },
        handleToStock(row) {
            //数据回显
            this.$objCopy(row, this.po);
            //设置窗口标题
            this.poDialog.title = "请输入报溢数或报损数";
            //显示窗口
            this.poDialog.visible = true;
        },
        // 将已购表的数据入库（添加到入库表、入库记录表、报溢报损表）
        async toStock() {
            let res = await poApi.toStock(this.po);
            if (res.success) {
                //提示成功
                this.$message.success(res.message);
                //刷新数据
                this.search();
                //关闭窗口事件
                this.poDialog.visible = false;
            } else {
                //提示失败
                this.$message.error(res.message);
            }
            this.search(this.pageNo, this.pageSize);
        },

        async handleDownload() {
            let confirm = await this.$myconfirm("确定要导出吗?")
            if(confirm){
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['物品名称', '已购数量', '单价', '品牌', '供货地址','供货商名称','创建时间','物品类型','状态'] 
                const filterVal = ['poName', 'poNum', 'poPrice', 'brand','scheduleAddress','scheduleSupplier','poTime','poType','poState']
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