<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple pd-r-50 dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="译员姓名">
                <el-input v-model="form.name" placeholder="请输入译员姓名"></el-input>
              </el-form-item>
              <el-form-item label="登录账号">
                <el-input v-model="form.account" placeholder="请输入译员登录账号"></el-input>
              </el-form-item>
              <el-form-item label="币种">
                <el-select v-model="form.moneyType" placeholder="请选择币种">
                  <el-option
                    v-for="item in formSelect.moneyType"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结算类型">
                <el-select v-model="form.settleType" placeholder="请选择结算类型">
                  <el-option
                    v-for="item in formSelect.settleType"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方式">
                <el-select v-model="form.payType" placeholder="请选择付款方式">
                  <el-option
                    v-for="item in formSelect.payType"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付状态">
                <el-select v-model="form.payStatus" placeholder="请选择支付状态">
                  <el-option
                    v-for="item in formSelect.payStatus"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="showTableList">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="10">
          <el-button icon="el-icon-download"
                     @click="downLoad(exportUrl)">批量导出</el-button>
          <el-button v-if="form.payStatus === '未付款'"
                     @click="mulHandleLock()">批量锁定</el-button>
          <el-button v-if="form.payStatus === '未付款' && (form.settleType === '社保51' || form.settleType === '云账户')"
                     @click="mulSettle()">批量提交结算</el-button>
          <el-button v-if="form.payStatus === '已锁定'"
                     @click="mulProvide()">批量发放成功</el-button>
        </el-col>
        <el-col :span="14"
                v-if="form.settleType === '社保51'"
                v-html="servicePayInfo_51"
                class="rm-right"
                style="line-height: 32px;font-size: 13px;"></el-col>
        <el-col :span="14"
                v-else-if="form.settleType === '云账户'"
                v-html="servicePayInfo_yun"
                class="rm-right"
                style="line-height: 32px;font-size: 13px;"></el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        ref="multipleTable"
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange">
        <el-table-column
          fixed
          type="selection"
          width="40">
        </el-table-column>
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
          width="70"
          prop="realName"
          label="姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="account"
          label="用户账号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="company"
          label="所属公司">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="applyDate"
          label="申请时间">
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
          width="190">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/finance/interpreter/detail/'+scope.row.userId)">查看</el-button>
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
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <addremark :callback="showTableList" :formid="form.id"></addremark>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import addremark from './modal_add';
  export default {
    components: {
      pagination,
      addremark
    },
    data (){
      return {
        form: {
          id: '',
          name: '',
          account: '',
          moneyType: '',
          settleType: '',
          payType: '',
          payStatus: '',
          rangeTime: ''
        },
        formSelect: {
          moneyType: [
            {label: '人民币', value: '人民币'},
            {label: '美元', value: '美元'},
            {label: '欧元', value: '欧元'},
            {label: '英镑', value: '英镑'}
          ],
          settleType: [
            {label: '51社保', value: '社保51'},
            {label: '云账户', value: '云账户'},
            {label: '其他', value: '其他'}
          ],
          payType: [
            {label: '银行卡', value: '银行卡'},
            {label: '支付宝', value: '支付宝'},
            {label: 'Paypal', value: 'Paypal'}
          ],
          payStatus: [
            {label: '未付款', value: '未付款'},
            {label: '付款中', value: '付款中'},
            {label: '付款失败', value: '付款失败'},
            {label: '付款成功', value: '付款成功'},
            {label: '已锁定', value: '已锁定'}
          ],
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        multipleSelection: [],
        servicePayInfo_51: '',
        servicePayInfo_yun: '',
        exportUrl: '/finance/batchExport'
      }
    },
    mounted (){
      this.showTableList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.getServicePay(val);
      },
      //获取交易总额/服务费/合计等
      getServicePay (array){
        const idArr = [];
        array.forEach(item => {
          idArr.push(item.id);
        });
        this.$http({
          method: 'post',
          url: '/finance/getServicePay',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(idArr)
        }).then(res => {
          if(res.data.message === 'success'){
            const _data = res.data.data;
            if(_data.servicePay51Vo){
              this.servicePayInfo_51 = `本次给51社保的交易总额为
                                <span style="color: #EC6941">${_data.servicePay51Vo.exchangeCost}</span> 元，实收服务费
                                <span style="color: #EC6941">${_data.servicePay51Vo.serviceCost}</span> 元，共计
                                <span style="color: #EC6941">${_data.servicePay51Vo.totalCost}</span> 元`;
            }else if(_data.servicePayYumVo){
              this.servicePayInfo_yun = `本次给云账户的交易总额为
                                <span style="color: #EC6941">${_data.servicePayYumVo.exchangeCost}</span> 元，实收服务费
                                <span style="color: #EC6941">${_data.servicePayYumVo.serviceCost}</span> 元，共计
                                <span style="color: #EC6941">${_data.servicePayYumVo.totalCost}</span> 元`;
            }
          }
        })
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/finance/listApplyCashout', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            realName: this.form.name,
            accout: this.form.account,
            currencyName: this.form.moneyType,
            payState: this.form.payStatus,
            payType: this.form.payType,
            settleType: this.form.settleType,
            startDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
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
        this.form.id = id;
      }
    }
  }

</script>
