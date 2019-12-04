import Vue from 'vue'
import Router from 'vue-router'
import initRoutes from '@/router/initRoutes'

Vue.use(Router);

//处理NavigationDuplicated
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

//全局重写addRoutes方法，防止Duplicate named routes definition报错
Router.prototype.$addRoutes = (params) => {
  router.matcher = new Router().matcher;
  router.addRoutes(params)
};

const router = new Router({
  routes: initRoutes
});

export default router
