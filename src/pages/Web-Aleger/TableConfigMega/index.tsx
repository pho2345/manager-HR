import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSwitch } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Form, message, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';


const handleUpdate = async (fields: any, id: any) => {
  console.log(fields);
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'config-default-megas', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất!');
    return false;
  }
};



const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  const [form] = Form.useForm<any>();
  const intl = useIntl();


  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: (
        <FormattedMessage
          id='pages.configMega.timePaymentMegaS'
          defaultMessage='Thời gian tối đa để Mega thanh toán MegaS cho PL từ khi đặt mua cPass'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <a
            onClick={() => {

            }}
          >
            {entity?.attributes?.timePaymentMegaS}

          </a>
        );
      },

    },
    {
      title: <FormattedMessage id='pages.configMega.timeSettlementMega' defaultMessage='Thời gian tối đa để PL thanh quyết toán cho Mega từ khi nhận được yêu cầu' />,
      dataIndex: 'timeSettlementMega',
      valueType: 'textarea',
      key: 'timeSettlementMega',
      renderText: (_, text: any) => text?.attributes?.timeSettlementMega
    },
    {
      title: <FormattedMessage id='pages.configMega.percentSettlementMega' defaultMessage='CPass Mega thanh quyết toán tối đa trong tuần(%)' />,
      dataIndex: 'percentSettlementMega',
      valueType: 'textarea',
      key: 'percentSettlementMega',
      renderText: (_, text: any) => {
        return `${text?.attributes?.percentSettlementMega}%`
      }
    },
    {
      title: <FormattedMessage id='pages.configMega.limitPlaformReceivSettlement' defaultMessage='Số cPass Mega tối đa PL nhận thanh quyết toán trong 1 tuần' />,
      dataIndex: 'limitPlaformReceivSettlement',
      valueType: 'textarea',
      key: 'limitPlaformReceivSettlement',
      renderText: (_, text: any) => {
        return `${text?.attributes?.limitPlaformReceivSettlement}`
      }
    },
    {
      title: <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần ' />,
      dataIndex: 'cPassPLSellMega',
      valueType: 'textarea',
      key: 'cPassPLSellMega',
      renderText: (_, text: any) => {
        return `${text?.attributes?.cPassPLSellMega}`
      }
    },
    {
      title: <FormattedMessage id='pages.configMega.autoSettlement' defaultMessage='Tự động thanh quyết toán do tăng trọng không đạt yêu cầu' />,
      dataIndex: 'autoSettlement',
      valueType: 'textarea',
      key: 'autoSettlement',
      renderText: (_, text: any) => {
        return `${text?.attributes?.autoSettlement}`
      }
    },
    {
      title: <FormattedMessage id='pages.option' defaultMessage='Thao tác' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Tooltip
          title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdCateogry.current = entity.id;
              form.setFieldsValue({
                ...entity.attributes
              })

            }}
          /></Tooltip>

        )
      }
    },

  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        request={() => customAPIGet({}, 'config-default-megas')}
        columns={columns}
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: 'Tải lại',
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }]
        }}
      />

      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.update',
          defaultMessage: '',
        })}
        width='99vh'
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleUpdate(value as any, refIdCateogry);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.configMega.timePaymentMegaS'
                  defaultMessage='Thời gian tối đa để Mega thanh toán MegaS cho PL từ khi đặt mua cPass'
                />
              ),
            },
          ]}
          label={<FormattedMessage
            id='pages.configMega.timePaymentMegaS'
            defaultMessage='Thời gian tối đa để Mega thanh toán MegaS cho PL từ khi đặt mua cPass'
          />}
          width='md'
          name='timePaymentMegaS'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id='pages.configMega.required.timeSettlementMega' defaultMessage='Thời gian tối đa để PL thanh quyết toán cho Mega từ khi nhận được yêu cầu' />
              ),
            },
          ]}
          label={
            <FormattedMessage id='pages.configMega.timeSettlementMega' defaultMessage='Thời gian tối đa để PL thanh quyết toán cho Mega từ khi nhận được yêu cầu' />
          }
          width='md'
          name='timeSettlementMega'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.configMega.required.timeSettlementMega'
                  defaultMessage='Nhập CPass Mega thanh quyết toán tối đa trong tuần(%)'
                />
              ),
            },
          ]}
          label={<FormattedMessage
            id='pages.configMega.required.timeSettlementMega'
            defaultMessage='Nhập CPass Mega thanh quyết toán tối đa trong tuần(%)'
          />}
          width='md'
          name='percentSettlementMega'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id='pages.configMega.required.limitPlaformReceivSettlement' defaultMessage='Số cPass Mega tối đa PL nhận thanh quyết toán trong 1 tuần' />
              ),
            },
          ]}
          label={
            <FormattedMessage id='pages.configMega.limitPlaformReceivSettlement' defaultMessage='Số cPass Mega tối đa PL nhận thanh quyết toán trong 1 tuần' />
          }
          width='md'
          name='limitPlaformReceivSettlement'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id='pages.configMega.required.cPassPLSellMega' defaultMessage='Nhập số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần ' />
              ),
            },
          ]}
          label={
            <FormattedMessage id='pages.configMega.cPassPLSellMega' defaultMessage='Số cPass Mega tối đa PL bán cho 1 Mega trong 1 tuần ' />
          }
          width='md'
          name='cPassPLSellMega'
        />

        <ProFormSwitch
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id='pages.configMega.required.autoSettlement' defaultMessage='Nhập tự động thanh quyết toán do tăng trọng không đạt yêu cầu' />
            ),
          },
        ]}
        label={
          <FormattedMessage id='pages.configMega.autoSettlement' defaultMessage='Tự động thanh quyết toán do tăng trọng không đạt yêu cầu' />
        }
        width='md'
        name='autoSettlement'
        />


      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
