import {
  get,
  getCustome,
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


const handleRemove = async (selectedRows: any) => {

  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      // return customAPIDelete(e.id, 'cows');
    });

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};



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
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
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


  const params = useParams();
  useEffect(() => {
    const getValues = async () => {
      try {
        getProfile(setProfile, setLoading);

        const dataQueries = [
          { query: '/dan-toc', setFunction: setReligion },
          { query: '/gioi-tinh', setFunction: setSex },
          { query: '/chuc-vu', setFunction: setPosition },
          { query: '/nhom-mau', setFunction: setGroupBlood },
          { query: '/doi-tuong-chinh-sach', setFunction: setPolicyObject },
          { query: '/trinh-do-giao-duc-pho-thong', setFunction: setSecondaryEducationLevel },
          { query: '/trinh-do-chuyen-mon', setFunction: setProfessionalLevel },
          { query: '/danh-hieu-nha-nuoc-phong', setFunction: setStateRank },
          { query: '/hoc-ham', setFunction: setAcademicDegrees },
          { query: '/cap-bac-loai-quan-ham-quan-doi', setFunction: setMilitaryRanks },
          { query: '/thanh-phan-gia-dinh', setFunction: setMembership },
          { query: '/ngach-cong-chuc', setFunction: setCivilServant },
          { query: '/ngach-vien-chuc', setFunction: setOfficer },
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




  const refresh = useCallback(() => {
    getProfile(setProfile, setLoading);
  }, [profile])




  // const disabledDate = (current: any) => {
  //   return current && current > moment();
  // };

  const onShowModalUpdate = () => {
    setVisible(true)
  }

  const onCloseModalAdd = (params: boolean) => {
    setVisible(params);
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
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateAppointmentQuotaCareer" defaultMessage="Ngày bổ nhiệm ngạch" />}>{profile?.ngayBoNhiemNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.numberSalaryQuotaCareer" defaultMessage="Hệ số lương ngạch nghề nghiệp" />}>{profile?.heSoLuongNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryQuotaCareer" defaultMessage="Ngày hưởng lương ngạch nghề nghiệp" />}>{profile?.ngayHuongLuongNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.percentGetSalaryQuotaCareer" defaultMessage="Phần trăm hưởng lương ngạch nghề nghiệp" />}>{profile?.phanTramHuongLuongNgachNgheNghiep ?? 0} %</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePassQuotaCareer" defaultMessage="Phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}>{profile?.phuCapThamNienVuotKhungNgachNgheNghiep ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetAllowancePassQuotaCareer" defaultMessage="Ngày hưởng phụ cấp thâm niên vượt khung ngạch nghề nghiệp" />}>{moment(profile?.ngayHuongPCTNVKNgachNgheNghiep).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

              </Descriptions>
              <Descriptions column={3} style={{ marginBlockEnd: -16, marginBottom: 24 }} title={"Chức vụ"}>

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
                <Descriptions.Item label={<FormattedMessage id="page.profile.rankSalary" defaultMessage="Bậc lương" />}>{profile?.chucVuKiemNhiem ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePosition" defaultMessage="Phụ cấp chức vụ" />}>{profile?.phuCapChucVu ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceChargePosition" defaultMessage="Phụ cấp kiêm nhiệm" />}>{profile?.phuCapKiemNhiem ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.allowanceOther" defaultMessage="Phụ cấp khác" />}>{profile?.phuCapKhac ?? ""}</Descriptions.Item>


                <Descriptions.Item label={<FormattedMessage id="page.profile.salaryMoney" defaultMessage="Lương" />}>{profile?.luongTheoMucTien ?? ""}</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.dateGetSalaryWorkSpace" defaultMessage="Ngày hưởng lương" />}>{moment(profile?.ngayHuongLuongTheoViTriViecLam).format('DD/MM/YYYY') ?? ""}</Descriptions.Item>

                <Descriptions.Item label={<FormattedMessage id="page.profile.percentSalaryWorkSpace" defaultMessage="Phần trăm hưởng lương" />}>{profile?.phamTramHuongLuong ?? ""}%</Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage id="page.profile.allowancePass" defaultMessage="Phụ cấp vượt khung" />}>{profile?.phuCapThamNienVuotKhungNgachNgheNghiep ?? ""}</Descriptions.Item>
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


          <AddNew display={visible} onChangeDisplay={onCloseModalAdd}
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
          />

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
