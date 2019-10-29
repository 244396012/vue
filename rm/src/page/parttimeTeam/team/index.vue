<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="90px">
              <el-form-item label="团队名称">
                <el-input v-model="form.teamName" clearable placeholder="请输入团队名称"></el-input>
              </el-form-item>
              <el-form-item label="团队人数">
                <el-input v-model="form.rangeNoStart" type="number" style="width: 100px"></el-input> -
                <el-input v-model="form.rangeNoEnd" type="number" style="width: 99px"></el-input>
              </el-form-item>
              <el-form-item label="团队状态">
                <el-select v-model="form.teamState"
                  placeholder="请选择团队状态">
                  <el-option
                    v-for="item in userStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接单开关">
                <el-select v-model="form.toggles"
                           placeholder="请选择接单开关">
                  <el-option
                    v-for="item in togglesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号状态">
                <el-select v-model="form.accountState"
                           placeholder="请选择账号状态">
                  <el-option
                    v-for="item in accountStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="添加时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <parttime-type ref="parttimeTypeData"></parttime-type>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="reSearch">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
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
          prop="userCode"
          width="100"
          label="团队ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="teamName"
          label="团队名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="skills"
          label="兼职类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="invoiceType"
          label="发票类型">
        </el-table-column>
        <el-table-column
          width="95"
          prop="primaryContactName"
          label="主要联系人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="115"
          label="联系方式">
          <template slot-scope="scope">{{scope.row.primaryContactMobile | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="fullTimeNumber"
          label="团队人数">
        </el-table-column>
        <el-table-column
          width="100"
          label="语言对/语种">
        </el-table-column>
        <el-table-column
          width="80"
          label="擅长领域">
        </el-table-column>
        <el-table-column
          width="60"
          label="等级">
        </el-table-column>
        <el-table-column
          width="80"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.certificatePassed===1 ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          label="帐号认证">
          <template slot-scope="scope">{{+scope.row.settleCertificatePassed===1 ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="添加时间">
        </el-table-column>
        <el-table-column
          width="70"
          prop="orderTaked"
          label="接单数">
        </el-table-column>
        <el-table-column
          width="80"
          prop="numberOfComplaints"
          label="投诉次数">
        </el-table-column>
        <el-table-column
          width="80"
          label="接单开关">
          <template slot-scope="scope">{{+scope.row.receipt===1 ? '开启':'关闭'}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="translatorIdleStatus"
          label="团队状态">
        </el-table-column>
        <el-table-column
          width="70"
          prop="totalScore"
          label="译侠值">
        </el-table-column>
        <el-table-column
          width="95"
          prop="orderAverageScore"
          label="订单平均分">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="permanentAddress"
          label="常住地址">
        </el-table-column>
        <el-table-column
          width="80"
          label="账号状态">
          <template slot-scope="scope">{{scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/parttimeTeam/team/detail/'+scope.row.userId)">查看</el-button>
            <el-button type="text"
                       v-if="+scope.row.isEnabled !== 1"
                       @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 1
                       }, showTableList)">启用</el-button>
            <el-button type="text"
                       class="del"
                       v-if="+scope.row.isEnabled !== 0"
                       @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 0
                       }, showTableList)">停用</el-button>
            <el-button type="text"
                       class="del2"
                       v-if="+scope.row.isEnabled === 1"
                       @click="setAccountStatus({
                        id: scope.row.userId,
                        status: -1
                       }, showTableList)">冻结</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <import-modal :callback="showTableList"></import-modal>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import parttimType from './component/parttimeType';
  import importModal from './modal_import';
  import { mapState } from 'vuex';
  import { setAccountStatus } from "@/common/operate";
  import { formatAccountStatus, hiddenAccount } from '@/common/filter';
  export default {
    components: {
      pagination,
      'parttime-type': parttimType,
      'import-modal': importModal
    },
    data (){
      return {
        form: {
          teamName: '',
          rangeNoStart: '',
          rangeNoEnd: '',
          toggles: '',
          teamState: '',
          accountState: '',
          rangeTime: ''
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    computed: {
      ...mapState('select', {
        accountStateOptions: state => state.accountState
      }),
      ...mapState('select', {
        togglesOptions: state => state.receiptState
      }),
      ...mapState('select', {
        userStateOptions: state => state.userState
      }),
    },
    filters: {
      formatStatus: formatAccountStatus,
      hiddenAccount: hiddenAccount
    },
    mounted (){
      this.showTableList()
    },
    methods: {
      //重置
      reSearch (){
        this.$refs.parttimeTypeData.form.type = '';
        this.$refs.parttimeTypeData.emptyType;
        this.resetSearch(this.form, this.showTableList);
      },
      //加载表格数据
      showTableList (config){
        const childForm = this.$refs.parttimeTypeData.form;
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/team/listTeam', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            teamName: this.form.teamName,
            fullTimeNumberMin: this.form.rangeNoStart,
            fullTimeNumberMax : this.form.rangeNoEnd,
            receipt: this.form.toggles,
            isEnabled: this.form.accountState,
            translatorIdleStatus: this.form.teamState,
            datetimeAddStart: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            datetimeAddEnd: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : '',
            skillType: childForm.type,
            languageName: childForm.lanPair,
            sourceLanguageName: childForm.origin,
            targetLanguageName: childForm.target,
            domainId: childForm.firstField?childForm.firstField.split(',')[1]:'',
            subDomainIds: childForm.secondField.toString(),
            levelId: childForm.level.slice(1),
            dtpExperience: childForm.dtpExp.toString(),
            softWares: childForm.software.toString(),
            interpretationTypes: childForm.speakExp.toString(),
            equipmentName: childForm.deviceType,
            buildType: childForm.buildType
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
      },
      setAccountStatus: setAccountStatus
    }
  }

</script>
