<template>
  <div style="padding:8px 0">
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
        prop="gmtCreate"
        label="时间">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="amount"
        label="金额(元)">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="changeType"
        label="变动类型">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="settleType"
        label="结算方式">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="account"
        label="到账账户">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="balance"
        label="账户剩余(元)">
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
    methods: {
      //获取列表
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/finance/listFinanceDetail', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements;
          }
          this.loading = false
        })
      }
    }
  }
</script>
