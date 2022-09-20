<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form  ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item >
                <el-input v-model="searchModel.departmentName" placeholder="请输入部门名称"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow"
                
                 >新增</el-button>
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
      <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children' }" >
            <el-table-column prop="departmentName" label="部门名称"/>
            <el-table-column prop="parentName"  label="所属部门"/>
            <el-table-column prop="phone" label="部门电话"/>
            <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
            <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleEdit(scope.row)" 
           
            >编辑 </el-button >
            <el-button icon="el-icon-close" type="danger"  size="small" @click="handleDelete(scope.row)" 
           
            >删除 </el-button >
            </template>
    </el-table-column>
    </el-table>
    <!-- 添加和修改窗口 -->
    <system-dialog 
    :title="deptDialog.title" 
    :visible="deptDialog.visible" 
    :width="deptDialog.width" 
    :height="deptDialog.height" 
    @onClose="onClose" 
    @onConfirm="onConfirm"
    >
    <div slot="content">
    <el-form :model="dept" ref="deptForm" :rules="rules" label-width="80px" :inline="true" size="small">
        <el-form-item label="所属部门" prop="parentName" :readonly="true" 
            @click.native="openSelectDeptWindow()">
            <el-input v-model="dept.parentName"></el-input>
        </el-form-item>
           <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="dept.departmentName"></el-input>
        </el-form-item>
            <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
        </el-form-item>
            
         <el-form-item label="序号">
            <el-input v-model="dept.orderNun"></el-input>
        </el-form-item>
       
    </el-form>
    
    </div>
    </system-dialog>
    <!-- 选择所属部门的窗口 -->
    <system-dialog
        :title="parentDialog.title" 
        :visible="parentDialog.visible" 
        :width="parentDialog.width" 
        :height="parentDialog.height" 
        @onClose="onParentClose()" 
        @onConfirm="onParentConfirm()"
    >
        <div slot="content">
           <el-tree 
           ref="parentTree" 
           :data="treeList" 
           node-key="id" 
           :props="defaultProps" 
           empty-text="暂无数据" 
           :highlight-current="true" 
           :default-expand-all="true"
           :expand-on-click-node="false"
           @node-click="handlerNodeClick">
           <div class="customer-tree-node" slot-scope="{node,data}">
            <!-- 判断当前子节点的长度是否为零 -->
            <span v-if="data.children.length === 0">
                <i class="el-icon-doucument"></i>
            </span>
            <span v-else @click="change(data)">
                <svg-icon v-if="data.open " icon-class="eye"></svg-icon>
                  <svg-icon v-else  icon-class="tree"></svg-icon>
            </span>
            <span style="margin-left:3px">{{node.label}}</span>
            </div>
           </el-tree>
           
        </div>
    </system-dialog>
    </el-main>
    
    </template>
    
    <script>
    //导入department.js脚本文件
    import departmentApi from "@/api/department"
    //先导入systemDialog组件
    import SystemDialog from "@/components/system/SystemDialog.vue";
        export default {
            name: "department",
            //注册组件
            components:{
                SystemDialog
            },
            data(){
                return{
                    searchModel:{
                     departmentName:"",//部门名字
                    },
                    tableData:[],//表格数据
                    deptDialog:{
                        title:"",//窗口标题
                        visible:false,//是否显示窗口
                        width:560,//窗口宽度
                        height:170//窗口高度
    
                    },
                    dept:{
                        id:"",//部门编号
                        departmentName:"",//部门名称
                        pid:"",//所属部门名称
                        parentName:"",//所属部门名称
                        phone:"",//手机号
                        address:"",//地址
                        orderNum:"",//序号
    
                    },
                    rules:{
                         parentName: [{ required: true,message: '请选择所属部门',trigger: 'change',}],
                         departmentName: [{ required: true,message: '请输入部门名称',trigger: 'blur',}],
                    },
                    //选择所属部门的属性
                    parentDialog:{
                        title:"选择所属部门",//窗口标题
                        visible:false,//是否显示窗口
                        width:300,//窗口宽度
                        height:400//窗口高度
    
                    },
                    treeList:[],//树形数据
                    //树形组件默认属性值
                 defaultProps : {
                        children: 'children',
                        label: 'departmentName',
                    }
                }
            },
            //初始化时调用
            created(){
                this.search();
            },
            methods:{
                 /**
            * 重置查询条件
            */
            resetValue() {
                //清空数据
                this.searchModel.departmentName="";
                //调用查询方法
                this.search()
            },
                /**
                 * 查询部门列表
                 */
                async search(){
                    //发送查询请求
                    let res=await departmentApi.getDetpartmentlist(this.searchModel)
                    //判断是否成功
                    if(res.success){
                        console.log(res.data)
                          console.log(res.data)
                        this.tableData=res.data
                    }
                },
                //打开添加窗口
                openAddwindow(){
                    //
                    this.$restForm("deptForm",this.dept);
                    //设置属性
                    this.deptDialog.title='新增部门',
                    this.deptDialog.visible=true
                },
                //窗口关闭事件
                onClose(){
                 this.deptDialog.visible=false
                },
                //窗口确认事件
                onConfirm(){
                    //进行表单验证
                    this.$refs.deptForm.validate(async (valid)=>{
                        //如果验证通过
                        if(valid){
                              let res =null;
                           
                            //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
                            if(this.dept.id===""){
                                 //发送添加请求
                                res = await departmentApi.addDept(this.dept)
                            }else{
                                //发送修改请求
                                res = await departmentApi.updateDept(this.dept)
                            }
                         
                            //判断是否成功
                            if(res.success){
                                //提示成功
                                this.$message.success(res.message)
                                //刷新数据
                                this.search()
                                  //关闭窗口事件
                                this.deptDialog.visible=false
                            }else{
                                //提示失败
                                  this.$message.error(res.message)
                                 
                            }
                   
                        }
                    })
                  
                },
                //打开所属部门的窗口
               async openSelectDeptWindow(){
                    this.parentDialog.visible=true
                    let res= await departmentApi.getParentTreeList();
                    console.log(res)
                    //判断是否成功
                    if(res.success){
                        this.treeList=res.data 
                    }
                },
                /**
                 * 树节点点击事件
                 * @param data 
                 */
                handlerNodeClick(data){
                    this.dept.pid=data.id;
                    this.dept.parentName = data.departmentName;
                },  
                /**
                 * 点击树节点时触发
                 * @param  data 
                 */
                change(data){
                        data.open=!data.open;
                        this.$refs.parentTree.store.nodesMap[data.id].expanded =!data.open
                },
                //所属部门取消关闭事件 
                onParentClose(){
                    this.parentDialog.visible=false
                },
                //所属部门确认事件
                onParentConfirm(){
                    this.parentDialog.visible=false
                },
                //修改按钮实现
                handleEdit(row){
                    //数据回显
                    this.$objCopy(row,this.dept)
                    //设置窗口标题
                    this.deptDialog.title='编辑部门'
                    //显示窗口
                    this.deptDialog.visible=true
    
                },
                //删除操作
               async handleDelete(row){
                    //查询部门下是否存在子部门或者用户
                    let result=await departmentApi.checkDepartment({id:row.id})
                    //判断是否删除
                    if(!result.success){//返回的后端result.success为fals
                        //提示警告不能删除
                        this.$message.warning(result.message)
                    }else{
                        //提示是否确认删除
                        let confirm=await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
                        if(confirm){
                            //发送删除请求
                            let res=await departmentApi.deleteById({id:row.id})
                            //判断是否发送成功
                            if(res.success){
                                //提示成功
                                this.$message.success(res.message )
                                //刷新数据
                                this.search()
                            }else{
                                //提示失败
                                this.$message.error(res.message)
                            }
                        }
                    }
                }
    
            }
    
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
    .el-tree > .el-tree-node:before {
    border-left: none;
    }
    .el-tree > .el-tree-node:after {
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
    .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
    }
    .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
    }
    }
    ::v-deep .el-tree > div {
    &::before {
    display: none;
    }
    &::after {
    display: none;
    }
    }
    </style>