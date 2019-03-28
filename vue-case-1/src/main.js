/*
* 单页面主入口js文件
* author：zhaoyong
* date: 2018-10-12
* */
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import App from './App'
import router from './router'
import store from './store'
import api from './api'

//引用element-ui框架
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//设置
Vue.config.productionTip = false
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
/*
* axios 配置
* */
axios.defaults.baseURL = api.host +':'+ api.port
axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
/*
* response拦截器，如果登录信息过期，则跳回登录页
* */
axios.interceptors.response.use(function (response) {
  if (response.request.responseURL.includes('/login') &&
      !router.history.current.fullPath.includes('/login')){
    Element.Message.warning({
      message: '请先登录'
    })
    localStorage.removeItem('storage_userInfo_')
    sessionStorage.removeItem('storage_userCart_')
    store.state.account = null
    router.replace({
      path: '/login',
      query: {redirect: router.currentRoute.fullPath}
    })
  }
  return response
})

//Vue全局使用element-ui
Vue.use(Element)

router.beforeEach((to, from ,next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  /* 判断该路由是否需要登录权限 */
  if (to.matched.some(record => record.meta.requireAuth)){
    console.log('需要登录')
    Element.Message.warning({
      message: '请先登录',
      center: true
    })
    if (localStorage.token) { // 判断当前的token是否存在: 登录存入的token
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else{
    next()
  }
})

/* 挂载Vue实例 */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
