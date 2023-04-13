import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIGet,
  customAPIUpdateMany,
  // customAPIDelete,
} from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage } from '@umijs/max';
import { Button, message, Modal, Typography } from 'antd';
import React, { useRef, useState } from 'react';
// import SettlementCPassModal from './components/SettlementMegaCancel';
import SettlementCPassSickOrDeath from './components/SettlementSickOrDeath';
import DialogTransfer from './components/DialogChooseUserSettlement';
const { Text } = Typography;
import configText from '@/locales/configText';
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


// const handleRemove = async (selectedRows: any) => {

//   const hide = message.loading('Đang xóa...');
//   if (!selectedRows) return true;
//   try {
//     const deleteRowss = selectedRows.map((e: any) => {
//       return customAPIDelete(e.id, 'transactions');
//     });

//     await Promise.all(deleteRowss);
//     hide();
//     message.success('Xóa thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Xóa thất bại');
//     return false;
//   }
// };





const TableList: React.FC = () => {
  //const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [showUsers, setShowUsers] = useState<boolean>(false);

 // const [currentUserSettlementCancel, setCurrentUserSettlementCancel] = useState<any>();
 // const [showRegisteringSettlementCancel, setShowRegisteringSettlementCancel] = useState<boolean>(false);


  const [showRegisteringSettlementSickOrDeath, setShowRegisteringSettlementSickOrDeath] = useState<boolean>(false);

  const [filterFair, setFilterFair] = useState<any>();
  //const [filterReason, setFilterReason] = useState<any>();



  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);


  const confirm = (entity: any, message: string, api: string, types: any) => {
    Modal.confirm({
      title: 'Confirm',
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
          actionRef.current.reload();
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
        let age = `${text.age / 4 >= 1 ? `${text.age / 4}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}/S${text?.slotNow}`;
        return age;
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
      title: <>{configDefaultText['page.listSettlement.column.wgePercentOne']}<br/>{configDefaultText['page.listSettlement.column.wgePercentTwo']}</>,
      dataIndex: 'wgePercent',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => text?.wgePercent
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage={<>Tăng trọng<br />trung bình<br />(kg/Tuần)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.awgAvgOne']}<br/> {configDefaultText['page.listSettlement.column.awgAvgTwo']} <br/> {configDefaultText['page.listSettlement.column.awgAvgThree']} </>,
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br />Pnow<br />(kg)</>} />,
      title: <>{configDefaultText['page.listSettlement.column.pZero']}<br/> {configDefaultText['page.listSettlement.column.pNow']} </>,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`
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
      title: <>{configDefaultText['page.listSettlement.column.reasonSettlement']}</>,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'status',
      render: (_, text: any) => {

        return (<div style={{ color: text?.colorStatusTransaction }}>{text?.textStatusTransaction}</div>);


      },
    },
    {
      title: <>{configDefaultText['titleOption']}</>,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {
        let button = [];
        if (entity?.status === 'inProgress') {
          button.push((
            <><Button onClick={() => confirm([entity.id], `Chắc chắn tiến hành thanh quyết toán cho cPass:${entity.cPassCode}`, 'transactions/done', entity.types)}>Settlement</Button>
              <Button onClick={() => confirm([entity.id], `Chắc chắn hủy thanh quyết toán cho cPass:${entity.cPassCode}?`, 'transactions/settlement/cancel', null)}>Delete</Button></>
          ))
        }
        return button
      },
    }
  ];

  return (
    <PageContainer>
      <ProTable
        // headerTitle={intl.formatMessage({
        //   id: 'pages.searchTable.title',
        //   defaultMessage: 'Enquiry form',
        // })}

        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              // handleModalOpen(true);
              setShowUsers(true);
              // setShowRegisteringSettlementCancel(true);
              // setCurrentUserSettlementCancel(8);
            }}
          >
            <PlusOutlined /> {configDefaultText['page.listSettlement.registeringSettlementCancel']}
          </Button>,

          <Button
            type='primary'
            key='primary'
            onClick={() => {
              // handleModalOpen(true);
              setShowRegisteringSettlementSickOrDeath(true);
            }}
          >
            <PlusOutlined />   {configDefaultText['page.listSettlement.registeringSettlementSickOrDeath']}
          </Button>

        ]}
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
        rowSelection={{
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
          getCheckboxProps: record => ({
            disabled: record.status === 'done'
          })
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

        pagination={{
          locale: {
            next_page: configDefaultText['nextPage'],
            prev_page: configDefaultText['prePage'],
          },
          showTotal: (total, range) => {
            console.log(range);
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              {/* <FormattedMessage id='chosen' defaultMessage='Đã chọn' />{' '} */}
              {`${configDefaultText['chosen']} `}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              {/* <FormattedMessage id='Item' defaultMessage='hàng' /> */}
              {configDefaultText['selectedItem']}

            </div>
          }
        >
          {/* <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id='pages.searchTable.batchDeletion'
              defaultMessage='Batch deletion'
            />
          </Button>
           */}
        </FooterToolbar>
      )}

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


      {/* {
        currentUserSettlementCancel && (
          <SettlementCPassModal
            openModal={showRegisteringSettlementCancel}
            userId={currentUserSettlementCancel}
            onCloseModal={() => {
              setCurrentUserSettlementCancel(undefined);
              setShowRegisteringSettlementCancel(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          />)
      } */}

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
