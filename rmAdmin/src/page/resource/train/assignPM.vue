<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="form" ref="form" label-width="150px" class="demo-ruleForm">
          <el-form-item label="项目编号：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="$route.query.p" clearable disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="教务主管：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'pm'"
                            :rules="{ required: true, message: '请选择教务主管', trigger: 'change' }">
                <el-select v-model="form.pm" placeholder="请选择教务主管" style="width: 100%">
                  <el-option v-for="item of formSelect.pmOptions"
                             :key="item.key"
                             :value="item.key"
                             :label="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="项目执行时间：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'time'"
                            :rules="{ required: true, message: '请选择项目执行时间', trigger: 'blur' }">
                <el-date-picker v-model="form.time"
                  type="daterange"
                  :unlink-panels="true"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"></el-date-picker>
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
                width="50">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="projectManager"
                label="教务主管">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="startTime"
                label="开始时间">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="150"
                prop="endTime"
                label="结束时间">
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
    <pm-modal :callback="showLogTableList" :pmlist="formSelect.pmOptions" :updatedata="updatedata"></pm-modal>
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
        formSelect: {
          pmOptions: []
        },
        btn: {
          disabled: false,
          txt: '分 配'
        },
        loading: false,
        tableData: [],
        totalTableList: 0,
        updatedata: {}
      };
    },
    created (){
      this.showLogTableList();
      this.$http.get('/resourceOrder/getPmUserInfo',{
        params: {
          roleCode: 'ROLE_train_supervision'
        }
      }).then(res => {
        if(res.data.message === 'success'){
          this.formSelect.pmOptions = res.data.data
        }
      })
    },
    filters: {
      formatResourceProStatus: formatResourceProStatus
    },
    methods: {
      //提交分配
      submitForm (formName){
        const url = '/resource/train';
        this.$refs[formName].validate((valid) => {
          if(valid){

          //查找value
            const result = this.formSelect.pmOptions.find(item => {
              return item.key === this.form.pm;
            }) || {};

            this.btn.disabled = true;
            this.btn.txt = '分配中';
            this.$http.post('/resourceOrder/distributePm', this.$qs.stringify({
              id: this.$route.params.id,
              projectNo: this.$route.query.p,
              projectManager: result.value,
              projectManagerCode: this.form.pm,
              startTime: this.form.time.length>0?this.form.time[0]+' 00:00:00':'',
              endTime: this.form.time.length>0?this.form.time[1]+' 00:00:00':'',
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
        config.pageSize = config.pageSize || 20;
        this.loading = true;
        this.$http.get('/resourceOrder/getDistributionPms', {
          params: {
            pageNo: config.pageNo-1,
            pageSize: config.pageSize,
            projectNo: this.$route.query.p
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
            id: id,
            orderType: '4'
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
