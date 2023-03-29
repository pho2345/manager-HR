import { customAPIGetOne } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';

import moment from 'moment';
import { FormattedMessage, useParams } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import DetailCPass from '../components/DetailCPass';
import DetailUser from '../components/DetailUser';

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

  const [currentRowUser, setCurrentRowUser] = useState<any>();
  const [showDetailUser, setShowDetailUser] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchDataCPass = async () => {
  //     const getCPassData = await getCPass(params?.id);
  //     setCPass(getCPassData)
  //   }
  //   fetchDataCPass();
  // }, []);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: (
        <FormattedMessage
          id='pages.searchTable.column.fair'
          defaultMessage='Đợt mở bán'
        />
      ),
      key: 'fair',
      dataIndex: 'fair',
      render: (_, entity: any) => {
        return (
          <>
            {entity?.fair?.code}</>

        );
      },
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.slotAndTime' defaultMessage='Slot/Thời gian' />,
      dataIndex: 'slotAndTime',
      valueType: 'textarea',
      key: 'slotAndTime',
      render: (_, record: any) => {
        let timeEnd;
        if (moment(record?.timeEnd).isAfter(moment())) {
          timeEnd = `Hiện tại`;
        }
        else {
          timeEnd = moment(record?.timeEnd).format('DD/MM/YYYY');
        }
        return (<>
          {`${record?.slots}`} <br />
          {`(${moment(record?.timeStart).format('DD/MM/YYYY')} ~ ${timeEnd})`}
        </>)
        return `${record?.slots}`;
      }
    },
    {
      title: <FormattedMessage id='pages.searchTable.column.megaOwner' defaultMessage='Mega sở hữu' />,
      dataIndex: 'megaOwner',
      valueType: 'textarea',
      key: 'megaOwner',
      render: (_, record: any) => {
        if (record?.owner) {
          return (
            <a
                onClick={() => {
                  setCurrentRowUser(record.owner.id);
                  setShowDetailUser(true);
                }}
              >
                {`${record?.owner?.fullname ? record?.owner?.fullname : record?.owner?.username} - ${record?.owner.id}`}
              </a>
          );
        }
        return `PLAFORM`;
      }
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightStart' defaultMessage='P đầu (kg)' />,
      dataIndex: 'weightStart',
      valueType: 'textarea',
      key: 'weightStart',
      renderText: (_, record: any) => record?.weightStart
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.weightEnd' defaultMessage='P cuối (kg)' />,
      dataIndex: 'weightEnd',
      valueType: 'textarea',
      key: 'weightEnd',
      renderText: (_, record: any) => record?.weightEnd
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.deltaWeight' defaultMessage='Chênh lệch trọng lượng (kg)' />,
      dataIndex: 'deltaWeight',
      valueType: 'textarea',
      key: 'deltaWeight',
      renderText: (_, record: any) => record?.deltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.totalMegaDeltaWeight' defaultMessage='Tổng chênh lệch trọng lượng Mega(kg)' />,
      dataIndex: 'totalMegaDeltaWeight',
      valueType: 'textarea',
      key: 'totalMegaDeltaWeight',
      renderText: (_, record: any) => record?.totalMegaDeltaWeight
    },

    {
      title: <FormattedMessage id='pages.searchTable.column.totalProduceAle' defaultMessage='Tổng ProduceAle' />,
      dataIndex: 'totalProduceAle',
      valueType: 'textarea',
      key: 'totalProduceAle',
      renderText: (_, record: any) => record?.totalProduceAle
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
          const data = await customAPIGetOne(params?.id, 'accumulation-c-passes/find-admin', {});
          return {
            data: data,
            success: true,
            total: data?.length
          }
        }}
        columns={columns}

      />

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


    </PageContainer>
  );
};

export default TableList;
