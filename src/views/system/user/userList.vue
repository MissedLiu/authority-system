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
                    <el-input v-model="searchModel.empName" placeholder="请输入员工姓名" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="searchModel.empPhone" placeholder="请输入电话" />
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary"
                        @click="searchEmpList(departmentId,empPhone, pageNo, pageSize)">查询
                    </el-button>
                    <el-button icon="el-icon-delete" @click="resetValue()">重置</el-button>
                    <el-button icon="el-icon-plus" size="small" type="success" @click="openAddWindow()"
                        v-if="hasPermission('sys:emp:add')">新增

                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 用户表格数据 -->
            <el-table :height="tableHeight" :data="userList" border stripe style="width: 100%; margin-bottom: 10px">
                <el-table-column prop="empName" label="姓名"></el-table-column>
                <el-table-column prop="empAge" label="年龄"></el-table-column>
                <el-table-column prop="departmentName" label="所属部门"></el-table-column>
                <el-table-column prop="station" label="岗位"></el-table-column>
                <el-table-column prop="empPhone" label="电话"></el-table-column>
                <el-table-column prop="weix" label="微信"></el-table-column>

                <el-table-column prop="user.username" label="账户名"></el-table-column>

                <el-table-column align="center" width="350" label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row)"
                            v-if="hasPermission('sys:emp:edit')">查看或修改
                        </el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini" @click="handleDelete(scope.row)"
                            v-if="hasPermission('sys:emp:delete')">删除
                        </el-button>

                        <el-button icon="el-icon-setting" type="primary" size="mini"
                            @click="assignUser(pageNo,pageSize,scope.row)" v-if="hasPermission('sys:emp:user')">分配账号
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页工具栏 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加和编辑用户窗口 -->
            <system-dialog :title="empDialog.title" :height="empDialog.height" :width="empDialog.width"
                :visible="empDialog.visible" @onClose="onClose" @onConfirm="onConfirm">
                <div slot="content">
                    <el-form :model="emp" ref="empForm" :rules="rules" label-width="80px" :inline="true" size="small">
                        <el-form-item prop="empName" label="员工姓名">
                            <el-input v-model="emp.empName"></el-input>
                        </el-form-item>
                        <el-form-item prop="empAge" label="年龄">
                            <el-input v-model="emp.empAge"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ">
                            <el-input v-model="emp.qq"></el-input>
                        </el-form-item>
                        <el-form-item label="微信">
                            <el-input v-model="emp.weix"></el-input>
                        </el-form-item>
                        <el-form-item label="岗位">
                            <el-input v-model="emp.station"></el-input>
                        </el-form-item>

                        <el-form-item prop="departmentName" label="所属部门">
                            <el-input v-model="emp.departmentName" :readonly="true" @click.native="selectDepartment()">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="empPhone" label="电话">
                            <el-input v-model="emp.empPhone"></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱">
                            <el-input v-model="emp.emil"></el-input>
                        </el-form-item>
                        <el-form-item prop="empAddress" label="住址">
                            <el-input v-model="emp.empAddress"></el-input>
                        </el-form-item>
                        <el-form-item prop="empSex" label="性别">
                            <el-radio-group v-model="emp.empSex">
                                <el-radio-button label="男" />
                                <el-radio-button label="女" />
                            </el-radio-group>
                        </el-form-item>

                        <br>
                        <!-- 用户头像 -->
                        <el-form-item label="头像">
                            <el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                action="http://localhost:8888/api/oss/file/upload?module=avatar">
                                <img v-if="emp.avatar" :src="emp.avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon" />
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="简介">
                            <el-input type="textarea" v-model="emp.synopsis" :rows="5"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </system-dialog>
            <!-- 所属部门弹框 -->
            <system-dialog :title="parentDialog.title" :width="parentDialog.width" :height="parentDialog.height"
                :visible="parentDialog.visible" @onClose="onParentClose" @onConfirm="onParentConfirm">
                <div slot="content">
                    <el-tree ref="parentTree" :data="parentList" default-expand-all node-key="id" :props="parentProps"
                        :show-checkbox="false" :highlight-current="true" :expand-on-click-node="false"
                        @node-click="parentClick">
                        <div class="customer-tree-node" slot-scope="{ node, data }">
                            <span v-if="data.children.length == 0">
                                <i class="el-icon-document" />
                            </span>
                            <span v-else @click.stop="openParentBtn(data)">
                                <svg-icon v-if="data.open" icon-class="add-s" />
                                <svg-icon v-else icon-class="sub-s" />
                            </span>
                            <span style="margin-left: 3px">{{ node.label }}</span>
                        </div>
                    </el-tree>
                </div>
            </system-dialog>
            <!-- 分配账号窗口 -->
            <system-dialog :title="assignUserDialog.title" :height="assignUserDialog.height"
                :width="assignUserDialog.width" :visible="assignUserDialog.visible" @onClose="onAssignClose"
                @onConfirm="onAssignConfirm">
                <div slot="content">
                    <!-- 分配账号数据列表 -->
                    <el-table ref="assignUserTable" :data="assignUserList" border stripe :height="assignHeight"
                        style="width: 100%; margin-bottom: 10px">
                        <el-table-column prop="id" label="账号编号" />
                        <el-table-column prop="username" label="账号名" />
                        <el-table-column prop="departmentName" label="所属部门" />
                        <el-table-column prop="emp.empName" label="员工" />
                        <el-table-column align="center" width="300" label="操作">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-edit" type="primary" size="mini"
                                    @click="UserRoleAll(scope.row)">详情
                                </el-button>
                                <el-button icon="el-icon-delete" type="danger" size="mini"
                                    @click="DeleteUserAndEmp(scope.row)">解绑
                                </el-button>
                                <el-button icon="el-icon-setting" type="primary" :disabled="disabled" size="mini"
                                    @click="selectUserId(scope.row)">选择
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页工具栏 -->
                    <el-pagination @size-change="assignSizeChange" @current-change="assignCurrentChange"
                        :current-page.sync="pageNo2" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize2"
                        layout="total, sizes, prev, pager, next, jumper" :total="total2" background>
                    </el-pagination>
                </div>
            </system-dialog>

            <!-- 查看详情窗口 -->
            <system-dialog :title="UserAndRoleDialog.title" :height="UserAndRoleDialog.height"
                :width="UserAndRoleDialog.width" :visible="UserAndRoleDialog.visible" @onClose="onUserRoleClose"
                @onConfirm="onUserRoleConfirm">
                <div slot="content">
                    <!-- 账号角色信息数据列表 -->
                    <el-table ref="assignUserRoleTable" :data="assignUserRoleList" border stripe :height="assignHeight"
                        style="width: 100%; margin-bottom: 10px">
                        <el-table-column prop="id" label="账号编号" />
                        <el-table-column prop="username" label="账号名" />
                        <el-table-column prop="roleName" label="岗位名称" />
                    </el-table>

                </div>
            </system-dialog>
        </el-main>
    </el-container>
</template>
<script>
//导入department.js脚本文件
import departmentApi from "@/api/department"
//导入empApi.js脚本文件
import empApi from "@/api/empApi"

//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue'
//导入token
import { getToken } from '@/utils/auth'
export default {
    name: "userList",
    data() {
        //自定义验证规则
        let validatePhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入手机号码"));
                //使用正则表达式进行验证手机号码
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        };
        return {
            disabled: false,
            containerHeight: 0, //容器高度
            deptList: [],//部门列表
            //树节点属性
            defaultProps: {
                children: 'children',
                label: 'departmentName'
            },
            departmentId: "",//部门编号
            tableHeight: 0,//表格的一个高度
            //条件查询对象
            searchModel: {
                empName: "",
                empPhone: "",
                departmentId: "",
                pageNo: 1,
                pageSize: 10
            },
            //表格数据
            userList: [],
            pageNo: 1,//当前页码
            pageSize: 10,//每页显示条数
            total: 0,//总数量
            //添加和修改用户窗口属性
            empDialog: {
                title: '',
                height: 400,
                width: 610,
                visible: false
            },
            //表中员工信息
            emp: {
                empId: "",//员工编号
                empName: "",//员工姓名
                empAge: "",//员工年龄
                empSex: "",//员工性别
                empAddress: "",//员工住址
                departmentId: "",//员工所属部门id
                departmentName: "",//员工所属部门编号
                empPhone: "",//员工电话号码
                emil: "",//员工邮箱
                qq: "",//员工qq
                weix: "",//员工微信
                station: "",//员工岗位
                synopsis: "",//员工简介
                avatar: "",//员工头像

            },
            //  //上传需要携带的数据
            uploadHeader: { "token": getToken() },
            rules: {
                departmentName: [{ required: true, trigger: 'change', message: '请选择所属部门' }],
                empName: [{ required: true, trigger: 'blur', message: '请填写员工姓名' }],
                empAge: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
                empPhone: [{ trigger: 'blur', validator: validatePhone }],
                empSex: [{ required: true, trigger: 'change', message: '请选择性别' }],
                empAddress: [{ required: true, trigger: 'blur', message: '请输入住址' }]
            },
            //选择所属部门窗口属性
            parentDialog: {
                title: '选择所属部门',
                width: 300,
                height: 450,
                visible: false
            },
            //树节点属性
            parentProps: {
                children: 'children',
                label: 'departmentName'
            },
            parentList: [], //所属部门节点数据
            //分配账号窗口属性
            assignUserDialog: {
                title: '',//窗口标题
                visible: false,//窗口是否显示
                height: 450,//窗口显示高度
                width: 900//窗口显示宽度
            },
            //角色对象
            //打开分配账号窗口的分页
            userVo: {
                pageNo: 1,
                pageSize: 10,
                userId: "",
                total: 0,
            },
            assignUserList: [], //角色列表
            assignHeight: 500, //分配角色表格高度
            selectedIds: [], //被选中的角色id
            selectedUserId: "", //被分配角色的用户ID
            pageNo: 1,//当前页码
            total: 0,//数据总数量
            pageSize: 10,//每页显示数量
            pageNo2: 1,//当前页码
            total2: 0,//数据总数量
            pageSize2: 10,//每页显示数量
            // //查询条件
            // searchModel:{
            //    pageNo:1,//当前页码
            //    pageSize:10,//每页显示条数
            // },
            //账户详情信息窗口属性
            UserAndRoleDialog: {
                title: '详情信息',
                width: 600,
                height: 250,
                visible: false
            },
            //账号信息数据列表
            assignUserRoleList: [],
            emps: {
                empId: "",//接收员工id
            },




        }
    },
    //注册组件
    components: {
        SystemDialog
    },
    created() {
        this.search();
        this.searchEmpList(this.departmentId);
    },
    mounted() {
        this.$nextTick(() => {
            //容器高度
            this.containerHeight = window.innerHeight - 38;
            //表格高度
            this.tableHeight = window.innerHeight - 220;
            //角色表格高度
            this.assignHeight = window.innerHeight - 350;

        })

    },
    methods: {
        /**
         * 查询部门列表
         */
        async search() {
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
            //查询用户信息
            this.searchEmpList(this.departmentId)
        },
        /**
    * 点击树节点时触发
    * @param  data 
    */
        changeIcon(data) {
            data.open = !data.open;
            this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open
        },
        //查询用户列表
        async searchEmpList(departmentId, pageNo = 1, pageSize = 10) {
            //将查询条件交给searchModel
            this.searchModel.departmentId = departmentId;
            this.searchModel.pageNo = pageNo;
            this.searchModel.pageSize = pageSize;
            //发生查询请求
            let res = await empApi.getEmpList2(this.searchModel);
            console.log(res)
            if (res.success) {
                //赋值
                this.userList = res.data.records;
                this.total = res.data.total;
            }
        },
        //分页改变每页条数
        handleSizeChange(size) {
            //将改变的页数赋值
            this.pageSize = size;
            //查询
            this.searchEmpList(this.departmentId, this.pageNo, size)
        },
        //当前页码发生变化时触发
        handleCurrentChange(page) {
            //将改变的页码赋值
            this.pageNo = page;
            //查询
            this.searchEmpList(this.departmentId, page, this.pageSize)
        },
        /**
         * 重置
         */
        resetValue() {
            //清空查询条件
            this.searchModel.empName = "";
            this.searchModel.empPhone = "";
            this.searchModel.departmentId = "";
            this.searchModel.pageNo = 1;
            this.searchModel.pageSize = 10;
            //查询
            this.searchEmpList(this.departmentId)
        },
        /**
         * 新增打开窗口
         */
        openAddWindow() {
            this.$restForm("empForm", this.emp);
            this.empDialog.title = "新增"
            this.empDialog.visible = true
        },
        //上传成功回调
        handleAvatarSuccess(res, file) {
            this.emp.avatar = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        //上传校验
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        /**
        * 打开选择所属部门窗口
        */
        async selectDepartment() {
            //发送查询请求
            let res = await departmentApi.getParentTreeList()
            //判断
            if (res.success) {
                this.parentList = res.data;
            }
            //显示窗口
            this.parentDialog.visible = true
        },
        //上级部门树节点点击事件
        parentClick(data) {
            this.emp.departmentId = data.id
            this.emp.departmentName = data.departmentName
        },
        //上级部门树加号 减号 图标点击事件
        openParentBtn(data) {
            data.open = !data.open
            this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open
        },
        //所属部门关闭事件
        onParentClose() {
            this.parentDialog.visible = false
        },
        //所属部门确认事件
        onParentConfirm() {
            this.parentDialog.visible = false
        },
        //打开编辑按钮
        handleEdit(row) {
            console.log("row===", row)
            //数据回显
            this.$objCopy(row, this.emp); //将当前编辑的数据复制到user对象中
            //设置窗口标题
            this.empDialog.title = "修改信息";
            //显示编辑角色窗口
            this.empDialog.visible = true;
        },
        /**
         * 删除
         */
        async handleDelete(row) {
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await empApi.deleteById({ id: row.empId })
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.searchEmpList()
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }

            }
        },
        /**
         * 关闭窗口
         */
        onClose() {
            this.empDialog.visible = false
        },
        /**
         * 窗口确认键
         */
        onConfirm() {
            //表单验证
            this.$refs.empForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let res = null;
                    //判断当前是新增还是修改
                    console.log(this.emp);
                    if (this.emp.empId === "") {
                        //新增,发送添加请求
                        console.log(this.emp);
                        res = await empApi.addEmp(this.emp)
                    } else {
                        //发送修改请求
                        res = await empApi.update(this.emp);
                    }
                    //判断是否成功
                    if (res.success) {
                        //提示
                        this.$message.success(res.message);
                        //刷新
                        this.searchEmpList(this.departmentId, this.pageNo, this.pageSize);
                        //关闭窗口
                        this.empDialog.visible = false;
                    } else {
                        //提示
                        this.$message.error(res.message);
                    }
                }
            })
        },
        //分配窗口打开事件
        async assignUser(pageNo2, pageSize2, row) {
            console.log(pageNo2, pageSize2)
            this.assignUserDialog.title = "分配账号"
            this.assignUserDialog.visible = true

            //修改当前页码
            this.userVo.pageNo = this.pageNo2
            //修改每页显示条数
            this.userVo.pageSize = this.pageSize2
            
            this.pageSize2 = 10;
            let res = await empApi.getUserAllPage(this.userVo);
            this.total2 = res.data.total;
            if (res.success) {
                this.assignUserList = res.data.records;

                console.log(this.assignUserList)
            }
            this.emps.empId = row.empId;
            
        },
        //显示条数改变时
        assignSizeChange(size) {
            console.log(size)
            this.pageSize2 = size;
            this.assignUser(this.pageNo2, size)
        },
        //当前页码改变时
        assignCurrentChange(page) {
            console.log(page)
            this.pageNo2 = page;
            this.assignUser(page, this.pageSize2)
        },

        //分配账号窗口关闭事件
        onAssignClose() {

            this.assignUserDialog.visible = false


        },
        //分配账号窗口确认事件
        onAssignConfirm() {
            this.assignUserDialog.visible = false
            this.searchEmpList(this.departmentId, this.pageNo, this.pageSize);
        },
        /**
         * 点击详情事件
         */
        async UserRoleAll(row) {
            this.UserAndRoleDialog.title = "账号详细"
            this.UserAndRoleDialog.visible = true;
            let res = await empApi.getUserRoleAll({ id: row.id });
            if (res.success) {
                console.log(res.data)
                console.log(res.data.roleName)

                if (res.data.roleName = null) {
                    //提示警告无法查看详情
                    this.$message.warning("该账号未分配角色")
                } else {
                    this.assignUserRoleList = res.data
                }
            }

            console.log(res);
        },
        /**
         * 详情关闭事件
         */
        onUserRoleClose() {
            this.UserAndRoleDialog.visible = false;
        },
        /**
         * 详情确认事件
         */
        onUserRoleConfirm() {
            this.UserAndRoleDialog.visible = false;
        },
        /**
         * 选择事件
         */
        async selectUserId(row) {
            console.log(row.id)
            console.log(this.empId)
            let params = {
                userId: row.id,
                empId: this.emps.empId
            }
            //提示是否确认给该员工分配账号
            let confirm = await this.$myconfirm("确定给该员工分配该账号嘛?")//await代表同步
            if (confirm) {
                let res = await empApi.updateUserEmp(params)
                if (res.success) {

                    this.$message.success(res.message)
                    this.assignUser();

                } else {
                    this.$message.error(res.message)
                }
            }


        },
        /**
         * 解绑账号与员工关系
         */
        async DeleteUserAndEmp(row) {
            let confirm = await this.$myconfirm("确定要解绑该账号与员工的关系嘛?");
            if (confirm) {
                let res = await empApi.deleteUserAndEmp({ id: row.id });
                if (res.success) {
                    this.$message.success(res.message);
                } else {
                    this.$message.error(res.message);
                }

            }


        }

    }

}
</script>


<style lang="scss">
//用户头像
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar-uploader img {
    width: 178px;
    height: 178px;
    display: block;
}
</style>