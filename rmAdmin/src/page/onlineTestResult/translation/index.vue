<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.transId" placeholder="译员ID"></el-input>
          <el-select v-model="form.status" placeholder="状态">
            <el-option
              v-for="item in formSelect.statusOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="el-button-2">
            <el-select v-model="form.origin" placeholder="源语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select> -
            <el-select v-model="form.target" placeholder="目标语言">
              <el-option
                v-for="item in $store.state.languageList"
                :key="item.id"
                :label="item.chineseName"
                :value="item.englishName">
              </el-option>
            </el-select>
          </div>
          <div class="el-button-2">
            <el-select v-model="form.field" @change="selectSecondField" placeholder="专业领域">
              <el-option
                v-for="item in $store.state.fieldOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.id">
              </el-option>
            </el-select> -
            <el-select v-model="form.secondField" placeholder="二级领域">
              <el-option
                v-for="item in formSelect.secondOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <el-date-picker v-model="form.rangeTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="测试时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-select v-model="form.result" placeholder="测试结果" class="width110">
            <el-option
              v-for="(item,index) in formSelect.resultOptions"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetKeepAliveSearch">重 置</el-button>
        </div>
        <div class="button"></div>
      </div>
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
      resetKeepAliveSearch (){
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
        config.pageSize = config.pageSize || 20;
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
