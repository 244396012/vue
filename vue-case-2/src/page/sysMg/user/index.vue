<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px;padding-left: 20px;">
      <el-button type="primary" icon="el-icon-plus">添加角色</el-button>
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
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="explain"
          label="职能描述">
        </el-table-column>
        <el-table-column
          prop="member"
          label="成员数量">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="detail" @click="setData(scope.row.id)">权限配置</el-button>
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
  import addOrEdit from './Modal_Add'
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
            roleName: '术语',
            explain: '术语',
            member: '13099999999'
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
      setData(id) {
        this.$router.push('/sysMg/user/'+ id)
      },
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
