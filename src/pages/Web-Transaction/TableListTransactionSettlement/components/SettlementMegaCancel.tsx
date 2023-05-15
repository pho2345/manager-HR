import { customAPIGetOne } from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns } from '@ant-design/pro-components';
import {
  ProTable,
} from '@ant-design/pro-components';

import {
  FormattedMessage,
  // useParams 
}
  from '@umijs/max';
import { Button, Typography, Space, Input } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import ConfirmRegisteringSettlement from './ConfirmSettlementMegaCancel';

import configText from '@/locales/configText';
const configDefaultText = configText;

// import DetailCPass from '../components/DetailCPass';
// import DetailUser from '../components/DetailUser';
const { Text, } = Typography;


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





export type SettlementCPassModal = {
  onCloseModal: () => void;
  // onSubmit: () => Promise<void>;
  openModal: boolean;
  userId: number;
  //values: Partial<API.RuleListItem>;
}

export type userSettlement = {
  id: number,
  username: string,
  phone: string,
  fullname: string,
  email: string,
  passport: string,
  avaiLimitCPassSettlement: number,
  avaiCPassSettlement: number
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



  //const params = useParams<any>();
  const [userSettlement, setUserSettlement] = useState<userSettlement>();

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
    onFilter: (value: any, record: any) => {
      if (record[dataIndex]) {
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


  // const confirm = (entity: any, message: string, api: string, id: any) => {
  //   Modal.confirm({
  //     title: 'Confirm',
  //     icon: <ExclamationCircleOutlined />,
  //     content: message,
  //     okText: 'Có',
  //     cancelText: 'Không',
  //     onOk: async () => {

  //       await handleUpdateMany({
  //         ...entity
  //       }, api, id);
  //       if (actionRef.current) {
  //         actionRef.current.reload();
  //       }
  //     }
  //   });
  // };


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
      // title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      title: configDefaultText['page.settlementMegaCancel.column.cPass'],
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

    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.ageAndSlot' defaultMessage={<>Tuổi/Snow</>} />,
      title: configDefaultText['page.settlementMegaCancel.column.ageAndSlot'],
      dataIndex: 'ageAndSlot',
      valueType: 'textarea',
      key: 'ageAndSlot',
      renderText: (_, text: any) => {
        let age = `${text.age / 4 >= 1 ? `${(text.age / 4).toFixed(0)}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}/S${text?.slotNow}`;
        return age;
      },
    },

    {
      // title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      title: configDefaultText['page.settlementMegaCancel.column.bodyCondition'],
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
      // title: <FormattedMessage id='pages.searchTable.column.wgePercent' defaultMessage={<>Hiệu quả<br/>tăng trọng</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.wgePercentOne']}<br />{configDefaultText['page.listSettlement.column.wgePercentTwo']} </>),
      dataIndex: 'wgePercent',
      valueType: 'textarea',
      key: 'wgePercent',
      renderText: (_, text: any) => text?.wgePercent
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage={<>Tăng trọng<br/>trung bình<br/>(kg/Tuần)</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.awgAvgOne']}<br />{configDefaultText['page.listSettlement.column.awgAvgTwo']} <br /> {configDefaultText['page.listSettlement.column.awgAvgThree']} </>),
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      renderText: (_, text: any) => text?.awgAvg
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage={<>P0<br/>Pnow<br/>(kg)</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.pZero']}<br />{configDefaultText['page.listSettlement.column.pNow']} </>),
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => `${text?.pZero}/${text?.nowWeight}`
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage={<>MegaΔP(kg)<br/>ProduceAle</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.megaDeltaP']}<br />{configDefaultText['page.settlementDeadOrSick.column.produceAle']} </>),
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => `${text?.megaDeltaWeight}/${text?.produceAle}`
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={<>MegaP (kg)</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.megaP']} </>),
      dataIndex: 'megaP',
      valueType: 'textarea',
      key: 'megaP',
      renderText: (_, text: any) => text?.megaP
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage={<>MegaE (VNĐ)</>} />,
      title: (<>{configDefaultText['page.listSettlement.column.megaE']} </>),
      dataIndex: 'megaE',
      valueType: 'textarea',
      key: 'megaE',
      renderText: (_, text: any) => text?.megaE.toLocaleString()
    },

  ];


  function renderTableAlert(selectedRowKeys: any) {
    return (
      <Fragment>
        Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> mục&nbsp;&nbsp;
      </Fragment>
    );
  }


  function renderTableAlertOption(onCleanSelected: any) {
    return (
      <>
        <Fragment>
        <Button onClick={async () => {
            //  await confirm(selectedRows as any, 'xóa', actionRef);
            onCleanSelected()
            // actionRef.current?.reloadAndRest?.();
          }}>Bỏ chọn</Button>
        </Fragment>
      </>
    );
  }

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
        width='100vh'
      >
      


        <ProTable
          headerTitle={<>
          </>}
          actionRef={actionRef}
          rowKey='id'
          search={false}
          rowClassName={
            (entity) => {
              return entity.classColor
            }
          }

          request={async () => {
            const data = await customAPIGetOne(props.userId, 'c-passes/get/cpass-of-mega', {});
            setUserSettlement(data?.user);
            //console.log('usersss', data);

            return {
              data: data?.cPass,
              success: true,
              total: 0
            }
          }}
          toolBarRender={() => [
            <>
              {selectedRowsCPass.length >= 1 && (<Button
                type='primary'
                key='primary'
                onClick={() => {
                  setShowConfirmSettlement(true);
                }}
              >
                <PlusOutlined /> <FormattedMessage id='pages.searchTable.add' defaultMessage='Đăng kí' />
              </Button>)}
            </>
          ]}

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
          columns={columnCPass}
          rowSelection={{
            onChange: (_, selectedRows: any) => {
              setSelectedRowsCPass(selectedRows);
            },
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

          tableAlertRender={({ selectedRowKeys }: any) => {
            return renderTableAlert(selectedRowKeys);
          }}
  
          tableAlertOptionRender={({  onCleanSelected }: any) => {
            return renderTableAlertOption( onCleanSelected)
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
            <ConfirmRegisteringSettlement
              openModal={showConfirmSettlement}
              cPass={selectedRowsCPass}
              userId={userSettlement?.id}
              onCloseModal={() => {
                setShowConfirmSettlement(false);
                if (actionRef.current) {
                  actionRef.current?.reloadAndRest?.();
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


