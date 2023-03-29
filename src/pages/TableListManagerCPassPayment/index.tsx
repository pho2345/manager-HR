import {
  customAPIDelete,
  customAPIGetOne,
  customAPIUpdateMany,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Button, Checkbox, Drawer, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";





const handleUpdate = async (fields: any, api: any, value: any) => {
  //console.log('fields', fields);
  const hide = message.loading('Đang cập nhật...');
  try {

    const updateTransaction = await customAPIUpdateMany(
      { ...fields },
      api,
      value
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


const handleRemove = async (selectedRows: any) => {

  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'transactions');
    });

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Xóa thất bại');
    return false;
  }
};




const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const refTransaction = useRef<any>();
  const params = useParams<number>();

  const confirm = (entity: any, message: any, api: string, types: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdate({
          ...entity
        }, api, types);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };



  useEffect(() => {
    const getValues = async () => {


    };
    getValues();
  }, []);

  const intl = useIntl();


  const columns: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <><a
            onClick={() => {
              setCurrentRow(entity?.id);
              setShowDetail(true);
            }}>
            {entity?.sender?.fullname ? entity?.sender?.fullname : entity?.sender?.username}-{entity?.sender?.id}
          </a><br /> {entity?.sender?.phone}{`${entity?.sender.email ? `|${entity?.sender.email}` : null}`}
            <br /> CCCD/HC: {entity?.sender.passport}
          </>
        );
      },
    },


    {
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      width: 60,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {

      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.cPassBuy' defaultMessage='Số cPass đã mua' />,
      width: 70,
      dataIndex: 'cPassBuy',
      valueType: 'textarea',
      key: 'cPassBuy',
      renderText: (_, text: any) => {

      }
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.cpass' defaultMessage='CPass' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.code}
        </>)
      }
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />
      ),
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.pZero}
        </>)
      }
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />
      ),
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.vs}
        </>)
      }
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />
      ),
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.vZero}
        </>)
      }
    },


    {
      title: (
        <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS (VNĐ|Ale)' />
      ),
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.megaS} <Checkbox disabled checked={(text?.status === 'done' && text?.method === 'vnd') || text?.status === 'inProgress' } /> | {text?.c_pass?.price} <Checkbox disabled checked={text?.status === 'done' && text?.method === 'ale'} />
        </>)
      }
    },


    {
      title: (
        <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      ),
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'vZero',
      render: (_, text: any) => {
        let status;
        switch (text?.status) {
          case 'waitConfirm':
            status = `Chờ thanh toán bằng VNĐ`
            break;
            case 'inProgress':
              status = `Đã thanh toán bằng VNĐ, Chờ xác nhận`
              break;
          case 'done':
            if (text?.method === 'vnd') {
              status = `Đã thanh toán bằng VNĐ`;
            }
            else {
              status = `Đã thanh toán bằng Ale`;

            }
            break;
          default:
            break;
        }
        return status;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        let button = [];
        if (entity?.status === 'done') {
          button.push(<><Button
            onClick={() => {
              handleModalOpen(true);
              refTransaction.current = entity.id
            }}

          >Refund</Button></>);
        }

        if (entity?.status === 'waitConfirm' || entity?.status === 'inProgress' && entity?.method === 'vnd') {
          button.push(<>
            <Button disabled={entity?.c_pass?.price > entity?.aleWallet?.ale} onClick={() => {
              confirm({
                transaction: [entity.id]
              }, `Chắc chắn muốn thanh toán MegaS của cPass: ${entity.c_pass.code} bằng Ale không?`, 'transactions/payale', '');
            }}>Pay</Button>
          </>)

        }

        return (<>{button}</>);
      },
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
        rowClassName={(record) => {
          if (record?.status === 'done') {
            return 'payCPass'
          }
          else {
            return ''
          }
        }}


        search={false}
        toolBarRender={() => [

        ]}
        request={async () => {
          const data = await customAPIGetOne(params?.id, 'transactions/find-c-pass-payment',);
          return {
            data: data,
            success: true,
            total: data?.length
          }
        }
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='Item' />
              
            </div>
          }
        >
          <Button
            onClick={async () => {
              let text = '';
              const transaction = selectedRowsState.map((e: any, index: number)  => {
                text += index === 0 ? e?.c_pass?.code : `, ${e?.c_pass?.code}` ;
                return e?.id
              })
              confirm({
                transaction: transaction
              }, `Chắc chắn muốn thanh toán MegaS của cPass: ${text} bằng Ale không?`, 'transactions/payale', '');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
           Pay
          </Button>
          <Button type='primary'>
            <FormattedMessage
              id='pages.searchTable.batchApproval'
              defaultMessage='Batch approval'
            />
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title='Chọn phương thức hoàn trả'
        open={createModalOpen}
        //form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        width={400}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          const refund = await handleUpdate({
            data: { types: values.method, transaction: [refTransaction.current] }
          }, 'transactions/refund', null);
          if (refund) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          return true;
        }}
      >

        <ProFormSelect
          //value={method}
          style={{ width: 200 }}
          //onChange={handleChange}

          name='method'
          options={[
            {
              label: 'VNĐ',
              options: [
                { label: 'Ví điện tử', value: 'jack' },
              ],
            },
            {
              label: 'Ale',
              value: 'ale'
            },
          ]}
        />

      </ModalForm>




      <Drawer
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
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
