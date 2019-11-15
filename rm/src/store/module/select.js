const module1 = {
  namespaced: true,
  state: {
    level: [1,2,3,4,5,6,7,8,9,10],  //试题难度等级
    memberLevel: ['P1','P2','P3','P4','P5','P6','P7','P8','P9'],  //译员等级
    idCardOptions: ['身份证','护照','港澳通行证','台湾通行证','其他'],//证件
    payOptions: ['云账户','PayPal','51社保','校企合作','非全日制'], //结算方式
    recordOptions: ['博士','硕士','本科','大专','其他'],//学历
    accountState: [//账号状态
      {label:'停用',value:'0'},
      {label:'启用',value:'1'},
      {label:'冻结',value:'-1'}
    ],
    receiptState: [  //接单开关
      {label:'关闭',value:'0'},
      {label:'开启',value:'1'}
    ],
    userState: [ //用户状态
      {label:'订单中',value:'订单中'},
      {label:'空闲一周',value:'空闲一周'},
      {label:'空闲15天',value:'空闲15天'},
      {label:'空闲30天',value:'空闲30天'},
      {label:'空闲90天',value:'空闲90天'}
    ],
    resourceService: [//资源单-所需服务
      {label:'翻译',value:'翻译'},
      {label:'审校',value:'审校'},
      {label:'翻译+审校',value:'翻译+审校'},
      {label:'投资标准',value:'投资标准'}
    ],
    resourceWpService: [//资源单-外派所需服务
      {label:'现场笔译',value:'现场笔译'},
      {label:'现场口译',value:'现场口译'},
      {label:'现场口笔译',value:'现场口笔译'}
    ],
    resourceWpCusStatus: [//资源单-外派客户项目状态
      {label:'前期咨询',value:'0'},
      {label:'投标',value:'1'},
      {label:'谈判中',value:'2'},
      {label:'已签单',value:'3'},
      {label:'项目暂停',value:'4'},
      {label:'项目流失',value:'5'}
    ],
    resourceCusStatus: [//资源单-客户项目状态
      {label:'项目预告',value:'0'},
      {label:'项目执行中',value:'1'},
      {label:'项目流失',value:'2'}
    ],
    resourceProStatus: [//资源单-（项目）完成状态
      {label:'进行中',value:'0'},
      {label:'已完成',value:'1'},
      {label:'项目成功',value:'2'},
      {label:'项目失败',value:'3'}
    ],
    resourceNeedType: [//资源单-需求类型
      {label:'投标储蓄',value:'投标储蓄'},
      {label:'资源新开发',value:'资源新开发'},
      {label:'资源拓展',value:'资源拓展'},
      {label:'资源流失补充',value:'资源流失补充'}
    ],
    resourceLevel: [//资源单-稿件难度
      {label:'初级',value:'初级'},
      {label:'中级',value:'中级'},
      {label:'高级',value:'高级'}
    ],
    resourceTrainService: [ //培训-所需服务
      {label:'同声传译',value:'同声传译'},
      {label:'会议交传',value:'会议交传'},
      {label:'商务陪同',value:'商务陪同'},
      {label:'出国口译',value:'出国口译'},
    ]
  }
};

export default module1
