<template>
  <div class="rm-cg">
    <el-dialog
      title="添加备注"
      width="460px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form  :model="form" ref="form" label-width="85px">
        <el-form-item label="备注：" :prop="'remark'" :rules="{ required: true, message: '请输入备注信息', trigger: 'blur' }">
          <el-input type="textarea"
                    v-model="form.remark"
                    placeholder="请输入备注信息"
                    style="width: 85%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="addRemarkFn('form')" :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'add-remark',
    props: ['callback','formid'],
    data (){
      return {
        btn: {
          txt: '确 定',
          disabled: false
        },
        form: {
          id: '',
          remark: ''
        }
      }
    },
    watch: {
      formid (newVal, oldVal){
        this.form.id = newVal;
      }
    },
    methods: {
      addRemarkFn (formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.btn.txt = '提交中';
            this.$http({
              method: 'post',
              url: '/financeNew/batchAddRemark',
              data: this.$qs.stringify({
                id: this.form.id,
                remark: this.form.remark
              })
            }).then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  type: 'success',
                  message: '添加成功'
                });
                this.form.remark = '';
                this.doSearch(this.callback);
                this.$store.commit('showModal', false);
              }else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                });
              }
              this.btn.disabled = false;
              this.btn.txt = '确 认';
            })
          }
        })
      }
    }
  }
</script>
