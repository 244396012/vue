<template>
  <div class="page">
    <el-menu default-active="1" class="el-menu-demo filter-menu" mode="horizontal">
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
          <el-select v-model="form.select" placeholder="选择题测试" class="width110">
            <el-option
              v-for="item in formSelect.passOptions"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
          <el-select v-model="form.trans" placeholder="翻译题测试" class="width110">
            <el-option
              v-for="item in formSelect.passOptions"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
          <el-date-picker style="vertical-align: 2px"
            v-model="form.rangeTime"
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
        <div class="button"
             v-if="$store.state.secondPermission['/userExtension/invitationTest'] !== undefined">
          <el-button type="success" @click="applyApplication()">批量邀请测试</el-button>
        </div>
      </div>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        ref="multipleTable"
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
          min-width="110"
          label="用户账号">
          <template slot-scope="scope">{{scope.row.account | hiddenAccount}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="nickName"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="80"
          prop="userName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="身份认证">
          <template slot-scope="scope">{{+scope.row.certificatePassed === 1?'已认证':'未认证'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="115"
          label="语言对">
          <template slot-scope="scope" v-if="scope.row.originLanguageName">
            {{scope.row.originLanguageName | formatStr}} -> {{scope.row.targetLanguageName | formatStr}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="擅长领域">
          <template slot-scope="scope">{{scope.row.subDomain | formatArr}}</template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="选择题测试">
          <template slot-scope="scope">{{scope.row | formatTest('select')}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="翻译题测试">
          <template slot-scope="scope">{{scope.row | formatTest('trans')}}</template>
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
          prop="permanentAddress"
          label="常住地址">
        </el-table-column>
        <el-table-column
          min-width="70"
          label="状态">
          <template slot-scope="scope">{{scope.row.isEnabled | formatStatus}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <router-link :to="{path:'/parttimeUser/skill/detail/'+scope.row.id+'?code='+scope.row.userCode}"
                         class="blank"
                         target="_blank">查看</router-link>
            <template v-if="$store.state.secondPermission['/userExtension/invitationTest'] !== undefined">
              <el-button type="text"
                         v-if="scope.row.passedStatus.includes('未测试')"
                         @click="applyApplication(scope.row)">邀请测试</el-button>
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
  import { setAccountStatus } from "@/common/operate";
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
          select: '',
          trans: '',
          rangeTime: ''
        },
        formSelect: {
          passOptions: ['待测试','未通过','已通过']
        },
        loading: false,
        totalTableList: 0,
        tableData: [],
        multipleSelection: []
      }
    },
    created (){
      this.showTableList()
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
      formatArr (arrStr){
        if(arrStr.includes('[')){
          return JSON.parse(arrStr).toString()
        }else{
          return arrStr;
        }
      },
      formatTest(row, type){
        if(row.levelType){
          const arr = row.levelType.split(','),
            arr1 = row.passedStatus.split(',');
          for(let i = 0, len = arr.length; i<len; i++){
            if((type === 'select' || type === 'trans') && arr[i] === type){
              return arr1[i];
            }
          }
        }
        return '';
      },
      formatStatus: formatAccountStatus,
      hiddenAccount: hiddenAccount
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //加载表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/resourceController/listPreTranslators', {
          params: {
            page: config.pageNo-1,
            limit: config.pageSize,
            userCode: this.form.userId,
            realName: this.form.name,
            nickName : this.form.nickName,
            certificate: this.form.auth,
            selectPass: this.form.select,
            transPass: this.form.trans,
            startDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
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
      //（批量）邀请测试
      applyApplication (row){
        let tempArr = [];
        if(row){
          tempArr = [row]
        }else{
          if(this.multipleSelection.length === 0){
            this.$message({
              type: 'warning',
              message: '请先勾选操作项'
            });
            return false
          }
          tempArr = this.multipleSelection;
        }
        let idArr = tempArr.map(item => {
          return item.id
        });
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/userExtension/invitationTest', this.$qs.stringify({
            userIds: idArr.toString()
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
        }).catch(()=>{})
      },
      setAccountStatus: setAccountStatus
    }
  }
</script>
