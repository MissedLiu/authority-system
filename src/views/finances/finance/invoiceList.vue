<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.stockinName" placeholder="请输入物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>

                <el-select v-model="tjType" class="m-2" placeholder="统计销售总值" size="small" @change="selectChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
            <el-table-column prop="stockinName" label="物品名称" />
            <el-table-column prop="stockinNum" label="数量" />
            <el-table-column prop="price" label="总价" />
            <el-table-column prop="brand" label="品牌" />
            <el-table-column prop="empId" label="销售人员编号" />
            <el-table-column prop="createTime" label="创建时间" />

        </el-table>

        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <system-dialog :title="DialogConfig.title" :visible="DialogConfig.visible" :width="DialogConfig.width"
            :height="DialogConfig.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <span>{{xinxi}}{{sumPrice}}</span>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
//导入department.js脚本文件
import invoiceApi from "@/api/invoiceApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "invoice",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            searchModel: {
                stockinName: "", //库存物品名
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示条数
            },
            tableData: [], //表格数据

            sumPrice: "",//总价
            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量


            tjType: "",
            xinxi: "",
            sumPrice: "0",

            options: [
                {
                    value: '1',
                    label: '近七天',
                },
                {
                    value: '2',
                    label: '近一个月',
                },
                {
                    value: '3',
                    label: '当前季度',
                },
                {
                    value: '4',
                    label: '上季度',
                },
                {
                    value: '5',
                    label: '本年',
                },
            ],

            //新增或编辑的表单属性
            DialogConfig: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 30, //窗口高度
            },
            invoice: {
                invoiceId: "", //记录id
                salesId: "", //销售记录编号
                invoiceName: "", //购买人姓名
                stockinName: "", //物品名称
                stockinNum: "", //销售数量
                price: "", //价格
                empId: "", //销售人员id
                createTime: "", //创建时间
                brand: "", //品牌
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
            this.searchModel.stockinName = "";
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
            let res = await invoiceApi.getInvoicelist(this.searchModel);
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },

        selectChange() {
            this.DialogConfig.visible = true;
            switch (this.tjType) {
                case "1":
                    this.DialogConfig.title = "🐕";
                    this.xinxi = "近七天的销售总额为：";
                    break;
                case "2":
                    this.DialogConfig.title = "🐕";
                    this.xinxi = "近一个月的销售总额为：";
                    break;
                case "3":
                    this.DialogConfig.title = "🐕";
                    this.xinxi = "当前季度的销售总额为：";
                    break;
                case "4":
                    this.DialogConfig.title = "🐕";
                    this.xinxi = "上季度的销售总额为：";
                    break;
                case "5":
                    this.DialogConfig.title = "🐕";
                    this.xinxi = "本年的销售总额为：";
                    break;
            }
            this.toSumPrice();

        },

        onClose() {
            this.DialogConfig.visible = false;
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

        async toSumPrice() {
            console.log(this.tjType)
            await invoiceApi.toSumPrice({id:this.tjType}).then(res => {
                this.sumPrice=res.data
            })
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