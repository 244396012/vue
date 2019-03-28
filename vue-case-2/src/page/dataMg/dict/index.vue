<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px">
      <el-button type="primary" @click="creatDict">新建专业词典</el-button>
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
          label="背景图">
          <template slot-scope="scope">
            <img class="logo" :src="'data:image/png;base64,'+scope.row.base64Img" alt="404">
          </template>
        </el-table-column>
        <el-table-column
          prop="dicName"
          label="词典名称">
        </el-table-column>
        <el-table-column
          prop="dicNameEn"
          label="外文名称">
        </el-table-column>
        <el-table-column
          prop="linkedAreaName"
          label="所关联的领域">
        </el-table-column>
        <el-table-column
          prop="sortWeight"
          label="排序">
          <template slot-scope="scope">
            <el-input type="number" step="1" min="1" max="99"
                      style="width:70px"
                      @keyup.enter.native="selfSort(scope.row.id, scope.row.sortWeight)"
                      v-model="scope.row.sortWeight"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="download" @click="editDict(scope.row.id,scope.row.dicName,scope.row.dicNameEn,
            scope.row.fileid,scope.row.linkedAreaName,scope.row.linkedAreaId, scope.row.base64Img)">编辑</el-button>
            <el-button type="text" class="delete" @click="deleteDict(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addDictModal :callback="getDictList" :editData="edit"></addDictModal>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import addDictModal from './Modal_AddDict'
  export default {
    components: {
      addDictModal
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        tableData: [],
        edit: {
          id: '',
          name: '',
          enName: '',
          imgId: '',
          imgUrl: '',
          areaName: '',
          areaId: ''
        },
        loading: false
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.getDictList()
    },
    methods: {
      //新建专业词典
      creatDict (){
        this.$store.commit('switchModal')
        for(let attr in this.edit){
          this.edit[attr] = ''
        }
      },
      //获取专业词典列表
      getDictList (){
        this.loading = true
        this.$http.get('/dictionary/dic/listAll')
          .then(res => {
            if(res.data.message === 'success' && res.data.data.length >= 0){
              this.tableData = res.data.data
            }
          this.loading = false
        })
      },
      // 排序
      selfSort (id, sort){
        if(+id <= 0){
          this.$message({
            type: 'warning',
            message: '请输入大于0的数字'
          })
          return false
        }
        this.$http.post('/dictionary/dic/updateSort',this.$qs.stringify({
          id: id,
          sortWeight: +sort
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getDictList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      },
      //编辑，初始化填充数据
      editDict(...arg) {
        this.edit.id = arg[0]
        this.edit.name = arg[1]
        this.edit.enName = arg[2]
        this.edit.imgId = arg[3]
        this.edit.areaName = arg[4]
        this.edit.areaId = arg[5]
        this.edit.imgUrl = arg[6]
        this.$store.commit('switchModal')
      },
      //删除
      deleteDict(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/dictionary/dic/deleteDic',{
            params: {
              id: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getDictList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  img.logo{
    margin: 10px 0;
    width: 120px;
    height: 120px;
    border: 1px solid #ededed;
  }
</style>
