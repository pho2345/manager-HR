import { truncate } from "lodash";


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
  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
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
  // {
  //   name: 'Bò',
  //   icon: 'table',
  //   path: '/cows',
  //   //component: './TableListCow',
  //   //menuHeaderRender: false,
  //   routes: [
  //     { path: '/cows/list', icon: 'table', hideInMenu: false, name: 'Danh sách bò', component: './TableListCow' }
  //   ],
  // },
  

 

  {
    name: 'Web-cPass',
    icon: 'table',
    path: '/web-c-pass',
    //component: './TableListFair',
    menuHeaderRender: false,
    routes: [
      { path: '/web-c-pass/fairs',hideInMenu: false,  name: 'Danh sách đợt mở bán', component: './Web-cPass/TableListFair' },
      { path: '/web-c-pass/c-pass-mega',hideInMenu: false,  name: 'Danh sách CPass Mega', component: './Web-cPass/TableListCPass' },
     
    ],
  },

  {
    name: 'AgriGate',
    icon: 'table',
    path: '/agrigate',
    //component: './TableListFair',
    menuHeaderRender: false,
    routes: [
      { path: '/agrigate/farm', name: 'Danh sách trang trại', component: './AgriGate/TableListFarm' },
      { path: '/agrigate/cows',hideInMenu: false,  name: 'Danh sách bò', component: './AgriGate/TableListCow' },
      { path: '/agrigate/c-pass',hideInMenu: false,  name: 'Danh sách cPass', component: './AgriGate/TableListCPass' },
      { path: '/agrigate/group-cow',hideInMenu: false,  name: 'Danh sách nhóm', component: './AgriGate/TableListGroupCow' },
      { path: '/agrigate/category',hideInMenu: false,  name: 'Giống bò', component: './AgriGate/TableListCategory' },
      { path: '/agrigate/status-owner',hideInMenu: false,  name: 'Thể trạng', component: './AgriGate/TableListBodyCondition' },
      { path: '/agrigate/wge',hideInMenu: false,  name: 'Hiệu quả tăng trọng', component: './AgriGate/TableListWGE' },
      { path: '/agrigate/awg',hideInMenu: false,  name: 'Tăng trọng trung bình', component: './AgriGate/TableListAWG' },
      { path: '/agrigate/range-p-zero', name: 'Khoảng cân nặng P0', component: './AgriGate/TableListRangeWeightZero' },
      { path: '/agrigate/wgs', name: 'Tăng trọng tiêu chuẩn', component: './AgriGate/TableListWGS' },
      { path: '/agrigate/input-weight', name: 'Nhập dữ liệu tăng trọng', component: './AgriGate/TableListSlot' },
      
    ],
  },

  {
    name: 'Web-Aleger',
    icon: 'table',
    path: '/web-aleger',
    // menuHeaderRender: false,
    routes: [
      { path: '/web-aleger/mega',name: 'Danh sách Aleger', component: './Web-Aleger/TableListMega' },
      { path: '/web-aleger/plans', name: 'Phương án hợp tác', component: './Web-Aleger/TableListPlan' },
      { path: '/web-aleger/wait-transaction', name: 'Trạng thái chờ giao dịch', component: './Web-Aleger/TableListStatusTransaction' },
      { path: '/web-aleger/reason-settlements', name: 'Lý do thanh quyết toán Mega', component: './Web-Aleger/TableListReasonSettlement' },
      { path: '/web-aleger/status-owner', name: 'Tình trạng sở hữu Mega', component: './Web-Aleger/TableListStatusOwner' },
      { path: '/web-aleger/config-mega', name: 'Cài đặt Mega', component: './Web-Aleger/TableConfigMega' },
      { path: '/web-aleger/config', name: 'Cài đặt chung', component: './Web-Aleger/TableListConfig'},
      { path: '/web-aleger/config-warning', name: 'Cài đặt đo lường lường cảnh báo', component: './Web-Aleger/TableConfigWarning' },
      { path: '/web-aleger/notify', name: 'Thông báo', component: './Web-Aleger/TableListConfigNotify' },
    
    ],
  },

  {
    name: 'AgriOS',
    icon: 'table',
    path: '/agrios',
    //component: './TableListFair',
    menuHeaderRender: false,
    routes: [
      { path: '/agrios/transfer',hideInMenu: false,  name: 'Transfer', component: './AgriOS/TableListTransfer' },
      { path: '/agrios/buy-ale',hideInMenu: false,  name: 'Mua Ale từ PL', component: './AgriOS/TableListBuyAle' },
      { path: '/agrios/sell-ale',hideInMenu: false,  name: 'Bán Ale cho PL', component: './AgriOS/TableListSellAle' },
      { path: '/agrios/confirm',hideInMenu: false,  name: 'Xác nhận giao dịch mua/bán Ale', component: './AgriOS/TableListConfirmAleTransaction' },
      { path: '/agrios/follow',hideInMenu: false,  name: 'Theo dõi giao dịch Ale', component: './AgriOS/TableListFollowTransactionAle' },
      { path: '/agrios/config',hideInMenu: false,  name: 'Cấu hình chung', component: './AgriOS/TableListConfig' },
      { path: '/agrios/dashboard',hideInMenu: false,  name: 'Dashboard', component: './AgriOS/TableListDashboard' },
      { path: '/agrios/ale',hideInMenu: false,  name: 'Ale', component: './AgriOS/TableListAle' },
      { path: '/agrios/product-kind-code',hideInMenu: false,  name: 'Chủng loại sản phẩm', component: './AgriOS/TableListProductKindCode' },
    ],
  },
  {
    path: '/web-aleger/c-pass-mega/slot-c-pass/:id',
    component: './Web-Aleger/TableListHistorySlotOfMega',
  },

  {
    path: '/web-aleger/mega/my-ale/:id',
    component: './Web-Aleger/TableListMyAle',
  },

  {
    path: '/web-aleger/mega/my-c-pass/:id',
    component: './Web-Aleger/TableListMyCPassMega',
  },

  {
    path: '/web-aleger/mega/slot-c-pass/:id',
    component: './Web-Aleger/TableListHistoryOfMega',
  },

  {
    path: '/web-c-pass/fairs/:id',
    component: './Web-cPass/TableListFairDetail',
  },

  {
    path: '/web-c-pass/fairs/add-mega-assign/:id',
    component: './Web-cPass/TableListAddMegaAndAssignCPass',
  },

  {
    path: '/web-c-pass/fairs/manager/:id',
    component: './Web-cPass/TableListManagerCPassPayment',
  },

   {
    path: '/web-aleger/mega/slot-c-pass/:id',
    component: './Web-Aleger/TableListHistoryOfMega',
  },

  {
    path: 'cpasses/history-slot/:id',
    component: './TableListHistorySlot',
  },

  {
    path: '/web-c-pass/fairs/add-cpass/:id',
    component: './Web-cPass/TableListAddCPassInFair',
  },
  // {
  //   name: 'Slot',
  //   icon: 'table',
  //   path: '/slot',
  //   component: './TableListSlot',
  // },

  {
    name: 'Giao dịch',
    icon: 'table',
    path: '/transactions',
    //component: './TableListTransaction',
    routes: [
      { path: '/transactions/settlement', name: 'Danh sách thanh quyết toán', component: './Web-Transaction/TableListTransactionSettlement' },
      { path: '/transactions/confirm', name: 'Xác nhận giao dịch VNĐ', component: './Web-Transaction/TableListTransactionConfirmVnd' },
      { path: '/transactions/follow', name: 'Theo dõi giao dịch', component: './Web-Transaction/TableListFollwTransaction' }
    ],
  },
 
  // {
  //   name: 'Giống bò',
  //   icon: 'table',
  //   path: '/categories',
  //   component: './TableListCategory',
  // },

  // {
  //   name: 'Nhóm bò',
  //   icon: 'table',
  //   path: '/group',
  //   component: './TableListGroupCow',
  // },
  // {
  //   name: 'E-Wallet', 
  //   icon: 'table',
  //   path: '/ewallets',
  //   component: './TableListEWallet',
  // },
  // {
  //   name: 'Nông trại',
  //   icon: 'table',
  //   path: '/farms',
  //   component: './TableListFarm',
  // },
  // {
  //   name: 'Phương án hợp tác',
  //   icon: 'table',
  //   path: '/plans',
  //   component: './TableListPlan',
  // },
 
 
  // {
  //   name: 'Địa chỉ',
  //   icon: 'table',
  //   path: '/address',
  //   component: './TableListAddress',
  // },
 
  {
    path: '/',
    redirect: '/web-c-pass/fairs',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '/403',
    component: '@/pages/403',
  }
 
];
