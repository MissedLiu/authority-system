<template>
    <el-main>
        <!-- 查询条件 -->
        <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input placeholder="请输入电话" v-model="phone.memberPhone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入姓名" v-model="phone.memberName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="search(pageNo, pageSize)">查询</el-button>
                <el-button type="success" plain icon="el-icon-plus" @click="opencompactWindow()"
                    v-if="hasPermission('members:contract:add')">签订合同</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px" row-key="id"
            default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="memberName" label="会员姓名" align="center"></el-table-column>
            <el-table-column prop="memberPhone" label="会员电话" align="center"></el-table-column>
            <el-table-column prop="memberSex" label="性别" align="center" :formatter="playbackFormat"></el-table-column>
            <el-table-column prop="memberDate" label="出生日期" align="center"></el-table-column>
            <el-table-column prop="memberAddress" label="地址" align="center"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit-outline" plain type="primary" size="small"
                        @click="mealdetialwindow(scope.row)">
                        详情
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
                            <el-button type="success" plain icon="el-icon-plus" size="small"
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
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="合同图片1" prop="photoAddress">
                                <div class="upload-deom" prop="photoAddress">
                                    <el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                        action="http://localhost:8888/api/oss/file/upload?module=photoAddress">
                                        <img v-if="signing.photoAddress" :src="signing.photoAddress">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="合同图片2" prop="photoAddress">
                                <div class="upload-deom" prop="photoAddress">
                                    <el-upload :show-file-list="false" :on-success="handleAvatarSuccess2"
                                        :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                        action="http://localhost:8888/api/oss/file/upload?module=photoAddress2">
                                        <img v-if="signing.photoAddress2" :src="signing.photoAddress2">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="合同图片3" prop="photoAddress">
                                <div class="upload-deom">
                                    <el-upload :show-file-list="false" :on-success="handleAvatarSuccess3"
                                        :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                        action="http://localhost:8888/api/oss/file/upload?module=photoAddress3">
                                        <img v-if="signing.photoAddress3" :src="signing.photoAddress3">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="合同图片4">
                                <div class="upload-deom">
                                    <el-upload :show-file-list="false" :on-success="handleAvatarSuccess4"
                                        :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                        action="http://localhost:8888/api/oss/file/upload?module=photoAddress4">
                                        <img v-if="signing.photoAddress4" :src="signing.photoAddress4">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="合同图片5">
                                <div class="upload-deom">
                                    <el-upload :show-file-list="false" :on-success="handleAvatarSuccess5"
                                        :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                                        action="http://localhost:8888/api/oss/file/upload?module=photoAddress5">
                                        <img v-if="signing.photoAddress5" :src="signing.photoAddress5">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                                    </el-upload>
                                </div>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </div>
        </system-dialog>

        <!-- 选择套餐的窗口 -->
        <system-dialog :title="parentDialog.title" :visible="parentDialog.visible" :width="parentDialog.width"
            :height="parentDialog.height" @onClose="onParentClose()" @onConfirm="onParentConfirm()">
            <div slot="content">
                <el-table border :data="mealList">
                    <el-table-column label="套餐名称" align="center" prop="mealName">
                    </el-table-column>
                    <el-table-column label="套餐类型" align="center" prop="mealType">
                    </el-table-column>
                    <el-table-column label="项目名称" align="center" prop="projectName">
                    </el-table-column>
                    <el-table-column label="教练名称" align="center" prop="empName">
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

        <!-- 查看合同详情的窗口 -->
        <system-dialog :title="detialDialog.title" :visible="detialDialog.visible" :width="detialDialog.width"
            :height="detialDialog.height" @onClose="closedetial" @onConfirm="closedetial">
            <div slot="content">
                <div slot="file" style="display:inline-block;">
                    <img :src=src style="width:200px;height:150px">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(src)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
                <div slot="file2" style="display:inline-block;">
                    <img :src=src2 style="width:200px;height:150px">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(src2)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
                <div slot="file3" style="display:inline-block;">
                    <img :src=src3 style="width:200px;height:150px">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(src3)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
            </div>
            <div slot="content">
                <div slot="file4" v-if="src4!=''" style="display:inline-block;">
                    <img :src=src4 style="width:200px;height:150px">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(src4)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
                <div slot="file5" v-if="src5!=''" style="display:inline-block;">
                    <img :src=src5 style="width:200px;height:150px">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(src5)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </span>
                </div>
            </div>
        </system-dialog>

        <!-- 放大框 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl">
        </el-dialog>

        <!-- 详情窗口 -->
        <system-dialog :title="mealdetial.title" :visible="mealdetial.visible" :width="mealdetial.width"
            :height="mealdetial.height" @onClose="compactClose" @onConfirm="compactConfirm">
            <div slot="content">
                <el-table border :data="mealdetialData">
                    <el-table-column label="套餐名称" align="center" prop="mealName">
                    </el-table-column>
                    <el-table-column label="套餐类型" align="center" prop="mealType">
                    </el-table-column>
                    <el-table-column label="项目名称" align="center" prop="projectName">
                    </el-table-column>
                    <el-table-column label="教练名称" align="center" prop="empName">
                    </el-table-column>
                    <el-table-column label="合同签订时间" align="center" prop="createDate">
                    </el-table-column>
                    <el-table-column label="合同到期时间" align="center" prop="endDate">
                    </el-table-column>
                    <el-table-column label="到期状态" align="center" :formatter="time">
                    </el-table-column>
                    <el-table-column prop="salesman" label="业务员" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" plain icon="el-icon-search" size="small" @click="detialwindow(scope.row)">
                            合同图片
                            </el-button>
                            <el-button icon="el-icon-close" plain type="danger" size="small" @click="delDetial(scope.row)">
                            删除合同
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
                memberName: "",
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
                photoAddress: [{ required: true, message: '此图片不能为空', trigger: 'blur' }],
            },

            //合同签订窗口的电话查询参数
            compactPhone: {
                memberPhone: ""
            },
            //上传需要携带的数据
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
                width: 550,//窗口宽度
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
                photoAddress2: "",
                photoAddress3: "",
                photoAddress4: "",
                photoAddress5: ""
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
            src2: "",
            src3: "",
            src4: "",
            src5: "",
            //放大照片URL
            dialogImageUrl: "",
            dialogVisible: false,
            //详情框属性
            mealdetial: {
                title: "",//窗口标题
                visible: false,//是否显示窗口
                width: 1200,//窗口宽度
                height: 600//窗口高度
            },
            //详情数据
            mealdetialData: [],
            //删除的id
            memberId:"",
        };
    },
    created() {
        this.search();
    },
    methods: {
        handlePictureCardPreview(src) {
            this.dialogImageUrl = src
            this.dialogVisible = true
        },

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
            this.src2 = row.photoAddress2
            this.src3 = row.photoAddress3
            this.src4 = row.photoAddress4
            this.src5 = row.photoAddress5
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
                        photoAddress2: this.signing.photoAddress2,
                        photoAddress3: this.signing.photoAddress3,
                        photoAddress4: this.signing.photoAddress4,
                        photoAddress5: this.signing.photoAddress5,
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
            let res = await contractApi.findMemberMeal({ memberId: this.signing.memberId })
            if (res.success) {
                console.log(res.data);
                if (res.data.length == 0) {
                    let mess = await this.$myconfirm("该会员暂无需要签订合同的套餐!")
                    if (mess) {
                        this.signingDialog.visible = false
                    }
                } else {
                    this.mealList = res.data
                    this.parentDialog.visible = true
                }
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

        //打开详情框
        async mealdetialwindow(row) {
            this.memberId=row.memberId
            this.mealdetial.title = "合同详情"
            //发送请求
            let res = await contractApi.findCompact({ memberId: row.memberId })
            if (res.success) {
                this.mealdetialData = res.data
                console.log(this.mealdetialData);
            }
            this.mealdetial.visible = true
        },
        //确定详情框
        compactConfirm() {
            this.mealdetial.visible = false
        },
        //取消详情框
        compactClose() {
            this.mealdetial.visible = false
        },


        //上传成功回调
        handleAvatarSuccess(res, file) {
            this.signing.photoAddress = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        handleAvatarSuccess2(res, file) {
            this.signing.photoAddress2 = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        handleAvatarSuccess3(res, file) {
            this.signing.photoAddress3 = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        handleAvatarSuccess4(res, file) {
            this.signing.photoAddress4 = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        handleAvatarSuccess5(res, file) {
            this.signing.photoAddress5 = res.data
            // 强制重新渲染
            this.$forceUpdate()
        },
        //上传校验
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 10
            if (!isJPG) {
                this.$message.error('上传合同图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传合同图片大小不能超过 10MB!')
            }
            
            return isJPG && isLt2M 

        },

        //删除合同
        async delDetial(row) {
            let confirm = await this.$myconfirm("确定删除该记录吗?")//await代表同步
            if (confirm) {
                let res = await contractApi.delDetial({compactId : row.compactId})
                if (res.success) {
                    //提示成功
                    this.$message.success(res.message)
                    //关闭窗口事件
                    this.mealdetial.visible = false
                    //刷新数据
                    this.search(this.pageNo, this.pageSize);
                } else {
                    //提示失败
                    this.$message.error(res.message)
                }
            }
        },


        //判断到期状态
        time(row) {
            console.log(row);
            let date = new Date();  // Mon Oct 11 2021 08:39:50 GMT+0800 (中国标准时间)
            let afterDate = this.formateDate(date);  // 2021-10-11 
            if (row.endDate >= afterDate) {
                return '未过期'
            } else if (row.endDate < afterDate) {
                return '已过期'
            }
        },
        // 格式化日期
        formateDate(date) {
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');  // 月要+1
            let day = date.getDate().toString().padStart(2, '0');  // 获取天是getDate，而不是 getDay
            let createTime = year + '-' + month + '-' + day;
            return createTime;
        },

        //转换显示
        playbackFormat(row) {
            if (row.memberSex == 0) {
                return '女'
            } else if (row.memberSex == 1) {
                return '男'
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
            this.phone.memberName = "";
            //调用查询方法
            this.search()
        },
    },
};
</script>
  


<style lang="scss">
.upload-deom {
    display: inline-block;
}

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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar-uploader img {
    width: 120px;
    height: 120px;
    display: block;
}
</style>
  