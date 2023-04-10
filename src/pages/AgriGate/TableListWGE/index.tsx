import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDigit } from '@ant-design/pro-components';
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
    await customAPIAdd({ ...fields }, 'weight-gain-effects');
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
    }, 'weight-gain-effects', id.current);
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
      return customAPIDelete(e.id, 'weight-gain-effects')
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
      title: <FormattedMessage id='pages.searchTable.column.classify' defaultMessage='Phân loại' />,
      dataIndex: 'name',
      valueType: 'textarea',
      key: 'name',
      ...getColumnSearchProps('name'),
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.valueFrom' defaultMessage='Giá trị dưới' />,
      dataIndex: 'valueFrom',
      valueType: 'textarea',
      key: 'valueFrom',
      ...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        if (text?.attributes?.valueFrom === 0) {
          return null;
        }
        return text?.attributes?.valueFrom;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.valueTo' defaultMessage='Giá trị trên' />,
      dataIndex: 'valueTo',
      valueType: 'textarea',
      key: 'valueTo',
      ...getColumnSearchProps('name'),
      renderText: (_, text: any) => {
        if (text?.attributes?.valueTo > 200) {
          return null;
        }
        return text?.attributes?.valueTo;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.classify' defaultMessage='Phân loại' />,
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
        if (text?.attributes?.valueFrom > 100) {
          return `WGE > ${text?.attributes?.valueFrom}%`
        }
        else if (text?.attributes?.valueFrom >= 95) {
          return ` ${text?.attributes?.valueFrom}% < WGE <=  ${text?.attributes?.valueTo}%`
        } else if (text?.attributes?.valueFrom >= 90) {
          return ` ${text?.attributes?.valueFrom}% < WGE <=  ${text?.attributes?.valueTo}%`
        } else if (text?.attributes?.valueFrom < 90) {
          return `WGE < ${text?.attributes?.valueTo}%`
        }
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
                valueFrom: entity?.attributes?.valueFrom,
                valueTo: entity?.attributes?.valueTo,
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
        request={() => customAPIGet({}, 'weight-gain-effects')}
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

        pagination={{
          locale: {
           next_page: 'Trang sau',
           prev_page: 'Trang trước',
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
                      id='pages.listWGE.code'
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
                      id='pages.listWGE.code'
                      defaultMessage='Nhập phân loại'
                    />
                  ),
                },
              ]}
              label='Phân loại'
              className='w-full'
              name='name'
              placeholder='Phân loại'
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listWGE.valueFrom'
                      defaultMessage='Nhập giá trị dưới'
                    />
                  ),
                },
              ]}
              label='Nhập giá trị dưới'
              className='w-full'
              name='valueFrom'
              placeholder='Nhập giá trị dưới'
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >

            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listWGE.valueTo'
                      defaultMessage='Nhập giá trị trên'
                    />
                  ),
                },
              ]}
              label='Nhập giá trị trên'
              className='w-full'
              name='valueTo'
              placeholder='Nhập giá trị trên'
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
                      id='pages.listWGE.color'
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
                      id='pages.listWGE.backgroundColor'
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
                      id='pages.listWGE.code'
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
                      id='pages.listWGE.code'
                      defaultMessage='Nhập phân loại'
                    />
                  ),
                },
              ]}
              label='Phân loại'
              className='w-full'
              name='name'
              placeholder='Phân loại'
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listWGE.valueFrom'
                      defaultMessage='Nhập giá trị dưới'
                    />
                  ),
                },
              ]}
              label='Nhập giá trị dưới'
              className='w-full'
              name='valueFrom'
              placeholder='Nhập giá trị dưới'
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >

            <ProFormDigit
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.listWGE.valueTo'
                      defaultMessage='Nhập giá trị trên'
                    />
                  ),
                },
              ]}
              label='Nhập giá trị trên'
              className='w-full'
              name='valueTo'
              placeholder='Nhập giá trị trên'
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
                      id='pages.listWGE.color'
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
                      id='pages.listWGE.backgroundColor'
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
