<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.empName" placeholder="销售人员名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" plain @click="handleDownload">导出当页数据到Excel表格</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="eeId"
            default-expand-all>
            <el-table-column prop="empName" label="销售人员名称" />
            <el-table-column prop="empPhone" label="销售人员电话" />
            <el-table-column prop="departmentName" label="销售人员部门" />
            <el-table-column prop="commissionSj" label="私教课程提成" />
            <el-table-column prop="commissionPt" label="普通课程提成" />
            <el-table-column prop="commissionTc" label="团操课程提成" />
            <el-table-column prop="commissionSp" label="商品提成" />
            <el-table-column prop="commissionPrice" label="总提成" />
            <el-table-column prop="commTime" label="最后统计时间" />
            <el-table-column label="操作" width="470" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="small" @click="handlePtStatistics(scope.row)">
                        普通提成
                    </el-button>
                    <el-button type="success" plain size="small" @click="handleSjStatistics(scope.row)">
                        私教提成
                    </el-button>
                    <el-button type="primary" plain size="small" @click="handleTcStatistics(scope.row)">
                        团操提成
                    </el-button>
                    <el-button type="success" plain size="small" @click="handleSpStatistics(scope.row)">
                        商品提成
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 普通套餐提成统计窗口 -->
        <system-dialog :title="tjDialog.title" :visible="tjDialog.visible" :width="tjDialog.width"
            :height="tjDialog.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModel.commRate" placeholder="请输入提成率（0-1）"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="tjConfirm">统计
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 会员数据列表 -->
                <el-table ref="salesData" :data="salesData" border stripe style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="mealName" label="套餐名称" />
                    <el-table-column prop="memberName" label="会员姓名" />
                    <el-table-column prop="memberPhone" label="会员电话" />
                    <el-table-column prop="projectId" label="项目编号" />
                    <el-table-column prop="projectName" label="项目名称" />
                    <el-table-column prop="type" label="会员类型" />
                    <el-table-column prop="salesPrice" label="价格" />
                    <el-table-column prop="state" label="状态" :filters="[{ text: '已购买', value: '已购买' },
                    { text: '已统计', value: '已统计' }]" :filter-method="filterHandler" />
                    <el-table-column prop="salesTime" label="创建时间" />
                    <el-table-column prop="mealTime" label="时长" />
                </el-table>

                <!-- 分页工具栏 -->
                <el-pagination @size-change="TjSizeChange" @current-change="TjCurrentChange"
                    :current-pag="tjPage.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="tjPage.total">
                </el-pagination>
            </div>
        </system-dialog>

        <!-- 私教套餐提成统计窗口 -->
        <system-dialog :title="tjDialog2.title" :visible="tjDialog2.visible" :width="tjDialog2.width"
            :height="tjDialog2.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModel.commRate" placeholder="请输入提成率（0-1）"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="tjConfirm">统计
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 会员数据列表 -->
                <el-table ref="salesData" :data="salesData" border stripe style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="mealName" label="套餐名称" />
                    <el-table-column prop="memberName" label="会员姓名" />
                    <el-table-column prop="memberPhone" label="会员电话" />
                    <el-table-column prop="projectId" label="项目编号" />
                    <el-table-column prop="projectName" label="项目名称" />
                    <el-table-column prop="type" label="会员类型" />
                    <el-table-column prop="salesPrice" label="价格" />
                    <el-table-column prop="state" label="状态" :filters="[{ text: '已购买', value: '已购买' },
                    { text: '已统计', value: '已统计' }]" :filter-method="filterHandler"/>
                    <el-table-column prop="salesTime" label="创建时间" />
                    <el-table-column prop="mealTime" label="时长" />
                </el-table>

                <!-- 分页工具栏 -->
                <el-pagination @size-change="TjSizeChange" @current-change="TjCurrentChange"
                    :current-pag="tjPage2.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="tjPage2.total">
                </el-pagination>
            </div>
        </system-dialog>


        <!-- 团操套餐提成统计窗口 -->
        <system-dialog :title="tjDialog3.title" :visible="tjDialog3.visible" :width="tjDialog3.width"
            :height="tjDialog3.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModel.commRate" placeholder="请输入提成率（0-1）"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="tjConfirm">统计
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 会员数据列表 -->
                <el-table ref="salesData" :data="salesData" border stripe style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="mealName" label="套餐名称" />
                    <el-table-column prop="memberName" label="会员姓名" />
                    <el-table-column prop="memberPhone" label="会员电话" />
                    <el-table-column prop="projectId" label="项目编号" />
                    <el-table-column prop="projectName" label="项目名称" />
                    <el-table-column prop="type" label="会员类型" />
                    <el-table-column prop="salesPrice" label="价格" />
                    <el-table-column prop="state" label="状态" :filters="[{ text: '已购买', value: '已购买' },
                    { text: '已统计', value: '已统计' }]" :filter-method="filterHandler"/>
                    <el-table-column prop="salesTime" label="创建时间" />
                    <el-table-column prop="mealTime" label="时长" />
                </el-table>

                <!-- 分页工具栏 -->
                <el-pagination @size-change="TjSizeChange" @current-change="TjCurrentChange"
                    :current-pag="tjPage3.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="tjPage3.total">
                </el-pagination>
            </div>
        </system-dialog>

        <!-- 商品销售提成统计窗口 -->
        <system-dialog :title="tjDialog4.title" :visible="tjDialog4.visible" :width="tjDialog4.width"
            :height="tjDialog4.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <!-- 条件查询区 -->
                <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input v-model="searchModel.commRate" placeholder="请输入提成率（0-1）"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="tjConfirm2">统计
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 商品销售列表 -->
                <el-table :data="salesData" border stripe style="width: 100%; margin-bottom: 10px">
                    <el-table-column prop="stockinName" label="商品名" />
                    <el-table-column prop="salesPrice" label="商品价格" />
                    <el-table-column prop="stockinNum" label="购买数量" />
                    <el-table-column prop="brand" label="品牌" />
                    <el-table-column prop="salesTime" label="时间" />
                    <el-table-column prop="state" label="状态" :filters="[{ text: '未统计', value: '未统计' },
                    { text: '已统计', value: '已统计' }]" :filter-method="filterHandler"/>
                </el-table>

                <!-- 分页工具栏 -->
                <el-pagination @size-change="SpSizeChange" @current-change="SpCurrentChange"
                    :current-pag="tjPage4.pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="tjPage4.total">
                </el-pagination>
            </div>
        </system-dialog>

        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="2"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

    </el-main>
</template>

<script>
//导入department.js脚本文件
import commissionApi from "@/api/commissionApi";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "commission",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            downloadLoading: false,
            filename: "提成统计表",
            autoWidth: true,
            bookType: "xlsx",

            searchModel: {
                empName: "",
                pageNo: 1,
                pageSize: 10,
                type: "",
                salesmanId: "",
                commRate: "",//提成比例
            },
            tableData: [], //表格数据
            salesData: [],

            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量


            tjPage: {
                pageNo: 1, //当前页码
                total: 0, //数据总数量
                pageSize: 10, //每页显示数量
            },
            tjPage2: {
                pageNo: 1, //当前页码
                total: 0, //数据总数量
                pageSize: 10, //每页显示数量
            },

            tjPage3: {
                pageNo: 1, //当前页码
                total: 0, //数据总数量
                pageSize: 10, //每页显示数量
            },

            tjPage4: {
                pageNo: 1, //当前页码
                total: 0, //数据总数量
                pageSize: 10, //每页显示数量
            },

            tjDialog: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1200, //窗口宽度
                height: 650, //窗口高度
            },
            tjDialog2: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1200, //窗口宽度
                height: 650, //窗口高度
            },
            tjDialog3: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1200, //窗口宽度
                height: 650, //窗口高度
            },
            tjDialog4: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 1200, //窗口宽度
                height: 650, //窗口高度
            },


            commission: {
                empName: "", //销售人员姓名
                empPhone: "", //销售电话
                departmentName: "", //部门名称
                commissioId: "", //提成记录id
                salesmanId: "", //销售人员id
                commissionPrice: "", //总提成
                commissionSj: "", //私教课程提成
                commissionPt: "", //普通课程提成
                commissionTc: "", //团操课程提成
                commissionSp: "", //商品提成
                type: "",//课程类型
                commTime: ""
            },


            sales: {
                salesId: "",
                salesmanId: "",
                mealId: "",
                meaiName: "",
                memberName: "",
                memberPhone: "",
                projectId: "",
                projectName: "",
                type: "",
                salesPrice: "",
                state: "",
                salesTime: "",
                mealTime: "",
            },

            salesArticle: {
                saId: "",
                saempId: "",
                stockoutId: "",
                stockInName: "",
                stockInNum: "",
                salesPrice: "",
                salesTime: "",
                brand: "",
                state: ""
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
            this.searchModel.empName = "";
            //调用查询方法
            this.search();
        },

        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize = size;
            //调用查询方法
            console.log(this.searchModel.type)
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

        TjSizeChange(size) {
            this.searchModel.pageSize = size;
            if (this.searchModel.type == "普通") {
                console.log(this.searchModel.type)
                this.handlePtStatistics(this.searchModel);
            } else if (this.searchModel.type == "私教") {
                console.log(this.searchModel.type)
                this.handleSjStatistics(this.searchModel);
            } else if (this.searchModel.type == "团操") {
                console.log(this.searchModel.type)
                this.handleTcStatistics(this.searchModel);
            }
        },

        SpSizeChange(size) {
            this.searchModel.pageSize = size;
            this.handleSpStatistics(this.searchModel)
        },

        TjCurrentChange(page) {
            //修改当前页码
            this.searchModel.pageNo = page;
            if (this.searchModel.type == "普通") {
                console.log(this.searchModel.type)
                this.handlePtStatistics(this.searchModel);
            } else if (this.searchModel.type == "私教") {
                console.log(this.searchModel.type)
                this.handleSjStatistics(this.searchModel);
            } else if (this.searchModel.type == "团操") {
                console.log(this.searchModel.type)
                this.handleTcStatistics(this.searchModel);
            }

        },
        SpCurrentChange(page) {
            //修改当前页码
            this.searchModel.pageNo = page;
            this.handleSpStatistics(this.searchModel)
        },

        async handlePtStatistics(row) {
            this.tjDialog.visible = true;
            this.tjDialog.title = "普通套餐销售记录";
            this.searchModel.type = "普通"
            this.searchModel.salesmanId = row.salesmanId
            await commissionApi.getSales(this.searchModel).then(res => {
                this.salesData = res.data.records
                this.tjPage.total = res.data.total;
                if (res.success) {
                    for (let i = 0; i < res.data.records.length; i++) {
                        if (res.data.records[i].state == 0) {
                            res.data.records[i].state = "待购中"
                        } else if (res.data.records[i].state == 1) {
                            res.data.records[i].state = "已购买"
                        } else {
                            res.data.records[i].state = "已统计"
                        }
                    }
                }
            })
        },
        async handleSjStatistics(row) {
            this.tjDialog2.visible = true;
            this.tjDialog2.title = "私教套餐销售记录";
            this.searchModel.type = "私教"
            this.searchModel.salesmanId = row.salesmanId
            await commissionApi.getSales(this.searchModel).then(res => {
                if (res.success) {
                    this.salesData = res.data.records
                    this.tjPage2.total = res.data.total;
                    for (let i = 0; i < res.data.records.length; i++) {
                        if (res.data.records[i].state == 0) {
                            res.data.records[i].state = "待购中"
                        } else if (res.data.records[i].state == 1) {
                            res.data.records[i].state = "已购买"
                        } else {
                            res.data.records[i].state = "已统计"
                        }
                    }
                }
            })
        },
        async handleTcStatistics(row) {
            this.tjDialog3.visible = true;
            this.tjDialog3.title = "团操套餐销售记录";
            this.searchModel.type = "团操"
            this.searchModel.salesmanId = row.salesmanId
            await commissionApi.getSales(this.searchModel).then(res => {
                if (res.success) {
                    this.salesData = res.data.records
                    this.tjPage3.total = res.data.total;
                    for (let i = 0; i < res.data.records.length; i++) {
                        if (res.data.records[i].state == 0) {
                            res.data.records[i].state = "待购中"
                        } else if (res.data.records[i].state == 1) {
                            res.data.records[i].state = "已购买"
                        } else {
                            res.data.records[i].state = "已统计"
                        }
                    }
                }
            })
        },
        async handleSpStatistics(row) {
            this.tjDialog4.visible = true;
            this.tjDialog4.title = "商品销售记录";
            this.searchModel.salesmanId = row.salesmanId
            await commissionApi.getSpList(this.searchModel).then(res => {
                if (res.success) {
                    this.salesData = res.data.records
                    this.tjPage4.total = res.data.total;
                    for (let i = 0; i < res.data.records.length; i++) {
                        if (res.data.records[i].state == 0) {
                            res.data.records[i].state = "未统计"
                        } else if (res.data.records[i].state == 1) {
                            res.data.records[i].state = "已统计"
                        }
                    }
                }
            })
        },

        onClose() {
            this.tjDialog.visible = false;
            this.tjDialog2.visible = false;
            this.tjDialog3.visible = false;
            this.tjDialog4.visible = false;
            this.search(this.pageNo, this.pageSize);
        },


        async tjConfirm() {
            let confirm = await this.$myconfirm("确定提交该提成率吗?");
            if (confirm) {
                let res = await commissionApi.toCommisson(this.searchModel)
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    this.tjDialog.visible = false;
                    this.tjDialog2.visible = false;
                    this.tjDialog3.visible = false;
                    this.tjDialog4.visible = false;
                } else {
                    this.$message.error(res.message);
                }
                this.searchModel.commRate = "";
            }
            this.search();
        },

        async tjConfirm2() {
            let confirm = await this.$myconfirm("确定提交该提成率吗?");
            if (confirm) {
                console.log(this.searchModel)
                let res = await commissionApi.updateSpComm(this.searchModel)
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message);
                    this.tjDialog.visible = false;
                    this.tjDialog2.visible = false;
                    this.tjDialog3.visible = false;
                    this.tjDialog4.visible = false;
                } else {
                    this.$message.error(res.message);
                }
                this.searchModel.commRate = "";
            }
            this.search();
        },

        async tjSpConfirm() {

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
            commissionApi.getCommissionlist(this.searchModel).then((res) => {
                if (res.success) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                }
            });
        },
        filterHandler(value, row) {
            console.log(value, row)
            return row.state === value
        },



        async handleDownload() {
            let confirm = await this.$myconfirm("确定要导出吗?")
            if (confirm) {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['销售人员名称', '销售人员电话', '销售人员部门', '私教课程提成', '普通课程提成', '团操课程提成', '商品提成', '总提成', '最后统计时间']
                    const filterVal = ['empName', 'empPhone', 'departmentName', 'commissionSj', 'commissionPt', 'commissionTc', 'commissionSp', 'commissionPrice', 'commTime']
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