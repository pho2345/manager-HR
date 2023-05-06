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

// import { 
//   //FormattedMessage, 
//   useIntl } from '@umijs/max';
import { Button, Col, Form, Input, InputRef, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import configText from '@/locales/configText';
import { SketchPicker } from 'react-color';
const configDefaultText = configText;


const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'status-owners');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error : any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    // message.error('Thêm thất bại!');
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'status-owners', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    // message.error('Cập nhật thất!');
    return false;
  }
};

const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'status-owners')
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
  //const intl = useIntl();
  const searchInput = useRef<InputRef>(null);

  const [color, setColor] = useState();
  const [colorBackground, setColorBackground] = useState();

  const [openColor, setOpenColor] = useState<boolean>(false);
  const [openColorBackground, setOpenBackground] = useState<boolean>(false);

  const pickerRef = useRef(null);
  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
    form.setFieldValue('color', newColor.hex);
  };

  const handleColorBackgroundChange = (newColor: any) => {
    setColorBackground(newColor.hex);
    form.setFieldValue('background', newColor.hex);
  };

  const handleClickOutside = (event: any) => {
    if (pickerRef.current && !pickerRef?.current?.contains(event.target)) {
      setOpenColor(false);
      setOpenBackground(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleColorPicker = () => {
    // console.log('abc');
    setOpenColor(!openColor);
  };

  const toggleColorBackgroundPicker = () => {
    // console.log('abc');
    setOpenBackground(!openColorBackground);
  };

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
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
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
      title: configDefaultText['page.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        ;
        return (
         <>
            {entity?.attributes?.code}</>

        );
      },
      ...getColumnSearchProps('code')
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Name' />,
      title: configDefaultText['page.name'],
      dataIndex: 'name',
      valueType: 'textarea',
      key: 'name',
      ...getColumnSearchProps('name'),
      renderText: (_, text: any) => text?.attributes?.name
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.value' defaultMessage='Giá trị' />,
      title: configDefaultText['page.value'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'profit',
      renderText: (_, text: any) => {
        return `${text?.attributes?.value}`
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.color' defaultMessage=' Màu chữ' />,
      title: configDefaultText['page.color'],
      dataIndex: 'color',
      valueType: 'textarea',
      key: 'color',
      renderText: (_, text: any) => {
        return `${text?.attributes?.color}`
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.backgroundColor' defaultMessage='Màu nền' />,
      title: configDefaultText['page.backgroundColor'],
      dataIndex: 'backgroundColor',
      valueType: 'textarea',
      key: 'backgroundColor',
      renderText: (_, text: any) => {
        return `${text?.attributes?.background}`
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Option' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        return (<Tooltip
          title={configDefaultText['buttonUpdate']}
        ><MdOutlineEdit
            onClick={() => {
              handleUpdateModalOpen(true);
              refIdCateogry.current = entity.id;
              setColor(entity?.attributes?.color);
              setColorBackground(entity?.attributes?.background);
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
      // title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      title: configDefaultText['page.createdAt'],
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
            <PlusOutlined />  {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={() => customAPIGet({}, 'status-owners')}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
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

              confirm(
                selectedRowsState
              );

              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {configDefaultText['delete']}
          </Button>

        </FooterToolbar>
      )}
      <ModalForm
        form={form}
        title={configDefaultText['modalCreate']}
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
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='code'
              label={configDefaultText['page.code']}
              placeholder={configDefaultText['page.code']}
            />
          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='name'
              label={configDefaultText['page.name']}
              placeholder={configDefaultText['page.name']}
            />
          </Col>
        </Row>




        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.value']
                },
              ]}
              className='w-full'
              name='value'
              label={configDefaultText['page.value']}
              placeholder={configDefaultText['page.value']}
            />

          </Col>
        </Row>


        {/* <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.color']

                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.color'
                  //     defaultMessage='Nhập màu chữ'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='color'
              label={configDefaultText['page.color']}
              placeholder={configDefaultText['page.color']}
            />

          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.backgroundColor']

                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.backgroundColor'
                  //     defaultMessage='Yêu cấu nhập màu nền'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='background'
              label={configDefaultText['page.backgroundColor']}
              placeholder={configDefaultText['page.backgroundColor']}
            />
          </Col>
        </Row> */}
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.color']
                },
              ]}
              className='w-full'
              name='color'
              label={configDefaultText['page.color']}
              placeholder={configDefaultText['page.color']}
              fieldProps={{

                onFocus: toggleColorPicker,
                onChange: (e: any) => {
                  setColor(e.target.value);
                }
              }}

            />
            {openColor && (
              <div style={{ position: 'absolute', zIndex: 999 }} ref={pickerRef}>
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.backgroundColor']

                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.backgroundColor'
                  //     defaultMessage='Yêu cấu nhập màu nền'
                  //   />
                  // ),
                },
              ]}

              className='w-full'
              name='background'
              label={configDefaultText['page.backgroundColor']}
              placeholder={configDefaultText['page.backgroundColor']}
              fieldProps={{
                onFocus: toggleColorBackgroundPicker,
                onChange: (e: any) => {
                  setColorBackground(e.target.value);
                }
              }}
            />
            {openColorBackground && (
              <div style={{ position: 'absolute', zIndex: 999 }} ref={pickerRef}>
                <SketchPicker color={colorBackground} onChange={handleColorBackgroundChange} />
              </div>
            )}
          </Col>
        </Row>

      </ModalForm>


      <ModalForm
        form={form}
        title={configDefaultText['modalUpdate']}
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
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >
        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.code']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='code'
              label={configDefaultText['page.code']}
              placeholder={configDefaultText['page.code']}
            />
          </Col>
        </Row>

        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.code'
                  //     defaultMessage='Nhập mã'
                  //   />
                  // ),
                },
              ]}
              className='w-full'
              name='name'
              label={configDefaultText['page.name']}
              placeholder={configDefaultText['page.name']}
            />
          </Col>
        </Row>




        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.value']
                },
              ]}
              className='w-full'
              name='value'
              label={configDefaultText['page.value']}
              placeholder={configDefaultText['page.value']}
            />

          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.color']
                },
              ]}
              className='w-full'
              name='color'
              label={configDefaultText['page.color']}
              placeholder={configDefaultText['page.color']}
              fieldProps={{

                onFocus: toggleColorPicker,
                onChange: (e: any) => {
                  setColor(e.target.value);
                }
              }}

            />
            {openColor && (
              <div style={{ position: 'absolute', zIndex: 999 }} ref={pickerRef}>
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.required.backgroundColor']

                  // (
                  //   <FormattedMessage
                  //     id='pages.listBodyCondition.backgroundColor'
                  //     defaultMessage='Yêu cấu nhập màu nền'
                  //   />
                  // ),
                },
              ]}

              className='w-full'
              name='background'
              label={configDefaultText['page.backgroundColor']}
              placeholder={configDefaultText['page.backgroundColor']}
              fieldProps={{
                onFocus: toggleColorBackgroundPicker,
                onChange: (e: any) => {
                  setColorBackground(e.target.value);
                }
              }}
            />
            {openColorBackground && (
              <div style={{ position: 'absolute', zIndex: 999 }} ref={pickerRef}>
                <SketchPicker color={colorBackground} onChange={handleColorBackgroundChange} />
              </div>
            )}
          </Col>
        </Row>
      </ModalForm>

    </PageContainer>
  );
};

export default TableList;
