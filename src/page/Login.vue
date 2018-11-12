<template>
  <div class="main-page">
    <p class="tips">您目前为游客，请先登录！</p>
    <div class="title">
      <h3>工程技术标准服务平台</h3>
      <p>—— 帐号登录 ——</p>
    </div>
    <div class="content">
      <el-form label-width="100px" class="demo-dynamic"
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        @keyup.enter.native="login('dynamicValidateForm')">
        <el-form-item
          prop="username"
          label="邮 箱："
          :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密 码："
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="wrap-btn">
          <el-button type="primary" class="login-btn btn"
                     @click.native="login('dynamicValidateForm')"

                     :disabled="logBtn.disabled">{{logBtn.txt}}</el-button>
        </el-form-item>
        <p class="nav-tips">
          <router-link to="/register">立即注册</router-link>
          <router-link to="/forget">忘记密码？</router-link>
        </p>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Utils from '../utils'
  import { mapActions } from 'vuex'
  export default {
  name: 'Login',
  data() {
    return {
      logBtn: {
        disabled: false,
        txt: '立即登录'
      },
      dynamicValidateForm: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
    ...mapActions([
      'showUserInfo'
    ]),
    /* 用户登录 */
    login (formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.logBtn.disabled = true
          this.logBtn.txt = '登录中'
          this.$ajax({
            method: 'post',
            url: '/login',
            data: this.$qs.stringify({
              username: this.dynamicValidateForm.username,
              password: this.dynamicValidateForm.password
            })
          })
          .then(data => {
            if(data.data.status === 'success'){
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              window.setTimeout(() => {
                const isredirect = this.$route.fullPath.includes('?redirect=')
                if(isredirect){
                  this.$router.push(Utils.getUrlKey('redirect'))
                }else{
                  this.$router.push('/user-vip')
                }
                this.$ajax.get('/member/info')
                  .then(res => {
                    this.showUserInfo(res.data)
					          localStorage.setItem('storage_userInfo_',JSON.stringify(res.data))
                  })
              }, 1000)
            }else{
              this.$message({
                message: data.data.msg,
                type: 'error'
              })
            }
            this.logBtn.disabled = false
            this.logBtn.txt = '立即登录'
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

