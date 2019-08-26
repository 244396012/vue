<template>
  <div class="rm-cg">
    <el-dialog
      title="添加备注"
      width="500px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form>
        <el-form-item required>
          <el-input type="textarea"
                    v-model="form.remark"
                    placeholder="请输入备注信息"
                    style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="addRemarkFn" :disabled="btn.disabled">{{btn.txt}}</el-button>
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
      addRemarkFn (){
        if(this.form.remark.trim() === ''){
          this.$message({
            type: 'warning',
            message: '请填写备注'
          });
          return null;
        }
        this.btn.disabled = true;
        this.btn.txt = '提交中';
        this.$http({
          method: 'post',
          url: '/finance/addReamark',
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
            this.$store.commit('showModal', false);
            this.form.remark = '';
            this.callback();
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
    }
  }
</script>
