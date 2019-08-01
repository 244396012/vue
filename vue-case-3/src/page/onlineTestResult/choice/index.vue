<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple pd-r-50 dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="译员ID">
                <el-input v-model="form.transId" placeholder="请输入译员ID"></el-input>
              </el-form-item>
              <el-form-item label="语言">
                <el-select
                  v-model="form.language"
                  placeholder="请选择语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="测试结果">
                <el-select
                  v-model="form.result"
                  placeholder="请选择测试结果">
                  <el-option
                    v-for="(item,index) in formSelect.resultOptions"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="showTableList">查 询</el-button>
            <el-button @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="num"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="translatorCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="targetLanguageName"
          label="语言">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="examStartTime"
          label="测试开始时间">
        </el-table-column>
        <el-table-column
          prop="examTimes"
          label="测试次数">
        </el-table-column>
        <el-table-column
          prop="examOverview"
          label="测试情况">
        </el-table-column>
        <el-table-column
          prop="examResult"
          label="测试结果">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click.native="$router.push('/onlineTestResult/choice/'+scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        showTableUrl:'/exam/admin/listSelectResult',
        form: {
          transId: '',
          language: '',
          rangeTime: '',
          result: ''
        },
        formSelect: {
          resultOptions: ['合格','不合格']
        },
        tableData: [],
        multipleSelection: []
      }
    },
    created (){
      this.showTableList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //展示表格数据
      showTableList (config){
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        this.loading = true
        this.$http.get(this.showTableUrl, {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            translatorCode: this.form.transId,
            targetLanguageCode: this.form.language,
            examResult: this.form.result,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.tableData = []
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize
              this.tableData.push(item)
            })
            this.totalTableList = res.data.data.totalElements
          }
          this.loading = false
        })
      }
    }
  }

</script>
