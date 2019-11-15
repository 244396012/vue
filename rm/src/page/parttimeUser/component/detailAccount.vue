<template>
  <div style="padding:8px 0">
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
        min-width="100"
        prop="exchangeType"
        label="变动类型">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="payType"
        label="结算方式">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="settleNo"
        label="订单/结算编号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="110"
        prop="account"
        label="到账账户">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="balance"
        label="账户剩余">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="110"
        prop="remark"
        label="备注">
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
        tableData: []
      }
    },
    filters: {
      formatMoneyType: formatMoneyType
    },
    methods: {
      //获取列表
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
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
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalCount;
          }
          this.loading = false
        })
      }
    }
  }
</script>
