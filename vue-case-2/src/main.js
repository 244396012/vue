/*
* 单页面主入口main.js文件
* author：zhaoyong
* email：244396012@qq.com
* date: 2018-11-20
* */
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import App from './App'
import router from './router'
import store from './store'
/*
* 引入element-ui，并全局注册
* */
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)
/*
* 引入editor，并全局注册
* */
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
/*
* 引入api
* */
import api from './api'
/*
* 引入公共request方法，并全局注册
* */
import req from './common'
Vue.use(req)
/*
* 基本设置
* */
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
/*
* axios设置
* */
axios.defaults.baseURL = api.host + ':'+ api.port
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.timeout = 20000
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true

//携带access_token
axios.interceptors.request.use(
  req => {
    const ACCESS_TOKEN = localStorage.getItem('yyq_zss_admin_access_token')
    // 登录时不需要token
    if(ACCESS_TOKEN && !req.url.includes('/oauth/token')){
      req.headers.common['Authorization'] = 'Bearer ' + ACCESS_TOKEN
    }
    return req
  },
  err => {
    return Promise.reject(err)
  }
)
/*
* 处理token过期，返回登录
* */
axios.interceptors.response.use(
  res => {

    return res
  },
  err => {
    if(err.response.status === 401
      && (err.response.data.error === 'invalid_token' || err.response.data.error === 'unauthorized')){
      Element.Message({
        type: 'error',
        message: '登录信息已过期，重新登录'
      })
      router.replace({
        path: '/',
        query: { url: router.history.current.fullPath }
      })
    }
    return Promise.reject(err)
  }
)
/*
* 监听router路由变化，设置参数
* */
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})


/*
* 挂载实例
* */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
