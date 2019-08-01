/*
* 主入口main.js文件
* author：zhaoyong
* date: 2018-12-01
* */

/*
* element-ui、axios、qs、vuex
* */
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/main.scss'
import './style/page.scss'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import axios from 'axios'
import qs from 'qs'
//引入公共模块common
import common from './common'
//引入api
import api from './api'

Vue.use(common);
Vue.use(element);

/*
* Vue全局设置
* */
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
/*
* axios设置
* */
axios.defaults.baseURL = api.baseRMURL;
axios.defaults.timeout = 20000;
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

/*
* 监听router，设置页面相关参数
* */
router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
});
/*
* request拦截器
* */
axios.interceptors.request.use(
  req => {
    if(req.url.includes('/oauth/token')){
      req.url = api.baseURL + '/auth/oauth/token'
    }else if(req.url.includes('customer/renewPassword')){
      req.url = api.baseLgURL + '/customer/renewPassword'
    }
    const ACCESS_TOKEN = localStorage.getItem('sy_rm_admin_access_token');
    // 登录时不需要token
    if(ACCESS_TOKEN && !req.url.includes('/oauth/token')){
      req.headers.common['Authorization'] = 'bearer ' + ACCESS_TOKEN
    }
    return req
  },
  err => {
    return Promise.reject(err)
  }
);
/*
* response拦截器
* */
axios.interceptors.response.use(
  res => {
    return res
  },
  err => {
    if(err.response.status === 401
      && (err.response.data.error === 'unauthorized' || err.response.data.error === 'invalid_token')){
      element.Message({
        type: 'error',
        message: '登录信息已过期，请重新登录'
      });
      localStorage.removeItem('sy_rm_admin_access_token');
      router.replace({
        path: '/login',
        query: { url: router.history.current.fullPath }
      })
    }
    return Promise.reject(err)
  }
);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
