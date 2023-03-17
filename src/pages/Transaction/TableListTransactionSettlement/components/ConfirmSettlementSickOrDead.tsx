import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import { customAPIUpdateMany, customAPIAdd } from '@/services/ant-design-pro/api';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, message, Space, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// import DetailCPass from '../components/DetailCPass';
// import DetailUser from '../components/DetailUser';



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







const ConfirmRegisteringSettlement: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);



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





  useEffect(() => {
    const fetchDataFair = async () => {
    }
    fetchDataFair();
  }, []);


  const columnCPass: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='cPass' />,
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
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
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
      title: (
        <>Mega <br />sở hữu</>
      ),
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
      title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Snow</>} />,
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) => {
        return `S${text?.slotNow}`;
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br />Pnow<br />(kg)</>} />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',

      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`,

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.refundVs' defaultMessage={<>Hoàn trả Vs(VNĐ)</>} />,
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
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage={<>MegaΔP(kg)<br />ProduceAle</>} />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => `${text?.megaDeltaWeight}/${text?.produceAle}`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={<>MegaP (kg)</>} />,
      dataIndex: 'megaP',
      valueType: 'textarea',
      key: 'megaP',
      renderText: (_, text: any) => text?.megaP
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
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
          const cPass = props?.cPass.map((e: any) => e.id);
          const success = await customAPIAdd(
            {
              "cPass": cPass,
              "userId": 8,
              "method": "vnd"
            }, 'transactions/settlement/create');
          if (success) {
            props.onCloseModal();
          }
          return true;
        }}

        submitTimeout={2000}

        width='90vh'
      >
        <ProTable
          headerTitle={(<>
            Đăng ký Thanh quyết toán cho các cPass bệnh chết sau:
          </>)}
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
    </>
  );
};

export default ConfirmRegisteringSettlement;


