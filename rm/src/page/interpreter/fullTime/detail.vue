<template>
  <div class="page">
    <div class="default-style">
      <div class="detail">
        <el-row class="exact">
          <el-col :span="12"><div class="grid-content bg-purple"><b style="font-size: 18px;">{{detail.userName}}</b>{{detail.userCode && '（'+detail.userCode+'）'}}</div></el-col>
        </el-row>
        <el-row class="exact">
          <el-col :span="6"><div class="grid-content bg-purple"><b>岗位：</b>{{detail.station}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>职务：</b>{{detail.duty}}</div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div><b>在职情况：</b>{{detail.onLeave ? '在职':'离职'}}</el-col>
          <el-col :span="6"><div class="grid-content bg-purple-light"><b>状态：</b>{{detail.isEnabled ? '启用':'停用'}}</div></el-col>
        </el-row>
        <template v-if="detail.userExtendList">
          <el-row class="exact" v-for="(item, index) in detail.userExtendList" :key="item.id">
            <el-col :span="6"><div class="grid-content bg-purple"><b>语言对{{(index+1) | formatNum}}：</b>{{item.sourceLanguageName + '->' + item.targetLanguageName}}</div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light"><b>等级：</b>{{item.levelName}}</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple"></div><b>领域：</b>{{item.areaName}}</el-col>
          </el-row>
        </template>
      </div>
    </div>
    <div class="default-style">
      <div class="detail">
        <p class="sy-bold sy-title">任务情况</p>
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
            show-overflow-tooltip
            min-width="100"
            prop="taskId"
            label="任务编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="taskName"
            label="任务名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="projectName"
            label="项目名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="languageZh"
            label="语言对">
          </el-table-column>
          <el-table-column
            width="100"
            prop="orderTypeZh"
            label="任务类型">
          </el-table-column>
          <el-table-column
            width="90"
            prop="workLoad"
            label="任务数量">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="requireTime"
            label="交稿时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="realCompletTime"
            label="实际完成时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="domainZh"
            label="领域">
          </el-table-column>
          <el-table-column
            width="90"
            prop="taskStatusZh"
            label="任务状态">
          </el-table-column>
        </el-table>
        <template v-if="userCode && totalTableList > 0">
          <pagination :callback="showTableList" :total="totalTableList"></pagination>
        </template>
      </div>
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
        userCode: '',
        detail: {
          userName: '--',
          userCode: '--',
          station: '--',
          duty: '--',
          onLeave: '--',
          isEnabled: '--',
          userExtendList: ''
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
    },
    filters: {
      formatNum (num){
        switch (num){
          case 1: return '一';
          case 2: return '二';
          case 3: return '三';
          case 4: return '四';
          case 5: return '五';
          case 6: return '六';
          case 7: return '七';
          case 8: return '八';
          case 9: return '九';
          case 10: return '十';
        }
      }
    },
    mounted (){
      this.showDetail().then(res => {
        if(res){
          this.userCode = res;
          this.showTableList();
        }
      })
    },
    methods: {
      //获取详情数据
      async showDetail (){
        return await this.$http.get('/userExtension/getPartTimeStaffByUserId', {
          params: {
            userId: this.$route.params.id
          }
        }).then(res => {
          if(res.data.message === 'success'){
            let uniqueArr = [];
            this.detail.userName = res.data.data.userName;
            this.detail.userCode = res.data.data.userCode;
            this.detail.station = res.data.data.userExtension.station;
            this.detail.onLeave = res.data.data.userExtension.onLeave;
            this.detail.isEnabled = res.data.data.isEnabled;
            this.detail.userExtendList = res.data.data.userExtendList;
            res.data.data.userExtendList.forEach(item => {
              uniqueArr.push(item.serviceName)
            });
            this.detail.duty = [...new Set(uniqueArr)].join(',');
            return res.data.data.userCode;
          }
        })
      },
      //展示表格数据
      showTableList (config){
        config = config || {}
        config.pageNo = config.pageNo || 1
        config.pageSize = config.pageSize || 10
        this.loading = true
        this.$http.get('/task/listTaskDetailInfo', {
          params: {
            userCode: this.userCode,
            page: config.pageNo,
            limit: config.pageSize
          }
        }).then(res => {
          if(res.data.success && res.data.data.list.length >= 0){
            this.tableData = []
            res.data.data.list.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize
              this.tableData.push(item)
            })
            this.totalTableList = res.data.data.totalRow
          }
          this.loading = false
        })
      }
    }
  }
</script>
