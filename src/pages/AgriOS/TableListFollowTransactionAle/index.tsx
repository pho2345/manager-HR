import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIGet,
} from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { Button, Col, Input, Row, Space } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;



const TableList: React.FC = () => {
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  
  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();
  const searchInput = useRef(null);


  const actionRef = useRef<ActionType>();

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
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
      />
    ),
    onFilter: (value: any, record: any) => {
      console.log(dataIndex);

      if (record[dataIndex]) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      if (dataIndex === 'mega') {
        if (record['userId'].toString() === (value.toLowerCase())) {
          return record['userId']?.toString().toLowerCase().includes(value.toLowerCase());
        }
        if (record['email']?.toString().includes(value.toLowerCase())) {
          return record['email'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record['passport']?.toString() === (value.toLowerCase())) {
          return record['passport']?.toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record['phone']?.toString().includes(value.toLowerCase())) {
          return record['phone'].toString().toLowerCase().includes(value.toLowerCase());
        }
      }
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
      }
    },
  });


  const handleSearchRange = (selectedKeys: any, confirm: any) => {
    confirm();
  };

  const clearResetRange = (clearFilters: any, confirm: any) => {
    clearFilters();
    setSearchRangeFrom(null);
    setSearchRangeTo(null);
    setOptionRangeSearch(null);
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
                value: optionRangeSearch
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
      // title: <FormattedMessage id='pages.searchTable.column.aleger' defaultMessage='Aleger' />,
      title: configDefaultText['page.confirm.column.aleger'],
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      ...getColumnSearchProps('mega'),
      renderText: (_, entity: any) => {
        return `${entity?.fullname ? entity?.fullname : entity?.username}-${entity?.id}`;
      },
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.app' defaultMessage='Ứng dụng' />,
      title: configDefaultText['page.follow.column.app'],
      dataIndex: 'app',
      valueType: 'textarea',
      key: 'app',
      renderText: (_, entity: any) => {
        return ``;
      },
      //...getColumnSearchProps('mega')
    },
    {
      // title: <FormattedMessage id='page.follow.column.types' defaultMessage='Hoạt động' />,
      title: configDefaultText['page.follow.column.types'],
      dataIndex: 'types',
      valueType: 'textarea',
      key: 'types',
      render: (_, text: any) => {
        let types;
        switch (text?.types) {
          case 'buyAle':

            return (<span style={{
              color: 'green'
            }}>Mua Ale</span>);

            break;

          case 'sellAle':

            types = (<span style={{
              color: 'red'
            }}>Bán Ale </span>);

            break;

          case 'megaDeltaWeightproduceAle':
            types = (<span style={{
              color: '#34d399'
            }}>Nhận ProduceAle</span>);

            break;
          case 'qrCode':

            types = (<span style={{
              color: '#22d3ee'
            }}>Nạp Ale qua QRCode</span>);

            break;
          case 'aleTransfer':

            types = (<span style={{
              color: '#818cf8'
            }}>Chuyển Ale</span>);

            break;
          case 'produceAleExchangeAle':

            types = (<span style={{
              color: '#a78bfa'
            }}>Chuyển đổi ProduceAle</span>);
            break;

          case 'produceAleExchangePromo':

            types = (<span style={{
              color: 'red'
            }}>Chuyển đổi ProduceAle sang PromoAle</span>);

            break;
          case 'cpassPayment':

            types = (<span style={{
              color: '#f472b6'
            }}>Thanh toán cPass</span>);
            break;
          case 'cpassSettlement':

            types = (<span style={{
              color: '#fb7185'
            }}>Thanh toán cPass</span>);
            break;
          default:
            break;
        }
        return types
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
      onFilter: (value, record) => {
        if (record.types === value) {
          return record
        }
        return null;
      },
      filterSearch: true,
    },

    {
      // title: <FormattedMessage id='page.follow.column.ale' defaultMessage='Số lượng Ale' />,
      title: configDefaultText['page.follow.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => text?.ale && text?.ale > 0 ? text?.ale.toLocaleString() : 'N/A'
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số lượng ProduceAle' />,
      title: configDefaultText['page.follow.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => text?.produceAle && text?.produceAle > 0 ? text?.produceAle.toLocaleString() : 'N/A'
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Số lượng PromoAle' />,
      title: configDefaultText['page.follow.column.promoAle'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => text?.promoAle && text?.promoAle > 0 ? text?.promoAle.toLocaleString() : 'N/A'
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.location' defaultMessage='Vị trí' />,
      title: configDefaultText['page.follow.column.location'],
      dataIndex: 'location',
      valueType: 'textarea',
      key: 'location',
      renderText: (_, text: any) => text?.location ? text?.location : 'N/A'
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
      title: (<>{configDefaultText['page.follow.column.account']}<br />{configDefaultText['page.follow.column.payment']}</>),
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
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
      // title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      title: configDefaultText['page.confirm.column.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      ...getColumnSearchRange(),
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
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

        ]}

        scroll={{
          x: window.innerWidth * 0.8
        }}
        
        request={async () => {
          const data = await customAPIGet(
            {

            },
            'transactions/follow-ale');
          return {
            data: data?.data,
            success: true,
            total: data?.data?.length
          }
        }
        }
        columns={columns}

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
      />

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
