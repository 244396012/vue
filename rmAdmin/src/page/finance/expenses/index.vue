<template>
  <div class="page">
    <el-menu default-active="1" class="el-menu-demo filter-menu" mode="horizontal">
      <el-menu-item index="1" @click.native="$router.push('/finance/expenses')">应付费用</el-menu-item>
      <el-menu-item index="2" @click.native="$router.push('/finance/expenses/actual')">实付费用</el-menu-item>
    </el-menu>
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.userCode" placeholder="兼职编号"></el-input>
          <el-input v-model="form.userName" placeholder="兼职姓名"></el-input>
          <el-select v-model="form.moneyType" placeholder="币种">
            <el-option
              v-for="item in formSelect.moneyType"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-select v-model="form.company" class="width110" placeholder="所属公司">
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
            start-placeholder="统计时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form, showTableList)">重 置</el-button>
        </div>
        <div class="button"></div>
      </div>
    </div>
    <div class="default-style default-form"
         v-if="totalCountStr && totalCountStr !== '兼职费用总额'">
      <el-row>
        <el-col :span="24" style="line-height: 32px;font-size: 13px;">{{totalCountStr}}</el-col>
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
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="userCode"
          label="兼职编号">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="userRealName"
          label="兼职姓名">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="orgName"
          label="所属公司">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="160"
          label="统计时间">
          <template slot-scope="scope">
            {{(scope.row.rangeTime && scope.row.rangeTime.length>0) ? scope.row.rangeTime[0] +' - '+ scope.row.rangeTime[1] : ''}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="settleAmount"
          label="兼职金额">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="currencyName"
          label="币种">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <router-link :to="{path:'/finance/expenses/detail/'+scope.row.userCode+'?range='+scope.row.rangeTime}"
                         class="blank"
                         target="_blank">查看</router-link>
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
  import domain from '@/api/index';
  import pagination from '@/components/pagination';
  import { formatMoneyTypeEn } from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        form: {
          userName: '',
          userCode: '',
          company: '',
          moneyType: '',
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
        tableData: [],
        totalCountStr: ''
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
      this.form.rangeTime = [this.getPrevMonthFirstDay, this.getPrevMonthLastDay];
      this.showTableList()
    },
    computed: {
      //上月/上上月第一天
      getPrevMonthFirstDay (){
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth(),
          day = 1;
        let isFirstMonth = month === 0;
        isFirstMonth && (year -= 1);
        if(date.getDate() < 16){
          isFirstMonth && (month = 11)
        }else{
          isFirstMonth && (month = 12)
        }
        return year+'-'+month+'-'+day
      },
      //上月/上上月最后一天
      getPrevMonthLastDay (){
        let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth();
        let isFirstMonth = month === 0;
        isFirstMonth && (year -= 1);
        if(date.getDate() < 16){
          isFirstMonth && (month = 11)
        }else{
          isFirstMonth && (month = 12)
        }
        let day = new Date(year, month, 0).getDate(); //day为0时，会自动判断为最后一天
        return year+'-'+month+'-'+day
      }
    },
    methods: {
      formatMoneyTypeEn: formatMoneyTypeEn,
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/financeTask/listFinaceOverview', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            userName: this.form.userName,
            userCode: this.form.userCode,
            currencyName: this.form.moneyType,
            orgId: this.form.company,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.perPage.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              item.rangeTime = this.form.rangeTime;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.perPage.totalCount;
            const totalList = res.data.data.total;
            this.totalCountStr = '兼职费用总额：';
            totalList.forEach(item => {
              if(item.currencyName && item.settleAmount){
                this.totalCountStr += this.formatMoneyTypeEn(item.currencyName) + item.settleAmount+ '，';
              }
            });
            this.totalCountStr = this.totalCountStr.slice(0, -1);
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
