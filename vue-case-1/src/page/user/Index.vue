<template>
  <div class="main-page user-page">
    <div class="user-nav">
      <router-link class="active" :to="'/user'">基本信息</router-link>
      <router-link :to="'/user/change-pwd'">修改密码</router-link>
    </div>
    <div class="content">
      <el-form
        @keyup.enter.native="sendUserInfo('dynamicValidateForm')"
        :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="email"
          label="邮 箱："
          :rules="[{ required: true}]">
          <span>{{dynamicValidateForm.email}}</span>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="手机号："
          :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.phone"></el-input>
        </el-form-item>
        <el-form-item
          prop="company"
          label="单位名称："
          :rules="[{ required: true, message: '请输入单位名称', trigger: 'blur' }]">
          <el-input v-model="dynamicValidateForm.company"></el-input>
        </el-form-item>
        <el-form-item
          prop="province"
          label="所在区域："
          :rules="[{ required: true, message: '请选择所在区域', trigger: 'blur' }]">
          <v-distpicker
            :province="dynamicValidateForm.province"
            :city="dynamicValidateForm.city"
            :area="dynamicValidateForm.area"
            @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"
          ></v-distpicker>
        </el-form-item>
        <el-form-item class="wrap-btn">
          <el-button type="primary" class="register-btn btn" @click.native="sendUserInfo('dynamicValidateForm')" :disabled="sendBtn.disabled">{{sendBtn.txt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  //引入v-distpicker地区插件
  import Distpicker from 'v-distpicker'
  export default {
    components:{
      'v-distpicker': Distpicker
    },
    name: 'Index',
    data() {
      return {
        sendBtn:{
          disabled: false,
          txt: '保存'
        },
        dynamicValidateForm: {
          email: '',
          phone: '',
          company: '',
          province: '',
          city: '',
          area: '',
          pwd: ''
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
          .then(res => {
            const account = res.data
            this.dynamicValidateForm.email = account.mbAccount
            this.dynamicValidateForm.company = account.mbCompanyName
            this.dynamicValidateForm.phone = account.mbTel
            this.dynamicValidateForm.pwd = account.mbPs
            this.dynamicValidateForm.province = account.province
            this.dynamicValidateForm.city = account.city
            this.dynamicValidateForm.area = account.area
          })
      },
      /*
      * 修改用户信息
      * */
      sendUserInfo (formname){
        this.$refs[formname].validate((valid) => {
          if(valid){
            this.sendBtn.disabled = true
            this.sendBtn.txt = '保存中'
            this.$ajax({
              method: 'put',
              url: '/member/update',
              data: this.$qs.stringify({
                mbCompanyName: this.dynamicValidateForm.company,
                mbTel: this.dynamicValidateForm.phone,
                mbMail: this.dynamicValidateForm.email,
                mbPs: this.dynamicValidateForm.email,
                province: this.dynamicValidateForm.province,
                city: this.dynamicValidateForm.city,
                area: this.dynamicValidateForm.area
              })
            })
            .then(res =>{
              if(res.data.code === '200' && res.data.message === 'success'){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              }else {
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
              this.sendBtn.disabled = false
              this.sendBtn.txt = '保存'
            })
            .catch(err =>{
              console.log(err)
            })
          }
        })
      },
      onChangeProvince(data) {
        this.dynamicValidateForm.province = data.value
      },
      onChangeCity(data) {
        this.dynamicValidateForm.city = data.value
      },
      onChangeArea(data) {
        this.dynamicValidateForm.area = data.value
      }
    }
  }
</script>
<style lang="scss">
  @import "../../style/login";
  @import "../../style/user-nav";
</style>
<style lang="css">
  .user-page .distpicker-address-wrapper select{
    width: 100px;
    font-size: 13px;
    padding: .5rem 2px;
    border-radius: 0;
  }
</style>
