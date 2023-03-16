import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIGetOne,

} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link, useIntl, } from '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const groupCow = await customAPIAdd({ ...fields }, 'group-cows/add');
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    console.log(error);
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate(
      {
        ...fields,
      },
      api,
     // 'group-cows/update',
      id,
    );
    hide();

    message.success('Cập nhật thành công');
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
      return customAPIDelete(e.id, 'group-cows');
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

const confirm = (entity: any, message: string, actionRef: any) => {
  console.log(entity);
  Modal.confirm({
    title: 'Confirm',
    icon: <ExclamationCircleOutlined />,
    content: `Bạn có muốn ${message}?`,
    okText: 'Có',
    cancelText: 'Không',
    onOk: async () => {
      // await handleUpdateMany({
      //   cPass: [entity.id]
      // }, api, id);
      await handleRemove(entity);
       if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  });
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [farm, setFarm] = useState<any>();

  const refIdPicture = useRef<any>();
  useEffect(() => {
    const getValues = async () => {
      let getFarms = await getFarm();
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
          <Link to={`/cows/` + entity.id}>
            {entity?.code}
          </Link>
        );

      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text: any) => text?.farm?.name,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.name,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.active' defaultMessage='Hoạt động' />,
      dataIndex: 'active',
      valueType: 'textarea',
      key: 'active',
      render: (_, text: any) => {
        return (<><ProFormSwitch disabled fieldProps={{ checked: text?.active }}></ProFormSwitch></>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.description' defaultMessage='Mô tả' />,
      dataIndex: 'description',
      valueType: 'textarea',
      key: 'description',
      renderText: (_, text: any) => text?.description,
    },



    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (
          <>
            <Button
              type='primary'

              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdCow.current = entity.id;
                const cow = await customAPIGetOne(entity.id, 'group-cows/find-admin', {});

                form.setFieldsValue({
                  ...cow
                });

              }
              }
            >
              <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
            </Button>

            <Button
              type='primary'
              onClick={async () => {
                await handleUpdate({
                  active: !entity.active
                }, 'group-cows/update' ,  entity.id);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              <FormattedMessage id='pages.searchTable.active' defaultMessage={entity.active ? 'Inactive' : 'Active'} />
            </Button>
          </>
        );
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
        search={{
          labelWidth: 120,
        }}
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
            'group-cows/find-admin',
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

              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await confirm(selectedRowsState as any, 'xóa', actionRef);
              setSelectedRows([]);
             
              await actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
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
          <ProFormSelect width='md' options={farm} required placeholder='Chọn trang trại' name='farm' label='Trang trại' />
          <ProFormText width='md' name='name' label='Tên' required placeholder='Tên' /></ProForm.Group>
        <ProFormSwitch name='active' label='Kích hoạt' fieldProps={{ defaultChecked: true, }} />
        <ProFormTextArea width='xl' label='Mô tả chi tiết' name='description' />


      </ModalForm>

      <ModalForm
        title='Cập nhật'
        open={updateModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
            refIdPicture.current = null;

          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          const success = await handleUpdate(values as any, 'group-cows/update' , refIdCow?.current as any);


          if (success) {
            if (typeof refIdPicture.current !== 'undefined' && refIdPicture?.current?.length !== 0) {
              console.log('refIdPicture', refIdPicture.current);
              if (refIdPicture.current !== null) {
                const deletePicture = refIdPicture?.current.map((e: any) => {
                  return customAPIDelete(e as any, 'upload/files');
                })
                await Promise.all(deletePicture);
              }

            }

            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
              refIdPicture.current = null;
            }
          }

          return true;
        }}
      >

        <ProForm.Group>
          <ProFormSelect width='md' options={farm} required placeholder='Chọn trang trại' name='farm' label='Trang trại' />
          <ProFormText width='md' name='name' label='Tên' required placeholder='Tên' /></ProForm.Group>
        <ProFormSwitch name='active' label='Kích hoạt' />
        <ProFormTextArea width='xl' label='Mô tả chi tiết' name='description' />
      </ModalForm>

    </PageContainer>
  )
};

export default TableList;
