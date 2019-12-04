import layout from '@/page/layout'

const routes = [
  //out-module
  {
    path: '/pm/translatorDetail/:id',
    meta: { title: '译员详情' },
    component: () => import(/* webpackChunkName: 'outModule' */'@/page/outsideModule/detail')
  },
  //404
  {
    path: '*',
    meta: { title: '页面不存在' },
    component: () => import(/* webpackChunkName: 'login' */'@/page/404')
  },
  //登录
  {
    path: '/',
    meta: {title: '用户登录'},
    component: () => import(/* webpackChunkName: 'login' */'@/page/login')
  },
  //消息通知
  {
    path: '/message',
    meta: { title: '消息通知' },
    component: layout,
    children: [
      {
        path: '/message',
        name: '消息通知',
        component: resolve => require.ensure([], () => resolve(require('@/page/message/entry')), 'message'),
        children: [
          {
            path: '/message',
            meta: { title: '消息通知列表' },
            component: resolve => require.ensure([], () => resolve(require('@/page/message/index')), 'message')
          }
        ]
      }
    ]
  },
  //首页
  {
    path: '/home',
    meta: { title: '首页' },
    component: layout,
    children: [
      {
        path: '/home',
        name: '首页',
        meta: { title: '首页' },
        component: resolve => require.ensure([], () => resolve(require('@/page/index')), 'index')
      }
    ]
  }
];

export default routes;
