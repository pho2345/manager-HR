import {
  getCustome,
  patch,
} from '@/services/ant-design-pro/api';
import {
  ProFormDatePicker,
  ProFormSelect,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProCard,
  StepsForm,
  ProFormSwitch,
  ProFormInstance,
  ProFormDigit,
} from '@ant-design/pro-components';
import {
  Descriptions,
  Image
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
  FormattedMessage,
  useModel,
  useParams
} from '@umijs/max';
import {  Button, Col, Modal, Row, message, Form } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { displayTime, formatter, getOption, getProvine, handleTime, parser } from '@/services/utils';
import { SEX, TINH_TRANG_SUC_KHOE, mapSex, mapTinhTrangSucKhoe, mapXacNhan } from '@/services/utils/constant';


const getProfile = async (setProfile: any, setLoading: any) => {
  setLoading(true);
  try {
    const profile = await getCustome(`${SERVER_URL_PROFILE}/ca-nhan/ho-so`);
    if (profile.success) {
      setProfile(profile.data)
    }
  } catch (error) {

  }
  setLoading(false);
};






const TableList: React.FC = () => {
  const [form] = Form.useForm<any>();

  const [profile, setProfile] = useState<GEN.Profile>();
  const [loading, setLoading] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { nation, religion, groupBlood, officialRank, civilServantRank, position, 
    organization, 
    rankCommunistParty, 
    militaryRank,
    positionJob,
    policyObject,
    secondaryEducation,
    professionalLevel,
    stateRank,
    academicLevel,
    memberFamily
   } = initialState || {};




  const [officer, setOfficer] = useState<GEN.Option[]>([]);
  const [civilServant, setCivilServant] = useState<GEN.Option[]>([]);
  const [checkOfficer, setCheckOfficer] = useState<boolean>(true);

  const formRef = useRef<ProFormInstance>();

  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      try {
        getProfile(setProfile, setLoading);
        const getofficer = await getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name');
        const getcivilServant = await getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc?page=0&size=100`, 'ma', 'name');

        setOfficer(getofficer);
        setCivilServant(getcivilServant)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getValues();
  }, []);

  const disabledBirthdate = (current: any) => {
    // Lấy ngày hiện tại
    const today = moment();
    // Trừ đi 18 năm từ ngày hiện tại
    const eighteenYearsAgo = today.subtract(18, 'years');
    // Trả về true nếu current là ngày sau eighteenYearsAgo
    return current && current > eighteenYearsAgo;
  };


  const handleSession = (value: any) => {
    const getSessionInfo = sessionStorage.getItem(ID_SAVE_INFO);
    if (getSessionInfo) {
      const parseSessionInfor = JSON.parse(getSessionInfo);
      if (value?.hovaten) {
        sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(value)); // TODO: CREATE NEW SESSION WHEN CHECK FORM 1
        return;
      }
      else {
        const newValueSession = {
          ...parseSessionInfor,
          ...value
        };
        sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(newValueSession));
      }
    }
    else {
      sessionStorage.setItem(ID_SAVE_INFO, JSON.stringify(value));
    }
  }


  const refresh = useCallback(() => {
    getProfile(setProfile, setLoading);
  }, [profile])




  // const disabledDate = (current: any) => {
  //   return current && current > moment();
  // };

  const onShowModalUpdate = async () => {
    setUpdate(true);
    onUpdateModel()
  }


  const onUpdateModel = async () => {
    if (formRef.current) {
      const profile = await getCustome('/ca-nhan/so-yeu-ly-lich');
      formRef.current.setFieldsValue({
        ...profile.data
      });
    }
  }


  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const disabledDate = (current: any) => {
    return current && current > moment();
  };

  const updateProfile = async (data: GEN.ThongTinCanBo) => {
    const up = await patch(`${SERVER_URL_ACCOUNT}/ca-nhan/ho-so`, data);
    if (up) {
      message.success("Cập nhật thành công");
      // setVisible(false);
      // if (actionRef.current) {
      //   actionRef.current?.reloadAndRest?.();
      // }
      refresh()
    }
  }



  // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
  //   if (fileList.length > 5) {
  //     const maxImages = newFileList.slice(0, 5);
  //     setFileList(maxImages);
  //   }
  //   else {
  //     setFileList(newFileList);
  //   }
  // }

  // const handleRemoveImage = (file: any) => {
  //   const updatedFileList = fileList.filter((f: any) => f.uid !== file.uid);
  //   setFileList(updatedFileList);
  // };


  //

  const [update, setUpdate] = useState(false);

  return (
    !params.id ? (
      <div
        style={{
          background: '#F5F7FA',
        }}
      >
        <PageContainer
          loading={loading}
          ghost
          header={{
            // title: 'Thông tin',
            breadcrumb: {},
          }}
          extra={[
            <Button key="1" type="dashed" onClick={onShowModalUpdate}>
              Cập nhật
            </Button>,

            <Button key="2" type="primary" onClick={() => refresh()}>
              Làm mới
            </Button>,
          ]}
        >

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              gap: 12,
              fontWeight: 'bolder'
            }}
          >
            <ProCard title={<>Thông tin cơ bản {" "} {mapXacNhan(profile?.pheDuyet)}</>} type="inner" bordered>
              <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}>{profile?.hoVaTen ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}>{profile?.cacTenGoiKhac ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.birthdate" defaultMessage="Ngày sinh" />}>{displayTime(profile?.sinhNgay)}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}>{mapSex(profile?.gioiTinh) ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}>{profile?.soCCCD ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}>{displayTime(profile?.ngayCapCCCD)}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}>{profile?.danTocName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={`Tôn giáo`}>{profile?.tonGiaoName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}>{profile?.noiSinh ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}>{profile?.queQuan ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}>{profile?.soDienThoai ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}>{profile?.soBHXH ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}>{profile?.soBHYT ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}>{profile?.noiOHienNay ?? ""}</Descriptions.Item>
                <Descriptions.Item label={`Thành phần gia đình xuất thân`}>{profile?.thanhPhanGiaDinhName ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}>{profile?.sucKhoe?.chieuCao ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.weight" defaultMessage="Cân nặng" />}>{profile?.sucKhoe?.canNang ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}>{profile?.sucKhoe?.nhomMauName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Tình trạng sức khỏe"}>{mapTinhTrangSucKhoe(profile?.sucKhoe?.tinhTrangSucKhoe) ?? ""}</Descriptions.Item>
              </Descriptions>
            </ProCard>
            <ProCard title={"Nghề nghiệp trước"} type="inner" headerBordered
              collapsible
              defaultCollapsed
              bodyStyle={{
                fontWeight: 'bolder'
              }}>
              <Descriptions column={3} style={{ marginBlockEnd: 0 }} >
                <Descriptions.Item label={"Nghề nghiệp trước khi được tuyển dụng"}>{profile?.thongTinTuyenDung?.ngheNghiepTruocKhiTuyenDung ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Ngày được tuyển dụng lần đầu"}>{displayTime(profile?.thongTinTuyenDung?.ngayDuocTuyenDungLanDau)}</Descriptions.Item>
                <Descriptions.Item label={"Ngày vào cơ quan hiện đang công tác"}>{displayTime(profile?.thongTinTuyenDung?.ngayVaoCoQuanHienDangCongTac)}</Descriptions.Item>
                <Descriptions.Item label={"Ngày vào Đảng Cộng sản Việt Nam"}> {displayTime(profile?.thongTinTuyenDung?.ngayVaoDangCongSanVietNam)} </Descriptions.Item>
                <Descriptions.Item label={"Ngày chính thức"}>{displayTime(profile?.thongTinTuyenDung?.ngayChinhThuc)}</Descriptions.Item>
              </Descriptions>
            </ProCard>


            <ProCard title={"Học vấn"} type="inner" headerBordered
              collapsible
              defaultCollapsed
              bodyStyle={{
                fontWeight: 'bolder'
              }}>
              <Descriptions column={3} style={{ marginBlockEnd: 0 }} title={"Thông tin nhập ngũ"}>
                <Descriptions.Item label={"Ngày nhập ngũ"}>{displayTime(profile?.quanSu?.ngayNhapNgu)}</Descriptions.Item>
                <Descriptions.Item label={"Ngày xuất ngũ"}>{displayTime(profile?.quanSu?.ngayXuatNgu)}</Descriptions.Item>
                <Descriptions.Item label={"Quân hàm cao nhất"}>{profile?.quanSu?.capBacLoaiQuanHamQuanDoiName ?? ""}</Descriptions.Item>
              </Descriptions>

              <Descriptions column={3} style={{ marginBlockEnd: 0 }} title={"Học vấn"}>
                <Descriptions.Item label={"Đối tượng chính sách"}>{profile?.doiTuongChinhSachName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Trình độ giáo dục phổ thông"}>{profile?.hocVan?.trinhDoGiaoDucPhoThongName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Trình độ chuyên môn cao nhất"}>{profile?.hocVan?.trinhDoChuyenMonName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Học hàm"}>{profile?.hocVan?.hocHamName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Danh hiệu nhà nước phong tặng"}>{profile?.hocVan?.danhHieuNhaNuocPhongTangName ?? ""}</Descriptions.Item>
              </Descriptions>
            </ProCard>


            <ProCard
              title={<FormattedMessage id="page.profile.card.tilte.job" defaultMessage="Chức vụ" />}
              headerBordered
              collapsible
              defaultCollapsed
              bodyStyle={{
                fontWeight: 'bolder'
              }}
            >

              <Descriptions column={2} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Chức vụ"}>
                {/* <Descriptions.Item label={"Chức vụ hiện tại"}>{profile?.chucVuDangHienTai ?? ""}</Descriptions.Item> */}
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}>{displayTime(profile?.chucVu?.ngayBoNhiem)}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}>{displayTime(profile?.chucVu?.ngayBoNhiemLai)}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}>{profile?.chucVu?.duocQuyHoacChucDanh ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}>{profile?.chucVuKiemNhiem?.chucVuKiemNhiemName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}>{profile?.chucVuDangHienTaiName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}>{profile?.chucVuDangKiemNhiemName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính được giao" />}>{profile?.thongTinTuyenDung?.congViecChinhDuocGiao ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}>{profile?.thongTinTuyenDung?.soTruongCongTac ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}>{profile?.thongTinTuyenDung?.congViecLamLauNhat ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Tiền lương"}>{profile?.tienLuong ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Cơ quan, tổ chức, đơn vị tuyển dụng"}>{profile?.chucVu?.coQuanToChucDonViTuyenDungName ?? ""}</Descriptions.Item>
              </Descriptions>

              <Descriptions column={2} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Ngạch nghề nghiệp"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}>{profile?.ngach?.ngachName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.codeQuotaCareer" defaultMessage="Mã ngạch nghề nghiệp" />}>{profile?.ngach?.ngachId ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}>{displayTime(profile?.ngach?.ngayBoNhiemNgach)}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberSalaryQuotaCareer" defaultMessage="Bậc lương ngạch nghề nghiệp" />}>{profile?.ngach?.bacLuongName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberSalaryQuotaCareer" defaultMessage="Hệ số lương ngạch nghề nghiệp" />}>{profile?.ngach?.heSo ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}>{displayTime(profile?.ngach?.ngayHuongLuongNgach)}</Descriptions.Item>
                <Descriptions.Item style={{
                  fontWeight: 'bolder'
                }} label={"Phần trăm hưởng lương ngạch nghề nghiệp (%)"}>{profile?.ngach?.phanTramHuongLuongNgach ?? ""} </Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp thâm niên vượt khung ngạch nghề nghiệp (vnđ)"}>{profile?.ngach?.phuCapThamNienVuotKhungNgach?.toLocaleString?.() ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}>{displayTime(profile?.ngach?.ngayHuongPCTNVKNgach)}</Descriptions.Item>
              </Descriptions>

              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Vị trí việc làm"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.workplace" defaultMessage="Vị trí việc làm" />}>{profile?.viecLam?.viTriViecLamName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Mã số"}>{profile?.viecLam?.viTriViecLamId ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Bậc lương"}>{profile?.viecLam?.bacLuongName ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Lương theo mức tiền (vnđ)"}>{profile?.viecLam?.tienLuong?.toLocaleString() ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Ngày hưởng"}>{displayTime(profile?.viecLam?.ngayHuongLuongViTriViecLam)}</Descriptions.Item>
                <Descriptions.Item label={"Phần trăm hưởng (%)"}>{profile?.viecLam?.phamTramHuongLuong ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Phụ cấp thâm niên vượt khung (vnđ)"}>{profile?.viecLam?.phuCapThamNienVuotKhung ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Ngày hưởng PCTNVK"}>{displayTime(profile?.viecLam?.ngayHuongPCTNVK)}</Descriptions.Item>
              </Descriptions>
            </ProCard>
            {/* 
            <ProCard
              bordered
              title="Sức khỏe"
              headerBordered
              collapsible
              defaultCollapsed
            >
              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Lưởng"}>
                <Descriptions.Item label={'Tình trạng sức khoẻ'}>{profile?.sucKhoe.tinhTrangSucKhoe}</Descriptions.Item>
                <Descriptions.Item label={'Chiều cao (cm)'}>{profile?.sucKhoe.chieuCao ?? ""}</Descriptions.Item>
                <Descriptions.Item label={'Cân nặng (kg)'}>{profile?.sucKhoe.canNang ?? ""}</Descriptions.Item>
                <Descriptions.Item label={'Nhóm máu'}>{profile?.sucKhoe.nhomMauName ?? ""}</Descriptions.Item>

              </Descriptions>
            </ProCard> */}
          </div>


          <StepsForm<{
            name: string;
          }>
            // onFormChange={(name: string, profile) => {
            //   console.log('profile', profile)
            // }}

            onCurrentChange={(value: number) => {
              
            }}
            onFinish={async (value) => {

              let sesstion = JSON.parse(sessionStorage.getItem(ID_SAVE_INFO) as any);
              const dateAll = {
                ...sesstion,
                ...value
              }
              const data: GEN.ThongTinCanBo = {
                hoVaTen: dateAll.hoVaTen,
                gioiTinh: dateAll.gioiTinh,
                cacTenGoiKhac: dateAll.cacTenGoiKhac,
                sinhNgay: moment(dateAll.sinhNgay).toISOString(),
                noiSinh: dateAll.noiSinh,
                queQuan: dateAll.queQuan,
                danToc: dateAll.danToc,
                tonGiao: dateAll.tonGiao,
                soCCCD: dateAll.soCCCD,
                ngayCapCCCD: moment(dateAll.ngayCapCCCD).toISOString(),
                soDienThoai: dateAll.soDienThoai,
                soBHYT: dateAll.soBHYT,
                soBHXH: dateAll.soBHXH,
                noiOHienNay: dateAll.noiOHienNay,
                thanhPhanGiaDinh: dateAll.thanhPhanGiaDinh,
                thongTinTuyenDung: {
                  ngheNghiepTruocKhiTuyenDung: dateAll.ngheNghiepTruocKhiTuyenDung,
                  ngayDuocTuyenDungLanDau: moment(dateAll.ngayDuocTuyenDungLanDau).toISOString(),
                  ngayVaoCoQuanHienDangCongTac: moment(dateAll.ngayVaoCoQuanHienDangCongTac).toISOString(),
                  ngayVaoDangCongSanVietNam: moment(dateAll.ngayVaoDangCongSanVietNam).toISOString(),
                  ngayChinhThuc: moment(dateAll.ngayChinhThuc).toISOString(),
                  ngayThamGiaToChucChinhTriXaHoiDauTien: moment(dateAll.ngayThamGiaToChucChinhTriXaHoiDauTien).toISOString(),
                  congViecChinhDuocGiao: dateAll.congViecChinhDuocGiao,
                  soTruongCongTac: dateAll.soTruongCongTac,
                  congViecLamLauNhat: dateAll.congViecLamLauNhat,
                },
                quanSu: {
                  ngayNhapNgu: moment(dateAll.ngayNhapNgu).toISOString(),
                  ngayXuatNgu: moment(dateAll.ngayXuatNgu).toISOString(),
                  capBacLoaiQuanHamQuanDoi: dateAll.capBacLoaiQuanHamQuanDoi,
                },
                doiTuongChinhSach: dateAll.doiTuongChinhSach,

                hocVan: {
                  trinhDoGiaoDucPhoThong: dateAll.trinhDoGiaoDucPhoThong,
                  trinhDoChuyenMon: dateAll.trinhDoChuyenMon,
                  hocHam: dateAll.hocHam,
                  danhHieuNhaNuocPhongTang: dateAll.danhHieuNhaNuocPhongTang,
                },
                chucVu: {
                  chucVuHienTaiId: dateAll.chucVuHienTai,
                  ngayBoNhiem: moment(dateAll.ngayBoNhiemChucVu).toISOString(),
                  ngayBoNhiemLai: moment(dateAll.ngayBoNhiemLai).toISOString(),
                  duocQuyHoacChucDanh: dateAll.duocQuyHoacChucDanh,
                  phuCapChucVu: dateAll?.phuCapChucVu || 0,
                  coQuanToChucDonViTuyenDungId: dateAll.coQuanToChucDonViTuyenDungId,
                },

                chucVuKiemNhiem: {
                  chucVuKiemNhiemId: dateAll.chucVuDangKiemNhiem,
                  ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                  phuCapKiemNhiem: parseInt(dateAll.phuCapKiemNhiem) || 0,
                  phuCapKhac: parseInt(dateAll.phuCapKhac) || 0,
                },
                chucVuDangHienTai: dateAll.chucVuDangHienTai,
                chucVuDangKiemNhiem: dateAll.chucVuDangKiemNhiem,
                tienLuong: dateAll.tienLuong,
                ngach: {
                  ngachId: dateAll.ngachNgheNghiep,
                  ngayBoNhiemNgach: moment(dateAll.ngayBoNhiemNgach).toISOString(),
                  ngayHuongLuongNgach: moment(dateAll.ngayHuongLuongNgach).toISOString(),
                  phanTramHuongLuongNgach: parseFloat(dateAll.phanTramHuongLuongNgach) || 0,
                  phuCapThamNienVuotKhungNgach: parseFloat(dateAll.phuCapThamNienVuotKhungNgach) || 0,
                  ngayHuongPCTNVKNgach: moment(dateAll.ngayHuongPCTNVKNgach).toISOString(),
                },
                phuCapChucVu: dateAll.phuCapChucVu,
                phuCapKiemNhiem: dateAll.phuCapKiemNhiem,
                phuCapKhac: dateAll.phuCapKhac,
                viecLam: {
                  viTriViecLamId: dateAll.viTriViecLam,
                  ngayHuongLuongViTriViecLam: moment(dateAll.ngayHuongLuongViTriViecLam).toISOString(),
                  phamTramHuongLuong: parseFloat(dateAll.phamTramHuongLuong) || 0,
                  phuCapThamNienVuotKhung: parseFloat(dateAll.phuCapThamNienVuotKhung) || 0,
                  ngayHuongPCTNVK: moment(dateAll.ngayHuongPCTNVK).toISOString(),
                },
                sucKhoe: {
                  tinhTrangSucKhoe: dateAll.tinhTrangSucKhoe || "TOT",
                  chieuCao: dateAll.chieuCao,
                  canNang: dateAll.canNang,
                  nhomMau: dateAll.nhomMau,
                },
                "pheDuyet": "CHO_PHE_DUYET"
              }

              await updateProfile(data);
              setUpdate(false);
              return true
            }}
            formProps={{
              validateMessages: {
                required: "Lỗi",
              },
            }}

            stepsFormRender={(dom, submitter) => {
              return (
                <Modal
                  title="Cập nhật viên chức"
                  width={800}
                  onCancel={() => setUpdate(false)}
                  open={update}
                  footer={submitter}
                  destroyOnClose={true}
                  onOk={() => {
                  }}
                >
                  {dom}
                </Modal>
              );
            }}
          >
            <StepsForm.StepForm<{
              name: string;
            }>
              name="base"
              title="Thông tin chung"
              stepProps={{
              }}
              formRef={form as any}

              initialValues={{
                hoVaTen: profile?.hoVaTen,
                gioiTinh: profile?.gioiTinh || null,
                danToc: profile?.danToc || null,
                tonGiao: profile?.tonGiao || null,
                sinhNgay: handleTime(profile?.sinhNgay),
                soCCCD: profile?.soCCCD ?? null,
                soDienThoai: profile?.soDienThoai ?? null,
                soBHXH: profile?.soBHXH ?? null,
                soBHYT: profile?.soBHYT ?? null,
                noiOHienNay: profile?.noiOHienNay ?? null,
                queQuan: profile?.queQuan ?? null,
                cacTenGoiKhac: profile?.cacTenGoiKhac ?? null,
                noiSinh: profile?.noiSinh ?? null,
                tinhTrangSucKhoe: profile?.sucKhoe?.tinhTrangSucKhoe ?? null,
                chieuCao: profile?.sucKhoe?.chieuCao ?? null,
                nhomMau: profile?.sucKhoe?.nhomMau ?? null,
                ngayCapCCCD: handleTime(profile?.ngayCapCCCD),
                canNang: profile?.sucKhoe?.canNang ?? null,
              }}
              onFinish={async (value: object) => {
                handleSession(value);
                return true
              }}
            >
              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    name="hoVaTen"
                    label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}
                    placeholder={configDefaultText["page.listCow.column.name"]}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.name" defaultMessage="Họ tên" /> },
                    // ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    name="gioiTinh"
                    showSearch

                    label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}
                    placeholder={"Giới tính"}
                    options={SEX}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" /> }
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormSelect
                    className="w-full"
                    name="danToc"
                    label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}
                    placeholder={"Dân tộc"}
                    showSearch
                    // request={() => getOption(`${SERVER_URL_CONFIG}/dan-toc?page=0&size=100`, 'id', 'name')}
                    options={nation}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" /> }
                    // ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormDatePicker
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledBirthdate
                    }}
                    name="sinhNgay"
                    label={configDefaultText["page.listCow.column.birthdate"]}
                    placeholder={configDefaultText["page.listCow.column.birthdate"]}
                    // rules={[
                    //   { required: true, message: configDefaultText["page.listCow.required.birthdate"] },
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormSelect
                    className="w-full"
                    name="tonGiao"
                    label={"Tôn giáo"}
                    placeholder={"Tôn giáo"}
                    showSearch
                    // request={() => getOption(`${SERVER_URL_CONFIG}/ton-giao`, 'id', 'name')}
                    options={religion}
                    // rules={[
                    //   { required: true, message: "Tôn giáo" }
                    // ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="cacTenGoiKhac"
                    label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}
                    placeholder={"Tên gọi khác"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="soCCCD"
                    label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}
                    placeholder={"CMND/CCCD"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" /> }
                    // ]}

                  />
                </Col>
                <Col span={12} className="gutter-row p-0">
                  <ProFormDatePicker
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
                    }}
                    name="ngayCapCCCD"
                    label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}
                    placeholder={"Ngày cấp CCCD/CMND"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" /> },
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    className="w-full"
                    name="soDienThoai"
                    label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}
                    placeholder={"Số điện thoại"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" /> },
                    // ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="soBHXH"
                    label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}
                    placeholder={"Mã BHXH"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" /> },
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    className="w-full"
                    name="soBHYT"
                    label={"Số BHYT"}
                    placeholder={"Số BHYT"}
                    // rules={[
                    //   { required: true, message: "Số BHYT" },
                    // ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="noiOHienNay"
                    label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}
                    placeholder={"Nơi ở hiện nay"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" /> },
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormSelect
                    className="w-full"
                    name="noiSinh"
                    label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}
                    placeholder={"Nơi sinh"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" /> },
                    // ]}
                    request={() => getProvine()}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="queQuan"
                    label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}
                    placeholder={"Quê quán"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" /> },
                    // ]}
                    request={() => getProvine()}
                  />
                </Col>
              </Row>


              <Row gutter={24} className="m-0">

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="tinhTrangSucKhoe"
                    label={"Tình trạng sức khỏe"}
                    placeholder={"Tình trạng sức khỏe"}
                    // rules={[
                    //   { required: true, message: "Tình trạng sức khỏe" }
                    // ]}
                    options={TINH_TRANG_SUC_KHOE}
                    showSearch
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormDigit
                    className="w-full"
                    name="chieuCao"
                    label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}
                    placeholder={"Chiều cao"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" /> }
                    // ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0">
                  <ProFormDigit
                    className="w-full"
                    name="canNang"
                    label={"Cân nặng (kg)"}
                    placeholder={"Cân nặng"}
                    // rules={[
                    //   { required: true, message: "Cân nặng" }
                    // ]}
                    fieldProps={{
                      min: 30,
                      max: 200,

                    }}

                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="nhomMau"
                    label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}
                    placeholder={"Nhóm máu"}
                    // rules={[
                    //   { required: true, message: <FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" /> }
                    // ]}
                    // request={() => getOption(`${SERVER_URL_CONFIG}/nhom-mau?page=0&size=100`, 'id', 'name')}
                    options={groupBlood}
                  />
                </Col>
              </Row>

            </StepsForm.StepForm>

            <StepsForm.StepForm<{
              name: string;
            }>
              name="base1"
              title="Ngạch, Bậc"
              stepProps={{
              }}
              onFinish={async (value: object) => {
                handleSession(value);
                return true
              }}

              initialValues={{
                ngachNgheNghiep: profile?.ngach?.ngachId ?? null,
                ngayBoNhiemNgach: handleTime(profile?.ngach?.ngayBoNhiemNgach),
                ngayHuongLuongNgach: handleTime(profile?.ngach?.ngayHuongLuongNgach),
                phanTramHuongLuongNgach: profile?.ngach?.phanTramHuongLuongNgach ?? null,
                phuCapThamNienVuotKhungNgach: profile?.ngach?.phuCapThamNienVuotKhungNgach ?? null,
                ngayHuongPCTNVKNgachNgheNghiep: handleTime(profile?.ngach?.ngayHuongPCTNVKNgach),
                // coQuanToChucDonViTuyenDung: profile?.thongTinTuyenDung?.coQuanToChucDonViTuyenDungId,
                // phuCapChucVu: profile?.,
                phuCapKhac: profile?.chucVuKiemNhiem?.phuCapKhac ?? null,
                ngayBoNhiem: handleTime(profile?.chucVu?.ngayBoNhiem),

                // duocQuyHoacChucDanh: profile?.thongTinTuyenDung?.duocQuyHoacChucDanh,

                //thong-tin-tuyen-dung
                ngheNghiepTruocKhiTuyenDung: profile?.thongTinTuyenDung?.ngheNghiepTruocKhiTuyenDung ?? null,
                congViecChinhDuocGiao: profile?.thongTinTuyenDung?.congViecChinhDuocGiao ?? null,
                ngayVaoCoQuanHienDangCongTac: handleTime(profile?.thongTinTuyenDung?.ngayVaoCoQuanHienDangCongTac),
                ngayVaoDangCongSanVietNam: handleTime(profile?.thongTinTuyenDung?.ngayVaoDangCongSanVietNam),
                soTruongCongTac: profile?.thongTinTuyenDung?.soTruongCongTac ?? null,
                congViecLamLauNhat: profile?.thongTinTuyenDung?.congViecLamLauNhat ?? null,
                //
              }}
            >
              <ProCard title={"Ngạch, Bậc"} type="inner" bordered>
                <ProFormSwitch
                  checkedChildren="Công chức"
                  unCheckedChildren="Viên chức"
                  label="Loại"

                  fieldProps={{
                    onChange: (e) => {
                      setCheckOfficer(e)
                    },
                    checked: checkOfficer,

                  }}
                />
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormSelect
                      name="ngachNgheNghiep"
                      label={"Ngạch, bậc nghề nghiệp"}
                      placeholder={"Ngạch, bậc nghề nghiệp"}
                      // rules={[
                      //   { required: true, message: "Ngạch, bậc nghề nghiệp", }
                      // ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                      }}
                      showSearch
                      options={!checkOfficer ? officer : civilServant}
                    // request={() => checkOfficer ? getOption(`${SERVER_URL_CONFIG}/ngach-vien-chuc?page=0&size=100`, 'ma', 'name') : getOption(`${SERVER_URL_CONFIG}/ngach-cong-chuc`, 'ma', 'name')}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full">
                    <ProFormDatePicker
                      name="ngayBoNhiemNgach"
                      label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}
                      placeholder={"Ngày bổ nhiệm ngạch"}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" /> }
                      // ]}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      name="ngayHuongLuongNgach"
                      label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}
                      placeholder={"Ngày hưởng lương ngạch nghề nghiệp"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" /> }
                      // ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDigit
                      name="phanTramHuongLuongNgach"
                      label={"Phần trăm hưởng lương ngạch (%)"}
                      placeholder={"Phần trăm hưởng lương ngạch"}
                      // rules={[
                      //   { required: true, message: "Phần trăm hưởng lương ngạch" }
                      // ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        max: 100,
                        min: 0
                      }}
                    />
                  </Col>

                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDigit
                      name="phuCapThamNienVuotKhungNgach"
                      label={"Phụ cấp thâm niên vượt khung ngạch (%)"}
                      placeholder={"Phụ cấp thâm niên vượt khung ngạch"}
                      // rules={[
                      //   { required: true, message: "Phụ cấp thâm niên vượt khung ngạch" }
                      // ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        min: 0,
                        max: 100
                      }}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0">
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayHuongPCTNVKNgachNgheNghiep"
                      label={"Ngày hưởng PCTNVK ngạch nghề nghiệp"}
                      placeholder={"Ngày hưởng PCTNVK ngạch nghề nghiệp"}
                      // rules={[
                      //   { required: true, message: "Ngày hưởng PCTNVK ngạch nghề nghiệp" },
                      // ]}
                    />
                  </Col>
                </Row>

              </ProCard>

              <ProCard title={"Thông tin tuyển dụng"} type="inner" bordered>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormText
                      className="w-full"
                      name="ngheNghiepTruocKhiTuyenDung"
                      label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}
                      placeholder={"Nghề nghiệp trước khi tuyển dụng"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" /> },
                      // ]}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0">
                    <ProFormText
                      className="w-full"
                      name="congViecChinhDuocGiao"
                      label={"Công việc chính được giao"}
                      placeholder={"Công việc chính được giao"}
                      // rules={[
                      //   { required: true, message: "Công việc chính được giao" }
                      // ]}
                    // options={jobPosition}
                    />
                  </Col>
                </Row>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormText
                      className="w-full"
                      name="soTruongCongTac"
                      label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                      placeholder={"Sở trường công tác"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" /> }
                      // ]}
                    />
                  </Col>
                  <Col span={12} className="gutter-row p-0">
                    <ProFormText
                      className="w-full"
                      name="congViecLamLauNhat"
                      label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}
                      placeholder={"Công việc lâu nhất"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" /> }
                      // ]}
                    />
                  </Col>
                </Row>


                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDatePicker
                      className="w-full"
                      name="ngayVaoCoQuanHienDangCongTac"
                      label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}
                      placeholder={"Ngày vào cơ quan công tác"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" /> },
                      // ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                    />
                  </Col>
                </Row>


              </ProCard>




            </StepsForm.StepForm>

            <StepsForm.StepForm
              name="position"
              title={"Chức vụ"}
              onFinish={async (value) => {
                // await waitTime(2000);
                handleSession(value);

                return true;
              }}

              initialValues={{
                chucVuDangHienTai: profile?.chucVuDangHienTai,
                chucVuDangKiemNhiem: profile?.chucVuDangKiemNhiem,

                //chuc-vu
                chucVuHienTai: profile?.chucVu?.chucVuHienTaiId,
                coQuanToChucDonViTuyenDungId: profile?.chucVu?.coQuanToChucDonViTuyenDungId,
                ngayBoNhiemChucVu: handleTime(profile?.chucVu?.ngayBoNhiem),
                ngayBoNhiemLai: handleTime(profile?.chucVu?.ngayBoNhiemLai),
                duocQuyHoacChucDanh: profile?.chucVu?.duocQuyHoacChucDanh,
                phuCapChucVu: profile?.chucVu?.phuCapChucVu,

                //chuc-vu-kiem-nhiem
                chucVuKiemNhiem: profile?.chucVuKiemNhiem?.chucVuKiemNhiemId,
                ngayBoNhiemChucVuKiemNhiem: handleTime(profile?.chucVuKiemNhiem?.ngayBoNhiem),
                phuCapKiemNhiem: profile?.chucVuKiemNhiem?.phuCapKiemNhiem,

                //vi-tri-viec-lam
                viTriViecLam: profile?.viecLam?.viTriViecLamId,
                ngayHuongLuongViTriViecLam: handleTime(profile?.viecLam?.ngayHuongLuongViTriViecLam),
                ngayHuongPCTNVK:  handleTime(profile?.viecLam?.ngayHuongPCTNVK),
                phuCapThamNienVuotKhung: profile?.viecLam?.phuCapThamNienVuotKhung,
                phamTramHuongLuong: profile?.viecLam?.phamTramHuongLuong,
                tienLuong: profile?.tienLuong,
              }}
              className="w-full"
            >
              {/* <ProCard title="Chức vụ" type="inner" bordered>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      className="w-full"
                      name="chucVuHienTai"
                      label={"Chức vụ hiện tại"}
                      placeholder={"Chức vụ hiện tại"}
                      rules={[
                        { required: true, message: "Chức vụ hiện tại" },
                      ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                      options={position}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      className="w-full"
                      name="coQuanToChucDonViTuyenDungId"
                      label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}
                      placeholder={"Cơ quan, đơn vị tuyển dụng"}
                      rules={[
                        { required: true, message: <FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" /> },
                      ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/coquan-tochuc-donvi?page=0&size=100`, 'id', 'name')}
                      options={organization}
                    />

                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormDatePicker
                      className="w-full"
                      name="ngayBoNhiemChucVu"
                      label={"Ngày bổ nhiệm chức vụ"}
                      placeholder={"Ngày bổ nhiệm chức vụ"}
                      rules={[
                        { required: true, message: "Ngày bổ nhiệm chức vụ" },
                      ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDatePicker
                      className="w-full"
                      name="ngayBoNhiemLai"
                      label={"Ngày bổ nhiệm lại chức vụ"}
                      placeholder={"Ngày bổ nhiệm lại chức vụ"}
                      rules={[
                        { required: true, message: "Ngày bổ nhiệm lại chức vụ" },
                      ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDigit
                      className="w-full"
                      name="phuCapChucVu"
                      label={"Phụ cấp chức vụ (vnđ)"}
                      placeholder={"Phụ cấp chức vụ (vnđ)"}
                      rules={[
                        { required: true, message: "Phụ cấp chức vụ" },
                      ]}
                      fieldProps={{
                        min: 0,
                        formatter,
                        parser,
                      }}
                    />
                  </Col>
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDigit
                      className="w-full"
                      name="phuCapKhac"
                      label={"Phụ cấp khác (vnđ)"}
                      placeholder={"Phụ cấp khác (vnđ)"}
                      rules={[
                        { required: true, message: "Phụ cấp khác" },
                      ]}
                      fieldProps={{
                        min: 0,
                        formatter,
                        parser,
                      }}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormText
                      className="w-full"
                      name="duocQuyHoacChucDanh"
                      label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}
                      placeholder={"Được quy hoạch chức danh"}
                      rules={[
                        { required: true, message: <FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" /> }
                      ]}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDigit
                      className="w-full"
                      name="tienLuong"
                      label={"Tiền lương (vnđ)"}
                      placeholder={"Tiền lương (vnđ)"}
                      rules={[
                        { required: true, message: "Tiền lương (vnđ)" },
                      ]}
                      fieldProps={{
                        min: 0,
                        formatter,
                        parser,
                      }}
                    />
                  </Col>
                </Row>

              </ProCard> */}


              <ProCard title="Chức vụ kiêm nhiệm" type="inner" bordered>
                <Row gutter={24} className="m-0">

                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      className="w-full"
                      name="chucVuKiemNhiem"
                      label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}
                      placeholder={"Chức vụ kiêm nhiệm"}
                      rules={[
                        { required: true, message: <FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" /> },
                      ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/chuc-vu?page=0&size=100`, 'id', 'name')}
                      options={position}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0">
                    <ProFormDatePicker
                      className="w-full"
                      name="ngayBoNhiemChucVuKiemNhiem"
                      label={"Ngày bổ nhiệm chức vụ kiêm nhiệm"}
                      placeholder={"Ngày bổ nhiệm chức vụ kiêm nhiệm"}
                      rules={[
                        { required: true, message: "Ngày bổ nhiệm chức vụ kiêm nhiệm" },
                      ]}
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                    />
                  </Col>


                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDigit
                      className="w-full"
                      name="phuCapKiemNhiem"
                      label={"Phụ cấp kiêm nhiệm (vnđ)"}
                      placeholder={"Phụ cấp kiêm nhiệm (vnđ)"}
                      // rules={[
                      //   { required: true, message: "Phụ cấp kiêm nhiệm (vnđ)" },
                      // ]}
                      fieldProps={{
                        min: 0,
                        formatter,
                        parser,
                      }}
                    />
                  </Col>
                </Row>
              </ProCard>


              <ProCard title="Vị trí việc làm" type="inner" bordered className='m-2' style={{
                marginTop: 20
              }}>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      className="w-full"
                      name="viTriViecLam"
                      label={"Vị trí việc làm"}
                      placeholder={"Vị trí việc làm"}
                      // rules={[
                      //   { required: true, message: "Vị trí việc làm" },
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                      options={positionJob}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayHuongLuongViTriViecLam"
                      label={"Ngày hưởng lương vị trí việc làm"}
                      placeholder={"Ngày hưởng lương vị trí việc làm"}
                      // rules={[
                      //   { required: true, message: "Ngày hưởng lương vị trí việc làm" },
                      // ]}
                    />
                  </Col>

                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormDigit
                      className="w-full"
                      name="phuCapThamNienVuotKhung"
                      label={"Phụ cấp thâm niên vượt khung (%)"}
                      placeholder={"Phụ cấp thâm niên vượt khung (%)"}
                      // rules={[
                      //   { required: true, message: "Phụ cấp thâm niên vượt khung", }
                      // ]}
                      fieldProps={{
                        min: 0,
                        max: 100
                      }}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0" >
                    <ProFormDigit
                      className="w-full"
                      name="phamTramHuongLuong"
                      label={"Phần trăm hưởng lương (%)"}
                      placeholder={"Phần trăm hưởng lương (%)"}
                      // rules={[
                      //   { required: true, message: "Phần trăm hưởng lương (%)", }
                      // ]}
                      fieldProps={{
                        min: 0,
                        max: 100
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={24} className="m-0">


                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayHuongPCTNVK"
                      label={"Ngày hưởng phụ cấp thâm niên vượt khung"}
                      placeholder={"Ngày hưởng phụ cấp thâm niên vượt khung"}
                      // rules={[
                      //   { required: true, message: "Ngày hưởng phụ cấp thâm niên vượt khung" },
                      // ]}
                    />
                  </Col>
                </Row>
              </ProCard>

            </StepsForm.StepForm>

            <StepsForm.StepForm
              name="base2"
              title={"Trình độ, đào tạo"}
              onFinish={async (value) => {
                // await waitTime(2000);
                handleSession(value);

                return true;
              }}
              className="w-full"
              initialValues={{
                ngayNhapNgu: handleTime(profile?.quanSu?.ngayNhapNgu),
                ngayXuatNgu: handleTime(profile?.quanSu?.ngayXuatNgu),
                ngayThamGiaToChucChinhTriXaHoiDauTien: handleTime(profile?.thongTinTuyenDung?.ngayThamGiaToChucChinhTriXaHoiDauTien),

                //dang
                chucVuDangHienTai: profile?.chucVuDangHienTai ?? null,
                chucVuDangKiemNhiem: profile?.chucVuDangKiemNhiem ?? null,

                //hoc-van
                doiTuongChinhSach: profile?.doiTuongChinhSach ?? null,
                trinhDoGiaoDucPhoThong: profile?.hocVan?.trinhDoGiaoDucPhoThong ?? null,
                trinhDoChuyenMon: profile?.hocVan?.trinhDoChuyenMon ?? null,
                danhHieuNhaNuocPhongTang: profile?.hocVan?.danhHieuNhaNuocPhongTang ?? null,
                hocHam: profile?.hocVan?.hocHam ?? null,
                capBacLoaiQuanHamQuanDoi: profile?.quanSu?.capBacLoaiQuanHamQuanDoi ?? null,
                thanhPhanGiaDinh: profile?.thanhPhanGiaDinh ?? null,
              }}
            >

              <ProCard title="Quân sự" type="inner" bordered style={{
                marginTop: 20
              }}>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayNhapNgu"
                      label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}
                      placeholder={"Ngày nhập ngũ"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" /> },
                      // ]}
                    />
                  </Col>
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayXuatNgu"
                      label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}
                      placeholder={"Ngày xuất ngũ"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" /> },
                      // ]}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormDatePicker
                      fieldProps={{
                        style: {
                          width: "100%"
                        },
                        disabledDate: disabledDate
                      }}
                      name="ngayThamGiaToChucChinhTriXaHoiDauTien"
                      label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}
                      placeholder={"Ngày tham gia tổ chức chính trị - xã hội đầu tiên"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" /> },
                      // ]}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="capBacLoaiQuanHamQuanDoi"
                      label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}
                      placeholder={"Cấp bậc quân hàm"}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" /> }
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/cap-bac-loai-quan-ham-quan-doi?page=0&size=100`, 'id', 'name')}
                      options={militaryRank}
                    />
                  </Col>
                </Row>
              </ProCard>

              <ProCard title="Đảng" type="inner" bordered>
                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      name="chucVuDangHienTai"
                      label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}
                      placeholder={"Chức vụ Đảng hiện tại"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" /> },
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                      options={rankCommunistParty}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0">
                    <ProFormSelect
                      className="w-full"
                      name="chucVuDangKiemNhiem"
                      label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}
                      placeholder={"Chức vụ Đảng kiêm nhiệm"}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" /> }
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/chuc-danh-dang?page=0&size=100`, 'id', 'name')}
                      options={rankCommunistParty}

                    />
                  </Col>
                </Row>

              </ProCard>

              <ProCard title="Học vấn" type="inner" bordered style={{
                marginTop: 20
              }}>

                <Row gutter={24} className="m-0">

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="doiTuongChinhSach"
                      label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}
                      placeholder={"Đối tượng chính sách"}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" /> }
                      //   // { required: true, message: "Dân tộc" }
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/doi-tuong-chinh-sach?page=0&size=50`, 'id', 'name')}
                      options={policyObject}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="trinhDoGiaoDucPhoThong"
                      label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}
                      placeholder={"Trình độ giáo dục phổ thông"}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" /> }
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-giao-duc-pho-thong?page=0&size=100`, 'id', 'name')}
                      options={secondaryEducation}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="trinhDoChuyenMon"
                      label={<FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" />}
                      placeholder={"Trình độ chuyên môn"}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" /> }
                      // ]}

                      options={professionalLevel}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/trinh-do-chuyen-mon?page=0&size=100`, 'id', 'name')}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="danhHieuNhaNuocPhongTang"
                      label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}
                      placeholder={"Danh hiệu nhà nước"}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" /> }
                      // ]}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/danh-hieu-nha-nuoc-phong?page=0&size=100`, 'id', 'name')}
                      options={stateRank}
                    />
                  </Col>
                </Row>

                <Row gutter={24} className="m-0">
                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="hocHam"
                      label={<FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" />}
                      placeholder={"Học hàm"}
                      // request={() => getOption(`${SERVER_URL_CONFIG}/hoc-ham?page=0&size=100`, 'id', 'name')}
                      options={academicLevel}
                      showSearch
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" /> }
                      // ]}
                    />
                  </Col>

                  <Col span={12} className="gutter-row p-0 w-full" >
                    <ProFormSelect
                      className="w-full"
                      name="thanhPhanGiaDinh"
                      label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}
                      placeholder={"Thành phần gia đình"}
                      showSearch
                      // request={() => getOption(`${SERVER_URL_CONFIG}/thanh-phan-gia-dinh?page=0&size=100`, 'id', 'name')}
                      options={memberFamily}
                      // rules={[
                      //   { required: true, message: <FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" /> }
                      // ]}
                    />
                  </Col>
                </Row>

              </ProCard>




            </StepsForm.StepForm>

          </StepsForm>

        </PageContainer>
      </div>)
      :
      (
        <ProDescriptions
          style={{
            fontSize: 50
          }}
          title="Chi tiết bò"
          column={2}
          layout='horizontal'
          size='middle'

          columns={[
            {
              title: () => {
                return <div style={{ color: 'red', fontSize: '20px' }}> Mã</div>
              },

              key: 'code',
              dataIndex: 'code',
              render: (_, record) => {
                return <div style={{ color: 'red', fontSize: '20px' }}> {record.code}</div>
              }
            },
            {
              title: 'Tên',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: 'Tuổi',
              key: 'age',
              dataIndex: 'age',
            },
            {
              title: 'Ngày sinh',
              key: 'birthdate',
              dataIndex: 'birthdate',
              valueType: 'date',
            },
            {
              title: 'Cân nặng sơ sinh',
              key: 'firstWeight',
              dataIndex: 'firstWeight',
            },
            {
              title: 'Giới tính',
              key: 'sex',
              dataIndex: 'sex',
            },
            {
              title: 'Trang trại',
              key: 'farm',
              dataIndex: 'farm',
            },
            {
              title: 'Ảnh',
              key: 'photo',
              render: (_, entity) => {
                const photo = entity.photo.map((e: any) => {
                  return (
                    <>
                      <>
                        <Image src={SERVERURL + e} />
                      </>
                    </>
                  )
                })
                return photo;
              }
            }
          ]}
        >
        </ProDescriptions>
      )
  );
};

export default TableList;
