<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="96px">
              <el-form-item label="用户ID">
                <el-input v-model="form.userId" clearable placeholder="请输入用户ID"></el-input>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="form.nickName" clearable placeholder="请输入昵称"></el-input>
              </el-form-item>
              <el-form-item label="用户姓名">
                <el-input v-model="form.userName" clearable placeholder="请输入用户姓名"></el-input>
              </el-form-item>
              <el-form-item label="技能类型">
                <el-select v-model="form.skillType"
                           placeholder="请选择技能申请类型">
                  <el-option
                    v-for="item in formSelect.skillTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form, showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="$router.push('/parttimeUser/preResource/create')">新增用户</el-button>
          <el-button icon="el-icon-upload2" @click="$store.commit('showModal')">批量添加</el-button>
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
          min-width="120"
          prop="skillType"
          label="申请技能类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="registerDateTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="permanentAddress"
          label="常住地址">
        </el-table-column>
        <el-table-column
          width="80"
          label="状态">
          <template slot-scope="scope">{{+scope.row.isEnable | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/parttimeUser/preResource/detail/'+scope.row.userId)">查看</el-button>
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
          skillTypeOptions: ['DTP申请','会展申请','外派申请','培训申请','笔译申请']
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
        config.pageSize = config.pageSize || 10;
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
          }
          this.loading = false
        })
      },
      setAccountStatus: setAccountStatus
    }
  }
</script>
