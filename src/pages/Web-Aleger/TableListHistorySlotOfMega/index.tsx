import { customAPIDowload, customAPIPost } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import { FormattedMessage, useParams, useSearchParams } from '@umijs/max';
import React, { useRef } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

// const getCPass = async (id: number) => {
//   const fetchCPass = await customAPIGetOne(id, 'c-passes', {});
//   return fetchCPass?.data;
// }


const TableList: React.FC = () => {
  //const [cPass, setCPass] = useState<any>();
  const actionRef = useRef<ActionType>();
  const params = useParams<any>();
  const [searchParams] = useSearchParams();


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

        toolBarRender={() => {
          return [
            // eslint-disable-next-line react/jsx-no-undef
            <Button
              type='primary'
              key='excel'
              onClick={async () => {
                await customAPIDowload('slots/slot-of-mega/excel', null, {
                  cPassId: params?.id,
                  fairId: searchParams.get('fair'),
                  owner: searchParams.get('owner')
                });
              }}
            >
              <PlusOutlined /> Excel
            </Button>,
          ]
        }}
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
