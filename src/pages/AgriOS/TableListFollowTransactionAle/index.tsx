import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIGet,
} from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Input, Space } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;





// const handleUpdateMany = async (fields: any, api: string, id: any) => {
//   const hide = message.loading('Đang cập nhật...');
//   try {
//     const updateTransaction = await customAPIUpdateMany(
//       fields,
//       api,
//       id);
//     hide();
//     if (updateTransaction) {
//       message.success('Cập nhật thành công');
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Cập nhật thất bại!');
//     return false;
//   }
// };

const TableList: React.FC = () => {
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);


  //const [selectedRowsState, setSelectedRowsState] = useState<number[]>([]);
  // const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');
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
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{

    // }

  });


  // const confirm = (entity: any, content: string, api: string) => {
  //   Modal.confirm({
  //     title: 'Confirm',
  //     icon: <ExclamationCircleOutlined />,
  //     content: content,
  //     okText: 'Có',
  //     cancelText: 'Không',
  //     onOk: async () => {
  //       const success = await handleUpdateMany(entity, api, null);
  //       if (success) {
  //         if (actionRef.current) {
  //         }
  //       }
  //     }
  //   })
  // }


  // const intl = useIntl();

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
      renderText: (_, entity: any) => {
        return `${entity?.fullname ? entity?.fullname : entity?.username}-${entity?.id}`;
      },
      ...getColumnSearchProps('mega')
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

        (<span style={{
          color: 'green'
        }}> </span>)
        switch (text?.types) {
          case 'buyAle':
            return (<span style={{
              color: 'green'
            }}>Mua Ale</span>) ;
            break;

          case 'sellAle':
            types = (<span style={{
              color: 'green'
            }}>Bán Ale </span>);
            break;

          case 'megaDeltaWeightproduceAle':
            types = `Nhận ProduceAle`;
            break;
          case 'qrCode':
            types = `Nạp Ale qua QRCode`;
            break;
          case 'aleTransfer':
            types = `Chuyển Ale`;
            break;
          case 'produceAleExchangeAle':
            types = `Chuyển đổi ProduceAle`;
            break;
          case 'produceAleExchangePromo':
            types = `Chuyển đổi ProduceAle sang PromoAle`;
            break;
          case 'cpassPayment':
            types = `Thanh toán cPass`;
            break;
          case 'cpassSettlement':
            types = `Thanh quyết toán cPass`;
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
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      }
    },

  ];

  return (
    <PageContainer>
      <ProTable
        // headerTitle={intl.formatMessage({
        //   id: 'pages.searchTable.title',
        //   defaultMessage: 'Enquiry form',
        // })}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => [

        ]}
        request={async () => {
          const data = await customAPIGet(
            {

            },
            'transactions/follow-ale');

          //  const filter = data?.data.reduce((pre: any, cur: any) =>{
          //   let element;
          //   switch (cur?.status) {
          //     case 'waitConfirm':
          //       element = {
          //         text: `Chờ Mega xác nhận`,
          //         value: 'waitConfirm'
          //       }
          //       break;
          //     case 'inProgress':
          //       element = {
          //         text: `Chờ xác nhận`,
          //         value: 'inProgress'
          //       }
          //       break;

          //     case 'done':
          //       element = {
          //         text: `Hoàn thành`,
          //         value: 'done'
          //       }
          //       break;

          //     case 'cancel':
          //       element = {
          //         text: `Đã hủy`,
          //         value: 'cancel'
          //       }
          //       break;

          //     case 'waitRefund':
          //       element = {
          //         text: `Chờ xác nhận hoàn trả`,
          //         value: 'waitRefund'
          //       }
          //       break;

          //     default:
          //       break;
          //   }
          //   pre.push(element);
          //   return pre;
          //  }, []);

          //  console.log('filter', filter);

          //  const uniqueArr = filter.filter((item: any, index: any, self: any) => {
          //   return index === self.findIndex((t: any) => t.value === item.value);
          // });

          // setFilterStatus(uniqueArr);
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

      // rowSelection={{
      //   onChange: (_, selectedRows: any) => {
      //     setSelectedRowsState(selectedRows);
      //     const confitSelectedRows = selectedRows.map((e: any) => {
      //       return {
      //         id: e?.id,
      //         types: e?.types
      //       }
      //     });
      //     setSelectedRows(confitSelectedRows);
      //     // setSelectedRows([
      //     //   {
      //     //     id:record?.id,
      //     //     types: record?.types
      //     //   }
      //     // ])
      //   },
      //   getCheckboxProps: (record: any) => ({
      //     disabled: record?.status === 'inProgress' ? false : true, // Column configuration not to be checked
      //   }),
      // }}
      />

      {/* {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}

            </div>
          }
        >
          <Button
            onClick={async () => {
              //await handleRemove(selectedRowsState);
              setShowModal(true);
              //setSelectedRows([]);
              //actionRef.current?.reloadAndRest?.();
            }}
          >
            Thực hiện
          </Button>

        </FooterToolbar>
      )} */}





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
