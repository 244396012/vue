<template>
  <div class="page">
    <div class="default-style">
      <div class="detail form">
        <el-form :model="form" ref="form" label-width="150px" class="demo-ruleForm">
          <el-form-item label="兼职译员：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <search-parttime ref="searchPart"></search-parttime>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="译员等级：" required style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item :prop="'level'"
                            :rules="{ required: true, message: '请选择译员等级', trigger: 'blur' }">
                <el-select v-model="form.level"
                           style="width: 100%"
                           placeholder="请选择译员等级">
                  <el-option
                    v-for="item of memberLevel"
                    :key="item"
                    :label="item"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="单价：" style="margin-bottom: 0px">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="form.price"
                          clearable
                          type="number" placeholder="请输入单价"></el-input>
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
            <b style="margin-bottom: 10px">分配记录</b>
            <el-table
              border
              stripe
              :max-height="$store.state.tableHeight"
              v-loading="loading"
              :data="tableData">
              <el-table-column
                label="#"
                prop="num"
                width="60">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="operatePeople"
                label="分配人">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="120"
                prop="partTimeName"
                label="兼职译员">
              </el-table-column>
              <el-table-column
                min-width="90"
                label="测试等级">
                <template slot-scope="scope">{{scope.row.testLevel | formatLevel}}</template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                min-width="90"
                prop="unitPrice"
                label="单价">
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
    <assign-modal :callback="showLogTableList" :updatedata="updatedata"></assign-modal>
  </div>
</template>
<script>
  import pagination from '@/components/pagination';
  import modal from './assign_modal';
  import searchPart from '../component/searchParttime';
  import { mapState, mapMutations } from 'vuex';
  import { formatLevel } from '@/common/filter';
  export default {
    components: {
      'pagination-log': pagination,
      'assign-modal': modal,
      'search-parttime': searchPart,
    },
    data() {
      return {
        updatedata: {},
        form: {
          level: '',
          price: '',
          remark: ''
        },
        btn: {
          disabled: false,
          txt: '分 配'
        },
        loading: false,
        tableData: [],
        totalTableList: 0
      };
    },
    filters: {
      formatLevel: formatLevel
    },
    computed: {
      ...mapState('select',{
        memberLevel: state => state.memberLevel
      }),
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
      this.showLogTableList()
    },
    methods: {
      //提交分配
      submitForm (formName){
        const redirectUrl = this.redirectUrl || '';
        if(!this.$refs.searchPart.form.member){
          this.$message({
            type: 'warning',
            message: '请选择兼职译员'
          });
          return false
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '分配中';
            //除培训外的兼职分配 （this.$route.query.t = 4 为培训单）
            this.$http.post('/resourceOrder/distributeInterpreter', this.$qs.stringify({
              id: this.$route.params.id,
              projectNo: this.$route.query.p,
              partTimeName: this.$refs.searchPart.form.member.split(',')[0] || '',
              partTimeNo: this.$refs.searchPart.form.member.split(',')[1] || '',
              testLevel: this.form.level,
              remarks: this.form.remark,
              unitPrice: this.form.price
            })).then(res => {
                if(res.data.message === 'success'){
                  this.$message({
                    type: 'success',
                    message: '分配成功'
                  });
                  setTimeout(() => {
                    this.$router.push(redirectUrl)
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
        this.$http.get('/resourceOrder/hireList', {
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
          let url = '/resourceOrder/deleteInterpreter',
            data = {
              interpreterId: id
            };
          this.$http.delete(url, {
            params: data
          }).then(res => {
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
