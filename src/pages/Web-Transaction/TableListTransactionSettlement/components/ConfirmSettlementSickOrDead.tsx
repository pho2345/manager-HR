import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import { customAPIAdd } from '@/services/ant-design-pro/api';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage } from '@umijs/max';
import { Button, Space, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import configText from '@/locales/configText';
const configDefaultText = configText;


const handleCreate = async (fields: any, api: string) => {
  const hide = message.loading('Đang xử lý...');
  
  try {
    const createTransaction = await customAPIAdd(
      {
        ...fields
      }, api);
    hide();
    if (createTransaction) {
       message.success(createTransaction.message);
       return true;
    }
    
  } catch (error: any) {
    hide();
    message.error(error?.response.data.error.message);
    return false;
  }
};

// const handleUpdateMany = async (fields: any, api: string, id: any) => {
//   const hide = message.loading('Đang cập nhật...');
//   try {
//     const updateTransaction = await customAPIUpdateMany(
//       fields,
//       api,
//       id);
//     hide();
//     if (updateTransaction) {
//       message.success('Cập nhật thành công');
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Cập nhật thất bại!');
//     return false;
//   }
// };







const ConfirmRegisteringSettlement: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [showModalMethod, setShowModalMethod] = useState<boolean>(false);

  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
    //setSearchText(selectedKeys[0]);
    //setSearchedColumn(dataIndex);
    //console.log('selectedKeys',selectedKeys[0] );
  };
  const handleReset = (clearFilters: any) => {
    clearFilters();
   // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm thẻ tai`}
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
            Tìm
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
    onFilter: (value:any, record: any) =>{
      if(record[dataIndex]){
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
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






  const columnCPass: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      key: 'code',
      dataIndex: 'code',
      // title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='cPass' />,
      title: configDefaultText['page.listFair.column.c_passes'],
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        return (
          // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRowCPass(entity?.id);
              setShowDetailCPass(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>

        );
      },
    },

    {
      title: configDefaultText['fair'],
      key: 'fair',
      dataIndex: 'fair',
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRowFair(entity.fairId);
              setShowDetailFair(true);
            }}
          >{entity?.fair}</a>
        );
      },
    },
    {
      title: configDefaultText['page.confirmSettlementDeadOrSick.column.owner'],
      dataIndex: 'owner',
      valueType: 'textarea',
      key: 'owner',
      render: (_, text: any) => {
        return (<> <a
          onClick={() => {
            setCurrentRowUser(text?.owner?.id);
            setShowDetailUser(true);
          }}
        >{text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username}-{text?.owner?.id}</a></>)
      },
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Snow</>} />,
      title: configDefaultText['page.confirmSettlementDeadOrSick.column.slot'],
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) => {
        return `S${text?.slotNow}`;
      },
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br />Pnow<br />(kg)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.pZero']}<br/> {configDefaultText['page.listSettlement.column.pNow']} </>,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',

      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`,

    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.refundVs' defaultMessage={<>Hoàn trả Vs(VNĐ)</>} />,
      title: configDefaultText['page.confirmSettlementDeadOrSick.column.refundVs'],
      dataIndex: 'refundVs',
      valueType: 'textarea',
      key: 'refundVs',
      renderText: (_, text: any) => {
        if (text?.checkRefund) {
          return text?.vs;
        }
        else {
          return `N/A`;
        }
      }
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage={<>MegaΔP(kg)<br />ProduceAle</>} />,
      title: <>{configDefaultText['page.listSettlement.column.megaDeltaP']}<br/> {configDefaultText['page.DetailAleger.column.produceAle']} </>,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => `${text?.megaDeltaWeight}/${text?.produceAle}`
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={<>MegaP (kg)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.megaP']}</>,
      dataIndex: 'megaP',
      valueType: 'textarea',
      key: 'megaP',
      renderText: (_, text: any) => text?.megaP
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.megaE']}</>,
      dataIndex: 'megaE',
      valueType: 'textarea',
      key: 'megaE',
      renderText: (_, text: any) => text?.megaE
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
        onFinish={async () => {
          setShowModalMethod(true);
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
        submitTimeout={2000}
        width='90vh'
        
      >
        <ProTable
          headerTitle={configDefaultText['page.confirmSettlementDeadOrSick.column.titleConfirm']}
          pagination={false}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowSelection={false}
          rowClassName={
            (entity) => {
              return entity.classColor
            }
          }

          toolbar={{
            settings:[{
              key: 'reload',
              tooltip: configDefaultText['reload'],
              icon: <ReloadOutlined />,
              onClick:() => {
                if (actionRef.current){
                  actionRef.current.reload();
                }
              }
            }]
          }}


          // request={async () => {
          //   const data = await customAPIGetOne(8, 'c-passes/get/cpass-of-mega', {});
          //   setUserSettlement(data?.user);
          //   //console.log('usersss', data);

          //   return {
          //     data: data?.cPass,
          //     success: true,
          //     total: 0
          //   }
          // }}
          columns={columnCPass}
          dataSource={props.cPass}

        />
        {currentRowCPass && (
          <DetailCPass
            openModal={showDetailCPass}
            idCPass={currentRowCPass}
            closeModal={() => {
              setCurrentRowCPass(undefined);
              setShowDetailCPass(false);
            }}
          />
        )}

        {currentRowFair && (
          <DetailFair
            openModal={showDetailFair}
            fairId={currentRowFair}
            closeModal={() => {
              setCurrentRowFair(undefined);
              setShowDetailFair(false);
            }}
          />)
        }

        {currentRowUser && (
          <DetailUser
            onDetail={showDetailUser}
            currentRowUser={currentRowUser}
            onCloseDetail={() => {
              setCurrentRowUser(undefined);
              setShowDetailUser(false);
            }}
          />
        )
        }
      </ModalForm>

      <ModalForm
        title='Chọn PTTT'
        open={showModalMethod}
        //form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setShowModalMethod(false);
          },
        }}
        width={400}
        submitTimeout={2000}
        onFinish={async (values: any) => {
          
          const cPass = props?.cPass.map((e: any) => e.id);
          const success = await handleCreate(
          {
            "cPass" : cPass,
            'method': values.method || 'ale'
        }, 'transactions/settlement/sick-or-dead');
      
        if (success) {
          props.onCloseModal();
        }
         
          actionRef.current?.reloadAndRest?.();

          return true;
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
            // submitText: <FormattedMessage id='buttonUpdate' defaultMessage='Cập nhật' />,
            resetText: configDefaultText['buttonClose'],
            submitText: configDefaultText['submit'],
          },
        }}
      >

        <ProFormSelect

          name='method'
          fieldProps={{
            defaultValue: 'ale'
          }}
          options={[
            {
              label: 'Ale',
              value: 'ale'
            },
            {
              label: 'VNĐ',
              value: 'cash'
            },
          ]}
        />

      </ModalForm>
    </>
  );
};

export default ConfirmRegisteringSettlement;


