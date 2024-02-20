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
  //   name: 'Web-cPass',
  //   icon: 'table',
  //   path: '/web-c-pass',
  //   menuHeaderRender: false,
  //   routes: [
  //     { path: '/web-c-pass/fairs',hideInMenu: false,  name: 'Danh sách đợt mở bán', component: './Web-cPass/TableListFair' },
  //     { path: '/web-c-pass/c-pass-mega',hideInMenu: false,  name: 'Danh sách CPass Mega', component: './Web-cPass/TableListCPass' },

  //   ],
  // },

  // {
  //   name: 'AgriGate',
  //   icon: 'table',
  //   path: '/agrigate',
  //   menuHeaderRender: false,
  //   routes: [
  //     { path: '/agrigate/farm', name: 'Danh sách trang trại', component: './AgriGate/TableListFarm' },
  //     { path: '/agrigate/cows',hideInMenu: false,  name: 'Danh sách bò', component: './AgriGate/TableListCow' },
  //     { path: '/agrigate/c-pass',hideInMenu: false,  name: 'Danh sách cPass', component: './AgriGate/TableListCPass' },
  //     { path: '/agrigate/group-cow',hideInMenu: false,  name: 'Danh sách nhóm', component: './AgriGate/TableListGroupCow' },
  //     { path: '/agrigate/category',hideInMenu: false,  name: 'Giống bò', component: './AgriGate/TableListCategory' },
  //     { path: '/agrigate/status-owner',hideInMenu: false,  name: 'Thể trạng', component: './AgriGate/TableListBodyCondition' },
  //     { path: '/agrigate/wge',hideInMenu: false,  name: 'Hiệu quả tăng trọng', component: './AgriGate/TableListWGE' },
  //     { path: '/agrigate/awg',hideInMenu: false,  name: 'Tăng trọng trung bình', component: './AgriGate/TableListAWG' },
  //     { path: '/agrigate/range-p-zero', name: 'Khoảng cân nặng P0', component: './AgriGate/TableListRangeWeightZero' },
  //     { path: '/agrigate/wgs', name: 'Tăng trọng tiêu chuẩn', component: './AgriGate/TableListWGS' },
  //     { path: '/agrigate/input-weight', name: 'Nhập dữ liệu tăng trọng', component: './AgriGate/TableListSlot' },
  //   ],
  // },

  // {
  //   name: 'Web-Aleger',
  //   icon: 'table',
  //   path: '/web-aleger',
  //   routes: [
  //     { path: '/web-aleger/mega',name: 'Danh sách Aleger', component: './Web-Aleger/TableListMega' },
  //     { path: '/web-aleger/plans', name: 'Phương án hợp tác', component: './Web-Aleger/TableListPlan' },
  //     { path: '/web-aleger/wait-transaction', name: 'Trạng thái chờ giao dịch', component: './Web-Aleger/TableListStatusTransaction' },
  //     { path: '/web-aleger/reason-settlements', name: 'Lý do thanh quyết toán Mega', component: './Web-Aleger/TableListReasonSettlement' },
  //     { path: '/web-aleger/status-owner', name: 'Tình trạng sở hữu Mega', component: './Web-Aleger/TableListStatusOwner' },
  //     { path: '/web-aleger/config-mega', name: 'Cài đặt Mega', component: './Web-Aleger/TableConfigMega' },
  //     { path: '/web-aleger/config', name: 'Cài đặt chung', component: './Web-Aleger/TableListConfig'},
  //     { path: '/web-aleger/config-warning', name: 'Cài đặt đo lường lường cảnh báo', component: './Web-Aleger/TableConfigWarning' },
  //     { path: '/web-aleger/notify', name: 'Thông báo', component: './Web-Aleger/TableListConfigNotify' },

  //   ],
  // },

  // {
  //   name: 'AgriOS',
  //   icon: 'table',
  //   path: '/agrios',
  //   //component: './TableListFair',
  //   menuHeaderRender: false,
  //   routes: [
  //     { path: '/agrios/transfer',hideInMenu: false,  name: 'Transfer', component: './AgriOS/TableListTransfer' },
  //     { path: '/agrios/buy-ale',hideInMenu: false,  name: 'Mua Ale từ PL', component: './AgriOS/TableListBuyAle' },
  //     { path: '/agrios/sell-ale',hideInMenu: false,  name: 'Bán Ale cho PL', component: './AgriOS/TableListSellAle' },
  //     { path: '/agrios/confirm',hideInMenu: false,  name: 'Xác nhận giao dịch mua/bán Ale', component: './AgriOS/TableListConfirmAleTransaction' },
  //     { path: '/agrios/follow',hideInMenu: false,  name: 'Theo dõi giao dịch Ale', component: './AgriOS/TableListFollowTransactionAle' },
  //     { path: '/agrios/config',hideInMenu: false,  name: 'Cấu hình chung', component: './AgriOS/TableListConfig' },
  //     { path: '/agrios/dashboard',hideInMenu: false,  name: 'Dashboard', component: './AgriOS/TableListDashboard' },
  //     { path: '/agrios/ale',hideInMenu: false,  name: 'Ale', component: './AgriOS/TableListAle' },
  //     { path: '/agrios/product-kind-code',hideInMenu: false,  name: 'Chủng loại sản phẩm', component: './AgriOS/TableListProductKindCode' },
  //     { path: '/agrios/log-transaction-ale',hideInMenu: false,  name: 'Log giao dịch Ale', component: './AgriOS/TableListLogTransactionAle' },
  //   ],
  // },
  // {
  //   path: '/web-aleger/c-pass-mega/slot-c-pass/:id',
  //   component: './Web-Aleger/TableListHistorySlotOfMega',
  // },

  // {
  //   path: '/web-aleger/mega/my-ale/:id',
  //   component: './Web-Aleger/TableListMyAle',
  // },

  // {
  //   path: '/web-aleger/mega/my-c-pass/:id',
  //   component: './Web-Aleger/TableListMyCPassMega',
  // },

  // {
  //   path: '/web-aleger/mega/slot-c-pass/:id',
  //   component: './Web-Aleger/TableListHistoryOfMega',
  // },

  // {
  //   path: '/web-c-pass/fairs/:id',
  //   component: './Web-cPass/TableListFairDetail',
  // },

  // {
  //   path: '/web-c-pass/fairs/add-mega-assign/:id',
  //   component: './Web-cPass/TableListAddMegaAndAssignCPass',
  // },

  // {
  //   path: '/web-c-pass/fairs/manager/:id',
  //   component: './Web-cPass/TableListManagerCPassPayment',
  // },

  // {
  //   path: 'cpasses/history-slot/:id',
  //   component: './TableListHistorySlot',
  // },

  // {
  //   path: '/web-c-pass/fairs/add-cpass/:id',
  //   component: './Web-cPass/TableListAddCPassInFair',
  // },


  // {
  //   name: 'Giao dịch',
  //   icon: 'table',
  //   path: '/transactions',
  //   routes: [
  //     { path: '/transactions/settlement', name: 'Danh sách thanh quyết toán', component: './Web-Transaction/TableListTransactionSettlement' },
  //     { path: '/transactions/confirm', name: 'Xác nhận giao dịch VNĐ', component: './Web-Transaction/TableListTransactionConfirmVnd' },
  //     { path: '/transactions/follow', name: 'Theo dõi giao dịch', component: './Web-Transaction/TableListFollwTransaction' },
  //     { path: '/transactions/log-transaction', name: 'Log giao dịch', component: './Web-Transaction/TableListLogTransaction' }
  //   ],
  // },

  ///-------------------------------------------------------------------------------------------
  {
    name: 'Quản lý',
    icon: 'table',
    path: '/hr-manager',
    menuHeaderRender: false,
    routes: [
      { path: '/hr-manager/manager', name: 'Quản lý CBCCVC', component: './Hr-Manager/PageHr' },
    ],
    // access: 'admin'

  },
  {
    name: 'Cấu hình',
    icon: 'table',
    path: '/config',
    menuHeaderRender: false,
    routes: [
      { path: '/config/nation', name: 'menu.nation', component: './PageConfig/Nation' },
      { path: '/config/policy-object', name: 'menu.policyObject', component: './PageConfig/PolicyObject' },
      { path: '/config/state-rank', name: 'menu.stateRank', component: './PageConfig/StateRank' },
      { path: '/config/sex', name: 'menu.sex', component: './PageConfig/Sex' },
      {
        path: '/config/academic-degrees', name: 'menu.academicDegrees', component: './PageConfig/AcademicDegrees',
       
      },
      { path: '/config/member-family', name: 'menu.memberFamily', component: './PageConfig/MemberFamily' },
      { path: '/config/health-status', name: 'menu.healthStatus', component: './PageConfig/HealthStatus' },
      { path: '/config/religion', name: 'menu.religion', component: './PageConfig/Religion' },
      { path: '/config/secondary-education-level', name: 'menu.secondaryEducationLevel', component: './PageConfig/SecondaryEducationLevel' },
      { path: '/config/professional-level', name: 'menu.professionalLevel', component: './PageConfig/ProfessionalLevel' },
      { path: '/config/rank-salary', name: 'menu.rankSalary', component: './PageConfig/RankSalary' },
      { path: '/config/group-blood', name: 'menu.groupBlood', component: './PageConfig/GroupBlood' },
      {
        path: '/config',
        redirect: '/config/nation',
      }
    ],
    //  access: 'admin'
  },

  {
    name: 'Profile',
    icon: 'table',
    path: '/profile',
    menuHeaderRender: false,
    routes: [
      { path: '/profile', name: 'menu.profile', component: './Profile' },
    ],
    // access: 'admin'
  },
  {
    path: '/',
    redirect: '/config/nation',
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
