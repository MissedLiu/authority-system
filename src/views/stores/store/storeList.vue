<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form  ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item >
                <el-input v-model="searchModel.stockinName" placeholder="请输入库存物品名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right " @click="resetValue()">重置</el-button>
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
            <el-table-column prop="stockinNum"  label="最近入库数量"/>
            <el-table-column prop="storeNum" label="库存数量"/>
            <el-table-column prop="stockinType" label="物品类型"/>
            <el-table-column prop="brand" label="品牌"/>
            <el-table-column prop="stockinTime" label="最近入库时间"/>
            <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
            <el-button icon="el-icon-edit-outline" type="primary" size="small" @click="handleToOutStock(scope.row)" 
            >出库 </el-button >
            <el-button icon="el-icon-close" type="danger"  size="small" @click="handleDelete(scope.row)" 
           >删除 </el-button >
            </template>
    </el-table-column>
    </el-table>

    <system-dialog 
    :title="storeDialog.title" 
    :visible="storeDialog.visible" 
    :width="storeDialog.width" 
    :height="storeDialog.height" 
    @onClose="onClose" 
    @onConfirm="toOutStock"
    
    >
    <div slot="content">
    <el-form :model="store" ref="storeForm"  label-width="80px" :inline="true" size="small">
           <el-form-item label="出库数量" prop="outStockNum" > 
            <el-input v-model="store.outStockNum"></el-input>
        </el-form-item> 
            
    </el-form>
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
    import storeApi from "@/api/storeApi"
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
                        stockinName:"",//库存物品名
                        pageNo:1,
                        pageSize:10,
                    },
                    tableData:[],//表格数据

                    pageNo:1,//当前页码
                    total:0,//数据总数量
                    pageSize:10,//每页显示数量

                    storeDialog:{
                        title:"",//窗口标题
                        visible:false,//是否显示窗口
                        width:560,//窗口宽度
                        height:50//窗口高度
    
                    },
                    store:{
                        storeId:"",//库存编号
                        poId:"",//物品编号
                        stockinName:"",//物品名称
                        stockinNum:"",//物品数量
                        storeNum:"",//库存数量
                        stockinType:"",//物品类型
                        brand:"",//品牌      
                        stockinTime:"",//最后一次操作时间
                        outStockNum:""//出库数量
                    },

                    //选择所属部门的属性
                    parentDialog:{
                        title:"",//窗口标题
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
                this.searchModel.stockinName="";
                //调用查询方法
                this.search()
            },

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
                 * 查询库存列表
                 */
                async search(pageNo,pageSize){
                     //修改当前页码
                     this.searchModel.pageNo=pageNo
                    //修改每页显示条数
                    this.searchModel.pageSize=pageSize
                    //发送查询请求
                    let res=await storeApi.getStoreList(this.searchModel)
                    //判断是否成功
                    if(res.success){
                        console.log(res.data.records)
                        this.tableData=res.data.records
                        this.total=res.data.total;

                    }
                },
                //窗口关闭事件
                onClose(){
                 this.storeDialog.visible=false
                },

                handleToOutStock(row){
                    //数据回显
                    this.$objCopy(row,this.store)
                    //设置窗口标题
                    this.storeDialog.title='请输入出库数量'
                    //显示窗口
                    this.storeDialog.visible=true
    
                },
                toOutStock(){
                    console.log(this.store)
                    storeApi.toOutStock(this.store).then(res=>{
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
                            this.search(this.pageNo,this.pageSize)
                    })
                },
                 //删除按钮实现
                async handleDelete(row){
                    let confirm=await this.$myconfirm("确定要删除该数据嘛?")
                    if(confirm){
                            //发送删除请求
                            let res=await storeApi.deleteStore({storeId:row.storeId})
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
                },

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