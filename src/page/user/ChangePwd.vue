<template>
  <div class="main-page user-page">
    <div class="user-nav">
      <router-link :to="'/user'">基本信息</router-link>
      <router-link :to="'/user/change-pwd'" class="active" >修改密码</router-link>
    </div>
    <div class="content">
      <el-form
        @keyup.enter.native="updatePwd('dynamicValidateForm')"
        :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="account"
          label="登录帐号："
          :rules="[{ required: true}]">
          <span>{{dynamicValidateForm.account}}</span>
        </el-form-item>
        <el-form-item
          prop="oldPwd"
          label="旧密码："
          :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.oldPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item
          prop="newPwd"
          label="新密码："
          :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.newPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item
          prop="reNewPwd"
          label="确认密码："
          :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.reNewPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item class="wrap-btn">
          <el-button type="primary" class="register-btn btn" :disabled="btn.disabled" @click.native="updatePwd('dynamicValidateForm')">{{btn.txt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChangePwd',
    data() {
      return {
        btn: {
          disabled: false,
          txt: '保存'
        },
        dynamicValidateForm: {
          account: '-',
          modifyOldPwd: '',
          oldPwd: '',
          newPwd: '',
          reNewPwd: '',
        }
      }
    },
    mounted (){
      this.getUserInfo()
    },
    methods: {
      /* 获取用户信息 */
      getUserInfo (){
        this.$ajax.get('/member/info')
          .then(data => {
            this.dynamicValidateForm.account = data.data.mbAccount
            this.dynamicValidateForm.oldPwd = data.data.mbPs
            this.dynamicValidateForm.modifyOldPwd = data.data.mbPs
          })
      },
      /* 修改密码 */
      updatePwd (formname){
        this.$refs[formname].validate(valid => {
          if(valid){
            if(this.dynamicValidateForm.oldPwd !== this.dynamicValidateForm.modifyOldPwd){
              this.$message({
                message: '旧密码错误',
                type: 'error'
              })
              return
            }
            if(this.dynamicValidateForm.newPwd !== this.dynamicValidateForm.reNewPwd){
              this.$message({
                message: '两次确认密码不一样',
                type: 'error'
              })
              return
            }
            this.btn.disabled = true
            this.btn.txt = '修改中'
            this.$ajax({
              method: 'post',
              url: '/member/update_password',
              data: this.$qs.stringify({
                account: this.dynamicValidateForm.account,
                oldPassword: this.dynamicValidateForm.modifyOldPwd,
                newPassword: this.dynamicValidateForm.newPwd
              })
            })
            .then(res => {
              if(res.data.message === 'success'){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                window.setTimeout(()=>{
                  this.$router.push('/user')
                },1000)
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
              this.btn.disabled = false
              this.btn.txt = '保存'
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/login";
  @import "../../style/user-nav";
</style>

