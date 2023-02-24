
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },
  {
    name: 'Bò',
    icon: 'table',
    path: '/cows',
    component: './TableListCow',
    menuHeaderRender: false,
    routes: [
      { path: '/cows/:id', hideInMenu: true, name: 'chi tiết', component: './TableListCow' }
    ],
  },
  {
    name: 'CPass',
    icon: 'table',
    path: '/cpasses',
    component: './TableListCPass',
    routes: [

    ]
  },

  {
    name: 'Phiên mở bán',
    icon: 'table',
    path: '/fairs',
    component: './TableListFair',
  },
  {

    path: '/fairs/:id',
    component: './TableListFairDetail',
  },

  {
    name: 'Slot',
    icon: 'table',
    path: '/slot',
    component: './TableListSlot',
  },

  {
    name: 'Giao dịch',
    icon: 'table',
    path: '/transactions',
    component: './TableListTransaction',
  },
 
  {
    name: 'Giống bò',
    icon: 'table',
    path: '/categories',
    component: './TableListCategory',
  },
  {
    name: 'E-Wallet', 
    icon: 'table',
    path: '/ewallets',
    component: './TableListEWallet',
  },
  {
    name: 'Nông trại',
    icon: 'table',
    path: '/farms',
    component: './TableListFarm',
  },
  {
    name: 'Phương án hợp tác',
    icon: 'table',
    path: '/plans',
    component: './TableListPlan',
  },
 
 
  {
    name: 'Địa chỉ',
    icon: 'table',
    path: '/address',
    component: './TableListAddress',
  },
 
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
