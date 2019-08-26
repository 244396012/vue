<template>
  <div class="page">
    <el-menu default-active="2" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click.native="$router.push('/parttimeUser/translate')">译员列表</el-menu-item>
      <el-menu-item index="2" @click.native="$router.push('/parttimeUser/preTranslate')">准译员列表</el-menu-item>
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
              <el-form-item label="译员昵称">
                <el-input v-model="form.nickName" placeholder="请输入译员昵称"></el-input>
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
              <el-form-item label="选择题">
                <el-select
                  v-model="form.choice"
                  placeholder="选择题测试结果">
                  <el-option
                    v-for="item in formSelect.resultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="翻译题">
                <el-select
                  v-model="form.trans"
                  placeholder="翻译题测试结果">
                  <el-option
                    v-for="item in formSelect.resultOptions"
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
            <el-button icon="el-icon-refresh" @click="resetSearch(form,showTableList)">重 置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-row>
        <el-col :span="24">
          <el-button type="success" icon="el-icon-share" @click="sendApplication()">批量邀请</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="default-style">
      <el-table
        border
        stripe
        :max-height="$store.state.tableHeight"
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
          prop="num"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="userCode"
          label="译员ID">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="account"
          label="登录帐号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="nickName"
          label="译员昵称">
        </el-table-column>
        <el-table-column
          width="100"
          prop="userName"
          label="译员姓名">
        </el-table-column>
        <el-table-column
          width="90"
          prop="userExtension"
          label="身份认证">
          <template slot-scope="scope">
            {{scope.row.userExtension.certificatePassed === 1 ? '已认证':'未认证'}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          label="语种一">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(0)}}
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          label="选择题测试">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(0) | formatChoice(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="语言对">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(0) | formatLanPair(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="翻译题测试">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(0) | formatTran(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          label="语种二">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(1)}}
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          label="选择题测试">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(1) | formatChoice(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="语言对">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(1) | formatLanPair(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="翻译题测试">
          <template slot-scope="scope">
            {{scope.row.cuLevelList | filterLanPair(1) | formatTran(scope.row.cuLevelList)}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="注册时间">
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
          width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/parttimeUser/translate/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="scope.row.isEnabled !== 1"
                       @click="setUserStatus(scope.row.id, 1)">启用</el-button>
            <el-button type="text"
                       class="del"
                       v-if="scope.row.isEnabled !== 0"
                       @click="setUserStatus(scope.row.id, 0)">停用</el-button>
            <el-button type="text"
                       v-if="scope.row.isEnabled !== 0"
                       @click="sendApplication(scope.row.id)">邀请测试</el-button>
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
  import pagination from '@/components/pagination'
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        form: {
          account: '',
          name: '',
          nickName: '',
          identityAuthentication: '',
          trans: '',
          choice: '',
          rangeTime: ''
        },
        formSelect: {
          authenticationOptions: [
            {label:'未认证',value:'0'},
            {label:'已认证',value:'1'}],
          resultOptions: [
            {label:'待测试',value:'待测试'},
            {label:'未通过',value:'未通过'},
            {label:'已通过',value:'已通过'}],
        },
        tableData: [],
        multipleSelection: []
      }
    },
    mounted (){
      this.showTableList()
    },
    filters: {
      filterLanPair (data, idx){
        let result = '', uniqueArr = [];
        data.forEach(item => {
          uniqueArr.push(item.targetLanguageName);
        });
        result = [...new Set(uniqueArr)];
        return result[idx];
      },
      formatChoice (lan, data){
        let result = '';
        data.forEach(item => {
          if(lan === item.targetLanguageName){
            if(item.levelType === 'select'){
              result = item.passedStatue;
              return result;
            }
          }
        });
        return result;
      },
      formatTran (lan, data){
        let result = '';
        data.forEach(item => {
          if(lan === item.targetLanguageName){
            if(item.levelType !== 'select'){
              result += item.passedStatue + '/';
            }
          }
        });
        return result.slice(0,-1);
      },
      formatLanPair (lan, data){
        let result = '';
        data.forEach(item => {
          if(lan === item.targetLanguageName){
            let origin = item.originLanguageName+'->'+item.targetLanguageName,
              target = item.targetLanguageName+'->'+item.originLanguageName;
            result = origin + '/' + target;
            return result;
          }
        });
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
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/userExtension/getPrePartTimeStaffInfo', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            account: this.form.account,
            realName: this.form.name,
            nickName : this.form.nickName,
            certificatePassed: this.form.identityAuthentication,
            choicePassed: this.form.choice,
            answerPassed: this.form.trans,
            registerStartDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            registerEndDateTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          // console.log(res);
          if(res.data.message === 'success' && res.data.data.list.length >= 0){
            this.tableData = [];
            res.data.data.list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalRow;
          }
          this.loading = false
        })
      },
      //禁用、启用
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
      },
      //（批量）邀请
      sendApplication (ids){
        const idArr = [];
        if(!ids){
          if(this.multipleSelection.length < 1){
            this.$message({
              type: 'warning',
              message: '请先勾选操作项'
            });
            return
          }
          this.multipleSelection.forEach(item => {
            idArr.push(item.id);
          })
        }
        let userIds = ids ? ids : idArr.toString();
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/userExtension/invitationTest', this.$qs.stringify({
            userIds: userIds
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '邀请成功'
              });
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
