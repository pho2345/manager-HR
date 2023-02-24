import {  customAPIGetOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, FooterToolbar, ProColumns, ProDescriptions, } from '@ant-design/pro-components';
import {

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Button, Checkbox, Drawer, Input, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";


// const handleAdd = async (fields: any) => {

//   fields.timeEnd = moment(fields.timeEnd).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
//   fields.timeStart = moment(fields.timeStart).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
//   fields.dateStartFeed = moment(fields.dateStartFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();
//   fields.dateEndFeed = moment(fields.dateEndFeed).subtract(new Date().getTimezoneOffset() / -60, 'hour').toISOString();

//   const hide = message.loading('Đang thêm...');
//   try {
//     await customAPIAdd({ ...fields }, 'fairs');
//     hide();
//     message.success('Thêm thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Thêm thất bại!');
//     return false;
//   }
// };


// const handleUpdate = async (fields: any, id: any) => {
//   if (fields?.c_passes[0]?.value) {
//     const configCPass = fields?.c_passes.map((e: any) => {
//       return e.value;
//     });
//     fields.c_passes = configCPass;
//   }

//   const hide = message.loading('Đang cập nhật...');
//   try {
//     await customAPIUpdate({
//       ...fields
//     }, 'fairs', id.current);
//     hide();

//     message.success('Cập nhật thành công');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Cập nhật thất bại!');
//     return false;
//   }
// };




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




const TableListFairDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);

  const [fair, setFair] = useState<any>();
  const params = useParams();
  const confirm = (entity: any, message: string, api: string, id: any) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có muốn ${message}?`,
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        await handleUpdateMany({
          cPass: [entity.id]
        }, api, id);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      render: (_, entity: any) => {
        return (
         // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRow(entity.id);
              setShowDetail(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>
        
        );
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input style={{ width: 188, marginBlockEnd: 8, display: 'block' }} />
        </div>
      ),
      filterIcon: (filtered) => {
        return (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        )
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => {
        return `${text.farmName}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss(Kg)' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = (text.age / 4) + 'Th' + (text.age % 4 !== 0 ? (text.age % 4) + 'T' : '');
        return age;
      }
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
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />,
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />,
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS' />,
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      dataIndex: 'mega',
      valueType: 'textarea',
      key: 'mega',
      render: (_, text: any) => {
        if (text.check === 'owner') {
          return (<Checkbox checked disabled >
            {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner.id}`}
          </Checkbox>)
        }
        if (text.check === 'order') {
          return (<Checkbox disabled >
            {`${text?.megaOrder.fullname ? text?.megaOrder.fullname : text?.megaOrder.username} - ${text?.megaOrder.id}`}
          </Checkbox>)
        }
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.titleOption' defaultMessage='Thao tác' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'option',
      render: (_, entity: any) => {

        if (entity.check === 'order') {
          return (<Button onClick={() => confirm(entity, 'loại bỏ Mega khỏi cPass', 'c-passes/update/removemega', null as any)}>Remove Mega </Button>);
        }

        if (entity.check === 'none') {
          return (<>
            <Button onClick={() => confirm(entity, 'loại bỏ cPass khỏi phiên', 'c-passes/update/removemega', null as any)}>Assign Mega </Button>
            <Button onClick={() => confirm(entity, 'loại bỏ cPass khỏi phiên', 'fairs/remove-cpasses', params.id)}>Remove cPass </Button>
          </>);
        }
        return null;
      }
    },
  ];

  const columnsDetail: ProColumns<any>[] = [
    {
      key: 'code',
      dataIndex: 'code',
      title: <FormattedMessage id='pages.searchTable.column.cPass' defaultMessage='Thẻ tai|cPass' />,
      render: (_, entity: any) => {
        return (
         // <Text>{`${entity.code}|${entity.id}`}</Text>
          <a
            onClick={() => {
              setCurrentRow(entity.code);
              setShowDetail(true);
            }}
          >
            {`${entity.code}|${entity.id}`}
          </a>
        
        );
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input style={{ width: 188, marginBlockEnd: 8, display: 'block' }} />
        </div>
      ),
      filterIcon: (filtered) => {
        return (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        )
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fairCode' defaultMessage='Đợt mở bán' />,
      dataIndex: 'fairCode',
      valueType: 'textarea',
      key: 'fairCode',
      renderText: (_, text: any) => text?.fairCode
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.hintName' defaultMessage='Tên gợi nhớ' />,
      dataIndex: 'hintName',
      valueType: 'textarea',
      key: 'hintName',
      renderText: (_, text: any) => {
        return text?.hintName
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.cowName' defaultMessage='Tên' />,
      dataIndex: 'cowName',
      valueType: 'textarea',
      key: 'cowName',
      renderText: (_, text: any) => {
        return text?.cowName
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => {
        return `${text.farmName}`
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.birthdate' defaultMessage='Ngày sinh' />,
      dataIndex: 'birthdate',
      valueType: 'textarea',
      key: 'birthdate',
      renderText: (_, text: any) => {
        return moment(text?.birthdate).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY');
      }

    },

    {
      title: <FormattedMessage id='pages.searchTable.column.firstWeight' defaultMessage='Pss' />,
      dataIndex: 'firstWeight',
      valueType: 'textarea',
      key: 'firstWeight',
      renderText: (_, text: any) => text?.firstWeight
    },
    
    {
      title: <FormattedMessage id='pages.searchTable.column.age' defaultMessage='Tuổi' />,
      dataIndex: 'age',
      valueType: 'textarea',
      key: 'age',
      renderText: (_, text: any) => {
        let age = `${text.cowAge / 4 >= 1 ? `${text.cowAge / 4}Th`: ''} ${text.cowAge % 4 !== 0 ? (text.cowAge % 4) + 'T' : ''}`;
        return age;
      }
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
      title: <FormattedMessage id='pages.searchTable.column.pZero' defaultMessage='P0(kg)' />,
      dataIndex: 'pZero',
      valueType: 'textarea',
      key: 'pZero',
      renderText: (_, text: any) => {
        return text?.pZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vs' defaultMessage='Vs(VNĐ)' />,
      dataIndex: 'vs',
      valueType: 'textarea',
      key: 'vs',
      renderText: (_, text: any) => {
        return text?.vs;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />,
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS' />,
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      renderText: (_, text: any) => text?.megaS
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      dataIndex: 'mega',
      valueType: 'textarea',
      key: 'mega',
      render: (_, text: any) => {
       
        if (text.check === 'owner') {
          return (<Checkbox checked disabled >
            {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner.id}`}
          </Checkbox>)
        }
        if (text.check === 'order') {
          return (<Checkbox disabled >
            {`${text?.megaOrder.fullname ? text?.megaOrder.fullname : text?.megaOrder.username} - ${text?.megaOrder.id}`}
          </Checkbox>)
        }
        return null;
      }
    },

    

    {
      title: <FormattedMessage id='pages.searchTable.column.wge' defaultMessage='Hiệu quả tăng trọng' />,
      dataIndex: 'wge',
      valueType: 'textarea',
      key: 'wge',
      render: (_, text: any) => {
      return  (<Text className={`${text?.wge}`}>{`${text?.wge}-${text?.wgePercent}`}</Text>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.awgAvg' defaultMessage='Tăng trọng trung bình' />,
      dataIndex: 'awgAvg',
      valueType: 'textarea',
      key: 'awgAvg',
      render: (_, text: any) => {
        <Text className={`${text?.awg}`}>{`${text?.awg}-${text?.awgAvg}`}</Text>
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Cân nặng chênh lệch(Kg)' />,
      dataIndex: 'deltaWeight',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, text: any) => {
        return text?.deltaWeight
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.nowWeight' defaultMessage='Cân nặng hiện tại(Kg)' />,
      dataIndex: 'nowWeight',
      valueType: 'textarea',
      key: 'nowWeight',
      renderText: (_, text: any) => {
        return text?.nowWeight
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='Cân nặng Mega được hưởng(Kg)' />,
      dataIndex: 'megaDeltaWeight',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      renderText: (_, text: any) => {
        return text?.megaDeltaWeight
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='produceAle tích lũy' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='produceAle tích lũy' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, text: any) => {
        return text?.produceAle
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaCPR' defaultMessage='Tỷ suất lợi nhuận tích lũy Mega' />,
      dataIndex: 'megaCPR',
      valueType: 'textarea',
      key: 'megaCPR',
      renderText: (_, text: any) => {
        return text?.megaCPR
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaCPR' defaultMessage='Tỷ suất lợi nhuận tích lũy Mega' />,
      dataIndex: 'megaCPR',
      valueType: 'textarea',
      key: 'megaCPR',
      renderText: (_, text: any) => {
        return text?.megaCPR
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeightTransfer' defaultMessage='Số megaDeltaWeight đã chuyễn sang produceAle' />,
      dataIndex: 'megaDeltaWeightTransfer',
      valueType: 'textarea',
      key: 'megaDeltaWeightTransfer',
      renderText: (_, text: any) => {
        return text?.megaDeltaWeightTransfer
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightInStable' defaultMessage='Cân nặng lúc nhập chuồng' />,
      dataIndex: 'weightInStable',
      valueType: 'textarea',
      key: 'weightInStable',
      renderText: (_, text: any) => {
        return text?.weightInStable
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.dateInStable' defaultMessage='Ngày nhập chuồng' />,
      dataIndex: 'dateInStable',
      valueType: 'textarea',
      key: 'dateInStable',
      renderText: (_, text: any) => {
        return text?.dateInStable
      }
    },


    {
      title: <FormattedMessage id='pages.searchTable.column.megaE' defaultMessage='megaE(Vnđ)' />,
      dataIndex: 'megaE',
      valueType: 'textarea',
      key: 'dateInmegaEStable',
      renderText: (_, text: any) => {
        return text?.megaE
      }
    },

    



    {
      title: <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng giao dịch' />,
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      renderText: (_, text: any) => text?.statusTransaction
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.reasonSettlement' defaultMessage='Lý do quyết toán' />,
      dataIndex: 'reasonSettlement',
      valueType: 'textarea',
      key: 'reasonSettlement',
      renderText: (_, text: any) => text?.reasonSettlement
    },




  ];
console.log('fair', fair)
  return (
    <>
      <Text>{`Đợt mở bán: ${fair?.code}`}</Text>
      <Text>{`Ngày mở bán: ${fair?.timeStart ? `${moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : '' } `}</Text>
      <Text>{`Ngày đóng bán: ${fair?.timeEnd ? `${moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : '' }`}</Text>
      <Text>{`Ngày bắt đầu nuôi: ${fair?.dateStartFeed ? `${moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : '' }`}</Text>

      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey='id'
        search={{
          labelWidth: 120,
        }}
        rowClassName={
          (entity) => {
            return entity.classColor
          }
        }
        toolBarRender={() => [
          // <Button
          //   type='primary'
          //   key='primary'
          //   onClick={() => {
          //     //handleModalOpen(true);
          //   }}
          // >
          //   <PlusOutlined /> <FormattedMessage id='pages.searchTable.new' defaultMessage='New' />
          // </Button>,
        ]}
        // request={() => customAPIGet({}, 'banks')}
        request={async () => {

          const data = await customAPIGetOne(params.id, 'fairs/cpassoffair', {});
          console.log('fair', data);
          const {c_passes, ...other} = data;
          setFair({
            ...other
          });
          return {
            data: c_passes,
            success: true,
            total: c_passes.length
          };
        }}
        //dataSource={} 
        columns={columns}
        dataSource={fair?.c_passes}
        rowSelection={{
          onChange: (_, selectedRows: any) => {

             setSelectedRows(selectedRows);
          },
        }}
      />
       {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                <FormattedMessage id='pages.searchTable.chosen' defaultMessage='Chosen' />{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                <FormattedMessage id='pages.searchTable.item' defaultMessage='Item' />
                &nbsp;&nbsp;
                <span>
                  <FormattedMessage
                    id='pages.searchTable.totalServiceCalls'
                    defaultMessage='Total number of service calls'
                  />{' '}
                </span>
              </div>
            }
          >
            <Button
              onClick={async () => {
                //await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              <FormattedMessage
                id='pages.searchTable.batchDeletion'
                defaultMessage='Batch deletion'
              />
            </Button>
            <Button type='primary'>
              <FormattedMessage
                id='pages.searchTable.batchApproval'
                defaultMessage='Batch approval'
              />
            </Button>
          </FooterToolbar>
        )}


    <Drawer
          width={600}
          open={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
          closable={false}
        >
          {currentRow && (
          <> <ProDescriptions
              column={2}
              title={currentRow?.name}
              request={async () => {
               const getCPass = await customAPIGetOne(currentRow, 'c-passes/detailadmin');
                return {
                  data: getCPass,
                  success: true
                }
              }}
              params={{
                id: currentRow?.name,
              }}
              columns={columnsDetail}
            />
            <Button></Button>
            </> 
          ) 
          }
        </Drawer>
    </>
  );
};

export default TableListFairDetail;
