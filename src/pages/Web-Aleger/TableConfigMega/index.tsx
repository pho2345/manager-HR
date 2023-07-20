import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ReloadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormSwitch } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Col, Form, message, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'config-default-megas', id);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};



const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [rowCurrent, setRowCurrent] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<any>();


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
        return (
          <>
            {entity?.attributes?.timePaymentMegaS}

          </>
        );
      },

    },
    {
      title: configDefaultText['page.configDefault.column.timeSettlementMega'],
      dataIndex: 'timeSettlementMega',
      valueType: 'textarea',
      key: 'timeSettlementMega',
      renderText: (_, text: any) => text?.attributes?.timeSettlementMega
    },
    {
      title: configDefaultText['page.configDefault.column.percentSettlementMega'],
      dataIndex: 'percentSettlementMega',
      valueType: 'textarea',
      key: 'percentSettlementMega',
      renderText: (_, text: any) => {
        return `${text?.attributes?.percentSettlementMega}%`
      }
    },
    {
      title: configDefaultText['page.configDefault.column.limitPlaformReceivSettlement'],
      dataIndex: 'limitPlaformReceivSettlement',
      valueType: 'textarea',
      key: 'limitPlaformReceivSettlement',
      renderText: (_, text: any) => {
        return `${text?.attributes?.limitPlaformReceivSettlement}`
      }
    },
    {
      title: configDefaultText['page.configDefault.column.cPassPLSellMega'],
      dataIndex: 'cPassPLSellMega',
      valueType: 'textarea',
      key: 'cPassPLSellMega',
      renderText: (_, text: any) => {
        return `${text?.attributes?.cPassPLSellMega}`
      }
    },
    {
      title: configDefaultText['page.configDefault.column.autoSettlement'],
      dataIndex: 'autoSettlement',
      valueType: 'textarea',
      key: 'autoSettlement',
      render: (_, text: any) => {
        return (<><ProFormSwitch disabled fieldProps={{
          checked: text?.attributes?.autoSettlement,
        }} /></>)
      }
    },

    {
      title: configDefaultText['page.configDefault.column.autoSettlementFeed'],
      dataIndex: 'autoSettlement',
      valueType: 'textarea',
      key: 'autoSettlement',
      render: (_, text: any) => {
        return (<>{text?.attributes?.autoSettlementFeed}</>)
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
        >
          <Button
            onClick={() => {
              handleUpdateModalOpen(true);
              setRowCurrent(entity?.id);
              form.setFieldsValue({
                ...entity.attributes
              })
            }}
            icon={
              <MdOutlineEdit />
            }
            style={{
              border: 'none'
            }}
          />
        </Tooltip>

        )
      }
    },

  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle=''
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
        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {

            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
      />

      <ModalForm

        title='Cập nhật'
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}

        submitTimeout={2000}
        onFinish={async (values: any) => {
          const update = await handleUpdate(values, rowCurrent);
          if (update) {
            handleUpdateModalOpen(false);
            actionRef.current?.reloadAndRest?.();
          }
          return true;
        }}

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name='timePaymentMegaS'
              label={configDefaultText['page.configMega.modal.limitTimeBuyCPass']}
              placeholder={configDefaultText['page.configMega.modal.limitTimeBuyCPass']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.limitTimeBuyCPass'] },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormText
              className='w-full'
              name='timeSettlementMega'
              label={configDefaultText['page.configMega.modal.limitTimeSettlement']}
              placeholder={configDefaultText['page.configMega.modal.limitTimeSettlement']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.limitTimeSettlement'] },
              ]}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name='percentSettlementMega'
              label={configDefaultText['page.configMega.modal.percentSettlementMega']}
              placeholder={configDefaultText['page.configMega.modal.percentSettlementMega']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.percentSettlementMega'] },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormText
              className='w-full'
              name='limitPlaformReceivSettlement'
              label={configDefaultText['page.configMega.modal.limitPlaformReceivSettlement']}
              placeholder={configDefaultText['page.configMega.modal.limitPlaformReceivSettlement']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.limitPlaformReceivSettlement'] },
              ]}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name='cPassPLSellMega'
              label={configDefaultText['page.configMega.modal.cPassPLSellMega']}
              placeholder={configDefaultText['page.configMega.modal.cPassPLSellMega']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.cPassPLSellMega'] },
              ]}
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormSwitch name='autoSettlement' label='Tự động thanh quyết toán do tăng trọng không đạt yêu cầu' />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={12} className="gutter-row p-0" >
            <ProFormText
              className='w-full'
              name='autoSettlementFeed'
              label={configDefaultText['page.configMega.modal.autoSettlementFeed']}
              placeholder={configDefaultText['page.configMega.modal.autoSettlementFeed']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.configMega.modal.autoSettlementFeed'] },
              ]}
            />
          </Col>

          {/* <Col span={12} className='gutter-row p-0'>
            <ProFormSwitch name='autoSettlement' label='Tự động thanh quyết toán do tăng trọng không đạt yêu cầu' />
          </Col> */}
        </Row>

      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
