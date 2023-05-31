import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Form, message, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';


const handleAdd = async (fields: API.RuleListItem) => {
  console.log(fields);
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'e-wallets');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Thêm thất bại');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      name: fields.name,
      code: fields.code,
      shortName: fields.shortName,
    }, 'e-wallets', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại  !');
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
    message.error('Xóa thất bại!');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  //const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdEWallet = useRef<any>();
  //const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
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

        return (
          <a
            onClick={() => {
             //setCurrentRow(entity?.attributes?.code);
              //setShowDetail(true);
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
      renderText: (_, text: any) =>
        text?.attributes?.name

    },
    {
      title: <FormattedMessage id='pages.searchTable.column.phone' defaultMessage='Phone' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'phone',
      renderText: (_, text: any) => text?.attributes?.phone
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.taxId' defaultMessage='Code Tax' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'mst',
      renderText: (_, text: any) => text?.attributes?.taxId
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.address' defaultMessage='Address' />,
      dataIndex: 'atrributes.address',
      valueType: 'textarea',
      key: 'address',
      renderText: (_, text: any) => {
        if (text.attributes.address) {
          let address = text?.attributes?.address?.data?.attributes.address;
          let pathAddress = text?.attributes?.address?.data?.attributes?.ward?.data?.attributes?.pathFullName;
          if (typeof address !== 'undefined' && typeof pathAddress !== 'undefined') {
            return `${address}, ${pathAddress}`;
          }
        }
        return null;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.owner' defaultMessage='Code Tax' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'owner',
      renderText: (_, text: any) => {
        let fullName = text?.attributes?.owner?.data?.attributes?.fullname;
        if (typeof fullName !== 'undefined' && fullName) {
          return fullName;
        }
        return null;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Descriptiond' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Tooltip
          title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              // refIdEWallet.current = entity.id;
              // setCodeEWallet(entity?.attributes?.code);
              // setNameEWallet(entity?.attributes?.name);
              // setAccountNumber(entity?.attributes?.accountNumber);
              // setOwner(entity?.attributes?.owner);
              form.setFieldsValue({
                code: entity?.attributes?.code,
                name: entity?.attributes?.name,


              })
            }}
          /></Tooltip>

        )
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
        request={() => customAPIGet({ 'populate[0]': 'address.ward.district.province', 'populate[1]': 'owner' }, 'farms')}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {

            setSelectedRows(selectedRows);
          },
        }}

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
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id='pages.searchTable.item' defaultMessage='项' />


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
        title='Tạo mới'
        width={`35vh`}
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
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
                  defaultMessage='Yêu cầu nhập mã!'
                />
              ),
            },
          ]}
          label='Mã'
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
                  defaultMessage='Yêu cầu nhập tên!'
                />
              ),
            },
          ]}
          width='md'
          name='name'
          placeholder='Tên'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.Owner'
                  defaultMessage='Rule name is required'
                />
              ),
            },
          ]}
          width='md'
          name='owner'
          placeholder='Owner'
        />

        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.column.phone'
                  defaultMessage='Số điện thoại!'
                />
              ),
            },
          ]}
          width='md'
          name='phone'
          placeholder='Số điện thoại'
        />

        <ProFormText
          
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.searchTable.column.mst'
                  defaultMessage='MST!'
                />
              ),
            },
          ]}
          width='md'
          name='taxId'
          placeholder='Mã số thuế'
        />


      </ModalForm>


      <ModalForm
        form={form}
        title='Cập nhật'
        width='400px'
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleUpdate(value as any, refIdEWallet);
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
          placeholder='Tên'
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
          placeholder='Chủ sở hữu'
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
          name='phone'
          placeholder='Số điện thoại'
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
          name='taxId'
          placeholder='Mã số thuế'
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
