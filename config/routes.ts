
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
    //component: './TableListCow',
    //menuHeaderRender: false,
    routes: [
      { path: '/cows/list', icon: 'table', hideInMenu: false, name: 'Danh sách bò', component: './TableListCow' }
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
    //component: './TableListFair',
    menuHeaderRender: false,
    routes: [
      { path: '/fairs/list', name: 'Danh đợt mở bán', component: './TableListFair' }
    ],
  },
  {
    path: '/fairs/:id',
    component: './TableListFairDetail',
  },

  {
    path: '/fairs/add-mega-assign/:id',
    component: './TableListAddMegaAndAssignCPass',
  },

  {
    path: '/fairs/manager/:id',
    component: './TableListManagerCPassPayment',
  },

  {
    path: 'cpasses/history-slot/:id',
    component: './TableListHistorySlot',
  },

  {
    path: '/fairs/add-cpass/:id',
    component: './TableListAddCPassInFair',
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
    //component: './TableListTransaction',
    routes: [
      { path: '/transactions/settlement', name: 'Danh sách thanh quyết toán', component: './Transaction/TableListTransactionSettlement' },
      { path: '/transactions/confirm', name: 'Xác nhận Giao dịch VNĐ', component: './Transaction/TableListTransaction' }
    ],
  },
 
  {
    name: 'Giống bò',
    icon: 'table',
    path: '/categories',
    component: './TableListCategory',
  },

  {
    name: 'Nhóm bò',
    icon: 'table',
    path: '/group',
    component: './TableListGroupCow',
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
