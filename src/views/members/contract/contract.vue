<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="opencompactWindow()" v-if="hasPermission('members:contract:add')">签订合同</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
            <el-table-column prop="createDate" label="签订日期"></el-table-column>
            <el-table-column prop="endDate" label="结束日期"></el-table-column>
            <el-table-column prop="compactType" label="合同类型"></el-table-column>
            <el-table-column prop="salesman" label="业务员"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" plain type="primary" size="small" @click="detialwindow(scope.row)" >
                        合同详情
                    </el-button>
                    <el-button type="danger" plain size="small" @click="delDetial(scope.row)" v-if="hasPermission('members:contract:delete')">
                        删除合同
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNo" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 合同签订 -->
        <system-dialog :title="compactDialog.title" :visible="compactDialog.visible" :width="compactDialog.width"
            :height="compactDialog.height" @onClose="compactonClose" @onConfirm="compactonConfirm">
            <div slot="content">
                <el-form ref="memberForm" label-width="80px" :inline="true" size="small">
                    <el-form-item>
                        <el-input placeholder="请输入电话" v-model="compactPhone.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain icon="el-icon-search" @click="findAllMember()">查询</el-button>
                        <el-button icon="el-icon-refresh-right" @click="resetValue2">返回</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="memberdata" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
                    default-expand-all>
                    <el-table-column prop="memberName" label="会员姓名"></el-table-column>
                    <el-table-column prop="memberPhone" label="会员电话"></el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-close" type="danger" size="small"
                                @click="signingwindow(scope.row)">
                                签订合同
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>
        <!-- 会员签约 -->
        <system-dialog :title="signingDialog.title" :visible="signingDialog.visible" :width="signingDialog.width"
            :height="signingDialog.height" @onClose="signingClose" @onConfirm="signingConfirm">
            <div slot="content">
                <el-form :model="signing" ref="signingForm" :rules="rules" label-width="110px" size="small">
                    <el-form-item label="会员姓名" prop="memberName">
                        <el-input v-model="signing.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="会员电话" prop="memberPhone">
                        <el-input v-model="signing.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐办理编号" prop="meal">
                        <el-input v-model="signing.meal" @click.native="openMealWindow()"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="signing.compactType" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="合同签订时间" prop="createDate">
                        <el-date-picker v-model="signing.createDate" type="datetime" style="width:180px"
                            placeholder="选择合同签订时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合同结束时间">
                        <el-input v-model="signing.endDate" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="业务员" prop="salesman">
                        <el-input v-model="signing.salesman"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="photoAddress">
                        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                            action="http://localhost:8888/api/oss/file/upload?module=photoAddress">
                            <img v-if="signing.photoAddress" :src="signing.photoAddress">
                            <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
        </system-dialog>

        <!-- 选择套餐的窗口 -->
        <system-dialog :title="parentDialog.title" :visible="parentDialog.visible" :width="parentDialog.width"
            :height="parentDialog.height" @onClose="onParentClose()" @onConfirm="onParentConfirm()">
            <div slot="content">
                <el-table border style="margin-top: 50px;" :data="mealList">
                    <el-table-column label="办理套餐编号" align="center" prop="mmId">
                    </el-table-column>
                    <el-table-column label="套餐编号" align="center" prop="mealId">
                    </el-table-column>
                    <el-table-column label="套餐类型" align="center" prop="mealType">
                    </el-table-column>
                    <el-table-column label="办理时间" align="center" prop="mmTime">
                    </el-table-column>
                    <el-table-column label="到期时间" align="center" prop="mmDate">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-plus" @click="addMmId(scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </system-dialog>

        <!-- 选择套餐的窗口 -->
        <system-dialog :title="detialDialog.title" :visible="detialDialog.visible" :width="detialDialog.width"
            :height="detialDialog.height" @onClose="closedetial" @onConfirm="closedetial">
            <div slot="content">
                <img :src=this.src style="width:650px;height:400px">
            </div>
        </system-dialog>
    </el-main>
</template>
  
<script>
import contractApi from "@/api/contract"
import memberApi from "@/api/member"
//导入对话框组件
import SystemDialog from "@/components/system/SystemDialog.vue";
//导入token
import { getToken } from '@/utils/auth'
export default {
    name: "contract",
    //注册组件
    components: {
        SystemDialog,
    },
    data() {
        return {
            //分页组件所需的属性
            pageNo: 1, //当前页码
            total: 0, //数据总数量
            pageSize: 10, //每页显示数量
            //合同签订表数据
            tableData: [],
            //电话查询参数
            phone: {
                memberPhone: "", //电话号码
                pageNo: 1, //当前页码
                pageSize: 10, //每页显示数量
            },
            //验证
            rules: {
                memberName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                memberSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                meal: [{ required: true, message: '请选择套餐办理编号', trigger: 'change' }],
                createDate: [{ required: true, message: '请选择签订时间', trigger: 'change' }],
                salesman: [{ required: true, message: '请输入业务员', trigger: 'blur' }],
                photoAddress: [{ required: true, message: '合同图片不能为空', trigger: 'blur' }],
            },

            //合同签订窗口的电话查询参数
            compactPhone: {
                memberPhone: ""
            },
            //  //上传需要携带的数据
            uploadHeader: { "token": getToken() },
            //合同签订窗口的属性
            compactDialog: {
                title: "签订合同",//窗口标题
                visible: false,//是否显示窗口
                width: 600,//窗口宽度
                height: 400//窗口高度
            },
            //签订合同框中的会员查看数据
            memberdata: [],
            //签约框的属性
            signingDialog: {
                title: "会员签约",//窗口标题
                visible: false,//是否显示窗口
                width: 500,//窗口宽度
                height: 600//窗口高度
            },
            //签约框绑定数据
            signing: {
                memberId: "",
                memberName: "",
                memberPhone: "",
                meal: "",//套餐
                compactType: "",
                createDate: "",
                endDate: "",
                salesman: "",
                photoAddress: "",//合同详情

            },
            //选择套餐的窗口属性
            parentDialog: {
                title: "选择套餐",//窗口标题
                visible: false,//是否显示窗口
                width: 800,//窗口宽度
                height: 400//窗口高度
            },
            //套餐数据
            mealList: [],

            //合同详情属性
            detialDialog: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 700,//窗口宽度
                height: 500//窗口高度
            },
            src: "",
        };
    },
    created() {
        this.search();
    },
    methods: {

        async search(pageNo, pageSize) {
            //修改当前页码
            this.phone.pageNo = pageNo;
            //修改每页显示条数
            this.phone.pageSize = pageSize;
            //发送查询请求
            let res = await contractApi.findCompactList(this.phone);

            //判断是否存在数据
            if (res.success) {
                //获取数据
                this.tableData = res.data.records;
                //当前数据数量
                this.total = res.data.total;
            }
        },
        //打开查看合同详情窗口
        async detialwindow(row) {
            //发送请求
            this.detialDialog.title = "合同原件"
            this.detialDialog.visible = true
            this.src = row.photoAddress
            console.log("xxxx", row);
        },
        //关闭查看合同详情窗口
        closedetial() {
            this.detialDialog.visible = false
        },



        //打开签订合同的窗口
        opencompactWindow() {
            this.compactDialog.visible = true
            this.findAllMember();
        },
        //查询所有会员方法
        async findAllMember() {
            //查询所有会员
            let res = await memberApi.getlistAllNoPage(this.compactPhone)
            if (res.success) {
                this.memberdata = res.data
            }
        },
        //清空查询条件
        resetValue2() {
            //清空数据
            this.compactPhone.memberPhone = "";
            //调用查询方法
            this.findAllMember()
        },
        //签订合同的窗口取消事件
        compactonClose() {
            this.compactDialog.visible = false
        },
        //签订合同的窗口确定事件
        compactonConfirm() {
            this.compactDialog.visible = false
        },

        //打开签约框
        signingwindow(row) {
            this.$restForm("signingForm", this.signing);
            this.signingDialog.visible = true
            this.signing.memberId = row.memberId
            this.signing.memberName = row.memberName
            this.signing.memberPhone = row.memberPhone
        },
        //签约框取消事件
        signingClose() {
            this.signingDialog.visible = false
        },
        //签约框确定事件
        async signingConfirm() {

            //进行表单验证
            this.$refs.signingForm.validate(async (valid) => {
                //如果验证通过
                if (valid) {
                    let perom = {
                        memberId: this.signing.memberId,
                        createDate: this.signing.createDate,
                        endDate: this.signing.endDate,
                        photoAddress: this.signing.photoAddress,
                        compactType: this.signing.compactType,
                        salesman: this.signing.salesman,
                        mmId: this.signing.meal
                    }
                    //发送请求
                    console.log(perom)
                    let res = await contractApi.addCompact(perom)
                    if (res.success) {
                        //提示成功
                        this.$message.success(res.message)
                        //关闭窗口事件
                        this.signingDialog.visible = false
                        this.compactDialog.visible = false
                        //刷新数据
                        this.search(this.pageNo, this.pageSize);
                        this.resetValue2()
                    } else {
                        //提示失败
                        this.$message.error(res.message)
                    }
                }

            })

        },


        //打开未签订合同的套餐框
        async openMealWindow() {
            this.parentDialog.title = "需签订合同的套餐"
            this.parentDialog.visible = true
            let res = await contractApi.findMemberMeal({ memberId: this.signing.memberId })
            if (res.success) {
                console.log("-=-=-=-=-=-=-=--=-=-=-=", res);
                this.mealList = res.data
            }
        },
        //确定未签订合同的套餐框
        onParentConfirm() {
            this.parentDialog.visible = false
        },
        //取消未签订合同的套餐框
        onParentClose() {
            this.parentDialog.visible = false
        },
        //选择套餐
        addMmId(row) {
            this.signing.meal = row.mmId
            this.signing.compactType = row.mealType
            this.signing.endDate = row.mmDate
            this.parentDialog.visible = false
        },


        //上传成功回调
        handleAvatarSuccess(res, file) {
            this.signing.photoAddress = res.data
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
        //删除合同
        async delDetial(row) {
            let confirm = await this.$myconfirm("确定删除该记录吗?")//await代表同步
            if (confirm) {
                let res = await contractApi.delDetial({ compactId: row.compactId })
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //关闭窗口事件
                    this.signingDialog.visible = false
                    //刷新数据
                    this.search(this.pageNo, this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
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
        /**
    * 重置查询条件
    */
        resetValue() {
            //清空数据
            this.phone.memberPhone = "";
            //调用查询方法
            this.search()
        },
    },
};
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
  