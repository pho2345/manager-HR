import { customAPIPostOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ExclamationCircleOutlined, SearchOutlined, PlusOutlined, LogoutOutlined, RollbackOutlined } from '@ant-design/icons';
import { ActionType, FooterToolbar, ProColumns } from '@ant-design/pro-components';
import {

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useParams } from '@umijs/max';
import { Button, Checkbox, Input, message, Modal, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";
import DetailUser from '@/pages/components/DetailUser';
import DetailCPass from '@/pages/components/DetailCPass';
import TableListAssignCPass from '../TableListAssignCPass';


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
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);

  const [currentCPass, setCurrentCPass] = useState<any>();
  const [showModalMega, setShowModalMega] = useState<boolean>(false);
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
          <Input style={{ width: 188, marginBlockEnd: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: (filtered) => {
        return (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        )
      },
      filterSearch: (input, record) => {
        console.log(input, record);
        // if (input === record?.code) {
        //   return record;
        // }
        return true;
      },
      filters: true,

      onFilter: (value: any, record: any) => {
        if (value === record.code) {
          return record;
        }
        return false;
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farm' defaultMessage='Trang trại' />,
      dataIndex: 'farm',
      valueType: 'textarea',
      key: 'farm',
      renderText: (_, text) => text.farmName ? text.farmName : null


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
        let age = `${text.age / 4 >= 1 ? `${Math.floor(text.age / 4)}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}`;
        return age;

      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
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
        return text?.vs.toLocaleString();
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.vZero' defaultMessage='V0(VNĐ)' />,
      dataIndex: 'vZero',
      valueType: 'textarea',
      key: 'vZero',
      renderText: (_, text: any) => {
        return text?.vZero.toLocaleString();
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaS' defaultMessage='MegaS' />,
      dataIndex: 'megaS',
      valueType: 'textarea',
      key: 'megaS',
      render: (_, text: any) => text?.megaS.toLocaleString()
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.mega' defaultMessage='Mega' />,
      dataIndex: 'mega',
      valueType: 'textarea',
      key: 'mega',
      render: (_, text: any) => {
        if (text.check === 'owner') {
          return (
            <><Checkbox checked disabled > </Checkbox>
              <a
                onClick={() => {
                  setCurrentRowUser(text.owner.id);
                  setShowDetailUser(true);
                }}
              >
                {`${text?.owner?.fullname ? text?.owner?.fullname : text?.owner?.username} - ${text?.owner.id}`}
              </a>

            </>)
        }
        if (text.check === 'order') {
          return (<><Checkbox disabled ></Checkbox>
            <a
              onClick={() => {
                setCurrentRowUser(text.megaOrder.id);
                setShowDetailUser(true);
              }}
            >
              {`${text?.megaOrder.fullname ? text?.megaOrder.fullname : text?.megaOrder.username} - ${text?.megaOrder.id}`}
            </a>
          </>)
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
          return (  <Tooltip title={<FormattedMessage id='pages.searchTable.removeMega' defaultMessage='Loại bỏ Mega khỏi cPass' />} >
            <RollbackOutlined 
               style={{
                fontSize: 20,
                paddingLeft: 5,
                color: 'red'
              }}
            onClick={() => confirm(entity, 'loại bỏ Mega khỏi cPass', 'c-passes/update/removemega', null as any)}/>
            </Tooltip>);
        }

        if (entity.check === 'none') {
          return (<>
            <Tooltip title={<FormattedMessage id='pages.searchTable.assign' defaultMessage='Chỉ định' />} >
              <PlusOutlined
                style={{
                  fontSize: 20,
                  paddingLeft: 5,
                  color: 'blue'
                }}
                onClick={() => {
                  setCurrentCPass(entity.id);
                  setShowModalMega(true)
                }} /></Tooltip>
            <Tooltip title={<FormattedMessage id='pages.searchTable.remove' defaultMessage='Loại bỏ khỏi phiên' />} >
              <LogoutOutlined
               style={{
                fontSize: 20,
                paddingLeft: 5,
                color: 'red'
              }}
              onClick={() => confirm(entity, 'loại bỏ cPass khỏi phiên', 'fairs/remove-cpasses', params.id)} />
            </Tooltip>
          </>);
        }
        return null;
      }
    },
  ];




  return (
    <>
      <Text>{`Đợt mở bán: ${fair?.code}`}</Text>
      <Text>{`Ngày mở bán: ${fair?.timeStart ? `${moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''} `}</Text>
      <Text>{`Ngày đóng bán: ${fair?.timeEnd ? `${moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''}`}</Text>
      <Text>{`Ngày bắt đầu nuôi: ${fair?.dateStartFeed ? `${moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''}`}</Text>
      <br/>
      <ProTable
        headerTitle={(<>Danh sách cPass</>)}
        actionRef={actionRef}
        rowKey='id'
        search={false}
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

          const data = await customAPIPostOne(params.id, 'fairs/cpassoffair', {});
          const { c_passes, ...other } = data;
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
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length} hàng</a>{' '}


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

      {currentRow && (
        <DetailCPass
          openModal={showDetail}
          idCPass={currentRow}
          closeModal={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
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


      {
        currentCPass && (<>
          <TableListAssignCPass
            openModal={showModalMega}
            currentCPass={currentCPass}
            fairId={params?.id}
            onReload={
              () => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }
            onCloseModal={() => {
              setCurrentCPass(undefined);
              setShowModalMega(false);
            }}
          />
        </>)
      }
    </>

  );
};

export default TableListFairDetail;
