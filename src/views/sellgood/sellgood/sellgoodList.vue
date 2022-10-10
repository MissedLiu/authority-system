<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.stockingName" placeholder="请输入商品名" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchModel.invoicedName" placeholder="请输入购买人" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow()" v-if="hasPermission('sellgood:sellgood:add')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 40px" row-key="flyerId"
            default-expand-all>
            <el-table-column prop="stockinName" label="商品名" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="stockinNum" label="购买数量" />
            <el-table-column prop="invoice.invoiceName" label="购买人" />
            <el-table-column prop="salesTime" label="购买时间" />
            <el-table-column prop="salesPrice" label="金额" />
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleDelete2(scope.row)" v-if="hasPermission('sellgood:sellgood:delete2')">撤销购买
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('sellgood:sellgood:delete')">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加和修改窗口-->
        <system-dialog :title="flyerDialog.title" :visible="flyerDialog.visible" :width="flyerDialog.width"
            :height="flyerDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModel2.stockinName" placeholder="请输入商品名" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="openAddwindow(pageNo2,pageSize2)">查询
                        </el-button>
                        <el-button icon="el-icon-refresh-right " @click="resetValue2()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="tableData2" border stripe style="width: 100%; margin-bottom: 20px" default-expand-all>
                    <el-table-column prop="stockinName" label="商品名" />
                    <el-table-column prop="storeNum" label="商品数量" />
                    <el-table-column prop="stockinType" label="商品类型" />
                    <el-table-column prop="brand" label="品牌" />
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" size="small" @click="buy(scope.row)">
                                购买 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具栏 -->
                <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                    :current-page="pageNo2" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="this.total2">
                </el-pagination>
            </div>
        </system-dialog>
        <!-- 购买弹窗 -->
        <system-dialog :title="buyDialog.title" :visible="buyDialog.visible" :width="buyDialog.width"
            :height="buyDialog.height" @onClose="BuyonClose" @onConfirm="BuyonConfirm">
            <div slot="content">
                <el-form :model="buyList" ref="buyForm" :rules="rules" label-width="80px" :inline="true" size="small">

                    <el-form-item label="购买人" prop="invoicedName">
                        <el-input v-model="buyList.invoicedName"></el-input>
                    </el-form-item>
                    <el-form-item label="购买数量" prop="stockInNum">
                        <el-input v-model="buyList.stockInNum"></el-input>
                    </el-form-item>

                    <el-form-item label="单价" prop="salesPrice">
                        <el-input v-model="buyList.salesPrice"></el-input>
                    </el-form-item>

                </el-form>

            </div>
        </system-dialog>
    </el-main>
</template>
  
<script>

//导入salesArticlesApi.js脚本文件
import salesArticlesApi from "@/api/salesArticlesApi";
//导入department.js脚本文件
import stockOutApi from "@/api/stockOutApi"
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "flyer",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {

        return {
            searchModel: {
                stockingName: "", //商品名
                invoicedName: "", //购买人
                saempId: "",//当前登录员工id
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示数量
            },
            searchModel2: {
                stockinName: "",//出库物品名
                pageNo: 1,
                pageSize: 10,
            },
            storeId: "",//库存编号
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量

            pageNo2: 1, //当前页码
            total2: 0, //数据总数量
            pageSize2: 10, //每页显示数量
            sta: [],
            tableData: [], //表格数据
            tableData2: [],//新增窗口中的表格数据
            flyerDialog: {
                title: "商品信息", //窗口标题
                visible: false, //是否显示窗口
                width: 900, //窗口宽度
                height: 500, //窗口高度
            },

            rules: {
                invoicedName: [{ required: true, message: '请输入商品名', trigger: 'blur' }],
                stockInNum: [{
                    required: true,
                    message: '请输入数字',
                    pattern: /[1-9]\d*/,
                    trigger: 'blur'
                }],
                salesPrice: [{
                    required: true,
                    message: '请输入数字',
                    pattern: /[1-9]\d*/,
                    trigger: 'blur'
                }]


            },
            buyDialog: {
                title: "购买信息", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 500, //窗口高度
            },
            buyList: {
                invoicedName: "",//购买人
                stockInNum: "",//购买数量
                salesPrice: "",//单价
                saempId: "",//当前系统登录人id
                saId:"",//商品记录id
                outId:"",//物品出库编号
                stockinId:""


            }
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
            this.searchModel.stockingName = "";
            this.searchModel.invoicedName = "";
            //调用查询方法
            this.search(this.pageNo, this.pageSize);
        },
        /**
          * 重置查询条件
          */
        resetValue2() {
            //清空数据
            this.searchModel2.stockinName = "";
            //调用查询方法
            this.openAddwindow(this.pageNo2, this.pageSize2)
        },
        /**
         * 查询列表
         */
        async search(pageNo, pageSize) {
            this.searchModel.pageNo = pageNo;
            this.searchModel.pageSize = pageSize;
            this.searchModel.saempId = this.$store.getters.userId;
            //发送查询请求
            let res = await salesArticlesApi.findAllList(this.searchModel);
            console.log(this.searchModel)
            //判断是否成功
            if (res.success) {
                console.log(res.data);
                this.tableData = res.data.records;
                this.total = res.data.total;
                console.log("ss",this.tableData)
            }
        },
        /**
         * 当每页数量发生变化时触发该事件
         */
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
         * 查询库存列表
         */
        async openAddwindow(pageNo2, pageSize2) {

            //修改当前页码
            this.searchModel2.pageNo = pageNo2
            //修改每页显示条数
            this.searchModel2.pageSize = pageSize2
            //发送查询请求
            let res = await stockOutApi.getStockOutList(this.searchModel2);

            if (res.success) {
                console.log("ss", res.data)
                this.tableData2 = res.data.records
                this.total2 = res.data.total;
                
            }

            //显示窗口
            this.flyerDialog.visible = true
            //判断是否成功
        },
        handleSizeChange2(size) {
            //修改每页显示数量
            this.pageSize2 = size
            //调用查询方法
            this.openAddwindow(this.pageNo2, size)
        },

        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange2(page) {
            //修改当前页码
            this.pageNo2 = page
            //调用查询方法
            this.openAddwindow(page, this.pageSize2)
        },


        //窗口关闭事件
        onClose() {
            this.flyerDialog.visible = false;
        },
        //窗口确认事件
        onConfirm() {
            this.flyerDialog.visible = false;
            this.search(this.pageNo, this.pageSize);
        },
       
        //购买操作
        buy(row) {
            this.buyDialog.visible = true;
            this.buyList = row;
            this.buyList.saId=""
           


        },
        // 购买窗口关闭事件
        BuyonClose() {
            this.buyDialog.visible = false;
        },
        //购买窗口确认事件
        BuyonConfirm() {
            this.$refs.buyForm.validate(async (valid) => {
                if (valid) {
                    this.buyList.saempId = this.$store.getters.userId;
                    let   res = await salesArticlesApi.addSalesArticles(this.buyList)
                       //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.openAddwindow(this.pageNo, this.pageSize)
                        //关闭窗口事件
                        this.buyDialog.visible = false;
                    } else {
                        //提示失败
                        this.$message.error(res.message)

                    }                    
                }
            });
        },
        //删除
        async handleDelete(row) {
            let confirm = await this.$myconfirm("删除将会删除该数据以及相关的发票记录");
            if (confirm) {
                let res =await salesArticlesApi.delete({ id: row.saId });
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    //刷新数据
                    this.search(this.pageNo,this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message);
                }
            }

        },
        //撤销购买
        async handleDelete2(row) {
            let confirm = await this.$myconfirm("确定要撤销购买吗?");
            if (confirm) {
                let res =await salesArticlesApi.delete2({ id: row.saId });
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    //刷新数据
                    this.search(this.pageNo,this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message);
                }
            }

        }
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
  