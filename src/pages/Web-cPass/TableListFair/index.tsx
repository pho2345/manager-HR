import { customAPIGet, customAPIAdd, customAPIUpdate, customAPIDelete, customAPIGetOne } from '@/services/ant-design-pro/api';
import { CopyTwoTone, DollarOutlined, EditTwoTone, ExclamationCircleOutlined, FileAddTwoTone, PlusOutlined, ReloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProFormDatePicker, ProFormDateTimePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link } from '@umijs/max';
import { Button, Col, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import TableListAddCPassInFair from '../TableListAddCPassInFair';
//import DetailCPass from '../components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';

import configText from '@/locales/configText';
const configDefaultText = configText;

//import { config } from 'dotenv';
// import viVNIntl from 'antd/lib/locale/vi_VN';
// const intlMap = {
//   viVNIntl,
// };





const handleAdd = async (fields: any) => {

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

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

  if (fields?.c_passes[0]?.value) {
    const configCPass = fields?.c_passes.map((e: any) => {
      return e.value;
    });
    fields.c_passes = configCPass;
  }

  fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
  fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

  const hide = message.loading('Đang cập nhật...');
  try {
    await customAPIUpdate({
      ...fields
    }, 'fairs', id.current);
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



const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [copyModalOpen, handleCopyModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const refIdFair = useRef<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const [plan, setPlan] = useState<any>();
  const searchInput = useRef(null);

  const [currentFair, setCurrentFair] = useState<any>();
  const [showModalCPass, setShowModalCPass] = useState<boolean>(false);

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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
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


  // Generate the intl object

  const confirm = (entity: any) => {
    Modal.confirm({

      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có muốn xóa?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        const removeFair = await handleRemove(entity);
        if (actionRef.current && removeFair) {
          // await actionRef.current?.reloadAndRest?.();
          // setSelectedRows([]);
        }
      }
    });
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
        const weekday = 'T' + `${moment(text?.timeStart).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.column.timeEnd' defaultMessage='Ngày giờ đóng bán' />,
      title: configDefaultText['page.listFair.column.timeEnd'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'timeEnd',
      renderText: (_, text: any) => {
        const weekday = 'T' + `${moment(text?.timeEnd).weekday() + 1}`;
        return weekday + ' ' + moment(text?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.column.dateStartFeed' defaultMessage='Ngày bắt đầu nuôi' />,
      title: configDefaultText['page.listFair.column.dateStartFeed'],
      dataIndex: 'dateStartFeed',
      valueType: 'textarea',
      key: 'dateStartFeed',
      renderText: (_, text: any) => {
        {
          let indexWeek = moment(text?.dateStartFeed).weekday();
          let weekday = 'T' + `${moment(text?.dateStartFeed).weekday() + 1}`;
          if(indexWeek === 0) {
            weekday = 'CN';
          }
          return weekday + ' ' + moment(text?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY HH:mm:ss');
        }
      }
    },
    {
      //title: <FormattedMessage id='page.listFair.column.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />,
      title: configDefaultText['page.listFair.column.timeFeed'],
      dataIndex: 'timeFeed',
      valueType: 'textarea',
      key: 'timeFeed',
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
      renderText: (_, text: any) => {
        switch (text?.status) {
          case 'noOpen':
            return 'Chưa mở'
            break;
          case 'opening':
            return 'Đang mở'
            break;
          case 'closed':
            return 'Đã đóng'
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
      title: configDefaultText['page.listFair.column.unitPriceMeat'],
      dataIndex: 'unitPriceMeat',
      valueType: 'textarea',
      key: 'unitPriceMeat',
      renderText: (_, text: any) => `${text?.unitPriceMeat}`
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
      // title: <FormattedMessage id='page.listFair.payment' defaultMessage='Thanh toán' />,
      title: configDefaultText['page.listFair.payment'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'payment',
      render: (_, entity: any) => {
        if (entity?.status === 'noOpen') {
          return (<DollarOutlined
            style={{
              fontSize: 20
            }}
            onClick={() => {

            }} />)
        }
        return null;
      }
    },
    {
      // title: <FormattedMessage id='page.listFair.titleOption' defaultMessage='Thao tác' />,
      title: configDefaultText['page.listFair.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        let configButton = [];
        configButton.push( /// button copy
          <>
            <Row gutter={[16, 16]}>
              <Col span={6}> <Tooltip title={configDefaultText['page.listFair.copy']}><CopyTwoTone
                style={{
                  fontSize: 20,
                  paddingLeft: 5
                }}

                onClick={async () => {
                  handleCopyModalOpen(true);
                  const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                  fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                  delete fair.c_passes;
                  const plans = fair.plans.map((e: any) => {
                    return e?.id
                  })
                  form.setFieldsValue({
                    ...fair,
                    plans
                  })
                }
                }
              /></Tooltip>
              </Col>
              <Col span={6} style={{
                   paddingLeft: '15px'
              }}>  <Tooltip title={configDefaultText['page.listFair.addCPass']}>
                <FileAddTwoTone
                  style={{
                    fontSize: 20,
                    paddingLeft: 5
                  }}
                  onClick={() => {
                    setCurrentFair(entity?.id);
                    setShowModalCPass(true);
                  }}

                ></FileAddTwoTone></Tooltip> </Col>
            </Row>


            <Row gutter={[16, 16]}>
              <Col span={6}>  <Tooltip title={configDefaultText['page.listFair.assign']}>
                <Link to={`/web-c-pass/fairs/add-mega-assign/` + entity.id}>
                  <PlusOutlined
                    style={{
                      fontSize: 20,
                      paddingLeft: 5
                    }}
                    onClick={() => {
                    }}
                  />
                </Link></Tooltip>
              </Col>
              <Col span={6} style={{
                paddingLeft: '15px'
              }}>  <Tooltip title={configDefaultText['page.listFair.manager']}>
                <Link to={`/web-c-pass/fairs/manager/` + entity.id}>
                  <SettingOutlined
                    style={{
                      fontSize: 20,
                      paddingLeft: 5
                    }}
                  />
                </Link> </Tooltip> </Col>
            </Row>





          </>
        )
        if (entity?.status === 'noOpen') {
          // button edit
          configButton.push(<>
            <Tooltip title={configDefaultText['edit']}><EditTwoTone
              style={{
                fontSize: 20,
                paddingLeft: 5
              }}
              onClick={async () => {
                handleUpdateModalOpen(true);
                refIdFair.current = entity.id;
                const fair = await customAPIGetOne(entity.id, 'fairs/fairadmin', {});
                fair.timeEnd = moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.timeStart = moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateStartFeed = moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
                fair.dateEndFeed = moment(fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('YYYY-MM-DD HH:mm:ss');
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
            /></Tooltip>
          </>);
        }
        return configButton;
      }
    },
  ];


  // const [intl, setIntl] = useState('zhCNIntl');

  function renderTableAlert(selectedRowKeys: any) {
    return (

      <Fragment>
        Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
      </Fragment>
    );
  }


  function renderTableAlertOption(selectedRows: any) {
    console.log(selectedRows);
    return (
      <>
        <Fragment>
          <Button onClick={async () => {
            await confirm(selectedRowsState);
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
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
            if (record.status !== 'opening') {
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
              {/* <FormattedMessage id='buttonNew' defaultMessage='Mới' /> */}
              {configDefaultText['new']}
            </Button>,
          ]}
          request={async () => {
            const data = await customAPIGet({}, 'fairs/fairadmin');
            return data
          }}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows: any) => {
              setSelectedRows(selectedRows);
            },
            alwaysShowAlert: false,
            // getCheckboxProps: (record: any) => ({
            //   className: '',
            //   style: {
            //     borderStartEndRadius: '0px',
            //   },

            // })


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
          // title={<FormattedMessage id='page.listFair.create' defaultMessage='Tạo mới Phiên mở bán' />}
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



          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDigit className='w-full' name='timeFeed' placeholder='Thời gian nuôi' min={1} max={100}
                // label={<FormattedMessage id='page.listFair.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />}
                label={configDefaultText['page.listFair.column.timeFeed']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
                  { required: true, message: configDefaultText['page.listFair.required.timeFeed'] },

                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDigit className='w-full'
                name='unitPriceMeat'
                placeholder={configDefaultText['page.listFair.column.unitPriceMeat']}
                min={1000}
                //label={<FormattedMessage id='page.listFair.unitPriceMeat' defaultMessage='Đơn giá thịt(VND/Kg)' />}
                label={configDefaultText['page.listFair.column.unitPriceMeat']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.unitPriceMeat' defaultMessage='Vui lòng nhập đơn giá thịt' /> },
                  { required: true, message: configDefaultText['page.listFair.required.unitPriceMeat'] },
                ]}
              />
            </Col>
          </Row>


          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormDateTimePicker name="timeStart"
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                placeholder={configDefaultText['page.listFair.column.timeStart']}
                //label={<FormattedMessage id='page.listFair.timeStart' defaultMessage='Thời gian mở' />}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.timeStart' defaultMessage='Vui lòng chọn thời gian mở' /> },
                  { required: true, message: configDefaultText['page.listFair.required.timeStart'] },
                ]}
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
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                //label={<FormattedMessage id='page.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
                label={configDefaultText['page.listFair.column.dateStartFeed']}

                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
                  { required: true, message: configDefaultText['page.listFair.required.dateStartFeed'] },
                ]}
              />
            </Col>
          </Row>

          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormText name='nameFarm'

                placeholder={configDefaultText['page.listFair.column.nameFarm']}
                //label={<FormattedMessage id='page.listFair.nameFarm' defaultMessage='Tên trang trại' />}
                label={configDefaultText['page.listFair.column.nameFarm']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.nameFarm' defaultMessage='Vui lòng nhập trang trại' /> },
                  { required: true, message: configDefaultText['page.listFair.required.nameFarm'] }
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormDatePicker
                fieldProps={{
                  style: {
                    width: '100%'
                  }
                }}
                name="dateEndFeed"
                placeholder={configDefaultText['page.listFair.column.dateEndFeed']}
                //label={<FormattedMessage id='page.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
                label={configDefaultText['page.listFair.column.dateEndFeed']}

                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
                  { required: true, message: configDefaultText['page.listFair.required.dateEndFeed'] },
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
                // placeholder="Chọn cPass"
                placeholder={configDefaultText['page.listFair.column.plans']}

                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.plans' defaultMessage='Vui lòng chọn PAHT' /> },
                  { required: true, message: configDefaultText['page.listFair.required.plans'] },
                ]}
              />
            </Col>
          </Row>

        </ModalForm>




        <ModalForm
          // title={<FormattedMessage id='page.listFair.update' defaultMessage='Cập nhật Phiên mở bán' />}
          title={configDefaultText['page.listFair.update']}
          open={updateModalOpen}
          form={form}
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              handleUpdateModalOpen(false);
            },
          }}
          submitTimeout={2000}
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
                //label={<FormattedMessage id='page.listFair.code' defaultMessage='Mã phiên mở bán' />}
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
                //label={<FormattedMessage id='page.listFair.timeStart' defaultMessage='Thời gian mở' />}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.timeStart' defaultMessage='Vui lòng chọn thời gian mở' /> },
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
                placeholder={configDefaultText['page.listFair.column.timeEnd']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.timeEnd' defaultMessage='Thời gian đóng' /> },
                  { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                ]}
                label={
                  configDefaultText['page.listFair.column.timeEnd']
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
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                //label={<FormattedMessage id='page.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
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
                // label="Thời gian kết thúc nuôi" 
                label={configDefaultText['page.listFair.column.dateEndFeed']}
                placeholder='Thời gian kết thúc nuôi'
                rules={
                  [{
                    required: true,
                    message: configDefaultText['page.listFair.required.dateEndFeed']
                    // <FormattedMessage id='page.ListFair.required.dateEndFeed' defaultMessage='Thời gian kết thúc nuôi' />
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
                // label={<FormattedMessage id='page.listFair.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />}
                label={configDefaultText['page.listFair.column.timeFeed']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
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
                  //  message: <FormattedMessage id='page.ListFair.required.timeStart' defaultMessage='Trạng thái' /> 
                  message: configDefaultText['page.listFair.required.status']
                }]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                // valueEnum={}
                options={plan}
                //request={getPlans}
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
              <ProFormText className='w-full' name='unitPriceMeat' placeholder={configDefaultText['page.listFair.column.unitPriceMeat']}
                //label={<FormattedMessage id='page.listFair.unitPriceMeat' defaultMessage='Đơn giá thịt(VND/Kg)' />}
                label={configDefaultText['page.listFair.column.unitPriceMeat']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.unitPriceMeat' defaultMessage='Vui lòng nhập đơn giá thịt' /> },
                  { required: true, message: configDefaultText['page.listFair.required.unitPriceMeat'] },
                ]}
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
            <Col span={24} className="gutter-row p-0" >
              <ProFormSelect
                name="c_passes"
                label={configDefaultText['page.listFair.column.c_passes']}
                // valueEnum={}
                request={getCPassNotFair}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.c_passes']}
              />
            </Col>
          </Row>
        </ModalForm>

        <ModalForm
          title='Sao chép Phiên mở bán'
          open={copyModalOpen}
          form={form}
          width={`76vh`}
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
            // message.success('Success');
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
              // submitText: <FormattedMessage id='buttonAdd' defaultMessage='Thêm' />,
              resetText: configDefaultText['buttonClose'],
              submitText: configDefaultText['buttonAdd'],

            },
          }}
        >
          <Row gutter={24} className="m-0">
            <Col span={12} className="gutter-row p-0" >
              <ProFormSelect
                name="c_passes"
                label={configDefaultText['page.listFair.column.c_passes']}
                // valueEnum={}
                request={getCPassNotFair}
                fieldProps={{
                  mode: 'multiple',
                }}
                className='w-full'
                placeholder={configDefaultText['page.listFair.column.c_passes']}
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
                //label={<FormattedMessage id='page.listFair.timeStart' defaultMessage='Thời gian mở' />}
                label={configDefaultText['page.listFair.column.timeStart']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.timeStart' defaultMessage='Vui lòng chọn thời gian mở' /> },
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
                placeholder={configDefaultText['page.listFair.column.timeEnd']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.timeEnd' defaultMessage='Thời gian đóng' /> },
                  { required: true, message: configDefaultText['page.listFair.required.timeEnd'] },
                ]}
                label={
                  configDefaultText['page.listFair.column.timeEnd']
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
                placeholder={configDefaultText['page.listFair.column.dateStartFeed']}
                //label={<FormattedMessage id='page.listFair.dateStartFeed' defaultMessage='Thời gian bắt đầu nuôi' />}
                label={configDefaultText['page.listFair.column.dateStartFeed']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.dateStartFeed' defaultMessage='Vui lòng chọn thời gian bắt đầu nuôi' /> },
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
                // label="Thời gian kết thúc nuôi" 
                label={configDefaultText['page.listFair.column.dateEndFeed']}
                placeholder='Thời gian kết thúc nuôi'
                rules={
                  [{
                    required: true,
                    message: configDefaultText['page.listFair.required.dateEndFeed']
                    // <FormattedMessage id='page.ListFair.required.dateEndFeed' defaultMessage='Thời gian kết thúc nuôi' />
                  }]
                }
              />
            </Col>

            <Col span={12} className="gutter-row p-0" >
              <ProFormText className='w-full' name='timeFeed' placeholder='Thời gian nuôi'
                // label={<FormattedMessage id='page.listFair.timeFeed' defaultMessage='Thời gian nuôi(Tuần)' />}
                label={configDefaultText['page.listFair.column.timeFeed']}
                rules={[
                  //{ required: true, message: <FormattedMessage id='page.listFair.required.timeFeed' defaultMessage='Vui lòng nhập thời gian nuôi' /> },
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
                  //  message: <FormattedMessage id='page.ListFair.required.timeStart' defaultMessage='Trạng thái' /> 
                  message: configDefaultText['page.listFair.required.status']
                }]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormSelect
                name="plans"
                label={configDefaultText['page.listFair.column.plans']}
                // valueEnum={}
                options={plan}
                //request={getPlans}
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
              <ProFormText className='w-full' name='unitPriceMeat' placeholder={configDefaultText['page.listFair.column.unitPriceMeat']}
                //label={<FormattedMessage id='page.listFair.unitPriceMeat' defaultMessage='Đơn giá thịt(VND/Kg)' />}
                label={configDefaultText['page.listFair.column.unitPriceMeat']}
                rules={[
                  // { required: true, message: <FormattedMessage id='page.listFair.required.unitPriceMeat' defaultMessage='Vui lòng nhập đơn giá thịt' /> },
                  { required: true, message: configDefaultText['page.listFair.required.unitPriceMeat'] },
                ]}
              />
            </Col>

            <Col span={12} className="gutter-row p-0">
              <ProFormText className='w-full' name='nameFarm' label='Tên trang trại'
                placeholder='Tên trang trại'
                rules={[{ required: true, message: <FormattedMessage id='page.ListFair.required.nameFarm' defaultMessage='Tên trang trại' /> }]}
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



      </PageContainer>
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
    </>
  );
};

export default TableList;
