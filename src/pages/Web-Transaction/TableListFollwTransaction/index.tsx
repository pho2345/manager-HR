import DetailCPass from '@/pages/components/DetailCPass';
import DetailFair from '@/pages/components/DetailFair';
import DetailUser from '@/pages/Web-Aleger/components/DetailUser';
import {
  customAPIDowload,
  customAPIPost,
} from '@/services/ant-design-pro/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

// import { FormattedMessage, useIntl } from '@umijs/max';
import moment from 'moment';
import React, {  useRef, useState } from 'react';
import configText from '@/locales/configText';
import { Button } from 'antd';
const configDefaultText = configText;








const TableList: React.FC = () => {
  const [showDetailCPass, setShowDetailCPass] = useState<boolean>(false);
  const [currentRowCPass, setCurrentRowCPass] = useState<any>();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const [currentRowFair, setCurrentRowFair] = useState<any>();
  const [showDetailFair, setShowDetailFair] = useState<boolean>(false);

  const [filterStatus, setFilterStatus] = useState<any>();

  const actionRef = useRef<ActionType>();





  // const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.code' defaultMessage='Code' />,
      title: configDefaultText['page.confirmSettlementVnd.code'],
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
      // title: <FormattedMessage id='pages.searchTable.column.createdAt' defaultMessage='Ngày phát sinh' />,
      title: configDefaultText['page.confirmSettlementVnd.createdAt'],
      dataIndex: 'createdAt',
      valueType: 'textarea',
      key: 'createdAt',
      renderText: (_, text: any) => {
        return moment(text?.createdAt).format('DD/MM/YYYY HH:MM');
      }
    },
    {
      title: configDefaultText['page.confirmSettlementVnd.sender'],
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      render: (_, text: any) => {
        if(text?.sender){
          return (
            <a
            onClick={() => {
              setCurrentRowUser(text?.sender?.id);
              setShowDetailUser(true);
            }}
            >{text?.sender?.fullname || text?.sender?.username} - {text?.sender?.id}</a>
           )
        }
        else {
          return (
            <a
            onClick={() => {
              setCurrentRowUser(text?.sender?.id);
              setShowDetailUser(true);
            }}
            >{text?.receiver?.fullname || text?.receiver?.username} - {text?.receiver?.id}</a>
           )
        }
       
      },
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.fair' defaultMessage='Đợt mở bán' />,
      title: configDefaultText['page.listFair.columns.code'],
      key: 'fair',
      dataIndex: 'fair',
      render: (_, entity: any) => {
        return (
          <a
          onClick={() => {
            setCurrentRowFair(entity.history_c_pass?.fair?.id ? entity.history_c_pass?.fair?.id : entity?.fair?.id);
            setShowDetailFair(true);
          }}
          >{entity.history_c_pass?.fair?.id ? entity.history_c_pass?.fair?.code : entity?.fair?.code}</a>
        );
      },
    },
    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.cpass' defaultMessage='CPass' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.codeCPass'],
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
      // title: <FormattedMessage id='pages.searchTable.column.types' defaultMessage='Loại GD' />,
      title: configDefaultText['page.confirmSettlementVnd.types'],
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
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.method' defaultMessage='PTTT' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.method'],
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
      title: configDefaultText['page.confirmSettlementVnd.reciever'],
      // title: 'Tài khoản đến',
      dataIndex: 'sender',
      valueType: 'textarea',
      key: 'sender',
      renderText: (_, text: any) => null
    },
    {
      // title: (
      //   <FormattedMessage id='pages.searchTable.column.statusTransaction' defaultMessage='Tình trạng' />
      // ),
      title: configDefaultText['page.confirmSettlementVnd.statusTransaction'],
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
      // title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      title: configDefaultText['page.confirmSettlementVnd.priceVnd'],
      dataIndex: 'priceVnd',
      valueType: 'textarea',
      key: 'priceVnd',
      renderText: (_, text: any) => text?.priceVnd.toLocaleString()
    },
    {
      // title: <FormattedMessage id='pages.searchTable.column.priceVnd' defaultMessage='Giá trị(VNĐ)' />,
      title: configDefaultText['page.confirmSettlementVnd.ale'],
      dataIndex: 'ale',
      valueType: 'textarea',
      key: 'ale',
      renderText: (_, text: any) => text?.ale.toLocaleString()
    },
  
   



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
            onClick={async () => {
              await customAPIDowload('transactions/follow/excel');
            }}
          >
            <PlusOutlined /> Excel
          </Button>,

          
        ]}
        request={async () => {
          const data = await customAPIPost(
            {
             
            },
            'transactions/findadmin', {
            fields: ['id', 'code', 'types', 'method', 'status', 'priceVnd', 'c_pass', 'sender', 'createdAt', 'ale'],
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
              qr_ale: true,
              history_c_pass: {
                select: ['id', 'code'],
                populate: {
                  fair: {
                    select: ['code', 'id']
                  }
                }
              },
              fair: {
                select: ['id', 'code']
              }
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
            },
            orderBy: {
              createdAt: 'desc'
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
