<template>
  <el-container class="wrap">
    <el-header height="70px">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">LOGO</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <span class="rm-icon-two work" @click="goPlatFrom">工作台</span>
          <span class="rm-icon-two message" @click="">消息通知</span>
          <el-dropdown>
            <span class="el-dropdown-link rm-icon-two user">个人中心</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$store.commit('showModalInfo')">帐号信息</el-dropdown-item>
              <el-dropdown-item @click.native="$store.commit('showModalPwd')">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-scrollbar class="el-aside aside" style="width:200px;">
        <div style="height: 15px"></div>
        <el-aside width="200px">
            <el-menu
              router
              :default-active="$route.path"
              text-color="#333">
              <template v-for="(menu, index) in asideMenu">
                  <el-submenu v-if="menu.path !== '/'" :key="index" :index="String(index)">
                    <span slot="title">{{menu.name}}</span>
                    <template v-for="(menu1, index1) in menu.children">
                      <el-menu-item :key="index+'-'+index1" :index="menu1.path">{{menu1.name}}</el-menu-item>
                    </template>
                  </el-submenu>
                <el-menu-item class="exact" v-else :key="index" :index="menu.path">
                  <span slot="title">{{menu.name}}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-aside>
        <div style="height: 15px"></div>
      </el-scrollbar>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="extra">RM后台管理</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.firstItem">{{breadcrumb.firstItem}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.secondItem">{{breadcrumb.secondItem}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view id="webView" :key="key"></router-view>
      </el-main>
    </el-container>
    <el-footer>&copy; 数译科技 版权所有 {{new Date().getFullYear()>2019 ? '2019-'+new Date().getFullYear() : new Date().getFullYear()}}</el-footer>
    <personal-info></personal-info>
    <change-pwd></change-pwd>
  </el-container>
</template>
<script>
  import {mapMutations} from 'vuex'
  import personalInfo from '@/components/personalInfo'
  import changePwd from '@/components/changePwd'
  import utils from '@/utils'
  export default {
    name: 'layout',
    components: {
      'personal-info': personalInfo,
      'change-pwd': changePwd
    },
    data (){
      return {
        asideMenu: this.$router.options.routes.slice(2),
        breadcrumb: ''
      }
    },
    created (){
      this.getLanguageList()
    },
    computed: {
      //为 router-view 添加唯一的标识‘key’，用来监听路由变化设置面包屑
      key (){
        this.breadcrumb = utils.breadcrumb(this.$route)
      }
    },
    methods: {
      ...mapMutations([
        'languageList'
       ]),
      //获取语言
      getLanguageList (){
        this.$http.get('/language/listAll')
          .then(res => {
            if(res.data.code === '200' && res.data.data.length > 0){
              this.languageList(res.data.data)
            }
          })
      },
      //跳转到工作台
	    goPlatFrom (){
		    location.href = 'http://192.168.0.6:3010?tk='+localStorage.getItem('sy_rm_admin_access_token')
	    },
      //退出
      logout (){
        localStorage.removeItem('sy_rm_admin_access_token');
        this.$router.push('/login')
      }
    }
  }
</script>
