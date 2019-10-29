<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="语言对" class="width620">
                <el-select
                  v-model="form.origin"
                  placeholder="请选择原文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.target"
                  placeholder="请选择译文语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="译员ID">
                <el-input v-model="form.transId" placeholder="请输入译员ID"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="form.status"
                  placeholder="请选择状态">
                  <el-option
                    v-for="item in formSelect.statusOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="专业领域" class="width620">
                <el-select
                  @change="selectSecondField"
                  v-model="form.field" placeholder="请选择一级领域">
                  <el-option
                    v-for="item in $store.state.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.secondField" placeholder="请选择二级领域">
                  <el-option
                    v-for="item in formSelect.secondOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.id">
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
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="doExtraSearch">重 置</el-button>
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
          min-width="80"
          prop="auditState"
          label="状态">
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="translatorCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="translatorLevel"
          label="译员等级">
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="questionLevel"
          label="试题等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语言对">
          <template slot-scope="scope" v-if="scope.row.originLanguageName">{{scope.row.originLanguageName}} -> {{scope.row.targetLanguageName}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="专业领域">
          <template slot-scope="scope">{{scope.row.subDomains | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="examStartTime"
          label="测试开始时间">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="auditResult"
          label="审核结果">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="试题领域">
          <template slot-scope="scope">{{scope.row.domains | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="测试后等级">
          <template slot-scope="scope">{{scope.row.setLevel?'P'+scope.row.setLevel:''}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="auditUserName"
          label="审核人">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="110">
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
          status: '',
          field: '',
          secondField: '',
          result: '',
          rangeTime: ''
        },
        formSelect: {
          statusOptions: ['待审核','已审核'],
          resultOptions: ['通过','不通过'],
          levelOptions: ['初级','中级','高级'],
          secondOptions: []
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        multipleSelection: []
      }
    },
    filters: {
      formatDomain: formatDomainsStr
    },
    created (){
      this.showTableList();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      doExtraSearch (){
        this.formSelect.secondOptions = [];
        this.resetSearch(this.form, this.showTableList)
      },
      //获取二级领域
      selectSecondField (id){
        const result = this.$store.state.fieldOptions.find(item => {
          return item.id === id;
        });
        const sid = result.specialtyId || '';
        this.form.secondField = '';
        this.formSelect.secondOptions = [];
        this.getSecondField(sid).then(res => {
          this.formSelect.secondOptions = res;
        });
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/exam/admin/getWorkingList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            translatorCode: this.form.transId,
            originLanguageCode: this.form.origin,
            targetLanguageCode: this.form.target,
            domainIds: this.form.field,
            subDomainIds: this.form.secondField,
            auditState: this.form.status,
            auditResult: this.form.result,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
          }
          this.loading = false
        })
      }
    }
  }

</script>
