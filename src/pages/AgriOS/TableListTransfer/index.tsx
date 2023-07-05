import { customAPIAdd, customAPIGet } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Input, Form, Tooltip, Col, Row, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import "./styles.css";
import DialogTransfer from '../components/DialogTransfer';
import configText from '@/locales/configText';
import { MdCurrencyExchange, MdOutlineCompareArrows } from 'react-icons/md';
const configDefaultText = configText;

const { Text } = Typography;


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

    console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    confirm({
      closeDropdown: false,
    });
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,
      //close 
    }: any) => (
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
          setTypeConvert(false);
          form.resetFields();
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
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='Số dư ProduceAle' />,
      title: configDefaultText['page.transfer.column.produceAle'],
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle.toLocaleString();
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.promoAle' defaultMessage='Số dư PromoAle' />,
      title: configDefaultText['page.transfer.column.promoAle'],
      dataIndex: 'promoAle',
      valueType: 'textarea',
      key: 'promoAle',
      renderText: (_, text: any) => {
        return text?.promoAle.toLocaleString();
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
            <Tooltip title={configDefaultText['page.transfer.transfer']}> <MdOutlineCompareArrows
              style={{
                fontSize: 20,
              }}
              onClick={() => {
                setShowDialog(true);
                setCurrentRowUser(text);

              }}
            /></Tooltip>
          </>,
          <>
            <Tooltip title={configDefaultText['page.transfer.transferProduceAle']}> <MdCurrencyExchange
              style={{
                fontSize: 20,
                paddingLeft: 5,
                // color: '#66FFFF'
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
        scroll={{
          x: window.innerWidth * 0.8
        }}

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
          if (convertAle !== 0) {
            if (values.method === 2) {
              /// transfer produceAle to Ale

              confirm({
                senderId: currentRowUser?.id,
                produceAle: convertAle
              }, `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn chuyển ${convertAle} ProduceAle sang  ${convertAle * rateConvert?.ratePromo}  Ale không?`, 'transactions/transfer-promo-admin');
            }
            else {
              /// transfer produceAle to PromoAle
              confirm({
                senderId: currentRowUser?.id,
                produceAle: convertAle
              }, `Aleger ${currentRowUser.fullname ? currentRowUser.fullname : currentRowUser.username} - ${currentRowUser.id}: Chắc chắn chuyển ${convertAle} ProduceAle sang ${convertAle} Ale không?`, 'transactions/transfer-ale-admin');
            }


            return true
          }

        }}

        submitter={{
          searchConfig: {
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['buttonUpdate'],
          },
        }}
      >

        <Text style={{ fontWeight: 'bolder', color: 'red' }}> 1 ProduceAle = {typeConvert === true ? `${rateConvert?.ratePromo} PromoAle` : '1 Ale'}</Text>
        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
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
              }}
              name='method'
              required
              label={configDefaultText['page.transfer.method']}
              placeholder={configDefaultText['page.transfer.method']}
            />
          </Col>
        </Row>


        <Row gutter={24} className="m-0">
          <Col span={24} className="gutter-row p-0" >
            <ProFormDigit
              label={configDefaultText['page.transfer.produceAle']}
              name="ale"
              min={1}
              max={currentRowUser?.produceAle}
              placeholder={configDefaultText['page.transfer.produceAle']}
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
              required
            />
          </Col>
        </Row>

        {
          typeConvert === true ? (
            <>
              <Row gutter={24} className="m-0">
                <Col span={24} className="gutter-row p-0" >
                  <ProFormText
                    placeholder={configDefaultText['page.transfer.rePromoAle']}
                    label={configDefaultText['page.transfer.rePromoAle']}
                    name="promoAle"
                    disabled
                    fieldProps={{
                      value: convertAle * rateConvert?.ratePromo,
                    }}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={24} className="m-0">
              <Col span={24} className="gutter-row p-0" >
                <ProFormText
                  placeholder={configDefaultText['page.transfer.reAle']}
                  label={configDefaultText['page.transfer.reAle']}
                  name="ale"
                  disabled
                  fieldProps={{
                    value: convertAle,
                  }}
                />   </Col>
            </Row>
          )
        }
      </ModalForm>

    </>
  );
};

export default TableListAssignCPass;


