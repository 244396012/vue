<template>
  <div class="detail">
    <el-row>
      <el-col :span="20">
        <el-table
          border
          stripe
          :max-height="$store.state.tableHeight"
          v-loading="loading"
          :data="tableData">
          <el-table-column
            label="#"
            prop="num"
            width="50">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="operatePeople"
            label="分配人">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="partTimeName"
            label="兼职译员">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="testLevel"
            label="测试等级">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="unitPrice"
            label="单价">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="remarks"
            label="备注">
          </el-table-column>
        </el-table>
        <template v-if="totalTableList > 0">
          <pagination-detail :callback="showEmployList" :total="totalTableList"></pagination-detail>
        </template>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  export default {
    components: {
      'pagination-detail': pagination,
      'pagination-train': pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    methods: {
      //录用详情
      showEmployList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        let url = '/resourceOrder/hireList';
        this.$http.get(url, {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            projectNo: this.$route.query.p
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
          }
          this.loading = false
        })
      }
    }
  }
</script>
