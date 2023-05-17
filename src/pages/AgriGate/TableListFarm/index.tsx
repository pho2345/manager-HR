import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Form, Input, message, Modal, Space, Tooltip } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
// import ButtonCacel from '../../components/ButtonCancelChosen/indes';
import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'farms');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
     ...fields
    }, 'farms', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'farms')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};

const confirm = (entity: any, message: string, actionRef: any) => {
  console.log(entity);
  Modal.confirm({
    title: configDefaultText['titleConfirm'],
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
        actionRef.current?.reloadAndRest?.();
      }
    }
  });
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  //const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdEWallet = useRef<any>();
  //const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  // const [searchText, setSearchText] = useState<any>();

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys',selectedKeys[0] );
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    //setSearchText('');
    confirm({
      closeDropdown: false,
    });
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          // ref={configDefaultText[]}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
        onClick={() => {
        }}
      />
    ),
    onFilter: (value: any, record: any) => {
      if (record.attributes[dataIndex]) {
        return record.attributes[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        //setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{
    // }
  });

  const columns: ProColumns<any>[] = [
    {
      title: configDefaultText['page.listFarm.column.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {

        return (
         <>
            {entity?.attributes?.code}</>

        );
      },
      ...getColumnSearchProps('code')
    },
    {
      title: configDefaultText['page.listFarm.column.name'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) =>text?.attributes?.name,
      ...getColumnSearchProps('name')

    },
    // {
    //   title:  configDefaultText['page.listFarm.column.phone'],
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'phone',
    //   renderText: (_, text: any) => text?.attributes?.phone
    // },
    {
      title: configDefaultText['page.listFarm.column.taxId'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'mst',
      renderText: (_, text: any) => text?.attributes?.taxId
    },
    // {
    //   title: configDefaultText['page.listFarm.column.address'],
    //   dataIndex: 'atrributes.address',
    //   valueType: 'textarea',
    //   key: 'address',
    //   renderText: (_, text: any) => {
    //     if (text.attributes.address) {
    //       let address = text?.attributes?.address?.data?.attributes.address;
    //       let pathAddress = text?.attributes?.address?.data?.attributes?.ward?.data?.attributes?.pathFullName;
    //       if (typeof address !== 'undefined' && typeof pathAddress !== 'undefined') {
    //         return `${address}, ${pathAddress}`;
    //       }
    //     }
    //     return null;
    //   }
    // },
    // {
    //   title: <FormattedMessage id='pages.searchTable.column.owner' defaultMessage='Code Tax' />,
    //   dataIndex: 'atrributes',
    //   valueType: 'textarea',
    //   key: 'owner',
    //   renderText: (_, text: any) => {
    //     let fullName = text?.attributes?.owner?.data?.attributes?.fullname;
    //     if (typeof fullName !== 'undefined' && fullName) {
    //       return fullName;
    //     }
    //     return null;
    //   }
    // },
    

    {
      title:  configDefaultText['createdAt'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      width: '20vh',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('DD/MM/YYYY HH:mm')
      }

    },
    {
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (<Tooltip
          title={configDefaultText['buttonUpdate']}
          style={{
            textAlign: 'center'
          }}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdEWallet.current = entity.id;
              // setCodeEWallet(entity?.attributes?.code);
              // setNameEWallet(entity?.attributes?.name);
              // setAccountNumber(entity?.attributes?.accountNumber);
              // setOwner(entity?.attributes?.owner);
              form.setFieldsValue({
                code: entity?.attributes?.code,
                name: entity?.attributes?.name,
                taxId :  entity?.attributes?.taxId

              })
            }}
          /></Tooltip>

        )
      }
    },

  ];

  function renderTableAlert(selectedRowKeys: any) {
    return (
     
          <Fragment>
            Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
          </Fragment>
    );
  }


  function renderTableAlertOption(selectedRows: any) {
    return (
      <>
        <Fragment>
        <Button onClick={async () => {
             await confirm(selectedRows as any, 'xóa', actionRef);
            // actionRef.current?.reloadAndRest?.();
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }



  return (
    <PageContainer>
      <ProTable
        // headerTitle={intl.formatMessage({
        //   id: 'pages.searchTable.title',
        //   defaultMessage: 'Enquiry form',
        // })}
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
            <PlusOutlined /> {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={() => customAPIGet({ 'populate[0]': 'address.ward.district.province', 'populate[1]': 'owner',  'sort[0]': 'createdAt:desc' }, 'farms')}
        columns={columns}
        rowSelection={{
          // onChange: (_, selectedRows: any) => {
          //   //setSelectedRows(selectedRows);
          // },
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

        // tableAlertRender={({selectedRowKeys}: any) => {
        //   return renderTableAlert(selectedRowKeys);
        // }}

        tableAlertRender={({selectedRowKeys}: any) => {
          return renderTableAlert(selectedRowKeys);
        }}


        tableAlertOptionRender={({  selectedRows}: any) => {
         return renderTableAlertOption(selectedRows)
        }}


      />

      

      {
      // selectedRowsState?.length > 0 && (
      //   <FooterToolbar
      //     extra={
      //       <div>
      //         {`${configDefaultText['chosen']} `}
      //         <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
      //         {/* <FormattedMessage id='Item' defaultMessage='hàng' /> */}
      //         {configDefaultText['selectedItem']}


      //       </div>
      //     }
      //   >
      //     <Button
      //       onClick={async () => {
      //         await confirm(selectedRowsState as any, 'xóa', actionRef);
      //         setSelectedRows([]);

      //         await actionRef.current?.reloadAndRest?.();
      //       }}
      //     >
      //       {configDefaultText['delete']}
      //     </Button>

      //   </FooterToolbar>
      // )
      }
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
          label='Tên'

          name='name'
          placeholder='Tên'
        />
{/* 
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
        /> */}


        <ProFormText
          label='Mã số thuế'
          
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
        width={`35vh`}
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
          label='Tên'
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
{/* 
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
        /> */}


        <ProFormText
          label='Mã số thuế'
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
    </PageContainer>
  );
};

export default TableList;
