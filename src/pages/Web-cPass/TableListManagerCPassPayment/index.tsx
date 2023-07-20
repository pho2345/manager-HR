import {
  customAPIGetOne,
  customAPIUpdateMany,
  customAPIAdd
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined, } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProFormSelect,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, Checkbox, Col, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;
import "./styles.css";
import { MdOutlineCurrencyExchange, MdOutlinePaid } from 'react-icons/md';
import DetailCPass from '@/pages/AgriGate/TableListCPass/components/DetailCPass';
import DetailUser from '@/pages/components/DetailUser';


const handleCreate = async (fields: any, api: any) => {
  const hide = message.loading('Đang tạo...');
  try {

    const updateTransaction = await customAPIAdd(
      { ...fields },
      api,
    );

    hide();
    if (updateTransaction) {
      message.success('Thành công');

    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);

    return false;
  }
};

const handleUpdate = async (fields: any, api: any, value: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {

    const updateTransaction = await customAPIUpdateMany(
      { ...fields },
      api,
      value
    );

    hide();
    if (updateTransaction) {
      message.success('Cập nhật thành công');

    }
    return true;
  } catch (error: any) {
    hide();
    message.error(error?.response?.data?.error?.message);

    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const refTransaction = useRef<any>();
  const params = useParams<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const confirm = (entity: any, message: any, api: string, types: any) => {
    Modal.confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdate({
          ...entity
        }, api, types);
        if (actionRef.current) {
          //actionRef.current.reload();
          actionRef.current?.reloadAndRest?.();
        }
      }
    });
  };



  useEffect(() => {
    const getValues = async () => {
    };
    getValues();
  }, []);


  const searchInput = useRef(null);

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
      if (dataIndex === 'user') {
        if (record.sender['id'] && record.sender['id'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.sender['id'].toString().toLowerCase().includes(value.toLowerCase());
        }
        if (record.sender['username'] && record.sender['username'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.sender['username'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record.sender['email'] && record.sender['email'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.sender['email'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record.sender['phone'] && record.sender['phone'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.sender['phone'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record.sender['passport'] && record.sender['passport'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.sender['passport'].toString().toLowerCase().includes(value.toLowerCase());
        }
      }

      if (dataIndex === 'cPass') {

      } if (record.c_pass['code'] && record.c_pass['code'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record.c_pass['code'].toString().toLowerCase().includes(value.toLowerCase());
      }

      return null;
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {

      }
    },
  });


  const columns: ProColumns<any>[] = [
    {
      title: configDefaultText['page.ManagerCPass.column.mega'],
      key: 'code',
      width: '30vh',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('user'),
      render: (_, entity: any) => {
        return (
          <><a
            onClick={() => {
              setCurrentUser(entity?.sender.id);
              setShowDetailUser(true);
            }}>
            {entity?.sender?.fullname ? entity?.sender?.fullname : entity?.sender?.username}-{entity?.sender?.id}
          </a><br />{entity?.sender.phone}{entity?.sender.phone && entity.sender?.email ? `|` : ''}{entity?.sender.email}
            <br />{entity?.sender.passport ? `CCCD/HC:${entity?.sender.passport}` : ``}
          </>
        );
      },
    },


    {
      title: configDefaultText['page.ManagerCPass.column.ale'],
      width: 60,
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => {
        return text?.aleWallet.ale.toLocaleString()
      }
    },

    {
      title: configDefaultText['page.ManagerCPass.column.availableAle'],
      width: 60,
      dataIndex: 'availableAle',
      valueType: 'textarea',
      key: 'availableAle',
      renderText: (_, text: any) => {
        return text?.aleWallet.availableBalance.toLocaleString()
      }
    },


    {
      title: configDefaultText['page.ManagerCPass.column.cPassBuy'],
      dataIndex: 'cPassBuy',
      valueType: 'textarea',
      key: 'cPassBuy',
      renderText: (_, text: any) => {
        return text?.cPassBuy
      }
    },
    {
      title: configDefaultText['page.ManagerCPass.column.cpass'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      ...getColumnSearchProps('cPass'),
      render: (_, text: any) => {
        return (<a
          onClick={() => {
            setCurrentRow(text?.c_pass.id);
            setShowDetail(true);
          }}
        >
          {text?.c_pass?.code}
        </a>)
      }
    },
    {
      title: configDefaultText['page.ManagerCPass.column.pZero'],
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.pZero.toLocaleString()}
        </>)
      }
    },
    {
      title: configDefaultText['page.ManagerCPass.column.vs'],
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.vs.toLocaleString()}
        </>)
      }
    },

    {
      title: configDefaultText['page.ManagerCPass.column.vZero'],
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.vZero.toLocaleString()}
        </>)
      }
    },


    {
      title: configDefaultText['page.ManagerCPass.column.megaS'],
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => {
        return (<>
          {text?.c_pass?.megaS.toLocaleString()} <Checkbox disabled checked={(text?.status === 'done' && text?.method === 'vnd') || text?.status === 'inProgress'} /> | {text?.c_pass?.price.toLocaleString()} <Checkbox disabled checked={text?.status === 'done' && text?.method === 'ale'} />
        </>)
      }
    },


    {

      title: configDefaultText['page.ManagerCPass.column.statusTransaction'],
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'vZero',
      render: (_, text: any) => {
        let status;
        switch (text?.status) {
          case 'waitConfirm':
            status = text?.colorStatusTransaction?.name
            break;
          case 'inProgress':
            status = `Đã thanh toán bằng VNĐ, Chờ xác nhận`
            break;
          case 'done':
            if (text?.method === 'vnd') {
              status = `Đã thanh toán bằng VNĐ`;
            }
            else {
              status = `Đã thanh toán bằng Ale`;

            }
            break;
          default:
            break;
        }
        return <span style={{
          color: text?.colorStatusTransaction?.color || 'black'
        }}>{status}</span>;
      }
    },

    {
      title: configDefaultText['page.ManagerCPass.column.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        let button = [];
        if (entity?.status === 'done' && entity?.c_pass.statusTransaction === 'open') {
          button.push(

            <Tooltip title={configDefaultText['refund']}>
              <Button
                onClick={() => {
                  handleModalOpen(true);
                  refTransaction.current = entity.id
                }}
                icon={
                  <MdOutlineCurrencyExchange/>
                }
                style={{
                  border: 'none'
                }}
              />
              
            </Tooltip>);
        }

        if ((entity?.status === 'waitConfirm' || (entity?.status === 'inProgress' && entity?.method === 'vnd')) && entity?.ale <= entity?.aleWallet?.availableBalance) {

          button.push(<>
            <Tooltip title={configDefaultText['pay']}>
              <Button
                onClick={() => {
                  confirm({
                    transaction: [entity.id]
                  }, <>{configDefaultText['page.ManagerCPass.column.textConfirmPay']} <strong>{entity.c_pass.code} </strong>bằng Ale không?</>, 'transactions/payale', '');
                }}

                style={{
                  border: 'none'
                }}

                icon={
                  <MdOutlinePaid />
                }
              />
            </Tooltip>
          </>)
        }
        return (<>{button}</>);
      },
    },


  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={'Quản lý'}
        scroll={{
          x: window.innerWidth * 0.7
        }}
        actionRef={actionRef}
        rowKey='id'
        rowClassName={(record) => {
          if (record?.status === 'done') {
            return 'payCPass'
          }
          else {
            return ''
          }
        }}

        search={false}
        toolBarRender={() => [

        ]}
        request={async () => {
          const data = await customAPIGetOne(params?.id, 'transactions/find-c-pass-payment',);
          return {
            data: data,
            success: true,
            total: data?.length
          }
        }
        }
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
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {`${configDefaultText['chosen']} `}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              {`${configDefaultText['selectedItem']} `}
            </div>
          }
        >
          <Button
            onClick={async () => {
              let text = '';
              const transaction = selectedRowsState.map((e: any, index: number) => {
                text += index === 0 ? e?.c_pass?.code : `, ${e?.c_pass?.code}`;
                return e?.id
              })
              confirm({
                transaction: transaction
              }, `Chắc chắn muốn thanh toán MegaS của cPass: ${text} bằng Ale không?`, 'transactions/payale', '');
              setSelectedRows([]);
            }}
          >
            {configDefaultText['pay']}
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        open={createModalOpen}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        width={window.innerWidth * 0.2}
        submitTimeout={2000}
        onFinish={async (values) => {
          const refund = await handleCreate({
            types: values.method, transaction: [refTransaction.current]
          }, 'transactions/refund/create');
          if (refund) {
            handleModalOpen(false);
            form.resetFields();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          return true;
        }}

        submitter={{
          searchConfig: {
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },
        }}
      >

        <Row gutter={24} className='m-0'>
          <Col span={24} className='gutter-row p-0' >
            <ProFormSelect
              label={configDefaultText['page.ManagerCPass.methodRefund']}
              className='w-full'
              placeholder={configDefaultText['page.ManagerCPass.methodRefund']}
              name='method'
              options={[
                {
                  label: 'VNĐ',
                  options: [
                    { label: 'Ví điện tử', value: 'vnd' },
                    { label: 'Ngân hàng', value: 'vnd' },
                  ],
                },
                {
                  label: 'Ale',
                  value: 'ale'
                },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>



      {currentRow && <DetailCPass
        openModal={showDetail}
        cPassId={currentRow}
        closeModal={() => {
          setShowDetail(false);
          setCurrentRow(undefined);
        }}
      />}

      {
        currentUser && <DetailUser
          currentRowUser={currentUser}
          onDetail={showDetailUser}
          onCloseDetail={() => {
            setShowDetailUser(false);
          }}
        />
      }

    </PageContainer>
  );
};

export default TableList;
