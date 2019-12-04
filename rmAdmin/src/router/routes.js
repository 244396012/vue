import layout from '@/page/layout';
const routes = [
  //在线测试管理
  {
    path: '/onlineTest',
    name: '题库管理',
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
            meta: { title: '选择题管理', keepAlive: true },
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
            meta: { title: '翻译题管理', keepAlive: true },
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
    name: '评估管理',
    component: layout,
    children: [
      {
        path: '/onlineTestResult/choice',
        name: '选择题评估',
        component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/entry')), 'onlineTestResult'),
        children: [
          {
            path: '/onlineTestResult/choice',
            meta: { title: '选择题评估', keepAlive: true },
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
            meta: { title: '翻译题评估', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/index')), 'onlineTestResult')
          },
          {
            path: '/onlineTestResult/trans/verify/:id',
            meta: { title: '审核' },
            component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/verify')), 'onlineTestResult')
          },
          {
            path: '/onlineTestResult/trans/detail/:id',
            meta: { title: '详情' },
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
            meta: { title: '分配审核人', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/assign/index')), 'onlineTestResult')
          },
          {
            path: '/onlineTestResult/assign/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/onlineTestResult/translation/detail')), 'onlineTestResult')
          }
        ]
      },
    ]
  },
  //兼职个人管理
  {
    path: '/parttimeUser',
    name: '个人管理',
    component: layout,
    children: [
      {
        path: '/parttimeUser/resource',
        name: '用户列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/entry')), 'parttimeUser'),
        children: [
          {
            path: '/parttimeUser/resource',
            meta: { title: '用户列表' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/resource/index')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/resource/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/detail')), 'parttimeUser')
          }
        ]
      },
      {
        path: '/parttimeUser/preResource',
        name: '准用户列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/entry')), 'parttimeUser'),
        children: [
          {
            path: '/parttimeUser/preResource',
            meta: { title: '准用户列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/preResource/index')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/preResource/create',
            meta: { title: '绿色通道' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/preResource/create')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/preResource/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/detail')), 'parttimeUser')
          }
        ]
      },
      {
        path: '/parttimeUser/skill',
        name: '技能申请列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/entry')), 'parttimeUser'),
        children: [
          {
            path: '/parttimeUser/skill',
            meta: { title: '笔译技能申请' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/skill/index')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/skill/green',
            meta: { title: '绿色申请列表' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/skill/green')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/skill/other',
            meta: { title: '其他兼职申请' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/skill/other')), 'parttimeUser')
          },
          {
            path: '/parttimeUser/skill/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeUser/detail')), 'parttimeUser')
          }
        ]
      }
    ]
  },
  //兼职团队管理
  {
    path: '/parttimeTeam',
    name: '团队管理',
    component: layout,
    children: [
      {
        path: '/parttimeTeam/team',
        name: '团队列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/entry')), 'parttimeTeam'),
        children: [
          {
            path: '/parttimeTeam/team',
            meta: { title: '团队列表' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/team/index')), 'parttimeTeam')
          },
          {
            path: '/parttimeTeam/team/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/team/detail')), 'parttimeTeam')
          }
        ]
      },
      {
        path: '/parttimeTeam/preTeam',
        name: '准团队列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/entry')), 'parttimeTeam'),
        children: [
          {
            path: '/parttimeTeam/preTeam',
            meta: { title: '准团队列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/team/preIndex')), 'parttimeTeam')
          },
          {
            path: '/parttimeTeam/preTeam/create',
            meta: { title: '创建团队' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/team/create')), 'parttimeTeam')
          },
          {
            path: '/parttimeTeam/preTeam/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/parttimeTeam/team/detail')), 'parttimeTeam')
          }
        ]
      }
    ]
  },
  //资源单
  {
    path: '/resource',
    name: '资源单管理',
    component: layout,
    children: [ //笔译
      {
        path: '/resource/written',
        name: '笔译列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/resource/entry')), 'resource'),
        children: [
          {
            path: '/resource/written',
            meta: { title: '笔译列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/written/index')), 'resource')
          },
          {
            path: '/resource/written/create',
            meta: { title: '新建订单' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/written/create')), 'resource')
          },
          {
            path: '/resource/written/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/written/detail')), 'resource')
          },
          {
            path: '/resource/written/modify/:id',
            meta: { title: '修改' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/written/create')), 'resource')
          },
          {
            path: '/resource/written/assign/:id',
            meta: { title: '分配兼职译员' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assign')), 'resource')
          },
          {
            path: '/resource/written/assign-pm/:id',
            meta: { title: '分配PM' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assignPM')), 'resource')
          }
        ]
      },
      {//会展
        path: '/resource/meeting',
        name: '会展列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/resource/entry')), 'resource'),
        children: [
          {
            path: '/resource/meeting',
            meta: { title: '会展列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/meeting/index')), 'resource')
          },
          {
            path: '/resource/meeting/create',
            meta: { title: '新建订单' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/meeting/create')), 'resource')
          },
          {
            path: '/resource/meeting/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/meeting/detail')), 'resource')
          },
          {
            path: '/resource/meeting/modify/:id',
            meta: { title: '修改' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/meeting/create')), 'resource')
          },
          {
            path: '/resource/meeting/assign/:id',
            meta: { title: '分配兼职译员' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assign')), 'resource')
          },
          {
            path: '/resource/meeting/assign-pm/:id',
            meta: { title: '分配PM' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assignPM')), 'resource')
          }
        ]
      },
      { //外派
        path: '/resource/send',
        name: '外派列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/resource/entry')), 'resource'),
        children: [
          {
            path: '/resource/send',
            meta: { title: '外派列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/send/index')), 'resource')
          },
          {
            path: '/resource/send/create',
            meta: { title: '新建订单' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/send/create')), 'resource')
          },
          {
            path: '/resource/send/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/send/detail')), 'resource')
          },
          {
            path: '/resource/send/modify/:id',
            meta: { title: '修改' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/send/create')), 'resource')
          },
          {
            path: '/resource/send/assign/:id',
            meta: { title: '分配兼职译员' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assign')), 'resource')
          },
          {
            path: '/resource/send/assign-pm/:id',
            meta: { title: '分配PM' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/component/assignPM')), 'resource')
          }
        ]
      },
      {//培训
        path: '/resource/train',
        name: '培训列表',
        component: resolve => require.ensure([], () => resolve(require('@/page/resource/entry')), 'resource'),
        children: [
          {
            path: '/resource/train',
            meta: { title: '培训列表', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/train/index')), 'resource')
          },
          {
            path: '/resource/train/create',
            meta: { title: '新建订单' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/train/create')), 'resource')
          },
          {
            path: '/resource/train/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/train/detail')), 'resource')
          },
          {
            path: '/resource/train/modify/:id',
            meta: { title: '修改' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/train/create')), 'resource')
          },
          {
            path: '/resource/train/assign-pm/:id',
            meta: { title: '分配PM' },
            component: resolve => require.ensure([], () => resolve(require('@/page/resource/train/assignPM')), 'resource')
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
            meta: { title: '译员文章管理', keepAlive: true },
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
            meta: { title: '官方文章管理', keepAlive: true },
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
      },
      {
        path: '/article/message',
        name: '系统消息管理',
        component: resolve => require.ensure([], () => resolve(require('@/page/article/entry')), 'article'),
        children: [
          {
            path: '/article/message',
            meta: { title: '系统消息管理', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/article/message/index')), 'article')
          },
          {
            path: '/article/message/release',
            meta: { title: '发布公告' },
            component: resolve => require.ensure([], () => resolve(require('@/page/article/message/release')), 'article')
          },
          {
            path: '/article/message/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/article/message/detail')), 'article')
          },
          {
            path: '/article/message/modify/:id',
            meta: { title: '修改公告' },
            component: resolve => require.ensure([], () => resolve(require('@/page/article/message/release')), 'article')
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
            meta: { title: '活动管理', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/index')), 'operation')
          },
          {
            path: '/operation/activity/create',
            meta: { title: '创建活动' },
            component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/create')), 'operation')
          },
          {
            path: '/operation/activity/detail/:id',
            meta: { title: '活动详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/operation/activity/detail')), 'operation')
          }
        ]
      },
      {
        path: '/operation/advice',
        name: '意见反馈',
        component: resolve => require.ensure([], () => resolve(require('@/page/operation/entry')), 'operation'),
        children: [
          {
            path: '/operation/advice',
            meta: { title: '意见反馈', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/operation/advice/index')), 'operation')
          },
          {
            path: '/operation/advice/detail/:id',
            meta: { title: '反馈详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/operation/advice/detail')), 'operation')
          }
        ]
      }
    ]
  },
  //财务管理
  {
    path: '/finance',
    name: '财务管理',
    component: layout,
    children: [
      {
        path: '/finance/settlement',
        name: '译员结算管理',
        component: resolve => require.ensure([], () => resolve(require('@/page/finance/entry')), 'finance'),
        children: [
          {
            path: '/finance/settlement',
            meta: { title: '译员结算管理', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/finance/settlement/index')), 'finance')
          },
          {
            path: '/finance/settlement/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/finance/settlement/detail')), 'finance')
          }
        ]
      },
      {
        path: '/finance/expenses',
        name: '兼职费用',
        component: resolve => require.ensure([], () => resolve(require('@/page/finance/entry')), 'finance'),
        children: [
          {
            path: '/finance/expenses',
            meta: { title: '兼职费用', keepAlive: true },
            component: resolve => require.ensure([], () => resolve(require('@/page/finance/expenses/index')), 'finance')
          },
          {
            path: '/finance/expenses/detail/:id',
            meta: { title: '详情' },
            component: resolve => require.ensure([], () => resolve(require('@/page/finance/expenses/detail')), 'finance')
          }
        ]
      }
    ]
  },
  //财务报表
  {
    path: '/report',
    name: '报表管理',
    component: layout,
    children: [
      {
        path: '/report/total',
        name: '兼职账目',
        component: resolve => require.ensure([], () => resolve(require('@/page/reportForm/entry')), 'reportForm'),
        children: [
          {
            path: '/report/total',
            meta: { title: '兼职账目' },
            component: resolve => require.ensure([], () => resolve(require('@/page/reportForm/total/index')), 'reportForm')
          }
        ]
      },
      {
        path: '/report/expenses',
        name: '兼职费报表',
        component: resolve => require.ensure([], () => resolve(require('@/page/reportForm/entry')), 'reportForm'),
        children: [
          {
            path: '/report/expenses',
            meta: { title: '兼职费报表' },
            component: resolve => require.ensure([], () => resolve(require('@/page/reportForm/expenses/index')), 'reportForm')
          }
        ]
      }
    ]
  }
];

export default routes;
