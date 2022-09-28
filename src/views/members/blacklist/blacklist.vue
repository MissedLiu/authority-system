<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="selectOne()">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="search()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberSex" label="会员性别"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
            <el-table-column prop="memberDate" label="出生日期"></el-table-column>
            <el-table-column prop="memberAge" label="年龄"></el-table-column>
            <el-table-column prop="memberAddress" label="地址"></el-table-column>
            <el-table-column prop="memberType" label="状态"></el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-close" type="danger" size="small" @click="del(scope.row)">
                        移出黑名单
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
                </el-form>
            </div>
        </system-dialog>


        <!-- 修改窗口 -->
        <system-dialog :title="mealDialog.title" :visible="mealDialog.visible" :width="mealDialog.width"
            :height="mealDialog.height" @onClose="pageClose()" @onConfirm="pageConfirm()">
            <div slot="content">
                <el-form  ref="memberForm"  label-width="80px" size="small">
                    <el-form-item label="会员姓名">
                        <el-input v-model="mealSJ.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="会员性别" prop="memberSex">
                        <el-select v-model="mealSJ.memberSex" placeholder="Select">
                            <el-option :value="1" label="男">男</el-option>
                            <el-option :value="0" label="女">女</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生日期">
                        <el-input v-model="mealSJ.memberDate"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input readonly v-model="mealSJ.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="mealSJ.memberAge"></el-input>
                    </el-form-item>
                    <el-form-item label="住址">
                        <el-input v-model="mealSJ.memberAddress"></el-input>
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
            tableData: [],
            //查询会员属性
            memberData:"",
            //查询列表参数
            searchModel: {
                memberType: "普通",
            },
            //电话查询参数
            phone: {
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
            },
            //验证
            mbrules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                memberPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
                memberAge: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
                memberAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
                memberType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
            },
            //套餐详情的属性
            mealDialog: {
                title: "套餐详情",//窗口标题
                visible: false,//是否显示窗口
                width: 500,//窗口宽度
                height: 400//窗口高度
            },
             //存放数据
             mealSJ: {

             },
             //修改数据存放
                          mealSJ2: {

},



        }
    },
    created() {
        this.search();
    },
    methods: {
        //查询会员列表
        async search() {
            //清空输入框
            this.phone.memberPhone = null;
            //发送查询请求
            let res = await MemberApi.getMemberList();
            console.log(res);
            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data;
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].memberSex = res.data[i].memberSex == 0 ? '女' : '男'
                    res.data[i].memberType = res.data[i].memberType == 0 ? '体验会员' : '正式会员'
                }
            }
        },

        //通过电话和类型查会员
        async selectOne() {
            //发送查询请求
            if (this.phone.memberPhone != null) {
                let res = await MemberApi.getFindMemberByPhone(this.phone);
                console.log(res);
                //判断是否存在数据
                if (res.success) {
                    //获取数据
                    console.log(res.data);
                    //置空
                    this.tableData=[]
                    this.tableData[0] = res.data;
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].memberSex = res.data[i].memberSex == 0 ? '女' : '男'
                        res.data[i].memberType = res.data[i].memberType == 0 ? '体验会员' : '正式会员'
                    }
                    console.log(this.tableData);
                }
            }
        },

        //打开添加窗口
        openAddwindow() {
            this.$restForm("memberForm", this.member);
            //设置属性
            this.ptmbDialog.title = '新增会员',
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
                //如果验证通过
                if (valid) {
                    let res = null;
                    //发送添加请求
                    res = await MemberApi.getAddMember(this.member)
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
       
        //根据会员电话删除
        async del(row) {
            //提示是否确认删除
            let confirm = await this.$myconfirm("确定要删除该数据嘛?")//await代表同步
            if (confirm) {
                //发送删除请求
                console.log("phone",row.memberPhone);
                let res = await MemberApi.delMemberByMemberId({ memberId: row.memberId })
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
        //修改窗口
        async selectCommonMeal(row) {
            this.mealDialog.visible = true 
            this.mealSJ=row
        },
        //修改窗口关闭事件 
        pageClose() {
            this.mealDialog.visible = false
            this.search()
        },
        //修改窗口确认事件
        async pageConfirm() {
            console.log(this.mealSJ);
            //提示是否确认修改
            this.mealSJ.memberSex = this.mealSJ.memberSex == '男' ? 1 : 0
            this.mealSJ.memberType = this.mealSJ.memberType == '体验会员' ? 0 : 1
            let confirm = await this.$myconfirm("确定要修改该数据嘛?")
            console.log(this.mealSJ.memberSex);
            if (confirm) {
                //发送修改请求
                let res = await MemberApi.updataMemberByMemberPhone(this.mealSJ)
                //判断是否发送成功
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //刷新数据
                    this.search()
                    this.mealDialog.visible = false
                } else {
                    //提示失败
                    this.$message.error(res.message)
                    this.search()
                }
            }
            
        },
    },
}

</script>

<style lang="scss" scoped>

</style>
