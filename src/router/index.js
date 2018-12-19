import Vue from 'vue'
import Router from 'vue-router'
/*
* 主组件：包括搜索、左侧导航
* */
import Main from '@/components/Main'
/*
* Sort：国外标准分类
* SortIcs：Ics分类
* SortCss：Css分类
* SortList：分类标签列表
* Detail：内容详情
* */
import Sort from '../page/sort/Index'
import SortIcs from '../page/sort/SortIcs'
import SortCss from '../page/sort/SortCss'
import SortList from '../page/sort/SortList'
import Detail from '../page/sort/Detail'
/*
* User：个人信息
* ChangePwd：修改密码
* Cart：意向清单
* Vip：会员详情
* VipPoint：会员积分
* OpenVip：开通会员
* Application：我的申请
* */
import User from '../page/user/Index'
import ChangePwd from '../page/user/ChangePwd'
import Cart from '../page/user/Cart'
import CartDone from '../page/user/CartDone'
import Vip from '../page/user/Vip'
import VipPoint from '../page/user/VipScore'
import OpenVip from '../page/user/OpenVip'
import Application from '../page/user/Application'
import ApplicationDoing from '../page/user/ApplicationDoing'
import ApplicationDone from '../page/user/ApplicationDone'
import ApplicationCancel from '../page/user/ApplicationCancel'


Vue.use(Router)

const router = new Router({
 // mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '*',
      component: resolve => require(['@/page/404'],resolve),
      meta:{title:'404 页面不存在'}
    },
	{
      path: '/',
      name: 'index',
      redirect:'/login'
    },
	{
	  path: '/login',
	  name:'login',
	  component: resolve => require(['@/page/Login'],resolve),
	  meta: {title: '登录帐号'}
	},
	{
	  path: '/register',
	  component: resolve => require(['@/page/Register'],resolve),
	  meta: {title: '注册帐号'}
	},
	{
	  path: '/forget',
	  component: resolve => require(['@/page/Forget'],resolve),
	  meta: {title: '忘记密码'}
	},
    {
      path: '/search',
      name: 'search',
      component: Main,
      children: [
        /*
         * search: 普通搜索
         * high-search: 高级搜索
         * /search/detail/: 搜索详情
         * */
        {
          path: '/search',
          component: resolve => require(['@/page/search/Search'],resolve),
          meta: { title: '普通搜索'}
        },
        {
          path: '/high-search',
          component: resolve => require(['@/page/search/HighSearch'],resolve),
          meta: {title: '高级搜索'}
        },
        {
          path: '/search/detail/:id',
          component: Detail,
          meta: {title: '搜索详情'}
        }
      ]
    },
    {
      path: '/sort',
      name: 'sort',
      component: Main,
      children:[
        {
          path: '/sort',
          component: Sort,
          meta: {title: '国外标准分类'}
        },
        {
          path: '/sort-ics',
          component: SortIcs,
          meta: {title: 'ICS分类'}
        },
        {
          path: '/sort-css',
          component: SortCss,
          meta: {title: 'CSS分类'}
        },
        {
          path: '/sort/:id',
          component: SortList
        },
        {
          path: '/sort-ics/:id',
          component: SortList
        },
        {
          path: '/sort-css/:id',
          component: SortList
        },
        {
          path: '/sort/detail/:id',
          component: Detail
        },
        {
          path: '/sort-ics/detail/:id',
          component: Detail
        },
        {
          path: '/sort-css/detail/:id',
          component: Detail
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: Main,
      meta: {
        // requireAuth: true
      },
      children: [
        {
          path: '/user',
          component: User,
          meta: {title: '个人信息'}
        },
        {
          path: '/user/change-pwd',
          component: ChangePwd,
          meta: {title: '修改密码'}
        },
        {
          path: '/user-vip',
          component: Vip,
          meta: {title: '会员详情'}
        },
        {
          path: '/user-vip/points',
          component: VipPoint,
          meta: {title: '积分明细'}
        },
        {
          path: '/user-open-vip',
          component: OpenVip,
          meta: {title: '会员开通'}
        },
        {
          path: '/user-cart',
          component: Cart,
          meta: {title: '待保存意向清单'}
        },
        {
          path: '/user-cart/user-cart-done',
          component: CartDone,
          meta: {title: '已保存意向清单'}
        },
        {
          path: '/user-application',
          component: Application,
          meta: {title: '待处理申请'}
        },
        {
          path: '/user-application/doing',
          component: ApplicationDoing,
          meta: {title: '处理中申请'}
        },
        {
          path: '/user-application/done',
          component: ApplicationDone,
          meta: {title: '已完成申请'}
        },
        {
          path: '/user-application/cancel',
          component: ApplicationCancel,
          meta: {title: '已取消申请'}
        }
      ]
    }
  ]
})

export default router

