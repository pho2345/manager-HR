import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Form, message } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';

const handleAdd = async (fields: any) => {
  console.log(fields);
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'e-wallets');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'e-wallets', id.current);
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
      return customAPIDelete(e.id, 'e-wallets')
    })

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
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdEWallet= useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [codeEWallet, setCodeEWallet] = useState<any>();
  const [nameEWallet, setNameEWallet] = useState<any>();
  const [owner, setOwner] = useState<any>();
  const [accountNumber, setAccountNumber] = useState<any>();
  const intl = useIntl();
  const columns: ProColumns<any>[] = [
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Rule name'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <a
            onClick={() => {
              setCurrentRow(entity?.attributes?.code);
              setShowDetail(true);
            }}
          >
            {entity?.attributes?.code}

          </a>
        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.onwer' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'owner',
      renderText: (_, text: any) => text?.attributes?.owner
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.accountNumber' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'accountNumber',
      renderText: (_, text: any) => text?.attributes?.accountNumber
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Descriptiond' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Button
          type='primary'
          key='primary'
          onClick={() => {
            handleUpdateModalOpen(true);
            refIdEWallet.current = entity.id;
            setCodeEWallet(entity?.attributes?.code);
            setNameEWallet(entity?.attributes?.name);
            setAccountNumber(entity?.attributes?.accountNumber);
            setOwner(entity?.attributes?.owner);



          }}
        >
          <FormattedMessage id='pages.searchTable.update' defaultMessage='New' />
        </Button>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
        request={() => customAPIGet({}, 'e-wallets')}
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
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chọn' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='item' />
              &nbsp;&nbsp;
              <span>
              

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
            
        </FooterToolbar>
      )}
      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newEWallet',
          defaultMessage: 'New E-Wallet',
        })}
        width='400px'
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as any);
          if (success) {
            handleModalOpen(false);
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
                  id='pages.searchTable.Code'
                  defaultMessage='Nhập mã'
                />
              ),
            },
          ]}
          width='md'
          name='code'
          placeholder='Mã'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Name'
                  defaultMessage='Yêu cầu nhập tên E-Wallet'
                />
              ),
            },
          ]}
          width='md'
          name='name'
          placeholder='Tên E-Wallet'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Owner'
                  defaultMessage='Yêu cầu nhập tên người sở hữu!'
                />
              ),
            },
          ]}
          width='md'
          name='owner'
          placeholder='Tên người sở hữu'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.accountNumber'
                  defaultMessage='Yêu cầu nhập số tài khoản!'
                />
              ),
            },
          ]}
          width='md'
          name='accountNumber'
          placeholder='Số tài khoản'
        />
      </ModalForm>


      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.updateEWallet',
          defaultMessage: 'Update E-Wallet',
        })}
        width='400px'
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        onFinish={async (value) => {
          console.log(value);
          let values = {
              code: codeEWallet,
              name: nameEWallet,
              owner: owner,
              accountNumber: accountNumber
          }
          const success = await handleUpdate(values as any, refIdEWallet);
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
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Code'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: codeEWallet,
            onChange: (e) => {
              setCodeEWallet(e.target.value);
            }
          }}
          width='md'
          name='code'
          placeholder='Mã'
        />

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Name'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: nameEWallet,
            onChange: (e) => {
              setNameEWallet(e.target.value);
            }
          }}
          width='md'
          name='name'
          placeholder='Tên E-Wallet'
        />


        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.Owner'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: owner,
            onChange: (e) => {
              setOwner(e.target.value);
            }
          }}
          width='md'
          name='owner'
          placeholder='Tên người sở hữu'
        />

        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: (
          //       <FormattedMessage
          //         id='pages.searchTable.accountNumber'
          //         defaultMessage='Rule name is required'
          //       />
          //     ),
          //   },
          // ]}
          fieldProps={{
            value: accountNumber,
            onChange: (e) => {
              setAccountNumber(e.target.value);
            }
          }}
          width='md'
          name='accountNumber'
          placeholder='Số tài khoản'
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
          <ProDescriptions<any>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<any>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
