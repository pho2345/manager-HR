import { customAPIDowload, customAPIDowloadPDF, customAPIGet } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import Chart from './components/Chart';
import { FormattedMessage, Link } from '@umijs/max';
import { Avatar, Button, Input, Space, Tooltip, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DetailUser from '@/pages/components/DetailUser';
import DetailCPass from '@/pages/AgriGate/TableListCPass/components/DetailCPass';
import { MdOutlineHistory } from 'react-icons/md';
const { Text } = Typography;
import configText from '@/locales/configText';
import { BsGraphUpArrow } from 'react-icons/bs';
const configDefaultText = configText;



const getFarm = async () => {
  const farm = await customAPIGet({}, 'farms');
  let data = farm.data.map((e: any) => {
    return {
      value: e?.id,
      label: e?.attributes?.name,
      text: e?.attributes?.name
    };
  });
  return data;
};

const getBodyCondition = async () => {
  const data = await customAPIGet(
    {
    },
    'body-conditions/get/option',
  );
  return data.data
}

const getWGE = async () => {
  const data = await customAPIGet(
    {
    },
    'weight-gain-effects/get/option',
  );
  return data.data
}

const getAWG = async () => {
  const data = await customAPIGet(
    {
    },
    'average-weight-gains/get/option',
  );
  return data.data
}

const getStatusOwner = async () => {
  const data = await customAPIGet(
    {
    },
    'status-owners/get/option',
  );
  return data.data
}

const getStatusTransaction = async () => {
  const data = await customAPIGet(
    {
    },
    'status-transactions/get/option',
  );
  return data.data
}

const getReasonSettlment = async () => {
  const data = await customAPIGet(
    {
    },
    'reason-settlements/get/option',
  );
  return data.data
}


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const refIdCheckHistory = useRef<any>();
  const refIdCpass = useRef<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const searchInput = useRef(null);
  const [farm, setFarm] = useState<any>();


  const [optionBodyCondition, setOptionBodyCondition] = useState<any>([]);
  const [optionFair, setOptionFair] = useState<any>([]);
  const [optionWGE, setOptionWGE] = useState<any>([]);
  const [optionAWG, setOptionAWG] = useState<any>([]);
  const [optionStatusOwner, setOptionStatusOwner] = useState<any>([]);
  const [optionStatusTransaction, setOptionStatusTransaction] = useState<any>([]);
  const [optionReasonSettlement, setOptionReasonSettlement] = useState<any>([]);
  const [openChart, setOpenChart] = useState<boolean>(false);

  const [showDowloadFile, setShowDowloadFile] = useState<boolean>(false);


  // useEffect(() => {
  //   const getValues = async () => {
  //   }
  //   getValues();
  // }, [])

  useEffect(() => {
    const getData = async () => {

      const getOptionBodyCondition = getBodyCondition();
      const getOptionWGE = getWGE();
      const getOptionAWG = getAWG();
      const getOptionStatus = getStatusOwner();
      const getOptionStatusTrasaction = getStatusTransaction();
      const getReasonSettlement = getReasonSettlment();
      const getFarms = getFarm();

      const getAllData = await Promise.all([getOptionBodyCondition, getOptionWGE, getOptionAWG, getOptionStatus, getOptionStatusTrasaction, getReasonSettlement, getFarms]);
      setOptionBodyCondition(getAllData[0]);
      setOptionWGE(getAllData[1]);
      setOptionAWG(getAllData[2]);
      setOptionStatusOwner(getAllData[3]);
      setOptionStatusTransaction(getAllData[4]);
      setOptionReasonSettlement(getAllData[5]);
      setFarm(getAllData[6]);
    }
    getData();
  }, [])


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
      if (dataIndex === 'owner') {
        if (record.owner['phone'] && record.owner['phone'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.owner['phone'].toString().toLowerCase().includes(value.toLowerCase());
        }
        if (record.owner['fullname'] && record.owner['fullname'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.owner['fullname'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record.owner['email'] && record.owner['email'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.owner['email'].toString().toLowerCase().includes(value.toLowerCase());
        }

        if (record.owner['passport'] && record.owner['passport'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.owner['passport'].toString().toLowerCase().includes(value.toLowerCase());
        }
        if (record.owner['id'] && record.owner['id'].toString().toLowerCase().includes(value.toLowerCase())) {
          return record.owner['id'].toString().toLowerCase().includes(value.toLowerCase());
        }
      }
      else {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());

      }
    }
    ,
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text: any) =>{
    // }
  });

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: (<>{configDefaultText['page.listCPass.column.fair']}</>),
      dataIndex: 'fair',
      valueType: 'textarea',
      key: 'fair',
      render: (_, text: any) => {
        return (<>
          {text?.fair?.code}
        </>)
      },
      filters: optionFair,
      onFilter: (value, record) => {
        if (value === record?.fair?.id) {
          return record;
        }
        return null;
      }
    },

    {
      title: (<>{configDefaultText['page.listCPass.column.fairDateEndFeed']}</>),
      dataIndex: 'fairDateEndFeed',
      valueType: 'textarea',
      key: 'fairDateEndFeed',
      render: (_, text: any) => {
        return (<>
          {moment(text?.fair?.dateEndFeed || text?.dateEndCoop).format('DD/MM/YYYY')}
        </>)
      },
    },
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.code'
          defaultMessage='Mã'
        />
      ),
      key: 'code',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('code'),
      render: (_, entity: any) => {
        ;
        return (
          <>
            {entity?.code}
          </>

        );
      },
    },


    {
      title: (<>{configDefaultText['page.listCPass.column.category']}</>),
      width: 130,
      dataIndex: 'category',
      valueType: 'textarea',
      key: 'category',
      render: (_, text: any) => {
        return (<>
          {text?.cow?.category?.name}
        </>)
      }
    },
    {
      title: (<>{configDefaultText['page.listCPass.column.sex']}</>),
      width: 130,
      dataIndex: 'sex',
      valueType: 'textarea',
      key: 'sex',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {sex}
        </>)
      }
    },

    {
      title: (<>{configDefaultText['page.listCPass.column.farm']}</>),
      width: 130,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      filterSearch: true,
      filters: farm,
      onFilter: (value: any, record: any) => {
        return record?.cow?.farm?.id === value;
      },
      render: (_, text: any) => {
        return (<>
          {text?.cow?.farm?.name}<br />
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.image' defaultMessage='Hình' />,
      dataIndex: 'image',
      valueType: 'textarea',
      key: 'image',
      render: (_, text: any) => {
        return (
          <Avatar.Group
            maxCount={2}
            maxPopoverTrigger='click'
            size='large'
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
          >
            {text?.cow?.photos && text?.cow?.photos.length !== 0 ? text?.cow?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
                  }
                />
              );
            }) :
              (<Avatar
                key={'defaultImage'}
                src={
                  'https://aleger-server.process.vn/uploads/cow_Icon2_e7fd247cac.png'
                }
              />)
            }

          </Avatar.Group>
        );
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {

        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        if (age === 0) {
          return `0`;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;

        return confiAge;

      }
    },
    {
      title: (<>
        P0<br />
        Pnow <br />
        Snow
      </>),
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return (<>
          {text?.pZero} <br />
          {text?.nowWeight} <br />
          {text?.slotNow?.indexSlot}

        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        // switch (text?.bodyCondition) {
        //   case 'good':
        //     return (<Text style={{ color: '#00CC00' }}>Tốt</Text>);
        //   case 'malnourished':
        //     return (<Text>Suy dinh dưỡng</Text>);
        //   case 'weak':
        //     return (<Text style={{ color: '#FF9900' }}>Yếu</Text>);
        //   case 'sick':
        //     return (<Text style={{ color: '#FF3333' }}>Bệnh</Text>);
        //   case 'dead':
        //     return (<Text style={{ color: '#FF0000' }}>Chết</Text>)
        //   default:
        //     break;
        // }
        return (<Text style={{ color: text?.colorBodyCondition?.color || 'black' }}>{text?.colorBodyCondition?.name}</Text>);
      },
      filters: optionBodyCondition,
      onFilter: true,
      // valueEnum: {
      //   good: {
      //     text: 'Tốt',
      //     value: 'good'
      //   },
      //   malnourished: {
      //     text: 'Suy dinh dưỡng',
      //     value: 'malnourished'
      //   },
      //   weak: {
      //     text: 'Yếu',
      //     value: 'weak'
      //   },
      //   sick: {
      //     text: 'Bệnh',
      //     value: 'sick'
      //   },
      //   dead: {
      //     text: 'Chết',
      //     value: 'dead'
      //   },
      // },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='HQTT' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`,
      filters: optionWGE,
      onFilter: (value, record) => {
        if (value === record?.colorWge?.id) return record;
        return null;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='TTTB(kg/tuần)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg,
      filters: optionAWG,
      onFilter: (value, record) => {
        if (record.awg === value) {
          return record;
        }
        return null;
      },
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.users_permissions_user' defaultMessage='Mega đang sở hữu' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'users_permissions_user',
      ...getColumnSearchProps('owner'),
      render: (_, text: any) => {
        if (text?.owner?.id && !text.checkHistory) {
          return (<>
            <a
              onClick={() => {
                setCurrentRowUser(text.owner.id);
                setShowDetailUser(true);
              }}
            >
              {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner?.id}`}</a>
          </>)
        } else {
          return null;
        }

      }


    },
    {
      title: (<>MegaP (kg)<br />MegaE (VNĐ)<br />MegaCPR</>),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      width: 120,
      align: 'center',
      render: (_, text: any) => {
        return (<>
          {text?.megaP || 0}<br />
          {text?.megaE.toLocaleString() || 0} <br />
          {text?.megaCPR}%
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.plansCPass' defaultMessage='PAHT' />,
      dataIndex: 'plan',
      valueType: 'textarea',
      key: 'plan',
      renderText: (_, text: any) => text?.plan ? `${text?.plan?.profit}` : null
    },


    {
      title: (<span>MegaΔP<br />ProduceAle<br />History</span>),
      dataIndex: 'megaDeltaProduce',
      valueType: 'textarea',
      key: 'megaDeltaProduce',
      align: 'center',
      render: (_, text: any) => {
        let id = text?.id;
        if (text?.checkHistory) {
          id = text?.cPassId;
        }

        return (<>
          {text?.megaDeltaWeight} <br />
          {text?.produceAle} <br />
          <Tooltip title="Lịch sử"> <Link to={`/cpasses/history-slot/${id}?fair=${text?.fair?.id}&history=${text?.checkHistory || false}`}><MdOutlineHistory style={{
            fontSize: '20px'
          }}>
          </MdOutlineHistory></Link></Tooltip>
        </>)
      }
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.graph' defaultMessage='Graph' />,
      title: configDefaultText['page.listCPass.column.graph'],
      dataIndex: 'graph',
      valueType: 'textarea',
      key: 'graph',
      render: (_, text: any) => {
        return (<>
          <Tooltip title={configDefaultText['page.listCPass.column.graph']}><BsGraphUpArrow
            onClick={() => {
              refIdCpass.current = text?.id;
              refIdCheckHistory.current = text?.checkHistory;
              setOpenChart(true);
            }}
          /></Tooltip>
        </>)

      }
    },

    {
      title: (<>Tình trạng sở hữu</>),
      dataIndex: 'statusOwner',
      valueType: 'textarea',
      key: 'statusOwner',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorStatusOwner?.color || 'black' }}>{text?.colorStatusOwner?.name}</Text>);
      },
      filters: optionStatusOwner,
      defaultFilteredValue: ['open'],
      onFilter: (value, record) => {
        if (record?.colorStatusOwner?.value === value && record?.colorStatusOwner) {
          return record;
        }
        return null;
      },

    },

    {
      title: (<>Trạng thái giao dịch</>),
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      render: (_, text: any) => {
        return (<>
          <Text style={{ color: text?.colorStatusTransaction?.color || 'black' }}>{text?.colorStatusTransaction?.name}</Text>
        </>);
      },
      filters: optionStatusTransaction,
      onFilter: (value, record) => {
        if (record?.colorStatusTransaction?.value === value) {
          return record;
        }
        return null;
      },
    },

    {
      title: (<>Lý do thanh quyết toán</>),
      dataIndex: 'reasonSettlement',
      valueType: 'textarea',
      key: 'reasonSettlement',
      render: (_, text: any) => {
        return (<>
          <Text style={{ color: text?.colorSettlement?.color || 'black' }}>{text?.colorSettlement?.name}</Text>
        </>);
      },
      filters: optionReasonSettlement,
      onFilter: (value, record) => {
        if (record?.colorSettlement?.value === value) {
          return record;
        }
        return null;
      },
    },
  ];


  return (
    <PageContainer
      onBack={() => window.history.back()}
      header={{
        title: configDefaultText['page.cPassMega.page.header']
      }}
    >
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        style={{
          fontSize: 9
        }}
        scroll={{
          x: window.innerWidth * 0.7
        }}
        search={false}
        request={async () => {
          const data = await customAPIGet({}, 'c-passes/get/c-pass-mega');
          console.log(data?.data?.cPass);
          if (data?.data?.cPass && data?.data?.cPass.length > 0) {
            setShowDowloadFile(true);
          }
          else {
            setShowDowloadFile(false)
          }
          setOptionFair(data?.data?.fair);
          return {
            data: data?.data?.cPass,
            success: true,
            total: data?.data?.cPass.length || 0
          };
        }}
        columns={columns}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined></ReloadOutlined>,
            onClick: () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            },
          },
          ],
        }}

        pagination={{
          locale: {
            next_page: 'Trang sau',
            prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

        toolBarRender={() => {
          return showDowloadFile ? [
            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowload('c-passes/get/c-pass-mega/excel');
              }}
            >
              <PlusOutlined /> Excel
            </Button>,




            <Button
              type='primary'
              key='primary'
              onClick={async () => {
                await customAPIDowloadPDF('c-passes/get/c-pass-mega/pdf');
              }}
            >
              <PlusOutlined /> PDF
            </Button>,
          ] : []
        }}
      />

      {currentRowCPass && <DetailCPass
        openModal={showDetailCPass}
        cPassId={currentRowCPass}
        closeModal={() => {
          setShowDetail(false);
          setCurrentRowCPass(undefined);
        }}
      />}

      <DetailUser
        onDetail={showDetailUser}
        currentRowUser={currentRowUser}
        onCloseDetail={() => {
          setCurrentRowUser(undefined);
          setShowDetailUser(false);
        }}
      />

      {
        openChart && <Chart
          openModal={openChart}
          types={refIdCheckHistory.current ? 'history' : 'c-pass'}
          cPassId={refIdCpass.current}
          onClose={() => {
            setOpenChart(false);
          }}
        />
      }
    </PageContainer>

  );
};

export default TableList;
