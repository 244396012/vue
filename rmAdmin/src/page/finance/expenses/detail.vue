<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.taskNo" placeholder="任务编号"></el-input>
          <el-select v-model="form.company" placeholder="所属公司">
            <el-option
              v-for="item in formSelect.companyOptions"
              :key="item.Value"
              :label="item.Text"
              :value="item.Value"></el-option>
          </el-select>
          <el-date-picker
            v-model="form.rangeTime"
            :clearable="false"
            :unlink-panels="true"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="实际完成时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form,showTableList)">重 置</el-button>
        </div>
        <div class="button"></div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          prop="num"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="taskNo"
          label="任务编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="orgName"
          label="所属公司">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="taskName"
          label="任务名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="projectName"
          label="项目名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="languagePair"
          label="语言对">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="taskType"
          label="任务类型">
        </el-table-column>
        <el-table-column
          wmin-idth="80"
          prop="taskNumber"
          label="任务数量">
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="taskAmount"
          label="任务金额">
        </el-table-column>
        <el-table-column
          min-width="90"
          prop="settleAmount"
          label="结算金额">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="currencyName"
          label="币种">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="requireCompleteTime"
          label="要求完成时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="actualCompleteTime"
          label="实际完成时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="domain"
          label="专业领域">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="taskStatus"
          label="任务状态">
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
  import domain from '@/api/index';
  import pagination from '@/components/pagination';
  import { formatMoneyType$ } from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        form: {
          taskNo: '',
          company: '',
          rangeTime: []
        },
        formSelect: {
          moneyType: [
            {label: '人民币', value: '人民币'},
            {label: '美元', value: '美元'},
            {label: '欧元', value: '欧元'},
            {label: '英镑', value: '英镑'}
          ],
          companyOptions: [],
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    created (){
      this.$http.defaults.baseURL = domain.baseReportURL_r1;
      this.$http.get('/pangu/GetFreelancerFeeOrg')
        .then(res => {
          res.data.Success && (this.formSelect.companyOptions = res.data.Data);
        });
      this.$http.defaults.baseURL = domain.baseRMURL;
    },
    mounted (){
      if(this.$route.query.range && this.$route.query.range.includes(',')){
        this.form.rangeTime = this.$route.query.range.split(',');
      }
      this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/financeTask/listTaskDetail',{
          params: {
            userCode: this.$route.params.id,
            taskNo: this.form.taskNo,
            orgName: this.form.company,
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
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
            this.totalTableList = res.data.data.totalElements;
          }
          this.loading = false;
        })
      }
    }
  }

</script>
