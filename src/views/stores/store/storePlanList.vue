<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.scheduleName" placeholder="请输入计划采购的物品名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow()">新增</el-button>
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
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="planId"
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
            <el-table-column prop="scheduleState" label="状态" />
            <el-table-column label="操作" width="450" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="PlanToPo(scope.row)">
                        已购 </el-button>
                    <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="handleDelete(scope.row)">删除
                    </el-button>
                    <el-button type="success" icon="el-icon-plus" size="small" @click="shenhe(scope.row)">审核
                    </el-button>
                    <el-button type="success" icon="el-icon-plus" size="small" @click="romve(scope.row)">撤销
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加和修改窗口 -->
        <system-dialog :title="planDialog.title" :visible="planDialog.visible" :width="planDialog.width"
            :height="planDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="plan" ref="planForm" :rules="rules" label-width="80px" :inline="true" size="small">
                    <el-form-item label="物品名称" prop="scheduleName">
                        <el-input v-model="plan.scheduleName"></el-input>
                    </el-form-item>
                    <el-form-item label="物品类型" prop="scheduleType">
                        <el-input v-model="plan.scheduleType"></el-input>
                    </el-form-item>
                    <el-form-item label="供货名称" prop="scheduleSupplier">
                        <el-input v-model="plan.scheduleSupplier"></el-input>
                    </el-form-item>
                    <el-form-item label="物品单位" prop="unit">
                        <el-input v-model="plan.unit"></el-input>
                    </el-form-item>
                    <el-form-item label="供货地址" prop="scheduleAddress">
                        <el-input v-model="plan.scheduleAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="scheduleNum">
                        <el-input v-model="plan.scheduleNum"></el-input>
                    </el-form-item>
                    <el-form-item label="单价" prop="schedulePrice">
                        <el-input v-model="plan.schedulePrice"></el-input>
                    </el-form-item>
                    <el-form-item label="物品品牌" prop="brand">
                        <el-input v-model="plan.brand"></el-input>
                    </el-form-item>

                </el-form>

            </div>
        </system-dialog>



        <!-- 分页工具栏 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分配审核人窗口 -->
        <system-dialog :title="shenheDialog.title" :height="shenheDialog.height" :width="shenheDialog.width"
            :visible="shenheDialog.visible" @onClose="onshenheClose" @onConfirm="onshenheConfirm">
            <div slot="content">
               
                <el-table ref="assignPtTable" :data="shenheList" border stripe :height="shenheHeight"
                    style="width: 100%; margin-bottom: 10px" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="审核人编号" />
                    <el-table-column prop="emp.empName" label="审核人" />
                </el-table>

            </div>
        </system-dialog>
    </el-main>

</template>

<script>
//导入department.js脚本文件
import planApi from "@/api/planApi"
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "plan",
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            searchModel: {
                scheduleName: "",//库存物品名
                scheduleempId: "",
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示条数
            },

            downloadLoading: false,
            filename: "采购计划表",
            autoWidth: true,
            bookType: "xlsx",

            tableData: [],//表格数据

            //分页组件所需的属性
            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量

            //新增或编辑的表单属性
            planDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 210,//窗口高度
            },
            //已购弹窗的表单属性
            toPoDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 210,//窗口高度
            },
            plan: {
                scheduleId: "",//采购计划编号
                scheduleempId: "",//当前采购人编号
                scheduleName: "",//采购物品名称
                scheduleType: "",//采购物品类型
                scheduleSupplier: "",//采购供货名称
                unit: "",//物品单位
                scheduleAddress: "",//供货地址
                scheduleNum: "",//采购物品数量    
                schedulePrice: "",//物品单价
                brand: "",//品牌
                scheduleTime: "",//计划创建时间
                scheduleState: "",//计划状态   已执行/待执行

            },
            rules: {
                scheduleName: [{ required: true, message: '请输入物品名称', trigger: 'blur', }],
                scheduleType: [{ required: true, message: '请输入物品类型', trigger: 'blur', }],
                scheduleSupplier: [{ required: true, message: '请输入供货商名称', trigger: 'blur', }],
                unit: [{ required: true, message: '请输入物品单位', trigger: 'blur', }],
                scheduleAddress: [{ required: true, message: '请输入供货商地址', trigger: 'blur', }],
                scheduleNum: [{ required: true, message: '请输入物品数量', trigger: 'blur', }],
                schedulePrice: [{ required: true, message: '请输入物品单价', trigger: 'blur', }],
                brand: [{ required: true, message: '请输入品牌', trigger: 'blur', }],
            },
            //新增或编辑的表单属性
            shenheDialog: {
                title: "审核窗口",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 210,//窗口高度
            },
            shenheHeight: 500,
            shenheList: [],//财务部门员工数据,
            id: [],//选择的员工id
            scheduleId: ""//当前采购计划编号
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
            this.searchModel.scheduleName = "";
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
         * 查询采购计划列表
         */
        async search(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo
            //修改每页显示条数
            this.searchModel.pageSize = pageSize
            this.searchModel.scheduleempId = this.$store.getters.userId;
            //发送查询请求
            let res = await planApi.getPlanList(this.searchModel)
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records
                this.total = res.data.total;
                console.log(this.tableData)
                for (let i = 0; i < res.data.records.length; i++) {
                    if (res.data.records[i].scheduleState == 0) {
                        res.data.records[i].scheduleState = "未审核"
                    } else if (res.data.records[i].scheduleState == 1) {
                        res.data.records[i].scheduleState = "待审核"
                    } else if (res.data.records[i].scheduleState == 2) {
                        res.data.records[i].scheduleState = "审核通过"
                    } else if (res.data.records[i].scheduleState == 3) {
                        res.data.records[i].scheduleState = "审核不通过"
                    } else if (res.data.records[i].scheduleState == 4) {
                        res.data.records[i].scheduleState = "已执行"
                    }else if (res.data.records[i].scheduleState == 5) {
                        res.data.records[i].scheduleState = "已撤销"
                    }
                }
            }

        },

    


        //打开添加窗口
        openAddwindow() {
            this.$restForm("planForm", this.plan);
            //设置属性
            this.planDialog.title = '新增采购计划',
                this.planDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.planDialog.visible = false,
                this.toPoDialog.visible = false
        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            this.$refs.planForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
                    this.plan.scheduleempId = this.$store.getters.userId;
                    if (this.plan.scheduleId === "") {
                        //发送添加请求
                        res = await planApi.addPlan(this.plan)

                    } else {
                        this.plan.scheduleState = 0
                        //发送修改请求
                        res = await planApi.updatePlan(this.plan)
                    }

                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.search()
                        //关闭窗口事件
                        this.planDialog.visible = false
                    } else {
                        //提示失败
                        this.$message.error(res.message)

                    }

                }
            })

        },
        //修改按钮实现
        async handleEdit(row) {
            let res = await planApi.checkJihua({ id: row.scheduleId })
            if (res.success) {
                //数据回显
                this.$objCopy(row, this.plan)
                //设置窗口标题
                this.planDialog.title = '编辑库存'
                //显示窗口
                this.planDialog.visible = true
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
                let res = await planApi.deletePlan({ scheduleId: row.scheduleId })
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
        },

        async PlanToPo(row) {

            this.plan = row
            if (row.scheduleState == "未审核") {
                this.plan.scheduleState = 0
            } else if (row.scheduleState == "待审核") {
                this.plan.scheduleState = 1
            } else if (row.scheduleState == "审核通过") {
                this.plan.scheduleState = 2
            } else if (row.scheduleState == "审核不通过") {
                this.plan.scheduleState = 3
            } else if (row.scheduleState == "已执行") {
                this.plan.scheduleState = 4
            };
            console.log(this.plan);
            let confirm = await this.$myconfirm("该采购计划是否已完成？")
            if (confirm) {
            let res = await planApi.toPo(this.plan)
            console.log(res)
           
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //刷新数据
                this.search()

            } else {
                console.log(this.plan);
                //刷新数据                
                this.search()
                //提示失败
                this.$message.error(res.message)

            }
        }
        },
        //审核窗口打开事件
        async shenhe(row) {
            console.log("1", row)
            //点击审核检查该该采购编号是否已经发起审核

            let res1 = await planApi.checkCaiGou({ id: row.scheduleId })
            console.log(res1);
            if (res1.success) {
                this.scheduleId = row.scheduleId;
                let res = await planApi.findcaiwuEmp();
                if (res.success) {
                    this.shenheList = res.data;
                    console.log(res.data);
                }
                this.shenheDialog.visible = true;
            } else {
                //提示失败
                this.$message.error(res1.message)
            }

        },
        //审核窗口关闭事件
        onshenheClose() {
            this.shenheDialog.visible = false;
        },
        //审核窗口确认事件
        async onshenheConfirm() {
            let params = {
                scheduleId: this.scheduleId,
                id: this.id,
            }
            let res = await planApi.addCaiGouSh(params)
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //刷新数据
                this.search()
                //关闭窗口事件
                this.shenheDialog.visible = false
            } else {
                //提示失败
                this.$message.error(res.message)
            }
            console.log("2", params)
        },
        //复选框获取事件
        handleSelectionChange(row) {
            //拿到选中的ID 值
            this.id = row.map(item => item.id);
        },
        //撤销申请
       async romve(row){
        let confirm = await this.$myconfirm("确定要撤销该申请嘛?")
            if (confirm) {
            let res=await planApi.chexiao({id:row.scheduleId})
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //刷新数据
                this.search()
                
            } else {
                //提示失败
                this.$message.error(res.message)
            }
            }
        },

       async handleDownload() {
            let confirm = await this.$myconfirm("确定要导出吗?")
            if(confirm){
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['物品名称', '物品类型', '供货名称', '单位', '供货地址','数量','单价','品牌','创建时间','状态'] 
                const filterVal = ['scheduleName', 'scheduleType', 'scheduleSupplier', 'unit',
                                 'scheduleAddress','scheduleNum','schedulePrice','brand','scheduleTime','scheduleState']
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