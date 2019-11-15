<template>
  <div class="page">
    <div class="detail" style="padding-bottom: 5px;margin-bottom: 10px">
      <el-row class="exact">
        <el-col :span="4"><div class="grid-content bg-purple">
          <div class="average">
            <span>{{orderInfo.orderAverageScore?orderInfo.orderAverageScore:'--'}}</span>
            <p>订单平均分</p>
          </div>
        </div></el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="score">质量平均分：{{orderInfo.qualityScore?orderInfo.qualityScore:'--'}}分</div>
            <div class="score">态度平均分：{{orderInfo.attitudeScore?orderInfo.attitudeScore:'--'}}分</div>
            <div class="score">速度平均分：{{orderInfo.speedScore?orderInfo.speedScore:'--'}}分</div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple">
            <el-tag v-for="item in labelInfo"
                    :key="item">{{item}} {{labelInfo[item]}}</el-tag>
          </div>
        </el-col>
      </el-row>
    </div>
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
        prop="orderId"
        label="订单编号">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="100"
        prop="orderName"
        label="订单名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="100"
        prop="languagePair"
        label="语言对">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="partTimeType"
        label="兼职类型">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="businessType"
        label="业务类型">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="110"
        prop="domain"
        label="专业领域">
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="qualityLevel"
        label="质量等级">
      </el-table-column>
      <el-table-column
        min-width="90"
        prop="orderType"
        label="订单类别">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="orderMoney"
        label="订单金额">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="settleMoney"
        label="结算金额">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="requireTime"
        label="要求完成时间">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="actualTime"
        label="实际完成时间">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="orderStatus"
        label="订单状态">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="qualityScore"
        label="质量评分">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="attitudeScore"
        label="态度评分">
      </el-table-column>
      <el-table-column
        min-width="80"
        prop="speedScore"
        label="速度评分">
      </el-table-column>
      <el-table-column
        min-width="70"
        prop="totalScore"
        label="总评分">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        label="标签">
        <template slot-scope="scope">{{scope.row.attitudeDesc+' '+scope.row.qualityDesc+' '+scope.row.speedDesc}}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        min-width="120"
        prop="pmComment"
        label="评价备注">
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
        orderInfo: {},
        labelInfo: {},
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    methods: {
      //获取评分
      showScore (){
        this.$http.post('/orderAndComment/getTotalScoreInfo', this.$qs.stringify({
          userCode: this.$route.params.id
        })).then(res => {
          if(res){
            this.orderInfo = res.data
          }
        })
      },
      //获取标签
      showLabels (){
        this.$http.get('/orderAndComment/labelStatistics', {
          params: {
            userCode: this.$route.params.id
          }
        }).then(res => {
          if(res && typeof(res.data) === 'object'){
            this.labelInfo = res.data
          }
        })
      },
      //获取列表
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.post('/orderAndComment/getOrderAndComment', this.$qs.stringify({
          pageNo: config.pageNo-1,
          pageSize: config.pageSize,
          userId: this.$route.params.id
        })).then(res => {
          if(res.data.content.length >= 0){
            this.tableData = [];
            const list = res.data.content;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.totalElements;
          }
          this.loading = false
        })
      },

    }
  }
</script>
<style lang="scss">
  .average{
    padding-left: 20%;
    &>span{
      display: block;
      width: 80px;
      height: 80px;
      line-height: 80px;
      background: #eee;
      border-radius: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      color: #41CCA6;
    }
    &>p{
      margin-top: 5px;
      margin-bottom: 0;

      font-size: 16px;
    }
  }
  div.score{
    margin-top: 12px;
  }
</style>
