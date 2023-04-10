import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Col, Form, Input, InputRef, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';



const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'status-transactions');
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
  console.log(fields);
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'status-transactions', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error) {
    hide();
    message.error('Cập nhật thất!');
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'status-transactions')
    })
    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error('Xóa thất bại!!');
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);


  const actionRef = useRef<ActionType>();
  const refIdCateogry = useRef<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const intl = useIntl();
  const searchInput = useRef<InputRef>(null);


  const confirm = (entity: any, textConfirm: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: textConfirm,
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
  const handleReset = (clearFilters: any) => {
    clearFilters();
    // setSearchText('');
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
          ref={searchInput}
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
            onClick={() => clearFilters && handleReset(clearFilters)}
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

            }}
          >
            {entity?.attributes?.code}

          </a>
        );
      },
      ...getColumnSearchProps('code')
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Name' />,
      dataIndex: 'name',
      valueType: 'textarea',
      key: 'name',
      ...getColumnSearchProps('name'),
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.value' defaultMessage='Giá trị' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'profit',
      renderText: (_, text: any) => {
        return `${text?.attributes?.value}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.color' defaultMessage='Màu chữ' />,
      dataIndex: 'color',
      valueType: 'textarea',
      key: 'color',
      renderText: (_, text: any) => {
        return `${text?.attributes?.color}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.backgroundColor' defaultMessage='Màu nền' />,
      dataIndex: 'backgroundColor',
      valueType: 'textarea',
      key: 'backgroundColor',
      renderText: (_, text: any) => {
        return `${text?.attributes?.background}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Option' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Tooltip
          title={<FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdCateogry.current = entity.id;
              form.setFieldsValue({
                code: entity?.attributes?.code,
                name: entity?.attributes?.name,
                value: entity?.attributes?.value,
                color: entity?.attributes?.color,
                background: entity?.attributes?.background
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
        request={() => customAPIGet({}, 'status-transactions')}
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
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {

              confirm(
                selectedRowsState, `Bạn có chắc xóa?`
              );

              // await handleRemove(selectedRowsState);
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
          id: 'pages.searchTable.createForm.new',
          defaultMessage: 'New rule',
        })}
        width='35vh'
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
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

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
          },
        }}
      >

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.code'
                      defaultMessage='Nhập mã'
                    />
                  ),
                },
              ]}
              label='Mã'
              className='w-full'
              name='code'
              placeholder='Mã'
            />
          </Col>
        </Row>
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.code'
                      defaultMessage='Nhập tên'
                    />
                  ),
                },
              ]}
              label='Tên'
              className='w-full'
              name='name'
              placeholder='Tên'
            />
          </Col>
        </Row>




        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.value'
                      defaultMessage='Nhập giá trị'
                    />
                  ),
                },
              ]}
              label='Giá trị'
              width='md'
              name='value'
              placeholder='Nhập giá trị'
            />

          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.color'
                      defaultMessage='Yêu cấu nhập màu chữ'
                    />
                  ),
                },
              ]}
              label='Màu chữ'
              className='w-full'
              name='color'
              placeholder='Màu chữ'
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.backgroundColor'
                      defaultMessage='Yêu cấu nhập màu nền'
                    />
                  ),
                },
              ]}
              label='Màu nền'
              className='w-full'
              name='background'
              placeholder='Màu nền'
            />
          </Col>
        </Row>


      </ModalForm>


      <ModalForm
        form={form}
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.update',
          defaultMessage: '',
        })}
        width='35vh'
        open={updateModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleUpdateModalOpen(false);
          },
        }}
        onFinish={async (value) => {
          const success = await handleUpdate(value as any, refIdCateogry);
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
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
          },
        }}
      >
       
       <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.code'
                      defaultMessage='Nhập mã'
                    />
                  ),
                },
              ]}
              label='Mã'
              className='w-full'
              name='code'
              placeholder='Mã'
            />
          </Col>
        </Row>
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.code'
                      defaultMessage='Nhập tên'
                    />
                  ),
                },
              ]}
              label='Tên'
              className='w-full'
              name='name'
              placeholder='Tên'
            />
          </Col>
        </Row>




        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
          <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id='pages.listStatusTransaction.value'
                  defaultMessage='Nhập giá trị'
                />
              ),
            },
          ]}
          label='Giá trị'
          width='md'
          name='value'
          placeholder='Nhập giá trị'
        />

          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.color'
                      defaultMessage='Yêu cấu nhập màu chữ'
                    />
                  ),
                },
              ]}
              label='Màu chữ'
              className='w-full'
              name='color'
              placeholder='Màu chữ'
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listStatusTransaction.backgroundColor'
                      defaultMessage='Yêu cấu nhập màu nền'
                    />
                  ),
                },
              ]}
              label='Màu nền'
              className='w-full'
              name='background'
              placeholder='Màu nền'
            />
          </Col>
        </Row>
       
      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
