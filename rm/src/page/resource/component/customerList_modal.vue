<template>
  <div>
    <el-dialog
      title="客户列表"
      width="800px"
      :visible.sync="$store.state.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center>
      <div style="width: 250px;padding: 10px 0;float: right">
        <el-input placeholder="搜索客户"
                  clearable
                  v-model="form.customerName" @input="searchCustomer"></el-input>
      </div>
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        ref="singleTable"
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column
          label="#"
          prop="num"
          width="60">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称">
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
      <div style="height: 15px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmCustomer">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import domain from '@/api/index';
  import utils from '@/utils/index';
  import pagination from '@/components/pagination';
  export default {
    components: { pagination },
    data (){
      return {
        form: {
          customerName: ''
        },
        loading: false,
        tableData: [],
        totalTableList: 0,
        currentRow: null
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.$http.defaults.baseURL = domain.baseECURL;
        this.loading = true;
        this.$http.post('/provider/customer', this.$qs.stringify({
          page: config.pageNo-1,
          rows: config.pageSize,
          customerName: this.form.customerName
        })).then(res => {
          if(res.data.success){
            this.tableData = [];
            const list = res.data.data.items;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.total
          }
          this.loading = false
        })
      },
      //搜索客户
      searchCustomer: utils.throttle(function() {
        this.showTableList()
      }, 500),
      //确认
      confirmCustomer (){
        if(!this.currentRow){
          this.$message({
            type: 'warning',
            message: '请先选择客户'
          });
          return false
        }
        const cusId = this.currentRow.customerCode;
        this.$http.post('/provider/sales', this.$qs.stringify({
          customerId: cusId
        })).then(res => {
          if(res.data.success){
            this.$emit('saleMg', {
              sale: res.data.data,
              customer: this.currentRow.customerName
            });
            this.form.customerName = '';
            this.$store.commit('showModal');
            this.$http.defaults.baseURL = domain.baseRMURL
          }
        })
      },
      //关闭
      closeModal (){
        this.$store.commit('showModal');
        this.$http.defaults.baseURL = domain.baseRMURL
      }
    }
  }
</script>
