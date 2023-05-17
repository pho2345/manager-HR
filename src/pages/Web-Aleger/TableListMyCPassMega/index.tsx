import {  customAPIGetOne } from '@/services/ant-design-pro/api';
import {  ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link, useIntl, useParams } from '@umijs/max';
import { Avatar, Tooltip, Typography } from 'antd';
import React, { useRef } from 'react';
import moment from 'moment';
import { MdOutlineHistory } from 'react-icons/md';
const { Text } = Typography;
import configText from '@/locales/configText';
import { ReloadOutlined } from '@ant-design/icons';
const configDefaultText = configText;


const TableList: React.FC = () => {
  const intl = useIntl();
  const params = useParams<number>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: <FormattedMessage id='pages.searchTable.column.fairand' defaultMessage={(<> Đợt mở bán<br />Ngày hết hạn hợp tác</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'fair',
      render: (_, text: any) => {
        return (<>
          {text?.fair?.code}
          <br /> {moment(text?.fair?.dateEndFeed).add(new Date().getTimezoneOffset() / -60, 'hour').format('DD/MM/YYYY')}


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
      render: (_, entity: any) => {
        ;
        return (
          <a
            onClick={() => {
              
            }}
          >
            {entity?.code}

          </a>
         
        );
      },
     
      
      
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.farmAndCategory' defaultMessage={(<>Trang trại <br />
        Giống bò<br/>Giới tính</>)} />,
      dataIndex: 'farmAndCategory',
      valueType: 'textarea',
      key: 'farmAndCategory',
      render: (_, text: any) => {
        let sex = 'Đực';
        if (text?.cow?.sex === 'female') {
          sex = 'Cái';
        }
        return (<>
          {text?.cow?.farm?.name}<br />
          {`${text?.cow?.category?.name}`}
          <br/>
          {sex}
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
      title: 'P0(kg)/Pnow@Snow (kg)',
      dataIndex: 'P0andPnow',
      valueType: 'textarea',
      key: 'P0andPnow',
      render: (_, text: any) => {
        return `${text?.pZero}/${text?.nowWeight}@${text?.slotNow?.indexSlot}`
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.bodyCondition' defaultMessage='Thể trạng' />,
      dataIndex: 'bodyCondition',
      valueType: 'textarea',
      key: 'bodyCondition',
      render: (_, text: any) => {
        return (<Text style={{ color: text?.colorBodyCondition?.color }}>{text?.colorBodyCondition?.name}</Text>);
          
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
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={(<>MegaP (kg)<br/>MegaE (VNĐ)<br />MegaCPR</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      width: 120,
      key: 'megaP',
      align:'center',
      render: (_, text: any) => {
        return (<>
        {text?.megaP || 0} <br/>
        {text?.megaE.toLocaleString() || 0} <br/>
        {text?.megaCPR || 0}%
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
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaPAndProduce' defaultMessage={(<>MegaDelta<br />ProduceAle<br />History</>)} />,
      dataIndex: 'megaDeltaProduce',
      valueType: 'textarea',
      key: 'megaDeltaProduce',
      align: 'center',
      render: (_, text: any) => {
        let id = text?.id;
        if(text?.checkHistory){
          id = text?.cPassId;
        }
        
        return (<>
          {text?.megaDeltaWeight} <br />
          {text?.produceAle} <br />
          <Tooltip title="Lịch sử"> <Link to={`/cpasses/history-slot/` + id}><MdOutlineHistory style={{
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
        return (<Text style={{ color: text?.colorStatusOwner?.color }}>{text?.colorStatusOwner?.name}</Text>);
      }
    },

    {
      title: (<>Trạng thái giao dịch</>) ,
      dataIndex: 'statusTransaction',
      valueType: 'textarea',
      key: 'statusTransaction',
      render: (_, text: any) => {
       return (<>
        <Text style={{ color: text?.colorStatusTransaction?.color }}>{text?.colorStatusTransaction?.name}</Text><br/>
        <Text style={{ color: text?.colorSettlement?.color }}>{text?.colorSettlement?.name}</Text>
       </>);
      }
    },
  ];

  return (
    <PageContainer
        onBack={() => window.history.back()}
    >
      <ProTable
        rowKey='id'
        search={false}

       actionRef={actionRef}
        request={ async() => {
            const data = await customAPIGetOne(params?.id, 'c-passes/get/my-c-pass-mega', {});
            return {
              data:data,
              success: true,
              total: data?.length
            }
        }}
        columns={columns}

        pagination={{
          locale: {
           next_page: 'Trang sau',
           prev_page: 'Trang trước',
          },
          showTotal: (total, range) => {
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

        toolbar={{
          settings: [{
            key: 'reload',
            tooltip: configDefaultText['reload'],
            icon: <ReloadOutlined />,
            onClick: () => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }]
        }}
      />
      

    
    </PageContainer>

  );
};

export default TableList;
