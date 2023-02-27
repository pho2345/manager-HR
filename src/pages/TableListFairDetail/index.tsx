import { customAPIGetOne, customAPIUpdateMany } from '@/services/ant-design-pro/api';
import { ConsoleSqlOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionType, FooterToolbar, ProColumns, ProDescriptions } from '@ant-design/pro-components';
import {

  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl, useParams } from '@umijs/max';
import { Button, Checkbox, Drawer, Input, message, Modal, Image } from 'antd';
import { Typography } from 'antd';
import React, { useRef, useState } from 'react';
const { Text, } = Typography;
import moment from 'moment';
import "./styles.css";
import DetailUser from '../components/DetailUser';
import DetailCPass from '../components/DetailCPass';


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

const ListImage = (image: any) => {
  return image?.length !== 0 ? (<>
    {image?.map((e: any, index: number) => (<Image
      key={index}
      width={100}
      src={SERVERURL + e.url}
    />
    ))}
  </>) : null
}






const TableListFairDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<number[]>([]);
  const [image, setImage] = useState<any>();

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
        let age = `${text.age / 4 >= 1 ? `${text.age / 4}Th` : ''} ${text.age % 4 !== 0 ? (text.age % 4) + 'T' : ''}`;
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

 


  return (
    <>
      <Text>{`Đợt mở bán: ${fair?.code}`}</Text>
      <Text>{`Ngày mở bán: ${fair?.timeStart ? `${moment(fair?.timeStart).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''} `}</Text>
      <Text>{`Ngày đóng bán: ${fair?.timeEnd ? `${moment(fair?.timeEnd).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''}`}</Text>
      <Text>{`Ngày bắt đầu nuôi: ${fair?.dateStartFeed ? `${moment(fair?.dateStartFeed).add(new Date().getTimezoneOffset() / -60, 'hour').toISOString()}` : ''}`}</Text>
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
      {/* <Drawer
        width={600}
        open={showDetailUser}
        onClose={() => {
          setCurrentRowUser(undefined);
          setShowDetailUser(false);
        }}
        closable={false}
      >
        {currentRowUser && (
          <><ProDescriptions
            column={2}
            title='Thông tin Mega'
            request={async () => {
              console.log('thong tin user');
            const getUser = await customAPIGetOne(currentRowUser, 'users/find-admin');
              //setImage(getCPass?.photos);
              return {
                data: getUser,
                success: true
              }
            }}
            params={{
              id: currentRowUser, 
            }}
            columns={columnDetailUser}
          ></ProDescriptions>
           
          </>
        )
        }
      </Drawer> */}

    </>
  );
};

export default TableListFairDetail;
