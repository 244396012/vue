import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/*
* layout：母版页
* */
import layout from '@/page/layout'

const routes = new Router({
  routes: [
    {
      path: '*',
      meta: { title: '404 页面不存在' },
      component: resolve => require(['@/page/404'], resolve)
    },
    {
      path: '/login',
      meta: {title: '账号登录'},
      component: () => import(/* webpackChunkName: 'login' */'@/page/login')
    },
    //首页
    {
      path: '/',
      name: '首页',
      component: layout,
      redirect: '/',
      children: [
        {
          path: '/',
          meta: { title: '首页' },
          component: resolve => require.ensure([], () => resolve(require('@/page/index')), 'index')
        }
      ]
    },
    //在线测试管理
    {
      path: '/onlineTest',
      name: '试题管理',
      component: layout,
      redirect: '/onlineTest/choice',
      children: [
        {
          path: '/onlineTest/choice',
          name: '选择题管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/entry')), 'onlineTest'),
          children: [
            {
              path: '/onlineTest/choice',
              meta: { title: '选择题管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/choice/index')), 'onlineTest')
            },
            {
              path: '/onlineTest/choice/create',
              meta: { title: '新建试题' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/choice/create')), 'onlineTest')
            },
            {
              path: '/onlineTest/choice/update',
              meta: { title: '修改试题' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/choice/create')), 'onlineTest')
            },
            {
              path: '/onlineTest/choice/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/choice/detail')), 'onlineTest')
            }
          ]
        },
        {
          path: '/onlineTest/trans',
          name: '翻译题管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/entry')), 'onlineTest'),
          children: [
            {
              path: '/onlineTest/trans',
              meta: { title: '翻译题管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/translation/index')), 'onlineTest')
            },
            {
              path: '/onlineTest/trans/create',
              meta: { title: '新建试题' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/translation/create')), 'onlineTest')
            },
            {
              path: '/onlineTest/trans/update',
              meta: { title: '修改试题' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/translation/create')), 'onlineTest')
            },
            {
              path: '/onlineTest/trans/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTest/translation/detail')), 'onlineTest')
            }
          ]
        }
      ]
    },
    //在线测试结果管理
    {
      path: '/onlineTestResult',
      name: '评估结果管理',
      component: layout,
      children: [
        {
          path: '/onlineTestResult/choice',
          name: '选择题评估',
          component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/entry')), 'onlineTestResult'),
          children: [
            {
              path: '/onlineTestResult/choice',
              meta: { title: '选择题评估' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/choice/index')), 'onlineTestResult')
            },
            {
              path: '/onlineTestResult/choice/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/choice/detail')), 'onlineTestResult')
            }
          ]
        },
        {
          path: '/onlineTestResult/trans',
          name: '翻译题评估',
          component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/entry')), 'onlineTestResult'),
          children: [
            {
              path: '/onlineTestResult/trans',
              meta: { title: '审核清单' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/index')), 'onlineTestResult')
            },
            {
              path: '/onlineTestResult/trans/verify/:id',
              meta: { title: '审核' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/verify')), 'onlineTestResult')
            },
            {
              path: '/onlineTestResult/trans/detail/:id',
              meta: { title: '审核结果' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/detail')), 'onlineTestResult')
            }
          ]
        },
        {
          path: '/onlineTestResult/assign',
          name: '分配审核人',
          component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/entry')), 'onlineTestResult'),
          children: [
            {
              path: '/onlineTestResult/assign',
              meta: { title: '分配审核人' },
              component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/assign/index')), 'onlineTestResult')
            }
          ]
        },
      ]
    },
    //译员管理
    {
      path: '/interpreter',
      name: '译员管理',
      component: layout,
      children: [
        {
          path: '/interpreter/fullTime',
          name: '专职译员管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/entry')), 'interpreter'),
          children: [
            {
              path: '/interpreter/fullTime',
              meta: { title: '专职译员管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/fullTime/index')), 'interpreter')
            },
            {
              path: '/interpreter/fullTime/detail/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/fullTime/detail')), 'interpreter')
            }
          ]
        },
        {
          path: '/interpreter/partTime',
          name: '兼职译员管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/entry')), 'interpreter'),
          children: [
            {
              path: '/interpreter/partTime',
              meta: { title: '译员列表' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/partTime/index')), 'interpreter')
            },
            {
              path: '/interpreter/prePartTime',
              meta: { title: '准译员列表' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/partTime/preIndex')), 'interpreter')
            },
            {
              path: '/interpreter/partTime/create/',
              meta: { title: '绿色通道译员添加' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/partTime/create')), 'interpreter')
            },
            {
              path: '/interpreter/partTime/detail/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/interpreter/partTime/detail')), 'interpreter')
            }
          ]
        }
      ]
    },
    //文章管理
    {
      path: '/article',
      name: '文章管理',
      component: layout,
      children: [
        {
          path: '/article/interpreter',
          name: '译员文章管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/article/entry')), 'article'),
          children: [
            {
              path: '/article/interpreter',
              meta: { title: '译员文章管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/interpreter/index')), 'article')
            },
            {
              path: '/article/interpreter/label',
              meta: { title: '标签管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/interpreter/label')), 'article')
            },
            {
              path: '/article/interpreter/detail/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/interpreter/detail')), 'article')
            },
            {
              path: '/article/interpreter/reply/:id',
              meta: { title: '回复详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/detai_reply')), 'article')
            }
          ]
        },
        {
          path: '/article/official',
          name: '官方文章管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/article/entry')), 'article'),
          children: [
            {
              path: '/article/official',
              meta: { title: '官方文章管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/official/index')), 'article')
            },
            {
              path: '/article/official/release',
              meta: { title: '发布文章' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/official/release')), 'article')
            },
            {
              path: '/article/official/detail/:id',
              meta: { title: '详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/official/detail')), 'article')
            },
            {
              path: '/article/official/reply/:id',
              meta: { title: '回复详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/article/detai_reply')), 'article')
            }
          ]
        }
      ]
    },
    //运营管理
    {
      path: '/operation',
      name: '运营管理',
      component: layout,
      children: [
        {
          path: '/operation/activity',
          name: '活动管理',
          component: resolve => require.ensure([], () => resolve(require('@/page/operation/entry')), 'operation'),
          children: [
            {
              path: '/operation/activity',
              meta: { title: '活动管理' },
              component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/index')), 'article')
            },
            {
              path: '/operation/activity/create',
              meta: { title: '创建活动' },
              component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/create')), 'article')
            },
            {
              path: '/operation/activity/detail/:id',
              meta: { title: '活动详情' },
              component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/detail')), 'article')
            }
          ]
        }
      ]
    }
  ]
})

export default routes
