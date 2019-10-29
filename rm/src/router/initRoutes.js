import layout from '@/page/layout'

const routes = [
  //outside
  {
    path: '/pm/translatorDetail/:id',
    meta: { title: '译员详情' },
    component: resolve => require(['@/page/outsideModule/detail'], resolve)
  },
  //404
  {
    path: '*',
    meta: { title: '页面不存在' },
    component: resolve => require(['@/page/404'], resolve)
  },
  //登录
  {
    path: '/login',
    meta: {title: '账号登录'},
    component: () => import(/* webpackChunkName: 'login' */'@/page/login')
  },
  //首页
  {
    path: '/',
    meta: { title: '首页' },
    component: layout,
    children: [
      {
        path: '/',
        name: '首页',
        component: resolve => require.ensure([], () => resolve(require('@/page/index')), 'index')
      }
    ]
  }
];

export default routes;
