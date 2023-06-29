import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';

import {
  //FormattedMessage, useIntl, 
  useParams
} from '@umijs/max';
import { Button, Col, Drawer, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { customAPIGet } from '@/services/ant-design-pro/api';
import './styles.css';
import moment from 'moment';
import configText from '@/locales/configText';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
const configDefaultText = configText;



const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const params = useParams<number>();


  const [showRangeTo, setShowRangeTo] = useState<boolean>(false);
  const [searchRangeFrom, setSearchRangeFrom] = useState<any>(null);
  const [searchRangeTo, setSearchRangeTo] = useState<any>(null);
  const [optionRangeSearch, setOptionRangeSearch] = useState<any>();

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
 
  });


  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.codeTransaction' defaultMessage='Mã giao dịch' />,
      title: configDefaultText['page.myAle.code'],
      key: 'code',
      dataIndex: 'atrributes',
      render: (_, record: any) => {
        return (
          <>
            {record?.code}
          </>
        );
      },

    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.active' defaultMessage='Hoạt động' />,
      title: configDefaultText['page.myAle.active'],
      dataIndex: 'types',
      valueType: 'textarea',
      key: 'types',
      render: (_, record: any) => {
        return (<>
          <span style={{
            color: record.color
          }}>{record?.active}</span>
        </>)
      },
      filters:[
        {
          text: 'Mua Ale',
          value: 'buyAle'
        },
        {
          text: 'Bán Ale',
          value: 'sellAle'
        },
        {
          text: 'Chuyển ProduceAle sang Ale',
          value: 'produceAleExchangeAle'
        },
        {
          text: 'Chuyển ProduceAle sang PromoAle',
          value: 'produceAleExchangePromo'
        },
        {
          text: 'Tặng Ale',
          value: 'aleTransfer'
        },
        {
          text: 'Thanh toán cPass',
          value: 'cpassPayment'
        },
        {
          text: 'Chuyển đổi MegaΔP sang ProduceAle',
          value: 'megaDeltaWeightproduceAle'
        },
        {
          text: 'Quét QRCode',
          value: 'qrCode'
        },
      ],
      onFilter: true
      
       
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Ale' />,
      title: configDefaultText['page.myAle.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      align: 'center',
      renderText: (_, record: any) => record?.ale?.toLocaleString() || `N/A`
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='ProduceAle' />,
      title: configDefaultText['page.myAle.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      align: 'center',
      renderText: (_, record: any) => record?.produceAle?.toLocaleString() || `N/A`
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='PromoAle' />,
      title: configDefaultText['page.myAle.promoAle'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      align: 'center',
      key: 'promoAle',
      renderText: (_, record: any) => record?.promoAle?.toLocaleString() || `N/A`
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.rateFee' defaultMessage='Phí giao dịch(%)' />,
      title: configDefaultText['page.myAle.rateFee'],
      dataIndex: 'rateFee',
      valueType: 'textarea',
      align: 'center',
      key: 'rateFee',
      renderText: (_, record: any) => record?.rateFee || `N/A`
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.fee' defaultMessage='Phí(VNĐ)' />,
      title: configDefaultText['page.myAle.fee'],
      dataIndex: 'fee',
      valueType: 'textarea',
      align: 'center',
      key: 'fee',
      renderText: (_, record: any) => record?.fee?.toLocaleString() || `N/A`
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.location' defaultMessage='Vị trí' />,
      title: configDefaultText['page.myAle.location'],
      dataIndex: 'location',
      valueType: 'textarea',
      key: 'location',
      renderText: (_, record: any) => record?.location || `N/A`
    },

    {
      title: configDefaultText['page.confirmSettlementVnd.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, record: any) => moment(record?.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      ...getColumnSearchRange(),
    },


  ];

  return (
    <PageContainer
      onBack={() => window.history.back()}
    >
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}

        request={() =>
          customAPIGet(
            { 'user-id': params?.id },
            'transactions/myale',
          )
        }
        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined />,
            onClick: async () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }]
        }}
        // dataSource={data}
        columns={columns}
        rowSelection={false}

        pagination={{
          pageSize: 10,
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
      />






      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
