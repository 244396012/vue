<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="语言对" class="width620">
                <el-select v-model="form.origin" placeholder="源语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select v-model="form.target" placeholder="目标语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="译员ID">
                <el-input v-model="form.transId" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="专业领域">
                <el-select v-model="form.field" placeholder="请选择">
                  <el-option
                    v-for="item in $store.state.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试时间">
                <el-date-picker v-model="form.rangeTime"
                  :clearable="false"
                  :unlink-panels="true"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="测试结果">
                <el-select v-model="form.result" placeholder="请选择">
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
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form,showTableList)">重 置</el-button>
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
          fixed
          prop="num"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="translatorCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="140"
          label="语言对">
          <template slot-scope="scope" v-if="scope.row.originLanguageName">{{scope.row.originLanguageName}} -> {{scope.row.targetLanguageName}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="专业领域">
          <template slot-scope="scope">{{scope.row.subDobmain | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="examStartTime"
          label="测试开始时间">
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
          width="100">
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
  import pagination from '@/components/pagination';
  import { formatDomainsStr } from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        form: {
          transId: '',
          origin: '',
          target: '',
          field: '',
          result: '',
          rangeTime: ''
        },
        formSelect: {
          resultOptions: ['合格','不合格']
        },
        loading: false,
        tableData: [],
        totalTableList: 0,
        multipleSelection: []
      }
    },
    filters: {
      formatDomain: formatDomainsStr
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
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/exam/admin/listSelectResult', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            translatorCode: this.form.transId,
            originLanguageCode: this.form.origin,
            targetLanguageCode: this.form.target,
            domainId: this.form.field,
            examResult: this.form.result,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalCount
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false
        })
      }
    }
  }

</script>
