<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.realName" placeholder="到账姓名"></el-input>
          <el-input v-model="form.userCode" placeholder="兼职编号"></el-input>
          <el-input v-model="form.userName" placeholder="兼职姓名"></el-input>
          <el-select v-model="form.moneyType" placeholder="币种">
            <el-option
              v-for="item in formSelect.moneyType"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-select v-model="form.settleType" placeholder="结算类型">
            <el-option
              v-for="item in formSelect.settleType"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-select v-model="form.payType" placeholder="付款方式">
            <el-option
              v-for="item in formSelect.payType"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-select v-model="form.payStatus" placeholder="支付状态">
            <el-option
              v-for="item in formSelect.payStatus"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-date-picker v-model="form.rangeTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="申请时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="extraSearch">查 询</el-button>
          <el-button class="reset" @click="extraResetSearch">重 置</el-button>
        </div>
        <div class="button"
             v-if="$store.state.secondPermission['/financeNew/batchSubmit'] !== undefined">
          <el-button :disabled="exportBtn.disabled"
                     @click="multiExport">批量导出</el-button>
          <el-button v-if="showLock" @click="mulHandleLock()">批量锁定</el-button>
          <el-button v-if="showSettle" @click="mulSettle()">批量结算</el-button>
          <el-button v-if="showProvide" @click="mulProvide()">批量发放</el-button>
        </div>
      </div>
    </div>
    <div class="default-style default-form" v-if="servicePayInfo_51 || servicePayInfo_yun">
      <el-row>
        <el-col :span="24"
                v-if="servicePayInfo_51"
                v-html="servicePayInfo_51"
                style="line-height: 32px;font-size: 13px;"></el-col>
        <el-col :span="24"
                v-if="servicePayInfo_yun"
                v-html="servicePayInfo_yun"
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
          fixed
          prop="num"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="payCode"
          label="结算编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="70"
          prop="applyerRealName"
          label="到账姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="applyerUserCode"
          label="兼职编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="70"
          prop="userExtension.realName"
          label="兼职姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="applyDateTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          min-width="65"
          prop="currencyName"
          label="币种">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="70"
          prop="applyMoney"
          label="申请金额">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="70"
          prop="settleType"
          label="结算类型">
        </el-table-column>
        <el-table-column
          min-width="70"
          prop="payType"
          label="付款方式">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="depositBank"
          label="银行名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="bankName"
          label="开户行">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="140"
          prop="settleAccount"
          label="银行账号">
        </el-table-column>
        <el-table-column
          min-width="70"
          label="支付状态">
          <template slot-scope="scope">{{scope.row.payState | formatPayStatus}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="payDateTime"
          label="支付时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="65"
          prop="payPersonRealName"
          label="操作人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="140"
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="210">
          <template slot-scope="scope">
            <router-link :to="{path:'/finance/settlement/detail/'+scope.row.applyerUserCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/financeNew/batchSubmit'] !== undefined">
              <el-button type="text"
                         v-if="scope.row.payState === 0 && (scope.row.settleType === '社保51' || scope.row.settleType === '云账户')"
                         @click="sinSettle(scope.row.id)">提交结算</el-button>
              <el-button type="text"
                         v-if="scope.row.payState === 0"
                         @click="mulHandleLock(scope.row.id)">手动锁定</el-button>
              <el-button type="text"
                         v-if="scope.row.payState === 1 || scope.row.payState === 4"
                         @click="mulSend(scope.row.id)">发放成功</el-button>
              <el-button type="text"
                         v-if="scope.row.payState === 0 || scope.row.payState === 3 || scope.row.payState === 1"
                         @click="addRemark(scope.row.id)">添加备注</el-button>
            </template>
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
  import domain from '@/api/index';
  import pagination from '@/components/pagination';
  import addremark from './modal_add';
  import { formatPayStatus } from '@/common/filter';
  export default {
    components: {
      pagination,
      addremark
    },
    data (){
      return {
        showLock: false,
        showSettle: false,
        showProvide: false,
        form: {
          id: '',
          realName: '',
          userName: '',
          userCode: '',
          moneyType: '',
          settleType: '',
          payType: '',
          payStatus: '',
          rangeTime: ''
        },
        formSelect: {
          moneyType: [
            {label: '人民币', value: 'CNY'},
            {label: '美元', value: 'USD'},
            {label: '欧元', value: 'EUR'},
            {label: '英镑', value: 'GBP'}
          ],
          settleType: [
            {label: '51社保', value: '社保51'},
            {label: '云账户', value: '云账户'},
            {label: 'PayPal', value: 'PayPal'},
            {label: '校企合作', value: '校企合作'},
            {label: '非全日制', value: '非全日制'},
            {label: '劳务报酬', value: '劳务报酬'},
            {label: '微信', value: '微信'},
            {label: '国外银行', value: '国外银行'}
          ],
          payType: [
            {label: '银行卡', value: '银行卡'},
            {label: '支付宝', value: '支付宝'},
            {label: 'PayPal', value: 'PayPal'},
            {label: '微信', value: '微信'}
          ],
          payStatus: [
            {label: '未付款', value: '0'},
            {label: '付款中', value: '3'},
            {label: '付款失败', value: '4'},
            {label: '付款成功', value: '2'},
            {label: '已锁定', value: '1'}
          ],
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        multipleSelection: [],
        servicePayInfo_51: '',
        servicePayInfo_yun: '',
        exportBtn: {
          disabled: false
        }
      }
    },
    filters: {
      formatPayStatus: formatPayStatus
    },
    mounted (){
      this.showTableList()
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      extraSearch (){
        this.showLock = false;
        this.showSettle = false;
        this.showProvide = false;
        this.doSearch(this.showTableList)
      },
      extraResetSearch (){
        this.showLock = false;
        this.showSettle = false;
        this.showProvide = false;
        this.resetSearch(this.form, this.showTableList)
      },
      //批量导出
      multiExport (){

        this.exportBtn.disabled = true;
        const _this = this,
          xhr = new XMLHttpRequest(),
          token = sessionStorage.getItem('sy_rm_admin_access_token');
        xhr.open('GET', domain.baseRMURL+'/financeNew/batchExport', true);
        xhr.setRequestHeader('Authorization', 'Bearer '+ token);
        xhr.responseType = 'blob';
        xhr.send(null);

        xhr.onload = function () {
          // 请求完成
          if (this.status === 200) {
            // 返回200
            const blob = this.response;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              let a = document.createElement('a');
              a.download = '译员结算列表.xlsx';
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              a.remove();
            }
          }
          setTimeout(() => {
            _this.exportBtn.disabled = false
          }, 500)
        }
      },
      //获取交易总额/服务费/合计等
      getServicePay (){
        this.$http({
          method: 'get',
          url: '/financeNew/getServicePay'
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
        config.pageSize = config.pageSize || 20;
        this.servicePayInfo_51 = '';
        this.servicePayInfo_yun = '';
        if(this.form.payStatus === '0'){
          this.showLock = true;
          if(this.form.settleType === '社保51'){
            this.showSettle = true;
          }
        }else if(this.form.payStatus === '1'){
          this.showProvide = true;
        }
        this.loading = true;
        this.$http.get('/financeNew/settleSummary', {
          params: {
            page: config.pageNo-1,
            size: config.pageSize,
            realName: this.form.realName,
            userName: this.form.userName,
            userCode: this.form.userCode,
            currencyName: this.form.moneyType,
            payStatus: this.form.payStatus,
            payType: this.form.payType,
            settleType: this.form.settleType,
            applyStartDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            applyEndDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
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
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false;
        });
        if(this.form.settleType === '社保51' || this.form.settleType === '云账户'){
          this.getServicePay()
        }
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
      //单个提交结算
      sinSettle (id){
        this.$confirm('是否确认此操作，操作后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'post',
            url: '/financeNew/singleSubmit',
            data: this.$qs.stringify({ id: id })
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
        }).catch(() => {})
      },
      //批量提交结算
      mulSettle (){
        this.multipleFn('/financeNew/batchSubmit');
      },
      //（批量）发放成功
      mulProvide (id){
        this.multipleFn('/financeNew/batchSetSettleSuccess', id);
      },
      //（批量）手动锁定
      mulHandleLock (id){
        this.multipleFn('/financeNew/batchLock', id);
      },
      //（批量）发放
      mulSend (id){
        this.multipleFn('/financeNew/batchSetSettleSuccess', id);
      },
      //"添加备注"模态框
      addRemark (id){
        this.$store.commit('showModal', true);
        this.form.id = id;
      }
    }
  }

</script>
