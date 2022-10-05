<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入姓名" v-model="message.empName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo ,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="empName" label="客服姓名"></el-table-column>
            <el-table-column prop="empAge" label="年龄"></el-table-column>
            <el-table-column prop="empSex" label="性别"></el-table-column>
            <el-table-column prop="empPhone" label="电话"></el-table-column>
            <el-table-column prop="qq" label="QQ"></el-table-column>
            <el-table-column prop="emil" label="邮箱"></el-table-column>
            <el-table-column prop="weix" label="微信"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small"
                        @click="openmemberMessageDialog(scope.row)">
                        分配会员
                    </el-button>
                    <el-button icon="el-icon-edit-outline" type="primary" size="small"
                        @click="openprosperctDialog(scope.row)">
                        分配潜在用户
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 会员分配框 -->
        <system-dialog :title="memberMessageDialog.title" :visible=" memberMessageDialog.visible"
            :width=" memberMessageDialog.width" :height="memberMessageDialog.height" @onClose="memberClose()"
            @onConfirm="memberConfirm()">
            <div slot="content">
                <el-table border style="margin-top: 50px;" :data="memberMessage"
                    @selection-change="handleSelectionChange">
                    <el-table-column type='selection' width="55" />

                    <el-table-column label="会员编号" align="center" prop="memberId">
                    </el-table-column>
                    <el-table-column label="会员名称" align="center" prop="memberName">
                    </el-table-column>
                    <el-table-column label="会员性别" align="center" prop="memberSex" :formatter="playbackFormat">
                    </el-table-column>
                    <el-table-column label="会员电话" align="center" prop="memberPhone">
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

        <!-- 潜在用户分配框 -->
        <system-dialog :title="prosperctMessageDialog.title" :visible=" prosperctMessageDialog.visible"
            :width="prosperctMessageDialog.width" :height="prosperctMessageDialog.height" @onClose="prosperctClose()"
            @onConfirm="prosperctConfirm()">
            <div slot="content">
                <el-table border style="margin-top: 50px;" :data="prosperctMessage"
                    @selection-change="handleSelectionChange2">
                    <el-table-column type='selection' width="55" />

                    <el-table-column label="会员编号" align="center" prop="prospectId">
                    </el-table-column>
                    <el-table-column label="会员名称" align="center" prop="prospectName">
                    </el-table-column>
                    <el-table-column label="会员性别" align="center" prop="prospectSex" >
                    </el-table-column>
                    <el-table-column label="会员电话" align="center" prop="prospectPhone">
                    </el-table-column>
                    <el-table-column label="状态" align="center" prop="type">
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>


    </el-main>
</template>

<script>
import messageApi from '@/api/message';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'message',
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
            message: {
                empName: "",//客服姓名
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示数量
            },
            //会员分配框参数
            memberMessageDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 800,//窗口宽度
                height: 500//窗口高度
            },
            //潜在用户分配框参数
            prosperctMessageDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 800,//窗口宽度
                height: 500//窗口高度
            },
            //查询会员数据列表
            memberMessage: [],
            //查询潜在用户数据列表
            prosperctMessage: [],
            //分配会员传递参数
            empId: "",
            members: [],


        }
    },
    created() {
        this.search();
    },
    methods: {
        handleSelectionChange(val) {
            this.members = val.map(item => item.memberId)
            console.log(this.members)
        },
        handleSelectionChange2(val) {
            this.members = val.map(item => item.prospectId)
            console.log(this.members)
        },

        playbackFormat(row, column) {
            if (row.memberSex == 0) {
                return '女'
            } else if (row.memberSex == 1) {
                return '男'
            }
        },

        //查询会员列表
        async search(pageNo, pageSize) {
            //修改当前页码
            this.message.pageNo = pageNo
            //修改每页显示条数
            this.message.pageSize = pageSize
            //发送查询请求
            let res = await messageApi.selectEmpList(this.message);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //打开会员分配框窗口
        async openmemberMessageDialog(row) {

            this.empId = row.empId
            this.memberMessageDialog.title = "分配会员"
            this.memberMessageDialog.visible = true
            //发送查询请求
            let res = await messageApi.findMemberByState();
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.memberMessage = res.data
            }
        },
        //会员分配框窗口确定事件
        async memberConfirm() {
            let params = {
                empId: this.empId,
                memberId: this.members
            }
            let res = await messageApi.allocationMember(params);
            //判断是否成功
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //关闭窗口事件
                this.memberMessageDialog.visible = false
                //刷新数据
            } else {
                //提示失败
                this.$message.error(res.message)
            }
        },
        

        //会员分配框窗口取消事件
        memberClose() {
            this.memberMessageDialog.visible = false
        },


        //潜在用户窗口打开事件
        async openprosperctDialog(row) {
            console.log("++++++++++++++++=",row);
            this.prosperctMessageDialog.title = "分配潜在用户"
            this.prosperctMessageDialog.visible = true
            this.empId = row.empId
            //发送查询请求
            let res = await messageApi.findProspectByProspectIs();
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.prosperctMessage = res.data
            }
        },
        //潜在用户窗口确定事件
        async prosperctConfirm() {
            let params = {
                empId: this.empId,
                memberId: this.members
            }
            console.log("----------",params);
           let res = await messageApi.allocationProspect(params);
            //判断是否成功
            if (res.success) {
                //提示成功
                this.$message.success(res.message)
                //关闭窗口事件
                this.prosperctMessageDialog.visible = false
            } else {
                //提示失败
                this.$message.error(res.message)
            }
        },
        //潜在用户窗口关闭事件
        prosperctClose() {
            this.prosperctMessageDialog.visible = false
        },





        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.message.empName = "";
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
