<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.userId" placeholder="用户ID"></el-input>
          <el-input v-model="form.nickName" placeholder="用户昵称"></el-input>
          <el-input v-model="form.userName" placeholder="用户姓名"></el-input>
          <el-select v-model="form.skillType" placeholder="技能类型">
            <el-option
              v-for="item in formSelect.skillTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form, showTableList)">重 置</el-button>
        </div>
        <div class="button"
             v-if="$store.state.secondPermission['/greenChannel/savePartTimeStaffByGreenChannel'] !== undefined">
          <el-button type="success" @click="$router.push('/parttimeUser/preResource/create')">新增用户</el-button>
          <el-button @click="$store.commit('showModal')">批量添加</el-button>
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
          width="65">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="userCode"
          label="用户ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="用户账号">
          <template slot-scope="scope">{{scope.row.userAccount | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="realName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="nickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          min-width="90"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.certificatePassed===1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="skillType"
          label="技能类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="registerDateTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="permanentAddress"
          label="常住地址">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="状态">
          <template slot-scope="scope">{{+scope.row.isEnable | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeUser/preResource/detail/'+scope.row.userId+'?code='+scope.row.userCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/userExtension/saveUserStatus'] !== undefined">
              <el-button type="text"
                         v-if="+scope.row.isEnable !== 1"
                         @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 1
                       }, showTableList)">启用</el-button>
              <el-button type="text"
                         class="del"
                         v-if="+scope.row.isEnable !== 0"
                         @click="setAccountStatus({
                        id: scope.row.userId,
                        status: 0
                       }, showTableList)">停用</el-button>
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
  import { formatAccountStatus, hiddenAccount } from '@/common/filter';
  import { setAccountStatus } from "@/common/operate";
  import { mapState } from 'vuex';
  export default {
    components: {
      pagination,
      'import-modal': importModal
    },
    data (){
      return {
        form: {
          userId: '',
          userName: '',
          nickName: '',
          skillType: ''
        },
        formSelect: {
          skillTypeOptions: [
            {label: '笔译申请', value: '笔译'},
            {label: 'DTP申请', value: 'DTP'},
            {label: '会展申请', value: '会展'},
            {label: '外派申请', value: '外派'},
            {label: '培训申请', value: '培训'}]
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
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
      hiddenAccount: hiddenAccount
    },
    created (){
      this.showTableList();
    },
    methods: {
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.post('/resourceController/listNewUser', {
          "pageNo": config.pageNo-1,
          "pageSize": config.pageSize,
          "nickName": this.form.nickName,
          "realName": this.form.userName,
          "skillType": this.form.skillType,
          "userCode": this.form.userId
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.list;
            list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalRow
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false
        })
      },
      setAccountStatus: setAccountStatus
    }
  }
</script>
