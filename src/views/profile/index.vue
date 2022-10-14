<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="10" :xs="24">
          <el-calendar v-model="value" />
        </el-col>
        <el-col :span="6" :xs="24">
          <el-tabs  v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="查看详细" name="first">
              <el-col :span="6">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>详细信息</span>
                    </div>
                  </template>
                  <div style="border: 1px; height:40px;" >
                      <span >姓名:</span>&nbsp;<span>{{this.emp.empName}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>用户名:</span>&nbsp;<span>{{this.username}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>年龄:</span>&nbsp;<span>{{this.emp.empAge}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>QQ:</span>&nbsp;<span>{{this.emp.qq}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>微信:</span>&nbsp;<span>{{this.emp.weix}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>电话:</span>&nbsp;<span>{{this.emp.empPhone}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>邮箱:</span>&nbsp;<span>{{this.emp.emil}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>住址:</span>&nbsp;<span>{{this.emp.empAddress}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>性别:</span>&nbsp;<span>{{this.emp.empSex}}</span>
                  </div>
                  <div style="border: 1px; height:40px;" >
                    <span>简介:</span>&nbsp;<span>{{this.emp.synopsis}}</span>
                  </div>
                </el-card>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="修改信息" name="second">
              <el-form :model="emp" ref="empForm" :rules="rules" label-width="80px" :inline="true" size="small">
                <el-form-item prop="empName" label="姓名">
                  <el-input v-model="emp.empName"></el-input>
                </el-form-item>
                <el-form-item prop="empAge" label="年龄">
                  <el-input v-model="emp.empAge"></el-input>
                </el-form-item>
                <el-form-item label="QQ">
                  <el-input v-model="emp.qq"></el-input>
                </el-form-item>
                <el-form-item label="微信">
                  <el-input v-model="emp.weix"></el-input>
                </el-form-item>
                <el-form-item prop="empPhone" label="电话">
                  <el-input v-model="emp.empPhone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="emp.emil"></el-input>
                </el-form-item>
                <el-form-item prop="empAddress" label="住址">
                  <el-input v-model="emp.empAddress"></el-input>
                </el-form-item>
                <el-form-item prop="empSex" label="性别">
                  <el-radio-group v-model="emp.empSex">
                    <el-radio-button label="男" />
                    <el-radio-button label="女" />
                  </el-radio-group>
                </el-form-item>
                <br>
                <!-- 用户头像 -->
                <el-form-item label="头像">
                  <el-upload :show-file-list="false" :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload" class="avatar-uploader" :data="uploadHeader"
                    action="http://localhost:8888/api/oss/file/upload?module=avatar">
                    <img v-if="emp.avatar" :src="emp.avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
                <el-form-item label="简介">
                  <el-input type="textarea" v-model="emp.synopsis" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="操作">
                  <el-button type="warning" plain @click="update2()">提交</el-button>
                </el-form-item>
              </el-form>

            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import { date } from 'jszip/lib/defaults'
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
//导入userApi.js脚本文件
import userApi from "@/api/userApi"
//导入token
import { getToken } from '@/utils/auth'
//导入empApi.js脚本文件
import empApi from "@/api/empApi"
export default {
  name: 'Profile',
  components: { UserCard },
  data() {
    return {
      user: {},
      //表中员工信息
      username: "",
      emp: {
        id: this.$store.getters.userId,//账号编号
        empName: "",//员工姓名
        empAge: "",//员工年龄
        empSex: "",//员工性别
        empAddress: "",//员工住址

        empPhone: "",//员工电话号码
        emil: "",//员工邮箱
        qq: "",//员工qq
        weix: "",//员工微信

        synopsis: "",//员工简介
        avatar: "",//员工头像

      },
      activeTab: 'activity',
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      //  //上传需要携带的数据
      uploadHeader: { "token": getToken() },
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser();
    this.search();
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    //根据账户id查询信息列表
    async search() {
      let res = await userApi.empByUserId({ id: this.emp.id })
      if (res.success) {
        this.emp = res.data.emp;
        this.username = res.data.username
        console.log(this.emp)
      }
    },
    //提交事件
    async update2() {
      //发送修改请求
      let res = await empApi.update2(this.emp);
      //判断是否成功
      if (res.success) {
        //提示
        this.$message.success(res.message);
      } else {
        //提示
        this.$message.error(res.message);
      }

    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      this.emp.avatar = res.data
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
  }
}
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}

/* //用户头像 */
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