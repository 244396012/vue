<template>
  <el-container class="wrap login">
    <el-main>
      <div class="login-form" v-if="!isLogin">
        <div class="bg"></div>
        <div class="form">
          <h1>用户登录</h1>
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-input v-model="form.account"
                        clearable
                        autocomplete="off"
                        placeholder="请输入帐号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password"
                        type="password"
                        clearable
                        autocomplete="off"
                        placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
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
  export default {
    data (){
      return {
        isLogin: '',
        fullscreenLoading: false,
        form: {
          account: '',
          password: ''
        },
        btn: {
          icon: '',
          disabled: false
        }
      }
    },
    created (){
      if(window.name){
        this.isLogin = window.name;
        this.getUserPermission(window.name)
      }
    },
    mounted (){
      const _this = this;
      window.onkeydown = function (e) {
        const event = e || window.event;
        if(_this.$route.path === '/' && event.keyCode === 13){
          _this.login()
        }
      }
      //9 33 62 63 69 96 25 97
    },
    methods: {
      //发起登录请求
      async login (){
        if(!this.form.account.trim() || !this.form.password.trim()){
          this.$message({
            type: 'warning',
            message: '请输入账号和密码'
          });
          return false
        }
        this.btn.disabled = true;
        this.btn.icon = 'el-icon-loading';
        await this.$http.post('/auth/oauth/token', this.$qs.stringify({
          client_id: '1',
          client_secret: 'server',
          grant_type: 'password',
          usertype: '1',
          username: this.form.account,
          password: this.form.password
        })).then(res => res).finally(() => {
          this.btn.disabled = false;
          this.btn.icon = ''
        }).then(data => {
          if(data.data.access_token){
            this.getUserPermission(data.data.access_token)
          }else{
            this.$message({
              type: 'error',
              message: data.message
            })
          }
        })
      },
      //获取权限
      getUserPermission (token){
        const loading = this.$loading({
          lock: true,
          text: '请稍等，正在初始化',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        });
        sessionStorage.setItem('sy_rm_admin_access_token', token);
        //获取用户权限
        this.getPermission().then(permission => {
          if(permission.data.message === 'success'){
            this.$router.options.routes = initRoutes;
            const matchedRoutes = this.matchPermission(dynamicRoutes, permission.data.data.flatMenue) || [];
            this.$router.options.routes = this.$router.options.routes.concat(matchedRoutes);
            this.$router.$addRoutes(this.$router.options.routes);
            sessionStorage.setItem('sy_rm_admin_permission', JSON.stringify(permission.data.data.flatMenue));
            setTimeout(() => {
              this.$route.query.url
                ? this.$router.push(this.$route.query.url)
                : this.$router.push('/home');
            }, 1000)
          }else{
            loading.text = permission.data.message
          }
          setTimeout(() => {
            loading.close()
          }, 1500)
        });
        //登录后，获取用户id
        this.$http.get('/auth/current', {
          params: {
            name: this.form.account
          }
        }).then(user => {
          if(user.status === 200){
            user.data.principal.user.id && sessionStorage.setItem('sy_rm_admin_ud', user.data.principal.user.id);
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "../style/login";
</style>
