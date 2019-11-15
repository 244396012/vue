<template>
  <div class="page">
    <el-menu default-active="2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click.native="$router.push('/parttimeUser/skill')">笔译技能申请</el-menu-item>
      <el-menu-item index="2" @click.native="$router.push('/parttimeUser/skill/green')">绿通申请列表</el-menu-item>
      <el-menu-item index="3" @click.native="$router.push('/parttimeUser/skill/other')">其他兼职申请</el-menu-item>
    </el-menu>
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="90px">
              <el-form-item label="账号">
                <el-input v-model="form.account" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="form.nickName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="源语言">
                <el-select v-model="form.origin" placeholder="源语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标语言">
                <el-select v-model="form.target" placeholder="目标语言">
                  <el-option
                    v-for="item in $store.state.languageList"
                    :key="item.id"
                    :label="item.chineseName"
                    :value="item.englishName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option value="未审核">未审核</el-option>
                  <el-option value="不通过">不通过</el-option>
                  <el-option value="已通过">已通过</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请时间">
                <el-date-picker
                  v-model="form.rangeTime"
                  :clearable="false"
                  :unlink-panels="true"
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
            <el-button type="success" icon="el-icon-search" @click="doSearch(showTableList)">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch(form, showTableList)">重 置</el-button>
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
          fixed
          prop="num"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
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
          min-width="100"
          prop="nickname"
          label="译员昵称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="username"
          label="译员姓名">
        </el-table-column>
        <el-table-column
          min-width="95"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.certificatepassed === 1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语言对">
          <template slot-scope="scope">{{scope.row.originLanguageName+' -> '+scope.row.targetLanguageName}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          label="一级领域">
          <template slot-scope="scope">{{scope.row.domain | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          label="二级领域">
          <template slot-scope="scope">{{scope.row.subDomain | formatDomain}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="上传文档">
          <template slot-scope="scope">
            <div v-for="item of scope.row.files" :key="item.id">
              <a class="download" :href="item.visitUrl" target="_blank">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="80"
          label="审核状态">
          <template slot-scope="scope">{{scope.row.applystate === '待联系'?'未审核':scope.row.applystate}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtcreate"
          label="申请时间">
        </el-table-column>
        <el-table-column
          min-width="80"
          prop="setLevel"
          label="对应等级">
        </el-table-column>
        <el-table-column
          min-width="70"
          prop="auditUser"
          label="操作人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="auditTime"
          label="操作时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeUser/skill/detail/'+scope.row.userId+'?code='+scope.row.userCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/exam/admin/auditApplyGreenChannel'] !== undefined">
              <template v-if="scope.row.applystate === '待联系'">
                <el-button type="text"
                           @click="setPassStatus(scope.row)">通过</el-button>
                <el-button type="text"
                           class="del"
                           @click="setNoPassStatus(scope.row)">不通过</el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <pass-modal :callback="showTableList"></pass-modal>
  </div>
</template>
<script>
  import passmodal from './greenModal';
  import pagination from '@/components/pagination';
  import { setUserAuditStatus } from "@/common/operate";
  import { formatDomainsStr, hiddenAccount } from '@/common/filter';
  import { mapMutations } from 'vuex';
  export default {
    components: {
      pagination,
      'pass-modal':passmodal
    },
    data (){
      return {
        form: {
          account: '',
          nickName: '',
          name: '',
          origin: '',
          target: '',
          status: '',
          rangeTime: ''
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    created (){
      this.showTableList();
      this.updateData({});
    },
    filters: {
      formatDomain: formatDomainsStr,
      hiddenAccount: hiddenAccount
    },
    methods: {
      ...mapMutations(['updateData']),
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/exam/admin/listApplyGreenChannel', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            account: this.form.account,
            applyState: this.form.status,
            nickName : this.form.nickName,
            originLanguageCode: this.form.origin,
            targetLanguageCode: this.form.target,
            realName: this.form.name,
            applyStartTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            applyEndTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.results;
            list.forEach((item, index) => {
              const _item = item.data;
              _item.files = item.files || [];
              _item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(_item)
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
      //设置通过
      setPassStatus (param){
        this.updateData(param);
        this.$store.commit('showModal');
      },
      //设置不通过
      setNoPassStatus (param){
        this.$prompt('请输入不通过理由', '不通过确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S{5,30}$/,
          inputErrorMessage: '请输入5-30个字符'
        }).then(({ value }) => {
          this.$http.post('/exam/admin/auditApplyGreenChannel',  this.$qs.stringify({
            greenChannelId: param.geenchannelId,
            comment: value,
            isPassed: false
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.showTableList()
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
