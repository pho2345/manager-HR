import { customAPIAdd, customAPIDelete, customAPIGet, customAPIUpdate } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
// import { FormattedMessage, } from '@umijs/max';
import { Button, message, Modal, Space, Input, Tooltip, Row, Col, Form } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import configText from '@/locales/configText';
import { MdOutlineEdit } from 'react-icons/md';
const configDefaultText = configText;


const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'product-kind-codes');
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

  fields.dateExpire = moment(fields?.dateExpire).add(new Date().getTimezoneOffset() / -60, 'hours').toISOString();
  try {
    await customAPIUpdate({
      ...fields
    }, 'product-kind-codes', id.current);
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
      return customAPIDelete(e.id, 'qr-ales')
    })

    await Promise.all(deleteRowss);
    hide();
    message.success('Xóa thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data.error.message);

    return false;
  }
};



const TableListAssignCPass = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  // const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);

  //const [showDialog, setShowDialog] = useState<boolean>(false);
  //const [typeConvert, setTypeConvert] = useState<boolean>(false);

  const refId = useRef<any>();


  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const [form] = Form.useForm<any>();


  // const [visible, setVisible] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');





  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    confirm({
      closeDropdown: false,
    });
    //setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close 
    }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={configDefaultText['search']}
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
            Tìm kiếm
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
      />
    ),
    onFilter: (value: any, record: any) => {
      if (record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      if (record['fullname'] && record['fullname'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['fullname'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if (record['email'] && record['email'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['email'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if (record['passport'] && record['passport'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record['passport'].toString().toLowerCase().includes(value.toLowerCase());
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


  // const disabledDate = (current: any) => {
  //   return current && current < moment();
  // };

  // const formatter = (value: any) => {
  //   if (value) {
  //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   }
  //   return '';
  // };

  // const parser = (value: any) => {
  //   if (value) {
  //     return value.replace(/\$\s?|(,*)/g, '');
  //   }
  //   return undefined;
  // };




  const confirm = (entity: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: configDefaultText['textConfirmDelete'],
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        const checkSuccess = await handleRemove(entity);
        if (actionRef.current && checkSuccess) {
          actionRef.current?.reloadAndRest?.();
          // setTypeConvert(false);
        }

      }
    })
  }


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
            await confirm(selectedRows as any);
            // actionRef.current?.reloadAndRest?.();
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }


  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
      width: '3vh'
    },
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.se archTable.column.cPass' defaultMessage=' Aleger(AlegerID, SĐT, Email, CCCD/Hộ chiếu)' />,
      title: configDefaultText['page.managerAleCurrent.columns.code'],
      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            {entity?.attributes.code}
          </>
        );
      },
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      title: configDefaultText['page.produceKindCode.column.option'],
      dataIndex: 'option',
      valueType: 'textarea',
      key: 'option',
      renderText: (_, text: any) => {
        return text?.attributes.option === 'auto' ? `Tự động` : `Cơ bản`;
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.availableBalance' defaultMessage='Số dư Ale khả dụng' />,
      title: configDefaultText['page.produceKindCode.column.valueAuto'],
      dataIndex: 'valueAuto',
      valueType: 'textarea',
      key: 'valueAuto',
      renderText: (_, text: any) => {
        return `Từ ${moment(text?.attributes?.valueAuto).format('MM/YYYY')}`;
      }
    },
    {
      title: configDefaultText['page.produceKindCode.column.valueBasic'],
      dataIndex: 'valueBasic',
      valueType: 'textarea',
      key: 'valueBasic',
      renderText: (_, text: any) => {
        return text?.attributes.valueBasic;
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.config' defaultMessage='Thao tác' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'config',
      valueType: 'textarea',
      key: 'config',
      align: 'center',
      width: '15vh',
      render: (_, text: any) => {
        return [
          <>
            <Tooltip title={configDefaultText['buttonUpdate']}>
              <MdOutlineEdit
                style={{
                  fontSize: 20,
                  paddingLeft: 5

                }}
                onClick={() => {
                  handleUpdateModalOpen(true);
                  refId.current = text?.id;
                  form.setFieldsValue({
                    ...text?.attributes
                  })
                }}
              />
            </Tooltip>
          </>
        ]
      }
    },
  ];

  return (
    <>
      <ProTable
        headerTitle={configDefaultText['page.managerAleCurrent.titleTable']}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }
        request={async () => {
          const data = await customAPIGet({}, 'product-kind-codes');
          return {
            data: data?.data,
            success: true,
            total: data?.data?.length
          };
        }}

        toolBarRender={() => {
          return [
            <Button
              type='primary'
              key='primary'
              onClick={() => {
                handleModalOpen(true);
              }}
            >

              <PlusOutlined /> {configDefaultText['buttonAdd']}
            </Button>,

            // <Tooltip title='Tải lại'><ReloadOutlined style={{fontSize: '100%' }}   key="re"  /></Tooltip>

          ]
        }}

        columns={columns}
        // rowSelection={{
        //   getCheckboxProps: record => ({
        //     disabled: record.user
        //   })
        // }}
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

        tableAlertRender={({ selectedRowKeys }: any) => {
          return renderTableAlert(selectedRowKeys);
        }}


        tableAlertOptionRender={({ selectedRows }: any) => {
          return renderTableAlertOption(selectedRows)
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
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              name='code'
              label={`Mã`}
              placeholder={`Mã`}
              rules={[
                { required: true, message: 'Mã' },
              ]}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              options={[
                {
                  label: 'Cơ bản',
                  value: 'basic'
                },
                {
                  label: 'Tự động',
                  value: 'auto'
                }
              ]}
              name='option'
              label={configDefaultText['page.produceKindCode.column.option']}
              placeholder={configDefaultText['page.produceKindCode.column.option']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.option'] },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDatePicker
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              name='valueAuto'
              label={configDefaultText['page.produceKindCode.column.valueAuto']}
              placeholder={configDefaultText['page.produceKindCode.column.valueAuto']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.valueAuto'] },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              name='valueBasic'
              label={configDefaultText['page.produceKindCode.column.valueBasic']}
              placeholder={configDefaultText['page.produceKindCode.column.valueBasic']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.valueBasic'] },
              ]}
            />
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
          const success = await handleUpdate(value as any, refId);
          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              disabled
              name='code'
              label={`Mã`}
              placeholder={`Mã`}
              rules={[
                { required: true, message: 'Mã' },
              ]}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              options={[
                {
                  label: 'Cơ bản',
                  value: 'basic'
                },
                {
                  label: 'Tự động',
                  value: 'auto'
                }
              ]}
              name='option'
              label={configDefaultText['page.produceKindCode.column.option']}
              placeholder={configDefaultText['page.produceKindCode.column.option']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.option'] },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDatePicker
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              name='valueAuto'
              label={configDefaultText['page.produceKindCode.column.valueAuto']}
              placeholder={configDefaultText['page.produceKindCode.column.valueAuto']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.valueAuto'] },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText
              fieldProps={{
                style: {
                  width: '100%'
                },
              }}
              name='valueBasic'
              label={configDefaultText['page.produceKindCode.column.valueBasic']}
              placeholder={configDefaultText['page.produceKindCode.column.valueBasic']}
              rules={[
                { required: true, message: configDefaultText['page.produceKindCode.column.valueBasic'] },
              ]}
            />
          </Col>
        </Row>


      </ModalForm>
    </>
  );
};

export default TableListAssignCPass;


