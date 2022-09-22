<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form  ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item >
                <el-input v-model="searchModel.stockInName" placeholder="请输入库存物品名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow">新增</el-button>
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
            row-key="storeId"
            default-expand-all
             >
            <el-table-column prop="stockinName" label="物品名称"/>
            <el-table-column prop="stockinNum"  label="物品数量"/>
            <el-table-column prop="storeNum" label="库存数量"/>
            <el-table-column prop="stockinType" label="物品类型"/>
            <el-table-column prop="brand" label="品牌"/>
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
    :title="storeDialog.title" 
    :visible="storeDialog.visible" 
    :width="storeDialog.width" 
    :height="storeDialog.height" 
    @onClose="onClose" 
    @onConfirm="onConfirm"
    >
    <div slot="content">
    <el-form :model="store" ref="storeForm" :rules="rules" label-width="80px" :inline="true" size="small">
        <el-form-item label="物品编号" prop="poId" >
            <el-input v-model="store.poId"></el-input>
        </el-form-item>
           <el-form-item label="物品名称" prop="stockinName"> 
            <el-input v-model="store.stockinName"></el-input>
        </el-form-item>
            <el-form-item label="物品数量" prop="stockinNum">
            <el-input v-model="store.stockinNum"></el-input>
        </el-form-item>
         <el-form-item label="物品类型" prop="stockinType">
            <el-input v-model="store.stockinType"></el-input>
        </el-form-item>
        <el-form-item label="物品品牌" prop="brand">
            <el-input v-model="store.brand"></el-input>
        </el-form-item>
       
    </el-form>
    
    </div>
    </system-dialog>
    </el-main>
    
    </template>

<script>
    //导入department.js脚本文件
    import storeApi from "@/api/store"
    //先导入systemDialog组件
    import SystemDialog from "@/components/system/SystemDialog.vue";
        export default {
            name: "store",
            //注册组件
            components:{
                SystemDialog
            },
            data(){
                return{
                    searchModel:{
                        stockInName:"",//库存物品名
                    },
                    tableData:[],//表格数据
                    storeDialog:{
                        title:"",//窗口标题
                        visible:false,//是否显示窗口
                        width:560,//窗口宽度
                        height:170//窗口高度
    
                    },
                    store:{
                        storeId:"",//库存编号
                        poId:"",//物品编号
                        stockinName:"",//物品名称
                        stockinNum:"",//物品数量
                        storeNum:"",//库存数量
                        stockinType:"",//物品类型
                        brand:""//品牌      
    
                    },
                    rules:{
                         poId: [{ required: true,message: '请输入物品编号',trigger: 'blur',}],
                         stockinName: [{ required: true,message: '请输入物品名称',trigger: 'blur',}],
                         stockinNum: [{ required: true,message: '请输入物品数量',trigger: 'blur',}],
                         stockinType: [{ required: true,message: '请输入物品类型',trigger: 'blur',}],
                         brand: [{ required: true,message: '请输入品牌',trigger: 'blur',}],
                    },
                    //选择所属部门的属性
                    parentDialog:{
                        title:"选择所属部门",//窗口标题
                        visible:false,//是否显示窗口
                        width:300,//窗口宽度
                        height:400//窗口高度
    
                    },
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
                this.searchModel.stockInName="";
                //调用查询方法
                this.search()
            },
                /**
                 * 查询部门列表
                 */
                async search(){
                    //发送查询请求
                    let res=await storeApi.getStoreList(this.searchModel)
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
                    this.$restForm("storeForm",this.store);
                    //设置属性
                    this.storeDialog.title='新增库存',
                    this.storeDialog.visible=true
                },
                //窗口关闭事件
                onClose(){
                 this.storeDialog.visible=false
                },
                //窗口确认事件
                onConfirm(){
                    //进行表单验证
                    this.$refs.storeForm.validate(async (valid)=>{
                        //如果验证通过
                        if(valid){
                              let res =null;
                           
                            //判断是添加还是修改操作(依据id是否为空,为空则为添加操作)
                            if(this.store.id===""){
                                 //发送添加请求
                                res = await storeApi.addstore(this.store)
                            }else{
                                //发送修改请求
                                res = await store.updatestore(this.store)
                            }
                         
                            //判断是否成功
                            if(res.success){
                                //提示成功
                                this.$message.success(res.message)
                                //刷新数据
                                this.search()
                                  //关闭窗口事件
                                this.storeDialog.visible=false
                            }else{
                                //提示失败
                                  this.$message.error(res.message)
                                 
                            }
                   
                        }
                    })
                  
                },
                //修改按钮实现
                handleEdit(row){
                    //数据回显
                    this.$objCopy(row,this.store)
                    //设置窗口标题
                    this.storeDialog.title='编辑库存'
                    //显示窗口
                    this.storeDialog.visible=true
    
                },
                //删除操作
               
    
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