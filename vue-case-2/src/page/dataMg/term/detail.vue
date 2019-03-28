<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.parName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="pd-bg mg-top" style="text-align: left;padding-left: 20px;padding-right: 20px">
      <el-button class="default-btn" @click="goBack">返 回</el-button>
      <el-button class="float-right" type="primary"
                 @click="addData"
                 v-if="!isRobot && !isImport"
                 :disabled="btn.disabled">{{btn.txt}}</el-button>
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
          prop="num"
          width="80">
        </el-table-column>
        <el-table-column
          prop="source"
          label="术语">
        </el-table-column>
        <el-table-column
          prop="target"
          label="译文">
        </el-table-column>
        <el-table-column
          prop="targetDesc"
          label="解释">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope" v-if="!isRobot">
            <el-button type="text" class="edit"
                       v-if="!isImport"
                       @click="editData(scope.row.source,scope.row.target,scope.row.targetDesc,scope.row.id)">编辑</el-button>
            <el-button type="text" class="delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="total > 0">
        <pagination :callback="getTermList" :total="total"></pagination>
      </template>
      <editModal :callback="getTermList" :row="row"></editModal>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  import editModal from './Modal_Edit_Detail'
  export default {
    components: {
      pagination, editModal
    },
    data (){
      return {
        isRobot: false, //是否从抓取页面跳转
        isImport: false, //是否入库
        breads: {
          curName: '',
          parName: '',
          parPath: '',
          originalName: ''
        },
        btn: {
          txt: '入 库',
          disabled: false
        },
        row: [],
        tableData: [],
        total: 0,
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
      this.$route.query.wd === 'robot' && (this.isRobot = true)
      this.$route.query.wd === 'true' && (this.isImport = true)
      this.getTermList()

    },
    methods: {
      goBack (){
        this.$router.push(this.breads.parPath)
      },
      // 加载术语列表
      getTermList(config) {
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        let url = '/dictionary/term/termFileList'
        const data = {
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          fileId: this.$route.params.id
        }
        if(this.isRobot){
          url = '/dictionary/machineScrapy/getScrapyConent'
          data.scrapyRecordId = this.$route.params.id
          delete data.fileId
        }
        this.loading = true
        this.$http.get(url,{ params: data })
          .then(res => {
            if(res.data.message === 'success' && res.data.data){
              this.tableData = []
              if(this.isRobot){
                res.data.data.content.forEach((item, index) => {
                  const obj = {}
                  obj.source = item.original
                  obj.target = item.translation
                  obj.targetDesc = item.interpretation
                  obj.num = (index + 1) + (config.pageNo-1)*config.pageSize
                  this.tableData.push(obj)
                })
              }else{
                res.data.data.content.forEach((item, index) => {
                  item.num = (index + 1) + (config.pageNo-1)*config.pageSize
                  this.tableData.push(item)
                })
              }
              this.total = res.data.data.totalElements
            }
            this.loading = false
          })
      },
      // 保存术语
      addData() {
        this.btn.txt = '入库中'
        this.btn.disabled = true
        let url = '/dictionary/term/saveBatchTerms'
        const data = {
          fileId: this.$route.params.id
        }
        this.$http.post(url, this.$qs.stringify(data))
          .then(res => {
            res.data.message === 'success'
            ? this.$message({
                type: 'success',
                message: '入库成功'
              })
            : this.$message({
                type: 'error',
                message: res.data.message
              })
            this.btn.txt = '入 库'
            this.btn.disabled = false
            this.$router.push('/dataMg/term')
          })
      },
      // 编辑术语
      editData(...row) {
        this.$store.commit('switchModal')
        this.row = row
      },
      // 删除术语条目
      deleteData(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/dictionary/term/termTempDelete',{
            params: {
              termIds: [id].toString()
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getTermList()
            }else{
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

