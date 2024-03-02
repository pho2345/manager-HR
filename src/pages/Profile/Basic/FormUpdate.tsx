import type { ProFormInstance } from "@ant-design/pro-components";
import {
  ModalForm,
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from "@ant-design/pro-components";
import { FormattedMessage, useModel } from "@umijs/max";
import { Button, Checkbox, Col, Modal, Row, Space, message } from "antd";
import { useEffect, useRef, useState } from "react";
import configText from "@/locales/configText";
import moment from "moment";
import { patch, post } from "@/services/ant-design-pro/api";
import { useForm } from "antd/lib/form/Form";

const configDefaultText = configText;


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

interface propAddNew {
  display: boolean;
  onChangeDisplay: (params: boolean) => void;
  religion?: [] | GEN.Option[];
  sex?: [] | GEN.Option[];
  position?: [] | GEN.Option[];
  groupBlood?: [] | GEN.Option[];
  policyObject?: [] | GEN.Option[];
  secondaryEducationLevel?: [] | GEN.Option[];
  professionalLevel?: [] | GEN.Option[];
  stateRank?: [] | GEN.Option[];
  academicDegrees?: [] | GEN.Option[];
  militaryRanks?: [] | GEN.Option[];
  membership?: [] | GEN.Option[];
  profile: any
}

const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const add = await post('/nhan-vien/them', {}, { ...fields });
    if (add) {
      message.success('Thêm thành công');
    }

    return true;
  } catch (error: any) {
    message.success('Thất bại');
    return false;
  }
};


const handleUpdate = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const add = await patch('/ca-nhan/so-yeu-ly-lich/cap-nhat', { ...fields });


    return true;
  } catch (error: any) {
    message.success('Thất bại');
    return false;
  }
};

export default (props: propAddNew) => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { religion, sex } = props;
  const [form] = useForm<ProFormInstance>();

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

  useEffect(() => {
    if (formRef.current && props.display) {
      formRef.current.setFieldsValue({
        ...props.profile
      })
    }
  }, []);

  return (

    !(currentUser?.role === 'ADMIN') ? (
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onCurrentChange={(value: number) => {
        }}
        onFinish={async (value) => {
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
              title="Thêm mới viên chức"
              width={800}
              onCancel={() => props.onChangeDisplay(false)}
              open={props.display}
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
        {/* <StepsForm.StepForm<{
          name: string;
        }>
          name="base"
          title="Thông tin chung"
          stepProps={{
          }}

          onFinish={async (value: object) => {
            handleSession(value);
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
                name="sex"
                showSearch

                label={<FormattedMessage id="page.profile.sex" defaultMessage="Giới tính" />}
                placeholder={"Giới tính"}
                options={sex}
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
                name="religion"
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
                name="birthdate"
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
                options={props.groupBlood}
              />
            </Col>
          </Row>

        </StepsForm.StepForm> */}

        <StepsForm.StepForm<{
          name: string;
        }>
          name="base1"
          title="Biên chế, chức vụ, Ngạch, Bậc"
          stepProps={{
          }}

          onFinish={async (value: object) => {
            handleSession(value);
            return true;
          }}

        >
          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <Space>
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
                options={[]}
              />
                <Checkbox />
              </Space>
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
                options={[]}
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
              <ProFormText
                name="chucVuDangHienTai"
                label={<FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" />}
                placeholder={"Chức vụ Đảng hiện tại"}
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.currentPositionCommunistParty" defaultMessage="Chức vụ Đảng hiện tại" /> },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormText
                className="w-full"
                name="chucVuDangKiemNhiem"
                label={<FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" />}
                placeholder={"Chức vụ Đảng kiêm nhiệm"}
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.chargePositionCommunistParty" defaultMessage="Chức vụ Đảng kiêm nhiệm" /> }
                ]}
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
                options={[]}
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
          onFinish={async () => {
            await waitTime(2000);
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
                name="ngayVaoDangCongSanVietNam"
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
                options={props.policyObject}
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
                options={props.secondaryEducationLevel}
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
                options={props.professionalLevel}
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
                options={props.stateRank}
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
                options={props.academicDegrees}
                showSearch
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.academicDegrees" defaultMessage="Học hàm" /> }
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0 w-full" >
              <ProFormSelect
                className="w-full"
                name="capBacLoaiQuanHamQuanDoi"
                label={<FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" />}
                placeholder={"Cấp bậc quân hàm"}
                options={props.militaryRanks}
                showSearch
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.militaryRanks" defaultMessage="Cấp bậc quân hàm" /> }
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0 w-full" >
              <ProFormSelect
                className="w-full"
                name="thanhPhanGiaDinh"
                label={<FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" />}
                placeholder={"Thành phần gia đình"}
                options={props.membership}
                showSearch
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.membership" defaultMessage="Thành phần gia đình" /> }
                ]}
              />
            </Col>


          </Row>
        </StepsForm.StepForm>

      </StepsForm>
    ) : (<>

      <ModalForm
        form={form}
        title={<FormattedMessage id="page.hr.modal.addNew.title" defaultMessage="Tạo CBVC" />}
        width={window.innerWidth * 0.3}
        open={props.display}

        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onChangeDisplay(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            props.onChangeDisplay(false);
            // form.resetFields();
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
          }
        }}

        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >
        <Row gutter={24} >
          <Col span={24} >
            <ProFormText
              label={<FormattedMessage id="page.hr.modal.addNew.name" defaultMessage="Tên" />}
              // width='md'
              name='hoVaTen'
              placeholder={`Họ và tên`}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="page.hr.modal.addNew.require.name" defaultMessage="Vui lòng nhập tên" />
                },
              ]} />

            <ProFormText
              label={<FormattedMessage id="page.hr.modal.addNew.passport" defaultMessage="CCCD/CMND" />}
              // width='md'
              name='soCCCD'
              placeholder={`CCCD/CMND`}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="page.hr.modal.addNew.require.passport" defaultMessage="Name" />
                },
              ]} />

            <ProFormText
              label={<FormattedMessage id="page.hr.modal.addNew.email" defaultMessage="Email" />}
              // width='md'
              name='email'
              placeholder={`Email`}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="page.HealthStatus.require.email" defaultMessage="Vui lòng nhập email" />
                },
              ]} />


          </Col>
        </Row>
      </ModalForm>
    </>)

  );
};