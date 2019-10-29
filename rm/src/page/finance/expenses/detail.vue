<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="96px">
              <el-form-item label="任务编号">
                <el-input v-model="form.taskNo" placeholder="请输入任务编号"></el-input>
              </el-form-item>
              <el-form-item label="所属公司">
                <el-select v-model="form.company" placeholder="请选择所属公司">
                  <el-option
                    v-for="item in formSelect.companyOptions"
                    :key="item.Value"
                    :label="item.Text"
                    :value="item.Value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="实际完成时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
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
        v-loading="loading"
        :data="tableData">
        <el-table-column
          prop="num"
          label="#"
          width="40">
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
          min-width="90"
          prop="languagePair"
          label="语言对">
        </el-table-column>
        <el-table-column
          width="80"
          prop="taskType"
          label="任务类型">
        </el-table-column>
        <el-table-column
          width="80"
          prop="taskNumber"
          label="任务数量">
        </el-table-column>
        <el-table-column
          width="90"
          prop="taskAmount"
          label="任务金额">
        </el-table-column>
        <el-table-column
          width="90"
          prop="settleAmount"
          label="结算金额">
        </el-table-column>
        <el-table-column
          width="80"
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
          min-width="90"
          prop="domain"
          label="专业领域">
        </el-table-column>
        <el-table-column
          width="80"
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
          rangeTime: ''
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
      this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
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
            this.totalTableList = res.data.totalElements
          }
          this.loading = false;
        })
      }
    }
  }

</script>
