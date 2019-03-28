<template>
  <div class="login-page">
    <div class="login-con">
      <h3>知识说后台管理系统</h3>
      <el-form label-position="top" label-width="80px"
               :model="dynamicValidateForm"
               ref="dynamicValidateForm"
               @keyup.enter.native="login('dynamicValidateForm')">
        <el-form-item
          label="帐号"
          prop="username"
          :rules="[{ required: true, message: '请输入帐号', trigger: 'blur' }]">
          <el-input type="text" v-model="dynamicValidateForm.username" palceholder="请输入帐号"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="username"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="dynamicValidateForm.password" palceholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click.native="login('dynamicValidateForm')"
                     :disabled="btn.disabled">{{btn.txt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dynamicValidateForm: {
          username: 'xiangchao',
          password: '1'
        },
        btn: {
          txt: '登 录',
          disabled: false
        }
      }
    },
    methods: {
      /* 用户登录 */
      login (formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.btn.disabled = true
            this.btn.txt = '登录中'
            this.$http.post('/uaa/oauth/token',this.$qs.stringify({
                client_id: '1',
                client_secret: 'server',
                grant_type: 'password',
                username: this.dynamicValidateForm.username,
                password: this.dynamicValidateForm.password
              }
            )).then(res => {
                if(res.status === 200 && res.data.access_token){
                  this.$message({
                    type: 'success',
                    message: '登录成功'
                  })
                  window.setTimeout(() => {
                    this.$route.query.url
                      ? this.$router.push(this.$route.query.url)
                    //  : this.$router.push('/home')
					  : this.$router.push('/dataMg/term')
                    localStorage.setItem('yyq_zss_admin_access_token', res.data.access_token)
                    localStorage.setItem('yyq_zss_admin_user_name', this.dynamicValidateForm.username)
                  }, 1500)
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  })
                }
                this.btn.disabled = false
                this.btn.txt = '登 录'
              })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
.login-page{
  width:100%;
  height: 100%;
  .login-con{
    width: 480px;
    height: 440px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #ccc;
    h3{
      height: 80px;
      line-height: 80px;
      margin: 0;
      background-color: #fff;
      text-align: center;
      font-size: 20px;
      font-weight:400;
    }
    .el-form{
      padding: 15px 90px;
    }
    .el-button{
      width: 100%;
      margin-top: 30px;
      font-size: 16px;
    }
    label{
      font-size: 16px;
      padding-bottom: 0!important;
      &::before{content: ''!important}
    }
  }
}
</style>
