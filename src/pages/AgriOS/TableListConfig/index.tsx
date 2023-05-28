import { customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ActionType, ProColumns, ProDescriptions, ProFormDigit, ProFormSelect, ProFormSwitch, ProTable } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Col, Form, message, Row, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { ReloadOutlined } from '@ant-design/icons';
const configDefaultText = configText;
import AccountBank from './components/TableListAccountBank';
import EWallet from './components/TableListEWallet';
import Address from './components/TableListAddress';

const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  // console.log(fields);
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







const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [rowCurrent, setRowCurrent] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<any>();
  const [updateOpenModalFee, setUpdateOpenModalFee] = useState<boolean>(false);
  // const [rowCurrentFee, setRowCurrentFee] = useState<any>();
  const refFee = useRef<any>();




  const columnFee: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    // {
    //   // title: (
    //   //   <FormattedMessage
    //   //     id='pages.searchTable.column.code'
    //   //     defaultMessage='Rule name'
    //   //   />
    //   // ),
    //   title: configDefaultText['page.code'],
    //   key: 'code',
    //   dataIndex: 'atrributes',
    //   render: (_, entity: any) => {
    //     ;
    //     return (
    //       <>

    //       </>

    //     );
    //   },
    // },
    {
      // title: <FormattedMessage id='pages.searchTable.column.rangeFrom' defaultMessage='Giá trị dưới' />,
      title: configDefaultText['page.rangeFrom'],
      dataIndex: 'rangeFrom',
      valueType: 'textarea',
      key: 'rangeFrom',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        return text?.attributes?.rangeFrom;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.rangeTo' defaultMessage='Giá trị trên' />,
      title: configDefaultText['page.rangeTo'],
      dataIndex: 'rangeTo',
      valueType: 'textarea',
      key: 'rangeTo',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        return text?.attributes?.rangeTo;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.rangeTo' defaultMessage='Giá trị trên' />,
      title: configDefaultText['page.fee.typesFee'],
      dataIndex: 'typesFee',
      valueType: 'textarea',
      key: 'typesFee',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        switch (text?.attributes?.types) {
          case 'cash':
            return `Tiền mặt`;
            break;
          case 'free':
            return `Miễn phí`;
            break;
          case 'percent':
            return `Tỉ lệ phần trăm`;
            break;
          default:
            break;
        }
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.rangeTo' defaultMessage='Giá trị trên' />,
      title: configDefaultText['page.fee.valueFee'],
      dataIndex: 'valueFee',
      valueType: 'textarea',
      key: 'valueFee',
      //...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        if (text?.attributes?.types === 'free') {
          return text?.attributes?.valueFee;
        } else if (text?.attributes?.types === 'cash') {
          return `${text?.attributes?.valueFee.toLocaleString()}đ`;
        } else
          return `${text?.attributes?.valueFee}%`;
      }
    },
    {
      // title: <FormattedMessage id='pages.valueFeeText.column.classify' defaultMessage='Phân loại' />,
      title: configDefaultText['page.fee.valueFeeText'],
      dataIndex: 'valueFee',
      valueType: 'textarea',
      key: 'valueFee',
      align: 'center',
      // ...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        let textFee;
        if (text?.attributes?.rangeFrom === 0 && text?.attributes?.rangeTo !== 0) {
          textFee = `Ít hơn ${text?.attributes?.rangeTo} Ale`;
        } else if (text?.attributes?.rangeFrom !== 0 && text?.attributes?.rangeTo !== 0) {
          textFee = `Từ ${text?.attributes?.rangeFrom} Ale ~ ${text?.attributes?.rangeTo} Ale`;
        } else if (text?.attributes?.rangeFrom !== 0 && text?.attributes?.rangeTo === 0) {
          textFee = `Lớn hơn ${text?.attributes?.rangeFrom} Ale`;
        }

        if (text?.attributes?.types === 'free') {
          return `${textFee} (Miễn phí)`;
        } else if (text?.attributes?.types === 'cash') {
          return `${textFee} (${text?.attributes?.valueFee.toLocaleString()}đ)`;
        } else {
          return `${textFee} (${text?.attributes?.valueFee}%)`;
        }
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Option' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (<Tooltip
          title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
        ><MdOutlineEdit
            onClick={() => {
              refFee.current = entity?.id;
              setUpdateOpenModalFee(true);
              form.setFieldsValue({
                ...entity?.attributes
              })
            }}
          /></Tooltip>

        )
      }
    },



  ];

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: configDefaultText['page.config.columns.mail'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <>
            {entity?.emailPlaform}

          </>
        );
      },

    },
    {
      title: configDefaultText['page.config.columns.limitAlegerSellAle'],
      dataIndex: 'limitAlegerSellAle',
      valueType: 'textarea',
      key: 'limitAlegerSellAle',
      renderText: (_, text: any) => text?.limitAlegerSellAle
    },
    {
      title: configDefaultText['page.config.columns.infoAccountBank'],
      dataIndex: 'infoAccountBank',
      valueType: 'textarea',
      key: 'infoAccountBank',
      renderText: (_, text: any) => {
        return `${text?.attributes?.limitPlaformReceivSettlement}`
      }
    },
    {
      title: configDefaultText['page.config.columns.eWallet'],
      dataIndex: 'eWallet',
      valueType: 'textarea',
      key: 'eWallet',
      renderText: (_, text: any) => {
        return `${text?.attributes?.cPassPLSellMega}`
      }
    },
    {
      title: configDefaultText['page.config.columns.addressOffice'],
      dataIndex: 'addressOffice',
      valueType: 'textarea',
      key: 'addressOffice',
      render: (_, text: any) => {
        return (<span>{text?.addressOffice}</span>)
      }
    },
    {
      title: configDefaultText['page.config.columns.rateConvertion'],
      dataIndex: 'rateConvertion',
      valueType: 'textarea',
      key: 'rateConvertion',
      render: (_, text: any) => {
        return (<span>{text?.rateAle}</span>)
      }
    },
    {
      title: configDefaultText['page.config.columns.rateProduceAle'],
      dataIndex: 'rateConvertion',
      valueType: 'textarea',
      key: 'rateConvertion',
      render: (_, text: any) => {
        return (<span>{text?.rateProduceAleToAle}</span>)
      }
    },
    {
      title: configDefaultText['page.config.columns.rateProduce'],
      dataIndex: 'rateProduce',
      valueType: 'textarea',
      key: 'rateProduce',
      render: (_, text: any) => {
        return (<span>{text?.ratePromo}</span>)
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
              setRowCurrent(entity?.id);
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
    <PageContainer
      tabList={[
        {
          tab: 'Chi tiết',
          key: '1',
          children: (<>
            <ProDescriptions
              column={2}
              columns={columns}
              request={async () => {
                const data = await customAPIGet({}, 'config-plaform');
                return data;
              }}
            >


            </ProDescriptions></>)

        },
        {
          tab: 'Phí giao dịch',
          key: '2',
          children: (<>
            <ProTable
              // headerTitle={intl.formatMessage({
              //   id: 'page.searchTable.title',
              //   defaultMessage: 'Enquiry form',
              // })}
              actionRef={actionRef}
              rowKey='id'
              search={false}

              toolbar={{
                settings: [{
                  key: 'reload',
                  tooltip: configDefaultText['reload'],
                  icon: <ReloadOutlined></ReloadOutlined>,
                  onClick: () => {
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                }]
              }}

              pagination={{
                pageSize: 10,
                locale: {
                  next_page: configDefaultText['nextPage'],
                  prev_page: configDefaultText['prePage'],
                },
                showTotal: (total, range) => {
                  return `${range[range.length - 1]} / Tổng số: ${total}`
                }
              }}

              request={() =>
                customAPIGet(
                  {},
                  'fee-transactions',
                )
              }
              columns={columnFee}


            // tableAlertRender={({ selectedRowKeys }: any) => {
            //   return renderTableAlert(selectedRowKeys);
            // }}


            // tableAlertOptionRender={({ selectedRows }: any) => {
            //   return renderTableAlertOption(selectedRows)
            // }}

            />
          </>)

        },

        {
          tab: 'Thông tin tài khoản của PL',
          key: '3',
          children: (<>
            <AccountBank />
          </>)
        },
        {
          tab: 'Thông tin Ví điện tử của PL',
          key: '4',
          children: (<>
            <EWallet />
          </>)
        },
        {
          tab: 'Địa chỉ văn phòng',
          key: '5',
          children: (<>
            <Address />
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
