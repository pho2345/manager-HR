import {
  get,
  getCustome,
  patch,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
  ProCard,
  StepsForm,
  ProFormSwitch,
  ProFormInstance,

} from '@ant-design/pro-components';
import {
  Card,
  Descriptions,
  Image, UploadFile
} from 'antd';

import configText from '@/locales/configText';
const configDefaultText = configText;


import {
  FormattedMessage,
  useParams
} from '@umijs/max';
import { Avatar, Button, Col, Drawer, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import AddNew from './FormUpdate';
import { getOption } from '@/services/utils';


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();


    // const cow = await customAPIAdd({ ...fields }, 'cows');

    // if (fields?.upload && cow) {
    //   const uploadImages = fields?.upload.map((e: any) => {
    //     let formdata = new FormData();
    //     formdata.append('files', e?.originFileObj);
    //     formdata.append('ref', 'api::cow.cow');
    //     formdata.append('refId', cow?.id);
    //     formdata.append('field', 'photos');
    //     return customAPIUpload({
    //       data: formdata
    //     })
    //   });
    //   const photoCow = await Promise.all(uploadImages);
    // }

    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


// const handleUpdate = async (fields: any, id: any) => {
//   const hide = message.loading('Đang cập nhật...');
//   try {
//     let uploadImages: any[] = [];
//     let photoCowCustom: any[] = [];
//     if (fields?.photos && fields.photos.length !== 0) {
//       fields?.photos.map((e: any) => {
//         if (e.originFileObj) {
//           let formdata = new FormData();
//           formdata.append('files', e?.originFileObj);
//           formdata.append('ref', 'api::cow.cow');
//           formdata.append('refId', id.current);
//           formdata.append('field', 'photos');
//           // uploadImages.push(customAPIUpload({
//           //   data: formdata
//           // }))
//         }
//         else {
//           photoCowCustom.push(e.uid)
//         }
//         return null;
//       });
//     }

//     let photoCow = await Promise.all(uploadImages);
//     if (photoCow.length !== 0) {
//       photoCow.map((e) => {
//         photoCowCustom.push(e[0].id)
//       })
//     }
//     fields.photos = photoCowCustom

//     hide();
//     message.success('Cập nhật thành công');
//     return true;
//   } catch (error: any) {
//     hide();
//     message.error(error?.response?.data?.error?.message);
//     return false;
//   }
// };




const getProfile = async (setProfile: any, setLoading: any) => {
  setLoading(true);
  try {
    const profile = await getCustome('/ca-nhan/so-yeu-ly-lich');
    if (profile.success) {
      setProfile(profile.data)
    }
  } catch (error) {

  }
  setLoading(false);
};






const TableList: React.FC = () => {
  const refIdCow = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [form] = Form.useForm<any>();
  const searchInput = useRef(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();


  const [collapsed, setCollapsed] = useState(true);

  const [profile, setProfile] = useState<GEN.Profile | undefined>();
  const [loading, setLoading] = useState<boolean>(false);



  const [visible, setVisible] = useState(false);


  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [religion, setReligion] = useState<GEN.Option[]>([]);
  const [sex, setSex] = useState<GEN.Option[]>([]);
  const [membership, setMembership] = useState<GEN.Option[]>([]);
  const [position, setPosition] = useState<GEN.Option[]>([]);
  const [groupBlood, setGroupBlood] = useState<GEN.Option[]>([]);
  const [policyObject, setPolicyObject] = useState<GEN.Option[]>([]);
  const [secondaryEducationLevel, setSecondaryEducationLevel] = useState<GEN.Option[]>([]);
  const [professionalLevel, setProfessionalLevel] = useState<GEN.Option[]>([]);
  const [stateRank, setStateRank] = useState<GEN.Option[]>([]);
  const [academicDegrees, setAcademicDegrees] = useState<GEN.Option[]>([]);
  const [militaryRanks, setMilitaryRanks] = useState<GEN.Option[]>([]);
  const [officer, setOfficer] = useState<GEN.Option[]>([]);
  const [civilServant, setCivilServant] = useState<GEN.Option[]>([]);
  const [organ, setOrgan] = useState<GEN.Option[]>([]);
  const [jobPosition, setJobPosition] = useState<GEN.Option[]>([]);
  const [rankCommunistParty, setRankCommunistParty] = useState<GEN.Option[]>([]);
  const [checkOfficer, setCheckOfficer] = useState<boolean>(false);

  const formRef = useRef<ProFormInstance>();

  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      try {
        getProfile(setProfile, setLoading);
        const dataQueries = [
          { query: '/dan-toc', setFunction: setReligion },
          // { query: '/gioi-tinh', setFunction: setSex },
          { query: '/chuc-vu', setFunction: setPosition },
          { query: '/nhom-mau', setFunction: setGroupBlood },
          { query: '/doi-tuong-chinh-sach', setFunction: setPolicyObject },
          { query: '/trinh-do-giao-duc-pho-thong', setFunction: setSecondaryEducationLevel },
          { query: '/trinh-do-chuyen-mon', setFunction: setProfessionalLevel },
          { query: '/danh-hieu-nha-nuoc-phong', setFunction: setStateRank },
          { query: '/hoc-ham', setFunction: setAcademicDegrees },
          { query: '/cap-bac-loai-quan-ham-quan-doi', setFunction: setMilitaryRanks },
          { query: '/thanh-phan-gia-dinh', setFunction: setMembership },
          { query: '/bac-ngach/ngach-cong-chuc', setFunction: setCivilServant },
          { query: '/bac-ngach/ngach-vien-chuc', setFunction: setOfficer },
          { query: '/coquan-tochuc-donvi', setFunction: setOrgan },
          { query: '/vi-tri-viec-lam', setFunction: setJobPosition },
          { query: '/chuc-danh-dang', setFunction: setRankCommunistParty },
        ];

        for (const { query, setFunction } of dataQueries) {
          const data = await getOption(query, 'id', 'name');
          setFunction(data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getValues();
  }, []);


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
    setVisible(true);
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
            <ProCard title={<FormattedMessage id="page.profile.card.tilte.basicInfor" defaultMessage="Thông tin cơ bản" />} type="inner" bordered>
              <Descriptions column={3} style={{ marginBlockEnd: -16 }}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}>{profile?.hovaten ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}>{profile?.cacTenGoiKhac ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.birthdate" defaultMessage="Ngày sinh" />}>{moment(profile?.sinhNgay).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>


                <Descriptions.Item label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}>{profile?.gioiTinh ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" />}>{profile?.soCCCD ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" />}>{moment(profile?.ngayCapCCCD).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" />}>{profile?.danToc ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}>{profile?.noiSinh ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}>{profile?.queQuan ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" />}>{profile?.soDienThoai ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}>{profile?.soBHXH ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}>{profile?.soBHYT ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}>{profile?.noiOHienNay ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}>{profile?.chieuCao ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.weight" defaultMessage="Cân nặng" />}>{profile?.canNang ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}>{profile?.nhomMau ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Tình trạng sức khỏe"}>{profile?.tinhTrangSucKhoe ?? ""}</Descriptions.Item>

              </Descriptions>
            </ProCard>
            <ProCard
              title={<FormattedMessage id="page.profile.card.tilte.job" defaultMessage="Biên chế, chức vụ, Ngạch, Bậc" />}
              headerBordered
              collapsible
              defaultCollapsed
              bodyStyle={{
                fontWeight: 'bolder'
              }}
            >

              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Ngạch nghề nghiệp"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.codeQuotaCareer" defaultMessage="Mã ngạch nghề nghiệp" />}>{profile?.maSoNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}>{profile?.ngachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}>{moment(profile?.ngayBoNhiemNgachNgheNghiep).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberSalaryQuotaCareer" defaultMessage="Hệ số lương ngạch nghề nghiệp" />}>{profile?.heSoLuongNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}>{moment(profile?.ngayHuongLuongNgachNgheNghiep).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.percentGetSalaryQuotaCareer" defaultMessage="Phần trăm hưởng lương ngạch nghề nghiệp" />}>{profile?.phanTramHuongLuongNgachNgheNghiep ?? 0} %</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePassQuotaCareer" defaultMessage="Phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}>{profile?.phuCapThamNienVuotKhungNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}>{moment(profile?.ngayHuongPCTNVKNgachNgheNghiep).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

              </Descriptions>
              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Chức vụ"}>
                <Descriptions.Item label={"Chức vụ hiện tại"}>{profile?.chucVuHienTai ?? ""}</Descriptions.Item>

                <Descriptions.Item label={"Ngày được tuyển dụng lần đầu"}>{moment(profile?.ngayDuocTuyenDungLanDau).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={"Ngày chính thức"}>{moment(profile?.ngayChinhThuc).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}>{profile?.ngheNghiepTruocKhiTuyenDung ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}>{profile?.coQuanToChucDonViTuyenDung ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}>{moment(profile?.ngayVaoCoQuanHienDangCongTac).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}>{moment(profile?.ngayBoNhiem).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}>{moment(profile?.ngayBoNhiemLai).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}>{profile?.chucVuKiemNhiem ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.planningPosition" defaultMessage="Được quy hoạch chức danh" />}>{profile?.duocQuyHoacChucDanh ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}>{profile?.chucVuDangHienTai ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}>{profile?.chucVuDangKiemNhiem ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" />}>{profile?.congViecChinhDuocGiao ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}>{profile?.soTruongCongTac ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}>{profile?.congViecLamLauNhat ?? ""}</Descriptions.Item>
              </Descriptions>




            </ProCard>

            <ProCard
              title="Lương, phụ cấp"
              bordered
              headerBordered
              collapsible
              defaultCollapsed

            >
              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Lương"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.salary" defaultMessage="Tiền lương" />}>{profile?.tienLuong ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePosition" defaultMessage="Phụ cấp chức vụ" />}>{profile?.phuCapChucVu ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceChargePosition" defaultMessage="Phụ cấp kiêm nhiệm" />}>{profile?.phuCapKiemNhiem ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceOther" defaultMessage="Phụ cấp khác" />}>{profile?.phuCapKhac ?? ""}</Descriptions.Item>


                <Descriptions.Item label={<FormattedMessage id="page.profile.salaryMoney" defaultMessage="Lương" />}>{profile?.luongTheoMucTien ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryWorkSpace" defaultMessage="Ngày hưởng lương" />}>{moment(profile?.ngayHuongLuongTheoViTriViecLam).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.percentSalaryWorkSpace" defaultMessage="Phần trăm hưởng lương" />}>{profile?.phamTramHuongLuong ?? ""}%</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePass" defaultMessage="Phụ cấp vượt khung" />}>{profile?.phuCapThamNienVuotKhung ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dadteGetSalaryAllowancePass" defaultMessage="Ngày hưởng phụ cấp vượt khung" />}>{moment(profile?.ngayHuongPCTNVK).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
              </Descriptions>

              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Việc làm"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.workplace" defaultMessage="Vị trí việc làm" />}>{profile?.viTriViecLam ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.codeWorkplace" defaultMessage="Mã số vị trí việc làm" />}>{profile?.maSoViTriViecLam ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.rankSalaryWorkSpace" defaultMessage="Bậc lương trí việc làm" />}>{profile?.bacLuongTriViecLam ?? ""}</Descriptions.Item>
              </Descriptions>

            </ProCard>
            <ProCard
              bordered
              title="Thông tin khác"
              headerBordered
              collapsible
              defaultCollapsed
            >
              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Lưởng"}>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" />}>{moment(profile?.ngayVaoDangCongSanVietNam).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}>{moment(profile?.ngayNhapNgu).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}>{moment(profile?.ngayXuatNgu).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}>{profile?.doiTuongChinhSach ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}>{moment(profile?.ngayThamGiaToChucChinhTriXaHoiDauTien).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}>{profile?.trinhDoGiaoDucPhoThong ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" />}>{profile?.trinhDoChuyenMon ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}>{profile?.danhHieuNhaNuocPhongTang ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}>{profile?.capBacLoaiQuanHamQuanDoi ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" />}>{profile?.hocHam ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}>{profile?.thanhPhanGiaDinh ?? ""}</Descriptions.Item>
              </Descriptions>

            </ProCard>
          </div>


          {/* <AddNew display={visible} onChangeDisplay={onCloseModalAdd}
            religion={religion}
            groupBlood={groupBlood}
            membership={membership}
            militaryRanks={militaryRanks}
            policyObject={policyObject}
            position={position}
            professionalLevel={professionalLevel}
            secondaryEducationLevel={secondaryEducationLevel}
            stateRank={stateRank}
            sex={sex}
            academicDegrees={academicDegrees}
            profile={profile}
            civilServant={civilServant}
            officer={officer}
            organ={organ}
            jobPosition={jobPosition}
            rankCommunistParty={rankCommunistParty}
          /> */}


          <StepsForm<{
            name: string;
          }>
            formRef={formRef}
            onCurrentChange={(value: number) => {
              onUpdateModel()
            }}
            onFinish={async (value) => {
              console.log('value', value);
              await waitTime(1000);
              message.success("Thành công");
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
                  onCancel={() => setVisible(false)}
                  open={visible}
                  footer={submitter}
                  destroyOnClose={false}
                  style={{
                    width: '70vh'
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

              
              onFinish={async (value: object) => {
                handleSession(value);
                return true
              }}
            >
              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    name="hovaten"
                    label={<FormattedMessage id="page.profile.name" defaultMessage="Họ tên" />}
                    placeholder={configDefaultText["page.listCow.column.name"]}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.name" defaultMessage="Họ tên" /> },
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    name="gioiTinh"
                    showSearch

                    label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}
                    placeholder={"Giới tính"}
                    options={[
                      {
                        label: 'Nam',
                        value: 'NAM'
                      }
                    ]}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" /> }
                    ]}
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
                    options={religion}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.nation" defaultMessage="Dân tộc" /> }
                    ]}
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
                    name="sinhNgay"
                    label={configDefaultText["page.listCow.column.birthdate"]}
                    placeholder={configDefaultText["page.listCow.column.birthdate"]}
                    rules={[
                      { required: true, message: configDefaultText["page.listCow.required.birthdate"] },
                    ]}
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
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.phone" defaultMessage="Số điện thoại" /> },
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="soBHXH"
                    label={<FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" />}
                    placeholder={"Mã BHXH"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.socialInsurance" defaultMessage="Mã BHXH" /> },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    className="w-full"
                    name="soBHYT"
                    label={<FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" />}
                    placeholder={"Số BHYT"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.healthInsurance" defaultMessage="Số BHYT" /> },
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="noiOHienNay"
                    label={<FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" />}
                    placeholder={"Nơi ở hiện nay"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.accommodationToday" defaultMessage="Nơi ở hiện nay" /> },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    className="w-full"
                    name="noiSinh"
                    label={<FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" />}
                    placeholder={"Nơi sinh"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.placeOfBirth" defaultMessage="Nơi sinh" /> },
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="queQuan"
                    label={<FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" />}
                    placeholder={"Quê quán"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.homeTown" defaultMessage="Quê quán" /> },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
              <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="healthInsurance"
                    label={"Tình trạng sức khỏe"}
                    placeholder={"Tình trạng sức khỏe"}
                    rules={[
                      { required: true, message: "Tình trạng sức khỏe" }
                    ]}
                    options={[
                      {
                        label: "TỐT",
                        value: 'TOT'
                      }
                    ]}
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
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.numberIdentify" defaultMessage="CMND/CCCD" /> }
                    ]}
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
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateNumberIdentify" defaultMessage="Ngày cấp CCCD/CMND" /> },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="cacTenGoiKhac"
                    label={<FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" />}
                    placeholder={"Tên gọi khác"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="chieuCao"
                    label={<FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" />}
                    placeholder={"Chiều cao"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.tall" defaultMessage="Chiều cao" /> }
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="canNang"
                    label={<FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" />}
                    placeholder={"Cân nặng"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.diffName" defaultMessage="Tên gọi khác" /> }
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="nhomMau"
                    label={<FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" />}
                    placeholder={"Nhóm máu"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" /> }
                    ]}
                    options={groupBlood}
                  />
                </Col>
              </Row>

            </StepsForm.StepForm>

            <StepsForm.StepForm<{
              name: string;
            }>
              name="base1"
              title="Biên chế, chức vụ, Ngạch, Bậc"
              stepProps={{
              }}

              onFinish={async (value: object) => {
                handleSession(value);
                return true
              }}

            >

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
                    label={<FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" />}
                    placeholder={"Ngạch nghề nghiệp"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.quotaCareer" defaultMessage="Ngạch nghề nghiệp" /> },
                    ]}
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                    }}
                    options={checkOfficer ? civilServant : officer}

                  />
                </Col>

                <Col span={12} className="gutter-row p-0 w-full">
                  <ProFormDatePicker
                    name="ngayBoNhiemNgachNgheNghiep"
                    label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}
                    placeholder={"Ngày bổ nhiệm ngạch"}
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
                    }}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" /> }
                    ]}

                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormDatePicker
                    name="ngayHuongLuongNgachNgheNghiep"
                    label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}
                    placeholder={"Ngày hưởng lương ngạch nghề nghiệp"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" /> }
                    ]}
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
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
                    label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}
                    placeholder={"Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" /> },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0" >
                  <ProFormText
                    className="w-full"
                    name="ngheNghiepTruocKhiTuyenDung"
                    label={<FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" />}
                    placeholder={"Nghề nghiệp trước khi tuyển dụng"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.beforeJob" defaultMessage="Nghề nghiệp trước khi tuyển dụng" /> },
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="coQuanToChucDonViTuyenDung"
                    label={<FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" />}
                    placeholder={"Cơ quan, đơn vị tuyển dụng"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.recruitmentAgency" defaultMessage="Cơ quan, đơn vị tuyển dụng" /> },
                    ]}
                    options={organ}
                  />

                </Col>
              </Row>

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
                    options={position}
                  />
                </Col>
               
              </Row>

              <Row gutter={24} className="m-0">
             
                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="viTriViecLam"
                    label={"Vị trí việc làm"}
                    placeholder={"Vị trí việc làm"}
                    rules={[
                      { required: true, message: "Vị trí việc làm" },
                    ]}
                    options={jobPosition}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0" >
                  <ProFormDatePicker
                    className="w-full"
                    name="ngayHuongLuongTheoViTriViecLam"
                    label={"Ngày hưởng lương"}
                    placeholder={"Ngày hưởng lương"}
                    rules={[
                      { required: true, message: "Ngày hưởng lương" },
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
                  <ProFormDatePicker
                    className="w-full"
                    name="ngayVaoCoQuanHienDangCongTac"
                    label={<FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" />}
                    placeholder={"Ngày vào cơ quan công tác"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateAgencyToDo" defaultMessage="Ngày vào cơ quan công tác" /> },
                    ]}
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
                    }}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormDatePicker
                    className="w-full"
                    name="ngayBoNhiem"
                    label={<FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" />}
                    placeholder={"Ngày bổ nhiệm"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateAppointment" defaultMessage="Ngày bổ nhiệm" /> },
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
                  <ProFormDatePicker
                    className="w-full"
                    name="ngayBoNhiemLai"
                    label={<FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" />}
                    placeholder={"Ngày bổ nhiệm lại"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateReAppointment" defaultMessage="Ngày bổ nhiệm lại" /> },
                    ]}
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
                    }}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="chucVuKiemNhiem"
                    label={<FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" />}
                    placeholder={"Chức vụ kiêm nhiệm"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.chargePosition" defaultMessage="Chức vụ kiêm nhiệm" /> },
                    ]}
                    options={position}
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
                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    name="chucVuDangHienTai"
                    label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}
                    placeholder={"Chức vụ Đảng hiện tại"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" /> },
                    ]}
                    options={rankCommunistParty}
                  />
                </Col>
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="chucVuDangKiemNhiem"
                    label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}
                    placeholder={"Chức vụ Đảng kiêm nhiệm"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" /> }
                    ]}
                    options={rankCommunistParty}

                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormSelect
                    className="w-full"
                    name="congViecChinhDuocGiao"
                    label={<FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" />}
                    placeholder={"Công việc chính"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.mainJob" defaultMessage="Công việc chính" /> }
                    ]}
                    options={jobPosition}
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
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.forte" defaultMessage="Sở trường công tác" /> }
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0">
                  <ProFormText
                    className="w-full"
                    name="congViecLamLauNhat"
                    label={<FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" />}
                    placeholder={"Công việc lâu nhất"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.positionLongest" defaultMessage="Công việc lâu nhất" /> }
                    ]}
                  />
                </Col>
              </Row>

            </StepsForm.StepForm>

            <StepsForm.StepForm
              name="base2"
              title={"Trình độ, đào tạo"}
              onFinish={async (value) => {
                await waitTime(2000);
                let sesstion = JSON.parse(sessionStorage.getItem(ID_SAVE_INFO) as any);
                const dateAll = {
                  ...sesstion,
                  ...value
                }
                const data = {
                  ...dateAll,
                  sinhNgay: moment(dateAll.sinhNgay).toISOString(),
                  ngayBoNhiem: moment(dateAll.ngayBoNhiem).toISOString(),
                  ngayBoNhiemLai: moment(dateAll.ngayBoNhiemLai).toISOString(),
                  ngayBoNhiemNgachNgheNghiep: moment(dateAll.ngayBoNhiemNgachNgheNghiep).toISOString(),
                  ngayCapCCCD: moment(dateAll.ngayCapCCCD).toISOString(),
                  ngayHuongLuongNgachNgheNghiep: moment(dateAll.ngayHuongLuongNgachNgheNghiep).toISOString(),
                  ngayHuongPCTNVKNgachNgheNghiep: moment(dateAll.ngayHuongPCTNVKNgachNgheNghiep).toISOString(),
                  ngayNhapNgu: moment(dateAll.ngayNhapNgu).toISOString(),
                  ngayThamGiaToChucChinhTriXaHoiDauTien: moment(dateAll.ngayThamGiaToChucChinhTriXaHoiDauTien).toISOString(),
                  ngayVaoCoQuanHienDangCongTac: moment(dateAll.ngayVaoCoQuanHienDangCongTac).toISOString(),
                  ngayVaoDangCongSanVietNam: moment(dateAll.ngayVaoDangCongSanVietNam).toISOString(),
                  ngayXuatNgu: moment(dateAll.ngayXuatNgu).toISOString(),
                  ngayHuongLuongTheoViTriViecLam: moment(dateAll.ngayHuongLuongTheoViTriViecLam).toISOString()
                }

                await patch("/ca-nhan/so-yeu-ly-lich", data);
                return true;
              }}
              className="w-full"
            >

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormDatePicker
                    fieldProps={{
                      style: {
                        width: "100%"
                      },
                      disabledDate: disabledDate
                    }}
                    name="ngayVaoDangCongSanVietNam"
                    label={<FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" />}
                    placeholder={"Ngày vào Đảng"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateJoinCommunistParty" defaultMessage="Ngày vào Đảng" /> },
                    ]}
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
                    name="ngayNhapNgu"
                    label={<FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" />}
                    placeholder={"Ngày nhập ngũ"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateOfEnlistment" defaultMessage="Ngày nhập ngũ" /> },
                    ]}
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
                    name="ngayXuatNgu"
                    label={<FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" />}
                    placeholder={"Ngày xuất ngũ"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.dateDischargedFromMilitaryService" defaultMessage="Ngày xuất ngũ" /> },
                    ]}
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
                    name="ngayThamGiaToChucChinhTriXaHoiDauTien"
                    label={<FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" />}
                    placeholder={"Ngày tham gia tổ chức chính trị - xã hội đầu tiên"}
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.firstDateJoinLargestSocialPoliticalOrg" defaultMessage="Ngày tham gia tổ chức chính trị - xã hội đầu tiên" /> },
                    ]}
                  />
                </Col>

              </Row>

              <Row gutter={24} className="m-0">

                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormSelect
                    className="w-full"
                    name="doiTuongChinhSach"
                    label={<FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" />}
                    placeholder={"Đối tượng chính sách"}
                    options={policyObject}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.policyOjbect" defaultMessage="Đối tượng chính sách" /> }
                      // { required: true, message: "Dân tộc" }
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormSelect
                    className="w-full"
                    name="trinhDoGiaoDucPhoThong"
                    label={<FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" />}
                    placeholder={"Trình độ giáo dục phổ thông"}
                    options={secondaryEducationLevel}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.secondaryEducationLevel" defaultMessage="Trình độ giáo dục phổ thông" /> }
                    ]}
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
                    options={professionalLevel}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.professionalLevel" defaultMessage="Trình độ chuyên môn" /> }
                    ]}
                  />
                </Col>

                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormSelect
                    className="w-full"
                    name="danhHieuNhaNuocPhongTang"
                    label={<FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" />}
                    placeholder={"Danh hiệu nhà nước"}
                    options={stateRank}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.stateRank" defaultMessage="Danh hiệu nhà nước phong tặng" /> }
                    ]}
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
                    options={academicDegrees}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" /> }
                    ]}
                  />
                </Col>

                {/* <Col span={12} className="gutter-row p-0 w-full" >
              <ProFormSelect
                className="w-full"
                name="capBacLoaiQuanHamQuanDoi"
                label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}
                placeholder={"Cấp bậc quân hàm"}
                options={militaryRanks}
                showSearch
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" /> }
                ]}
              />
            </Col> */}
              </Row>

              <Row gutter={24} className="m-0">
                <Col span={12} className="gutter-row p-0 w-full" >
                  <ProFormSelect
                    className="w-full"
                    name="thanhPhanGiaDinh"
                    label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}
                    placeholder={"Thành phần gia đình"}
                    options={membership}
                    showSearch
                    rules={[
                      { required: true, message: <FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" /> }
                    ]}
                  />
                </Col>


              </Row>
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
