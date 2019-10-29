<template>
  <div class="rm-cg">
    <el-dialog
      title="修改密码"
      width="400px"
      :visible.sync="$store.state.showModalPwd"
      center>
      <el-form>
        <el-form-item label="旧密码：" required>
          <el-input type="password" v-model="form.oldPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" required>
          <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" required>
          <el-input type="password" v-model="form.newRePwd" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="$store.commit('showModalPwd')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success"
                   @click="modifyPwd"
                   :disabled="btn.disabled">{{btn.txt}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'change-pwd',
    props: ['callback'],
    data (){
      return {
        btn: {
          txt: '确 认',
          disabled: false
        },
        form: {
          oldPwd: '',
          newPwd: '',
          newRePwd: ''
        }
      }
    },
    methods: {
      //修改密码
      modifyPwd (){
        if(this.form.oldPwd.trim() === '' ||
          this.form.newPwd.trim() === '' ||
          this.form.newRePwd.trim() === ''){
            this.$message({
              type: 'warning',
              message: '请输入密码'
            });
            return false;
        }
        if(this.form.newPwd !== this.form.newRePwd){
          this.$message({
            type: 'warning',
            message: '确认密码不一致'
          });
          return false;
        }
        this.btn.disabled = true;
        this.btn.txt = '提交中';
        this.$http.put('/customer/renewPassword', this.$qs.stringify({
          oldPassword: this.form.oldPwd,
          newPassword: this.form.newPwd,
          renewPassword: this.form.newRePwd
        })).then(res => {
          if(res.data.message === 'success'){
            this.$message({
              type: 'success',
              message: '修改成功，请重新登录'
            });
            setTimeout(() => {
              sessionStorage.removeItem('sy_rm_admin_access_token');
              sessionStorage.removeItem('sy_rm_admin_permission');
              this.$store.commit('showModalPwd');
              this.$router.push('/login');
            }, 1000);
          }else{
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
          this.btn.disabled = false;
          this.btn.txt = '确 认'
        })
      }
    }
  }
</script>
