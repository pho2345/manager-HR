import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link } from '@umijs/max';
import { Button, Col, Dropdown, Form, Input, Menu, message, Modal, Row, Space } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import TableListAddCPassInFair from '../TableListAddCPassInFair';
//import DetailCPass from '../components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';

import configText from '@/locales/configText';
const configDefaultText = configText;

const handleAdd = async (fields: any) => {
  fields.timeStart = moment(fields.timeStart);
  fields.timeEnd = moment(fields.timeEnd);
  fields.dateStartFeed = moment(fields.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour');


  const hide = message.loading('Đang thêm...');
  try {
    await customAPIAdd({ ...fields }, 'fairs');
    hide();
    message.success('Thêm thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};


const handleUpdate = async (fields: any, id: any) => {


  fields.timeStart = moment(fields.timeStart);
  fields.timeEnd = moment(fields.timeEnd);
  fields.dateStartFeed = moment(fields.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour');

  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fairs', id.current);
    hide();

    message.success('Cập nhật thành công');
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message || 'Lỗi');
    return false;
  }
};


const handleRemove = async (selectedRows: any) => {
  const hide = message.loading('Đang xóa...');
  if (!selectedRows) return true;
  try {
    const deleteRowss = selectedRows.map((e: any) => {
      return customAPIDelete(e.id, 'fairs')
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

const getCPassNotFair = async () => {
  const cPass = await customAPIGet({}, 'c-passes/get/cpassnotfair');
  let data = cPass.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.cow?.name,
    };
  });
  return data;
};

const getPlans = async () => {
  const plans = await customAPIGet({ 'fields[0]': 'name', 'fields[1]': 'profit' }, 'plans');

  let data = plans.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name + '-' + e?.attributes?.profit + '%',
    };
  });
  return data;
};

const formatter = (value: any) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
};

const parser = (value: any) => {
  if (value) {
    return value.replace(/\$\s?|(,*)/g, '');
  }
  return undefined;
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [copyModalOpen, handleCopyModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdFair = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();

  const [disableField, setDisableField] = useState<any>(false);

  const [readModalOpen, handleReadModalOpen] = useState<boolean>(false);

  // const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [plan, setPlan] = useState<any>();
  const searchInput = useRef(null);

  const [currentFair, setCurrentFair] = useState<any>();
  const [showModalCPass, setShowModalCPass] = useState<boolean>(false);

  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const [dateEnd, setDateEnd] = useState<any>();



  useEffect(() => {
    const getData = async () => {
      const getPlan = await getPlans();
      setPlan(getPlan);

    };
    getData();
  }, []);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    //setSearchText('');
    confirm({
      closeDropdown: false,
    });
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      // close
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
          width={`15px`}
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
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
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
                  allowClear={false}
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
                  allowClear={false}
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
                  value: 'months',
                  label: 'Trong tháng'
                },
                {
                  value: 'quarters',
                  label: 'Trong quí'
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
                onChange: (value: any) => {
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
            if (moment(record.timeStart).isAfter(convertValue[1]) && moment(record.timeStart).isBefore(convertValue[2])) {
              return record
            }
          }
        }
        else {
          const timeStart = moment().startOf(optionValue).toISOString();
          const timeEnd = moment().endOf(optionValue).toISOString();
          if (moment(record.timeStart).isAfter(timeStart) && moment(record.timeStart).isBefore(timeEnd)) {
            return record;
          }
        }
      }
      return null;
    }
    ,
  });

  const confirm = (entity: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có muốn xóa?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleRemove(entity);
        await actionRef.current?.reloadAndRest?.();
      }
    });
  };




  // const disabledDate = (current: any) => {
  //   // Kiểm tra ngày hiện tại
  //   if (current && current.day() !== 1) { // Kiểm tra ngày không phải thứ Hai (Monday)
  //     return true; // Vô hiệu hóa ngày không phải thứ Hai
  //   }

  //   // Kiểm tra ngày trong tương lai
  //   if (current && current.day() === 1 && current.isBefore(moment())) {
  //     return true; // Vô hiệu hóa thứ Hai trong tương lai
  //   }

  //   return false; // Cho phép chọn thứ Hai hiện tại và trong quá khứ
  // };

  const disabledDateStartFeed = (current: any, dateEnd: any) => {
    // Kiểm tra ngày hiện tại
    if (current && current.day() !== 1) { // Kiểm tra ngày không phải thứ Hai (Monday)
      return true; // Vô hiệu hóa ngày không phải thứ Hai
    }

    // Kiểm tra ngày trong tương lai
    if (current && current.day() === 1 && current.isBefore(moment(dateEnd))) {
      return true; // Vô hiệu hóa thứ Hai trong tương lai
    }

    return false; // Cho phép chọn thứ Hai hiện tại và trong quá khứ
  };


  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='page.listFair.columns.code' defaultMessage='Đợt mở bán' />,
      title: configDefaultText['page.listFair.columns.code'],
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity.id);
              setShowDetail(true);
            }}
          >
            {entity?.code}

          </a>

        );
      },
    },
    {
      //title: <FormattedMessage id='page.listFair.column.timeStart' defaultMessage='Ngày giờ mở bán' />,
      title: configDefaultText['page.listFair.column.timeStart'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeStart',
      renderText: (_, text) => {
        const time = moment(text?.timeStart);
        let indexWeek = moment(time).weekday();
        let weekday = 'T' + `${moment(time).weekday() + 1}`;
        if (indexWeek === 0) {
          weekday = 'CN';
        }
        return weekday + ' ' + time.format('DD/MM/YYYY HH:mm:ss');
      },
      ...getColumnSearchRange()
    },
    {
      // title: <FormattedMessage id='page.listFair.column.timeEnd' defaultMessage='Ngày giờ đóng bán' />,
      title: configDefaultText['page.listFair.placeHolder.timeEnd'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => {
        let indexWeek = moment(text?.timeEnd).weekday();
        let weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        if (indexWeek === 0) {
          weekday = 'CN';
        }
        return weekday + ' ' + moment(text?.timeEnd).format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.column.dateStartFeed' defaultMessage='Ngày bắt đầu nuôi' />,
      title: configDefaultText['page.listFair.column.dateStartFeed'],
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => {
        let indexWeek = moment(text?.dateStartFeed).weekday();
        let weekday = 'T' + `${moment(text?.dateStartFeed).weekday() + 1}`;
        if (indexWeek === 0) {
          weekday = 'CN';
        }
        return weekday + ' ' + moment(text?.dateStartFeed).format('DD/MM/YYYY');
      }
    },
    {
      //title: <FormattedMessage id='page.listFair.column.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />,
      title: configDefaultText['page.listFair.placeHolder.timeFeed'],
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
      align: 'center',
      renderText: (_, text: any) => text?.timeFeed
    },

    {
      // title: <FormattedMessage id='page.listFair.column.plans' defaultMessage='PAHT Mega/PL' />,
      title: configDefaultText['page.listFair.column.plans'],
      dataIndex: 'plans',
      valueType: 'dateRange',
      key: 'plans',
      render: (_, entity: any) => {
        return (
          <>
            {entity.plans.map((e: any) => (
              <>
                <div> {e.name}-{e.profit}</div>
              </>
            ))}

          </>
        )
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.column.cPassPublished' defaultMessage='cPass phát hành/Đã bán' />,
      title: configDefaultText['page.listFair.column.cPassPublished'],
      dataIndex: 'cPassPublished',
      valueType: 'textarea',
      key: 'cPassPublished',
      renderText: (_, text: any) => `${text?.cPassPublished} / ${text?.quantitySellCpass}`
    },
    {
      // title: <FormattedMessage id='page.listFair.column.status' defaultMessage='Trạng thái' />,
      title: configDefaultText['page.listFair.column.status'],
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      render: (_, text: any) => {
        switch (text?.status) {
          case 'noOpen':
            return (<span
              style={{
                color: '#94a3b8'
              }}
            >Chưa mở</span>)
            break;
          case 'opening':
            return (<span
              style={{
                color: '#4ade80'
              }}
            >Đang mở</span>)
            break;
          case 'closed':
            return (<span
              style={{
                color: '#f87171'
              }}
            >Đã đóng</span>)
            break;
          default:
            break;
        }
      },
      filters: true,
      onFilter: true,
      valueEnum: () => {
        return {
          'noOpen': {
            text: 'Chưa mở',
            value: 'noOpen'
          },
          'opening': {
            text: 'Đang mở',
            value: 'opening'
          },
          'closed': {
            text: 'Đã đóng',
            value: 'closed'
          },
        }
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.column.unitPriceMeat' defaultMessage='Đơn giá thịt(VNĐ/kg)' />,
      title: configDefaultText['page.listFair.placeHolder.unitPriceMeat'],
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat.toLocaleString()}`
    },

    {
      // title: <FormattedMessage id='page.listFair.column.unitPriceMeat' defaultMessage='Đơn giá thịt(VNĐ/kg)' />,
      title: 'Đơn giá bảo hiểm (VNĐ/kg)',
      dataIndex: 'unitSicknessInsurance',
      valueType: 'textarea',
      key: 'unitSicknessInsurance',
      renderText: (_, text: any) => `${text?.unitSicknessInsurance.toLocaleString()}`
    },

    {
      //title: <FormattedMessage id='page.listFair.column.nameFarm' defaultMessage='Tên trang trại' />,
      title: configDefaultText['page.listFair.column.nameFarm'],
      dataIndex: 'nameFarm',
      valueType: 'textarea',
      key: 'nameFarm',
      renderText: (_, text: any) => text?.nameFarm
    },


    {
      // title: <FormattedMessage id='page.listFair.titleOption' defaultMessage='Thao tác' />,
      title: configDefaultText['page.listFair.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        const menu = (
          <Menu>
            <Menu.Item key="1"
              onClick={async () => {
                handleCopyModalOpen(true);
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                const plans = fair.plans.map((e: any) => {
                  return e?.id
                })
                form.setFieldsValue({
                  ...fair,
                  plans
                })
              }
              }
            >{configDefaultText['copy']}</Menu.Item>


            {entity.status === 'closed' || moment(entity.timeEnd).isBefore(moment().toISOString()) ? (<></>) : (<>
              <Menu.Item key="2"
                onClick={() => {
                  setCurrentFair(entity?.id);
                  setShowModalCPass(true);
                }}>{configDefaultText['addCPass']}</Menu.Item>

              <Menu.Item key="3">
                <Link to={`/web-c-pass/fairs/add-mega-assign/` + entity.id}>
                  {configDefaultText['assignCPass']}
                </Link>
              </Menu.Item>

            </>)}


            <Menu.Item key="4">
              <Link to={`/web-c-pass/fairs/manager/` + entity.id}>
                {configDefaultText['manager']}
              </Link>
            </Menu.Item>

            {entity?.status === 'noOpen' && moment(entity.timeEnd).isAfter(moment().toISOString()) || entity?.status === 'opening' ? (<Menu.Item key="5"
              onClick={async () => {
                if (entity?.status === 'opening') {
                  setDisableField(true);
                }
                handleUpdateModalOpen(true);
                refIdFair.current = entity.id;
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                setDateEnd(fair.timeEnd);
                const c_passes = fair?.c_passes.map((e: any) => {
                  return {
                    label: e?.cow?.name,
                    value: e?.id
                  }
                })
                const plans = fair.plans.map((e: any) => {
                  return e?.id
                })
                form.setFieldsValue({
                  ...fair,
                  c_passes,
                  plans
                })
              }}
            >{configDefaultText['edit']}</Menu.Item>) : (<></>)}

            {entity?.status === 'opening' || entity?.status === 'closed' || !moment(entity.timeEnd).isAfter(moment().toISOString()) ? (<Menu.Item key="6"
              onClick={async () => {
                handleReadModalOpen(true);
                refIdFair.current = entity.id;
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                const c_passes = fair?.c_passes?.map((e: any) => {
                  return {
                    label: e?.cow?.name,
                    value: e?.id
                  }
                })
                const plans = fair.plans.map((e: any) => {
                  return e?.id
                })
                form.setFieldsValue({
                  ...fair,
                  c_passes,
                  plans
                })
              }}
            >Xem</Menu.Item>) : (<></>)}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
              {configDefaultText['handle']}
            </a>
          </Dropdown>
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
            await confirm(selectedRows);
            // setSelectedRows([]);
          }}>Xóa</Button>
        </Fragment>
      </>
    );
  }

  return (
    <>
      <PageContainer >
        <ProTable
          actionRef={actionRef}
          rowClassName={record => {
            if (record.status !== 'opening' && record.status !== 'noOpen') {
              return 'disable'
            }
            return '';
          }}
          tableStyle={
            {
              borderStartEndRadius: 0,
              borderEndEndRadius: 0,
              borderEndStartRadius: 0,
              borderStartStartRadius: 0
            }
          }
          scroll={{
            x: window.innerWidth * 0.75
          }}
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
              <PlusOutlined />
              {configDefaultText['new']}
            </Button>,
          ]}
          request={async () => {
            const data = await customAPIGet({}, 'fairs/fairadmin');
            return data
          }}
          columns={columns}
          rowSelection={{
            onChange: () => {
            },
            alwaysShowAlert: false,
          }}

          tableAlertRender={({ selectedRowKeys }: any) => {
            return renderTableAlert(selectedRowKeys);
          }}


          tableAlertOptionRender={({ selectedRows }: any) => {
            return renderTableAlertOption(selectedRows)
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
            },
            ],

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
          title={configDefaultText['page.listFair.create']}
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
            const success = await handleAdd(values as any);
            if (success) {
              handleModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
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
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full' name='timeFeed' placeholder={configDefaultText['page.listFair.placeHolder.timeFeed']} min={1} max={100}
                label={configDefaultText['page.listFair.column.timeFeed']}

              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitPriceMeat'
                placeholder={configDefaultText['page.listFair.placeHolder.unitPriceMeat']}
                min={1000}
                label={configDefaultText['page.listFair.column.unitPriceMeat']}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full' name='refundVs' placeholder={configDefaultText['page.listFair.column.refundVs']} min={1} max={100}
                label={configDefaultText['page.listFair.column.refundVs']}

              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitSicknessInsurance'
                placeholder={configDefaultText['page.listFair.placeHolder.unitSicknessInsurance']}
                min={1000}
                label={configDefaultText['page.listFair.column.unitSicknessInsurance']}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeStart"
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (value: any) => {
                    const handleDateEnd = moment(value).add(30, 'days').toISOString();
                    setDateEnd(handleDateEnd);
                  },
                }}
                placeholder={configDefaultText['page.listFair.column.timeStart']}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeStart'] },
                ]}

              />
            </Col>


            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeEnd"
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (value: any) => {
                    setDateEnd(moment(value).toISOString());
                  }
                }}
                placeholder={configDefaultText['page.listFair.placeHolder.timeEnd']}

                label={
                  configDefaultText['page.listFair.column.timeEnd']
                }
              />
            </Col>


          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  disabledDate: (current) => disabledDateStartFeed(current, dateEnd)
                }}
                name="dateStartFeed"
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.dateStartFeed'] },
                ]}
              />
            </Col>




            <Col span={12} className="gutter-row p-0" >
              <ProFormText name='nameFarm'

                placeholder={configDefaultText['page.listFair.column.nameFarm']}
                label={configDefaultText['page.listFair.column.nameFarm']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.nameFarm'] }
                ]}
              />
            </Col>

          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                options={plan}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.plans']}

                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.plans'] },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>

        <ModalForm
          title={configDefaultText['page.listFair.update']}
          open={updateModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleUpdateModalOpen(false);
              setDisableField(false);
            },
          }}
          submitTimeout={2000}
          submitter={{
            searchConfig: {
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonUpdate'],

            },
          }}

          onFinish={async (values) => {

            const success = await handleUpdate(values as any, refIdFair as any);
            if (success) {
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }

            return true;
          }}

        >

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText className='w-full' name='code' placeholder={configDefaultText['page.listFair.columns.code']} disabled
                label={configDefaultText['page.listFair.columns.code']}
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeStart"
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                placeholder={configDefaultText['page.listFair.column.timeStart']}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeStart'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">

            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeEnd"
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (value: any) => {
                    setDateEnd(moment(value).toISOString());
                  }
                }}
                placeholder={configDefaultText['page.listFair.placeHolder.timeEnd']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                ]}
                label={
                  configDefaultText['page.listFair.placeHolder.timeEnd']
                }
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  disabledDate: (current) => disabledDateStartFeed(current, dateEnd)
                }}
                name="dateStartFeed"
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.dateStartFeed'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                disabled
                name="dateEndFeed"
                label={configDefaultText['page.listFair.column.dateEndFeed']}
                placeholder='Thời gian kết thúc nuôi'
                rules={
                  [{
                    required: true,
                    message: configDefaultText['page.listFair.required.dateEndFeed']
                  }]
                }
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit
                disabled={disableField}
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }} name='timeFeed' placeholder='Thời gian nuôi'
                min={1}
                label={configDefaultText['page.listFair.placeHolder.timeFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeFeed'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                className='w-full'
                name='status'
                label={configDefaultText['page.listFair.column.status']}
                options={[
                  {
                    label: 'Chưa mở',
                    value: 'noOpen',
                  },
                  {
                    label: 'Đang mở',
                    value: 'opening',
                  },
                  {
                    label: 'Đã đóng',
                    value: 'closed',
                  },
                ]}
                placeholder={configDefaultText['page.listFair.column.status']}
                rules={[{
                  required: true,
                  message: configDefaultText['page.listFair.required.status']
                }]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                options={plan}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.plans']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.plans'] },
                ]}
                disabled={disableField}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full' name='unitPriceMeat' placeholder={configDefaultText['page.listFair.placeHolder.unitPriceMeat']}
                label={configDefaultText['page.listFair.placeHolder.unitPriceMeat']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.unitPriceMeat'] },
                ]}
                disabled={disableField}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText className='w-full' name='nameFarm' label='Tên trang trại'
                placeholder='Tên trang trại'
                rules={[{ required: true, message: <FormattedMessage id='page.ListFair.required.nameFarm' defaultMessage='Tên trang trại' /> }]}

              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitSicknessInsurance'
                placeholder={configDefaultText['page.listFair.placeHolder.unitSicknessInsurance']}
                min={1000}
                label={configDefaultText['page.listFair.label.unitSicknessInsurance']}
                rules={[{ required: true, message: 'Đơn giá bảo hiểm chết bệnh' }]}

                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>
        </ModalForm>

        <ModalForm
          title='Sao chép Phiên mở bán'
          open={copyModalOpen}
          form={form}
          width={window.innerHeight}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleCopyModalOpen(false);
            },
          }}
          submitTimeout={2000}
          onFinish={async (values) => {


            const success = await handleAdd(values);
            if (success) {
              handleCopyModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
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
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full' name='timeFeed' placeholder={configDefaultText['page.listFair.placeHolder.timeFeed']} min={1} max={100}
                label={configDefaultText['page.listFair.column.timeFeed']}

              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitPriceMeat'
                placeholder={configDefaultText['page.listFair.placeHolder.unitPriceMeat']}
                min={1000}
                label={configDefaultText['page.listFair.column.unitPriceMeat']}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full' name='refundVs' placeholder={configDefaultText['page.listFair.column.refundVs']} min={1} max={100}
                label={configDefaultText['page.listFair.column.refundVs']}

              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitSicknessInsurance'
                placeholder={configDefaultText['page.listFair.placeHolder.unitSicknessInsurance']}
                min={1000}
                label={configDefaultText['page.listFair.column.unitSicknessInsurance']}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeStart"
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (value: any) => {
                    const handleDateEnd = moment(value).add(30, 'days').toISOString();
                    setDateEnd(handleDateEnd);
                  },
                }}
                placeholder={configDefaultText['page.listFair.column.timeStart']}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeStart'] },
                ]}

              />
            </Col>


            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeEnd"
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  onChange: (value: any) => {
                    setDateEnd(moment(value).toISOString());
                  }
                }}
                placeholder={configDefaultText['page.listFair.placeHolder.timeEnd']}

                label={
                  configDefaultText['page.listFair.column.timeEnd']
                }
              />
            </Col>


          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  },
                  disabledDate: (current) => disabledDateStartFeed(current, dateEnd)
                }}
                name="dateStartFeed"
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.dateStartFeed'] },
                ]}
              />
            </Col>




            <Col span={12} className="gutter-row p-0" >
              <ProFormText name='nameFarm'

                placeholder={configDefaultText['page.listFair.column.nameFarm']}
                label={configDefaultText['page.listFair.column.nameFarm']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.nameFarm'] }
                ]}
              />
            </Col>

          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                options={plan}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.plans']}

                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.plans'] },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>


        <ModalForm
          title={configDefaultText['page.listFair.read']}
          open={readModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: false,
            onCancel: () => {
              form.resetFields();
              handleReadModalOpen(false);
            },
          }}
          submitTimeout={2000}
          submitter={{

            searchConfig: {

              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonUpdate'],

            },
          }}

          onFinish={async (values) => {

            const success = await handleUpdate(values as any, refIdFair as any);
            if (success) {
              handleUpdateModalOpen(false);
              form.resetFields();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }

            return true;
          }}

        >

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText className='w-full'
                name='code' placeholder={configDefaultText['page.listFair.columns.code']} disabled
                label={configDefaultText['page.listFair.columns.code']}

              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeStart"
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                disabled
                placeholder={configDefaultText['page.listFair.column.timeStart']}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeStart'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">

            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeEnd"
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                disabled
                placeholder={configDefaultText['page.listFair.placeHolder.timeEnd']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                ]}
                label={
                  configDefaultText['page.listFair.placeHolder.timeEnd']
                }
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                name="dateStartFeed"
                disabled
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.dateStartFeed'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                name="dateEndFeed"
                disabled
                label={configDefaultText['page.listFair.column.dateEndFeed']}
                placeholder='Thời gian kết thúc nuôi'
                rules={
                  [{
                    required: true,
                    message: configDefaultText['page.listFair.required.dateEndFeed']
                  }]
                }
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }} name='timeFeed' placeholder='Thời gian nuôi'
                min={1}
                disabled
                label={configDefaultText['page.listFair.placeHolder.timeFeed']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.timeFeed'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                className='w-full'
                name='status'
                label={configDefaultText['page.listFair.column.status']}
                disabled
                options={[
                  {
                    label: 'Chưa mở',
                    value: 'noOpen',
                  },
                  {
                    label: 'Đang mở',
                    value: 'opening',
                  },
                  {
                    label: 'Đã đóng',
                    value: 'closed',
                  },
                ]}
                placeholder={configDefaultText['page.listFair.column.status']}
                rules={[{
                  required: true,
                  message: configDefaultText['page.listFair.required.status']
                }]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                disabled
                options={plan}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.plans']}
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.plans'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full' name='unitPriceMeat' placeholder={configDefaultText['page.listFair.column.unitPriceMeat']}
                label={configDefaultText['page.listFair.placeHolder.unitPriceMeat']}
                disabled
                rules={[
                  { required: true, message: configDefaultText['page.listFair.required.unitPriceMeat'] },
                ]}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText className='w-full' name='nameFarm' label='Tên trang trại'
                disabled
                placeholder='Tên trang trại'
                rules={[{ required: true, message: <FormattedMessage id='page.ListFair.required.nameFarm' defaultMessage='Tên trang trại' /> }]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full'
                name='unitSicknessInsurance'
                disabled
                // placeholder={configDefaultText['page.listFair.placeHolder.unitSicknessInsurance']}
                min={1000}
                label={configDefaultText['page.listFair.label.unitSicknessInsurance']}
                fieldProps={{
                  formatter,
                  parser,
                }}
              />
            </Col>
          </Row>
        </ModalForm>

        {
          currentFair && (<>
            <TableListAddCPassInFair
              openModal={showModalCPass}
              currentFair={currentFair}
              onCloseModal={() => {
                setCurrentFair(undefined);
                setShowModalCPass(false);
              }}
            />
          </>)
        }
        {currentRow && (
          <DetailFair
            openModal={showDetail}
            fairId={currentRow}
            closeModal={() => {
              setCurrentRow(undefined);
              setShowDetail(false);
            }}
          />
        )
        }
      </PageContainer>

    </>
  );
};

export default TableList;
