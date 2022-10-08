<template>
  <el-main>
        <!-- 查询条件 -->
        <el-form :model="searchModel" ref="searchForm" label-width="80px" :inline="true" size="small">
            <el-form-item>
                <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search(pageNo,pageSize)">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="resetValue()">重置</el-button>
                <el-button type="success" icon="el-icon-plus" @click="openAddWindow()">新增</el-button>
            </el-form-item>
        </el-form>
   </el-main>
</template>

<script>
export default {
      data(){
        return{
          searchModel:{
            roleName:"",
          }
        }
      }
  
}
</script>

<style>

</style>