<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="selectOne()">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddwindow">新增</el-button>
                <el-button icon="el-icon-refresh-right" @click="search()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
            <el-table-column prop="memberAddress" label="地址"></el-table-column>
            <el-table-column prop="memberType" label="状态"></el-table-column>
            <el-table-column prop="mealId" label="套餐编号" ></el-table-column>
            <el-table-column prop="mealType" label="套餐类型" ></el-table-column>
            <el-table-column prop="mmTime" label="办理时间"  ></el-table-column>
            <el-table-column prop="mmDate" label="到期时间" ></el-table-column>

            <el-table-column label="套餐操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" type="primary" size="small"
                        @click="selectCommonMeal(scope.row)">
                        详情
                    </el-button>
                    <el-button icon="el-icon-close" type="danger" size="small" @click="del(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加窗口 -->
        <system-dialog :title="ptmbDialog.title" :visible="ptmbDialog.visible" :width="ptmbDialog.width"
            :height="ptmbDialog.height" @onClose="onClose" @onConfirm="onConfirm">
            <div slot="content">
                <el-form :model="member" ref="memberForm" :rules="mbrules" label-width="80px" size="small">
                    <el-form-item label="会员姓名" prop="memberName">
                        <el-input v-model="member.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="会员性别" prop="memberSex">
                        <el-select v-model="member.memberSex" placeholder="Select">
                            <el-option :value="1" label="男">男</el-option>
                            <el-option :value="0" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生日期">
                        <el-input v-model="member.memberDate"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="memberPhone">
                        <el-input v-model="member.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="memberAge">
                        <el-input v-model="member.memberAge"></el-input>
                    </el-form-item>
                    <el-form-item label="住址" prop="memberAddress">
                        <el-input v-model="member.memberAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="会员类型" prop="memberType">
                        <el-select v-model="member.memberType" placeholder="Select">
                            <el-option :value="1" label="正式会员"></el-option>
                            <el-option :value="0" label="体验会员"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="套餐选择" prop="mealId" :readonly="true"  @click.native="openCommonMealWindow()">
                        <el-input v-model="member.mealId"></el-input>
                    </el-form-item>
                </el-form>

            </div>
        </system-dialog>

        <!-- 选择套餐的窗口 -->
        <system-dialog :title="parentDialog.title" :visible="parentDialog.visible" :width="parentDialog.width"
            :height="parentDialog.height" @onClose="onParentClose()" @onConfirm="onParentConfirm()">
            <div slot="content">
                <el-table border style="margin-top: 50px;" :data="treeList">
                    <el-table-column label="套餐编号" align="center" prop="cmId">
                    </el-table-column>
                    <el-table-column label="套餐名称" align="center" prop="cmName">
                    </el-table-column>
                    <el-table-column label="套餐价格" align="center" prop="cmPrice">
                    </el-table-column>
                    <el-table-column label="持续时间" align="center" prop="cmTime">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" @click="addMmId(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

        <!-- 查看详情窗口 -->
        <system-dialog :title="mealDialog.title" :visible="mealDialog.visible" :width="mealDialog.width"
            :height="mealDialog.height" @onClose="pageClose()" @onConfirm="pageConfirm()">
            <div slot="content">
                <el-form  ref="memberForm"  label-width="80px" size="small">
                    <el-form-item label="套餐编号">
                        <el-input  readonly  v-model="mealSJ.cmId"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐名称">
                        <el-input  readonly  v-model="mealSJ.cmName"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐时长">
                        <el-input  readonly  v-model="mealSJ.cmTime"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐价格">
                        <el-input  readonly v-model="mealSJ.cmPrice"></el-input>
                    </el-form-item>
                </el-form>    
            </div>
        </system-dialog>

    </el-main>
</template>

<script>
import MemberApi from '@/api/member'
import MealApi from '@/api/meal'
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
    name: 'department',
    //注册组件
    components: {
        SystemDialog
    },
    data() {
        return {
            //表格数据列表
            tableData: [
            ],
            //查询列表参数
            searchModel: {
                memberType: "普通",
            },
            //电话查询参数
            phone: {
                mealType: "普通",
                memberPhone: null,
            },
            ptmbDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 560,//窗口宽度
                height: 500//窗口高度
            },
            member: {
                memberName: "",//会员姓名
                memberSex: "",//会员性别
                memberDate: "",//出生日期
                memberPhone: "",//电话号码
                memberAge: "",//年龄
                memberAddress: "",//住址
                memberType: "",//会员类型 
                mealId: "",//套餐编号
                mealType: "",//套餐类型
            },
            //验证
            mbrules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                memberPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
                memberAge: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
                memberAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
                mealId: [{ required: true, message: '请选择套餐', trigger: 'change' }],
                memberType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
            },
            //选择套餐的属性
            parentDialog: {
                title: "选择套餐",//窗口标题
                visible: false,//是否显示窗口
                width: 600,//窗口宽度
                height: 400//窗口高度

            },
            //套餐数据
            treeList: [],
            //套餐详情的属性
            mealDialog: {
                title: "套餐详情",//窗口标题
                visible: false,//是否显示窗口
                width: 500,//窗口宽度
                height: 400//窗口高度
            },
             //详情数据
             mealSJ: {

             },
            
        }
    },
    created() {
        this.search();
    },
    methods: {
        //查询普通会员列表
        async search() {
            //清空输入框
            this.phone.memberPhone = null;
            //发送查询请求
            let res = await MemberApi.getPtMemberList(this.searchModel);
            console.log(res);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].memberSex =res.data[i].memberSex == 0 ? '女' : '男'
                    res.data[i].memberType =res.data[i].memberType == 0 ? '体验会员' : '正式会员'
                }
                this.tableData = res.data;
            }
        },
        //通过电话和类型查会员
        async selectOne() {
            //发送查询请求
            console.log("xxxxxxxx");
            if (this.phone.memberPhone != null) {
                let res = await MemberApi.getMemberByPhoneAndvMealtype(this.phone);
                //判断是否存在数据
                if (res.success) {
                    //获取数据
                    this.tableData = res.data;
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].memberSex = res.data[i].memberSex == 0 ? '女' : '男'
                        res.data[i].memberType = res.data[i].memberType == 0 ? '体验会员' : '正式会员'
                        
                    }
                }
            }

        },

        //打开添加窗口
        openAddwindow() {
            this.$restForm("memberForm", this.member);
            //设置属性
            this.ptmbDialog.title = '新增普通会员',
                this.ptmbDialog.visible = true
        },
        //窗口关闭事件
        onClose() {
            this.ptmbDialog.visible = false
        },
        //窗口确认事件
        onConfirm() {
            //进行表单验证
            console.log(this.member);
            this.$refs.memberForm.validate(async (valid) => {
                console.log("xxx");
                //如果验证通过
                if (valid) {
                    let res = null;
                    //发送添加请求
                    console.log("添加");
                    this.member.mealType = "普通"
                    console.log(this.member);
                    res = await MemberApi.getAddPtMember(this.member)
                    //判断是否成功
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //刷新数据
                        this.search()
                        //关闭窗口事件
                        this.ptmbDialog.visible = false
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }

                }
            })

        },
        //打开套餐选择的窗口
        async openCommonMealWindow() {
            this.parentDialog.visible = true
            let res = await MealApi.getCommenMealList();
            console.log(res)
            //判断是否成功
            if (res.success) {
                this.treeList = res.data
            }
        },
        //套餐选择取消关闭事件 
        onParentClose() {
            this.parentDialog.visible = false
        },
        //套餐选择确认事件
        onParentConfirm() {
            this.parentDialog.visible = false
        },
        //选择套餐
        addMmId(row) {
            this.member.mealId = row.cmId
            this.parentDialog.visible = false
            console.log(this.member.mealId)
        },
        //根据会员办理套餐id删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                let res = await MemberApi.delMemberMealById({ mmId: row.mmId })
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search()
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        },
        //查看套餐详情窗口
        async selectCommonMeal(row) {
            this.mealDialog.visible = true 
            let res=await MealApi.getselectCommenMeal({id:row.mealId});
            console.log(res.data);
            //判断是否成功
            if(res.success){
                this.mealSJ=res.data
            }
            
        },
        //查看套餐详情窗口关闭事件 
        pageClose() {
            this.mealDialog.visible = false
        },
        //查看套餐详情窗口确认事件
        pageConfirm() {
            this.mealDialog.visible = false
        },
    },
}

</script>

<style lang="scss" scoped>

</style>
