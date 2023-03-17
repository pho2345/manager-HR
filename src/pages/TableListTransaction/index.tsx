import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdateMany,
  customAPIDelete,
  customAPIUpload,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    const cow = await customAPIAdd({ ...fields }, 'transactions');

    const uploadImages = fields?.upload.map((e: any) => {
      let formdata = new FormData();
      formdata.append('files', e?.originFileObj);
      formdata.append('ref', 'api::cow.cow');
      formdata.append('refId', cow?.data?.id);
      formdata.append('field', 'photos');
      return customAPIUpload({
        data: formdata
      })
    });
    await Promise.all(uploadImages);
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdateMany = async (fields: any, api: any) => {
  console.log(fields);
  const hide = message.loading('Đang cập nhật...');
  try {

    const updateTransaction = await customAPIUpdateMany(
      {...fields},
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

const getCategory = async () => {
  const categories = await customAPIGet({}, 'categories');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    };
  });
  return data;
};

const getFarm = async () => {
  const categories = await customAPIGet({}, 'farms');
  let data = categories.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
    };
  });
  return data;
};



const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [category, setCategory] = useState<any>();
  const [farm, setFarm] = useState<any>();

  const confirm = (entity: any, message: string, api: string, types: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        console.log('oke');
        await handleUpdateMany({
          transaction: [...entity],
          types: types
        }, api);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };


  useEffect(() => {
    const getValues = async () => {
      let getCate = await getCategory();
      let getFarms = await getFarm();
      setCategory(getCate);
      setFarm(getFarms);
    };
    getValues();
  }, []);

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity?.code);
              setShowDetail(true);
            }}
          >
            {entity?.code}
          </a>
        );
      },
    },

    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.sender'
          defaultMessage='Người giao dịch'
        />
      ),
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.reveicer' defaultMessage='Người nhận' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'receiver',
      renderText: (_, text: any) => text?.receiver?.fullname || text?.receiver?.username,
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Ale' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => text?.ale

      ,
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.cpass' defaultMessage='CPass' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      renderText: (_, text: any) => text?.c_pass?.code,
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      ),
      dataIndex: 'method',
      valueType: 'textarea',
      key: 'method',
      renderText: (_, text: any) => text?.method,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.types' defaultMessage='Loại' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      render: (_, text: any) => {
        switch (text?.types) {
          case 'cpassPayment':
            return (<div style={{ color: 'green' }}>Giao dịch CPass</div>);

          case 'cpassSettlement':
            return (<div style={{ color: 'cyan' }}>Thanh quyết toán</div>);

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
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Trạng thái' />
      ),
      dataIndex: 'atrributes',
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
    },

    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        if (entity?.status === 'inProgress') {
          return (
            <Button onClick={() => confirm([entity.id] , 'xác nhận', 'transactions/done', entity.types)}>Xác nhận</Button>
          );
        }
        if (entity?.status === 'waitRefund') {
          return (
           
             <Button onClick={() => confirm([entity.id], 'xác nhận','transactions/done', entity.types )}>Xác nhận hoàn trả</Button>
          );
        }
        return null;
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
        search={false}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='New' />
          </Button>,
        ]}
        request={() =>
          customAPIGet(
            {},
            'transactions/findadmin',
          )
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
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id='pages.searchTable.totalServiceCalls'
                  defaultMessage='Total number of service calls'
                />{' '}
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
            />
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
        title='Tạo mới'
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          const success = await handleAdd(values as any);
          if (success) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          //message.success('Success');
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormText width='md' name='code' label='Mã' placeholder='Mã' />

          <ProFormText width='md' name='name' label='Tên' placeholder='Tên' />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width='md'
            name='firstWeight'
            label='Cân nặng P0'
            placeholder='Cân nặng P0'
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect options={category} placeholder='Chọn giống bò' required width='md' name='category' label='Giống bò' />
          <ProFormSelect width='md' options={farm} required placeholder='Chọn trang trại' name='farm' label='Trang trại' />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker name='birthdate' placeholder='Chọn ngày sinh' required label='Ngày sinh' />
          <ProFormText width='xs' name='age' label='Tuổi' placeholder='Tuổi' />
          <ProFormSelect
            width='xs'
            name='sex'

            label='Giới tính'
            options={[
              {
                label: 'Đực',
                value: 'male',
              },
              {
                label: 'Cái',
                value: 'female',
              },
            ]}
            placeholder='Chọn giới tính'
            rules={[{ required: true, message: 'Chọn giới tính!' }]}
          />
          <ProFormSelect
            width='xl'
            name='status'
            label='Trạng thái'
            options={[
              {
                label: 'Mới',
                value: 'new',
              },
              {
                label: 'Sẳn sàng',
                value: 'ready',
              },
              {
                label: 'Đã thêm vào CPass',
                value: 'cpassAdded',
              },

              {
                label: 'Đã thêm vào phiên',
                value: 'fairAdded',
              },
              {
                label: 'Đã ở trong phiên mở bán',
                value: 'fairOpen',
              },
              {
                label: 'Trong đặt hàng của phiên',
                value: 'fairOrder',
              },
              {
                label: 'Đã thanh toán',
                value: 'paid',
              },
              {
                label: 'Sẵn sàng nuôi',
                value: 'readyFeed',
              },
              {
                label: 'Chờ nuôi',
                value: 'waitingFeed',
              },
            ]}
            placeholder='Trạng thái'
            rules={[{ required: true, message: 'Trạng thái!' }]}
          />
        </ProForm.Group>

        <ProFormUploadButton
          title='Up load'
          name='upload'
          label='Upload'
          max={2}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}

        //ction={() => customAPIUpload({})}
        />

        <ProFormTextArea width='xl' label='Mô tả chi tiết' placeholder='Nhập chi tiết' name='description' />
      </ModalForm>

      <ModalForm
        //title='Cập nhật'
        open={updateModalOpen}
        form={form}

        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {

          //const success = await handleUpdate(values as any, refIdCow as any);
          // if (success) {
          //   handleUpdateModalOpen(false);
          //   form.resetFields();
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
          message.success('Success');
          return true;
        }}
      >

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
