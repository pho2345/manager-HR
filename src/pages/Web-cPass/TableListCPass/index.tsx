import { customAPIDowload, customAPIDowloadPDF, customAPIGet } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link } from '@umijs/max';
import { Avatar, Button,  Input, Space, Tooltip, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DetailUser from '@/pages/components/DetailUser';
import DetailCPass from '@/pages/AgriGate/TableListCPass/components/DetailCPass';
import { MdOutlineHistory } from 'react-icons/md';
const { Text } = Typography;
import configText from '@/locales/configText';
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


const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const searchInput = useRef(null);
  const [farm, setFarm] = useState<any>();


  useEffect(() => {
    const getValues = async () => {
      let getFarms = await getFarm();
      setFarm(getFarms);
    }
    getValues();
  }, [])


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
      title: <FormattedMessage id='pages.searchTable.column.fairand' defaultMessage={(<> Đợt mở bán<br />Ngày hết hạn hợp tác</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fair',
      render: (_, text: any) => {
        return (<>
          {text?.fair?.code}
          <br /> {moment(text?.fair?.dateEndFeed || text?.dateEndCoop).format('DD/MM/YYYY')}


        </>)
      }
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
          <
          >
            {entity?.code}

          </>

        );
      },
    },
    {
      title: (<>{configDefaultText['page.listCPass.column.farm']}<br />
      {configDefaultText['page.listCPass.column.category']}<br />{configDefaultText['page.listCPass.column.sex']}</>),
      width: 130,
      dataIndex: 'farmAndCategory',
      valueType: 'textarea',
      key: 'farmAndCategory',
      filterSearch: true,
      filters: farm,
      onFilter: (value: any, record: any) => {
        return record?.cow?.farm?.id === value;
      },
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {text?.cow?.farm?.name}<br />
          {text?.cow?.category?.name}<br />{sex}
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
      title: 'P0/Pnow@Snow',
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.pZero}/${text?.nowWeight}@${text?.slotNow?.indexSlot || 0}`
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        console.log(text?.colorBodyCondition);
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
      filters: true,
      onFilter: true,
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
      title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage='Hiệu quả tăng trọng' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => `${text?.wgePercent}%`
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng TB(kg/tuần)' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
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
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={(<>MegaP (kg)<br/>MegaE (VNĐ)<br />MegaCPR</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      width: 120,
      align: 'center',
      render: (_, text: any) => {
        return (<>
        { text?.megaP || 0 }<br/>
        {text?.megaE.toLocaleString() || 0} <br/>
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
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaPAndProduce' defaultMessage={(<>MegaΔP<br />ProduceAle<br />History</>)} />,
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
          <Tooltip title="Lịch sử"> <Link to={`/cpasses/history-slot/${id}?fair=${text?.fair?.id}&history=${text?.checkHistory || false}` }><MdOutlineHistory style={{
            fontSize: '20px'
          }}>
          </MdOutlineHistory></Link></Tooltip>
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.statusOwner' defaultMessage={(<>Tình trạng sở hữu</>)} />,
      dataIndex: 'statusOwner',
      valueType: 'textarea',
      key: 'statusOwner',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorStatusOwner?.color || 'black' }}>{text?.colorStatusOwner?.name}</Text>);
      }

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
      }
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
      }
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
        search={false}
        request={() => customAPIGet({}, 'c-passes/get/c-pass-mega')}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows: any) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined></ReloadOutlined>,
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
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

        toolBarRender={() => {
          return [
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
            // <Tooltip title='Tải lại'><ReloadOutlined style={{fontSize: '100%' }}   key="re"  /></Tooltip>
          ]
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
    </PageContainer>

  );
};

export default TableList;
