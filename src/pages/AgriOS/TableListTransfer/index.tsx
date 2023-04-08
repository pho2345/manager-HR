import { customAPIAdd, customAPIGet } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined, TransactionOutlined, TranslationOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormMoney, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, } from '@umijs/max';
import { Button, message, Modal, Space, Input, Form, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
import DialogTransfer from '../components/DialogTransfer';

//const { Text, } = Typography;




const handleAdd = async (fields: any, api: string) => {
  const hide = message.loading('Đang chuyển đổi');
  try {
    const updateTransaction = await customAPIAdd(
      {
        ...fields
      },
      api,
    );
    hide();
    if (updateTransaction) {
      message.success('Thành công');
    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};






const TableListAssignCPass = () => {
  const actionRef = useRef<ActionType>();
  ////const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [convertAle, setConvertAle] = useState<number>(0);
  const [typeConvert, setTypeConvert] = useState<boolean>(false);
  const [form] = Form.useForm<any>();
  const [rateConvert, setRateConvert] = useState<any>();


  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
   // setSearchText('');
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


  const confirm = (entity: any, content: string, api: string) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
       await handleAdd(entity, api);

        if (actionRef.current) {
          actionRef.current.reload();
          setShowModal(false);
          setConvertAle(0);
          setTypeConvert(false);
        }
      }
    })
  }


  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
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
                setCurrentRowUser(entity?.id);
                //setShowDetailUser(true);
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
      title: <FormattedMessage id='pages.searchTable.column.availableBalance' defaultMessage='Số dư Ale khả dụng' />,
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.availableBalance;
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
            <Tooltip title={<FormattedMessage id='pages.dialogTransfer.transfer' defaultMessage='Chuyển đổi'/>}> <TranslationOutlined
              style={{
                fontSize: 30,
                color: '#00CC00'
              }}
              onClick={() => {
                setShowDialog(true);
                setCurrentRowUser(text);

              }}
            /></Tooltip>

          </>,
          <>
           <Tooltip title={<FormattedMessage id='pages.dialogTransfer.transferProduceAle' defaultMessage='Chuyển đổi ProduceAle'/>}> <TransactionOutlined
              style={{
                fontSize: 30,
                paddingLeft: 5,
                color: '#66FFFF'
              }}
              onClick={() => {
                setShowModal(true);
                setCurrentRowUser(text);
              }}

            /></Tooltip>
          </>
        ]
      }
    },
  ];



  return (
    <>
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
          return data;
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
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows: any) => {
        //     console.log(selectedRows);
        //     if (selectedRows.length > 1) {
        //       // message.er('Chỉ được chọn 1 Mega!');
        //     }

        //     //setSelectedRowsMega(selectedRows);

        //   },
        //   // getCheckboxProps: (record: any) => ({
        //   //   disabled: false, // Column configuration not to be checked
        //   //  //name: record.name,
        //   // }),
        // }}
      />

      {
        currentRowUser && <DialogTransfer
          openModal={showDialog}
          onCloseModal={() => {
            setShowDialog(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          megaChoosen={currentRowUser}

        />
      }
      <ModalForm
        open={showModal}
        form={form}
        width={300}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowModal(false);
            setTypeConvert(false);
            setConvertAle(0);
          },
        }}
        onFinish={async (values) => {
          if (values.method === 2) {
            /// transfer produceAle to Ale

            confirm({
              senderId: currentRowUser?.id,
              produceAle: convertAle
            }, `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn chuyển ${convertAle} ProduceAle sang  ${convertAle + convertAle * rateConvert?.ratePromo}  Ale không?`, 'transactions/transfer-promo-admin');
          }
          else {
            /// transfer produceAle to PromoAle
            confirm({
              senderId: currentRowUser?.id,
              produceAle: convertAle
            }, `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn chuyển ${convertAle} ProduceAle sang ${convertAle} Ale không?`, 'transactions/transfer-ale-admin');
          }
          form.resetFields();
         
          return true
        }}

        submitter={{
          searchConfig: {
            resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
          },
        }}
      >
        <ProFormSelect width='md' options={[
          {
            label: 'ProduceAle sang Ale',
            value: 1
          },
          {
            label: 'ProduceAle sang PromoAle',
            value: 2
          }
        ]}
          fieldProps={{
            defaultValue: 1,
            onChange: async (values: any) => {
              if (values === 1) {
                setTypeConvert(false)
              }
              else {
                const rate = await customAPIGet({}, 'conversionrates');
                setRateConvert(rate.data);
                setTypeConvert(true);
              }
            }
          }} required placeholder='Chọn phương thức chuyển đổi' name='method' label='Phương thức chuyển đổi' />

        <ProFormMoney
          label="Nhập giá trị ProduceAle muốn chuyển"
          name="ale"
          min={1}
          customSymbol='A'
          placeholder='ProduceAle'
          fieldProps={{
            value: convertAle,
            onChange: (e: any) => {
              setConvertAle(e);
            }
          }}
          required
        />
        {
          typeConvert === true ? (
            <>
              <ProFormText
                label="PrmoAle nhận được"
                name="promoAle"
                disabled
                fieldProps={{
                  value: convertAle + convertAle * rateConvert?.ratePromo,
                }}
              />
            </>
          ) : (
            <>
              <ProFormText
                label="Ale nhận được"
                name="ale"
                disabled
                placeholder='Ale'
                fieldProps={{
                  value: convertAle,
                }}
              />
            </>
          )
        }



      </ModalForm>

    </>
  );
};

export default TableListAssignCPass;


