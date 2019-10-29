<template>
  <el-container class="wrap">
    <el-header height="70px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <img src="../../static/image/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <span class="rm-icon-two work" @click="goPlatFrom">工作台</span>
          <!--<span class="rm-icon-two message" @click="">消息通知</span>-->
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
              :default-active="this.activeIndex"
              text-color="#333">
              <template v-for="(menu, index) in asideMenu">
                  <el-submenu v-if="menu.path !== '/'" :key="index" :index="String(index)">
                    <span slot="title">{{menu.name}}</span>
                    <template v-for="(menu1, index1) in menu.children">
                      <el-menu-item :key="index+'-'+index1" :index="menu1.path">{{menu1.name}}</el-menu-item>
                    </template>
                  </el-submenu>
                <el-menu-item class="exact" v-else :key="index" :index="menu.path">
                  <span slot="title">{{menu.meta.title}}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-aside>
        <div style="height: 15px"></div>
      </el-scrollbar>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="extra">资源管理系统</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.firstItem">{{breadcrumb.firstItem}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.secondItem">{{breadcrumb.secondItem}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view id="webView" :key="breadKey"></router-view>
      </el-main>
    </el-container>
    <el-footer>
      &copy; 数译科技 {{new Date().getFullYear()>2019 ? '2019-'+new Date().getFullYear() : new Date().getFullYear()}}
      <a class="beian" href="http://www.beian.miit.gov.cn" target="_blank" rel="nofollow"> 蜀ICP备14015776号</a>
    </el-footer>
    <personal-info></personal-info>
    <change-pwd></change-pwd>
  </el-container>
</template>
<script>
  import personalInfo from '@/components/personalInfo';
  import changePwd from '@/components/changePwd';
  import utils from '@/utils';
  import api from '@/api';
  export default {
    name: 'layout',
    components: {
      'personal-info': personalInfo,
      'change-pwd': changePwd
    },
    data (){
      return {
        asideMenu: this.$router.options.routes.slice(3),
        activeIndex: '',
        breadcrumb: ''
      }
    },
    updated (){
      //组件更新时，动态设置左侧导航active
      this.activeIndex = this.$route.matched[1].path
    },
    created (){
      //获取语言对
      this.$http.get('/language/listAll')
        .then(res => {
          if(res.data.data.length > 0){
            this.$store.commit('languageList', res.data.data)
          }
        });
      //获取一级领域
      this.$http.get('/domain/listDomain')
        .then(res =>{
          if(res.data.message === 'success'){
            this.$store.commit('fieldList', res.data.data)
          }
        });
      this.$nextTick(() => {
        // const throttle = utils.throttle;
        // const asideEl = document.querySelector('.el-aside.aside'),
        //   mainEl = document.querySelector('.el-main');
        // let scroll = 0,
        //   clientHeight = document.body.clientHeight,
        //   bodyHeight = document.body.scrollHeight;
        // window.onscroll = throttle(function () {
        //   scroll = document.documentElement.scrollTop || document.body.scrollTop;
        //   if(scroll > 70){
        //     asideEl.classList.add('fixed');
        //     mainEl.classList.add('fixed');
        //     if(bodyHeight - (scroll+clientHeight) <= 50){
        //       asideEl.classList.add('btm');
        //     }else{
        //       asideEl.classList.remove('btm');
        //     }
        //   }else{
        //     asideEl.classList.remove('fixed');
        //     mainEl.classList.remove('fixed');
        //   }
        // }, 30);
      })
    },
    computed: {
      //为 router-view 添加唯一的标识‘key’，用来监听路由变化设置面包屑
      breadKey (){
        this.breadcrumb = utils.breadcrumb(this.$route)
      }
    },
    methods: {
      //退出
      logout (){
        sessionStorage.removeItem('sy_rm_admin_access_token');
        sessionStorage.removeItem('sy_rm_admin_permission');
        this.$router.push('/login')
      },
      //跳转到工作台
	    goPlatFrom (){
		    location.href = api.platFormUrl+'?token='+sessionStorage.getItem('sy_rm_admin_access_token')
	    }
    }
  }
</script>
