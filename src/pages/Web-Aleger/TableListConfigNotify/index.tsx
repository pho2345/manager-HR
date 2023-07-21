import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ActionType, ProFormDigit, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
} from '@ant-design/pro-components';
import NotifyEmail from './components/TemplateNotifyEmail';
import Notify from './components/TemplateNotify';
import HistoryNotifyEmail from './components/HistoryNotifyEmail';
import HistoryNotify from './components/HistoryNotify';
import HistoryFeedback from './components/HistoryFeedback';

import { Col, Form, message, Row } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fee-transactions', id);
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

const converRateAndCustomerCare = async () => {
  try {
    const getConvertRate = customAPIGet({}, 'conversionrates');
    const getCustomerCare = customAPIGet({}, 'customer-care');
    const getData = await Promise.all([getConvertRate, getCustomerCare]);
    return {
      rateMegaProduceAle: getData[0]?.data?.rateMegaProduceAle ?? 0,
      hotline : getData[1]?.data?.attributes?.hotline || '',
      zalo : getData[1]?.data?.attributes?.zalo || '',
      email : getData[1]?.data?.attributes?.email || '',
    }
  } catch (error) {
    console.log(error)
  }
}



const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [rowCurrent, setRowCurrent] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<any>();
  const [updateOpenModalFee, setUpdateOpenModalFee] = useState<boolean>(false);
  // const [data, setData] = useState<any>();
  const refFee = useRef<any>();

  useEffect(() => {
    const getData = async () => {
    //  const data = await converRateAndCustomerCare();
    //  setData(data);
    };
    getData()
  }, []);



  return (
    <PageContainer
      tabList={[
        {
          tab: 'Template Thông báo email',
          key: '1',
          children: (<>
                <NotifyEmail />
          </>)
        },

        {
          tab: 'Template Thông báo',
          key: '2',
          children: (<>
                <Notify />
          </>)
        },

        {
          tab: 'Lịch sử thông báo mail',
          key: '3',
          children: (<>
                <HistoryNotifyEmail />
          </>)
        },

        {
          tab: 'Lịch sử thông báo',
          key: '4',
          children: (<>
                <HistoryNotify />
          </>)
        },

        {
          tab: 'Lịch sử phản hồi',
          key: '5',
          children: (<>
                <HistoryFeedback />
          </>)
        },

      ]}
    >
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
              placeholder={configDefaultText['page.listCow.column.name']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.listCow.required.name'] },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">

            <ProFormText
              className='w-full'
              name='timeSettlementMega'
              label={configDefaultText['page.configMega.modal.limitTimeSettlement']}
              placeholder={configDefaultText['page.listCow.column.name']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.listCow.required.name'] },
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
              placeholder={configDefaultText['page.listCow.column.name']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.listCow.required.name'] },
              ]}
            />
          </Col>

          <Col span={12} className="gutter-row p-0">
            <ProFormText
              className='w-full'
              name='limitPlaformReceivSettlement'
              label={configDefaultText['page.configMega.modal.limitPlaformReceivSettlement']}
              placeholder={configDefaultText['page.listCow.column.name']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.listCow.required.name'] },
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
              placeholder={configDefaultText['page.listCow.column.name']}
              rules={[
                //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                { required: true, message: configDefaultText['page.listCow.required.name'] },
              ]}
            />
          </Col>

          <Col span={12} className='gutter-row p-0'>
            <ProFormSwitch name='activeAleTransfer' label='Tự động chuyển đổi Ale' />
          </Col>
        </Row>

      </ModalForm>


      {
        updateOpenModalFee && (
          <ModalForm
            title='Cập nhật'
            width={`35vh`}
            open={updateOpenModalFee}
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => {
                setUpdateOpenModalFee(false);
              },
            }}

            submitTimeout={2000}
            onFinish={async (values: any) => {
              const update = await handleUpdate(values, refFee.current);
              if (update) {
                setUpdateOpenModalFee(false);
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
              <Col span={24} className="gutter-row p-0" >
                <ProFormDigit
                  className='w-full'
                  name='rangeFrom'
                  label={configDefaultText['page.rangeFrom']}
                  placeholder={configDefaultText['page.rangeFrom']}
                  rules={[
                    //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                    { required: true, message: configDefaultText['page.listCow.required.name'] },
                  ]}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDigit
                  className='w-full'
                  name='rangeTo'
                  label={configDefaultText['page.rangeTo']}
                  placeholder={configDefaultText['page.rangeTo']}
                  rules={[
                    //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                    { required: true, message: 'Giá trị trên' },
                  ]}
                />
              </Col>
            </Row>


            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormSelect options={[
                  {
                    label: 'Tiền mặt',
                    value: 'cash'
                  },
                  {
                    label: 'Tỉ lệ phần trăm',
                    value: 'percent'
                  },
                  {
                    label: 'Miễn phí',
                    value: 'free'
                  }
                ]} className='w-full' name='types'
                  label={configDefaultText['page.fee.typesFee']}
                  placeholder={configDefaultText['page.fee.typesFee']}
                  rules={[
                    // { required: true, message: <FormattedMessage id='page.listCow.required.farm' defaultMessage='Vui lòng chọn trang trại' /> },
                    {
                      required: true, message: configDefaultText['page.fee.typesFee'
                      ]
                    },
                  ]}
                  fieldProps={{
                    // onChange: (value) => {

                    // }
                  }}
                />
              </Col>
            </Row>

            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDigit
                  className='w-full'
                  name='valueFee'
                  min={0}
                  label={configDefaultText['page.fee.valueFee']}
                  placeholder={configDefaultText['page.fee.valueFee']}
                  rules={[
                    //{ required: true, message: <FormattedMessage id='page.listCow.required.name' defaultMessage='Vui lòng nhập tên' /> },
                    { required: true, message: configDefaultText['page.fee.valueFee'] },
                  ]}
                />
              </Col>
            </Row>


          </ModalForm>
        )
      }
    </PageContainer>
  );
};

export default TableList;
