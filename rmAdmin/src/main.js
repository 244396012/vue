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
Vue.prototype.getEle = function (str) {
  if(typeof(str) === 'string'){
    return document.querySelector(str)
  }
  return str
};
//重置form参数
Vue.prototype.resetForm = function (params) {
  if(typeof params === 'undefined' || params === null){
    return params;
  }
  if(typeof params === 'object'
    && (Object.prototype.toString.call(params) === '[object Object]'
      || Object.prototype.toString.call(params) === '[object Array]')){
    for(let prop in params){
      if(typeof params[prop] === 'object'){
        params[prop] = Array.isArray(params[prop]) ? [] : {}
      }else{
        params[prop] = ''
      }
    }
  }
  store.state.resetSearchState = true
};

/*
* axios设置
* */
axios.defaults.baseURL = api.baseRMURL;
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = false;
axios.defaults.crossDomain = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

/*
* 监听router，设置页面相关参数
* */

router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title;
  }
  next()
});

//keep-alive，某些列表页面，添加状态缓存，进入详情页返回后，保持原状态
Vue.mixin({
  beforeRouteLeave: function(to, from, next) {
    if(to.meta['keepAlive'] !== undefined){
      if(from.path.includes(to.path) && to.path !== from.path){
        to.meta.keepAlive = true;
      }else{
        if(this.form && typeof(this.form) === 'Object'){
          this.resetForm(this.form)
        }
      }
    }
    next()
  }
});

/*
* request拦截器
* */
axios.interceptors.request.use(
  req => {
    let reqUrl = req.url;
    if(reqUrl.includes('/oauth/token') || reqUrl.includes('/auth/current')){
      req.url = api.baseURL + reqUrl
    }
    if(reqUrl.includes('customer/renewPassword') || reqUrl.includes('/module/getMenue')){
      req.url = api.baseLgURL + reqUrl
    }
    const ACCESS_TOKEN = sessionStorage.getItem('sy_rm_admin_access_token');
    //外部模块，不需要本地token
    if(!router.history.current.fullPath.includes('/pm/translatorDetail')){
      // 登录时不需要token
      if(ACCESS_TOKEN && !reqUrl.includes('/oauth/token')){
        req.headers.common['Authorization'] = 'bearer ' + ACCESS_TOKEN
      }
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
    Vue.prototype.getEle('.el-message.el-message--error')
    && Vue.prototype.getEle('.el-message.el-message--error').remove();
    if(err.response.status === 401){
      if(err.response.data.error === 'invalid_token'){
        element.Message({
          type: 'error',
          message: '登录信息已过期'
        })
      }else{
        element.Message({
          type: 'error',
          message: err.response.data.error
        })
      }
      sessionStorage.removeItem('sy_rm_admin_access_token');
      sessionStorage.removeItem('sy_rm_admin_permission');
      if(router.history.current.path !== '/'){
        //外部模块，登录过期不重定向
        if(router.history.current.fullPath.includes('/pm/translatorDetail')){
          router.replace({
            path: '/'
          });
          return Promise.reject(err)
        }
        router.replace({
          path: '/',
          query: { url: router.history.current.fullPath }
        })
      }
    }else if(err.response.status >= 500){
      element.Message({
        type: 'error',
        message: '服务器内部错误'
      })
    }
    return Promise.reject(err)
  }
);

/*
* 登录时，sessionStorage存储permission列表
* 调用本地permission（刷新页面时）
* */
import initRoutes from '@/router/initRoutes';
import dynamicRoutes from '@/router/routes';

const sessionPermission = JSON.parse(sessionStorage.getItem('sy_rm_admin_permission')) || '';
if(sessionPermission){
  router.options.routes = initRoutes;
  const matchedRoutes = Vue.prototype.matchPermission(dynamicRoutes, sessionPermission) || [];
  router.options.routes = router.options.routes.concat(matchedRoutes);
  router.$addRoutes(router.options.routes);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
