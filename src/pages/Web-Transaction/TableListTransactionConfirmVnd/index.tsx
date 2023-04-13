import {
  customAPIUpdateMany,
  customAPIPost
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import "./styles.css";

// import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;


const handleUpdateMany = async (fields: any, api: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {

    const updateTransaction = await customAPIUpdateMany(
      { ...fields },
      api,
    );

    hide();
    if (updateTransaction) {
      message.success('Cập nhật thành công');

    }
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};





const TableList: React.FC = () => {
  const [openModalStatus, setOpenModalStatus] = useState<boolean>(false);
  //const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  //const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [filterCode, setFilterCode] = useState<any>();

  //const [form] = Form.useForm<any>();

  const confirm = (entity: any, message: string, api: string) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdateMany({
          transaction: [...entity]
        }, api);
        if (actionRef.current) {
          actionRef.current.reload();
          setSelectedRows([]);
        }

      }
    });
  };



  // const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      title: configDefaultText['page.confirmSettlementVnd.code'],
      key: 'code',
      dataIndex: 'code',
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              //setCurrentRow(entity?.code);
              //setShowDetail(true);
            }}
          >
            {entity?.code}
          </a>
        );
      },
      filters: true,
      filterSearch: true,
      onFilter: true,
      valueEnum: filterCode
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      title: configDefaultText['page.confirmSettlementVnd.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.types' defaultMessage='Loại GD' />,
      title: configDefaultText['page.confirmSettlementVnd.types'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      render: (_, text: any) => {
        switch (text?.types) {
          case 'cpassPayment':
            return (<div >Thanh toán MegaS</div>);

          case 'cpassSettlement':
            return (<div>Thanh quyết toán</div>);

          case 'buyAle':
            return (<div style={{ color: 'cyan' }}>Mua Ale</div>);
          case 'sellAle':
            return (<div style={{ color: 'cyan' }}>Bán Ale</div>);
          case 'produceAleExchangeAle':
            return (<div style={{ color: 'cyan' }}>produceAle sang Ale</div>);
          case 'produceAleExchangePromo':
            return (<div style={{ color: 'cyan' }}>produceAle sang promoAle</div>);

          case 'megaDeltaWeightproduceAle':
            return (<div style={{ color: 'cyan' }}>megaDeltaWeight sang produceAle</div>);
          case 'qrCode':
            return (<div style={{ color: 'cyan' }}>Quét QRcode</div>);
          case 'aleTransfer':
            return (<div style={{ color: 'red' }}>Chuyển khoản ale</div>);

          case 'aleExchange':
            return (<div style={{ color: 'blue' }}>Chuyển đổi ale</div>);

          case 'refund':
            return (<div style={{ color: 'yellow' }}>Hoàn trả</div>);
          default:

            break;
        }
      },
      filters: true,
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === 'refund') {
          if (record?.status === 'waitRefund') return record;
        }
        if (value === 'settlement') {
          if (record?.types === 'cpassSettlement') return record;
        }
        if (value === 'payment') {
          if (record?.types === 'cpassPayment') return record;
        }
      },
      valueEnum: {
        refund: {
          text: 'Hoàn Trả MegaS',
          value: 'refund'
        },
        payment: {
          text: 'Thanh toán MegaS',
          value: 'payment'
        },
        settlement: {
          text: 'Thanh quyết toán',
          value: 'settlement'
        },

      },
    },

    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.method'],

      dataIndex: 'method',
      valueType: 'textarea',
      key: 'method',
      renderText: (_, text: any) => text?.method,
      filtered: true,
      onFilter: true,
      valueEnum: {
        ale: {
          text: 'Ale',
          value: 'ale'
        },
        vnd: {
          text: 'VNĐ',
          value: 'vnd'
        }
      },
    },
    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.statusTransaction'],

      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      render: (_, text: any) => {
        switch (text?.status) {
          case 'waitConfirm':
            return (<div style={{ color: 'cyan' }}>Chờ Mega xác nhận</div>);

          case 'inProgress':
            return (<div style={{ color: 'blue' }}>Chờ xác nhận</div>);

          case 'done':
            return (<div style={{ color: 'green' }}>Hoàn thành</div>);

          case 'cancel':
            return (<div style={{ color: 'red' }}>Đã hủy</div>);

          case 'waitRefund':
            return (<div style={{ color: 'red' }}>Chờ xác nhận hoàn trả</div>);
          default:
            break;
        }
      },

      filters: [
        {
          text: 'Chờ xác nhận',
          value: 'inProgress'
        },
        {
          text: 'Chờ Aleger xác nhận',
          value: 'waitConfirm'
        }, {
          text: 'Chờ xác nhận hoàn trả',
          value: 'waitRefund'
        }, {
          text: 'Hoàn thành',
          value: 'done'
        }, {
          text: 'Đã hủy',
          value: 'cancel'
        }
      ],
      filterSearch: true,
      onFilter: true,
      defaultFilteredValue: ['inProgress'],
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      title: configDefaultText['page.confirmSettlementVnd.priceVnd'],
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      renderText: (_, text: any) => text?.priceVnd.toLocaleString() || null
    },

    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.codeCPass' defaultMessage='CPass' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.codeCPass'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.c_pass?.code,
    },

    {
      // title: (
      //   <FormattedMessage
      //     id='pages.searchTable.column.sender'
      //     defaultMessage='Người giao dịch'
      //   />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.sender'],
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
  ];

  return (
    <PageContainer>
      <ProTable
        
        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => [

        ]}
        request={async () => {
          const data = await customAPIPost(
            {
              method: 'vnd'
            },
            'transactions/findadmin', {
            fields: ['id', 'code', 'types', 'method', 'status', 'priceVnd', 'c_pass', 'sender', 'createdAt'],
            populate: {
              sender: {
                select: ['id', 'username', 'fullname']
              },
              receiver: {
                select: ['id', 'username', 'fullname']
              },
              c_pass: {
                select: ['id', 'code']
              },
              qr_ale: true,
              colorSettlement: true,
              colorStatusTransaction: true
            },
            filters: {
              c_pass: {
                // /statusTransaction: 'open',
                // colorStatusTransaction: {
                //   id: {
                //     $null: true
                //   }
                // }
              }
            }
          });

          const uniqueCode = [...new Set(data?.data.map((item: any) => item.code))];
          const filterCodeData = uniqueCode.reduce((obj: any, name: any) => {
            return {
              ...obj,
              [name]: { text: name, value: name }
            };
          }, {});
          setFilterCode(filterCodeData);
          return data;
        }

        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
          getCheckboxProps: record => ({
            disabled: record.status === 'cancel' || record.status === 'done' && record.types === 'cpassSettlement'
          })
        }}
        rowClassName={(record: any) => {
          if (record?.types === 'cpassPayment' && (record?.status === 'inProgress' || record?.status === 'done')) {
            return 'add-money';
          }
          else if (record?.status === 'cancel') {
            return ''
          }
          else {
            return 'sub-money';
          }

        }}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
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
            console.log(range);
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
               {/* <FormattedMessage id='chosen' defaultMessage='Đã chọn' />{' '} */}
               {`${configDefaultText['chosen']} `}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              {/* <FormattedMessage id='Item' defaultMessage='hàng' /> */}
              {configDefaultText['selectedItem']}

            </div>
          }
        >
          <Button
            onClick={async () => {
              setOpenModalStatus(true);
            }}
          >
           {configDefaultText['submit']}
          </Button>

        </FooterToolbar>
      )}

      <ModalForm
        title='Chọn tình trạng'
        open={openModalStatus}
        //form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpenModalStatus(false);
          },
        }}
        width={400}
        submitTimeout={2000}
        onFinish={async (values: any) => {
          const transaction = selectedRowsState.map((e: any) => {
            return {
              id: e?.id,
              types: e?.types
            }
          });
          let typeApi = parseInt(values?.method) === 1 || !values?.method ? 'transactions/done-many' : 'transactions/cancel-many';
          confirm(transaction, 'Chắn chắn tiến hành thay đổi Tình trạng xác nhận hàng loạt?', typeApi);
          if (actionRef.current) {
            actionRef.current.reload();
            setOpenModalStatus(false);
          }
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();

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
            submitText: configDefaultText['submit'],
          },
        }}
      >

        <ProFormSelect

          name='method'
          fieldProps={{
            defaultValue: '1'
          }}
          options={[
            {
              label: 'Xác nhận',
              value: '1'
            },
            {
              label: 'Hủy',
              value: '2'
            },
          ]}
        />

      </ModalForm>
      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
