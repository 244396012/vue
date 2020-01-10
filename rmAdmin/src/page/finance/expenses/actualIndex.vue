<template>
  <div class="page">
    <el-menu default-active="2" class="el-menu-demo filter-menu" mode="horizontal">
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
              :value="item.Text"></el-option>
          </el-select>
          <el-date-picker
            v-model="form.rangeTime"
            :clearable="false"
            :unlink-panels="true"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="申请时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form, showTableList)">重 置</el-button>
        </div>
        <div class="button"></div>
      </div>
    </div>
    <div class="default-style default-form"
         v-if="totalCountStr && totalCountStr !== '兼职申请费用总额'">
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
          min-width="140"
          prop="payCode"
          label="结算编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="partTimeNo"
          label="兼职编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="partTimeName"
          label="兼职姓名">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="company"
          label="所属公司">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="applyMoney"
          label="申请金额">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="payType"
          label="结算类型">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="币种">
          <template slot-scope="scope">{{scope.row.currentCode | formatMoneyType}}</template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="sumFee"
          label="申请总费用">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <router-link :to="{path:'/finance/expenses/detail/'+scope.row.partTimeNo+'?range='+scope.row.rangeTime}"
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
  import { formatMoneyType, formatMoneyTypeEn$ } from '@/common/filter';
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
            {label: '人民币', value: 'CNY'},
            {label: '美元', value: 'USD'},
            {label: '欧元', value: 'EUR'},
            {label: '英镑', value: 'GBP'}
          ],
          companyOptions: [],
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        totalCountStr: ''
      }
    },
    filters: {
      formatMoneyType: formatMoneyType
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
      formatMoneyTypeEn$: formatMoneyTypeEn$,
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/financeTask/getFianceActual', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            partTimeName: this.form.userName,
            partTimeNo: this.form.userCode,
            currentCode: this.form.moneyType,
            company: this.form.company,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              item.rangeTime = this.form.rangeTime;
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
        });
        //总费用
        this.$http.get('/financeTask/getActualSum', {
          params: {
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.totalCountStr = '兼职申请费用总额：';
            res.data.data.forEach(item => {
              this.totalCountStr += this.formatMoneyTypeEn$(item.key) + item.value + '，';
            });
            this.totalCountStr = this.totalCountStr.slice(0, -1);
          }
        })
      }
    }
  }

</script>
