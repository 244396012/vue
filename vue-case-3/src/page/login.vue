<template>
  <el-container class="wrap login">
    <el-main>
      <div class="login-form">
        <div class="bg"></div>
        <div class="form">
          <h1>用户登录</h1>
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-input v-model="form.account" clearable placeholder="请输入帐号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="form.password" clearable placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <div id="slide_box">
                <div id="slide_xbox">
                  <div id="btn">
                    <i class="el-icon-d-arrow-right"></i>
                  </div>
                </div>
                请按住滑块&nbsp;&nbsp;拖动到最右边
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="login" :disabled="btn.disabled">{{btn.txt}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-footer>&copy; 数译科技 版权所有</el-footer>
  </el-container>
</template>
<script>
import utils from '../utils'
export default {
  data (){
    return {
      form: {
        account: 'shuyi',
        password: '1'
      },
      btn: {
        txt: '登 录',
        disabled: false
      }
    }
  },
  mounted (){
    utils.slide()
  },
  methods: {
    login (){
      if(this.form.account === '' && this.form.password === ''){
        this.$message({
          type: 'warning',
          message: '请输入账号和密码'
        })
        return false
      }
      if(!document.getElementById('btn').getAttribute('data-code')){
        this.$message({
          type: 'warning',
          message: '请先拖动滑块进行安全验证'
        })
        return false
      }
      this.btn.disabled = true;
      this.btn.txt = '登录中';
      this.$http.post('/auth/oauth/token', this.$qs.stringify({
        client_id: '1',
        client_secret: 'server',
        grant_type: 'password',
        username: this.form.account,
        password: this.form.password
      })).then(res => {
        if(res.status === 200 && res.data.access_token){
          this.$message({
            type: 'success',
            message: '登录成功'
          });
          setTimeout(() => {
            this.$route.query.url
              ? this.$router.push(this.$route.query.url)
              : this.$router.push('/');
            localStorage.setItem('sy_rm_admin_access_token', res.data.access_token)
          }, 1000)
        }else{
          this.$message({
            type: 'error',
            message: '账号或密码错误'
          })
        }
        this.btn.disabled = false;
        this.btn.txt = '登 录'
      }).catch(err => {
        if(err.response.status === 400 && err.response.data.error === 'invalid_grant'){
          this.$message({
            type: 'error',
            message: '账号或密码错误，请重试'
          });
          this.btn.disabled = false;
          this.btn.txt = '登 录'
        }
      })
    }
  }
}
</script>
<style lang="scss">
  @import "../style/login";
</style>
