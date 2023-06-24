import { customAPIAdd, customAPIDowload, customAPIDowloadPDF, customAPIGet, customAPIGetFileSlotChart } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormMoney, } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, } from '@umijs/max';
import { Button, Typography, message, Modal, Space, Input, Form, Tooltip, Row, Col } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
import configText from '@/locales/configText';
import { MdAttachMoney } from 'react-icons/md';
const configDefaultText = configText;
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

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    confirm({
      closeDropdown: false,
    });
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
          placeholder={configDefaultText['search']}
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
            Tìm kiếm
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
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        const checkSuccess = await handleAdd(entity, api);

        if (actionRef.current && checkSuccess) {
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
      // title: <FormattedMessage id='pages.se archTable.column.cPass' defaultMessage=' Aleger(AlegerID, SĐT, Email, CCCD/Hộ chiếu)' />,
      title: configDefaultText['page.transfer.column.aleger'],
      ...getColumnSearchProps('id'),
      render: (_, entity: any) => {
        return (
          <>
            {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
            <br /> {entity?.phone}{entity?.phone && entity.email ? `|` : ''}{entity?.email}
            <br /> {entity?.passport ? `CCCD/HC:${entity?.passport}` : ``}
          </>
        );
      },
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
      title: configDefaultText['page.transfer.column.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {
        return text?.ale.toLocaleString();
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.availableBalance' defaultMessage='Số dư Ale khả dụng' />,
      title: configDefaultText['page.transfer.column.availableBalance'],
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.availableBalance.toLocaleString();
      }
    },
    {
      title: configDefaultText['page.transfer.column.aleDeposit'],
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.aleDeposit.toLocaleString();
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số lần mua' />,
      title: configDefaultText['page.transfer.column.recharge'],
      dataIndex: 'recharge',
      valueType: 'textarea',
      key: 'recharge',
      renderText: (_, text: any) => {
        return text?.recharge.toLocaleString();
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Tổng Ale đã mua | VNĐ qui đổi' />,
      title: configDefaultText['page.transfer.column.totalBuyAndConvert'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return `${text?.quantityAleRecharge.toLocaleString()} | ${text?.exchangeVnd.toLocaleString()}`;
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.config' defaultMessage='Thao tác' />,
      title: configDefaultText['titleOption'],
      dataIndex: 'config',
      valueType: 'textarea',
      key: 'config',
      align: 'center',
      render: (_, text: any) => {
        return [
          <>
            <Tooltip title={configDefaultText['page.transfer.tooltip.buyAle']}>
              <MdAttachMoney
                style={{
                  fontSize: 20,
                  paddingLeft: 5

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
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

        toolBarRender={() => {
          return [
            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowload('users/buy-ale/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,

            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('users/buy-ale/pdf');
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
            // <Tooltip title='Tải lại'><ReloadOutlined style={{fontSize: '100%' }}   key="re"  /></Tooltip>
          ]
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
          // form.resetFields();

          return true
        }}

        submitter={{
          // render: (_, dom) => (
          //   <div style={{ marginBlockStart: '5vh' }}>
          //     {dom.pop()}
          //     {dom.shift()}
          //   </div>
          // ),
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },
        }}
      >
        <Text style={{ fontWeight: 'bolder', color: 'red' }}> 1 Ale = {rateConvert?.rateAle.toLocaleString()} VNĐ</Text>

        <br />
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              className='w-full'
              label={configDefaultText['page.buyAle.ale']}
              name="ale"
              min={1}

              placeholder={configDefaultText['page.buyAle.ale']}
              fieldProps={{
                value: convertAle === 0 ? null : convertAle,
                onChange: (e: any) => {
                  if (typeof e !== 'undefined') {
                    setConvertAle(e);
                  }
                },
                //formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                precision: 2
              }}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.buyAle.required.ale']
                  // (
                  //   <FormattedMessage
                  //     id='pages.buyAle.required.ale'
                  //     defaultMessage='Yêu cấu nhập số lượng'
                  //   />
                  // ),
                },
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormMoney
              className='w-full'
              label={configDefaultText['page.buyAle.vnd']}
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


