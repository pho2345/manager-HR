import {
  customAPIGetOne,
  customAPIUpdateMany,
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
import { Button, Checkbox, Form, Input, message, Modal, Space, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;
import "./styles.css";
import { MdOutlineCurrencyExchange, MdOutlinePaid } from 'react-icons/md';



const handleUpdate = async (fields: any, api: any, value: any) => {
  //console.log('fields', fields);
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
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [form] = Form.useForm<any>();
  const refTransaction = useRef<any>();
  const params = useParams<number>();

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

    console.log('selectedKeys', selectedKeys[0]);
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    // setSearchText('');
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
    if(dataIndex === 'user'){
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

    if(dataIndex === 'cPass'){

    }if (record.c_pass['code'] && record.c_pass['code'].toString().toLowerCase().includes(value.toLowerCase())) {
        return record.c_pass['code'].toString().toLowerCase().includes(value.toLowerCase());
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
      // title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      title: configDefaultText['page.ManagerCPass.column.mega'],
      key: 'code',
      width: '30vh',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('user'),
      render: (_, entity: any) => {
        return (
          <><a
            onClick={() => {
              setCurrentRow(entity?.id);
              setShowDetail(true);
            }}>
            {entity?.sender?.fullname ? entity?.sender?.fullname : entity?.sender?.username}-{entity?.sender?.id}
          </a><br />{entity?.sender.phone}{entity?.sender.phone && entity.sender?.email ? `|` : ''}{entity?.sender.email}
            <br />{entity?.sender.passport ? `CCCD/HC:${entity?.sender.passport}` : ``}
          </>
        );
      },
    },


    {
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
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
      // title: <FormattedMessage id='pages.searchTable.column.ale' defaultMessage='Số dư Ale' />,
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
      // title: <FormattedMessage id='pages.searchTable.column.cPassBuy' defaultMessage='Số cPass đã mua' />,
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
        return (<>
          {text?.c_pass?.code}
        </>)
      }
    },
    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />
      // ),
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
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />
      // ),
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
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />
      // ),
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
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS (VNĐ|Ale)' />
      // ),
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
      // title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Tùy chọn' />,
      title: configDefaultText['page.ManagerCPass.column.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        let button = [];
        if (entity?.status === 'done' && entity?.c_pass.statusTransaction === 'open') {
          button.push(
            // button.push(<><Button
            //   onClick={() => {
            //     handleModalOpen(true);
            //     refTransaction.current = entity.id
            //   }}
            // >{configDefaultText['refund']}</Button>


            <Tooltip title={configDefaultText['refund']}>
              <MdOutlineCurrencyExchange
                style={{
                  fontSize: 20
                }}
                onClick={() => {

                  handleModalOpen(true);
                  refTransaction.current = entity.id
                  // confirm({
                  //   transaction: [entity.id]
                  // }, `${configDefaultText['page.ManagerCPass.column.textConfirmRefund']} ${entity.c_pass.code} bằng Ale không?`, 'transactions/refund', '');
                }}
              />
            </Tooltip>);
        }

        if ((entity?.status === 'waitConfirm' || (entity?.status === 'inProgress' && entity?.method === 'vnd')) && entity?.ale <= entity?.aleWallet?.availableBalance) {
          console.log(
            'day', entity.id
          )
          button.push(<>
            <Tooltip title={configDefaultText['pay']}>
              <MdOutlinePaid

                style={{
                  fontSize: 20
                }}
                onClick={() => {
                  confirm({
                    transaction: [entity.id]
                  }, `${configDefaultText['page.ManagerCPass.column.textConfirmPay']} ${entity.c_pass.code} bằng Ale không?`, 'transactions/payale', '');
                }}
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
        // rowSelection={{
        //   onChange: (_, selectedRows: any) => {
        //     setSelectedRows(selectedRows);
        //   },
        //   getCheckboxProps: record => ({
        //     disabled: record?.status === 'done' && record?.c_pass.statusTransaction === 'registeringSettlement'
        //   })
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
              console.log('transaction', transaction);
              confirm({
                transaction: transaction
              }, `Chắc chắn muốn thanh toán MegaS của cPass: ${text} bằng Ale không?`, 'transactions/payale', '');
              setSelectedRows([]);
              //actionRef.current?.reloadAndRest?.();
            }}
          >
            {configDefaultText['pay']}
          </Button>
        </FooterToolbar>
      )}

      <ModalForm

        open={createModalOpen}
        //form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            handleModalOpen(false);
          },
        }}
        width={`25vh`}
        submitTimeout={2000}
        onFinish={async (values) => {
          //await waitTime(2000);
          const refund = await handleUpdate({
            data: { types: values.method, transaction: [refTransaction.current] }
          }, 'transactions/refund', null);
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
            // resetText: <FormattedMessage id='buttonClose' defaultMessage='Đóng' />,
            // submitText: <FormattedMessage id='buttonSubmit' defaultMessage='Xác nhận' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },
        }}
      >

        <ProFormSelect
          //value={method}
          style={{ width: 200 }}
          //onChange={handleChange}
          label={configDefaultText['page.ManagerCPass.methodRefund']}
          width='md'
          placeholder={configDefaultText['page.ManagerCPass.methodRefund']}
          name='method'
          options={[
            {
              label: 'VNĐ',
              options: [
                { label: 'Ví điện tử', value: '1' },
              ],
            },
            {
              label: 'Ale',
              value: 'ale'
            },
          ]}

        />

      </ModalForm>




      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
