<template>
  <div>
    <el-dialog
      title="重置密码"
      width="450px"
      :visible.sync="$store.state.showModal"
      center>
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="登录密码："
                      style="margin-bottom: 15px"
                      :prop="'password'" :rules="{ required: true, message: '请输入登录密码', trigger: 'blur' }">
          <el-input show-password v-model="form.password" placeholder="请输入登录密码" style="width: 210px"></el-input>
        </el-form-item>
        <div style="padding: 10px 0 15px; font-size: 12px">
          请输入该操作账号的登录密码，十五分钟之内操作有效 <br>
          此操作为高危操作，请事先与译员沟通确认
        </div>
        <div v-if="permission.wrongTimes > 0"
          style="padding-bottom: 15px; color: orangered">
          注：你目前已输错次 <span style="color: #000">{{permission.wrongTimes}}</span> 密码
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$store.commit('showModal')" style="margin-right: 30px;">取 消</el-button>
        <el-button type="success" @click="confirmReset('form')" :disabled="btn.disabled">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import domain from '@/api';
  export default {
    props: ['callback','userId','permission'],
    data (){
      return {
        form: {
          password: ''
        },
        btn: {
          disabled: false
        }
      }
    },
    methods: {
      confirmReset (form){
        console.log(this.permission);
        this.$refs[form].validate((valid) => {
          if(valid){
            this.btn.disabled = true;
            this.$http.defaults.baseURL = domain.baseLgURL;
            this.$http.post('/adminManager/checkloginUser', this.$qs.stringify({
              password: this.form.password
            })).then(res => {
              if(res.data.message === 'success'){
                this.$http.defaults.baseURL = domain.baseLgURL;
                this.$http.put('/adminManager/resetUserPassword',this.$qs.stringify({
                  userId: this.userId
                })).then(res => {
                  if(res.data.message === 'success'){
                    this.$message.success('操作成功');
                    this.callback();
                    this.$store.commit('showModal', false);
                  }else{
                    this.$message.error(res.data.message)
                  }
                  this.form.password = '';
                });
                this.$http.defaults.baseURL = domain.baseRMURL
              }else{
                this.$message.error(res.data.message)
              }
              setTimeout(() => {
                this.btn.disabled = false
              }, 1000)
            });
            this.$http.defaults.baseURL = domain.baseRMURL
          }
        })
      }
    }
  }
</script>
