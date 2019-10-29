<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b style="font-size: 18px;">{{account.realName}}</b>{{account.realName && '（'+$route.params.id+'）'}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>国籍：</b>{{account.nationality}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><b>登录账号：</b>{{account.account}}</div></el-col>
        </el-row>
        <el-row class="exact mg-b-0">
          <el-col :span="18">
            <table class="parttime-table"
                   v-if="accountAmount.cNY_TotalIncome || accountAmount.uSD_TotalIncome || accountAmount.eUR_TotalIncome || accountAmount.gBP_TotalIncome">
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
      </div>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="结算记录" name="first">
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
                prop="payCode"
                label="结算编号">
              </el-table-column>
              <el-table-column
                width="100"
                prop="applyMoney"
                label="申请金额">
              </el-table-column>
              <el-table-column
                width="70"
                prop="currencyName"
                label="币种">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="applyDateTime"
                label="申请时间">
              </el-table-column>
              <el-table-column
                width="80"
                prop="payType"
                label="付款方式">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="depositBank"
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
                prop="applyerAccount"
                label="账户信息">
              </el-table-column>
              <el-table-column
                width="80"
                prop="settleType"
                label="结算类型">
              </el-table-column>
              <el-table-column
                width="80"
                label="支付状态">
                <template slot-scope="scope">{{scope.row.payState | formatPayStatus}}</template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="payDateTime"
                label="支付时间">
              </el-table-column>
              <el-table-column
                width="70"
                prop=""
                label="图片">
              </el-table-column>
              <el-table-column
                width="70"
                prop="payPersonRealName"
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
                width="220">
                <template slot-scope="scope">
                  <el-button type="text"
                             v-if="scope.row.payState === 0 && (scope.row.settleType === '社保51' || scope.row.settleType === '云账户')"
                             @click="mulSettle(scope.row.id)">提交结算</el-button>
                  <el-button type="text"
                             v-if="scope.row.payState === 0"
                             @click="mulHandleLock(scope.row.id)">手动锁定</el-button>
                  <el-button type="text"
                             v-if="scope.row.payState === 0 || scope.row.payState === 3 || scope.row.payState === 1"
                             @click="addRemark(scope.row.id)">添加备注</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="totalRecords > 0">
              <apply-pagination :callback="getApplyRecords" :total="totalRecords"></apply-pagination>
            </template>
          </el-tab-pane>
          <el-tab-pane label="任务记录" name="second">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="任务编号">
                <el-input v-model="taskNo" clearable placeholder="请输入任务编号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" icon="el-icon-search" @click="doSearch(showOrderList)">查 询</el-button>
              </el-form-item>
            </el-form>
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
                prop="taskNo"
                label="任务编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="orgName"
                label="所属公司">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="taskName"
                label="任务名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
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
                prop="taskType"
                label="任务类型">
              </el-table-column>
              <el-table-column
                width="80"
                prop="taskNumber"
                label="任务数量">
              </el-table-column>
              <el-table-column
                width="90"
                prop="taskAmount"
                label="任务金额">
              </el-table-column>
              <el-table-column
                width="90"
                prop="settleAmount"
                label="结算金额">
              </el-table-column>
              <el-table-column
                width="80"
                prop="currencyName"
                label="币种">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="requireCompleteTime"
                label="要求完成时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="actualCompleteTime"
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
                prop="taskStatus"
                label="任务状态">
              </el-table-column>
              <!--<el-table-column-->
                <!--fixed="right"-->
                <!--label="操作"-->
                <!--width="100">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type="text" @click="$router.push('')">查看详情</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
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
                label="金额">
              </el-table-column>
              <el-table-column
                width="80"
                label="币种">
                <template slot-scope="scope">{{scope.row.currencyCode | formatMoneyType}}</template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="exchangeType"
                label="变动类型">
              </el-table-column>
              <el-table-column
                width="100"
                prop="payType"
                label="结算方式">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="taskNo"
                label="任务编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="100"
                prop="settleNo"
                label="结算编号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="bank"
                label="银行名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="depositBank"
                label="开户行">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="110"
                prop="account"
                label="账户信息">
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
  import { formatPayStatus, formatMoneyType } from '@/common/filter';
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
        account: {},
        accountAmount: {},
        loading: false,
        totalRecords: 0,
        tableRecordsData: [],
        remarkId: '',
        taskNo: '',
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
    filters: {
      formatPayStatus: formatPayStatus,
      formatMoneyType: formatMoneyType
    },
    watch: {
      taskNo (newVal){
        !newVal && this.showOrderList();
      }
    },
    created (){
      this.getBaseInfo();
      this.getApplyRecords();
    },
    methods: {
      handleClick(tab, event) {
        if(tab.label === '任务记录'){
          this.showOrderList()
        }else if(tab.label === '账户记录'){
          this.showAccountList()
        }
      },
      //获取信息
      getBaseInfo (){
        //获取账户金额信息
        this.$http({
          method: 'get',
          url: '/financeNew/listPersonAccountSummary?userCode='+this.$route.params.id
        }).then(res => {
          if(res.data.message === 'success'){
            this.accountAmount = res.data.data
          }
        });
        //获取个人信息
        this.$http({
          method: 'get',
          url: '/financeNew/getPersonalInfo?userCode='+this.$route.params.id
        }).then(res => {
          if(res.data.message === 'success'){
            this.account = res.data.data;
          }
        })
      },
      //获取申请结算记录
      getApplyRecords (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/financeNew/listFinanceNewPay',{
          params: {
            userCode: this.$route.params.id,
            page: config.pageNo-1,
            size: config.pageSize
          }
        }).then(res => {
          if(res.data.message === 'success'){
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
      //获取任务记录
      showOrderList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/financeTask/listTaskDetail',{
          params: {
            userCode: this.$route.params.id,
            taskNo: this.taskNo,
            pageNo: config.pageNo-1,
            pageSize: config.pageSize
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.orderDetail.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
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
        this.$http.get('/financeNew/accountDetail',{
          params: {
            userCode: this.$route.params.id,
            pageNo: config.pageNo-1,
            pageSize: config.pageSize
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.accountDetail.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.accountDetail.tableData.push(item)
            });
            this.accountDetail.total = res.data.data.totalCount
          }
          this.loading = false;
        })
      },
      //批量处理函数
      multipleFn (url, id){
        const arr = [];
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
        }else{
          arr.push(id);
        }
        this.$confirm('是否确认此操作，操作后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'post',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(arr)
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.doSearch(this.showTableList)
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
        this.multipleFn('/financeNew/batchSubmit', id);
      },
      //（批量）发放成功
      mulProvide (id){
        this.multipleFn('/financeNew/batchSetSettleSuccess', id);
      },
      //（批量）手动锁定
      mulHandleLock (id){
        this.multipleFn('/financeNew/batchLock', id);
      },
      //"添加备注"模态框
      addRemark (id){
        this.$store.commit('showModal', true);
        this.remarkId = id;
      }
    }
  }
</script>
