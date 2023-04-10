import {  customAPIGetOne } from '@/services/ant-design-pro/api';
import {  ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, Link, useIntl, useParams } from '@umijs/max';
import { Avatar, Button,   Typography } from 'antd';
import React from 'react';
import moment from 'moment';
const { Text } = Typography;



const TableList: React.FC = () => {
  const intl = useIntl();
  const params = useParams<number>();
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
        Giống bò-Giới tính</>)} />,
      width: 200,
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
          {`${text?.cow?.category?.name}-${sex}`}
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
            {text?.cow?.photos?.map((e: any, index: any) => {
              return (
                <Avatar
                  key={index}
                  src={
                    SERVERURL +
                    e?.url
                  }
                />
              );
            })}
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
        let age = `${text?.cow?.age / 4 >= 1 ? `${text?.cow?.age / 4}Th` : ''} ${text?.cow?.age % 4 !== 0 ? (text?.cow?.age % 4) + 'T' : ''}`;
        return age;

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
      title: <FormattedMessage id='pages.searchTable.column.megaP' defaultMessage={(<>MegaP (kg)| MegaE(VNĐ)<br />MegaCPR</>)} />,
      dataIndex: 'atrributes',
      valueType: 'textarea',
      key: 'plan',
      render: (_, text: any) => {
        return (<>
          {`${text?.megaP ? text?.megaP : '-'} | ${text?.megaE}`} <br /> {`${text?.megaCPR}%`}
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
      render: (_, text: any) => {
        let id = text?.id;
        if(text?.checkHistory){
          id = text?.cPassId;
        }
        
        return (<>
          {text?.megaDeltaWeight} <br />
          {text?.produceAle} <br />
          <Button>
            <Link to={`/web-aleger/mega/slot-c-pass/${id}?user-id=${params?.id}&fair-id=${text?.fair?.id}`}>
              HISTORY
            </Link>
          </Button>
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

        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        rowKey='id'
        search={false}

       
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
            console.log(range);
            return `${range[range.length - 1]} / Tổng số: ${total}`
          }
        }}

      />
      

    
    </PageContainer>

  );
};

export default TableList;
