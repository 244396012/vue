<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="form" ref="form" label-width="150px" class="demo-ruleForm">
          <el-form-item label="项目编号：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="$route.query.n" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="项目经理：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'pm'"
                            :rules="{ required: true, message: '请填写项目经理', trigger: 'blur' }">
                <el-input v-model="form.pm" placeholder="请填写项目经理"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="交付时间：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'time'"
                            :rules="{ required: true, message: '请选择交付时间', trigger: 'blur' }">
                <el-date-picker
                  v-model="form.time"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择交付时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="form.remark"
                          clearable
                          type="textarea" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-top: 1rem">
            <el-button type="success"
                       @click="submitForm('form')"
                       :disabled="btn.disabled">{{btn.txt}}</el-button>
          </el-form-item>
        </el-form>
        <el-row class="exact" style="padding-top: 15px;border-top: 1px solid #dedede">
          <el-col :span="20"><div class="grid-content bg-purple">
            <b style="margin-bottom: 10px">分配日志</b>
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="tableData">
              <el-table-column
                label="#"
                prop="num"
                width="40">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="projectManager"
                label="项目经理">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="deliveryTime"
                label="交付时间">
              </el-table-column>
              <el-table-column
                min-width="100"
                prop="taskStatus"
                label="状态">
                <template slot-scope="scope">{{scope.row.taskStatus | formatResourceProStatus}}</template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="remarks"
                label="备注">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="140">
                <template slot-scope="scope">
                  <el-button type="text" @click="modifyAssign(scope.row)">修改</el-button>
                  <el-button type="text" class="del" @click="delAssign(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="totalTableList > 0">
              <pagination-log :callback="showLogTableList" :total="totalTableList"></pagination-log>
            </template>
          </div></el-col>
        </el-row>
      </div>
    </div>
    <pm-modal :callback="showLogTableList" :updatedata="updatedata"></pm-modal>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import modal from './assignPM_modal';
  import { formatResourceProStatus } from '@/common/filter';
  export default {
    components: {
      'pagination-log': pagination,
      'pm-modal': modal
    },
    data() {
      return {
        form: {
          pm: '',
          time: '',
          remark: ''
        },
        updatedata: {},
        btn: {
          disabled: false,
          txt: '分 配'
        },
        loading: false,
        tableData: [],
        totalTableList: 0
      };
    },
    computed: {
      redirectUrl (){
        switch (this.$route.query.t){
          case '1': return '/resource/written';
          case '2': return '/resource/meeting';
          case '3': return '/resource/send';
          case '4': return '/resource/train';
        }
      }
    },
    created (){
      this.showLogTableList();
    },
    filters: {
      formatResourceProStatus: formatResourceProStatus
    },
    methods: {
      //提交分配
      submitForm (formName){
        const url = this.redirectUrl || '';
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '分配中';
            this.$http.post('/resourceOrder/distributePm', this.$qs.stringify({
              id: this.$route.params.id,
              projectNo: this.$route.query.n,
              projectManager: this.form.pm,
              deliveryTime: this.form.time?this.form.time+' 00:00:00':'',
              remarks: this.form.remark,
              orderType: this.$route.query.t
            })).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '分配成功'
                });
                setTimeout(() => {
                  this.$router.push(url)
                }, 1000)
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
              this.btn.disabled = false;
              this.btn.txt = '分 配'
            })
          }
        })
      },
      //分配日志
      showLogTableList (config){
        config = config || {};
        config.pageNo = config.pageNo || 1;
        config.pageSize = config.pageSize || 10;
        this.loading = true;
        this.$http.get('/resourceOrder/getDistributionPms', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            projectNo: this.$route.query.n
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
          }
          this.loading = false
        })
      },
      //删除
      delAssign (id){
        this.$confirm('是否确认删除，删除后无法撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('/resourceOrder/deleteProjectPm',this.$qs.stringify({
            id: id
          })).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.doSearch(this.showLogTableList)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
        }).catch(() => {})
      },
      //修改
      modifyAssign (row){
        this.$store.commit('showModal');
        this.updatedata = row;
      }
    }
  }
</script>
