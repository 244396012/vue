<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b style="font-size: 18px;">{{detail.realName}}</b>{{detail.realName && '（'+detail.staffNo+'）'}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>国籍：</b>{{detail.nationality}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>所属公司：</b>{{detail.company}}</div></el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>登录账号：</b>{{detail.account}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>总金额：</b>{{detail.totalBalance}}元</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>已提现：</b>{{detail.alreadyWithDrawalBalance}}元</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>可提金额：</b>{{detail.canWithDrawalBalance}}元</div></el-col>
        </el-row>
      </div>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="申请结算记录" name="first">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="tableRecordsData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="settleNo"
                label="结算编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="company"
                label="所属公司">
              </el-table-column>
              <el-table-column
                width="70"
                prop="currencyName"
                label="币种">
              </el-table-column>
              <el-table-column
                width="110"
                prop="amount"
                label="申请金额(元)">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="applyDate"
                label="申请时间">
              </el-table-column>
              <el-table-column
                width="80"
                prop="settleType"
                label="结算类型">
              </el-table-column>
              <el-table-column
                width="80"
                prop="payType"
                label="付款方式">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="deposit"
                label="银行名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="bankName"
                label="开户行">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="settleAccount"
                label="银行账号">
              </el-table-column>
              <el-table-column
                width="110"
                prop="balance"
                label="账户余额(元)">
              </el-table-column>
              <el-table-column
                width="80"
                prop="payState"
                label="支付状态">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="payDate"
                label="支付时间">
              </el-table-column>
              <el-table-column
                width="70"
                prop="operator"
                label="操作人">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="remark"
                label="备注">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button type="text"
                             v-if="scope.row.payState === '未付款' && (scope.row.payType === '社保51' || scope.row.payType === '云账户')"
                             @click="mulSettle(scope.row.id)">提交结算</el-button>
                  <el-button type="text"
                             v-if="scope.row.payState === '未付款'"
                             @click="mulHandleLock(scope.row.id)">手动锁定</el-button>
                  <el-button type="text"
                             v-if="scope.row.payState === '未付款' || scope.row.payState === '付款中' || scope.row.payState === '已锁定'"
                             @click="addRemark(scope.row.id)">添加备注</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="totalRecords > 0">
              <apply-pagination :callback="getApplyRecords" :total="totalRecords"></apply-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="订单记录" name="second">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="orderDetail.tableData">
              <el-table-column
                prop="num"
                label="#"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="taskId"
                label="订单编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="ownCompany"
                label="所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="orderName"
                label="订单名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="projectName"
                label="项目名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="languagePair"
                label="语言对">
              </el-table-column>
              <el-table-column
                width="80"
                prop="orderType"
                label="订单类型">
              </el-table-column>
              <el-table-column
                width="80"
                prop="workAmount"
                label="订单数量">
              </el-table-column>
              <el-table-column
                width="110"
                prop="orderMoney"
                label="订单金额(元)">
              </el-table-column>
              <el-table-column
                width="120"
                prop="settleMoney"
                label="译员结算金额">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="requireTime"
                label="要求完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="actualTime"
                label="实际完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="domain"
                label="领域">
              </el-table-column>
              <el-table-column
                width="80"
                prop="orderStatus"
                label="订单状态">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button type="text" @click="$router.push('')">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="orderDetail.total > 0">
              <order-pagination :callback="showOrderList" :total="orderDetail.total"></order-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="账户记录" name="third">
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="accountDetail.tableData">
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
                width="100"
                prop="amount"
                label="金额(元)">
              </el-table-column>
              <el-table-column
                width="100"
                prop="changeType"
                label="变动类型">
              </el-table-column>
              <el-table-column
                width="100"
                prop="settleType"
                label="结算方式">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="taskNo"
                label="订单/结算编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="deposit"
                label="银行名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="bankName"
                label="开户行">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="account"
                label="账户信息">
              </el-table-column>
              <el-table-column
                width="110"
                prop="balance"
                label="账户余额(元)">
              </el-table-column>
            </el-table>
            <template v-if="accountDetail.total > 0">
              <account-pagination :callback="showAccountList" :total="accountDetail.total"></account-pagination>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <add-remark :callback="getApplyRecords" :formid="remarkId"></add-remark>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import addremark from './modal_add';
  export default {
    components: {
      'apply-pagination': pagination,
      'order-pagination': pagination,
      'account-pagination': pagination,
      'add-remark': addremark
    },
    data (){
      return {
        activeName: 'first',
        detail: '',
        loading: false,
        totalRecords: 0,
        tableRecordsData: [],
        remarkId: '',
        orderDetail: {
          total: 0,
          tableData: []
        },
        accountDetail: {
          total: 0,
          tableData: []
        }
      }
    },
    mounted (){
      this.getBaseInfo();
      this.getApplyRecords();
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
        if(tab.label === '订单记录'){
          this.showOrderList();
        }else if(tab.label === '账户记录'){
          this.showAccountList();
        }
      },
      //获取个人信息
      getBaseInfo (){
        this.$http({
          method: 'get',
          url: '/finance/getPersonalInfo?userId='+this.$route.params.id
        }).then(res => {
          res.data.message === 'success' && (this.detail = res.data.data);
        })
      },
      //获取申请结算记录
      getApplyRecords (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/finance/getPersonApplySettleRecords',{
          params: {
            userId: this.$route.params.id,
            page: config.pageNo-1,
            size: config.pageSize
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.tableRecordsData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableRecordsData.push(item)
            });
            this.totalRecords = res.data.data.totalElements
          }
          this.loading = false;
        })
      },
      //获取订单记录
      showOrderList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.post('/orderAndComment/getOrderAndComment',this.$qs.stringify({
          userId: this.$route.params.id,
          pageNo: config.pageNo-1,
          pageSize: config.pageSize
        })).then(res => {
          if(res.status === 200 && res.data.content.length >= 0){
            this.orderDetail.tableData = [];
            res.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.orderDetail.tableData.push(item)
            });
            this.orderDetail.total = res.data.totalElements
          }
          this.loading = false;
        })
      },
      //获取账户记录
      showAccountList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/finance/listFinanceDetail',{
          params: {
            userId: this.$route.params.id,
            page: config.pageNo-1,
            limit: config.pageSize
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.accountDetail.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.accountDetail.tableData.push(item)
            });
            this.accountDetail.total = res.data.data.totalElements
          }
          this.loading = false;
        })
      },
      //批量处理函数
      multipleFn (url, id){
        const arr = [];
        id && arr.push(id);
        if(!id){
          if(this.multipleSelection.length < 1){
            this.$message({
              type: 'warning',
              message: '请勾选操作项'
            });
            return null;
          }
          this.multipleSelection.forEach(item => {
            arr.push(item.id);
          });
        }
        this.$confirm('是否确认此操作，操作后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'post',
            url: url,
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(arr)
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.showTableList();
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        }).catch(() => {});
      },
      //（批量）提交结算
      mulSettle (id){
        this.multipleFn('/finance/batchSubmitSettle', id);
      },
      //（批量）发放成功
      mulProvide (id){
        this.multipleFn('/finance/batchSettleSuccess', id);
      },
      //（批量）手动锁定
      mulHandleLock (id){
        this.multipleFn('/finance/bactchLockSettle', id);
      },
      //"添加备注"模态框
      addRemark (id){
        this.$store.commit('showModal', true);
        this.remarkId = id;
      }
    }
  }
</script>
