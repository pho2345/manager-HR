import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIGet, customAPIUpdateMany,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ModalForm,
  ProColumns,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Input, message, Modal, Space } from 'antd';
import moment from 'moment';
import React, {  useRef, useState } from 'react';






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
  } catch (error) {
    hide();
    message.error('Cập nhật thất bại!');
    return false;
  }
};




const TableList: React.FC = () => {

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const [selectedRowsState, setSelectedRowsState] = useState<number[]>([]);
   //const [searchText, setSearchText] = useState('');
   //const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
         // placeholder={`Search ${dataIndex}`}
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              //setSearchText(selectedKeys[0]);
              //setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            đóng
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
      console.log(record);
      if (record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      if(record['fullname'] && record['fullname'].toString().toLowerCase().includes(value.toLowerCase())){
        return record['fullname'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if(record['email'] && record['email'].toString().toLowerCase().includes(value.toLowerCase())){
        return record['email'].toString().toLowerCase().includes(value.toLowerCase());
      }

      if(record['passport'] && record['passport'].toString().toLowerCase().includes(value.toLowerCase())){
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


  const confirm = (entity: any, content: string, api: string) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
       const success = await  handleUpdateMany(entity, api, null);
        if(success){
          if (actionRef.current) {
            setShowModal(false);
            actionRef.current.reload();
            setSelectedRows([]);
          }
        }
      }
    })
  }


  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Mã giao dịch' />,
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
      title: <FormattedMessage id='pages.searchTable.column.typesTransaction' defaultMessage='Giao dịch' />,
      dataIndex: 'types',
      valueType: 'textarea',
      key: 'types',
      renderText: (_, text: any) => {
        if(text?.types === 'buyAle'){
          return `Mua Ale`;
        }
        else {
          return `Bán Ale`;
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
      title: <FormattedMessage id='pages.searchTable.column.aleger' defaultMessage='Aleger' />,
      dataIndex: 'username',
      valueType: 'textarea',
      key: 'username',
      renderText: (_, entity: any) => {
        return `${entity?.fullname ? entity?.fullname : entity?.username}-${entity?.id}`;
      },
      ...getColumnSearchProps('mega')
    },


    {
      title: (
        <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      ),
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
      title: (<>Tài khoản<br/>thanh toán</>),
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Ale' />,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => text?.ale.toLocaleString()
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      renderText: (_, text: any) => text?.priceVnd.toLocaleString()
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      }
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      ),
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
      title: <FormattedMessage id='pages.searchTable.column.config' defaultMessage='Thao tác' />,
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      render: (_, record: any) => {
        if(record?.status === 'inProgress'){
          return [
            (<>
             <SettingOutlined 
              style={{
                fontSize: 20
              }}
              onClick={() => {
                setShowModal(true);
                setSelectedRows([
                  {
                    id:record?.id,
                    types: record?.types
                  }
                ])
                
              }}
             />
            </>),
           
          ]
        }
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
         
        ]}
        request={async () => {
          const data = await customAPIGet(
            {
             
            },
            'transactions/wait-confirm-ale');

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
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRowsState(selectedRows);
            const confitSelectedRows = selectedRows.map((e: any) => {
              return {
                id: e?.id,
                types: e?.types
              }
            });
            setSelectedRows(confitSelectedRows);
            // setSelectedRows([
            //   {
            //     id:record?.id,
            //     types: record?.types
            //   }
            // ])
          },
          getCheckboxProps: (record: any) => ({
            disabled: record?.status === 'inProgress' ? false : true, // Column configuration not to be checked
          }),
        }}

        toolbar={{
          settings:[{
            key: 'reload',
            tooltip: 'Tải lại',
            icon: <ReloadOutlined />,
            onClick:() => {
              if (actionRef.current){
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
      )}
      

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
          if(values?.status === 1 || !values?.status){
            confirm({
              transaction: selectedRows
            }, `Chắc chắn thay đổi Tình trạng xử lý từ Chờ xác nhận sang Xác nhận ?`, 'transactions/confirm-ale-admin');
          }
          else {
            confirm({
              transaction: selectedRows
            }, `Chắc chắn thay đổi Tình trạng xử lý từ Chờ xác nhận sang Hủy?`, 'transactions/cancel-ale-admin');
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
