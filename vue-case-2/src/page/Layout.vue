<template>
  <el-container class="layout-page">
    <el-header height="80px">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">知识说平台</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <span class="user">{{userName}}</span>
          <span class="logout" @click="logout">退出</span>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-scrollbar class="aside" style="height: 100%">
        <el-aside width="240px">
          <el-menu
            router
            :default-active="$route.path"
            background-color="#132241"
            text-color="#fff">
            <template v-for="(item,index) in menuList">
              <template v-if="item.name !== '首页'">
                <el-submenu :key="index" :index="String(index)" >
                    <template slot="title">
                      <span>{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="(item1,index1) in item.children" :key="index+'-'+index1" :index="item1.path">{{item1.name}}</el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item class="exact" :key="index" :index="item.path">
                  <span slot="title">{{item.name}}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-aside>
      </el-scrollbar>
      <el-main>
        <el-scrollbar class="main" style="height: 100%">
          <router-view id="web-view"></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data (){
      return {
        userName: '',
        menuList: this.$router.options.routes.slice(2)
      }
    },
    mounted (){
      this.userName = localStorage.getItem('yyq_zss_admin_user_name')
      this.getFirstArea()
      this.getLanguagePair()
    },
    methods: {
      ...mapActions([
        'firstArea',
        'languagePair'
      ]),
      // 获取一级领域
      getFirstArea (){
        this.$http.get('/dictionary/domain/listDomain')
          .then(res => {
            if(res.data.message === 'success'){
              this.firstArea(res.data.data)
            }
          })
      },
      // 获取语言对
      getLanguagePair (){
        this.$http.get('/dictionary/language/listAll')
          .then(res => {
            if(res.data.message === 'success'){
              this.languagePair(res.data.data)
            }
          })
      },
      //退出登录
      logout (){
        this.$message({
          type: 'success',
          message: '退出成功'
        })
        setTimeout(() => {
          this.$router.push('/')
          localStorage.removeItem('yyq_zss_admin_access_token')
        },800)
      }
    }
  }
</script>
<style lang="scss">
@import "../style/layout";
</style>
