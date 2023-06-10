import { customAPIGetOne, customAPIPost } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
import { FormattedMessage, useParams, useSearchParams } from '@umijs/max';
import React, { useRef, useState } from 'react';

// const getCPass = async (id: number) => {
//   const fetchCPass = await customAPIGetOne(id, 'c-passes', {});
//   return fetchCPass?.data;
// }


const TableList: React.FC = () => {
  //const [cPass, setCPass] = useState<any>();
  const actionRef = useRef<ActionType>();
  const params = useParams<any>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchDataCPass = async () => {
  //     const getCPassData = await getCPass(params?.id);
  //     setCPass(getCPassData)
  //   }
  //   fetchDataCPass();
  // }, []);

  console.log(searchParams.get('fair'));

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.slotAndTime' defaultMessage='Slot' />,
      dataIndex: 'slotAndTime',
      valueType: 'textarea',
      key: 'slotAndTime',
      render: (_, record: any) => {
        
        return (<>
          {record?.textSlot}
        </>)
        return `${record?.slots}`;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaOwner' defaultMessage='PA hợp tác' />,
      dataIndex: 'megaOwner',
      valueType: 'textarea',
      key: 'megaOwner',
      render: (_, record: any) => {
        return (<>
          {record?.plan?.name}: {record?.plan?.profit}%
        </>)
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightStart' defaultMessage='ΔP (kg)' />,
      dataIndex: 'weightStart',
      valueType: 'textarea',
      key: 'weightStart',
      renderText: (_, record: any) => record?.deltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightEnd' defaultMessage='MegaΔP (kg)' />,
      dataIndex: 'weightEnd',
      valueType: 'textarea',
      key: 'weightEnd',
      renderText: (_, record: any) => record?.megaDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='ProduceAle' />,
      dataIndex: 'deltaWeight',
      valueType: 'textarea',
      key: 'deltaWeight',
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
          const data = await customAPIPost({

          }, 'slots/slot-of-mega', {
            cPassId: params?.id,
            fairId: searchParams.get('fair'),
            owner: searchParams.get('owner')
          });
          return {
            data: data.data,
            success: true,
            total: data?.data.length
          }
        }}
        columns={columns}

      />
    </PageContainer>
  );
};

export default TableList;
