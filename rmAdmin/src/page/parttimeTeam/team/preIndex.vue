<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.name" placeholder="团队名称"></el-input>
          <el-select v-model="form.status" placeholder="审核状态">
            <el-option
              v-for="item in formSelect.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="form.rangeTime"
                          :clearable="false"
                          :unlink-panels="true"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="添加时间"
                          end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form, showTableList)">重 置</el-button>
        </div>
        <div class="button"
             v-if="$store.state.secondPermission['/team/addTeamBackground'] !== undefined">
          <el-button type="success" @click="$router.push('/parttimeTeam/preTeam/create')">添加兼职团队</el-button>
          <el-button @click="$store.commit('showModal')">批量添加团队</el-button>
        </div>
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
          min-width="100"
          prop="userCode"
          label="团队ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="teamName"
          label="团队名称">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="fullTimeNumber"
          label="团队人数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="skillType"
          label="兼职类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="invoiceType"
          label="发票类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="primaryContactName"
          label="主要联系人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="联系方式">
          <template slot-scope="scope">{{scope.row.primaryContactMobile | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.certificatePassed > 0 ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="账号认证">
          <template slot-scope="scope">{{+scope.row.settleCertificatePassed > 0 ? '已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="申请时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="permanentAddress"
          label="常住地址">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="isEnabled"
          label="账号状态">
          <template slot-scope="scope">{{scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="auditPassed"
          label="审核状态">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeTeam/preTeam/detail/'+scope.row.userId+'?code='+scope.row.userCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/userExtension/saveUserStatus'] !== undefined">
              <el-button type="text"
                         v-if="+scope.row.isEnabled !== 1"
                         @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 1
                       }, showTableList)">启用</el-button>
              <el-button type="text"
                         class="del"
                         v-if="+scope.row.isEnabled === 1"
                         @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 0
                       }, showTableList)">停用</el-button>
              <template v-if="+scope.row.isEnabled === 1 && scope.row.auditPassed === '未审核'">
                <el-button type="text"
                           @click="setAuditStatus({
                          id: scope.row.id,
                          status: '通过'
                         }, showTableList)">通过</el-button>
                <el-button type="text"
                           class="del"
                           @click="setAuditStatus({
                          id: scope.row.id,
                          status: '不通过'
                         }, showTableList)">不通过</el-button>
              </template>
            </template>
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
  import importModal from './modal_import';
  import { setAuditStatus, setAccountStatus } from "@/common/operate";
  import { formatAccountStatus,hiddenAccount } from '@/common/filter';
  export default {
    components: {
      pagination,
      'import-modal': importModal
    },
    data (){
      return {
        form: {
          name: '',
          status: '',
          rangeTime: ''
        },
        formSelect: {
          statusOptions: [
            {label:'未审核',value:'未审核'},
            {label:'不通过',value:'不通过'}]
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    mounted (){
      this.showTableList()
    },
    filters: {
      formatStatus: formatAccountStatus,
      hiddenAccount: hiddenAccount
    },
    methods: {
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/team/listPreTeam', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            teamName: this.form.name,
            auditStatus: this.form.status,
            dateTimeStart: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            dateTimeEnd: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalCount;
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
      setAccountStatus: setAccountStatus
    }
  }
</script>
