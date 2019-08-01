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
              <el-form-item label="状态">
                <el-select
                  v-model="form.state"
                  placeholder="请选择状态">
                  <el-option
                    v-for="(item,index) in formSelect.stateOptions"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="试题等级">
                <el-select
                  v-model="form.level"
                  placeholder="请选择试题等级">
                  <el-option
                    v-for="item in formSelect.levelOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="原文语言">
                <el-select
                  v-model="form.languageOrigin" placeholder="请选择原文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="译文语言">
                <el-select
                  v-model="form.languageTarget" placeholder="请选择译文语言">
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
              <el-form-item label="试题领域">
                <el-select
                  v-model="form.field"
                  placeholder="请选择试题领域">
                  <el-option
                    v-for="item in formSelect.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核结果">
                <el-select
                  v-model="form.result"
                  placeholder="请选择审核结果">
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
          width="90"
          prop="auditState"
          label="状态">
        </el-table-column>
        <el-table-column
          width="90"
          prop="translatorCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          width="90"
          prop="translatorLevel"
          label="译员等级">
        </el-table-column>
        <el-table-column
          width="90"
          prop="questionLevel"
          label="试题等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          label="语言对">
          <template slot-scope="scope">
            {{item.originLanguageName +'-'+item.targetLanguageName}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="examStartTime"
          label="测试开始时间">
        </el-table-column>
        <el-table-column
          width="80"
          prop="auditResult"
          label="审核结果">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="试题领域">
          <template slot-scope="scope">
            <template v-for="item in scope.row.domains">{{item.fullSpecialtyName+' '}}</template>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          prop="setLevel"
          label="测试后等级">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text"
                       v-if="scope.row.auditState === '已审'"
                       @click="$router.push('/onlineTestResult/trans/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="scope.row.auditState === '待审'"
                       @click="$router.push('/onlineTestResult/trans/verify/'+scope.row.id)">审核</el-button>
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
        showTableUrl:'/exam/admin/getWorkingList',
        form: {
          transId: '',
          level: '',
          languageOrigin: '',
          languageTarget: '',
          field: '',
          rangeTime: '',
          state: '',
          result: ''
        },
        formSelect: {
          fieldOptions: [],
          stateOptions: ['待审','已审'],
          resultOptions: ['未通过','已通过'],
          levelOptions: ['初级','中级','高级']
        },
        tableData: [],
        multipleSelection: []
      }
    },
    created (){
      this.showTableList()
      this.getFirstField().then(res => {
        this.formSelect.fieldOptions = res
      })
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
            questionLevel: this.form.level,
            originLanguageCode: this.form.languageOrigin,
            targetLanguageCode: this.form.languageTarget,
            domainIds: this.form.field,
            auditState: this.form.state,
            auditResult: this.form.result,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          // console.log(res);
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
