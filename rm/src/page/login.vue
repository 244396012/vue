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
              <el-input v-model="form.password" clearable type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <div id="slide_box">
                <div id="slide_xbox">
                  <div id="slide_btn">
                    <i class="el-icon-d-arrow-right"></i>
                  </div>
                </div>
                请按住滑块&nbsp;&nbsp;拖动到最右边
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="success"
                         @click="login"
                         v-loading.fullscreen.lock="fullscreenLoading"
                         :disabled="btn.disabled"
                         :icon="btn.icon">登 录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-footer>
      &copy; 数译科技 {{new Date().getFullYear()>2019 ? '2019-'+new Date().getFullYear() : new Date().getFullYear()}}
      <a class="beian" href="http://www.beian.miit.gov.cn" target="_blank" rel="nofollow"> 蜀ICP备14015776号</a>
    </el-footer>
  </el-container>
</template>
<script>
  import dynamicRoutes from '@/router/routes';
  import initRoutes from '@/router/initRoutes';
  import utils from '../utils';
  export default {
    data (){
      return {
        fullscreenLoading: false,
        form: {
          account: 'Q00596',
          password: '111111'
        },
        btn: {
          icon: '',
          disabled: false
        }
      }
    },
    mounted (){
      //DOM渲染后执行
      this.$nextTick(() => {
        utils.slide()
      })
    },
    methods: {
      //发起登录请求
      login (){
        const _this = this;
        if(!this.form.account.trim() || !this.form.password.trim()){
          this.$message({
            type: 'warning',
            message: '请输入账号和密码'
          });
          return false
        }
        if(!document.getElementById('slide_btn').getAttribute('data-code')){
          this.$message({
            type: 'warning',
            message: '请先拖动滑块进行安全验证'
          });
          return false
        }
        this.btn.disabled = true;
        this.btn.icon = 'el-icon-loading';
        this.$http.post('/auth/oauth/token', this.$qs.stringify({
          client_id: '1',
          client_secret: 'server',
          grant_type: 'password',
          usertype: '1',
          username: this.form.account,
          password: this.form.password
        })).then(res => {
          if(res.data.access_token){
            sessionStorage.setItem('sy_rm_admin_access_token', res.data.access_token);
            const loading = this.$loading({
              lock: true,
              text: '请稍等，正在获取权限',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.8)'
            });
            this.getPermission().then(permission => {
              if(permission.data.message === 'success'){
                this.$router.options.routes = initRoutes;
                const matchedRoutes = this.matchPermission(dynamicRoutes, permission.data.data.flatMenue) || [];
                this.$router.options.routes = this.$router.options.routes.concat(matchedRoutes);
                this.$router.$addRoutes(this.$router.options.routes);
                sessionStorage.setItem('sy_rm_admin_permission', JSON.stringify(permission.data.data.flatMenue));
                setTimeout(() => {
                  _this.$route.query.url
                    ? _this.$router.push(_this.$route.query.url)
                    : _this.$router.push('/');
                }, 1000)
              }else{
                loading.text = permission.data.message
              }
              setTimeout(() => {
                loading.close()
              }, 1500)
            })
          }else{
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.btn.disabled = false;
          this.btn.icon = ''
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../style/login";
</style>
