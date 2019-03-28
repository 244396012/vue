<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{breads.originalName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breads.curName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--筛选-->
    <div class="filter pd-bg mg-top">
      <el-row>
        <el-col :span="19"><div class="grid-content bg-purple">
          <el-row>
            <el-col :span="12">术语文件名称：
              <el-input v-model="fileName" style="display: inline-block;width: 60%"  placeholder="请输入文件名称"></el-input>
            </el-col>
            <el-col :span="12">所属领域：
              <el-select v-model="areaValue1" @change="getSearchSpecialtyId" placeholder="全部" style="width: 35%">
                <el-option
                  v-for="item in firstAreaArr"
                  :key="item.id"
                  :label="item.fullSpecialtyName"
                  :value="item.fullSpecialtyName">
                </el-option>
              </el-select>
              <el-select v-model="areaValue2" placeholder="二级分类" style="width: 35%">
                <el-option
                  v-for="item in secondAreaArr"
                  :key="item.id"
                  :label="item.fullSpecialtyName"
                  :value="item.fullSpecialtyName">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="height: 40px;line-height: 40px;position: relative">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;导入时间：&nbsp;
              <el-date-picker style="position: absolute;width: 60%;"
                              v-model="createTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple-light">
          <el-button type="primary" @click="getTermFilesList">筛 选</el-button>
          <el-button type="" @click="resetTermFilesList">重 置</el-button>
        </div></el-col>
      </el-row>
    </div>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px;padding-left: 20px;">
      <el-button class="default-btn float-left" icon="el-icon-plus" @click="switchAddModal">添加术语</el-button>
      <el-button type="primary" icon="el-icon-upload2" @click="switchImportModal">导入文件</el-button>
    </div>
    <!--列表内容-->
    <div class="table mg-top">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%;">
        <el-table-column
          label="#"
          prop="num"
          width="50">
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="术语文件名称">
        </el-table-column>
        <el-table-column
          label="所属分类">
          <template slot-scope="scope">
            {{scope.row.domainName + ' - ' + scope.row.subDomainName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="languagePair"
          label="语言对">
        </el-table-column>
        <el-table-column
          prop="dicCount"
          label="术语数">
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="导入时间">
        </el-table-column>
        <el-table-column
          prop="isImported"
          label="是否入库">
          <template slot-scope="scope">
            {{scope.row.isImported?'已入库':'未入库'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="detail" @click="$router.push('/dataMg/term/'+scope.row.id +'?wd='+scope.row.isImported)">查看</el-button>
            <el-button type="text" class="download" @click="editTermFile(scope.row.id,scope.row.fileName,scope.row.domainName,scope.row.subDomainName,scope.row.sourceCode,scope.row.targetCode)">编辑</el-button>
            <el-button type="text" class="put"
						v-if="!scope.row.isImported"
						@click="putTermFile(scope.row.id)">入库</el-button>
            <el-button type="text" class="delete" @click="deleteTermFile(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalFiles > 0">
        <pagination :callback="getTermFilesList" :total="totalFiles"></pagination>
      </template>
      <editTermModal :params="toParams" :callback="getTermFilesList"></editTermModal>
      <addTermModal></addTermModal>
      <importTermModal :callback="getTermFilesList"></importTermModal>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  import editTermModal from './Modal_Edit'
  import addTermModal from './Modal_AddTerm'
  import importTermModal from './Modal_Import'
  export default {
    components: {
      pagination, editTermModal, addTermModal, importTermModal
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        toParams: '', //向子组件传递toParams
        fileName: '',//文件名称
        areaValue1: '', //领域：一级、二级
        areaValue2: '',
        createTime: '',//新建时间
        tableData: [],
        loading: false,
        totalFiles: 0
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.getTermFilesList()
    },
    computed: {
      ...mapGetters({
        firstAreaArr: 'firstArea',
        secondAreaArr: 'secondArea'
      })
    },
    methods: {
      ...mapActions([
        'switchAddModal',
        'switchEditModal',
        'switchImportModal'
      ]),
      // 获取一级领域specialtyId，加载二级领域
      getSearchSpecialtyId (val){
        let obj = {}
        obj = this.firstAreaArr.find((item)=>{
          return item.fullSpecialtyName === val
        })
        this.areaValue2 = ''
        this.getSecondArea(obj.specialtyId)
      },
      // 加载术语文件列表、筛选
      getTermFilesList (config){
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        this.loading = true
        this.$http.get('/dictionary/term/listTermFiles', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            fileName: this.fileName,
            domainName: this.areaValue1,
            subDomainName: this.areaValue2,
            timeStart: this.createTime ? this.createTime[0]+' 00:00:00' : '',
            timeEnd: this.createTime ? this.createTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.tableData = []
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize
              this.tableData.push(item)
            })
            this.totalFiles = res.data.data.totalElements
          }
          this.loading = false
        })
      },
      // 重置筛选
      resetTermFilesList (){
        this.fileName = ''
        this.areaValue1 = ''
        this.areaValue2 = ''
        this.createTime = ''
        this.getTermFilesList()
      },
      // 编辑术语文件，填充id、name
      editTermFile(...params) {
        this.switchEditModal()
        this.toParams = params
      },
      // 确认入库
      putTermFile (id){
        this.$confirm('是否确认入库', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/dictionary/term/saveBatchTerms', this.$qs.stringify({
            fileId: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '入库成功'
              })
              this.getTermFilesList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      // 删除术语文件
      deleteTermFile(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/dictionary/term/termFileDelete',{
            params: {
              fileId: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getTermFilesList()
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

