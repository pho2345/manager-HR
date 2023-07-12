import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIDowload,
  customAPIDowloadPDF,
  customAPIGet, customAPIUpdateMany,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,

} from '@ant-design/pro-components';

//import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Col, Input, message, Modal, Row, Space } from 'antd';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;





const handleUpdateMany = async (fields: any, api: string, id: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const updateTransaction = await customAPIUpdateMany(
      fields,
      api,
      id);
    hide();
    if (updateTransaction) {
      message.success('Cập nhật thành công');
    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);
    return false;
  }
};




const TableList: React.FC = () => {

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  // const [selectedRows, setSelectedRows] = useState<any>([]);

  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

  const [selectedRowsState, setSelectedRowsState] = useState<any>([]);
  //const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [showDowloadFile, setShowDowloadFile] = useState<boolean>(false);



  const actionRef = useRef<ActionType>();

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
    //setSearchText('');
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
      if (value) {
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


  const confirm = (entity: any, content: string, api: string) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        const success = await handleUpdateMany(entity, api, null);
        if (success) {
          if (actionRef.current) {
            setShowModal(false);
            // actionRef.current.reload();
            actionRef.current?.reloadAndRest?.();
            setSelectedRowsState([]);
          }
        }
      }
    })
  }


  //const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Mã giao dịch' />,
      title: configDefaultText['page.confirm.column.code'],
      key: 'code',
      dataIndex: 'code',
      render: (_, entity: any) => {
        return (
          <>
            {entity?.code}
          </>
        );
      },

      //valueEnum: filterCode
      ...getColumnSearchProps('code')
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.typesTransaction' defaultMessage='Giao dịch' />,
      title: configDefaultText['page.confirm.column.typesTransaction'],
      dataIndex: 'types',
      valueType: 'textarea',
      key: 'types',
      render: (_, text: any) => {
        if (text?.types === 'buyAle') {
          return (<span style={{
            color: 'green'
          }}> Mua Ale</span>);
        }
        else {
          return (<span style={{
            color: 'red'
          }}> Bán Ale</span>);;
        }
      },
      filters: [

        {
          text: 'Mua Ale',
          value: 'buyAle'
        },
        {
          text: 'Bán Ale',
          value: 'sellAle'
        }
      ],
      onFilter: true,
      filterSearch: true,
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.aleger' defaultMessage='Aleger' />,
      title: configDefaultText['page.confirm.column.aleger'],
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, entity: any) => {
        return `${entity?.fullname ? entity?.fullname : entity?.username}-${entity?.userId}`;
      },
      ...getColumnSearchProps('mega')
    },


    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      // ),
      title: configDefaultText['page.confirm.column.method'],
      dataIndex: 'method',
      valueType: 'textarea',
      key: 'method',
      renderText: (_, text: any) => text?.method,
      filtered: true,
      onFilter: true,
      valueEnum: {
        ale: {
          text: 'Ale',
          value: 'ale'
        },
        vnd: {
          text: 'VNĐ',
          value: 'vnd'
        }
      },
    },
    {
      title: (<>Tài khoản<br />thanh toán</>),
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Ale' />,
      title: configDefaultText['page.confirm.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => text?.ale.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      title: configDefaultText['page.confirm.column.priceVnd'],
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      renderText: (_, text: any) => text?.priceVnd.toLocaleString()
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      title: configDefaultText['page.confirm.column.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      },
      ...getColumnSearchRange()
    },
    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      // ),
      title: configDefaultText['page.confirm.column.statusTransaction'],
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      filters: [
        {
          text: 'Chờ xác nhận',
          value: 'inProgress'
        },
        {
          text: 'Hoàn thành',
          value: 'done'
        },
        {
          text: 'Đã hủy',
          value: 'cancel'
        }
      ],
      defaultFilteredValue: ['inProgress'],
      onFilter: true,
      filterSearch: true,
      render: (_, text: any) => {
        switch (text?.status) {
          case 'inProgress':
            return (<div style={{ color: 'blue' }}>Chờ xác nhận</div>);
          case 'done':
            return (<div style={{ color: 'green' }}>Hoàn thành</div>);
          case 'cancel':
            return (<div style={{ color: 'red' }}>Đã hủy</div>);
          default:
            break;
        }
      },
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.config' defaultMessage='Thao tác' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      align: 'center',
      render: (_, record: any) => {
        if (record?.status === 'inProgress') {
          return [
            (<>
              <SettingOutlined
                style={{
                  fontSize: 20
                }}
                onClick={() => {
                  setShowModal(true);
                  setSelectedRowsState([
                    {
                      id: record?.id,
                      types: record?.types
                    }
                  ]);


                }}
              />
            </>),

          ]
        }
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
            const confitSelectedRows = selectedRows.map((e: any) => {
              return {
                id: e?.id,
                types: e?.types
              }
            });
            setSelectedRowsState(confitSelectedRows);
            setShowModal(true);
            // actionRef.current?.reloadAndRest?.();
          }}>Thực hiện</Button>
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
        scroll={{
          x: window.innerWidth * 0.8
        }}
        toolBarRender={() => {
          return showDowloadFile ? [
            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowload('transactions/wait-confirm-ale/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,

            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('transactions/wait-confirm-ale/pdf');
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
          ] : []
        }}
        request={async () => {
          const data = await customAPIGet(
            {

            },
            'transactions/wait-confirm-ale');

            if(data.data && data?.data?.length > 0) {
              setShowDowloadFile(true);
            }
            else {
              setShowDowloadFile(false);
            }
          return {
            data: data?.data,
            success: true,
            total: data?.data?.length
          }
        }
        }
        columns={columns}
        rowSelection={{
          getCheckboxProps: (record: any) => ({
            disabled: record?.status === 'inProgress' ? false : true, // Column configuration not to be checked
          }),
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
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
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
        open={showModal}
        width={300}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowModal(false);
          },
        }}
        onFinish={async (values) => {
          if (values?.status === 1 || !values?.status) {
            confirm({
              transaction: selectedRowsState
            }, configDefaultText['page.confirm.column.textWaitToSubmit'], 'transactions/confirm-ale-admin');
          }
          else {
            confirm({
              transaction: selectedRowsState
            }, configDefaultText['page.confirm.column.textWaitCancel'], 'transactions/cancel-ale-admin');
          }

          return true
        }}
      >

        <ProFormSelect width='md' options={[
          {
            label: 'Xác nhận',
            value: 1
          },
          {
            label: 'Hủy',
            value: 2
          }
        ]}
          fieldProps={{
            defaultValue: 1,
            // onChange: async (values: any) => {
            // }
          }}
          required placeholder='Chọn tình trạng' name='status' label='Tình trạng' />
      </ModalForm>



      {currentRowUser && (
        <DetailUser
          onDetail={showDetailUser}
          currentRowUser={currentRowUser}
          onCloseDetail={() => {
            setCurrentRowUser(undefined);
            setShowDetailUser(false);
          }}
        />
      )
      }




    </PageContainer>
  );
};

export default TableList;
