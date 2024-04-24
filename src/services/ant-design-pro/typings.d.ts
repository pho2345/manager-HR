// @ts-ignore
/* eslint-disable */

declare namespace API {
  type List<T = any> = {
    status_code?: number,
    message?: string,
    data?: T[]
  }
  type CurrentUser = {
    id?: number,
    hoVaten?: string,
    soCCCD?: string,
    username?: string,
    email?: string,
    maSoYeuLyLich?: string,
    role?: string,
    trangThai?: boolean
  };



  type LoginResult = {
    // jwt?: string;
    // status?: string;
    // type?: string;
    // currentAuthority?: string;
    data: {
      taikhoan?: object,
      token?: string
    }
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };



  type Bank = {
    code?: number
    name?: string;
    shortName?: string;
    updatedAt?: string;
    createdAt?: string;

  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    Date?: string;
    description?: string;
    type?: NoticeIconItemType;
  };


  type Staff = {
    create_at: string;
    update_at: string | null;
    id: string;
    hovaten: string;
    gioiTinh: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    cacTenGoiKhac: string;
    sinhNgay: string;
    noiSinh: string;
    queQuan: string;
    danToc: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    soCCCD: string;
    ngayCapCCCD: string;
    soDienThoai: string;
    soBHXH: string;
    soBHYT: string;
    noiOHienNay: string;
    thanhPhanGiaDinh: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    ngheNghiepTruocKhiTuyenDung: string;
    ngayDuocTuyenDungLanDau: string;
    coQuanToChucDonViTuyenDung: {
      create_at: string;
      update_at: string | null;
    };
    ngayVaoCoQuanHienDangCongTac: string;
    ngayVaoDangCongSanVietNam: string;
    ngayChinhThuc: string;
    ngayThamGiaToChucChinhTriXaHoiDauTien: string;
    ngayNhapNgu: string;
    ngayXuatNgu: string;
    capBacLoaiQuanHamQuanDoi: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
      loaiQuanHamQuanDoi: {
        create_at: string;
        update_at: string | null;
        id: number;
        name: string;
      };
    };
    doiTuongChinhSach: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    trinhDoGiaoDucPhoThong: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    trinhDoChuyenMon: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    hocHam: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    danhHieuNhaNuocPhongTang: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    chucVuHienTai: string;
    ngayBoNhiem: string;
    ngayBoNhiemLai: string;
    duocQuyHoacChucDanh: string;
    chucVuKiemNhiem: string;
    chucVuDangHienTai: string;
    chucVuDangKiemNhiem: string;
    congViecChinhDuocGiao: string;
    soTruongCongTac: string;
    congViecLamLauNhat: string;
    tienLuong: number;
    ngachNgheNghiep: string;
    maSoNgachNgheNghiep: string;
    ngayBoNhiemNgachNgheNghiep: string;
    bacLuong: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    heSoLuongNgachNgheNghiep: number;
    ngayHuongLuongNgachNgheNghiep: string;
    phanTramHuongLuongNgachNgheNghiep: number;
    phuCapThamNienVuotKhungNgachNgheNghiep: number;
    ngayHuongPCTNVKNgachNgheNghiep: string;
    phuCapChucVu: number;
    phuCapKiemNhiem: number;
    phuCapKhac: number;
    viTriViecLam: string;
    maSoViTriViecLam: string;
    bacLuongTriViecLam: number;
    luongTheoMucTien: number;
    ngayHuongLuongTheoViTriViecLam: string;
    phamTramHuongLuong: number;
    phuCapThamNienVuotKhung: number;
    ngayHuongPCTNVK: string;
    tinhTrangSucKhoe: {
      create_at: string;
      update_at: string | null;
      id: number;
      title: string;
    };
    chieuCao: number;
    canNang: number;
    nhomMau: {
      create_at: string;
      update_at: string | null;
      id: number;
      name: string;
    };
    lyLuanChinhTris: {
      create_at: string;
      update_at: string | null;
      id: number;
      batDau: string;
      ketThuc: string;
      tenCoSoDaoTao: string;
      hinhThucDaoTao: string;
      vanBangDuocCap: string;
      loaiSoYeuLyLichChiTiet: {
        create_at: string;
        update_at: string | null;
        id: number;
        name: string;
      };
    }[];
    nghiepVuChuyenNganhs: any[];
    kienThucAnNinhQuocPhongs: any[];
    tinHocs: any[];
    ngoaiNgus: any[];
    quaTrinhCongTacs: any[];
    banThanCoLamViecChoCheDoCus: any[];
    lamViecONuocNgoais: any[];
    khenThuongs: any[];
    kyLuats: any[];
    quanHeGiaDinhRuots: any[];
    quanHeGiaDinhRuotBenVoHoacChongs: any[];
    luongBanThans: any[];
    phuCapKhacs: any[];
  };

  type StaffList = {
    data?: Staff[];
    total?: number;
    success?: boolean;
  };

  type Nation = {
    id?: number;
    name?: string;
    create_at?: string;
    update_at?: string;
    trangThai?: boolean;
  };

  type NationList = {
    data?: Nation[];
    total?: number;
    success?: boolean;
  };


}

declare namespace GEN {


  type ProfessionalKnowledge = {
    create_at: string,
    update_at: string,
    id: number,
    batDau: string,
    ketThuc: string,
    tenCoSoDaoTao: {

      trangThai: boolean,
      id: number,
      name: string
    },
    chungChiDuocCap: string,
    xacNhan: CHO_XAC_NHAN | XAC_NHAN | TU_CHOI | QUA_HAN
  }

  type Option = {
    value?: string;
    label?: string;
  }



  type MilitaryRanks = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type Account = {
    id: number,
    hoVaTen: string,
    soCCCD: string,
    username: string,
    email: string,
    maSoYeuLyLich: string,
    role: 'ADMIN' | 'EMPLOYEE',
    trangThai: boolean
  }

  type Position = {
    id?: number;
    name?: string;
    create_at?: string;
    update_at?: string;
    trangThai: boolean
  }

  type PolicyObject = {
    id?: number;
    name?: string;
    create_at?: string;
    update_at?: string;
    trangThai?: boolean;
  }


  type StateRank = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type CivilServant = {
    ma: string,
    name: string,
    heSoLuongCongChucId: number,
    nhomCongChucId: number,
    nhomCongChucName: string,
    loaiCongChucId: number,
    loaiCongChucLoai: string,
    loaiCongChucName: string,
    bacLuongId: number,
    bacLuongName: string,
    heSo: number


  }

  type CivilServantRank = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
  }


  type Officer = {
    ma: string,
    name: string,
    heSoLuongVienChucId: number,
    nhomVienChucId: number,
    nhomVienChucName: string,
    loaiVienChucId: number,
    loaiVienChucLoai: string,
    loaiVienChucName: string,
    bacLuongId: number,
    bacLuongName: string,
    heSo: number
  }

  type OfficerRank = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;

  }




  type Sex = {
    id?: number;
    name?: string;
    create_at?: Date;
    trangThai?: boolean;
    update_at?: Date;
  }

  type AcademicDegrees = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type MemberFamily = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type HealthStatus = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    title?: string;
    trangThai?: boolean;
  }

  type Religion = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type SecondaryEducationLevel = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type GroupRankCommunistParty = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type GroupCommunistParty = {
    id?: number;
    name?: string;
    create_at?: Date;
    trangThai?: boolean;

    update_at?: Date;
  }


  type JobPosition = {
    id?: number;
    name?: string;
    create_at?: Date;
    trangThai?: boolean;
    update_at?: Date;
    tienLuong?: number;
    bacLuongId: number,
    bacLuongName: string,
  }

  type TypeBonus = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }


  type RankCommunistParty = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
  }


  type ProfessionalLevel = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;

  }

  type Organ = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }


  type RankSalary = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type GroupBlood = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    trangThai?: boolean;
  }

  type Employee = {
    id: number,
    hoVaTen: string,
    danTocName: string,
    gioiTinh: string,
    soCCCD: string,
    sinhNgay: string,
    chucVuDangHienTaiName: string,
    queQuan: string,
    ngachNgheNghiep: string,
    create_at: Date,
    update_at: Date,
    trang_thai: boolean,
    pheDuyet: XACNHAN,
  }

  interface ThongTinTuyenDung {
    ngheNghiepTruocKhiTuyenDung: string;
    ngayDuocTuyenDungLanDau: string;
    ngayVaoCoQuanHienDangCongTac: string;
    ngayVaoDangCongSanVietNam: string;
    ngayChinhThuc: string;
    ngayThamGiaToChucChinhTriXaHoiDauTien: string;
    congViecChinhDuocGiao: string;
    soTruongCongTac: string;
    congViecLamLauNhat: string;
  }

  interface QuanSu {
    ngayNhapNgu: string;
    ngayXuatNgu: string;
    capBacLoaiQuanHamQuanDoi: number;
    capBacLoaiQuanHamQuanDoiName: string;
  }

  interface HocVan {
    trinhDoGiaoDucPhoThong: number;
    trinhDoGiaoDucPhoThongName: string;
    trinhDoChuyenMon: number;
    trinhDoChuyenMonName: string;
    hocHam: number;
    hocHamName: string;
    danhHieuNhaNuocPhongTang: number;
    danhHieuNhaNuocPhongTangName: string;
  }

  interface ChucVu {
    chucVuHienTaiId: number;
    chucVuHienTaiName: string;
    ngayBoNhiem: string;
    ngayBoNhiemLai: string;
    duocQuyHoacChucDanh: string;
    phuCapChucVu: number;
    coQuanToChucDonViTuyenDungId: number;
    coQuanToChucDonViTuyenDungName: string;
    hoSoId: string;
  }

  interface ChucVuKiemNhiem {
    chucVuKiemNhiemId: number;
    chucVuKiemNhiemName: string;
    ngayBoNhiem: string;
    phuCapKiemNhiem: number;
    phuCapKhac: number;
    hoSoId: string;
  }

  interface Ngach {
    ngachId: string;
    ngachName: string;
    heSoLuongId: number;
    nhomId: number;
    nhomName: string;
    loaiId: number;
    loaiLoai: string;
    loaiName: string;
    bacLuongId: number;
    bacLuongName: string;
    heSo: number;
    ngayBoNhiemNgach: string;
    ngayHuongLuongNgach: string;
    phanTramHuongLuongNgach: number;
    phuCapThamNienVuotKhungNgach: number;
    ngayHuongPCTNVKNgach: string;
  }

  interface ViecLam {
    viTriViecLamId: number;
    viTriViecLamName: string;
    bacLuongId: number;
    bacLuongName: string;
    tienLuong: number;
    ngayHuongLuongViTriViecLam: string;
    phamTramHuongLuong: number;
    phuCapThamNienVuotKhung: number;
    ngayHuongPCTNVK: string;
  }

  interface SucKhoe {
    tinhTrangSucKhoe: string;
    chieuCao: number;
    canNang: number;
    nhomMau: number;
    nhomMauName: string;
  }


  type Profile = {
    id: string;
    hoVaTen: string;
    gioiTinh: string;
    cacTenGoiKhac: string;
    sinhNgay: string;
    noiSinh: string;
    queQuan: string;
    danToc: number;
    danTocName: string;
    tonGiao: number;
    tonGiaoName: string;
    soCCCD: string;
    ngayCapCCCD: string;
    soDienThoai: string;
    soBHXH: string;
    soBHYT: string;
    noiOHienNay: string;
    thanhPhanGiaDinh: number;
    thanhPhanGiaDinhName: string;
    thongTinTuyenDung: ThongTinTuyenDung;
    quanSu: QuanSu;
    doiTuongChinhSach: number;
    doiTuongChinhSachName: string;
    hocVan: HocVan;
    chucVu: ChucVu;
    chucVuKiemNhiem: ChucVuKiemNhiem;
    chucVuDangHienTai: number;
    chucVuDangHienTaiName: string;
    chucVuDangKiemNhiem: number;
    chucVuDangKiemNhiemName: string;
    tienLuong: number;
    ngach: Ngach;
    viecLam: ViecLam;
    sucKhoe: SucKhoe;
    taiKhoan: number;
    pheDuyet: string;
    create_at: string;
    update_at: string;
  }

  type WorkOld = {
    id: number,
    batDau: string
    ketThuc: sring
    chucDanhDonViDiaDiem: string
    create_at: string
    update_at: string
  }

  type Languages = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    tenNgoaiNgu: string,
    chungChiDuocCap: string,
    diemSo: number,
    create_at: string
    update_at: string
  }

  type TechNo = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    chungChiDuocCap: string,
    create_at: string
    update_at: string
  }

  type RelateFamily = {
    id: number,
    moiQuanHe: string,
    namSinh: string,
    thongTinThanNhan: string,
    create_at: string,
    update_at: string,
  }

  type TypeOfPublicServant = {
    id: number,
    loai: string,
    name: string,
    create_at: string,
    update_at: string,
  }

  type NumberSalaryCivilServant = {
    id: number,
    heSo: number,
    bacLuongId: number,
    bacLuongName: string,
    nhomCongChucId: number,
    nhomCongChucName: string,
  }

  type CivilServantGroup = {
    id: number,
    name: string,
    loaiCongChucId: number,
    loaiCongChucLoai: string,
    create_at: string,
    update_at: string,
  }


  type TypeOfOfficials = {
    id: number,
    name: string,
    loai: string,
  }


  type GoOnBussiness = {
    id: number,
    donViCongTac: string,
    chucDanh: string,
    batDau: string
    ketThuc: sring
    loaiSoYeuLyLichChiTiet: sring
    create_at: string,
    update_at: string
  }

  type GroupOfOfficials = {
    id: number,
    name: string,
    loaiVienChucId: number,
    loaiVienChucLoai: string,
    create_at: string,
  }

  type NumberSalaryOfficials = {
    id: number,
    heSo: number,
    bacLuongId: number,
    bacLuongName: string,
    nhomVienChucId: number,
    nhomVienChucName: string,
  }

  type OtherAllowance = {
    id: number,
    phanTramHuongPhuCap: number,
    loaiPhuCap: string,
    batDau: string
    ketThuc: sring
    hinhThucThuong: sring,
    giaTri: number,
    create_at: string,
    update_at: string
  }

  type MajorBuz = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    chungChiDuocCap: string,
    create_at: string
    update_at: string
  }

  type MajorBuz = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    chungChiDuocCap: string,
    create_at: string
    update_at: string
  }

  type PoliticalTheory = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    hinhThucDaoTao: string,
    vanBangDuocCap: string,
    create_at: string
    update_at: string
  }

  type MySalary = {
    id: number,
    batDau: string
    ketThuc: sring
    heSoLuong: string,
    bacLuong: string,
    maSo: string,
    tienLuongTheoViTri: number,
    create_at: string
    update_at: string
  }



  type WorkingAbroad = {
    id: number,
    batDau: string
    ketThuc: sring
    toChucDiaChiCongViec: string,
    create_at: string
    update_at: string
  }

  type KnowArmy = {
    id: number,
    batDau: string
    ketThuc: sring
    tenCoSoDaoTao: string,
    chungChiDuocCap: string,
    create_at: string
    update_at: string
  }


  type Bonus = {
    id: number,
    nam: number,
    xepLoaiChuyenMon: string
    xepLoaiThiDua: sring
    hinhThucKhenThuong: string,
    create_at: string
    update_at: string


  }

  type AdminBonus = {
    id: number,
    nam: number,
    xepLoaiChuyenMon: string
    xepLoaiThiDua: sring
    hinhThucKhenThuongName: string,
    hinhThucKhenThuongId: string,
    nam: string,
    sinhNgay: string
    soCCCD: string,
    hoSoId: string,
    lyDo: string,
    hovaten: string,
    xacNhan: XACNHAN,
    xepLoaiChuyenMon: "LOAI_A" | "LOAI_B" | "LOAI_C" | "LOAI_D",
  }

  type AdminDiscipline = {
    id: number,
    nam: number,
    coQuanQuyetDinh: string
    hanhViViPhamChinh: sring
    coQuanQuyetDinhId: string,
    coQuanQuyetDinhName: string,
    hinhThuc: string,
    batDau: string,
    ketThuc: string,
    create_at: string
    update_at: string,
    sinhNgay: string
    soCCCD: string,
    hoVaTen: string,
    xacNhan: XACNHAN,

  }

  type AdminGoOnBuss = {
    id: number,
    donViCongTacName: string
    donViCongTacId: number,
    chucDanh: string,
    batDau: string,
    ketThuc: string,
    create_at: string
    update_at: string,
    sinhNgay: string
    soCCCD: string,
    hoVaTen: string,
    hoSoId: string,
    xacNhan: XACNHAN,
  }

  type AdminCerLang = {
    id: number,
    hoSoId: string,
    batDau: string,
    hoVaTen: string,
    soCCCD: string,
    ketThuc: string,
    tenCoSoDaoTaoName: string,
    tenCoSoDaoTaoId: number,
    tenNgoaiNgu: string,
    chungChiDuocCap: string,
    diemSo: number,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string
  }

  type AdminCerTech = {
    id: number,
    hoSoId: string,
    batDau: string,
    hoVaTen: string,
    soCCCD: string,
    ketThuc: string,
    tenCoSoDaoTao: string,
    tenCoSoDaoTaoName: number,
    tenTinHoc: string,
    chungChiDuocCap: string,
    diemSo: number,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string
  }

  type AdminProfessionalKnowledge = {
    id: number,
    hoSoId: string,
    batDau: string,
    hoVaTen: string,
    soCCCD: string,
    ketThuc: string,
    tenCoSoDaoTaoName: string,
    tenCoSoDaoTaoId: number,
    chungChiDuocCap: string,
    diemSo: number,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string
  }

  type XACNHAN = 'CHO_PHE_DUYET' | 'DA_PHE_DUYET' | 'TU_CHOI'

  type AdminPoliticalTheory = {
    id: number,
    maSyll: string,
    batDau: string,
    hovaten: string,
    soCMND: string,
    ketThuc: string,
    tenCoSoDaoTao: string,
    IdTenCoSoDaoTao: number,
    hinhThucDaoTao: string,
    vanBangDuocCap: string,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string,
  }


  type AdminWorkingAbroad = {
    id: number,
    maSyll: string,
    batDau: string,
    hovaten: string,
    soCMND: string,
    ketThuc: string,
    toChucDiaChiCongViec: string,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string,
  }



  type AdminArmy = {
    id: number,
    maSyll: string,
    batDau: string,
    hovaten: string,
    soCMND: string,
    ketThuc: string,
    xacNhan: XACNHAN
    create_at: string,
    update_at: string,
    tenCoSoDaoTao: string,
    IdTenCoSoDaoTao: number,
    chungChiDuocCap: string,
  }

  type Discipline = {
    id: number,
    batDau: string
    ketThuc: sring
    hinhThuc: string
    coQuanQuyetDinh: sring
    hanhViViPhamChinh: string,
    create_at: string
    update_at: string
  }




  type ThongTinCanBo = {
    hoVaTen: string;
    gioiTinh: 'NAM' | 'NU';
    cacTenGoiKhac?: string;
    sinhNgay: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
    noiSinh: string;
    queQuan: string;
    danToc: number;
    tonGiao: number;
    soCCCD: string;
    ngayCapCCCD: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
    soDienThoai: string;
    soBHXH: string;
    soBHYT: string;
    noiOHienNay: string;
    thanhPhanGiaDinh: number;
    thongTinTuyenDung: {
      ngheNghiepTruocKhiTuyenDung: string;
      ngayDuocTuyenDungLanDau: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayVaoCoQuanHienDangCongTac: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayVaoDangCongSanVietNam: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayChinhThuc: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayThamGiaToChucChinhTriXaHoiDauTien: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      congViecChinhDuocGiao: string;
      soTruongCongTac: string;
      congViecLamLauNhat: string;
    };
    quanSu: {
      ngayNhapNgu: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayXuatNgu: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      capBacLoaiQuanHamQuanDoi: number;
    };
    doiTuongChinhSach: number;
    hocVan: {
      trinhDoGiaoDucPhoThong: number;
      trinhDoChuyenMon: number;
      hocHam: number;
      danhHieuNhaNuocPhongTang: number;
    };
    chucVu: {
      chucVuHienTaiId: number;
      ngayBoNhiem: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayBoNhiemLai: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      duocQuyHoacChucDanh: string;
      phuCapChucVu: number;
      coQuanToChucDonViTuyenDungId: number;
    };
    chucVuKiemNhiem: {
      chucVuKiemNhiemId: number;
      ngayBoNhiem: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      phuCapKiemNhiem: number;
      phuCapKhac: number;
    };
    chucVuDangHienTai: number;
    chucVuDangKiemNhiem: number;
    tienLuong: number;
    ngach: {
      ngachId: string;
      ngayBoNhiemNgach: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      ngayHuongLuongNgach: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      phanTramHuongLuongNgach: number;
      phuCapThamNienVuotKhungNgach: number;
      ngayHuongPCTNVKNgach: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
    };
    phuCapChucVu: number;
    phuCapKiemNhiem: number;
    phuCapKhac: number;
    viecLam: {
      viTriViecLamId: number;
      ngayHuongLuongViTriViecLam: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
      phamTramHuongLuong: number;
      phuCapThamNienVuotKhung: number;
      ngayHuongPCTNVK: string; // Dạng ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
    };
    sucKhoe: {
      tinhTrangSucKhoe: 'TOT' | 'BINH_THUONG' | 'YEU';
      chieuCao: number;
      canNang: number;
      nhomMau: number;
    };
    pheDuyet: string;
  }

  type BonusAddNewProps = {
    actionRef: any;
    createModalOpen: boolean;
    handleModalOpen: function;
    id?: string;
  }


  type DisciplineAddNewProps = {
    actionRef: any;
    open: boolean;
    handleOpen: function;
    id?: string;
  }


  type GOBAddNewProps = {
    actionRef: any;
    open: boolean;
    handleOpen: function;
    id?: string;
    name?: string;
    soCMND?: string;
  }

  type CerLangAddNewProps = {
    actionRef: any;
    open: boolean;
    handleOpen: function;
    id?: string;
    name?: string;
    soCMND?: string;
  }


  type SORT = "createAt" | "updateAt";

  type CerTechAddNewProps = {
    actionRef: any;
    open: boolean;
    handleOpen: function;
    id?: string;
    name?: string;
    soCMND?: string;
  }

  type SelectedRow = {
    id: string
  }
  type ModalApproval = {
    openApproval: boolean;
    setOpenApproval: (boolean) => void;
    actionRef: any;
    selectedRow: SelectedRow[];
    subDirectory: string;

  }

}

