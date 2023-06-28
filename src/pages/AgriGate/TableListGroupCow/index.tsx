import {
  customAPIGet,
  customAPIAdd,
  customAPIUpdate,
  customAPIDelete,
  customAPIGetOne,

} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Col, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import './styles.css';

import { MdOutlineEdit } from 'react-icons/md';
// import viVNIntl from 'antd/lib/locale/vi_VN';  
import moment from 'moment';
import configText from '@/locales/configText';

const configDefaultText = configText;


const handleAdd = async (fields: any) => {
  const hide = message.loading('Đang thêm...');
  try {
    hide();
    const groupCow = await customAPIAdd({ ...fields }, 'group-cows/add');
    if (groupCow) {
      message.success('Thêm thành công');
      return true;
    }
  } catch (error: any) {
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
      return customAPIDelete(e.id, 'group-cows');
    });

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
  const actionRef = useRef<ActionType>();
  const refIdCow = useRef<any>();
  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [farm, setFarm] = useState<any>();

  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const confirm = (entity: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: configDefaultText['textConfirmDelete'],
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
      if (record?.[dataIndex]) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      else if (dataIndex === 'farmName') {
        return record?.farm?.name.toString().toLowerCase().includes(value.toLowerCase());
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


  const handleSearchRange = (selectedKeys: any, confirm: any) => {
    confirm();
  };

  const clearResetRange = (clearFilters: any, confirm: any) => {
    clearFilters();
    setSearchRangeFrom(null);
    setSearchRangeTo(null);
    confirm({
      closeDropdown: false,
    });
  };


  const getColumnSearchRange = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close
    }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {
          showRangeTo && (<>
            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormDatePicker
                  fieldProps={{
                    style: {
                      width: '100%'
                    },
                    onChange: (e: any) => {
                      if (e) {
                        setSearchRangeFrom(moment(e['$d']).toISOString());
                      }
                    },
                    value: searchRangeFrom
                  }}
                  placeholder={'Thời gian từ'}


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
                    value: searchRangeTo,
                    onChange: (e: any) => {
                      if (e) {
                        setSearchRangeTo(moment(e['$d']).toISOString());
                      }
                    },
                  }}
                  rules={[
                    { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                  ]}
                  placeholder={'Thời gian đến'}

                />
              </Col>
            </Row>
          </>
          )
        }
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect

              options={[
                {
                  value: 'days',
                  label: 'Trong ngày'
                },
                {
                  value: 'weeks',
                  label: 'Trong tuần'
                },
                {
                  value: 'months',
                  label: 'Trong tháng'
                },
                {
                  value: 'years',
                  label: 'Trong năm'
                },
                {
                  value: 'range',
                  label: 'Khoảng'
                }
              ]}
              fieldProps={{
                onChange: (value) => {
                  if (value === 'range') {
                    setShowRangeTo(true);
                  }
                  else {
                    setShowRangeTo(false);
                  }
                  setOptionRangeSearch(value);
                },
              }}
            />
          </Col>
        </Row>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (optionRangeSearch !== 'range') {
                setSelectedKeys([JSON.stringify([optionRangeSearch])])
              }
              else {
                setSelectedKeys([JSON.stringify([optionRangeSearch, searchRangeFrom, searchRangeTo])])
              }
              handleSearchRange(selectedKeys, confirm);
              // confirm()\

            }}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && clearResetRange(clearFilters, confirm)}
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
      if (typeof value === 'string') {
        const convertValue = JSON.parse(value);
        const optionValue = convertValue[0];
        if (optionValue === 'range') {
          if (convertValue[1] && convertValue[2]) {
            if (moment(record.createdAt).isAfter(convertValue[1]) && moment(record.createdAt).isBefore(convertValue[2])) {
              return record
            }
          }
        }
        else {
          const timeStart = moment().startOf(optionValue).toISOString();
          const timeEnd = moment().endOf(optionValue).toISOString();
          if (moment(record.createdAt).isAfter(timeStart) && moment(record.createdAt).isBefore(timeEnd)) {
            return record;
          }
        }
      }
      return null;
    }
    ,
    // onFilterDropdownOpenChange: (visible: any) => {
    //   if (visible) {
    //     // setTimeout(() => searchInput.current?.select(), 100);
    //   }
    // },

    // render: (text: any) =>{
    // }
  });


  const refIdPicture = useRef<any>();
  useEffect(() => {
    const getValues = async () => {
      let getFarms = await getFarm();
      setFarm(getFarms);
    };
    getValues();
  }, []);



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
  //const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      //title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      title: configDefaultText['page.listGroupCow.column.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, entity: any) => {
        return (
          <>{entity?.code}</>
        );
      },
      ...getColumnSearchProps('code')
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      title: configDefaultText['page.listGroupCow.column.farm'],
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text: any) => text?.farm?.name,
      ...getColumnSearchProps('farmName')
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.name' defaultMessage='Tên' />,
      title: configDefaultText['page.listGroupCow.column.name'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'name',
      renderText: (_, text: any) => text?.name,
      ...getColumnSearchProps('name')

    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.active' defaultMessage='Hoạt động' />,
      title: configDefaultText['page.listGroupCow.column.active'],
      dataIndex: 'active',
      valueType: 'textarea',
      key: 'active',
      render: (_, text: any) => {
        return (<><ProFormSwitch disabled fieldProps={{ checked: text?.active }}></ProFormSwitch></>)
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.description' defaultMessage='Mô tả' />,
      title: configDefaultText['page.listGroupCow.column.description'],
      dataIndex: 'description',
      valueType: 'textarea',
      key: 'description',
      renderText: (_, text: any) => text?.description,
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.createAt' defaultMessage='Description' />,
      title: configDefaultText['page.listCategory.createdAt'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'create',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM')
      },
      ...getColumnSearchRange()

    },



    {
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        return (
          <>
            <Tooltip title={configDefaultText['buttonUpdate']}><MdOutlineEdit
              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdCow.current = entity.id;
                const cow = await customAPIGetOne(entity.id, 'group-cows/find-admin', {});

                form.setFieldsValue({
                  ...cow
                });

              }
              }
            /></Tooltip>
          
          </>
        );
      },
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
            <PlusOutlined /> {configDefaultText['buttonAdd']}
          </Button>,
        ]}
        request={() =>
          customAPIGet(
            {},
            'group-cows/find-admin',
          )
        }
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

        rowClassName={
          (entity) => {
            if (entity.active) {
              return ''
            }
            else {
              return `disable`
            }
          }
        }

        columns={columns}

        rowSelection={{
          // onChange: (_, selectedRows: any) => {
          //   setSelectedRows(selectedRows);
          // },
        }}

        pagination={{
          locale: {
            //  next_page: 'Trang sau',
            //  prev_page: 'Trang trước',
            next_page: configDefaultText['nextPage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
        tableAlertRender={({ selectedRowKeys }: any) => {
          return renderTableAlert(selectedRowKeys);
        }}


        tableAlertOptionRender={({ selectedRows }: any) => {
          return renderTableAlertOption(selectedRows)
        }}
      />
  
      <ModalForm
        title={configDefaultText['page.listGroupCow.newGroup']}
        open={createModalOpen}
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        width={`40vh`}
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
        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonAdd'],
          },
        }}
      >
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect className='w-full' options={farm} name='farm'
              label={configDefaultText['page.listGroupCow.column.farm']}
              placeholder={configDefaultText['page.listGroupCow.column.farm']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.farm']
                },
              ]} />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText className='w-full' name='name'
              label={configDefaultText['page.listGroupCow.column.name']}
              placeholder={configDefaultText['page.listGroupCow.column.name']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.name']
                },
              ]} />
          </Col>
        </Row>


        <ProFormSwitch name='active'
          label={configDefaultText['page.listGroupCow.active']}
          fieldProps={{ defaultChecked: true, }} />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormTextArea className='w-full' name='description'
              label={configDefaultText['page.listGroupCow.column.description']}
              placeholder={configDefaultText['page.listGroupCow.column.description']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.description']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.description'
                  //     defaultMessage='Mô tả chi tiết'
                  //   />
                  // ),
                },
              ]}
              fieldProps={{
                maxLength: 100
              }}
            />
          </Col>
        </Row>





      </ModalForm>

      <ModalForm
        title={configDefaultText['page.listGroupCow.updateGroup']}
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
        width={`40vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          const success = await handleUpdate(values as any, 'group-cows/update', refIdCow?.current as any);

          if (success) {
            handleUpdateModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current?.reloadAndRest?.();
              refIdPicture.current = null;
            }
          }

          return true;
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
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect className='w-full' options={farm} name='farm'
              label={configDefaultText['page.listGroupCow.column.farm']}
              placeholder={configDefaultText['page.listGroupCow.column.farm']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.farm']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.farm'
                  //     defaultMessage='Trang trại'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormText className='w-full' name='name'
              label={configDefaultText['page.listGroupCow.column.name']}
              placeholder={configDefaultText['page.listGroupCow.column.name']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.name']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.name'
                  //     defaultMessage='Nhập tên'
                  //   />
                  // ),
                },
              ]} />
          </Col>
        </Row>

        <ProFormSwitch name='active' label='Kích hoạt' fieldProps={{ defaultChecked: true, }} />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormTextArea className='w-full' name='description'
              label={configDefaultText['page.listGroupCow.column.description']}
              placeholder={configDefaultText['page.listGroupCow.column.description']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.listGroupCow.required.description']
                  // (
                  //   <FormattedMessage
                  //     id='pages.groupCow.required.description'
                  //     defaultMessage='Mô tả chi tiết'
                  //   />
                  // ),
                },
              ]}
              fieldProps={{
                maxLength: 100
              }}
            />

          </Col>
        </Row>
      </ModalForm>

    </PageContainer>
  )
};

export default TableList;
