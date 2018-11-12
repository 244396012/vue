<template>
  <el-container>
    <el-header>
      <el-row :gutter="24">
        <el-col :span="8" class="col-8">
          <h3 class="grid-content bg-purple">工程技术标准服务平台</h3>
        </el-col>
        <el-col :span="7" class="col-10">
          <div class="grid-content bg-purple">
            <div>
              <el-input placeholder="请输入标准号或标准名称关键词"
                        class="search-text"
                        v-model="searchTxt"
                        @keyup.enter.native="searchFn"></el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="col-2">
          <div class="grid-content bg-purple">
            <el-button type="primary" class="search-btn" @click.native="searchFn">检索</el-button>
            <el-button class="high-search-btn" @click.native="highSearchFn">高级检索</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="270px">
        <!--标准数据库-->
        <div class="aside-item">
          <div class="aside-title db">标准数据库</div>
          <div class="aside-list"><router-link :to="'/sort'" >国外标准·分类</router-link></div>
          <div class="aside-list"><router-link :to="'/sort-ics'" >ICS·分类</router-link></div>
          <div class="aside-list"><router-link :to="'/sort-css'" >CSS·分类</router-link></div>
        </div>
        <!--个人中心-->
        <div class="aside-item">
          <div class="aside-title user">个人中心</div>
          <div class="aside-list"><router-link :to="'/user-vip'" >会员详情</router-link></div>
          <div class="aside-list"><router-link :to="'/user-open-vip'" >会员开通</router-link></div>
          <div class="aside-list"><router-link :to="'/user-cart'" >意向清单</router-link></div>
          <div class="aside-list"><router-link :to="'/user-application'" >我的申请</router-link></div>
          <div class="aside-list"><router-link :to="'/user'" >个人信息</router-link></div>
        </div>
        <div class="logout" v-if="account">
          <span>{{account.mbAccount}}，</span>
          <a href="javascript:" @click="logout">退出</a>
        </div>
      </el-aside>
      <el-main>
        <router-view id="test"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Main',
  data (){
    return {
      searchTxt: ''
    }
  },
  computed: {
    ...mapGetters({
      account: 'showUserInfo'
    })
  },
  mounted (){
    this.getUserInfo()
  },
  methods: {
    ...mapActions([
      'showUserInfo'
    ]),
    /* 退出登录 */
    logout (){
      this.$ajax.get('/logout')
        .then(data => {
          if(data.data.status === 'success'){
            this.showUserInfo(null)
            localStorage.removeItem('storage_userInfo_')
            sessionStorage.removeItem('storage_userCart_')
            this.$router.push('/login')
          }else{
            this.$message({ message:data.data.msg, type:'error' })
          }
        })
    },
    /* 获取用户信息 */
    getUserInfo (){
      this.$ajax.get('/member/info')
        .then(res => {
          if(!res.request.responseURL.includes('/login')){
            this.showUserInfo(res.data)
          }
        })
    },
    searchFn (){
      if(this.searchTxt.trim() === ''){
        this.$message({
          showClose: true,
          center: true,
          message: '请输入搜索内容',
          type: 'warning'
        })
        return
      }
      this.$router.push({path:'/search',query:{txt:this.searchTxt}})
    },
    highSearchFn (){
      this.$router.push({path:'/high-search'})
    }
  }
}
</script>
<style lang="scss">
@import "../style/main";
</style>
<style lang="scss" scoped>
  .logout{
    padding: 15px 25px;
    font-size: 13px;
    span{
      color: #848484;
    }
    a{
      color: #00a0e9;
      text-decoration: none;
    }
  }
</style>
