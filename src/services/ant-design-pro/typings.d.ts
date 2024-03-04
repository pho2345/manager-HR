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
    status_code?: number;
    message?: string;
    data?: {
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
    hoVaten: string,
    soCCCD: string,
    username: string,
    email: string,
    maSoYeuLyLich: string,
    role: "ADMIN" | "EMPLOYEE",
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
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    heSoLuongCongChuc?: number;
    trangThai?: boolean;
  }

  type CivilServantRank = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
  }


  type Officer = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    heSoLuongVienChuc?: number;
    trangThai?: boolean;
  }

  type OfficerRank = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
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
  }

  type GroupCommunistParty = {
    id?: number;
    name?: string;
    create_at?: Date;
    status?: boolean;
    update_at?: Date;
  }

  
  type JobPosition = {
    id?: number;
    name?: string;
    create_at?: Date;
    status?: boolean;
    update_at?: Date;
    bacLuong?: number;
    tienLuong?: number;
  }

  type TypeBonus = {
    id?: number;
    name?: string;
    create_at?: Date;
    update_at?: Date;
    status?: boolean;
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
    status?: boolean;
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
    ho_va_ten: string,
    sinhNgay: Date,
    chucVuHienTai: string,
    trinhDoChuyenMon: string,
    ngachNgheNghiep: string,
    create_at: Date,
    update_at: Date,
    trang_thai: boolean
  }

  type Profile = {
    hovaten: string,
    gioiTinh: string,
    cacTenGoiKhac: string,
    sinhNgay: Date,
    noiSinh: string,
    queQuan: string,
    danToc: string,
    soCCCD: string,
    ngayCapCCCD: string,
    soDienThoai: string,
    soBHXH: string,
    soBHYT: string,
    noiOHienNay: string,
    thanhPhanGiaDinh: string,
    ngheNghiepTruocKhiTuyenDung: string,
    ngayDuocTuyenDungLanDau: string,
    coQuanToChucDonViTuyenDung: string,
    ngayVaoCoQuanHienDangCongTac: string,
    ngayVaoDangCongSanVietNam: string,
    ngayChinhThuc: string,
    ngayThamGiaToChucChinhTriXaHoiDauTien: string,
    ngayNhapNgu: string,
    ngayXuatNgu: string
    capBacLoaiQuanHamQuanDoi: string,
    doiTuongChinhSach: string,
    trinhDoGiaoDucPhoThong: string,
    trinhDoChuyenMon: string,
    hocHam: string,
    danhHieuNhaNuocPhongTang: string,
    chucVuHienTai: string,
    ngayBoNhiem: string,
    ngayBoNhiemLai: string,
    duocQuyHoacChucDanh: string,
    chucVuKiemNhiem: string,
    chucVuDangHienTai: string,
    chucVuDangKiemNhiem: string,
    congViecChinhDuocGiao: string,
    soTruongCongTac: string,
    congViecLamLauNhat: string,
    tienLuong: number,
    ngachNgheNghiep: string,
    maSoNgachNgheNghiep: string,
    ngayBoNhiemNgachNgheNghiep: string,
    bacLuong: string,
    heSoLuongNgachNgheNghiep: number,
    ngayHuongLuongNgachNgheNghiep: string,
    phanTramHuongLuongNgachNgheNghiep: number,
    phuCapThamNienVuotKhungNgachNgheNghiep: number,
    ngayHuongPCTNVKNgachNgheNghiep: string,
    phuCapChucVu: number,
    phuCapKiemNhiem: number,
    phuCapKhac: number,
    viTriViecLam: string,
    maSoViTriViecLam: string,
    bacLuongTriViecLam: number,
    luongTheoMucTien: number,
    ngayHuongLuongTheoViTriViecLam: string,
    phamTramHuongLuong: number,
    phuCapThamNienVuotKhung: number,
    ngayHuongPCTNVK: string,
    tinhTrangSucKhoe: string,
    chieuCao: number,
    canNang: number,
    nhomMau: string,
    luongThucNhan: number
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
    hoVaTen: string,
    namSinh: string,
    thongTinThanNhan: string,
    create_at: string,
    update_at: string
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
}
