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
            
            default-expand-all
             >
            <el-table-column prop="stockinName" label="物品名称"/>
            <el-table-column prop="storeNum"  label="物品数量"/>
            <el-table-column prop="outNum" label="出库数量"/>
            <el-table-column prop="outIs" label="状态"/>
            <el-table-column prop="stockinType" label="物品类型"/>
            <el-table-column prop="brand" label="品牌"/>
            <el-table-column prop="stockoutTime" label="出库时间"/>
            <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
            <el-button icon="el-icon-close" type="danger"  size="small" @click="handleDelete(scope.row)" 
           >删除 </el-button >
            </template>
    </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-main>
    
    </template>

<script>
    //导入department.js脚本文件
    import stockOutApi from "@/api/stockOutApi"
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
                        stockinName:"",//出库物品名
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
                        height:170//窗口高度
    
                    },
                    // storeId:"",//库存编号
                    store:{
                        outId:"",//物品出库编号
                        storeId:"",//库存编号
                        stockinId:"",//物品编号
                        stockinName:"",//物品名称
                        storeNum:"",//库存数量
                        outNum:"",//出库物品数量
                        stockinType:"",//物品类型
                        stockoutTime:"",//出库时间
                        outIs:""//是否成功出库
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
                    stockOutApi.getStockOutList(this.searchModel).then(res=>{
                        if(res.success){
                        this.tableData=res.data.records
                        console.log( this.tableData)
                        this.total=res.data.total;
                        for(let i =0;i<this.tableData.length;i++){
                            if(this.tableData[i].outIs==1){
                                this.tableData[i].outIs="出库成功"
                            }else{
                                this.tableData[i].outIs="出库失败"
                            }
                        }
                    }
                    })
                    
                    //判断是否成功
                },

                //窗口关闭事件
                onClose(){
                 this.storeDialog.visible=false
                },
                
                 //删除按钮实现
                async handleDelete(row){
                    let confirm=await this.$myconfirm("确定要删除该数据嘛?")
                    if(confirm){
                            //发送删除请求
                            let res=await stockOutApi.deleteStockOut({outId:row.outId})
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
                        this.search(this.pageNo,this.pageSize)
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