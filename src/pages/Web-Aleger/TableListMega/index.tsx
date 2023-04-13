import { customAPIGet } from '@/services/ant-design-pro/api';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { Button, Space, Input } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
// import DetailCPass from '@/pages/components/DetailCPass';
import DetailUser from '../components/DetailUser';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import configText from '@/locales/configText';
const configDefaultText = configText;








const TableListAssignCPass = () => {
  const actionRef = useRef<ActionType>();
  // const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  // const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  //const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);



  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const searchInput = useRef(null);

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

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.searchTable.column.aleger' defaultMessage='Aleger' />,
      title: configDefaultText['page.listAleger.column.aleger'],
      ...getColumnSearchProps('username'),
      render: (_, entity: any) => {
        return (
          <>
            <a
              onClick={() => {
                setCurrentRowUser(entity?.id);
                setShowDetailUser(true);
              }}>
              {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
            </a><br /> {entity?.phone}{`${entity?.email ? `|${entity?.email}` : null}`}
            <br /> CCCD/HC: {entity?.passport}
          </>
        );
      },


    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.totalMegaCPass' defaultMessage='Tổng cPass Mega' />,
      title: configDefaultText['page.listAleger.column.totalMegaCPass'],
      dataIndex: 'totalMegaCPass',
      valueType: 'textarea',
      key: 'totalMegaCPass',
      render: (_, text) => {
        return <>{text?.totalMegaCPass}</>
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='Tổng MegaΔP (kg)' />,
      title: configDefaultText['page.listAleger.column.totalMegaCPass'],
      dataIndex: 'megaDeltaWeight',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      render: (_, record) => {
        return <>{record?.megaDeltaWeight}</>
      }
    },

    {
      // title: (<>Tổng MegaP (kg) <br />MegaE (VNĐ)</>),
      title: (<>{configDefaultText['page.listAleger.column.totalMegaP']}<br/> {configDefaultText['page.listAleger.column.megaE']}</>),
      dataIndex: 'megaWeight',
      valueType: 'textarea',
      key: 'megaWeight',
      render: (_, record) => {
        return <>{record?.megaWeight} | {record?.megaE}</>
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số dư ProduceAle' />,
      title: configDefaultText['page.listAleger.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      render: (_, record) => {
        return <>{record?.produceAle}</>
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      title: configDefaultText['page.listAleger.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      render: (_, record) => {
        return <>{record?.ale}</>
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.detail' defaultMessage='Chi tiết' />,
      title: configDefaultText['page.listAleger.column.ale'],
      dataIndex: 'detail',
      valueType: 'textarea',
      key: 'detail',
      render: (_, record) => {
        return <Button
          onClick={() => {
            setCurrentRowUser(record?.id);
            setShowDetailUser(true);
          }}
        >{configDefaultText['page.listAleger.column.ale']}</Button>
      }
    },

  ];





  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
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

        request={async () => {
          const data = await customAPIGet({}, 'users/aleger');
          return data;
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows: any) => {
        //     console.log(selectedRows);
        //     if (selectedRows.length > 1) {
        //       message.error('Chỉ được chọn 1 Mega!');

        //     }

        //     //setSelectedRowsMega(selectedRows);
        //   },
        //   // getCheckboxProps: (record: any) => ({
        //   //   disabled: false, // Column configuration not to be checked
        //   //  //name: record.name,
        //   // }),
        // }}

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



      {/* {currentRowCPass && (
        <DetailCPass
          openModal={showDetailCPass}
          idCPass={currentRowCPass}
          closeModal={() => {
            setCurrentRowCPass(undefined);
            setShowDetailCPass(false);
          }}
        />
      )}
 */}

      {currentRowUser && (
        <DetailUser
          onDetail={showDetailUser}
          currentRowUser={currentRowUser}
          onCloseDetail={() => {
            setCurrentRowUser(undefined);
            setShowDetailUser(false);
          }}
          onReset ={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        />
      )
      }

    </>
  );
};

export default TableListAssignCPass;


