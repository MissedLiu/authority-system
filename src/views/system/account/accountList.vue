<template>
    <el-container :style=" { height: containerHeight + 'px' }">
        <el-aside style="
        padding: 10px 0px 0px 0px;
        background: #fff;
        border-right: 1px solid #dfe6ec;
        " width="200px">
            <el-tree style="font-size: 14px" ref="leftTree" :data="deptList" node-key="id" :props="defaultProps"
                default-expand-all empty-text="暂无数据" :show-checkbox="false" :highlight-current="true"
                :expand-on-click-node="false" @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div>
                        <span v-if="data.children.length == 0">
                            <i class="el-icon-document"></i>
                        </span>
                        <span v-else @click.stop="changeIcon(data)">
                            <svg-icon v-if="data.open" icon-class="eye" />
                            <svg-icon v-else icon-class="tree" />
                        </span>
                        <!-- 名称 -->
                        <span style="margin-left: 3px">{{ node.label }}</span>
                    </div>
                </div>
            </el-tree>
        </el-aside>
        <el-main>
            <!-- 查询条件 -->
            <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
                <el-form-item>
                    <el-input v-model="searchModel.username" placeholder="请输入账号名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                    <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="openAddWindow()"
                        v-if="hasPermission('sys:account:add')">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 数据表格 -->
            <el-table :data="userList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
                <el-table-column prop="id" label="账户编号" width="100" align="center"></el-table-column>
                <el-table-column prop="username" label="账户名"></el-table-column>
                <el-table-column prop="departmentName" label="所属部门"></el-table-column>
                <el-table-column prop="emp.empName" label="员工"></el-table-column>
                <el-table-column label="操作" align="center" width="290">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope.row)"
                            v-if="hasPermission('sys:account:edit')">修改
                        </el-button>
                        <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)"
                            v-if="hasPermission('sys:account:delete')">删除
                        </el-button>
                        <el-button icon="el-icon-setting" type="primary" size="small" @click="assignRole(scope.row)"
                            v-if="hasPermission('sys:account:role') && scope.row.id!=1">分配角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页工具栏 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加和修改角色窗口 -->
            <system-dialog :title="userDialog.title" :visible="userDialog.visible" :width="userDialog.width"
                :height="userDialog.height" @onClose="onClose" @onConfirm="onConfirm()">
                <div slot="content">
                    <el-form :model="user" ref="userForm" :rules="rules" label-width="80px" :inline="false"
                        size="small">
                        <el-form-item label="账户名" prop="username">
                            <el-input v-model="user.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="user.password"></el-input>
                        </el-form-item>
                        <el-form-item label="所属部门" prop="departmentName" :readonly="true"
                            @click.native="openSelectDeptWindow()">
                            <el-input v-model="user.departmentName"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </system-dialog>
            <!-- 分配角色窗口 -->

            <!-- 选择所属部门的窗口 -->
            <system-dialog :title="parentDialog.title" :visible="parentDialog.visible" :width="parentDialog.width"
                :height="parentDialog.height" @onClose="onParentClose()" @onConfirm="onParentConfirm()">
                <div slot="content">
                    <el-tree ref="parentTree" :data="treeList" node-key="id" :props="defaultProps" empty-text="暂无数据"
                        :highlight-current="true" :default-expand-all="true" :expand-on-click-node="false"
                        @node-click="handlerNodeClick">
                        <div class="customer-tree-node" slot-scope="{node,data}">
                            <!-- 判断当前子节点的长度是否为零 -->
                            <span v-if="data.children.length === 0">
                                <i class="el-icon-doucument"></i>
                            </span>
                            <span v-else @click="change(data)">
                                <svg-icon v-if="data.open " icon-class="eye"></svg-icon>
                                <svg-icon v-else icon-class="tree"></svg-icon>
                            </span>
                            <span style="margin-left:3px">{{node.label}}</span>
                        </div>
                    </el-tree>

                </div>
            </system-dialog>
            <!-- 分配角色窗口 -->
            <system-dialog :title="assignDialog.title" :height="assignDialog.height" :width="assignDialog.width"
                :visible="assignDialog.visible" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
                <div slot="content">
                    <!-- 分配角色数据列表 -->
                    <el-table ref="assignRoleTable" :row-key="getRowKeys" :data="assignRoleList" border stripe
                        :height="assignHeight" style="width: 100%; margin-bottom: 10px"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" width="55"
                            align="center"></el-table-column>
                        <el-table-column prop="roleCode" label="角色编码" />
                        <el-table-column prop="roleName" label="角色名称" />
                        <el-table-column prop="remark" label="角色备注" />
                    </el-table>
                    <!-- 分页工具栏 -->
                    <el-pagination @size-change="assignSizeChange" @current-change="assignCurrentChange"
                        :current-page.sync="roleVo.pageNo" :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="roleVo.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="roleVo.total" background>
                    </el-pagination>
                </div>
            </system-dialog>
        </el-main>
    </el-container>
</template>


<script>

//导入userApi.js中的方法
import userApi from '@/api/userApi'

//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
//导入末级节点脚本
import leafUtils from '@/utils/leaf'
//导入department.js脚本文件
import departmentApi from "@/api/department"
export default {
    name: "roleList",
    //注册组件
    components: {
        SystemDialog
    },

    data() {
        return {
            containerHeight: 0, //容器高度
            //查询条件
            searchModel: {
                username: "", //用户名   
                createUser:"",//当前创建人账户id
                pageNo: 1,//当前页码
                pageSize: 10,//每页显示条数
                departmentId: "",//所属部门id
            },
            userList: [],//角色列表
            tableHeight: 0,//表格高度
            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量
            rules: {
                username: [{ required: true, trigger: 'blur', message: '请输入账户名' }],
                password: [{ required: true, trigger: 'blur', message: '请设置密码' }],
                departmentName: [{ required: true, trigger: 'change', message: '请选择所属部门' }]
            },
            //添加和修改角色窗口属性
            userDialog: {
                title: '',
                visible: false,
                height: 230,
                width: 500
            },
            //上传需要携带的数据

            //角色对象
            user: {
                id: "",
                username: "",//账户名
                password: "",//密码
                departmentId: "",//所属部门id
                departmentName: "",//所属部门
                createUser:"",//当前创建人账户id
                
            },
            //分配权限窗口属性
            assignDialog: {
                title: '',
                visible: false,
                height: 450,
                width: 300
            },
            userId: '', //角色ID
            emp: "",
            assignTreeData: [], //树节点数据
            //树节点属性
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            //选择所属部门的属性
            parentDialog: {
                title: "选择所属部门",//窗口标题
                visible: false,//是否显示窗口
                width: 300,//窗口宽度
                height: 400//窗口高度

            },
            treeList: [],//树形数据
            //树形组件默认属性值
            defaultProps: {
                children: 'children',
                label: 'departmentName',
            },
            dept: {
                id: "",//部门编号
                departmentName: "",//部门名称
                pid: "",//所属部门名称
                parentName: "",//所属部门名称
                phone: "",//手机号
                address: "",//地址
                orderNum: "",//序号

            },
            //分配角色窗口属性
            assignDialog: {
                title: "",
                visible: false,
                width: 800,
                height: 410,
            },
            //角色对象
            roleVo: {
                pageNo: 1,
                pageSize: 10,
                userId: "",
                total: 0,
            },
            deptList: [],//部门列表
            assignRoleList: [], //角色列表
            assignHeight: 500, //分配角色表格高度
            selectedIds: [], //被选中的角色id
            selectedUserId: "", //被分配角色的用户ID
            userId: "",//当前账户id
            falg: 0,

        }
    },
    created() {
        this.search2();
        this.search();

    },
    mounted() {
        this.$nextTick(() => {
            //容器高度
            this.containerHeight = window.innerHeight - 38;
            //表格高度
            this.tableHeight = window.innerHeight - 220;

        })

    },

    methods: {
        /**
    * 查询部门列表
    */
        async search2() {
            //发送查询请求
            let res = await departmentApi.getDetpartmentlist(null)
            //判断是否成功
            if (res.success) {
                this.deptList = res.data
            }
        },
        /**
         * 左侧部门点击事件
         */
        handleNodeClick(data) {
            //将当前选中的节点Id 赋值给departmentId
            this.departmentId = data.id
            console.log(this.departmentId);
            //查询用户信息
            this.search(this.departmentId)
        },
        /**
    * 点击树节点时触发
    * @param  data 
    */
        changeIcon(data) {
            data.open = !data.open;
            this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open
        },
        /**
        * 查询
        */
        async search(departmentId, pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo
            //修改每页显示条数
            this.searchModel.pageSize = pageSize
            //所属部门id
            this.searchModel.departmentId =  this.departmentId
            this.searchModel.createUser=this.$store.getters.userId;//当前账号id
            //发送查询请求
            let res = await userApi.getUserAllPage(this.searchModel)
            //判断是否发送成功
            if (res.success) {
                console.log(res.data.records)
                this.userList = res.data.records;
                this.total = res.data.total;
                for (let i = 0; i < this.userList.length; i++) {
                    if (this.userList[i].emp.empName == null) {
                        this.userList[i].emp.empName = "未分配";
                    }
                }
            }
        },
        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.searchModel.username = "";
            //调用查询方法
            this.search()
        },
        /**
        * 当每页数量发生变化时触发该事件
        */
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
            * 打开添加窗口
            */
        openAddWindow() {
            //清空表单数据
            this.$restForm("userForm", this.user);
            this.userDialog.title = '新增角色'//设置窗口标题
            this.userDialog.visible = true//显示窗口
        },
        /**
        * 窗口取消事件
        */
        onClose() {
            this.userDialog.visible = false
        },
        /**
        * 窗口确认事件
        */
        onConfirm() {
            //表单验证
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    this.user.createUser=this.$store.getters.userId;//当前账号id
                    console.log( this.user.createUser)
                    //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
                    if (this.user.id === "") {
                        //发送添加请求
                        res = await userApi.add(this.user);

                    } else {
                        //发送修改请求
                        res = await userApi.update(this.user)

                    }

                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.search(this.departmentId,this.pageNo, this.pageSize)
                        //关闭窗口事件
                        this.userDialog.visible = false
                    } else {
                        //提示失败
                        this.$message.error(res.message)

                    }

                }
            });
        },
        /**
        * 打开编辑窗口
        */
        handleEdit(row) {
            console.log("row=", row)
            //数据回显
            this.$objCopy(row, this.user); //将当前编辑的数据复制到user对象中
            //设置窗口标题
            this.userDialog.title = "编辑账号";
            //显示编辑角色窗口
            this.userDialog.visible = true;
        },
        /**
              * @selectable 设置不可点击的状态
              * @param row.pay_status === 0 是未支付的状态，这样的状态是可以选择的。未支付的是可以被选中的，已支付的是不可以被选中的
              */
        selectable(row, index) {
            if (row.id === 1) {
                return false;
            } else {
                return true;
            }
        },
        /**
        * 删除
        */
        async handleDelete(row) {
            //查询该账户下是否存在员工
            let result = await userApi.checkempByUserId({ id: row.id })
            //判断是否删除
            if (!result.success) {//返回的后端result.success为fals
                //提示警告不能删除
                this.$message.warning(result.message)
            } else {
                //提示是否确认删除
                let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
                if (confirm) {
                    //发送删除请求
                    let res = await userApi.delete({ id: row.id })
                    //判断是否发送成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.search(this.departmentId,this.pageNo, this.pageSize)
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }
            }
        },
        //打开所属部门的窗口
        async openSelectDeptWindow() {
            this.parentDialog.visible = true
            let res = await departmentApi.getParentTreeList();
            console.log(res)
            //判断是否成功
            if (res.success) {
                this.treeList = res.data
            }
        },
        /**
         * 树节点点击事件
         * @param data 
         */
        handlerNodeClick(data) {
            this.user.departmentId = data.id;
            this.user.departmentName = data.departmentName;
        },
        /**
         * 点击树节点时触发
         * @param  data 
         */
        change(data) {
            data.open = !data.open;
            this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
        },
        //所属部门取消关闭事件 
        onParentClose() {
            this.parentDialog.visible = false
        },
        //所属部门确认事件
        onParentConfirm() {
            this.parentDialog.visible = false
        },


        //分配角色
        async assignRole(row) {
            //防止回显出现问题
            this.selectedIds = [];
            this.selectedUserId = "";
            //被分配用户的id
            this.selectedUserId = row.id;
            this.userId = row.id
            let checkName = await userApi.checkEmpName({ id: row.id });
            if (!checkName.success) {//返回为false
                //提示警告不能分配权限
                this.$message.warning(checkName.message);
            } else {
                //显示窗口
                this.assignDialog.visible = true;
                //设置标题
                this.assignDialog.title = `给【${row.emp.empName}】分配角色`;
                //调用查询角色列表
                await this.getAssignRoleList();

            }
        },
        /**
         * 查询当前用户所拥有的角色信息
         * @param {*} pageNo 
         * @param {*} pageSize 
         */
        async getAssignRoleList(pageNo = 1, pageSize = 10) {
            // this.selectedUserId = "";
            this.selectedIds = [];
            //封装查询条件
            this.roleVo.userId = this.$store.getters.userId;
            this.roleVo.pageNo = pageNo;
            this.roleVo.pageSize = pageSize;
            //发送查询请求
            let ress = await userApi.getAssignRoleList(this.roleVo);
            //赋值
            this.assignRoleList = ress.data.records;
            this.roleVo.total = ress.data.total;
            console.log("角色=", ress.data.records);

            //封装查询条件
            let params = { userId: this.userId }
            //发送根据用户ID查询用户角色列表的请求
            let res = await userApi.getRoleIdByUserId(params);
            console.log("角色列表=", res.data);
            //如果存在想关的角色数据
            if (res.success) {
                //将查询道德角色Id列表赋值给选中的角色数组
                this.selectedIds = res.data;
                //循环遍历
                //查询数据库中已存在的角色id
                this.selectedIds.forEach((key) => {
                    //查询表格显示的角色id
                    this.assignRoleList.forEach((item) => {
                        if (key === item.id) {
                            //如果相等则复选框选中
                            this.$refs.assignRoleTable.toggleRowSelection(item, true)
                        }
                    })
                })
            }



        },
        /**
        * 分配角色取消事件
        */
        onAssignClose() {
            //弹框表格复选框清空 
            this.$nextTick(() => {
                this.$refs.assignRoleTable.clearSelection();
            })
            //隐藏窗口
            this.assignDialog.visible = false;
        },
        /**
        * 分配角色确认事件
        */
        async onAssignConfirm() {
            //判断当前是否有选中角色
            if (this.selectedIds.length === 0) {
                this.$message.warning("请选择要分配的角色!")
                return
            }
            let params = {
                userId: this.selectedUserId,
                roleIds: this.selectedIds
            }
            //发送保存用户角色的请求
            let res = await userApi.assignRoleSave(params)
            //判断是否成功
            if (res.success) {
                this.$message.success(res.message);
                //弹框表格复选框清空 
                this.$nextTick(() => {
                    this.$refs.assignRoleTable.clearSelection();
                })
                //隐藏窗口
                this.assignDialog.visible = false;
            } else {
                this.$message.error(res.message);
            }

        },
        /**
         * 复选框选中事件
         * @param  rows 
         */
        handleSelectionChange(rows) {
            //拿到选中的ID 值
            this.selectedIds = rows.map(item => item.id);
        },
        /**
         * 当每页数量发生变化时触发该事件
         * @param  size 
         */
        assignSizeChange(size) {
            this.roleVo.pageSize = size; //将每页显示的数量交给成员变量
            this.getAssignRoleList(this.roleVo.pageNo, size);

        },
        /**
         *  当页码发生变化时触发该事件
         * @param page 
         */
        assignCurrentChange(page) {
            this.roleVo.pageNo = page;

            //调用查询方法
            this.getAssignRoleList(page, this.roleVo.pageSize);

        },
        getRowKeys(row) {
            console.log("=", row)
            return row.id;
        },
    },
}
</script>

<style lang="scss" scoped>

</style>