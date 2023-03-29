import { customAPIAdd, customAPIGet, customAPIGetOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, SearchOutlined, TransactionOutlined, TranslationOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormMoney } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Typography, message, Modal, Space, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";
const { Text, } = Typography;


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

const handleAdd = async (fields: any, api: string) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const updateTransaction = await customAPIAdd(
      fields,
      api);
    hide();
    if (updateTransaction) {
      message.success('Thành công');
    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error.response.data.error.message);
    return false;
  }
};






const DialogTransfer = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);
  const [showTransfer, setShowTransfer] = useState<boolean>(false);


  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const params = useParams<any>();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      if (record[dataIndex]) {
        console.log('vao day');
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{

    // }

  });


  const confirm = (entity: any, message: string, api: string, id: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {

        await handleAdd({
          ...entity
        }, api);
        if (actionRef.current) {
          actionRef.current.reload();
          setShowTransfer(false); 
        }
      }
    });
  };





  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.se archTable.column.cPass' defaultMessage=' Aleger(AlegerID, SĐT, Email, CCCD/Hộ chiếu)' />,
      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            <a
              onClick={() => {
                setCurrentRowUser(entity);
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
      title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {
        return text?.ale;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số dư ProduceAle' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Số dư PromoAle' />,
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return text?.promoAle;
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
            <TranslationOutlined
              style={{
                fontSize: 30,
                color: '#00CC00'
              }}
              onClick={() => {
                setShowTransfer(true);
                setCurrentRowUser(text);
              }}
            />
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
          headerTitle='Danh sách Mega'
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={

            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            const data = await customAPIGet({}, 'users/aleger');
            const configData = data?.data.filter((e: any) => e?.id !== props?.megaChoosen?.id);
            return {
              data: configData,
              success: true,
              total: configData.length
            };
          }}

          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows: any) => {
              if (selectedRows.length > 1) {
                message.error('Chỉ được chọn 1 Mega!');
              }
              setSelectedRowsMega(selectedRows);
            },

            // getCheckboxProps: (record: any) => ({
            //   disabled: false, // Column configuration not to be checked
            //  //name: record.name,
            // }),
          }}
        />
      </ModalForm>

      { currentRowUser && (
        <ModalForm
        width={300}
        open={showTransfer}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowTransfer(false);
          },
        }}
        onFinish={async(values) => {
          console.log(props?.megaChoosen);
          confirm({
              receiverId: currentRowUser.id,
              senderId:  props?.megaChoosen?.id,
              ale: values?.ale
          },
           `Chắc chắn chuyển ${values.ale} Ale từ Aleger  ${props?.megaChoosen?.fullname ? props?.megaChoosen?.fullname : props?.megaChoosen?.username} - ${props?.megaChoosen?.id} 
           sang Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}`,
            'transactions/transfer-admin', null);

          return true;
        }}
      >
        <ProFormMoney
          label="Nhập giá trị Ale muốn chuyển"
          name="ale"
          min={1}
          max={props?.megaChoosen?.availableBalance}
          customSymbol='A'
        />
      </ModalForm>
      )}

    </>
  );
};

export default DialogTransfer;


