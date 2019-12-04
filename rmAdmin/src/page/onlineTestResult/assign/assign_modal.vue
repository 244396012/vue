<template>
  <div>
    <el-dialog
      title="分配审核人"
      width="770px"
      :visible.sync="$store.state.showModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center>
      <div style="width: 250px;padding: 10px 0;float: right">
        <el-input placeholder="搜索审核人"
                  clearable
                  v-model="form.realName" @input="searchAssigner"></el-input>
      </div>
      <el-table
        border
        max-height="490"
        ref="singleTable"
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column
          label="#"
          prop="num"
          width="60">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="审核人">
          <template slot-scope="scope">{{scope.row.realName}} （{{scope.row.userCode}}）</template>
        </el-table-column>
      </el-table>
      <template v-if="totalTableList > 0">
        <pagination :callback="showTableList" :total="totalTableList"></pagination>
      </template>
      <div style="height: 15px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmAssign" :disabled="btn.disabled">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import utils from '@/utils/index';
  export default {
    props: ['callback','assignId'],
    components: { pagination },
    data (){
      return {
        btn: {
          disabled: false
        },
        form:{
          realName: ''
        },
        loading: false,
        tableData: [],
        totalTableList: 0,
        currentRow: null
      }
    },
    watch: {
      assignId (){
        this.currentRow = null;
        this.form.realName = '';
        this.doSearch(this.showTableList)
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      showTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/userInfoController/getAuditorList', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            realName: this.form.realName
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
          }
          this.loading = false
        })
      },
      //搜索审核人
      searchAssigner: utils.throttle(function() {
        this.showTableList()
      }, 800),
      //确认审核人
      confirmAssign (){
        if(!this.currentRow){
          this.$message.warning('请先选择审核人');
          return false;
        }
        const formData = {
          tranResultId: this.assignId,
          positionType: '',
          auditorId: this.currentRow.userId,
          userName: this.currentRow.realName
        };
        this.btn.disabled = true;
        this.$http({
          method: 'put',
          url: '/exam/admin/allocationAuditor',
          data: this.$qs.stringify(formData)
        }).then(res => {
          if(res.data.message === 'success'){
            this.$message.success('分配成功');
            this.$store.commit('showModal', false);
            this.doSearch(this.callback);
            this.currentRow = null;
            this.form.realName = '';
          }else{
            this.$message.error(res.data.message)
          }
          this.btn.disabled = false
        })
      }
    }
  }
</script>
