<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="roleList" :height="tableHeight" border stripe style="width: 100%; margin-bottom: 10px">
            <el-table-column prop="id" label="角色编号" width="100" align="center"></el-table-column>
            <el-table-column prop="roleCode" label="角色编码"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="remark" label="角色备注"></el-table-column>
            <el-table-column label="操作" align="center" width="290">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('sys:role:edit')" >编辑
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)"  v-if="hasPermission('sys:role:delete')">删除
                    </el-button>
                    <el-button icon="el-icon-setting" type="primary" size="small" @click="assignRole(scope.row)" v-if="hasPermission('sys:role:assign')" >分配权限
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
        <system-dialog :title="roleDialog.title" :visible="roleDialog.visible" :width="roleDialog.width"
            :height="roleDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="role" ref="roleForm" :rules="rules" label-width="80px" :inline="false" size="small">
                    <el-form-item label="角色编码" prop="roleCode">
                        <el-input v-model="role.roleCode"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="role.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input type="textarea" v-model="role.remark" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>
        <!-- 分配权限树窗口 -->
        <system-dialog :title="assignDialog.title" :visible="assignDialog.visible" :width="assignDialog.width"
            :height="assignDialog.height" @onClose="onAssignClose" @onConfirm="onAssignConfirm">
            <div slot="content">
                <el-tree ref="assignTree" :data="assignTreeData" node-key="id" :props="defaultProps" empty-text="暂无数据"
                    :show-checkbox="true" :highlight-current="true" default-expand-all></el-tree>
            </div>
        </system-dialog>


    </el-main>
</template>


<script>
//导入role.js中的方法
import roleApi from '@/api/roleApi'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
//导入末级节点脚本
import leafUtils from '@/utils/leaf'

    export default {
        name:"roleList",
        //注册组件
        components:{
             SystemDialog
        },
       
        data(){
            return{
                //查询条件
                searchModel:{
                    roleName:"", //角色名称   
                   pageNo:1,//当前页码
                   pageSize:10,//每页显示条数
                   userId:this.$store.getters.userId,//当前登录用户Id
                },
                 roleList:[],//角色列表
                    tableHeight:0,//表格高度
                    pageNo:1,//当前页码
                    total:0,//数据总数量
                    pageSize:10,//每页显示数量
                rules: {
                        roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
                        roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }]
                    },
                    //添加和修改角色窗口属性
                roleDialog: {
                    title: '',
                    visible: false,
                    height: 230,
                    width: 500
                },
                //角色对象
                role: {
                    id: "",
                    roleCode: "",
                    roleName: "",
                    remark: "",
                    createUser: this.$store.getters.userId
                },
                //分配权限窗口属性
                assignDialog: {
                    title: '',
                    visible: false,
                    height: 450,
                    width: 300
                },
                roleId: '', //角色ID
                assignTreeData: [], //树节点数据
                //树节点属性
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }



            }
        },
        created(){
            this.search();
          
        }, 
        mounted(){
            this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 220
            })

        },
        methods:{
            /**
            * 查询
            */
      async search(pageNo,pageSize) {
        //修改当前页码
        this.searchModel.pageNo=pageNo
        //修改每页显示条数
        this.searchModel.pageSize=pageSize
            //发送查询请求
            let res=await roleApi.getRoles(this.searchModel)
            //判断是否发送成功
            if(res.success){
                console.log(res)
                this.roleList=res.data.records;
                this.total=res.data.total;
            }
        },
        /**
        * 重置查询条件
        */
        resetValue() {
            //清空数据
            this.searchModel.roleName="";
            //调用查询方法
            this.search()
        },
        /**
        * 当每页数量发生变化时触发该事件
        */
        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize=size
            //调用查询方法
            this.search(this.pageNo,size)
        },
        /**
        * 当页码发生变化时触发该事件
        */
        handleCurrentChange(page) {
            //修改当前页码
            this.pageNo=page
            //调用查询方法
            this.search(page,this.pageSize)
        },
        /**
            * 打开添加窗口
            */
            openAddWindow() {
                 //清空表单数据
                this.$restForm("roleForm", this.role);
                this.roleDialog.title = '新增角色'//设置窗口标题
                this.roleDialog.visible = true//显示窗口
            },
            /**
            * 窗口取消事件
            */
            onClose() {
                this.roleDialog.visible = false
            },
            /**
            * 窗口确认事件
            */
            onConfirm() {
                //表单验证
                this.$refs.roleForm.validate(async (valid) => {
                    if (valid) {
                         let res =null;
                        //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
                        if(this.role.id===""){
                             //发送添加请求
                          //获取当前系统的登录账号id
                             this.role.createUser=this.$store.getters.userId;
                             console.log("userIrole",this.role);
                            res = await roleApi.add(this.role)
                        }else{
                            //发送修改请求
                            res = await roleApi.update(this.role)
                        }
                     
                        //判断是否成功
                        if(res.success){
                            //提示成功
                            this.$message.success(res.message)
                            //刷新数据
                            this.search(this.pageNo,this.pageSize)
                              //关闭窗口事件
                            this.roleDialog.visible=false
                        }else{
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
            //数据回显
            this.$objCopy(row, this.role); //将当前编辑的数据复制到role对象中
            //设置窗口标题
            this.roleDialog.title = "编辑角色";
            //显示编辑角色窗口
            this.roleDialog.visible = true;
        },
        //打开分配权限窗口
       async assignRole(row){
      
            //将roleId赋值
            this.roleId=row.id
           
            //构建查询参数
            let params={
                roleId:row.id,//角色ID
                userId:this.$store.getters.userId,//用户ID
            }
           
            //发送查询分配权限菜单请求
            let res=await roleApi.getRolePermisson(params);
            console.log(res);
            //判断是否成功
            if(res.success){
                //获取当前登录用户所拥有的所有菜单权限
                let {permissionList}=res.data
                console.log(res)
                //获取当前角色已经拥有的菜单权限
                let {checkList}=res.data
                //判断当前菜单是否是最后一级
                let {setLeaf}=leafUtils();
                //设置菜单权限列表
                let newPermissionList=setLeaf(permissionList);
                //设置树节点数据
                this.assignTreeData=newPermissionList;
                //将回调延迟到下一次DOM 更新循环之后执行,在修改数据之后立即调用该方法,然后等到DOM更新
                this.$nextTick(()=>{
                    //获取菜单节点数据
                    let nodes=this.$refs.assignTree.children;
                    //设置子节点
                    this.setChild(nodes,checkList)
                })

            }
            //设置窗口标题
            this.assignDialog.title=`给${row.roleName}分配权限`;
            //显示窗口
            this.assignDialog.visible=true;
        },
        setChild(childNodes,checkList){
            //判断树否存在子节点
            if(childNodes && childNodes.length>0){
                //循环所有权限
                for(let i=0;i<childNodes.length;i++){
                    //根据data或key获取树组件中的node节点
                    let node =this.$refs.assignTree.getNode(childNodes[i]);
                    //判断使用已经拥有的权限数据
                    if(checkList&& checkList.length>0){
                        //循环遍历已有的权限集合
                        for(let j=0;j<checkList.length;j++){
                            //判断权限ID是否相等
                            if(childNodes[i].id===checkList[j]){
                                //判断节点的状态,如果当前节点是展开的,则将树节点选中
                                if(childNodes[i].open){
                                    this.$refs.assignTree.setChecked(node ,true);
                                    break;
                                }
                            }
                        }
                    }
                    //如果存在子节点.则递归选中
                    if(childNodes[i].children){
                        this.setChild(childNodes[i].children,checkList)
                    }
                }
            }

        },
        /**
        * 分配权限窗口取消事件
        */
            onAssignClose() {
                this.assignDialog.visible = false
            },
            /**
            * 分配权限窗口确认事件
            */
            async onAssignConfirm() {

                //获取选中的树节点的key
              let ids=  this.$refs.assignTree.getCheckedKeys();
                //获取选中节点的父节点ID
                let pids=this.$refs.assignTree.getHalfCheckedKeys();
                //组装选中的节点的ID数据
                let listId=ids.concat(pids);
                //组装参数
                let params={
                     roleId:this.roleId,//当前要分配的角色ID 
                    list:listId,//选中的节点列表
                }
                console.log("roleId=",this.roleId)
                //提交请求
                let res=await roleApi.saveRoleAssign(params);
                //判断是否成功
                if(res.success){
                    //关闭窗口
                    this.assignDialog.visible=false;
                    //提示成功
                    this.$message.success(res.message)
                }else{
                      //提示失败
                    this.$message.error(res.message)
                }
            },

        /**
        * 删除
        */
      async handleDelete(row) {
             //查询该角色下是否存在用户
                let result=await roleApi.check({id:row.id})
                //判断是否删除
                if(!result.success){//返回的后端result.success为fals
                    //提示警告不能删除
                    this.$message.warning(result.message)
                }else{
                    //提示是否确认删除
                    let confirm=await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
                    if(confirm){
                        //发送删除请求
                        let res=await roleApi.delete({id:row.id})
                        //判断是否发送成功
                        if(res.success){
                            //提示成功
                            this.$message.success(res.message)
                            //刷新数据
                            this.search(this.pageNo,this.pageSize)
                        }else{
                            //提示失败
                            this.$message.error(res.message)
                        }
                    }
                }
        }, 

        }

    }
</script>

<style lang="scss" scoped>

</style>