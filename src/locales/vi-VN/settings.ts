import requires from "./requires";
import modal from "./modal";
import menu from "./menu";

export default {
  'app.settings.menuMap.basic': 'Basic Settings',
  'app.settings.menuMap.security': 'Security Settings',
  'app.settings.menuMap.binding': 'Account Binding',
  'app.settings.menuMap.notification': 'New Message Notification',
  'app.settings.basic.avatar': 'Avatar',
  'app.settings.basic.change-avatar': 'Change avatar',
  'app.settings.basic.email': 'Email',
  'app.settings.basic.email-message': 'Please input your email!',
  'app.settings.basic.nickname': 'Nickname',
  'app.settings.basic.nickname-message': 'Please input your Nickname!',
  'app.settings.basic.profile': 'Personal profile',
  'app.settings.basic.profile-message': 'Please input your personal profile!',
  'app.settings.basic.profile-placeholder': 'Brief introduction to yourself',
  'app.settings.basic.country': 'Country/Region',
  'app.settings.basic.country-message': 'Please input your country!',
  'app.settings.basic.geographic': 'Province or city',
  'app.settings.basic.geographic-message': 'Please input your geographic info!',
  'app.settings.basic.address': 'Street Address',
  'app.settings.basic.address-message': 'Please input your address!',
  'app.settings.basic.phone': 'Phone Number',
  'app.settings.basic.phone-message': 'Please input your phone!',
  'app.settings.basic.update': 'Update Information',
  'app.settings.security.strong': 'Strong',
  'app.settings.security.medium': 'Medium',
  'app.settings.security.weak': 'Weak',
  'app.settings.security.password': 'Account Password',
  'app.settings.security.password-description': 'Current password strength',
  'app.settings.security.phone': 'Security Phone',
  'app.settings.security.phone-description': 'Bound phone',
  'app.settings.security.question': 'Security Question',
  'app.settings.security.question-description':
    'The security question is not set, and the security policy can effectively protect the account security',
  'app.settings.security.email': 'Backup Email',
  'app.settings.security.email-description': 'Bound Email',
  'app.settings.security.mfa': 'MFA Device',
  'app.settings.security.mfa-description':
    'Unbound MFA device, after binding, can be confirmed twice',
  'app.settings.security.modify': 'Modify',
  'app.settings.security.set': 'Set',
  'app.settings.security.bind': 'Bind',
  'app.settings.binding.taobao': 'Binding Taobao',
  'app.settings.binding.taobao-description': 'Currently unbound Taobao account',
  'app.settings.binding.alipay': 'Binding Alipay',
  'app.settings.binding.alipay-description': 'Currently unbound Alipay account',
  'app.settings.binding.dingding': 'Binding DingTalk',
  'app.settings.binding.dingding-description': 'Currently unbound DingTalk account',
  'app.settings.binding.bind': 'Bind',
  'app.settings.notification.password': 'Account Password',
  'app.settings.notification.password-description':
    'Messages from other users will be notified in the form of a station letter',
  'app.settings.notification.messages': 'System Messages',
  'app.settings.notification.messages-description':
    'System messages will be notified in the form of a station letter',
  'app.settings.notification.todo': 'To-do Notification',
  'app.settings.notification.todo-description':
    'The to-do list will be notified in the form of a letter from the station',
  'app.settings.open': 'Open',
  'app.settings.close': 'Close',
  'app.settings.testing': 'test',
  'chosen': 'Được chọn',

  'page.province': "Tỉnh thành",
  'page.district': "Quận huyện",
  'page.ward': "Xã phường",
  'page.contract': "Loại biên chế, hợp đồng",
  'page.position': "Ngạch, bậc, chức vụ",
  'page.level': "Trình độ, đào tạo",
  'page.level.study': "Trình độ học vấn",
  'menu.Cấu hình.menu.nation': 'Dân tộc',
  'menu.Cấu hình': 'Cấu hình',
  'menu.Quản lý.Quản lý CBCCVC': 'Quản lý CBCCVC',
  'menu.Quản lý.Document': 'Hồ sơ',
  'menu.Quản lý': 'Quản lý',
  'menu.Cấu hình.menu.policyObject': 'Đối tượng chính sách',
  'menu.Cấu hình.menu.stateRank': 'Danh hiệu nhà nước phong tặng',
  'menu.Cấu hình.menu.sex': 'Giới tính',
  'menu.Cấu hình.menu.academicDegrees': 'Học hàm',
  'menu.Cấu hình.menu.memberFamily': 'Thành phần gia đình',
  'menu.Cấu hình.menu.healthStatus': 'Tỉnh trạng sức khỏe',
  'menu.Cấu hình.menu.religion': 'Tôn giáo',
  'menu.Cấu hình.menu.secondaryEducationLevel': 'Trình độ giáo dục phổ thông',
  'menu.Cấu hình.menu.professionalLevel': 'Trình độ chuyên môn',
  'menu.Cấu hình.menu.rankSalary': 'Bậc lương',
  'menu.Cấu hình.menu.groupBlood': 'Nhóm máu',
  'menu.Cấu hình.menu.militaryRanks': 'Cấp bậc quân hàm',
  'menu.Cấu hình.menu.position': 'Chức vụ',
  'menu.Profile.menu.profile': 'Thông tin',
  'menu.Profile': 'Thông tin',
  'menu.Thông tin cá nhân': 'Thông tin cá nhân',
  "menu.Tài khoản": "Danh sách tài khoản",
  "menu.Cấu hình.menu.civilServant": "Ngạch công chức",
  "menu.Cấu hình.menu.officer": "Ngạch viên chức",
  "menu.Cấu hình.menu.officerRank": "Bậc viên chức",
  "menu.Cấu hình.menu.civilServantRank": "Bậc công chức",
  ...requires,
  ...modal,
  ...menu,




  //GOBLE TABLE
  'page.table.createAt': 'Ngày khởi tạo',
  'page.table.updateAt': 'Ngày cập nhật',

  ///nation
  'page.nation.table.name': 'Tên dân tộc',
  'page.nation.modal.titleCreate': 'Tạo mới dân tộc',
  'page.nation.modal.titleUpdate': 'Cập nhật dân tộc',


  //PolicyObject
  'page.PolicyObject.table.name': 'Tên đối tượng',
  'page.PolicyObject.modal.titleCreate': 'Tạo mới đối tượng',
  'page.PolicyObject.modal.titleUpdate': 'Cập nhật đối tượng',


  //StateRank
  'page.StateRank.table.name': 'Tên danh hiệu',
  'page.StateRank.modal.titleCreate': 'Tạo mới danh hiệu',
  'page.StateRank.modal.titleUpdate': 'Cập nhật danh hiệu',

  //StateRank
  'page.Sex.table.name': 'Tên giới tính',
  'page.Sex.modal.titleCreate': 'Tạo mới giới tính',
  'page.Sex.modal.titleUpdate': 'Cập nhật giới tính',


  //AcademicDegrees
  'page.AcademicDegrees.table.name': 'Tên học hàm',
  'page.AcademicDegrees.modal.titleCreate': 'Tạo mới học hàm',
  'page.AcademicDegrees.modal.titleUpdate': 'Cập nhật học hàm',

  //MemberFamily
  'page.MemberFamily.table.name': 'Tên thành phần gia đình',
  'page.MemberFamily.modal.titleCreate': 'Tạo mới thành phần gia đình',
  'page.MemberFamily.modal.titleUpdate': 'Cập nhật thành phần gia đình',


  //HealthStatus
  'page.HealthStatus.table.name': 'Tên tình trạng sức khỏe',
  'page.HealthStatus.modal.titleCreate': 'Tạo mới tình trạng sức khỏe',
  'page.HealthStatus.modal.titleUpdate': 'Cập nhật tình trạng sức khỏe',

  //Religion
  'page.Religion.table.name': 'Tên tôn giáo',
  'page.Religion.modal.titleCreate': 'Tạo mới tôn giáo',
  'page.Religion.modal.titleUpdate': 'Cập nhật tôn giáo',


  //SecondaryEducationLevel
  'page.SecondaryEducationLevel.table.name': 'Tên trình độ',
  'page.SecondaryEducationLevel.modal.titleCreate': 'Tạo mới trình độ',
  'page.SecondaryEducationLevel.modal.titleUpdate': 'Cập nhật trình độ',

  //ProfessionalLevel
  'page.ProfessionalLevel.table.name': 'Tên trình độ chuyên môn',
  'page.ProfessionalLevel.modal.titleCreate': 'Tạo mới trình độ chuyên môn',
  'page.ProfessionalLevel.modal.titleUpdate': 'Cập nhật trình độ chuyên môn',

  //RankSalary
  'page.RankSalary.table.name': 'Tên bậc lương',
  'page.RankSalary.modal.titleCreate': 'Tạo mới bậc lương',
  'page.RankSalary.modal.titleUpdate': 'Cập nhật bậc lương',

  //GroupBlood
  'page.GroupBlood.table.name': 'Tên nhóm máu',
  'page.GroupBlood.modal.titleCreate': 'Tạo mới nhóm máu',
  'page.GroupBlood.modal.titleUpdate': 'Cập nhật nhóm máu',


  //CBVC
  'page.hr.modal.addNew.title': 'Tạo CBVC',
  'page.hr.modal.addNew.passport': 'CCCD/CMND',
  'page.hr.modal.addNew.email': 'Email',
  'page.hr.modal.addNew.name': 'Tên CBVC',

  //militaryRanks
  'page.militaryRanks.table.name': 'Tên cấp bậc quân hàm',
  'page.militaryRanks.modal.titleCreate': 'Tạo mới cấp bậc quân hàm',
  'page.militaryRanks.modal.titleUpdate': 'Cập nhật cấp bậc quân hàm',

  //militaryRanks
  'page.Position.table.name': 'Tên chức vụ',
  'page.Position.modal.titleCreate': 'Tạo mới chức vụ',
  'page.Position.modal.titleUpdate': 'Cập nhật chức vụ',

  //CivilServant
  'page.CivilServant.table.name': 'Tên ngạch công chức',
  'page.CivilServant.modal.titleCreate': 'Tạo mới ngạch công chức',
  'page.CivilServant.modal.titleUpdate': 'Cập nhật ngạch công chức',
  'page.CivilServant.table.numberSalary': 'Hệ số lương',
  'page.CivilServant.table.status': 'Trạng thái',

  //Officer
  'page.Officer.table.name': 'Tên ngạch viên chức',
  'page.Officer.modal.titleCreate': 'Tạo mới ngạch viên chức',
  'page.Officer.modal.titleUpdate': 'Cập nhật ngạch viên chức',
  'page.Officer.table.numberSalary': 'Hệ số lương',
  'page.Officer.table.status': 'Trạng thái',

  //CivilServantRank
  'page.CivilServantRank.table.name': 'Tên bậc công chức',
  'page.CivilServantRank.modal.titleCreate': 'Tạo mới bậc công chức',
  'page.CivilServantRank.modal.titleUpdate': 'Cập nhật bậc công chức',

   //OfficerRank
   'page.OfficerRank.table.name': 'Tên bậc viên chức',
   'page.OfficerRank.modal.titleCreate': 'Tạo mới bậc viên chức',
   'page.OfficerRank.modal.titleUpdate': 'Cập nhật bậc viên chức',


  //Account
  'page.Account.table.name': 'Họ tên',
  'page.Account.table.numberIdentify': 'Số CMND/CCCD',
  'page.Account.table.username': 'Username',
  'page.Account.table.email': 'Email',
  'page.Account.table.syll': 'SYLL',
  'page.Account.table.role': 'Quyền',
  'page.Account.table.status': 'Trạng thái',

  //PAGE PROFILE
  'page.profile.name': 'Họ tên',
  'page.profile.diffName': 'Tên gọi khác',
  'page.profile.birthdate': 'Ngày sinh',
  'page.profile.sex': 'Giới tính',
  'page.profile.numberIdentify': 'CMND/CCCD',
  'page.profile.nation': 'Dân tộc',
  'page.profile.placeOfBirth': 'Nơi sinh',
  'page.profile.homeTown': 'Quê quán',
  'page.profile.dateNumberIdentify': 'Ngày cấp CCCD/CMND',
  'page.profile.phone': 'Số điện thoại',
  'page.profile.socialInsurance': 'Mã BHXH',
  'page.profile.healthInsurance': 'Số BHYT',
  'page.profile.tall': 'Chiều cao (cm)',
  'page.profile.weight': 'Cân nặng (kg)',
  'page.profile.groupBlood': 'Nhóm máu',

  'page.profile.accommodationToday': 'Nơi ở hiện nay',
  'page.profile.card.tilte.job': 'Biên chế, Chức vụ, Ngạch, Bậc',
  'page.profile.card.tilte.': 'Nơi ở hiện nay',
  'page.profile.card.tilte.basicInfor': 'Thông tin cơ bản',

  'page.profile.beforeJob': 'Nghề nghiệp trước khi tuyển dụng',
  'page.profile.dateFirstJob': 'Ngày được tuyển dụng lần đầu',
  'page.profile.recruitmentAgency': 'Cơ quan, đơn vị tuyển dụng',
  'page.profile.dateAgencyToDo': 'Ngày vào cơ quan công tác',
  'page.profile.dateJoinCommunistParty': 'Ngày vào Đảng',
  'page.profile.firstDateJoinLargestSocialPoliticalOrg': 'Ngày tham gia tổ chức chính trị - xã hội đầu tiên',
  'page.profile.dateOfEnlistment': 'Ngày nhập ngũ',
  'page.profile.dateDischargedFromMilitaryService': 'Ngày xuất ngũ',
  'page.profile.militaryRanks': 'Cấp bậc quân hàm',
  'page.profile.policyOjbect': 'Đối tượng chính sách',
  'page.profile.secondaryEducationLevel': 'Trình độ giáo dục phổ thông',
  'page.profile.professionalLevel': 'Trình độ chuyên môn',
  'page.profile.academicDegrees': 'Học hàm',
  'page.profile.stateRank': 'Danh hiệu nhà nước phong tặng',
  'page.profile.currentPosition': 'Chức vụ hiện tại',
  'page.profile.dateAppointment': 'Ngày bổ nhiệm',
  'page.profile.dateReAppointment': 'Ngày bổ nhiệm lại',
  'page.profile.planningPosition': 'Được quy hoạch chức danh',
  'page.profile.chargePosition': 'Chức vụ kiêm nhiệm',
  'page.profile.chargePositionCommunistParty': 'Chức vụ Đảng kiêm nhiệm',
  'page.profile.currentPositionCommunistParty': 'Chức vụ Đảng hiện tại',
  'page.profile.mainJob': 'Công việc chính',
  'page.profile.forte': 'Sở trường công tác',
  'page.profile.positionLongest': 'Công việc lâu nhất',
  'page.profile.salary': 'Tiền lương',
  'page.profile.quotaCareer': 'Ngạch nghề nghiệp',
  'page.profile.codeQuotaCareer': 'Mã ngạch nghề nghiệp',
  'page.profile.dateAppointmentQuotaCareer': 'Ngày bổ nhiệm ngạch',
  'page.profile.rankSalary': 'Bậc lương',
  'page.profile.numberSalaryQuotaCareer': 'Hệ số lương ngạch nghề nghiệp',
  'page.profile.dateGetSalaryQuotaCareer': 'Ngày hưởng lương ngạch nghề nghiệp',
  'page.profile.percentGetSalaryQuotaCareer': 'Phần trăm hưởng lương ngạch nghề nghiệp',
  'page.profile.allowancePassQuotaCareer': 'Phụ cấp thâm niên vượt khung ngạch nghề nghiệp',
  'page.profile.dateGetAllowancePassQuotaCareer': 'Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp',
  'page.profile.allowancePosition': 'Phụ cấp chức vụ',
  'page.profile.allowanceChargePosition': 'Phụ cấp kiêm nhiệm',
  'page.profile.allowanceOther': 'Phụ cấp khác',
  'page.profile.workplace': 'Vị trí công việc',
  'page.profile.codeWorkplace': 'Mã số vị trí công việc',
  'page.profile.rankSalaryWorkSpace': 'Bậc lương trí công việc',
  'page.profile.salaryMoney': 'Lương',
  'page.profile.dateGetSalaryWorkSpace': 'Ngày hưởng lương',
  'page.profile.percentSalaryWorkSpace': 'Phần trăm hưởng lương',
  'page.profile.allowancePass': 'Phụ cấp vượt khung',
  'page.profile.dadteGetSalaryAllowancePass': 'Ngày hưởng phụ cấp vượt khung',
  'page.profile.membership': 'Thành phần gia đình',




///workOld
'page.profile.workOld.name': 'Chức danh, đơn vị địa điểm',
'page.profile.workOld.dateStart': 'Ngày bắt đầu',
'page.profile.workOld.dateEnd': 'Ngày kết thúc',

'menu.Thông tin.menu.basic': 'Thông tin cơ bản',
'menu.Thông tin.menu.workOld': 'Làm việc chế độ cũ',
'menu.Thông tin.menu.lang': 'Ngoại ngữ',


};

