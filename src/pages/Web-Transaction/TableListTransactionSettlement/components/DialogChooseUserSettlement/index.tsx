import { customAPIGet } from '@/services/ant-design-pro/api';
import {  SearchOutlined, TranslationOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Space, Input, Tooltip, } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
import SettlementCPassModal from '../SettlementMegaCancel';
import configText from '@/locales/configText';
import { MdOutlineAdd } from 'react-icons/md';
const configDefaultText = configText;










const DialogTransfer = (props: any) => {
  const actionRef = useRef<ActionType>();
  // const [showTransfer, setShowTransfer] = useState<boolean>(false);


  const searchInput = useRef(null);

   const [currentUserSettlementCancel, setCurrentUserSettlementCancel] = useState<any>();
 const [showRegisteringSettlementCancel, setShowRegisteringSettlementCancel] = useState<boolean>(false);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);

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






  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: configDefaultText['page.transfer.column.aleger'],
      // title: <FormattedMessage id='pages.se archTable.column.cPass' defaultMessage=' Aleger(AlegerID, SĐT, Email, CCCD/Hộ chiếu)' />,

      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            <a
              onClick={() => {
              }}>
              {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
            </a><br /> {entity?.phone}{`${entity?.email ? `|${entity?.email}` : null}`}
            <br /> CCCD/HC: {entity?.passport}
          </>
        );
      },


    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      title: configDefaultText['page.transfer.column.totalMegaCPass'],
      dataIndex: 'totalCPass',
      valueType: 'textarea',
      key: 'totalCPass',
      renderText: (_, text: any) => {
        return text?.totalMegaCPass;
      }
    },
   

    {
      title: <FormattedMessage id='pages.searchTable.column.config' defaultMessage='Thao tác' />,
      dataIndex: 'config',
      valueType: 'textarea',
      key: 'config',
      render: (_, text: any) => {
        return [
          <>
            <Tooltip title={configDefaultText['page.settlementMegaCancel.column.settlement']} > <MdOutlineAdd
              style={{
                fontSize: 20
              }}
              onClick={() => {
                //setShowTransfer(true);
                setShowRegisteringSettlementCancel(true);
                setCurrentUserSettlementCancel(text?.id);
              }}
            /></Tooltip>
          </>,
        ]
      }
    },
  ];



  return (
    <>

      <ModalForm
        open={props.openModal}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            props.onCloseModal();
          },
        }}
        submitTimeout={2000}
        submitter={false}
      >
        <ProTable
          headerTitle={configDefaultText['page.listSettlement.modal.registeringSettlementCancel']}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={

            (entity) => {
              return 'user'
            }
          }

          request={async () => {
            const data = await customAPIGet({}, 'users/aleger');
            return {
              data: data.data,
              success: true,
              total: data.data.length
            };
          }}

          columns={columns}

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
      </ModalForm>

      {currentUserSettlementCancel && (
         <SettlementCPassModal
         openModal={showRegisteringSettlementCancel}
         userId={currentUserSettlementCancel}
         onCloseModal={() => {
           setCurrentUserSettlementCancel(undefined);
           setShowRegisteringSettlementCancel(false);
           if (actionRef.current) {
             actionRef.current.reload();
           }
         }}
       />)
      }

    </>
  );
};

export default DialogTransfer;


