<template>
  <div class="main-page">
    <div class="title">
      <h3>工程技术标准服务平台</h3>
      <p>—— 注册帐号 ——</p>
    </div>
    <div class="content">
      <el-form
        @keyup.enter.native="register('dynamicValidateForm')"
        :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="email"
          label="邮 箱："
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="code"
          label="验证码："
          :rules="[{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.code" class="code-text"></el-input>
          <el-button type="primary" class="code" :disabled="codeBtn.disabled" @click.native="sendCode">{{codeBtn.txt}}</el-button>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密 码："
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="dynamicValidateForm.password"></el-input>
        </el-form-item>
        <el-form-item
          prop="repassword"
          label="确认密码："
          :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input type="password" v-model="dynamicValidateForm.repassword"></el-input>
        </el-form-item>
        <el-form-item
          prop="account"
          label="手机号："
          :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.account"></el-input>
        </el-form-item>
        <el-form-item
          prop="company"
          label="单位名称："
          :rules="[{ required: true, message: '请输入单位名称', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.company"></el-input>
        </el-form-item>
        <p class="nav-tips">
          <label><input type="checkbox" :checked="checked" v-model="checked">我已阅读并接受<a href="#">用户协议</a></label>
          <router-link to="/">已有帐号？</router-link>
        </p>
        <el-form-item class="wrap-btn">
          <el-button type="primary" class="register-btn btn" @click="register('dynamicValidateForm')" :disabled="regBtn.disabled">{{regBtn.txt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Register',
    data() {
      return {
        checked: true,
        codeBtn:{
          disabled: false,
          txt: '获取验证码',
          time: 0
        },
        regBtn:{
          disabled: false,
          txt: '立即注册'
        },
        dynamicValidateForm: {
          account: '',
          password: '',
          repassword: '',
          company: '',
          code: '',
          email: ''
        }
      }
    },
    watch: {
      checked (val){
        this.regBtn.disabled = !val
      }
    },
    methods: {
      //60s倒计时
      timer (){
        if (this.codeBtn.time > 0) {
          this.codeBtn.time--
          this.codeBtn.txt = this.codeBtn.time+"s后重新获取"
          setTimeout(this.timer, 1000)
        } else{
          this.codeBtn.time = 0
          this.codeBtn.txt = "获取验证码"
          this.codeBtn.disabled = false
        }
      },
      /*
      * 发送邮箱验证码
      * */
      sendCode(){
        const regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if(this.dynamicValidateForm.email === ''){
          this.$message({
            message: '请输入邮箱',
            type: 'warning'
          })
        }else if(!regEmail.test(this.dynamicValidateForm.email)){
          this.$message({
            message: '邮箱格式不正确',
            type: 'error'
          })
        }else{
          this.codeBtn.time = 60
          this.codeBtn.disabled = true
          this.timer()
          this.$ajax({
            method: 'post',
            url: '/member/send_email',
            data: this.$qs.stringify({
              email: this.dynamicValidateForm.email
            })
          }).then(res => {
            if(res.data.message === 'success'){
              this.$message({
                message: '发送成功',
                type: 'success'
              })
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        }
      },
      register (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.dynamicValidateForm.password !== this.dynamicValidateForm.repassword){
              this.$message({
                message: '两次输入的密码不一样',
                type: 'warning'
              })
              return
            }
            this.regBtn.disabled = true
            this.regBtn.txt = '注册中'
            this.$ajax({
              method: 'post',
              url: '/member/register',
              data: this.$qs.stringify({
                mbAccount: this.dynamicValidateForm.account,
                mbCompanyName  : this.dynamicValidateForm.company,
                mbTel  : this.dynamicValidateForm.account,
                mbMail : this.dynamicValidateForm.email,
                mbPs: this.dynamicValidateForm.password,
                code: this.dynamicValidateForm.code
              })
            })
            .then(data => {
              if(data.data.code === '200' && data.data.message === 'success'){
                this.$message({
                  message: '注册成功',
                  type: 'success'
                })
                window.setTimeout(() => {
                  this.$router.push('/login')
                }, 1000)
              }else{
                this.$message({
                  message: data.data.msg,
                  type: 'error'
                })
                this.regBtn.disabled = false
                this.regBtn.txt = '立即注册'
              }
            })
            .catch(err => {
              console.log(err)
            })
          }
        })

      }
    }
  }
</script>
<style lang="scss">
@import "../style/login";
.el-main{
  .nav-tips{
    label{
      float: left;
      margin-left: 20px;
      font-size: 14px;
      color: #666;
      a{
        color: #00a0e9;
      }
    }
    input{
      vertical-align: middle;
      margin-bottom: 5px;
    }
  }
}
</style>

