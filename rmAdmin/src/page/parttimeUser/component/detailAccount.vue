<template>
  <div style="padding:8px 0">
    <el-row v-if="accountAmount.cNY_TotalIncome || accountAmount.uSD_TotalIncome || accountAmount.eUR_TotalIncome || accountAmount.gBP_TotalIncome">
      <el-col :span="15" style="margin-bottom: 10px">
        <table class="parttime-table">
          <thead>
          <tr>
            <td>币种</td>
            <td>总金额</td>
            <td>可提现</td>
            <td>余额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="accountAmount.cNY_TotalIncome">
            <td>人民币</td>
            <td>{{accountAmount.cNY_TotalIncome}}</td>
            <td>{{accountAmount.cNY_Withdrawable}}</td>
            <td>{{accountAmount.cNY_Balance}}</td>
          </tr>
          <tr v-if="accountAmount.uSD_TotalIncome">
            <td>美元</td>
            <td>{{accountAmount.uSD_TotalIncome}}</td>
            <td>{{accountAmount.uSD_Withdrawable}}</td>
            <td>{{accountAmount.uSD_Balance}}</td>
          </tr>
          <tr v-if="accountAmount.eUR_TotalIncome">
            <td>欧元</td>
            <td>{{accountAmount.eUR_TotalIncome}}</td>
            <td>{{accountAmount.eUR_Withdrawable}}</td>
            <td>{{accountAmount.eUR_Balance}}</td>
          </tr>
          <tr v-if="accountAmount.gBP_TotalIncome">
            <td>英镑</td>
            <td>{{accountAmount.gBP_TotalIncome}}</td>
            <td>{{accountAmount.gBP_Withdrawable}}</td>
            <td>{{accountAmount.gBP_Balance}}</td>
          </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
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
        width="50">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="110"
        prop="gmtCreate"
        label="时间">
      </el-table-column>
      <el-table-column
        min-width="100"
        label="金额">
        <template slot-scope="scope">
          <span v-if="scope.row.exchangeType.includes('提现')" style="color: orangered">-{{scope.row.amount}}</span>
          <span v-else style="color: #159396">+{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="80"
        label="币种">
        <template slot-scope="scope">{{scope.row.currencyCode | formatMoneyType}}</template>
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="exchangeType"
        label="变动类型">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="100"
        prop="settleYearMonth"
        label="结算时间">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="140"
        prop="taskNo"
        label="任务/订单编号">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="payType"
        label="结算方式">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="140"
        prop="settleNo"
        label="结算编号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="100"
        prop="bank"
        label="银行名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="100"
        prop="depositBank"
        label="开户行">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="account"
        label="账户信息">
      </el-table-column>
    </el-table>
    <template v-if="totalTableList > 0">
      <pagination :callback="showTableList" :total="totalTableList"></pagination>
    </template>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import {formatMoneyType} from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        tableData: [],
        accountAmount: {}
      }
    },
    filters: {
      formatMoneyType: formatMoneyType
    },
    methods: {
      //获取账户金额信息
      showAmount (){
        this.$http({
          method: 'get',
          url: '/financeNew/listPersonAccountSummary?userCode='+this.$route.query.code
        }).then(res => {
          if(res.data.message === 'success'){
            this.accountAmount = res.data.data
          }
        })
      },
      //获取列表
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/financeNew/accountDetail', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            filterStr: '',
            userCode: this.$route.query.code
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.pageResults.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.pageResults.totalCount
          }
          this.loading = false
        })
      }
    }
  }
</script>
