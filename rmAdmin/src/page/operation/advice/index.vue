<template>
  <div class="page">
    <div class="default-style default-form">
      <div class="filter-row">
        <div class="search">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
          <el-input v-model="form.account" placeholder="账号"></el-input>
          <el-select v-model="form.feedbackType" placeholder="反馈类型">
            <el-option
              v-for="item in formSelect.feedbackType"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-select v-model="form.feedbackLevel" placeholder="反馈等级">
            <el-option
              v-for="item in formSelect.feedbackLevel"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-button type="success" @click="doSearch(showTableList)">查 询</el-button>
          <el-button class="reset" @click="resetKeepAliveSearch">重 置</el-button>
        </div>
        <div class="button" >  </div>
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
          show-overflow-tooltip
          min-width="120"
          prop="gmtCreate"
          label="反馈时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="realName"
          label="姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="nickName"
          label="昵称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="110"
          prop="account"
          label="帐号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="250"
          prop="feedbackContent"
          label="反馈说明">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="100"
          prop="feedbackType"
          label="反馈类型">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="feedbackLevel"
          label="反馈等级">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="90"
          prop="operator"
          label="操作人">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push('/operation/advice/detail/'+scope.row.id)">查看</el-button>
            <el-button type="text"
                       v-if="scope.row.feedbackLevel === ''"
                       @click="setLevel(scope.row.id)">设置等级</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
    </div>
    <setLevel :callback="showTableList" :formid="form.id"></setLevel>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import setLevel from './modal_set';
  export default {
    components: {
      pagination,
      setLevel
    },
    data (){
      return {
        form: {
          id: '',
          name: '',
          account: '',
          feedbackType: '',
          feedbackLevel: ''
        },
        formSelect: {
          feedbackType: [
            {label: '平台bug', value: '平台bug'},
            {label: '体验优化', value: '体验优化'},
            {label: '投诉与建议', value: '投诉与建议'},
            {label: '其他', value: '其他'}
          ],
          feedbackLevel: [
            {label: '重大反馈', value: '重大反馈'},
            {label: '一般反馈', value: '一般反馈'},
            {label: '零反馈', value: '零反馈'}
          ]
        },
        loading: false,
        totalTableList: 0,
        tableData: []
      }
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
        this.$http.get('/feedback/listALLFeedBack', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            realName: this.form.name,
            account: this.form.account,
            feedBackLevel: this.form.feedbackLevel,
            feedBackType: this.form.feedbackType
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
      //"添加备注"模态框
      setLevel (id){
        this.$store.commit('showModal', true);
        this.form.id = id;
      }
    }
  }

</script>
