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
            <el-col :span="12">抓取网站：
              <el-select v-model="website" placeholder="请选择">
                <el-option
                  v-for="item in websiteList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">状态：
              <el-select v-model="status" placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="height: 40px;line-height: 40px;">抓取时间：&nbsp;
              <el-date-picker style="position: absolute;"
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
          <el-button type="primary" @click="getRobotList">筛 选</el-button>
          <el-button type="" @click="resetList">重 置</el-button>
        </div></el-col>
      </el-row>
    </div>
    <div class="pd-bg mg-top" style="text-align: right;padding-right: 20px">
      <el-button type="primary" @click="$store.commit('switchAddModal')">新建抓取请求</el-button>
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
          width="50">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
          <template slot-scope="scope">
            {{ scope.row.type | formatType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="webName"
          label="抓取网站">
        </el-table-column>
        <el-table-column
          prop="scrapyField"
          label="抓取字段">
          <template slot-scope="scope">
            {{ scope.row.scrapyField | formatField }}
          </template>
        </el-table-column>
        <el-table-column
          prop="uploadCount"
          label="上传数据条数">
        </el-table-column>
        <el-table-column
          prop="scrapyCount"
          label="抓取数据条数">
        </el-table-column>
        <el-table-column
          prop="scrapyStartTime"
          label="抓取开始时间">
        </el-table-column>
        <el-table-column
          prop="scrapyState"
          label="状态"><!--状态：抓取中，没有操作按钮-->
          <template slot-scope="scope">
            {{ scope.row.scrapyState | formatState }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope" v-if="scope.row.scrapyState !== '抓取中' && +scope.row.scrapyState !== 1">
            <el-button type="text" class="detail"
                       v-if="scope.row.scrapyState === '抓取完成' || +scope.row.scrapyState === 2"
                       @click="$router.push('/dataMg/robot/'+scope.row.id+'?wd=robot')">查看</el-button>
            <el-button type="text" class="put" @click="startData(scope.row.id)">抓取</el-button>
            <el-button type="text" class="download" @click="downloadData(scope.row.id)">下载</el-button>
            <el-button type="text" class="delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <a :href="downloadRow" id="downloadRow" target="_blank" style="display: none">下载</a>
      <template v-if="totalList > 0">
        <pagination :callback="getRobotList" :total="totalList"></pagination>
      </template>
      <addRobotModal :callback="getRobotList" :websiteList="websiteList"></addRobotModal>
    </div>
  </div>
</template>
<script>
  import { getBread } from '@/utils'
  import pagination from '@/components/Pagination'
  import addRobotModal from './Modal_AddRobot' //新建抓取
  export default {
    components: {
      pagination, addRobotModal
    },
    data (){
      return {
        breads: {
          curName: '',
          originalName: ''
        },
        statusList: [
          {id: 0, name: '待抓取'},
          {id: 1, name: '抓取中'},
          {id: 2, name: '抓取完成'}
        ],
        downloadRow: '', //下载抓取row
        websiteList: [],
        website: '', //抓取网站
        status: '',  //状态
        createTime: '',//新建时间
        tableData: [],
        totalList: 0,
        loading: false
      }
    },
    mounted (){
      this.breads = getBread({
        router: this.$router,
        routes: this.$route
      })
      this.getWebsiteList()
      this.getRobotList()
    },
    filters: {
      formatType (type){
        if(+type === 1){
          return '术语'
        }else if(+type === 2){
          return '语料'
        }else{
          return type
        }
      },
      formatField (field){
        if(+field === 1){
          return '译文'
        }else if(+field === 2){
          return '释义'
        }else if(+field === 3){
          return '译文和释义'
        }else{
          return field
        }
      },
      formatState (state){
        if(+state === 0){
          return '待抓取'
        }else if(+state === 1){
          return '抓取中'
        }else if(+state === 2){
          return '抓取完成'
        }else{
          return state
        }
      }
    },
    methods: {
      //获取website列表
      getWebsiteList (){
        this.$http.get('/dictionary/machineScrapy/getScrapyWebsites')
          .then(res => {
            if(res.data.message === 'success'){
              this.websiteList = res.data.data
            }
          })
      },
      //筛选、获取抓取列表
      getRobotList(config) {
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        this.loading = true
        this.$http.get('/dictionary/machineScrapy/listScrapyWebsite', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            website: this.website,
            scrapyState: this.status,
            startTime: this.createTime ? this.createTime[0]+' 00:00:00' : '',
            endTime: this.createTime ? this.createTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = []
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize
              this.tableData.push(item)
            })
            this.totalList = res.data.data.totalElements
          }
          this.loading = false
        })
      },
      //重置筛选
      resetList (){
        this.website = ''
        this.status = ''
        this.createTime = ''
        this.getRobotList.call(this)
      },
      //抓取
      startData (id){
        this.$confirm('是否确认抓取', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/dictionary/machineScrapy/startScrapyRequest',this.$qs.stringify({
            scrapyRecordId: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getRobotList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //下载抓取条目
      downloadData(id) {
        this.downloadRow = this.$http.defaults.baseURL + '/dictionary/machineScrapy/downLoadsScrapyContent?scrapyRecordId='+id
        setTimeout(() => {
          document.getElementById('downloadRow').click()
        },150)
      },
      //删除条目
      deleteData(id) {
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/dictionary/machineScrapy/deleteScrapyRequest',{
            params: {
              scrapyRecordId: id
            }
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getRobotList()
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

