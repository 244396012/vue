<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="兼职名称">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="兼职编码">
                <el-input v-model="form.code" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="统计时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  :clearable="false"
                  :unlink-panels="true"
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
            <el-button icon="el-icon-refresh" @click="extraResearch">重 置</el-button>
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
          fixed
          prop="num"
          label="#"
          width="65">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="userCode"
          label="兼职编号">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="userName"
          label="兼职姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="140"
          prop="languagePair"
          label="语言对">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="totalamount3"
          :label="form.prevYear3">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="totalamount2"
          :label="form.prevYear2">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="totalamount1"
          :label="form.prevYear1">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="totalamount0"
          :label="form.currentYear">
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
          name: '',
          code: '',
          rangeTime: '',
          currentYear: '',
          prevYear1: '',
          prevYear2: '',
          prevYear3: ''
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    created (){
      this.getTableTime();
      this.form.rangeTime = [this.getMonthFirstDay(),this.formatDate()];
      this.showTableList()
    },
    methods: {
      extraResearch (){
        this.getTableTime();
        this.form.rangeTime = [this.getMonthFirstDay(),this.formatDate()];
        this.form.name = '';
        this.form.code = '';
        this.showTableList();
      },
      //表头时间
      getTableTime (month = new Date().getMonth()+1){
        const date = new Date();
        this.form.currentYear = date.getFullYear() + '年' + month + '月';
        this.form.prevYear1 = date.getFullYear() - 1 + '年' + month + '月';
        this.form.prevYear2 = date.getFullYear() - 2 + '年' + month + '月';
        this.form.prevYear3 = date.getFullYear() - 3 + '年' + month + '月';
      },
      //当月第一天
      getMonthFirstDay (){
        const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() +1,
          day = 1;
        return year+'-'+month+'-'+day
      },
      //当日时间
      formatDate (){
        const date = new Date();
        const dateArr = [date.getFullYear(), date.getMonth()+1, date.getDate()];
        return dateArr.join('-');
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        if(!this.form.rangeTime){
          this.$message({
            type: 'warning',
            message: '请选择时间段'
          });
          return null
        }
        if(this.form.rangeTime[0].slice(0,4) !== this.form.rangeTime[1].slice(0,4)){
          this.$message({
            type: 'warning',
            message: '请选择同一年的时间段'
          });
          return null
        }
        if(this.form.rangeTime[0].slice(5, 7) !== this.form.rangeTime[1].slice(5, 7)){
          this.getTableTime(this.form.rangeTime[0].slice(5, 7) +'-'+this.form.rangeTime[1].slice(5, 7));
        }else{
          this.getTableTime(this.form.rangeTime[0].slice(5, 7));
        }
        this.loading = true;
        this.$http.get('/financeTask/parttimerSalaryReport', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            userName: this.form.name,
            userCode: this.form.code,
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
            this.totalTableList = res.data.data.totalCount;
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false;
        })
      }
    }
  }

</script>
