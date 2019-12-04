<template>
  <div class="page">
    <el-menu default-active="3" class="el-menu-demo filter-menu" mode="horizontal">
      <el-menu-item index="1" @click.native="$router.push('/parttimeUser/skill')">笔译技能申请</el-menu-item>
      <el-menu-item index="2" @click.native="$router.push('/parttimeUser/skill/green')">绿通申请列表</el-menu-item>
      <el-menu-item index="3" @click.native="$router.push('/parttimeUser/skill/other')">其他兼职申请</el-menu-item>
    </el-menu>
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.userId" placeholder="用户ID"></el-input>
          <el-input v-model="form.nickName" placeholder="用户昵称"></el-input>
          <el-input v-model="form.name" placeholder="用户姓名"></el-input>
          <el-select v-model="form.auth" placeholder="身份认证">
            <el-option value="1" label="已认证"></el-option>
            <el-option value="0" label="未认证"></el-option>
          </el-select>
          <el-select v-model="form.skillType" placeholder="技能类型">
            <el-option
              v-for="item in formSelect.skillTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-select v-model="form.status" placeholder="审核状态">
            <el-option value="未审核">未审核</el-option>
            <el-option value="不通过">不通过</el-option>
            <el-option value="通过">通过</el-option>
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
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetSearch(form, showTableList)">重 置</el-button>
        </div>
        <div class="button"> </div>
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
          prop="userId"
          label="用户ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          label="用户账号">
          <template slot-scope="scope">{{scope.row.userAcount | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="nickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="userName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.isIdCard === 1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="applyType"
          label="申请类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          label="语言对">
          <template slot-scope="scope">{{scope.row.languageAndDomain | formatLanAndDomain('lan')}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="擅长领域">
          <template slot-scope="scope">{{scope.row.languageAndDomain | formatLanAndDomain}}</template>
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="reviewStatus"
          label="审核状态">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="address"
          label="常住地址">
        </el-table-column>
        <el-table-column
          min-width="70"
          label="状态">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeUser/skill/detail/'+scope.row.userIdRecord+'?code='+scope.row.userId}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="+scope.row.status === 1 && scope.row.reviewStatus === '未审核'">
              <el-button type="text"
                         @click="setUserAuditStatus({
                          id: scope.row.id,
                          status: '通过'
                         }, showTableList)">通过</el-button>
              <el-button type="text"
                         class="del"
                         @click="setUserAuditStatus({
                          id: scope.row.id,
                          status: '不通过'
                         }, showTableList)">不通过</el-button>
            </template>
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
  import { setUserAuditStatus } from "@/common/operate";
  import { formatAccountStatus, hiddenAccount } from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        form: {
          userId: '',
          name: '',
          nickName: '',
          auth: '',
          status: '',
          skillType: '',
          rangeTime: ''
        },
        formSelect: {
          skillTypeOptions: [
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
    created (){
      this.showTableList()
    },
    filters: {
      formatLanAndDomain (str, type){
        if(str.indexOf('[') > -1){
          const arr = JSON.parse(str) || [];
          if(arr.length > 0){
            if(type === 'lan'){
              return arr[0].langaugeName;
            }else{
              return arr[0].firstAreaName+' > '+arr[0].secondAreaName;
            }
          }
        }else {
          return str;
        }
      },
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
        this.$http.get('/resourceController/listOthersPreResource', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            userId: this.form.userId,
            realName: this.form.name,
            nickName : this.form.nickName,
            isAuthentication: this.form.auth,
            reviewStatus: this.form.status,
            skill: this.form.skillType,
            applyStartTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            applyEndTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
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
      setUserAuditStatus: setUserAuditStatus
    }
  }
</script>
