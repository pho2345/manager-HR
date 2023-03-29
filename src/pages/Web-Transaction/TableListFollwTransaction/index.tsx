import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/components/DetailUser';
import {
  customAPIPost,
} from '@/services/ant-design-pro/api';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useIntl } from '@umijs/max';
import moment from 'moment';
import React, {  useRef, useState } from 'react';









const TableList: React.FC = () => {
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [filterStatus, setFilterStatus] = useState<any>();

  const actionRef = useRef<ActionType>();





  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      key: 'code',
      dataIndex: 'code',
      render: (_, entity: any) => {
        return (
          <>
            {entity?.code}
          </>
        );
      },
      filters: true,
      filterSearch: true,
      onFilter: true,
      //valueEnum: filterCode
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      }
    },
    {
      title: 'Mega',
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      key: 'fair',
      dataIndex: 'fair',
      render: (_, entity: any) => {
        return (
          <a
          onClick={() => {
            setCurrentRowFair(entity.c_pass?.fair?.id);
            setShowDetailFair(true);
          }}
          >{entity?.c_pass?.fair?.code}</a>
        );
      },
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.cpass' defaultMessage='CPass' />
      ),
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'category',
      render: (_, text: any) => <>
        <a
         onClick={() => {
          setCurrentRowCPass(text?.c_pass?.id);
          setShowDetailCPass(true);
        }}
        >
        {text?.c_pass?.code}
        </a>
      </>,
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.types' defaultMessage='Loại GD' />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'age',
      render: (_, text: any) => {
        switch (text?.types) {
          case 'cpassPayment':
            return (<div >Thanh toán MegaS</div>);

          case 'cpassSettlement':
            return (<div>Thanh quyết toán</div>);

          case 'produceAleExchangePromo':
            return (<div style={{ color: 'cyan' }}>produceAle sang promoAle</div>);

          case 'megaDeltaWeightproduceAle':
            return (<div style={{ color: 'cyan' }}>MegaΔP sang ProduceAle</div>);
      
          case 'aleExchange':
            return (<div style={{ color: 'blue' }}>Chuyển đổi ale</div>);

          case 'refund':
            return (<div style={{ color: 'yellow' }}>Hoàn trả</div>);
          default:
            break;
        }
      },
      filters: true,
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === 'refund') {
          if (record?.status === 'waitRefund') return record;
        }
        if (value === 'settlement') {
          if (record?.types === 'cpassSettlement') return record;
        }
        if (value === 'payment') {
          if (record?.types === 'cpassPayment') return record;
        }
        if(value === 'megaDeltaWeightProduceAle'){
          if (record?.types === 'megaDeltaWeightproduceAle') return record;
        }
      },
      valueEnum: {
        refund: {
          text: 'Hoàn Trả MegaS',
          value: 'refund'
        },
        payment: {
          text: 'Thanh toán MegaS',
          value: 'payment'
        },
        settlement: {
          text: 'Thanh quyết toán',
          value: 'settlement'
        },
        megaDeltaWeightProduceAle: {
          text: 'MegaΔP sang ProduceAle',
          value: 'megaDeltaWeightProduceAle'
        },
      },
    },

    {
      title: (
        <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      ),
      dataIndex: 'method',
      valueType: 'textarea',
      key: 'method',
      renderText: (_, text: any) => text?.method,
      filtered: true,
      onFilter: true,
      valueEnum: {
        ale: {
          text: 'Ale',
          value: 'ale'
        },
        vnd: {
          text: 'VNĐ',
          value: 'vnd'
        }
      },
    },
    {
      title: 'Tài khoản đến',
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => text?.sender?.fullname || text?.sender?.username,
    },
    {
      title: (
        <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      ),
      dataIndex: 'status',
      valueType: 'textarea',
      key: 'status',
      filters: filterStatus,
      onFilter: true,
      filterSearch: true,
     
      render: (_, text: any) => {
        switch (text?.status) {
          case 'waitConfirm':
            return (<div style={{ color: 'cyan' }}>Chờ Mega xác nhận</div>);

          case 'inProgress':
            return (<div style={{ color: 'blue' }}>Chờ xác nhận</div>);

          case 'done':
            return (<div style={{ color: 'green' }}>Hoàn thành</div>);

          case 'cancel':
            return (<div style={{ color: 'red' }}>Đã hủy</div>);

          case 'waitRefund':
            return (<div style={{ color: 'red' }}>Chờ xác nhận hoàn trả</div>);

          default:
            break;
        }
      },
      
      
      
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      renderText: (_, text: any) => text?.priceVnd
    },

   



  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey='id'
        search={false}
        toolBarRender={() => [
         
        ]}
        request={async () => {
          const data = await customAPIPost(
            {
             
            },
            'transactions/findadmin', {
            fields: ['id', 'code', 'types', 'method', 'status', 'priceVnd', 'c_pass', 'sender', 'createdAt'],
            populate: {
              sender: {
                select: ['id', 'username', 'fullname']
              },
              receiver: {
                select: ['id', 'username', 'fullname']
              },
              c_pass: {
                select: ['id', 'code'],
                populate: {
                  fair: {
                    select: ['id', 'code']
                  }
                }
              },
              qr_ale: true
            },
            filters: {
              $and: [
                {
                  types: {
                    $in: ['cpassPayment', 'cpassSettlement', 'megaDeltaWeightproduceAle']
                  }
                },
                // {
                //   status: {
                //     $not: 'cancel'
                //   }
                // }
              ]
            }
          });

         const filter = data?.data.reduce((pre: any, cur: any) =>{
          let element;
          switch (cur?.status) {
            case 'waitConfirm':
              element = {
                text: `Chờ Mega xác nhận`,
                value: 'waitConfirm'
              }
              break;
            case 'inProgress':
              element = {
                text: `Chờ xác nhận`,
                value: 'inProgress'
              }
              break;
  
            case 'done':
              element = {
                text: `Hoàn thành`,
                value: 'done'
              }
              break;
  
            case 'cancel':
              element = {
                text: `Đã hủy`,
                value: 'cancel'
              }
              break;
  
            case 'waitRefund':
              element = {
                text: `Chờ xác nhận hoàn trả`,
                value: 'waitRefund'
              }
              break;

            default:
              break;
          }
          pre.push(element);
          return pre;
         }, []);

         console.log('filter', filter);

         const uniqueArr = filter.filter((item: any, index: any, self: any) => {
          return index === self.findIndex((t: any) => t.value === item.value);
        });
        
        setFilterStatus(uniqueArr);
          return {
            data: data?.data,
            success: true,
            total: data?.data?.length
          }
        }
        }
        columns={columns}
        rowSelection={false}
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

      
    </PageContainer>
  );
};

export default TableList;
