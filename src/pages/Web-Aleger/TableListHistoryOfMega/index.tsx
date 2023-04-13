import {  customAPIPost } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns,  } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  
} from '@ant-design/pro-components';
import configText from '@/locales/configText';
const configDefaultText = configText;
import { FormattedMessage, useParams, useSearchParams } from '@umijs/max';
import { Typography } from 'antd';
import React, { useRef } from 'react';
const {Text} = Typography
const TableList: React.FC = () => {
  //const [cPass, setCPass] = useState<any>();
  const [searchParams] = useSearchParams();
  const actionRef = useRef<ActionType>();
  const params = useParams<any>();
  //const [currentRowUser, setCurrentRowUser] = useState<any>();
  //const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
  
    {
      title: <FormattedMessage id='pages.searchTable.column.slot' defaultMessage='Slot' />,
      dataIndex: 'slotAndTime',
      valueType: 'textarea',
      key: 'slotAndTime',
      render: (_, record: any) => {
       return <>{record?.textSlot}</>;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.plan' defaultMessage='PA hợp tác' />,
      dataIndex: 'megaOwner',
      valueType: 'textarea',
      key: 'megaOwner',
      render: (_, record: any) => {
        //return <Text style={{backgroundColor: record?.plan?.backgroundColor, color: record?.plan?.color}}>{record?.plan?.name}: {record?.plan?.profit}%</Text>;
        return {
          props: {
          style: { background: record?.plan?.backgroundColor },
        },
          children:<Text style={{ color: record?.plan?.color}}>{record?.plan?.name}: {record?.plan?.profit}%</Text>
      }
      }
    },

   

    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='ΔP (kg)' />,
      dataIndex: 'deltaWeight',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, record: any) => record?.deltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.megaDeltaWeight' defaultMessage='MegaΔP (kg)' />,
      dataIndex: 'megaDeltaWeight',
      valueType: 'textarea',
      key: 'megaDeltaWeight',
      render: (_, record: any) => {
        return <Text style={{color: record.transferedProduceAle ? 'gray' : 'black'}}>{record?.megaDeltaWeight}</Text>
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.produceAle' defaultMessage='ProduceAle' />,
      dataIndex: 'produceAle',
      valueType: 'textarea',
      key: 'produceAle',
      renderText: (_, record: any) => record?.produceAle
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={(<>cPass:
          <a
            onClick={() => {
        
             // setCurrentRow(cPass?.id);
             // setShowDetail(true);
            }}
          >
            {/* {cPass?.attributes?.code} */}
          </a>


        </>)}
        actionRef={actionRef}
        rowKey='id'
        search={false}

        request={async () => {
          const cPassId = params?.id;
          const fairId = searchParams.get('fair-id');
          const userId = searchParams.get('user-id');
          const data = await customAPIPost({}, 'slots/slot-of-mega', {
            cPassId,
            fairId,
            ownerId:userId
          });
         
          return data;
        }}
        columns={columns}
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
    </PageContainer>
  );
};

export default TableList;
