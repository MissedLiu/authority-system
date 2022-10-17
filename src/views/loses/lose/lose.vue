<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入名字" v-model="lose.itemName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="openAddwindow"
                    v-if="hasPermission('loses:lose:add')">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column label="编号" type="index" align="center" width="100"></el-table-column>
            <el-table-column prop="itemName" label="物品名称"></el-table-column>
            <el-table-column prop="createTtime" label="添加时间"></el-table-column>
            <el-table-column prop="state" label="领取状态"></el-table-column>
            <el-table-column prop="uname" label="领取人"></el-table-column>
            <el-table-column prop="phone" label="领取人电话"></el-table-column>
            <el-table-column prop="addTime" label="领取时间"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="success" plain icon="el-icon-plus" size="small" @click="openReceive(scope.row)"
                        v-if="hasPermission('loses:lose:get')">
                        领取
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加窗口 -->
        <system-dialog :title="addloseDialog.title" :visible="addloseDialog.visible" :width="addloseDialog.width"
            :height="addloseDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="addlose" ref="addloseForm" :rules="loserules" label-width="80px" size="small">
                    <el-form-item label="物品名称" prop="itemName">
                        <el-input v-model="addlose.itemName"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 领取窗口 -->
        <system-dialog :title="receiveDialog.title" :visible="receiveDialog.visible" :width="receiveDialog.width"
            :height="receiveDialog.height" @onClose="receiveClose" @onConfirm="receiveConfirm">
            <div slot="content">
                <el-form :model="receive" ref="userForm" :rules="loserules" label-width="100px" size="small">
                    <el-form-item label="领取人姓名" prop="uname">
                        <el-input v-model="receive.uname"></el-input>
                    </el-form-item>
                    <el-form-item label="领取人电话" prop="phone">
                        <el-input v-model="receive.phone"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import LoseApi from '@/api/loses'

//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
import { throwStatement } from '@babel/types';
export default {
    name: 'loses',
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            //分页组件所需的属性
            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量
            tableData: [],//表格数据列表
            //查询传递数据
            lose: {
                itemName: "",//模糊名称
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //校验
            loserules: {
                itemName: [{ required: true, message: '请输入失物名称', trigger: 'blur' }],
                uname: [{ required: true, message: '请输入会员姓名', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入会员电话', trigger: 'blur' }, { pattern: new RegExp(/^((1[34578]\d{9}))$/), message: '请正确输入电话号码' }],
            },
            //添加窗口属性
            addloseDialog: {
                title: "新增遗失物品",//窗口标题
                visible: false,//是否显示窗口
                width: 300,//窗口宽度
                height: 100//窗口高度
            },
            //添加窗口绑定参数
            addlose: {
                itemName: "",//物品名称
            },
            //领取窗口属性
            receiveDialog: {
                title: "领取遗失物品",//窗口标题
                visible: false,//是否显示窗口
                width: 400,//窗口宽度
                height: 200//窗口高度
            },
            //领取物品参数
            receive: {
                id: "",
                itemName: "",
                createTtime: "",
                uname: "",
                phone: "",
            }
        }
    },
    created() {
        this.search();
    },
    methods: {
        //查询失物列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.lose.pageNo = pageNo
            //修改每页显示条数
            this.lose.pageSize = pageSize
            //发送查询请求
            let res = await LoseApi.selectLose(this.lose)
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //打开添加窗口
        openAddwindow() {
            this.addloseDialog.visible = true
        },
        //添加窗口确定事件
        async onConfirm() {
            //进行表单验证
            this.$refs.addloseForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    //发送添加请求
                    let res = await LoseApi.addLose(this.addlose);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.addloseDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.size)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })

        },
        //添加窗口取消事件
        onClose() {
            this.addloseDialog.visible = false
        },

        //打开领取窗口
        openReceive(row) {
            if (row.state!="已领取") {
                this.receiveDialog.visible = true
                this.receive.id = row.id
                this.receive.itemName = row.itemName
                this.receive.createTtime = row.createTtime
            }else{
                 //提示失败
                 this.$message.error("该物品已被领取")
            }


        },
        //领取窗口确定事件
        receiveConfirm() {
            //进行表单验证
            this.$refs.userForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    //发送添加请求
                    console.log("---------------", this.receive);
                    let res = await LoseApi.updateLoseState(this.receive);
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //清空表单数据
                        this.$restForm("userForm", this.receive);
                        //刷新数据
                        this.search(this.pageNo, this.size)
                        //关闭窗口事件
                        this.receiveDialog.visible = false
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            })

        },
        //领取窗口取消事件
        receiveClose() {
            this.receiveDialog.visible = false
        },


        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.lose.itemName = "";
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
    },
}

</script>

<style lang="scss" scoped>

</style>
