<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="90px">
              <el-form-item label="用户ID">
                <el-input v-model="form.userId" clearable placeholder="请输入用户ID"></el-input>
              </el-form-item>
              <el-form-item label="用户姓名">
                <el-input v-model="form.userName" clearable placeholder="请输入用户姓名"></el-input>
              </el-form-item>
              <el-form-item label="母语">
                <el-select v-model="form.motherTogue" placeholder="请选择母语">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.chineseName">
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
              <el-form-item label="任务领域" class="width620">
                <el-select
                  v-model="form.firstField"
                  @change="getSecondFieldFn"
                  placeholder="请选择一级领域">
                  <el-option
                    v-for="item in $store.state.fieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.specialtyId+','+item.fullSpecialtyName">
                  </el-option>
                </el-select>
                <label class="sep">-</label>
                <el-select
                  v-model="form.secondField"
                  placeholder="请选择二级领域">
                  <el-option
                    v-for="item in formSelect.secondFieldOptions"
                    :key="item.id"
                    :label="item.fullSpecialtyName"
                    :value="item.fullSpecialtyName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="常住地址" class="width620">
                <select v-model="form.province"
                        class="province" name="deliverprovince" id="deliverprovince"></select>
                <label class="sep">-</label>
                <select v-model="form.city"
                        class="city" name="delivercity" id="delivercity"></select>
                <select v-model="form.area"
                        class="area" name="deliverarea" id="deliverarea"></select>
              </el-form-item>
              <parttime-type ref="parttimeTypeData"></parttime-type>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="extraResetSearch">重 置</el-button>
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
          min-width="100"
          label="用户ID">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="用户账号">
          <template slot-scope="scope">{{scope.row.account | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="userName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="userType"
          label="用户类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="skills"
          label="兼职类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="motherLanguage"
          label="母语">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          label="语言对/语种">
          <template slot-scope="scope" v-if="scope.row.sourceLanguageName">
            {{scope.row.sourceLanguageName | formatStr}} -> {{scope.row.targetLanguageName | formatStr}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="subAreaName"
          label="擅长领域">
          <template slot-scope="scope">{{scope.row.subAreaName | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          width="70"
          prop="levelName"
          label="等级">
        </el-table-column>
        <el-table-column
          width="80"
          label="账号认证">
          <template slot-scope="scope">{{+scope.row.certificatePassed===1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="orderReived"
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
          <template slot-scope="scope">{{+scope.row.receipted===1?'开启':'关闭'}}</template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="translatorIdleStatus"
          label="用户状态">
        </el-table-column>
        <el-table-column
          width="95"
          prop="orderAverageScore"
          label="任务平均分">
        </el-table-column>
        <el-table-column
          width="70"
          prop="totalScore"
          label="译侠值">
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
          <template slot-scope="scope">{{+scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/parttimeUser/resource/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="+scope.row.isEnabled !== 1"
                       @click="setAccountStatus({
                        id: scope.row.id,
                        status: 1
                       }, showTableList)">启用</el-button>
            <el-button type="text"
                       class="del"
                       v-if="+scope.row.isEnabled !== 0"
                       @click="setAccountStatus({
                        id: scope.row.id,
                        status: 0
                       }, showTableList)">停用</el-button>
            <el-button type="text"
                       class="del2"
                       v-if="+scope.row.isEnabled === 1"
                       @click="setAccountStatus({
                        id: scope.row.id,
                        status: -1
                       }, showTableList)">冻结</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import parttimType from './component/parttimeType';
  import { formatAccountStatus, formatDomainsStr, hiddenAccount } from '@/common/filter';
  import { setAuditStatus, setAccountStatus } from "@/common/operate";
  import { mapState } from 'vuex';
  import '@/common/area'
  export default {
    components: {
      pagination,
      'parttime-type': parttimType
    },
    data (){
      return {
        form: {
          userId: '',
          userName: '',
          motherTogue: '',
          firstField: '',
          secondField: '',
          accountState: '',
          province: '',
          city: '',
          area: ''
        },
        formSelect: {
          secondFieldOptions: [],
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
    },
    filters: {
      formatStr (str){
        let idx = str.indexOf(',');
        if(idx > -1){
          return str.slice(0, idx);
        }else {
          return str;
        }
      },
      formatStatus: formatAccountStatus,
      formatDomain: formatDomainsStr,
      hiddenAccount: hiddenAccount
    },
    mounted (){
      this.showTableList();
      this.$nextTick(() => {
        new window._PCAS("deliverprovince", "delivercity", "deliverarea")
      })
    },
    methods: {
      //重置
      extraResetSearch (){
        this.$refs.parttimeTypeData.form.type = '';
        this.$refs.parttimeTypeData.emptyType;
        this.formSelect.secondFieldOptions = [];
        this.resetSearch(this.form, this.showTableList);
      },
      //获取二级领域
      getSecondFieldFn (val){
        const id = val.split(',')[0];
        this.form.secondField = '';
        this.getSecondField(id).then(res => {
          this.formSelect.secondFieldOptions = res
        })
      },
      //加载表格数据
      showTableList (config){
        const childForm = this.$refs.parttimeTypeData.form;
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.post('/resourceController/listResource', {
          "accountStatus": this.form.accountState,
          "area": this.form.area,
          "city": this.form.city,
          "motherLanguage": this.form.motherTogue,
          "pageNo": config.pageNo-1,
          "pageSize": config.pageSize,
          "partTimeType": childForm.type,
          "province": this.form.province,
          "taskDomain": this.form.firstField.split(',')[1],
          "taskSubDomain": this.form.secondField,
          "userId": this.form.userId,
          "userName": this.form.userName,
          "waiPaiAndPeiXun": {
            "domain": childForm.waiAndpei.firstField?childForm.waiAndpei.firstField.split(',')[1]:'',
            "language": childForm.waiAndpei.lanPair.toString(),
            "subDomain": childForm.waiAndpei.secondField.toString()
          },
          "huiZhan": {
            "domain": childForm.huizhan.firstField?childForm.huizhan.firstField.split(',')[1]:'',
            "language": childForm.huizhan.lanPair.toString(),
            "mouseType": childForm.huizhan.kyType.toString(),
            "subDomain": childForm.huizhan.secondField.toString()
          },
          "dtp": {
            "experience": childForm.dtp.dtpExp.toString(),
            "goodAtSoft": childForm.dtp.software.toString()
          },
          "biYi": {
            "level": childForm.biyi.level,
            "orignLan": childForm.biyi.origin,
            "targetLan": childForm.biyi.target,
            "testDomain": childForm.biyi.firstField?childForm.biyi.firstField.split(',')[1]:'',
            "testSubDomain": childForm.biyi.secondField.toString()
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalCount
          }
          this.loading = false
        })
      },
      setAuditStatus: setAuditStatus,
      setAccountStatus: setAccountStatus
    }
  }
</script>
<style lang="scss">
  .width620{
    .el-form-item__content{
      &>select{
        width: 137px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #BFBFBF;
        border-radius: 2px;
        color: #606266;
        &:nth-child(1){
          width: 215px;
        }
        &+.sep{
          width: 27px!important;
        }
      }
    }
  }
</style>
