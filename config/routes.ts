
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
    name: 'Ngân hàng',
    icon: 'table',
    path: '/banks',
    component: './TableListBank',
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
    name: 'Tỉnh thành',
    icon: 'table',
    path: '/provinces',
    component: './TableListProvince',
  },
  {
    name: 'Phương án hợp tác',
    icon: 'table',
    path: '/plans',
    component: './TableListPlan',
  },
  {
    name: 'Quận huyện',
    icon: 'table',
    path: '/districts',
    component: './TableListDistrict',
  },
  {
    name: 'Xã phường',
    icon: 'table',
    path: '/wards',
    component: './TableListWard',
  },
  {
    name: 'Địa chỉ',
    icon: 'table',
    path: '/address',
    component: './TableListAddress',
  },
  {
    name: 'Bò',
    icon: 'table',
    path: '/cows',
    component: './TableListCow',
    routes: [
      { path: '/cows/:id', hideInMenu: true, name: 'chi tiết', component: './TableListCow' }
    ],
  },
  {
    name: 'CPass',
    icon: 'table',
    path: '/cpasses',
    component: './TableListCPass',
  },

  {
    name: 'Phiên mở bán',
    icon: 'table',
    path: '/fairs',
    component: './TableListFair',
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
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
