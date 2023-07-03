import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIGet,
  customAPIUpdateMany,
  // customAPIDelete,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage } from '@umijs/max';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Typography } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
// import SettlementCPassModal from './components/SettlementMegaCancel';
import SettlementCPassSickOrDeath from './components/SettlementSickOrDeath';
import DialogTransfer from './components/DialogChooseUserSettlement';
const { Text } = Typography;
import configText from '@/locales/configText';
import moment from 'moment';
const configDefaultText = configText;

const handleUpdateMany = async (fields: any, api: any) => {
  const hide = message.loading('Đang cập nhật...');
  try {

    const updateTransaction = await customAPIUpdateMany(
      { ...fields },
      api,
    );

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


const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showRegisteringSettlementSickOrDeath, setShowRegisteringSettlementSickOrDeath] = useState<boolean>(false);
  const [filterFair, setFilterFair] = useState<any>();





  const handleSearch = (selectedKeys: any, confirm: any) => {
    confirm();
  };
  const handleReset = (clearFilters: any, confirm: any) => {
    clearFilters();
    //setSearchText('');
    confirm({
      closeDropdown: false,
    });
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
          // ref={configDefaultText[]}
          placeholder={`Tìm kiếm`}
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
        onClick={() => {
        }}
      />
    ),
    onFilter: (value: any, record: any) => {
      console.log(dataIndex);
      if (record[dataIndex]) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      if (dataIndex === 'sender') {
        return record?.owner?.name?.toLowerCase().includes(value.toLowerCase()) || record?.owner?.id === value;
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



  const confirm = (entity: any, message: string, api: string, types: any) => {
    Modal.confirm({
      title: configDefaultText['titleConfirm'],
      icon: <ExclamationCircleOutlined />,
      content: message,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdateMany({
          transaction: [...entity],
          types: types
        }, api);
        if (actionRef.current) {
          // actionRef.current.reload();
          actionRef.current?.reloadAndRest?.();

        }
      }
    });
  };






  //const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.cPassCode' defaultMessage='cPass' />,
      title: configDefaultText['page.listSettlement.column.code'],
      key: 'code',
      dataIndex: 'atrributes',
      ...getColumnSearchProps('cPassCode'),
      render: (_, entity: any) => {
        return (
          <a
            onClick={() => {
              setCurrentRowCPass(entity?.cPassId);
              setShowDetailCPass(true);
            }}
          >
            {entity?.cPassCode}
          </a>
        );
      },

    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      title: configDefaultText['page.settlementMegaCancel.column.fair'],
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
      filters: true,
      filterSearch: true,
      onFilter: true,
      valueEnum: filterFair
    },

    {
      // title: (
      //   <>Mega <br />sở hữu</>
      // ),
      title: configDefaultText['page.listSettlement.column.owner'],
      dataIndex: 'owner',
      valueType: 'textarea',
      key: 'owner',
      ...getColumnSearchProps('sender'),
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
      // title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Tuổi/Snow</>} />,
      title: configDefaultText['page.listSettlement.column.ageAndSlot'],
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) => {
        let age = Math.floor(moment(moment()).diff(text?.birthdate, 'days') / 7);
        if (age === 0) {
          return `${age}/S${text?.slotNow}`;
        }
        let confiAge = `${age / 4 >= 1 ? `${Math.floor(age / 4)}Th` : ''} ${age % 4 !== 0 ? (age % 4) + 'T' : ''}`;
        return `${confiAge}/S${text?.slotNow}`;
      },
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      title: configDefaultText['page.addCPassInFair.column.bodyCondition'],
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorBodyCondition }}>{text?.textBodyCondition}</Text>);
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
      // title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage={<>Hiệu quả<br />tăng trọng</>} />,
      title: <>{configDefaultText['page.listSettlement.column.wgePercentOne']}<br />{configDefaultText['page.listSettlement.column.wgePercentTwo']}</>,
      dataIndex: 'wgePercent',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => text?.wgePercent
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage={<>Tăng trọng<br />trung bình<br />(kg/Tuần)</>} />,
      // title: <>{configDefaultText['page.listSettlement.column.awgAvgOne']}<br /> {configDefaultText['page.listSettlement.column.awgAvgTwo']} <br /> {configDefaultText['page.listSettlement.column.awgAvgThree']} </>,
      title: 'TTTB (kg/Tuần)',
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br />Pnow<br />(kg)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.pZero']}<br /> {configDefaultText['page.listSettlement.column.pNow']} </>,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage={<>MegaΔP(kg)<br />ProduceAle</>} />,
      title: <>{configDefaultText['page.listSettlement.column.megaDeltaP']}<br /> {configDefaultText['page.DetailAleger.column.produceAle']} </>,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      align: 'center',
      render: (_, text: any) => (<>{text?.megaDeltaWeight}
        <br />
        {text?.produceAle}</>)
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
      renderText: (_, text: any) => text?.megaE.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.reasonSettlement' defaultMessage={<>Lý do</>} />,
      title: <>{configDefaultText['page.listSettlement.column.reasonSettlement']}</>,
      dataIndex: 'reasonSettlement',
      valueType: 'textarea',
      key: 'reasonSettlement',
      render: (_, text: any) => {

        return (<Text style={{ color: `${text?.colorTextReason}` }}>{text.textReason}</Text>);

      }
    },

    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.status' defaultMessage='Trạng thái' />
      // ),
      title: <>{configDefaultText['page.listSettlement.column.status']}</>,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'status',
      render: (_, text: any) => {

        return (<div style={{ color: text?.colorStatusTransaction }}>{text?.textStatusTransaction}</div>);

      },
    },

    {
      title: configDefaultText['page.listFair.titleOption'],
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      align: 'center',
      render: (_, entity: any) => {
        const menu = (
          <Menu>

            <Menu.Item key="1"
              onClick={() => confirm([entity.id], `Chắc chắn tiến hành thanh quyết toán cho cPass:${entity.cPassCode}`, 'transactions/done', entity.types)}
            >{configDefaultText['submit']}</Menu.Item>
            <Menu.Item key="2"
              onClick={() => confirm([entity.id], `Chắc chắn hủy thanh quyết toán cho cPass:${entity.cPassCode}?`, 'transactions/settlement/cancel', null)}
            >{configDefaultText['delete']}</Menu.Item>

          </Menu>
        );
        return (
          entity?.status === 'inProgress' ? (<>
            <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
                Thanh quyết toán
              </a>
            </Dropdown>
          </>) : (<></>)
        )
      }
    },
  ];



  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey='id'
        search={false}
        // style={{
        //   width: window.innerWidth
        // }}
        toolBarRender={() => {
          const menu = (
            <Menu>
              <Menu.Item key="1"
                onClick={() => {
                  setShowRegisteringSettlementSickOrDeath(true);
                }}
              >Thanh quyết toán bệnh chết</Menu.Item>
              <Menu.Item key="2"
                onClick={() => {
                  setShowUsers(true);
                }}
              >Thanh quyết toán trước hạn</Menu.Item>
            </Menu>
          );
          return [
            <Dropdown overlay={menu} trigger={['click']} placement='bottom'>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} >
                {configDefaultText['handle']}
              </a>
            </Dropdown>
          ]
        }

        }
        request={async () => {
          const data = await customAPIGet(
            {},
            'transactions/settlement',
          );
          const uniqueNames = [...new Set(data.data.map((item: any) => item.fair))];
          const filterdata = uniqueNames.reduce((obj: any, name: any) => {
            return {
              ...obj,
              [name]: { text: name, value: name }
            };
          }, {});

          setFilterFair(filterdata);
          return data;
        }
        }
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
        tableAlertRender={false}
        tableAlertOptionRender={false}
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
      )
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

      {currentRowFair && (
        <DetailFair
          openModal={showDetailFair}
          fairId={currentRowFair}
          closeModal={() => {
            setCurrentRowFair(undefined);
            setShowDetailFair(false);
          }}
        />
      )
      }


      {
        <DialogTransfer
          openModal={showUsers}
          onCloseModal={() => {
            setShowUsers(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        />
      }



      {
        showRegisteringSettlementSickOrDeath && (
          <SettlementCPassSickOrDeath
            openModal={showRegisteringSettlementSickOrDeath}
            onCloseModal={() => {
              setShowRegisteringSettlementSickOrDeath(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          />

        )
      }
    </PageContainer>
  );
};

export default TableList;
