import { customAPIGet, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage } from '@umijs/max';
import { Button, Typography, message, Space, Input, Checkbox } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import ConfirmRegisteringSettlementSickOrDead from './ConfirmSettlementSickOrDead';
import DetailUser from '@/pages/components/DetailUser';

// import DetailCPass from '../components/DetailCPass';
// import DetailUser from '../components/DetailUser';
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





export type SettlementCPassModal = {
  onCloseModal: () => void;
  // onSubmit: () => Promise<void>;
  openModal: boolean;
  //values: Partial<API.RuleListItem>;
}



const TableListRegisteringSettlement: React.FC<SettlementCPassModal> = (props) => {
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  // const [selectedRowsCPass, setSelectedRowsCPass] = useState<any>([]);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [showConfirmSettlement, setShowConfirmSettlement] = useState<boolean>(false);
  const [selectedRowsCPass, setSelectedRowsCPass] = useState<any>([]);
  //const [selectedRowsMega, setSelectedRowsMega] = useState<any>([]);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  // const params = useParams<any>();
  //const [userSettlement, setUserSettlement] = useState<userSettlement>();

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
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
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
          >
            {entity?.fair}

          </a>

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
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        switch (text?.bodyCondition) {
          case 'good':
            return (<Text style={{ color: '#00CC00' }}>Tốt</Text>);
          case 'malnourished':
            return (<Text>Suy dinh dưỡng</Text>);
          case 'weak':
            return (<Text style={{ color: '#FF9900' }}>Yếu</Text>);
          case 'sick':
            return (<Text style={{ color: '#FF3333' }}>Bệnh</Text>);
          case 'dead':
            return (<Text style={{ color: '#FF0000' }}>Chết</Text>)
          default:
            break;
        }
        return 'abc';
      },
      filters: true,
      onFilter: true,
      defaultFilteredValue: ['dead', 'sick'],
      valueEnum: {
        good: {
          text: 'Tốt',
          value: 'good'
        },
        malnourished: {
          text: 'Suy dinh dưỡng',
          value: 'malnourished'
        },
        weak: {
          text: 'Yếu',
          value: 'weak'
        },
        sick: {
          text: 'Bệnh',
          value: 'sick'
        },
        dead: {
          text: 'Chết',
          value: 'dead'
        },
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Tuần tuổi/Snow</>} />,
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) => {
        console.log('age', text?.age);
        let age = `${text.age / 4 >= 1 ? `${(text.age / 4).toFixed(0)}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}/S${text?.slotNow}`;
        return age;
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br />Pnow<br />(kg)</>} />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`
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
    {
      title: <FormattedMessage id='pages.searchTable.column.refundVs' defaultMessage={<>Trả lại Vs</>} />,
      dataIndex: 'refundVs',
      valueType: 'textarea',
      key: 'refundVs',
      render: (_, text: any) => {
        return <Checkbox disabled checked={text?.checkRefund}></Checkbox>
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
        width='90vh'
      >

        <ProTable
          headerTitle={(<>
            Danh sách CPass bệnh chết
          </>)}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={
            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            const data = await customAPIGet({}, 'c-passes/get/cpass-sick-or-death');
            console.log(data);
            return data;
          }}
          toolBarRender={() => [
            <>
              {selectedRowsCPass.length >= 1 && (<Button
                type='primary'
                key='primary'
                onClick={() => {
                  console.log(selectedRowsCPass)
                  setShowConfirmSettlement(true);


                }}
              >
                <PlusOutlined /> <FormattedMessage id='pages.searchTable.add' defaultMessage='Đăng kí' />
              </Button>)}
            </>
          ]}
          columns={columnCPass}

          rowSelection={{
            onChange: (_, selectedRows: any) => {
              setSelectedRowsCPass(selectedRows);
            },
          }}
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

        {
          selectedRowsCPass.length >= 1 && (
            <ConfirmRegisteringSettlementSickOrDead
              openModal={showConfirmSettlement}
              cPass={selectedRowsCPass}
              onCloseModal={() => {
                setShowConfirmSettlement(false);
                
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            />
          )
        }

      </ModalForm>
    </>
  );
};

export default TableListRegisteringSettlement;


