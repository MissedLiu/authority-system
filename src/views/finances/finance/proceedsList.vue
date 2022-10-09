<template>
    <el-main>
        <!-- 条件查询区 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-select v-model="searchModel.typee" class="m-2" placeholder="输入统计时间段" size="small">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>

                <el-select v-model="searchModel.type" class="m-2" placeholder="输入统计套餐类型" size="small">
                    <el-option v-for="item in tOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="toSumPrice()">统计</el-button>
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
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="poId"
            default-expand-all>
            <el-table-column prop="memberName" label="会员名称" />
            <el-table-column prop="memberPhone" label="会员电话" /> 
            <el-table-column prop="mealName" label="套餐名称" />
            <el-table-column prop="mealType" label="套餐类型" />
            <el-table-column prop="ptpName" label="项目名称" />                       
            <el-table-column prop="comsunePrice" label="消费金额" />
            <el-table-column prop="comsuneDate" label="消费时间" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small"  plain @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <system-dialog :title="DialogConfig.title" :visible="DialogConfig.visible" :width="DialogConfig.width"
            :height="DialogConfig.height" @onClose="onClose" @onConfirm="onClose">
            <div slot="content">
                <span>{{searchModel.typee}}</span><span v-if="searchModel.type!=''">{{searchModel.type}}套餐</span>的收入总额为{{sumPrice}}
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
import comsuneApi from "@/api/comsune";
//先导入systemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
    name: "invoice",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            searchModel: {
                type: "",
                typee: "",
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示条数
            },
            tableData: [], //表格数据

            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量
            sumPrice: "0",
            //新增或编辑的表单属性
            DialogConfig: {
                title: "", //窗口标题
                visible: false, //是否显示窗口
                width: 400, //窗口宽度
                height: 30, //窗口高度
            },
            proceeds: {
                comsuneId: "", //编号
                memberId: "", //会员编号
                memberPhone: "", //会员电话
                memberName: "", //会员名称
                mealId: "", //套餐编号
                mealName: "", //套餐名称
                mealType: "", //套餐类型
                ptpId: "", //项目编号
                ptpName: "", //项目名称
                comsunePrice: "", //消费金额
                comsuneDate: "", //消费时间
            },

            

            options: [
                {
                    value: '近七天',
                    label: '近七天',
                },
                {
                    value: '近一个月',
                    label: '近一个月',
                },
                {
                    value: '本季度',
                    label: '本季度',
                },
                {
                    value: '上季度',
                    label: '上季度',
                },
                {
                    value: '本年',
                    label: '本年',
                },
            ],
            tOptions: [
            {
                    value: '',
                    label: '全部套餐',
                },
                {
                    value: '普通',
                    label: '普通套餐',
                },
                {
                    value: '私教',
                    label: '私教套餐',
                },
                {
                    value: '团操',
                    label: '团操套餐',
                }
            ],

        };
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
            this.searchModel.mealName = "";
            //调用查询方法
            this.search();
        },

        /**
         * 查询采购计划列表
         */
        async search(pageNo, pageSize) {
            //修改当前页码
            this.searchModel.pageNo = pageNo;
            //修改每页显示条数
            this.searchModel.pageSize = pageSize;
            //发送查询请求
            let res = await comsuneApi.selectComsuneList(this.searchModel);
            //判断是否成功
            if (res.success) {
                this.tableData = res.data.records;
                this.total = res.data.total;
            }
        },


        onClose() {
            this.DialogConfig.visible = false;
        },

       async toSumPrice(){
            await comsuneApi.getSumPrice(this.searchModel).then(res=>{
                if(res.success){
                    this.sumPrice=res.data
                    this.DialogConfig.title="🐂"
                    this.DialogConfig.visible = true;
                    if(this.sumPrice==null){
                        this.sumPrice='0'
                    }
                }
            })
        },

        handleSizeChange(size) {
            //修改每页显示数量
            this.pageSize = size;
            //调用查询方法
            this.search(this.pageNo, size);
        },

        /**
         * 当页码发生变化时触发该事件
         */
        handleCurrentChange(page) {
            //修改当前页码
            this.pageNo = page;
            //调用查询方法
            this.search(page, this.pageSize);
        },
        //删除按钮实现
    async handleDelete(row) {
        console.log(row)
      let confirm = await this.$myconfirm("确定要删除该数据嘛?");
      if (confirm) {
        await comsuneApi.deleteComSune({comsuneId : row.comsuneId})
          .then((res) => {
            if (res.success) {
              //提示成功
              this.$message.success(res.message);
              //刷新数据
              this.search(this.pageNo, this.pageSize);
            } else {
              //提示失败
              this.$message.error(res.message);
            }
          });
      }
    },
    }
};
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