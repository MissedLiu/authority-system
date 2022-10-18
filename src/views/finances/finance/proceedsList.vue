<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-row>
                <el-col :span="8">
                    <el-form-item>
                        <el-select v-model="searchModel.typee" class="m-2" placeholder="输入统计时间段" size="small">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>

                        <el-select v-model="searchModel.type" class="m-2" placeholder="输入统计套餐类型" size="small">
                            <el-option v-for="item in tOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <el-button type="primary" icon="el-icon-search" @click="toSumPrice()" plain>统计</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" plain @click="handleGetForms">查看报表</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" plain @click="handleGetOnFile(pageNo,pageSize)">查看归档记录</el-button>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-date-picker v-model="searchModel.changeTime" type="month" placeholder="请选择要查询的月份"
                            @change="changeTimeb(pageNo, pageSize)" value-format="yyyy-MM" />
                        <el-button type="success" plain @click="toFile">归档</el-button>
                        <el-button type="success" plain @click="handleDownload">导出当页数据到Excel表格</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="poId"
            default-expand-all>
            <el-table-column prop="mealName" label="套餐名称" />
            <el-table-column prop="mealType" label="套餐类型" />
            <el-table-column prop="pname" label="项目名称" />
            <el-table-column prop="proceedsPrice" label="消费金额" />
            <el-table-column prop="proceedsTime" label="消费时间" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small" plain @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <system-dialog :title="DialogConfig.title" :visible="DialogConfig.visible" :width="DialogConfig.width"
            :height="DialogConfig.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <span>{{ searchModel.typee }}</span><span v-if="searchModel.type != ''">{{ searchModel.type
                }}套餐</span>的收入总额为{{ sumPrice }}
            </div>
        </system-dialog>

        <system-dialog :title="DialogConfig3.title" :visible="DialogConfig3.visible" :width="DialogConfig3.width"
            :height="DialogConfig3.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-date-picker v-model="searchModel.changeTime" type="year" placeholder="请选择要查询的年份"
                            @change="handleGetOnFile(pageNo, pageSize)" value-format="yyyy" />
                    </el-form-item>

                </el-form>

                <el-table :data="OnFileDate" border stripe style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="type" label="类型"></el-table-column>
                    <el-table-column prop="money" label="金额"></el-table-column>
                    <el-table-column prop="date" label="时间"></el-table-column>
                </el-table>

                <!-- 分页工具栏 -->
                <el-pagination @size-change="SizeChange" @current-change="CurrentChange" :current-pag="tablePage.pageNo"
                    :page-sizes="[10, 20, 30, 40, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                    :total="tablePage.total">
                </el-pagination>
            </div>
        </system-dialog>

        <system-dialog :title="DialogConfig2.title" :visible="DialogConfig2.visible" :width="DialogConfig2.width"
            :height="DialogConfig2.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <el-row>
                    <el-col :span="12">
                        今年每月套餐收入情况
                        <BarChart v-if="flag" :TbData="this.TbData"></BarChart>
                    </el-col>
                    <el-col :span="12">
                        历年套餐收入情况
                        <BarChartA v-if="flag" :TbDataA="this.TbDataA"></BarChartA>
                    </el-col>
                </el-row>
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
import proceedsApi from "@/api/proceedsApi";
import onFileApi from "@/api/onFileApi";
import BarChart from "./BarChart.vue";
import BarChartA from "./BarChartA.vue";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "invoice",
    //注册组件
    components: {
        SystemDialog,
        BarChart,
        BarChartA,
    },
    data() {
        return {
            TbData: {},
            TbDataA: {},
            flag: false,

            downloadLoading: false,
            filename: "套餐收入报表",
            autoWidth: true,
            bookType: "xlsx",

            searchModel: {
                onFileType: "",
                changeTime: "",
                type: "",
                typee: "",
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示条数
            },
            tableData: [], //表格数据
            OnFileDate: [],
            tablePage: {
                pageNo: 1,
                pageSize: 10,
                totle: ""
            },
            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量
            sumPrice: "0",
            //新增或编辑的表单属性
            DialogConfig: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 30, //窗口高度
            },

            DialogConfig2: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1500, //窗口宽度
                height: 600, //窗口高度
            },

            proceeds: {
                proceedsId: "", //编号
                mealName: "", //套餐名称
                mealType: "", //套餐类型
                pName: "", //项目名称
                proceedsPrice: "", //消费金额
                proceedsTime: "", //消费时间
            },

            DialogConfig3: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1500, //窗口宽度
                height: 600, //窗口高度
            },

            options: [
                {
                    value: "近七天",
                    label: "近七天",
                },
                {
                    value: "近一个月",
                    label: "近一个月",
                },
                {
                    value: "本季度",
                    label: "本季度",
                },
                {
                    value: "上季度",
                    label: "上季度",
                },
                {
                    value: "本年",
                    label: "本年",
                },
            ],
            tOptions: [
                {
                    value: "",
                    label: "全部套餐",
                },
                {
                    value: "普通",
                    label: "普通套餐",
                },
                {
                    value: "私教",
                    label: "私教套餐",
                },
                {
                    value: "团操",
                    label: "团操套餐",
                },
            ],
        };
    },
    //初始化时调用
    created() {
        this.search();
        this.findSum();
        this.findSumA();
    },
    methods: {
        /**
         * 重置查询条件
         */
        resetValue() {
            //清空数据
            this.searchModel.mealName = "";
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
            let res = await proceedsApi.selectList(this.searchModel);
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },

        changeTimeb(pageNo, pageSize) {
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            //发送查询请求
            proceedsApi.selectList(this.searchModel).then((res) => {
                if (res.success) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                }
            });
        },

        async findSum() {
            await proceedsApi.getCountPrice().then((res) => {
                console.log(res.data);
                this.TbData = res.data;
                this.flag = true;
            });
        },

        async findSumA() {
            await proceedsApi.getCountPriceYear().then((res) => {
                console.log(res.data);
                this.TbDataA = res.data;
                this.flag = true;
            });
        },

        onClose() {
            this.DialogConfig.visible = false;
            this.DialogConfig2.visible = false;
            this.DialogConfig3.visible = false;
            this.searchModel.type = "";
        },

        async toSumPrice() {
            await proceedsApi.getSumPrice(this.searchModel).then((res) => {
                if (res.success) {
                    this.sumPrice = res.data;
                    this.DialogConfig.title = "🐂";
                    this.DialogConfig.visible = true;
                    if (this.sumPrice == null) {
                        this.sumPrice = "0";
                    }
                }
            });
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

        SizeChange(size) {
            //修改每页显示数量
            this.tablePage.pageSize = size;
            //调用查询方法
            this.handleGetOnFile(this.tablePage.pageNo, size);
        },

        CurrentChange(page) {
            //修改当前页码
            this.tablePage.pageNo = page;
            //调用查询方法
            this.handleGetOnFile(page, this.tablePage.pageSize);
        },
        //删除按钮实现
        async handleDelete(row) {
            console.log(row);
            let confirm = await this.$myconfirm("确定要删除该数据嘛?");
            if (confirm) {
                await proceedsApi.delete({ comsuneId: row.comsuneId }).then((res) => {
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message);
                        //刷新数据
                        this.search(this.pageNo, this.pageSize);
                    } else {
                        //提示失败
                        this.$message.error(res.message);
                    }
                });
            }
        },


        async handleGetOnFile(pageNo, pageSize) {
            this.DialogConfig3.title = "归档记录";
            this.DialogConfig3.visible = true;
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            this.searchModel.type = "套餐收入"
            await onFileApi.getOnFile(this.searchModel).then(res => {
                if (res.success) {
                    this.OnFileDate = res.data.records;
                    this.tablePage.total = res.data.total;

                }
            })
        },

        async toFile() {
            let confirm = await this.$myconfirm("确定要将该月套餐收入归档吗");
            if (confirm) {
                this.searchModel.onFileType = "套餐收入";
                await onFileApi.toFile(this.searchModel).then((res) => {
                    if (res.success) {
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            }
        },

        handleGetForms() {
            this.DialogConfig2.title = "报表";
            this.DialogConfig2.visible = true;
        },

        async handleDownload() {
            let confirm = await this.$myconfirm("确定要导出吗?");
            if (confirm) {
                this.downloadLoading = true;
                import("@/vendor/Export2Excel").then((excel) => {
                    const tHeader = [
                        "会员名称",
                        "会员电话",
                        "套餐名称",
                        "套餐类型",
                        "项目名称",
                        "消费金额",
                        "消费时间",
                    ];
                    const filterVal = [
                        "memberName",
                        "memberPhone",
                        "mealName",
                        "mealType",
                        "ptpName",
                        "comsunePrice",
                        "comsuneDate",
                    ];
                    const list = this.tableData;
                    const data = this.formatJson(filterVal, list);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: this.filename,
                        autoWidth: this.autoWidth,
                        bookType: this.bookType,
                    });
                    this.downloadLoading = false;
                });
                this.$message.success("导出成功");
            }
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    if (j === "timestamp") {
                        return parseTime(v[j]);
                    } else {
                        return v[j];
                    }
                })
            );
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