import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/*
* layout：母版页
* */
import Layout from '@/page/Layout'

const router = new Router({
 // mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '*',
      meta: {title: '404 页面不存在'},
      component: resolve => require(['@/page/404'], resolve)
    },
    {
      path: '/',
      meta: {title: '账号登录'},
      component: resolve => require(['@/page/Login'], resolve)
    },
    // {
    //   path: '/home',
    //   name: '首页',
    //   component: Layout,
    //   children: [
    //     {
    //       path: '/home',
    //       meta: {title: '首页'},
    //       component: resolve => require(['@/page/Home'], resolve)
    //     }
    //   ]
    // },
    {
      path: '/dataMg',
      name: '语料术语管理',
      component: Layout,
      children: [
        // {
        //   path: '/dataMg',
        //   name: '语料文件管理',
        //   meta: {title: '语料文件管理'},
        //   component: resolve => require(['@/page/dataMg/Data'], resolve),
        //   children: [
        //     {
        //       path: '/dataMg',
        //       meta: {title: '语料文件管理'},
        //       component: resolve => require(['@/page/dataMg/data/index'], resolve)
        //     },
        //     {
        //       path: '/dataMg/data/:id',
        //       meta: {title: '查看'},
        //       component: resolve => require(['@/page/dataMg/data/detail'], resolve)
        //     }
        //   ]
        // },
        {
          path: '/dataMg/term',
          name: '术语文件管理',
          meta: {title: '术语文件管理'},
          component: resolve => require(['@/page/dataMg/Term'], resolve),
          children: [
            {
              path: '/dataMg/term',
              meta: {title: '术语文件管理'},
              component: resolve => require(['@/page/dataMg/term/index'], resolve)
            },
            {
              path: '/dataMg/term/:id',
              meta: {title: '查看'},
              component: resolve => require(['@/page/dataMg/term/detail'], resolve)
            }
          ]
        },
        {
          path: '/dataMg/dict',
          name: '专业词典管理',
          meta: {title: '专业词典管理'},
          component: resolve => require(['@/page/dataMg/Dict'], resolve),
          children: [
            {
              path: '/dataMg/dict',
              meta: {title: '专业词典管理'},
              component: resolve => require(['@/page/dataMg/dict/index'], resolve)
            }
          ]
        },
        {
          path: '/dataMg/robot',
          name: '机器抓取库',
          meta: {title: '机器抓取库'},
          component: resolve => require(['@/page/dataMg/Robot'], resolve),
          children: [
            {
              path: '/dataMg/robot',
              meta: {title: '机器抓取库'},
              component: resolve => require(['@/page/dataMg/robot/index'], resolve)
            },
            {
              path: '/dataMg/robot/:id',
              meta: {title: '查看'},
              component: resolve => require(['@/page/dataMg/term/detail'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/cntMg',
      name: '内容管理',
      component: Layout,
      children: [
        {
          path: '/cntMg',
          name: '帖子管理',
          meta: {title: '帖子管理'},
          component: resolve => require(['@/page/cntMg/Note'], resolve),
          children: [
            {
              path: '/cntMg',
              meta: {title: '帖子管理'},
              component: resolve => require(['@/page/cntMg/note/index'], resolve)
            },
            {
              path: '/cntMg/edit/:id',
              meta: {title: '编辑'},
              component: resolve => require(['@/page/cntMg/note/edit'], resolve)
            },
            {
              path: '/cntMg/:id',
              meta: {title: '详情'},
              component: resolve => require(['@/page/cntMg/note/detail'], resolve)
            }
          ]
        }
      ]
    },
    // {
    //   path: '/sysMg',
    //   name: '系统管理',
    //   component: Layout,
    //   children: [
    //     {
    //       path: '/sysMg',
    //       name: '后台用户列表',
    //       meta: {title: '后台用户列表'},
    //       component: resolve => require(['@/page/sysMg/UserList'], resolve)
    //     },
    //     {
    //       path: '/sysMg/user',
    //       name: '角色管理',
    //       meta: {title: '角色管理'},
    //       component: resolve => require(['@/page/sysMg/User'], resolve),
    //       children: [
    //         {
    //           path: '/sysMg/user',
    //           meta: {title: '角色管理'},
    //           component: resolve => require(['@/page/sysMg/user/index'], resolve)
    //         },
    //         {
    //           path: '/sysMg/user/:id',
    //           meta: {title: '权限配置'},
    //           component: resolve => require(['@/page/sysMg/user/setting'], resolve)
    //         }
    //       ]
    //     },
    //     {
    //       path: '/sysMg/log',
    //       name: '操作日志',
    //       meta: {title: '操作日志'},
    //       component: resolve => require(['@/page/sysMg/Log'], resolve)
    //     }
    //   ]
    // }
  ]
})

export default router
