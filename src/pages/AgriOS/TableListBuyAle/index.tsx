import { customAPIAdd, customAPIGet } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined, TransactionOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormMoney, } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, } from '@umijs/max';
import { Button, Typography, message, Modal, Space, Input, Form, Tooltip, Row, Col } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";

const { Text, } = Typography;



const handleAdd = async (fields: any, api: string) => {
  const hide = message.loading('Đang đặt mua');
  try {
    const updateTransaction = await customAPIAdd(
      {
        ...fields
      },
      api,
    );
    hide();
    if (updateTransaction) {
      message.success('Đặt mua thành công');
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
  // const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  //const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [convertAle, setConvertAle] = useState<number>(0);
  //const [typeConvert, setTypeConvert] = useState<boolean>(false);
  const [form] = Form.useForm<any>();
  const [rateConvert, setRateConvert] = useState<any>();

  //const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');

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
      console.log(record);
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
          // setTypeConvert(false);

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
      title: <FormattedMessage id='pages.searchTable.column.availableBalance' defaultMessage='Số dư Ale đặt cọc' />,
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.aleDeposit;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số lần mua' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.recharge;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Tổng Ale đã mua | VNĐ qui đổi' />,
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return `${text?.quantityAleRecharge} | ${text?.exchangeVnd}`;
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
            <Tooltip title="Mua ale">
              <TransactionOutlined
                style={{
                  fontSize: 20,
                  paddingLeft: 5,
                  color: '#66FFFF'
                }}
                onClick={() => {
                  setShowModal(true);
                  setCurrentRowUser(text);
                }}
              />
            </Tooltip>
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
          const data = await customAPIGet({}, 'users/aleger/get/buy-ale');
          setRateConvert(data?.data.rate);
          return {
            data: data?.data?.user,
            success: true,
            total: data?.data?.user.length
          };
        }}
        
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
           next_page: 'Trang sau',
           prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            console.log(range);
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}
      />

      <ModalForm
        title='Mua Ale'
        open={showModal}
        form={form}
        width={'30vh'}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowModal(false);
            //setTypeConvert(false);
            setConvertAle(0);
          },
        }}
        onFinish={async () => {
          confirm({
            senderId: currentRowUser?.id,
            ale: convertAle
          },
            `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn thực hiện mua ${convertAle} Ale?`,
            'transactions/buy-ale-admin');
          form.resetFields();

          return true
        }}
      >
        <Text style={{ fontWeight: 'bolder', color: 'red' }}> 1 Ale = {rateConvert?.rateAle} VNĐ</Text>

        <br />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormMoney
              className='w-full'
              label="Nhập giá trị Ale muốn mua"
              name="ale"
              min={1}
              customSymbol='A'
              placeholder='Ale'
              fieldProps={{
                value: convertAle,
                onChange: (e: any) => {
                  setConvertAle(e);
                }
              }}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id='pages.buyAle.required.ale'
                      defaultMessage='Yêu cấu nhập số lượng'
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormMoney
              className='w-full'
              label={<FormattedMessage
                id='pages.buyAle.ale'
                defaultMessage='Yêu cấu nhập số lượng'
              />}
              name="ale"
              min={1}
              customSymbol='VNĐ'
              placeholder='VNĐ'
              fieldProps={{
                value: convertAle * rateConvert?.rateAle,
                onChange: (e: any) => {
                  if (e > 10000) {
                    const roundedValue = Math.round(e / 1000) * 1000;
                    setConvertAle(roundedValue / rateConvert?.rateAle);
                  }
                  else {
                    setConvertAle(e / rateConvert?.rateAle);
                  }
                }
              }}
            />
          </Col>
        </Row>





      </ModalForm>

    </>
  );
};

export default TableListAssignCPass;


