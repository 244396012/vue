<template>
  <div>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">积分记录</p>
    <el-table
      border
      stripe
      :max-height="$store.state.tableHeight"
      v-loading="loading"
      :data="scoreDetail.tableData">
      <el-table-column
        prop="num"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="gmtCreate"
        label="发放时间">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="remark"
        label="积分变更">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="inOutCome"
        label="积分">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="totalPoint"
        label="累计积分">
      </el-table-column>
    </el-table>
    <template v-if="scoreDetail.total > 0">
      <pagination :callback="showScoreDetail" :total="scoreDetail.total"></pagination>
    </template>
    <p class="sy-bold sy-title" style="overflow: auto;line-height: 32px">签到记录
      <span style="float: right;font-weight: 400;font-size: 14px;margin-left: 10px">总签到次数：{{sign.total}}天</span>
      <span style="float: right;font-weight: 400;font-size: 14px">连续签到：{{sign.continuityCount}}天</span>
    </p>
    <el-table
      border
      stripe
      :max-height="$store.state.tableHeight"
      v-loading="loading"
      :data="signDetail.tableData">
      <el-table-column
        prop="num"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="110"
        prop="signDate"
        label="日期">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="mark"
        label="是否签到">
        <template slot-scope="scope">{{scope.row.mark ? '已签到':'未签到'}}</template>
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="gmtCreate"
        label="签到时间">
      </el-table-column>
      <el-table-column
        min-width="110"
        prop="integral"
        label="签到奖励">
        <template slot-scope="scope">+{{scope.row.integral}}积分</template>
      </el-table-column>
    </el-table>
    <template v-if="signDetail.total > 0">
      <pagination :callback="showSignDetail" :total="signDetail.total"></pagination>
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
        scoreDetail: {
          total: 0,
          tableData: []
        },
        signDetail: {
          total: 0,
          tableData: []
        },
        sign: {
          continuition: '--',
          total: '--'
        },
        loading: false
      }
    },
    methods: {
      //积分记录
      showScoreDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/pointDetail/listPointDetail', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.scoreDetail.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.scoreDetail.tableData.push(item)
            });
            this.scoreDetail.total = res.data.data.totalElements;
          }
          this.loading = false
        })
      },
      //签到详情
      showSignDetail (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/sign/listSignInfo', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success' && res.data.data.content.length >= 0){
            this.signDetail.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.signDetail.tableData.push(item)
            });
            this.signDetail.total = res.data.data.totalElements;
          }
          this.loading = false
        })
      },
      //签到总天数、连续签到
      showSignTotal (){
        this.$http.get('/sign/getSignSummary', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.sign.continuityCount = res.data.data.signContinuityCount;
            this.sign.total = res.data.data.signTotalCount;
          }
        })
      }
    }
  }
</script>
