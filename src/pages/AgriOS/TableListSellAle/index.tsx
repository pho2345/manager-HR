import { customAPIAdd, customAPIDowload, customAPIDowloadPDF, customAPIGet } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormMoney, ProFormSelect } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, } from '@umijs/max';
import { Button, Typography, message, Modal, Space, Input, Form, Tooltip, Col, Row } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
import configText from '@/locales/configText';
const configDefaultText = configText;
import { AiOutlineLine } from "react-icons/ai";
const { Text, } = Typography;
// function delay(time: number) {
//   return new Promise((resolve: any) => {
//     setTimeout(resolve, time);
//   });
// }



const handleAdd = async (fields: any, api: string) => {
  const hide = message.loading('Đang đặt bán');
  try {
    const updateTransaction = await customAPIAdd(
      {
        ...fields
      },
      api,
    );
    if (updateTransaction) {
      message.success('Đặt bán thành công');
    }
    hide();
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};






const TableListAssignCPass = () => {
  const actionRef = useRef<ActionType>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [convertAle, setConvertAle] = useState<number>(0);
  const [form] = Form.useForm<any>();
  const [rateConvert, setRateConvert] = useState<any>();
  const [convertVnd, setConvertVnd] = useState<number>(0);

  //const [searchText, setSearchText] = useState('');
  //const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    //console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    //setSearchText('');
    confirm({
      closeDropdown: false,
    });
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
      title: configDefaultText['titleConfirm'],
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
          setConvertVnd(0);

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
            <a
              onClick={() => {
                setCurrentRowUser(entity?.id);
                //setShowDetailUser(true);
              }}>
              {entity?.fullname ? entity?.fullname : entity?.username}-{entity?.id}
            </a><br /> {entity?.phone}{entity?.phone && entity.email ? `|` : ''}{entity?.email}
            <br /> {entity?.passport ? `CCCD/HC:${entity?.passport}` : ``}
          </>
        );
      },
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Tài khoản thanh toán' />,
      title: configDefaultText['page.sellAle.column.payment'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {
        return null;
      }
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
      // title: <FormattedMessage id='pages.searchTable.column.availableBalance' defaultMessage='Số dư Ale đặt cọc' />,
      title: configDefaultText['page.transfer.column.aleDeposit'],
      dataIndex: 'availableBalance',
      valueType: 'textarea',
      key: 'availableBalance',
      renderText: (_, text: any) => {
        return text?.aleDeposit.toLocaleString();
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số lần bán' />,
      title: configDefaultText['page.sellAle.column.timeSellAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.timeSellAle.toLocaleString();
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Tổng Ale đã bán | VNĐ qui đổi' />,
      title: configDefaultText['page.sellAle.column.totalBuyAndConvert'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return `${text?.totalSellAle.toLocaleString()} | ${text?.totalVnd.toLocaleString()}`;
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
            <Tooltip title={configDefaultText['page.sellAle.tooltip.sellAle']}>
              <AiOutlineLine
                style={{
                  fontSize: 20,
                  paddingLeft: 5,

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


  const handleFeeTransaction = (value: number) => {
    let rateFee;
    for (let i = 0; i < rateConvert.feeTransaction.length; i++) {
      let e = rateConvert.feeTransaction[i];

      if (value > e?.rangeFrom && value < e?.rangeTo && e?.rangeFrom === 0 && e?.typeValue === 'lesser') {
        rateFee = e;
        break;
      }

      if (value >= e?.rangeFrom && value <= e?.rangeTo && e?.typeValue === 'range') {
        rateFee = e;
        break;
      }

      if (value > e?.rangeFrom && e?.rangeTo === 0 && e?.typeValue === 'greater') {
        rateFee = e;
        break;
      }
    }

    let priceVnd = 0, fee;
    console.log('rateFee', rateFee);

    switch (rateFee.types) {
      case 'free':
        fee = 0;
        priceVnd = rateConvert?.rateAle * value;
        break;
      case 'cash':
        priceVnd = rateConvert?.rateAle * value - rateFee.valueFee;
        fee = rateFee.valueFee;
        break;
      case 'percent':
        priceVnd = rateConvert?.rateAle * value;
        fee = Math.round((priceVnd * rateFee.valueFee / 100) / 1000) * 1000;
        // fee = (priceVnd * rateFee.valueFee / 100);
        priceVnd = priceVnd - fee;
        break;
      default:
        break;
    }

    setConvertVnd(priceVnd);
  }


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
          const data = await customAPIGet({}, 'users/aleger/get/sell-ale');
          setRateConvert(
            data?.data.rate,

          );
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
                await customAPIDowload('users/sell-ale/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,

            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('users/sell-ale/pdf');
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
            // <Tooltip title='Tải lại'><ReloadOutlined style={{fontSize: '100%' }}   key="re"  /></Tooltip>
          ]
        }}
      />

      <ModalForm
        title='Bán Ale'
        open={showModal}
        form={form}
        width={300}

        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowModal(false);
            setConvertAle(0);
          },
        }}
        submitter={{
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },


        }}
        onFinish={async () => {
          confirm({
            senderId: currentRowUser?.id,
            ale: convertAle
          },
            `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn thực hiện bán ${convertAle} Ale?`,
            'transactions/sell-ale-admin');
          return true
        }}


      >


        <Text style={{ fontWeight: 'bolder', color: 'black' }}> 1 Ale = {rateConvert?.rateAle.toLocaleString()} VNĐ,</Text> <br />

        {rateConvert?.fee &&
          rateConvert?.fee.map((value: any, index: any) => {
            return (<> <Text style={{ fontWeight: 'bolder', color: 'black' }} key={index}>{value?.text} {value?.value}</Text> <br /></>)
          })
        }

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              label={configDefaultText['page.sellAle.ale']}
              name="ale"
              min={1}
              max={currentRowUser?.availableBalance}
              placeholder='Ale'
              fieldProps={{
                onChange: (e: any) => {
                  console.log(e);
                  if (typeof e !== 'undefined') {
                    setConvertAle(e);
                    handleFeeTransaction(e)
                  }
                  else {
                    setConvertVnd(0)
                  }

                },
                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                precision: 2

              }}
              rules={[
                {
                  required: true,
                  message: configDefaultText['page.sellAle.required.ale']
                  // (
                  //   <FormattedMessage
                  //     id='pages.sellAle.required.ale'
                  //     defaultMessage='Vui lòng nhập Ale'
                  //   />
                  // ),
                }
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormSelect options={[
              {
                value: 1,
                label: 'Ngân hàng'
              },
              {
                value: 2,
                label: 'Ví điện tử'
              }
            ]}
              placeholder={configDefaultText['methodPayment']}
              width='md' name='method' label={configDefaultText['methodPayment']}
              rules={[
                {
                  required: true,
                  message: configDefaultText['methodPayment.required']
                  //  (
                  //   <FormattedMessage
                  //     id='pages.sellAle.required.methodPayment'
                  //     defaultMessage='Chọn PTTT'
                  //   />
                  // ),
                }
              ]}
            />
          </Col>
        </Row>

        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormMoney
              label="Số tiền nhận được:"
              name="ale"
              min={1}
              disabled
              customSymbol='VNĐ'
              placeholder='ProduceAle'
              fieldProps={{
                value: convertVnd
              }}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default TableListAssignCPass;


