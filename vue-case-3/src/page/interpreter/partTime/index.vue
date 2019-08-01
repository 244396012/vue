<template>
  <div class="page">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click.native="$router.push('/interpreter/partTime')">译员列表</el-menu-item>
      <el-menu-item index="2" @click.native="$router.push('/interpreter/prePartTime')">准译员列表</el-menu-item>
    </el-menu>
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple pd-r-50 dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="96px">
              <el-form-item label="登录账号">
                <el-input v-model="form.account" placeholder="请输入登录账号"></el-input>
              </el-form-item>
              <el-form-item label="译员姓名">
                <el-input v-model="form.name" placeholder="请输入译员姓名"></el-input>
              </el-form-item>
              <el-form-item label="译员等级">
                <el-select
                  v-model="form.level" placeholder="请选择译员等级">
                  <el-option
                    v-for="item in formSelect.levelOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="语言">
                <el-select
                  v-model="form.language" placeholder="请选择语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号认证状态">
                <el-select
                  v-model="form.accountAuthentication"
                  placeholder="请选择账号认证状态">
                  <el-option
                    v-for="item in formSelect.authenticationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号状态">
                <el-select
                  v-model="form.accountState"
                  placeholder="请选择账号状态">
                  <el-option
                    v-for="item in formSelect.accountStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="注册时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="译员类型">
                <el-select
                  v-model="form.type"
                  placeholder="请选择译员类型">
                  <el-option
                    v-for="item in formSelect.typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="身份认证状态">
                <el-select
                  v-model="form.identityAuthentication"
                  placeholder="请选择身份认证状态">
                  <el-option
                    v-for="item in formSelect.authenticationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="译员状态">
                <el-select
                  v-model="form.state"
                  placeholder="请选择译员状态">
                  <el-option
                    v-for="item in formSelect.stateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接单开关">
                <el-select
                  v-model="form.isTake"
                  placeholder="请选择接单开关">
                  <el-option
                    v-for="item in formSelect.isTakeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="showTableList">查 询</el-button>
            <el-button @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus" @click="$router.push('/interpreter/partTime/create')">绿色通道</el-button>
          <el-button icon="el-icon-plus" @click="$store.commit('showModal')">绿色通道批量添加</el-button>
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
          label="译员ID">
        </el-table-column>
        <el-table-column
          width="120"
          prop="account"
          label="登录帐号">
        </el-table-column>
        <el-table-column
          width="90"
          prop="realName"
          label="译员姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语种">
          <template slot-scope="scope">
            {{scope.row.userExtendList | formatLan}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="60"
          label="等级">
          <template slot-scope="scope">
            {{scope.row.userExtendList | formatLevel}}
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="userExtension.certificatePassed"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.userExtension.certificatePassed ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="userExtension.settleCertificatePassed"
          label="账号认证">
          <template slot-scope="scope">{{+scope.row.userExtension.settleCertificatePassed ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="userExtension.translatorDate"
          label="成为译员时间">
        </el-table-column>
        <el-table-column
          width="70"
          prop="userExtension.orderReceived"
          label="接单数">
        </el-table-column>
        <el-table-column
          width="80"
          label="接单开关">
          <template slot-scope="scope">
            {{scope.row.userExtension.receipt ? '开启':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="userExtension.translatorIdleStatus"
          label="译员状态">
          <template slot-scope="scope">
            {{scope.row.userExtension.translatorIdleStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="isEnabled"
          label="帐号状态">
          <template slot-scope="scope">{{scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/interpreter/partTime/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text" @click="setUserStatus(scope.row.id, 1)" v-if="scope.row.isEnabled !== 1">启用</el-button>
            <el-button type="text"
                       class="del"
                       v-if="scope.row.isEnabled !== 0"
                       @click="setUserStatus(scope.row.id, 0)">停用</el-button>
            <el-button type="text"
                       class="del2"
                       v-if="scope.row.isEnabled !== -1"
                       @click="setUserStatus(scope.row.id, -1)">冻结</el-button>
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
  import pagination from '@/components/pagination'
  import importModal from './modal_import'
  export default {
    components: {
      pagination,
      'import-modal': importModal
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        form: {
          account: '',
          name: '',
          level: '',
          rangeTime: '',
          identityAuthentication: '',
          accountAuthentication: '',
          language: '',
          type: '',
          accountState: '',
          state: '',
          isTake: ''
        },
        formSelect: {
          levelOptions:['P1','P2','P3','P4','P5','P6','P7','P8','P9'],
          authenticationOptions: [{label:'未认证',value:'0'},{label:'已认证',value:'1'}],
          typeOptions: [{label:'平台译员',value:'平台译员'},{label:'绿色通道译员',value:'绿色通道译员'}],
          accountStateOptions: [{label:'禁用',value:'0'},{label:'启用',value:'1'},{label:'冻结',value:'-1'}],
          isTakeOptions: [{label:'关闭',value:'0'},{label:'开启',value:'1'}],
          stateOptions: [
            {label:'订单中',value:'订单中'},
            {label:'空闲一周',value:'空闲一周'},
            {label:'空闲15天',value:'空闲15天'},
            {label:'空闲30天',value:'空闲30天'},
            {label:'空闲90天',value:'空闲90天'}
          ]
        },
        tableData: []
      }
    },
    filters: {
      formatLevel (data){
        let result = '', uniqueArr = [];
        if(data){
          data.forEach(item => {
            uniqueArr.push(item.levelName);
          });
          result = uniqueArr.join('/');
        }
        return result;
      },
      formatLan (data){
        let result = '', uniqueArr = [];
        if(data){
          data.forEach(item => {
            if(item.targetLanguageName.includes('-')){
              uniqueArr.push(item.targetLanguageName.split('-')[0]);
            }else{
              uniqueArr.push(item.targetLanguageName);
            }
          });
          result = uniqueArr.join('/');
        }
        return result;
      },
      formatStatus (status){
        switch (status){
          case -1: return '冻结';
          case 0: return '停用';
          case 1: return '启用';
        }
      }
    },
    created (){
      this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/userExtension/getPartTimeStaffInfo', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            account: this.form.account,
            realName: this.form.name,
            level : this.form.level,
            identityPassed: this.form.identityAuthentication,
            accountPassed: this.form.accountAuthentication,
            language: this.form.language,
            translatorSource: this.form.type,
            translatorIdleStatus: this.form.accountState,
            status: this.form.state,
            receipt: this.form.isTake,
            strStartDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            strEndDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          // console.log(res);
          if(res.data.code === '200' && res.data.data.list.length >= 0){
            this.tableData = [];
            res.data.data.list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalRow
          }
          this.loading = false
        })
      },
      //禁用、启用、冻结
      setUserStatus (id, status){
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/userExtension/saveUserStatus', this.$qs.stringify({
            userId: id,
            userStatus: status
          })).then(res => {
            if(res.data.message === 'success'){
              this.showTableList();
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch();
      }
    }
  }

</script>
