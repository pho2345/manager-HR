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
  religion?: [] | GEN.Option[]
  sex?: [] | GEN.Option[]
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
        <StepsForm.StepForm<{
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
                // className="w-full"
                name="name"
                label={configDefaultText["page.listCow.column.name"]}
                placeholder={configDefaultText["page.listCow.column.name"]}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: configDefaultText["page.listCow.required.name"] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                // className="w-full"
                name="sex"
                showSearch

                label={configDefaultText["page.listCow.column.sex"]}
                placeholder={configDefaultText["page.listCow.column.sex"]}
                options={sex}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  { required: true, message: configDefaultText["page.listCow.required.sex"] }
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                className="w-full"
                name="religion"
                label={"Dân tộc"}
                placeholder={"Dân tộc"}
                showSearch
                options={religion}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  { required: true, message: "Dân tộc" }
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
                name="taxId"
                label={"Mã số thuế"}
                placeholder={"Mã số thuế"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "Mã số thuế" },
                ]}
              />

            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText
                className="w-full"
                name="bhId"
                label={"Mã số BHXH"}
                placeholder={"Mã số BHXH"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "Mã số BHXH" },
                ]}
              />

            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className="w-full"
                name="phone"
                label={"Điện thoại di động"}
                placeholder={"Điện thoại di động"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "Điện thoại di động" },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText
                className="w-full"
                name="phoneOrgan"
                label={"Điện thoại cơ quan"}
                placeholder={"Điện thoại cơ quan"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "Điện thoại cơ quan" },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText
                className="w-full"
                name="email"
                label={"Email"}
                placeholder={"Email"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "Email" },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText
                className="w-full"
                name="yim"
                label={"YIM"}
                placeholder={"YIM"}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.name" defaultMessage="Vui lòng nhập tên" /> },
                  { required: true, message: "YIM" },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                className="w-full"
                name="dv"
                label={"Đảng viên"}
                placeholder={"Đảng viên"}
                showSearch
                options={[
                  {
                    label: "Đực",
                    value: "male",
                  },
                  {
                    label: "Cái",
                    value: "female",
                  },
                ]}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  { required: true, message: "Đảng viên" }
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={24} className="gutter-row p-0">
              <ProFormTextArea
                label={configDefaultText["page.listCow.column.description"]}
                placeholder={configDefaultText["page.listCow.column.description"]}
                name="description"
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  { required: true, message: configDefaultText["page.listCow.required.description"] }
                ]}
                fieldProps={{
                  maxLength: 500
                }}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={8} className="gutter-row p-0" >
              <ProFormSelect
                className="w-full"
                name="province"
                label={<FormattedMessage id="page.province" defaultMessage="Tỉnh thành" />}
                placeholder={"Dân tộc"}
                showSearch
                options={[
                  {
                    label: "Đực",
                    value: "male",
                  },
                  {
                    label: "Cái",
                    value: "female",
                  },
                ]}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  // { required: true, message: "Dân tộc" }
                ]}
              />
            </Col>

            <Col span={8} className="gutter-row p-0">
              <ProFormSelect
                className="w-full"
                name="province"
                label={<FormattedMessage id="page.district" defaultMessage="Quận huyện" />}
                placeholder={"Dân tộc"}
                showSearch
                options={[
                  {
                    label: "Đực",
                    value: "male",
                  },
                  {
                    label: "Cái",
                    value: "female",
                  },
                ]}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  // { required: true, message: "Dân tộc" }
                ]}
              />
            </Col>
            <Col span={8} className="gutter-row p-0">
              <ProFormSelect
                className="w-full"
                name="province"
                label={<FormattedMessage id="page.ward" defaultMessage="Xã phường" />}
                showSearch
                placeholder={"Xã phường"}
                options={[
                  {
                    label: "Đực",
                    value: "male",
                  },
                  {
                    label: "Cái",
                    value: "female",
                  },
                ]}
                rules={[
                  // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                  // { required: true, message: "Dân tộc" }
                ]}
              />
            </Col>
          </Row>
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="base1"
          title="Biên chế; Chức vụ; Ngạch, bậc;"
          onFinish={async () => {
            await waitTime(2000);
            return true;
          }}
        >
          <ProCard
            title={<FormattedMessage id="page.contract" defaultMessage="Contract" />}
            bordered
            headerBordered
            collapsible
            style={{
              marginBlockEnd: 16,
              maxWidth: "100%",
            }}
          >
            <ProFormSelect
              className="w-full"
              name="contract"
              label={<FormattedMessage id="page.contract" defaultMessage="Contract" />}
              placeholder={""}
              options={[
                {
                  label: "Đực",
                  value: "male",
                },
                {
                  label: "Cái",
                  value: "female",
                },
              ]}
              showSearch
              rules={[
                // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                // { required: true, message: "Dân tộc" }
              ]}
            />
          </ProCard>

          <ProCard
            title={<FormattedMessage id="page.position" defaultMessage="Position" />}
            bordered
            headerBordered
            collapsible
            style={{
              maxWidth: "100%",
              marginBlockEnd: 16,
            }}
          >
            <ProFormSelect
              className="w-full"
              name="position"
              label={<FormattedMessage id="page.position" defaultMessage="Position" />}
              placeholder={""}
              options={[
                {
                  label: "Đực",
                  value: "male",
                },
                {
                  label: "Cái",
                  value: "female",
                },
              ]}
              showSearch
              rules={[
                // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                // { required: true, message: "Dân tộc" }
              ]}
            />

          </ProCard>
        </StepsForm.StepForm>

        <StepsForm.StepForm
          name="base2"
          title={"Trình độ, đào tạo"}
          onFinish={async () => {
            await waitTime(2000);
            return true;
          }}
        >
          <ProCard
            title={<FormattedMessage id="page.level" defaultMessage="Level" />}
            bordered
            headerBordered
            collapsible
            style={{
              marginBlockEnd: 16,
              maxWidth: "100%",
            }}
          >
            <ProFormSelect
              className="w-full"
              name="contract"
              label={<FormattedMessage id="page.level.study" defaultMessage="Academic level" />}
              placeholder={""}
              options={[
                {
                  label: "Đực",
                  value: "male",
                },
                {
                  label: "Cái",
                  value: "female",
                },
              ]}
              showSearch
              rules={[
                // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                // { required: true, message: "Dân tộc" }
              ]}
            />
          </ProCard>

          <ProCard
            title={<FormattedMessage id="page.position" defaultMessage="Position" />}
            bordered
            headerBordered
            collapsible
            style={{
              marginBlockEnd: 16,
              maxWidth: "100%",
            }}
          >
            <ProFormSelect
              className="w-full"
              name="position"
              label={<FormattedMessage id="page.position" defaultMessage="Position" />}
              placeholder={""}
              options={[
                {
                  label: "Đực",
                  value: "male",
                },
                {
                  label: "Cái",
                  value: "female",
                },
              ]}
              showSearch
              rules={[
                // { required: true, message: <FormattedMessage id="page.listCow.required.sex" defaultMessage="Vui lòng chọn giới tính" /> }
                // { required: true, message: "Dân tộc" }
              ]}
            />

          </ProCard>
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
                  message: <FormattedMessage id="page.hr.modal.addNew.require.passport" defaultMessage="CCCD/CMND" />
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