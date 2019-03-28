<template>
  <div class="data-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <div class="filter pd-bg mg-top">
      <el-row>
        <el-col :span="19"><div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">部门：
              <el-input v-model="department" style="display: inline-block;width: 60%" placeholder="请输入部门"></el-input>
            </el-col>
            <el-col :span="12">姓名：
              <el-input v-model="name" style="display: inline-block;width: 60%" placeholder="请输入姓名"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">角色：
              <el-input v-model="role" style="display: inline-block;width: 60%" placeholder="请输入角色"></el-input>
            </el-col>
          </el-row>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          <el-button type="primary">筛 选</el-button>
        </div></el-col>
      </el-row>
    </div>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px;padding-left: 20px;">
      <el-button type="primary" icon="el-icon-plus">添 加</el-button>
    </div>
    <!--列表内容-->
    <div class="table mg-top">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          label="#"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="department"
          label="所在部门">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="最后登录时间">
        </el-table-column>
        <el-table-column
          prop="isOn"
          label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOn"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="download" @click="editData()">编辑</el-button>
            <el-button type="text" class="delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination></pagination>
      <addOrEdit></addOrEdit>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  import addOrEdit from './userlist/Modal_Add'
  export default {
    components: {
      pagination, addOrEdit
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        department: '',
        name: '',
        role: '',
        tableData: [
          {
            id: 1,
            name: '术语',
            department: '术语',
            phone: '13099999999',
            role: '术语',
            addTime: '2018-12-12',
            lastTime: '2018-12-12',
            isOn: true
          }
        ],
        loading: false
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
    },
    methods: {
      //编辑
      editData(id) {

      },
      //删除
      deleteData(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/main";
</style>
