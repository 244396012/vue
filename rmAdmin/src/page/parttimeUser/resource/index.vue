<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.userId" placeholder="用户ID"></el-input>
          <el-input v-model="form.account" placeholder="用户账号"></el-input>
          <el-input v-model="form.userName" placeholder="用户姓名" class="width90"></el-input>
          <el-select v-model="form.accountState" placeholder="账号状态" class="width90">
            <el-option
              v-for="item in accountStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.motherTogue" placeholder="母语" class="width90">
            <el-option
              v-for="item in $store.state.languageList"
              :key="item.id"
              :label="item.chineseName"
              :value="item.chineseName">
            </el-option>
          </el-select>
          <div class="el-button-2">
            <el-select v-model="form.firstField" @change="getSecondFieldFn" placeholder="任务领域">
              <el-option
                v-for="item in $store.state.fieldOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.specialtyId+','+item.fullSpecialtyName">
              </el-option>
            </el-select> -
            <el-select v-model="form.secondField" placeholder="二级领域">
              <el-option
                v-for="item in formSelect.secondFieldOptions"
                :key="item.id"
                :label="item.fullSpecialtyName"
                :value="item.fullSpecialtyName">
              </el-option>
            </el-select>
          </div>
          <div class="el-button-2 address">
            <select v-model="form.province"
                    class="province" name="deliverprovince" id="deliverprovince"></select> -
            <select v-model="form.city"
                    class="city" name="delivercity" id="delivercity"></select> -
            <select v-model="form.area"
                    class="area" name="deliverarea" id="deliverarea"></select>
          </div>
          <parttime-type ref="parttimeTypeData"></parttime-type>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="extraResetSearch">重 置</el-button>
        </div>
        <div class="button"></div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
        v-loading="loading"
        :data="tableData">
        <el-table-column
          fixed
          prop="num"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="userCode"
          label="用户ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          label="用户账号">
          <template slot-scope="scope">{{scope.row.account | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="userName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="userType"
          label="用户类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="skills"
          label="兼职类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
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
          min-width="50"
          prop="levelName"
          label="等级">
        </el-table-column>
        <el-table-column
          min-width="70"
          label="账号认证">
          <template slot-scope="scope">{{+scope.row.settleCertificatePassed===1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          min-width="60"
          prop="orderReived"
          label="接单数">
        </el-table-column>
        <el-table-column
          min-width="70"
          prop="numberOfComplaints"
          label="投诉次数">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="接单开关">
          <template slot-scope="scope">{{+scope.row.receipted===1?'开启':'关闭'}}</template>
        </el-table-column>
        <el-table-column
          min-width="70"
          prop="translatorIdleStatus"
          label="用户状态">
        </el-table-column>
        <el-table-column
          min-width="85"
          prop="orderAverageScore"
          label="任务平均分">
        </el-table-column>
        <el-table-column
          min-width="70"
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
          min-width="70"
          label="账号状态">
          <template slot-scope="scope">{{+scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeUser/resource/detail/'+scope.row.id+'?code='+scope.row.userCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/userExtension/saveUserStatus'] !== undefined">
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
            <el-button type="text"
                       v-if="$store.state.secondPermission['/adminManager/resetUserPassword'] !== undefined"
                       :disabled="!btnPermission.buttonEnable"
                       @click="resetPwd(scope.row.id)" >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <reset-pwd :callback="getResetPermission" :userId="userId" :permission="btnPermission"></reset-pwd>
  </div>
</template>
<script>
  import domain from '@/api';
  import pagination from '@/components/pagination';
  import parttimType from './component/parttimeType';
  import resetPwd from '../component/resetPwd';
  import { formatAccountStatus, formatDomainsStr, hiddenAccount } from '@/common/filter';
  import { setAuditStatus, setAccountStatus } from "@/common/operate";
  import { mapState } from 'vuex';
  import '@/common/area';
  export default {
    components: {
      pagination,
      'parttime-type': parttimType,
      'reset-pwd': resetPwd
    },
    data (){
      return {
        btnPermission: {},
        userId: '',
        form: {
          userId: '',
          account: '',
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
    created (){
      this.getResetPermission()
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
        document.querySelector('#delivercity').innerHTML = '';
        document.querySelector('#deliverarea').innerHTML = '';
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
        config.pageSize = config.pageSize || 20;
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
          "account": this.form.account,
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
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false
        })
      },
      setAuditStatus: setAuditStatus,
      setAccountStatus: setAccountStatus,
      //获取重置按钮权限
      getResetPermission (){
        this.$http.defaults.baseURL = domain.baseLgURL;
        this.$http.get('/adminManager/getResetButtonStatue')
          .then(res => {
            if(res.data.message === 'success'){
              this.btnPermission = Object.assign({}, this.btnPermission, res.data.data);
            }
          });
        this.$http.defaults.baseURL = domain.baseRMURL;
      },
      //初始重置密码
      resetPwd (userId){
        this.userId = userId;
        if(!this.btnPermission.ischecked){//弹框
          this.$store.commit('showModal')
        }else{
          this.$confirm('是否确认此操作，操作后无法撤销', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.defaults.baseURL = domain.baseLgURL;
            this.$http.put('/adminManager/resetUserPassword',this.$qs.stringify({
              userId: userId
            })).then(res => {
              if(res.data.message === 'success'){
                this.$message.success('操作成功');
                this.getResetPermission()
              }else{
                this.$message.error(res.data.message)
              }
            });
            this.$http.defaults.baseURL = domain.baseRMURL
          }).catch(() => {})
        }
      }
    }
  }
</script>
