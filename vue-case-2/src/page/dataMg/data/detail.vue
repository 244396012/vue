<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.parName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: left;padding-left: 20px;padding-right: 20px">
      <el-button class="default-btn" @click="goBack">返 回</el-button>
      <el-button class="float-right" type="primary">保 存</el-button>
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
          width="80">
        </el-table-column>
        <el-table-column
          prop="type"
          label="术语">
        </el-table-column>
        <el-table-column
          prop="transTxt"
          label="译文">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="delete" @click="deleteData()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination></pagination>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        breads: {
          curName: '',
          parName: '',
          parPath: '',
          originalName: ''
        },
        tableData: [
          {
            type: '术语',
            transTxt: '这是译文'
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
      this.breads.parPath = this.$route.matched[1].path
      this.breads.parName = this.$route.matched[1].name
    },
    methods: {
      goBack (){
        this.$router.push(this.breads.parPath)
      },
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

