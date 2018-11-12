<template>
  <div class="main-page">
    <div class="title">
      <h3>工程技术标准服务平台</h3>
      <p>—— 找回密码 ——</p>
    </div>
    <div class="content">
      <el-form
        @keyup.enter.native="findPwd('dynamicValidateForm')"
        :model="dynamicValidateForm"
        ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="email"
          label="邮 箱："
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="code"
          label="验证码："
          :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.code" class="code-text"></el-input>
          <el-button type="primary" class="code" @click.native="sendCode" :disabled="codeBtn.disabled">{{codeBtn.txt}}</el-button>
        </el-form-item>
        <el-form-item
          prop="password"
          label="新密码："
          :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item
          prop="repassword"
          label="确认密码："
          :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item class="wrap-btn">
          <el-button type="primary" class="register-btn btn" :disabled="btn.disabled" @click.native="findPwd('dynamicValidateForm')">{{btn.txt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Forget',
    data() {
      return {
        codeBtn:{
          disabled: false,
          txt: '获取验证码',
          time: 0
        },
        btn: {
          disabled: false,
          txt: '立即找回'
        },
        dynamicValidateForm: {
          email: '',
          code: '',
          password: '',
          repassword: ''
        }
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
      sendCode (){
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
      /*
      * 找回密码
      * */
      findPwd (formname){
        this.$refs[formname].validate(valid => {
          if(valid){
            if(this.dynamicValidateForm.password !== this.dynamicValidateForm.repassword){
              this.$message({
                message: '两次输入的密码不一致',
                type: 'error'
              })
              return
            }
            this.btn.disabled = true
            this.btn.txt = '找回中'
            this.$ajax({
              method: 'post',
              url: '/member/find_password',
              data: this.$qs.stringify({
                acount: this.dynamicValidateForm.email,
                verificationCode: this.dynamicValidateForm.code,
                password: this.dynamicValidateForm.password
              })
            })
            .then(res =>{
              if(res.data.message === 'success'){
                this.$message({
                  message: '密码设置成功',
                  type: 'success'
                })
                window.setTimeout(()=>{
                  this.$router.push('/login')
                },1000)
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
               this.btn.disabled = false
               this.btn.txt = '立即找回'
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
</style>

