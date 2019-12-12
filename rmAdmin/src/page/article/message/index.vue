<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.title" placeholder="消息标题"></el-input>
          <el-select v-model="form.status" placeholder="消息状态">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="草稿" value="0"></el-option>
          </el-select>
          <el-date-picker
            v-model="form.rangeTime"
            :clearable="false"
            :unlink-panels="true"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="发布时间"
            end-placeholder="结束时间">
          </el-date-picker>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetKeepAliveSearch">重 置</el-button>
        </div>
        <div class="button">
          <el-button type="success"
                     @click="$router.push('/article/message/release')">发布公告</el-button>
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
          width="50">
        </el-table-column>
        <el-table-column
          min-width="110"
          label="消息类型">
          <template slot-scope="scope">{{scope.row.type | formatMsgType}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="head"
          label="标题">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="内容">
          <template slot-scope="scope"><div v-html="scope.row.content"></div></template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="120"
          prop="receivePersonType"
          label="接收人员类型">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="状态">
          <template slot-scope="scope">{{scope.row.sended ? '已发布':'草稿'}}</template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="150"
          label="发布时间">
          <template slot-scope="scope">{{scope.row.publishTime ? scope.row.publishTime:scope.row.gmtCreate}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/article/message/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="!scope.row.sended"
                       @click="clickSend(scope.row.id)">点击发布</el-button>
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
  import { formatMsgType } from '@/common/filter';
  export default {
    components: {
      pagination
    },
    data (){
      return {
        loading: false,
        totalTableList: 0,
        tableData: [],
        form: {
          title: '',
          status: '',
          rangeTime: ''
        }
      }
    },
    filters: {
      formatMsgType: formatMsgType
    },
    created (){
      this.showTableList()
    },
    methods: {
      resetKeepAliveSearch (){
        this.resetSearch(this.form, this.showTableList)
      },
      //展示表格数据
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/notice/alreadyPublishSysNoticeList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            head: this.form.title,
            status: this.form.status,
            startTime: this.form.rangeTime.length>0 ? this.form.rangeTime[0]+' 00:00:00' : '',
            endTime: this.form.rangeTime.length>0 ? this.form.rangeTime[1]+' 23:55:55' : ''
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.tableData = [];
            const list = res.data.data.content;
            list.forEach((item, index) => {
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
          this.loading = false;
        })
      },
      //点击发布
      clickSend (id){
        this.$confirm('是否确认此操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/notice/immediatelyPublish',this.$qs.stringify({
            sysNoticeId: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '发布成功'
              });
              this.doSearch(this.showTableList)
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
