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


    const add = await post('/nhan-vien', {}, { ...fields });
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

  );
};