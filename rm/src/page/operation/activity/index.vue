<template>
  <div class="page">
    <div class="default-style">
      <el-row>
        <el-col :span="12">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="$router.push('/operation/activity/create')">创建活动</el-button>
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
          label="#"
          prop="num"
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="activityNo"
          label="活动编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="name"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="活动类型"
          min-width="100">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="活动时间">
          <template slot-scope="scope">{{scope.row.startTime.slice(0,10)}} - {{scope.row.endTime.slice(0,10)}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          min-width="100"
          prop="state"
          label="活动状态">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/operation/activity/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="scope.row.state === '进行中'"
                       @click="cancelActivity(scope.row.id,'已结束')">提前结束</el-button>
            <el-button type="text"
                       v-if="scope.row.state === '待开始'"
                       @click="cancelActivity(scope.row.id,'已撤销')" class="del">撤销</el-button>
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
        tableData: []
      }
    },
    mounted (){
      this.showTableList()
    },
    methods: {
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/operateActivity/getActivityList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            res.data.data.content.forEach((item, index) => {
              item.num = (index + 1) + (config.pageNo-1)*config.pageSize;
              this.tableData.push(item)
            });
            this.totalTableList = res.data.data.totalElements
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          this.loading = false
        })
      },
      //撤销、提前结束
      cancelActivity (id, type){
        this.$confirm('是否确认此操作，操作后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/operateActivity/changeActivityStatus',this.$qs.stringify({
            activityId: id,
            operate: type
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.showTableList();
            } else {
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
