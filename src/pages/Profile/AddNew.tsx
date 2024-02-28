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
import { Button, Col, Modal, Row, message } from "antd";
import { useRef, useState } from "react";
import configText from "@/locales/configText";
import moment from "moment";
import { post } from "@/services/ant-design-pro/api";

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

interface propsAddNew {
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
    // message.error(error?.response?.data?.error?.message);
    return false;
  }
};


export default (props: propsAddNew) => {
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { religion, sex } = props;


  return (

    !(currentUser?.role === 'ADMIN') ? (
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onCurrentChange={(value: number) => {
          console.log("current form", value);
        }}
        onFinish={async (value) => {
          console.log("finish form", value);
          await waitTime(1000);
          message.success("提交成功");
        }}
        formProps={{
          validateMessages: {
            required: "此项为必填项",
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

          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            localStorage.setItem("current", formRef.current?.getFieldsValue());
            sessionStorage.setItem("current", "1");
            await waitTime(2000);
            return true;
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
                // className="w-full
                // style={{ width: "100%" }}
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
                  //{ required: true, message: <FormattedMessage id="page.listCow.required.birthdate" defaultMessage="Vui lòng chọn ngày sinh" /> },
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
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
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
                label={<FormattedMessage id="page.profile.weight" defaultMessage="Cân nặng" />}
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
                placeholder={"Chiều cao"}
                rules={[
                  { required: true, message: <FormattedMessage id="page.profile.groupBlood" defaultMessage="Nhóm máu" /> }
                ]}
              />
            </Col>
          </Row>

        </StepsForm.StepForm> */}

      

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
                placeholder={"Danh hiệu nhà nước0"}
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
        // form={form}
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