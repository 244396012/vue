<template>
  <div class="page">
    <div class="default-style default-form">
      <el-row class="filterRow">
        <el-col :span="21">
          <div class="grid-content bg-purple pd-r-50 dotted-border-rg">
            <el-form :inline="true" class="demo-form-inline filterForm" label-width="70px">
              <el-form-item label="员工工号">
                <el-input v-model="form.account" placeholder="请输入员工工号"></el-input>
              </el-form-item>
              <el-form-item label="员工姓名">
                <el-input v-model="form.name" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
              <el-form-item label="在职情况">
                <el-select
                  v-model="form.isLeave" placeholder="请选择在职情况">
                  <el-option
                    v-for="item in formSelect.isLeaveOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="帐号状态">
                <el-select
                  v-model="form.state"
                  placeholder="请选择帐号状态">
                  <el-option
                    v-for="item in formSelect.stateOptions"
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
          label="工号">
        </el-table-column>
        <el-table-column
          width="90"
          prop="userName"
          label="姓名">
        </el-table-column>
        <el-table-column
          width="110"
          prop="userExtension.ownGroup"
          label="所属组别">
        </el-table-column>
        <el-table-column
          width="100"
          prop="userExtension.station"
          label="岗位">
        </el-table-column>
        <el-table-column
          width="100"
          label="职务">
          <template slot-scope="scope">
            {{scope.row.userExtendList | formatDuty}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语言对一">
          <template slot-scope="scope">
            {{scope.row.userExtendList[0] | formatLanPair}}
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          prop="userExtendList[0].levelName"
          label="等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="userExtendList[0].areaName"
          label="领域">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          label="语言对二">
          <template slot-scope="scope">
            {{scope.row.userExtendList[1] | formatLanPair}}
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          prop="userExtendList[1].levelName"
          label="等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="userExtendList[1].areaName"
          label="领域">
        </el-table-column>
        <el-table-column
          width="90"
          label="在职情况">
          <template slot-scope="scope">{{scope.row.userExtension.onLeave ?'在职':'离职'}}</template>
        </el-table-column>
        <el-table-column
          width="70"
          label="状态">
          <template slot-scope="scope">{{scope.row.isEnabled ?'启用':'停用'}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/interpreter/fullTime/detail/'+scope.row.id)">查看</el-button>
            <!--禁用、启用-->
            <el-button type="text"
                       v-if="scope.row.isEnabled !== 1"
                       @click="setUserStatus(scope.row.id, 1)">启用</el-button>
            <el-button type="text"
                       class="del"
                       v-if="scope.row.isEnabled !== 0"
                       @click="setUserStatus(scope.row.id, 0)">停用</el-button>
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
        showTableUrl: '/userExtension/getFullTimeStaffInfo',
        totalTableList: 0,
        form: {
          account: '',
          name: '',
          isLeave: '',
          state: ''
        },
        formSelect: {
          isLeaveOptions: [{label:'在职',value:'1'},{label:'离职',value:'0'}],
          stateOptions: [{label:'启用',value:'1'},{label:'停用',value:'0'}]
        },
        tableData: []
      }
    },
    filters: {
      formatDuty (data){
        let result = '', uniqueArr = [];
        if(Object.prototype.toString.call(data) === '[object Array]'){
          data.forEach(item => {
            uniqueArr.push(item.serviceName)
          })
        }
        result = [...new Set(uniqueArr)].join(',');
        return result;
      },
      formatLanPair (data){
        let result = '';
        if(data && (data.sourceLanguageName || data.targetLanguageName)){
          result = data.sourceLanguageName + '->' + data.targetLanguageName;
        }
        return result;
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
        this.$http.get(this.showTableUrl, {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            staffId: this.form.account,
            realName: this.form.name,
            onLeave: this.form.isLeave,
            status: this.form.state
          }
        }).then(res => {
          if(res.data.code === '200' && res.data.data.content.length >= 0){
            this.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
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
      }
    }
  }

</script>
