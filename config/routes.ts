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
    icon: 'setting',
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
      { path: '/config/military-ranks', name: 'menu.militaryRanks', component: './PageConfig/MilitaryRanks' },
      { path: '/config/position', name: 'menu.position', component: './PageConfig/Position' },
      { path: '/config/civil-servant', name: 'menu.civilServant', component: './PageConfig/CivilServant' },
      { path: '/config/civil-servant-rank', name: 'menu.civilServantRank', component: './PageConfig/CivilServantRank' },
      { path: '/config/officer', name: 'menu.officer', component: './PageConfig/Officer' },
      { path: '/config/officer-rank', name: 'menu.officerRank', component: './PageConfig/OfficerRank' },
      {
        path: '/config',
        redirect: '/config/nation',
      }
    ],
    //  access: 'admin'
  },


  {
    name: 'Thông tin',
    icon: 'home',
    path: '/profile',
    menuHeaderRender: false,
    routes: [
      { path: '/profile/nation', name: 'menu.basic', component: './Profile/Basic' },
      { path: '/profile/work-old', name: 'menu.workOld', component: './Profile/WorkOld' },
       { path: '/profile/lang', name: 'menu.lang', component: './Profile/Languages' },
       { path: '/profile/techno', name: 'menu.tech', component: './Profile/Techno' },
       { path: '/profile/relate-family', name: 'menu.relateFamily', component: './Profile/RelateFamily' },
       { path: '/profile/go-on-bussiness', name: 'menu.goOnBussiness', component: './Profile/GoOnBuss' },
       { path: '/profile/other-allownce', name: 'menu.otherAllownce', component: './Profile/Allowance' },
       { path: '/profile/marjor-bussiness', name: 'menu.majorBuz', component: './Profile/MajorBuz' },
       { path: '/profile/political-theory', name: 'menu.politicalTheory', component: './Profile/PoliticalTheory' },
       { path: '/profile/my-salary', name: 'menu.mySalary', component: './Profile/MySalary' },
       { path: '/profile/working-abroad', name: 'menu.workingAbroad', component: './Profile/WorkingAbroad' },
       { path: '/profile/know-army', name: 'menu.knowArmy', component: './Profile/KnowArmy' },
       { path: '/profile/bonus', name: 'menu.bonus', component: './Profile/Bonus' },
      {
        path: '/profile',
        redirect: '/profile/nation',
      }
    ],
    //  access: 'admin'
  },



  // {
  //   name: 'Thông tin cá nhân',
  //   icon: 'home',
  //   path: '/profile',
  //   menuHeaderRender: true,
  //   routes: [
  //     { path: '/profile/basic', name: 'basic', component: './Profile/Basic' },
  //     // { path: '/profile/work-old', name: 'workOld', component: './Profile/WorkOld' },
  //     // { path: '/profile/lange', name: 'cerLang', component: './Profile/WorkOld' },
    
  //   ]
  // },
  // {
  //   name: 'Thông tin cá nhân',
  //   icon: 'home',
  //   path: '/profile',
  //   menuHeaderRender: true,
  //   routes: [
  //     // { path: '/profile/basic', name: 'basic', component: './Profile/Basic' },
  //     // { path: '/profile/work-old', name: 'workOld', component: './Profile/WorkOld' },
  //     // { path: '/profile/lange', name: 'cerLang', component: './Profile/WorkOld' },
    
  //   ]
  // },


  {
    name: 'Tài khoản',
    icon: 'user',
    path: '/account',
    menuHeaderRender: false,
    component: './Account',
    
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
