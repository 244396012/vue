<template>
  <el-container class="wrap">
    <el-header height="70px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <a href="http://freelancer.lan-bridge.cn">
              <img src="../../static/image/logo.png" alt="">
            </a>
          </div>
        </el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <span class="rm-icon-two work" @click="goPlatFrom">工作台</span>
          <el-badge :value="$store.state.noReadMsg" class="item">
            <span class="rm-icon-two message" @click="$router.push('/message')">消息通知</span>
          </el-badge>
          <el-dropdown>
            <span class="el-dropdown-link rm-icon-two user">个人中心</span>
            <el-dropdown-menu slot="dropdown" class="account">
              <el-dropdown-item @click.native="$store.commit('showModalInfo')">帐号信息</el-dropdown-item>
              <el-dropdown-item @click.native="$store.commit('showModalPwd')">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-scrollbar class="el-aside aside" style="width:160px;">
        <div style="height: 15px"></div>
        <el-aside width="160px">
            <el-menu
              router
              :default-active="this.activeIndex"
              text-color="#333">
              <template v-for="(menu, index) in asideMenu">
                  <el-menu-item v-if="menu.path === '/home'" class="exact" :key="index" :index="menu.path">
                    <span slot="title">{{menu.meta.title}}</span>
                  </el-menu-item>
                  <el-submenu v-else :key="index" :index="String(index)">
                    <span slot="title">{{menu.name}}</span>
                    <template v-for="(menu1, index1) in menu.children">
                      <el-menu-item :key="index+'-'+index1" :index="menu1.path">{{menu1.name}}</el-menu-item>
                    </template>
                  </el-submenu>
              </template>
            </el-menu>
          </el-aside>
        <div style="height: 15px"></div>
      </el-scrollbar>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="extra">资源管理系统</el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="breadcrumb.firstItem"
            v-html="breadcrumb.firstItem"
            @click.native="breadRouter"></el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="breadcrumb.secondItem">{{breadcrumb.secondItem}}</el-breadcrumb-item>
        </el-breadcrumb>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="breadKey"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="breadKey"></router-view>
      </el-main>
    </el-container>
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
        pollTimer: null,
        asideMenu: this.$router.options.routes.slice(4),
        activeIndex: '',
        breadcrumb: ''
      }
    },
    updated (){
      //组件更新时，动态设置左侧导航active
      this.activeIndex = this.$route.matched[1].path
    },
    created (){
      this.$store.dispatch('getLanguagePair');
      this.$store.dispatch('getFirstDomain');
      this.$store.dispatch('getSecondPermission');
    },
    mounted (){
      const _this = this;
      this.getWaitingMsg();
      //连接socket
      utils.connectSocket(api.baseURL + '/gs-guide-websocket', (res) => {
        if(res){
          const resJson = JSON.parse(res);
          if(resJson){
            setTimeout(() => {
              _this.getWaitingMsg()
            }, 5000)
          }
        }
      })
    },
    computed: {
      //为 router-view 添加唯一的标识‘key’，用来监听路由变化设置面包屑
      breadKey (){
        this.breadcrumb = utils.breadcrumb(this.$route)
      }
    },
    methods: {
      //面包屑
      breadRouter (event){
        const target = event.target,
          path = target.getAttribute('data') || '',
          type = target.getAttribute('type') || '';
        if(path && type && this.$route.path.includes('/skill/detail')){
            this.$router.back()
        }else{
          this.$router.push(path)
        }
      },
      //退出
      logout (){
        window.name = '';
        sessionStorage.removeItem('sy_rm_admin_access_token');
        sessionStorage.removeItem('sy_rm_admin_permission');
        this.$router.push('/')
      },
      //获取未读消息
      getWaitingMsg (){
        this.$http.get('/notice/getNoReadCount',{
          params: {
            status: 0
          }
        }).then(res => {
          if(res.data.message === 'success'){
            this.$store.state.noReadMsg = +res.data.data ? res.data.data : '';
          }
        })
      },
      //跳转到工作台
	    goPlatFrom (){
        const a = document.createElement('a'),
          token = sessionStorage.getItem('sy_rm_admin_access_token');
        a.style.display = 'none';
        a.href = api.platFormUrl;
        a.target = token;
        document.body.appendChild(a);
        a.click();
	    }
    }
  }
</script>
