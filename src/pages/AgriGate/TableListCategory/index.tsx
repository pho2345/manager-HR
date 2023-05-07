import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Col, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';

import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'categories');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'categories', id.current);
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
  const hide = message.loading('Đang xóa');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'categories')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  // const intl = useIntl();


  const confirm = (entity: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: configDefaultText['textConfirmDelete'],
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleRemove(entity);
        if (actionRef.current) {
          actionRef.current?.reloadAndRest?.();
        }
      }
    });
  };

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    //setSearchedColumn(dataIndex);
    //console.log('selectedKeys',selectedKeys[0] );
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    // setSearchText('');
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

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      // title: (
      //   <FormattedMessage
      //     id='pages.searchTable.column.code'
      //     defaultMessage='Rule name'
      //   />
      // ),
      title: configDefaultText['page.listCategory.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
          <> {entity?.attributes?.code}</>
        );
      },
      width: '30vh',
      // filtered: true,
      ...getColumnSearchProps('code')
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Description' />,
      title: configDefaultText['page.listCategory.name'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.attributes?.name,
      ...getColumnSearchProps('name')
    },
    

    {
      // title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      title: configDefaultText['page.listCategory.createdAt'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      width: '20vh',
      renderText: (_, text: any) => {
        return moment(text?.attributes?.createdAt).format('DD/MM/YYYY HH:mm')
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
        return (
          <Tooltip
            title={configDefaultText['buttonUpdate']}
          ><MdOutlineEdit
              type='primary'
              key='primary'
              onClick={() => {
                handleUpdateModalOpen(true);
                refIdCateogry.current = entity.id;
                form.setFieldsValue({
                  code: entity?.attributes?.code,
                  name: entity?.attributes?.name
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
            //  await confirm(selectedRows as any, 'xóa', actionRef);
            confirm(selectedRows);
            //actionRef.current?.reloadAndRest?.();
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }


  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}
        options={
          {
            reload: () => {
              return true;
            },
            setting: {
              checkable: true
            }

          }
        }
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
        request={() => customAPIGet({ 'sort[0]': 'createdAt:desc', }, 'categories')}
        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
        columns={columns}
        rowSelection={{
          // onChange: (_, selectedRows: any) => {
          //   setSelectedRows(selectedRows);
          // },

        }}

        tableAlertRender={({ selectedRowKeys }: any) => {
          return renderTableAlert(selectedRowKeys);
        }}


        tableAlertOptionRender={({ selectedRows }: any) => {
          return renderTableAlertOption(selectedRows)
        }}
      />
      {
        // selectedRowsState?.length > 0 && (
        //   <FooterToolbar
        //     extra={
        //       <div>
        //         {/* <FormattedMessage id='chosen' defaultMessage='Đã chọn' />{' '} */}
        //         {`${configDefaultText['chosen']} `}
        //           <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
        //           {/* <FormattedMessage id='Item' defaultMessage='hàng' /> */}
        //           {configDefaultText['selectedItem']}

        //       </div>
        //     }
        //   >
        //     <Button
        //       onClick={async () => {
        //         // await handleRemove(selectedRowsState);
        //         confirm(
        //           selectedRowsState, configDefaultText['textConfirmDelete']
        //         );
        //         setSelectedRows([]);
        //         actionRef.current?.reloadAndRest?.();
        //       }}
        //     >
        //       {configDefaultText['delete']}
        //     </Button>

        //   </FooterToolbar>
        // )
      }


      <ModalForm
        form={form}
        title={configDefaultText['page.listCategory.createModal']}
        width={'30vh'}

        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false)
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

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >



        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              label={configDefaultText['page.listCategory.code']}
              width='md'
              name='code'
              placeholder={configDefaultText['page.listCategory.code']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCategory.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.category.required.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCategory.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.category.required.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]}

              label={configDefaultText['page.listCategory.name']}
              placeholder={configDefaultText['page.listCategory.name']}
              width='md'
              name='name'
            />
          </Col>
        </Row>




      </ModalForm>


      <ModalForm
        title={configDefaultText['page.listCategory.updateModal']}
        form={form}
        width={'30vh'}
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false)
          },
        }}
        onFinish={async (values: any) => {
          const success = await handleUpdate(values as any, refIdCateogry);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >





        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              label={configDefaultText['page.listCategory.code']}
              width='md'
              name='code'
              placeholder={configDefaultText['page.listCategory.code']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCategory.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.category.required.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>


        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listCategory.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.category.required.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]}

              label={configDefaultText['page.listCategory.name']}
              placeholder={configDefaultText['page.listCategory.name']}
              width='md'
              name='name'
            />
          </Col>
        </Row>

      </ModalForm>


    </PageContainer>
  );
};

export default TableList;
